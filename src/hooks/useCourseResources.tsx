import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface CourseResource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'document' | 'exercise' | 'presentation' | 'link';
  subject: string;
  class_id?: string;
  curriculum_topic_id?: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  file_url?: string;
  file_size_bytes?: number;
  file_mime_type?: string;
  thumbnail_url?: string;
  external_link?: string;
  tags: string[];
  level: string;
  downloads_count: number;
  views_count: number;
  is_public: boolean;
  status: 'active' | 'archived' | 'draft';
  created_at: string;
  updated_at: string;
}

interface ResourceFavorite {
  id: string;
  resource_id: string;
  user_id: string;
  created_at: string;
}

export function useCourseResources(classId?: string) {
  const { user } = useAuth();
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [favorites, setFavorites] = useState<ResourceFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [userClassId, setUserClassId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserClassId();
    }
  }, [user]);

  useEffect(() => {
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId || user?.role === 'admin') {
      fetchAllData(effectiveClassId);
      return subscribeToChanges();
    } else {
      setLoading(false);
    }
  }, [userClassId, classId]);

  const fetchUserClassId = async () => {
    if (!user || classId) return;

    const { data, error } = await supabase
      .from('users')
      .select('class_id')
      .eq('id', user.id)
      .single();

    if (!error && data?.class_id) {
      setUserClassId(data.class_id);
    }
  };

  const fetchAllData = async (effectiveClassId?: string | null) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchResources(effectiveClassId),
        user ? fetchFavorites() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Error fetching resources data:', error);
      toast.error('Erreur lors du chargement des ressources');
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async (effectiveClassId?: string | null) => {
    let query = supabase
      .from('course_resources')
      .select(`
        *,
        users!course_resources_uploaded_by_fkey(name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (effectiveClassId) {
      query = query.or(`class_id.eq.${effectiveClassId},class_id.is.null,is_public.eq.true`);
    } else if (user?.role !== 'admin') {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    const resourcesWithNames = (data || []).map((res: any) => ({
      ...res,
      uploaded_by_name: res.users?.name,
    }));

    setResources(resourcesWithNames);
  };

  const fetchFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('resource_favorites')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    setFavorites(data || []);
  };

  const subscribeToChanges = () => {
    const resourcesChannel = supabase
      .channel('course_resources_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_resources' },
        () => {
          const effectiveClassId = classId || userClassId;
          fetchResources(effectiveClassId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(resourcesChannel);
    };
  };

  const createResource = async (data: Omit<CourseResource, 'id' | 'created_at' | 'updated_at' | 'uploaded_by' | 'downloads_count' | 'views_count'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data: resource, error } = await supabase
      .from('course_resources')
      .insert({
        ...data,
        uploaded_by: user.id,
        downloads_count: 0,
        views_count: 0,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création de la ressource');
      throw error;
    }

    toast.success('Ressource créée avec succès');
    const effectiveClassId = classId || userClassId;
    await fetchResources(effectiveClassId);
    return resource;
  };

  const updateResource = async (id: string, data: Partial<CourseResource>) => {
    const { error } = await supabase
      .from('course_resources')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour de la ressource');
      throw error;
    }

    toast.success('Ressource mise à jour');
    const effectiveClassId = classId || userClassId;
    await fetchResources(effectiveClassId);
  };

  const deleteResource = async (id: string) => {
    const { error } = await supabase
      .from('course_resources')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression de la ressource');
      throw error;
    }

    toast.success('Ressource supprimée');
    const effectiveClassId = classId || userClassId;
    await fetchResources(effectiveClassId);
  };

  const trackDownload = async (resourceId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('resource_downloads')
      .insert({
        resource_id: resourceId,
        user_id: user.id,
      });

    if (error) {
      console.error('Error tracking download:', error);
    }
  };

  const incrementViewsCount = async (resourceId: string) => {
    const { error } = await supabase
      .from('course_resources')
      .update({
        views_count: supabase.raw('views_count + 1'),
        updated_at: new Date().toISOString(),
      })
      .eq('id', resourceId);

    if (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const toggleFavorite = async (resourceId: string) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const existingFavorite = favorites.find(
      f => f.resource_id === resourceId && f.user_id === user.id
    );

    if (existingFavorite) {
      const { error } = await supabase
        .from('resource_favorites')
        .delete()
        .eq('id', existingFavorite.id);

      if (error) {
        toast.error('Erreur lors de la suppression du favori');
        throw error;
      }

      toast.success('Retiré des favoris');
    } else {
      const { error } = await supabase
        .from('resource_favorites')
        .insert({
          resource_id: resourceId,
          user_id: user.id,
        });

      if (error) {
        toast.error('Erreur lors de l\'ajout aux favoris');
        throw error;
      }

      toast.success('Ajouté aux favoris');
    }

    await fetchFavorites();
  };

  const isFavorite = (resourceId: string): boolean => {
    if (!user) return false;
    return favorites.some(f => f.resource_id === resourceId && f.user_id === user.id);
  };

  const getResourcesBySubject = (subject: string): CourseResource[] => {
    return resources.filter(r => r.subject === subject);
  };

  const getResourcesByType = (type: string): CourseResource[] => {
    return resources.filter(r => r.type === type);
  };

  const searchResources = (query: string): CourseResource[] => {
    const lowerQuery = query.toLowerCase();
    return resources.filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const getRecentResources = (limit = 10): CourseResource[] => {
    return resources.slice(0, limit);
  };

  const getPopularResources = (limit = 10): CourseResource[] => {
    return [...resources]
      .sort((a, b) => b.downloads_count - a.downloads_count)
      .slice(0, limit);
  };

  const getFavoriteResources = (): CourseResource[] => {
    if (!user) return [];
    const favoriteIds = favorites.map(f => f.resource_id);
    return resources.filter(r => favoriteIds.includes(r.id));
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return {
    resources,
    favorites,
    loading,
    userClassId,
    createResource,
    updateResource,
    deleteResource,
    trackDownload,
    incrementViewsCount,
    toggleFavorite,
    isFavorite,
    getResourcesBySubject,
    getResourcesByType,
    searchResources,
    getRecentResources,
    getPopularResources,
    getFavoriteResources,
    formatFileSize,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      return fetchAllData(effectiveClassId);
    },
  };
}
