import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface PhotoAlbum {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  created_by: string;
  created_by_name?: string;
  event_date?: string;
  cover_photo_url?: string;
  is_public: boolean;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  photos_count?: number;
}

interface ClassPhoto {
  id: string;
  album_id: string;
  photo_url: string;
  thumbnail_url?: string;
  caption?: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  taken_at?: string;
  file_size_bytes?: number;
  width?: number;
  height?: number;
  likes_count: number;
  order_index: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

interface PhotoLike {
  id: string;
  photo_id: string;
  user_id: string;
  created_at: string;
}

interface PhotoComment {
  id: string;
  photo_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export function useClassPhotos(classId?: string) {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [photos, setPhotos] = useState<ClassPhoto[]>([]);
  const [likes, setLikes] = useState<PhotoLike[]>([]);
  const [comments, setComments] = useState<PhotoComment[]>([]);
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
        fetchAlbums(effectiveClassId),
        fetchPhotos(effectiveClassId),
        user ? fetchLikes() : Promise.resolve(),
        fetchComments(effectiveClassId),
      ]);
    } catch (error) {
      console.error('Error fetching photos data:', error);
      toast.error('Erreur lors du chargement des photos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async (effectiveClassId?: string | null) => {
    let query = supabase
      .from('photo_albums')
      .select(`
        *,
        users!photo_albums_created_by_fkey(name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (effectiveClassId) {
      query = query.eq('class_id', effectiveClassId);
    } else if (user?.role !== 'admin') {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    const albumsWithCounts = await Promise.all(
      (data || []).map(async (album: any) => {
        const { count } = await supabase
          .from('class_photos')
          .select('*', { count: 'exact', head: true })
          .eq('album_id', album.id)
          .eq('status', 'active');

        return {
          ...album,
          created_by_name: album.users?.name,
          photos_count: count || 0,
        };
      })
    );

    setAlbums(albumsWithCounts);
  };

  const fetchPhotos = async (effectiveClassId?: string | null) => {
    let query = supabase
      .from('class_photos')
      .select(`
        *,
        users!class_photos_uploaded_by_fkey(name),
        photo_albums!inner(class_id, is_public)
      `)
      .eq('status', 'active')
      .order('order_index', { ascending: true });

    if (effectiveClassId) {
      query = query.eq('photo_albums.class_id', effectiveClassId);
    } else if (user?.role !== 'admin') {
      query = query.eq('photo_albums.is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    const photosWithNames = (data || []).map((photo: any) => ({
      ...photo,
      uploaded_by_name: photo.users?.name,
    }));

    setPhotos(photosWithNames);
  };

  const fetchLikes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('photo_likes')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    setLikes(data || []);
  };

  const fetchComments = async (effectiveClassId?: string | null) => {
    let query = supabase
      .from('photo_comments')
      .select(`
        *,
        users!photo_comments_user_id_fkey(name),
        class_photos!inner(album_id)
      `)
      .order('created_at', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    const commentsWithNames = (data || []).map((comment: any) => ({
      ...comment,
      user_name: comment.users?.name,
    }));

    setComments(commentsWithNames);
  };

  const subscribeToChanges = () => {
    const albumsChannel = supabase
      .channel('photo_albums_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photo_albums' },
        () => {
          const effectiveClassId = classId || userClassId;
          fetchAlbums(effectiveClassId);
        }
      )
      .subscribe();

    const photosChannel = supabase
      .channel('class_photos_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_photos' },
        () => {
          const effectiveClassId = classId || userClassId;
          fetchPhotos(effectiveClassId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(albumsChannel);
      supabase.removeChannel(photosChannel);
    };
  };

  const createAlbum = async (data: Omit<PhotoAlbum, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data: album, error } = await supabase
      .from('photo_albums')
      .insert({
        ...data,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création de l\'album');
      throw error;
    }

    toast.success('Album créé avec succès');
    const effectiveClassId = classId || userClassId;
    await fetchAlbums(effectiveClassId);
    return album;
  };

  const updateAlbum = async (id: string, data: Partial<PhotoAlbum>) => {
    const { error } = await supabase
      .from('photo_albums')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour de l\'album');
      throw error;
    }

    toast.success('Album mis à jour');
    const effectiveClassId = classId || userClassId;
    await fetchAlbums(effectiveClassId);
  };

  const deleteAlbum = async (id: string) => {
    const { error } = await supabase
      .from('photo_albums')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression de l\'album');
      throw error;
    }

    toast.success('Album supprimé');
    const effectiveClassId = classId || userClassId;
    await fetchAlbums(effectiveClassId);
  };

  const addPhoto = async (data: Omit<ClassPhoto, 'id' | 'created_at' | 'updated_at' | 'uploaded_by' | 'likes_count'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data: photo, error } = await supabase
      .from('class_photos')
      .insert({
        ...data,
        uploaded_by: user.id,
        likes_count: 0,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de l\'ajout de la photo');
      throw error;
    }

    toast.success('Photo ajoutée avec succès');
    const effectiveClassId = classId || userClassId;
    await fetchPhotos(effectiveClassId);
    return photo;
  };

  const updatePhoto = async (id: string, data: Partial<ClassPhoto>) => {
    const { error } = await supabase
      .from('class_photos')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour de la photo');
      throw error;
    }

    toast.success('Photo mise à jour');
    const effectiveClassId = classId || userClassId;
    await fetchPhotos(effectiveClassId);
  };

  const deletePhoto = async (id: string) => {
    const { error } = await supabase
      .from('class_photos')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression de la photo');
      throw error;
    }

    toast.success('Photo supprimée');
    const effectiveClassId = classId || userClassId;
    await fetchPhotos(effectiveClassId);
  };

  const toggleLike = async (photoId: string) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const existingLike = likes.find(
      l => l.photo_id === photoId && l.user_id === user.id
    );

    if (existingLike) {
      const { error } = await supabase
        .from('photo_likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) {
        toast.error('Erreur lors de la suppression du like');
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('photo_likes')
        .insert({
          photo_id: photoId,
          user_id: user.id,
        });

      if (error) {
        toast.error('Erreur lors de l\'ajout du like');
        throw error;
      }
    }

    await fetchLikes();
    const effectiveClassId = classId || userClassId;
    await fetchPhotos(effectiveClassId);
  };

  const addComment = async (photoId: string, comment: string) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data, error } = await supabase
      .from('photo_comments')
      .insert({
        photo_id: photoId,
        user_id: user.id,
        comment,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de l\'ajout du commentaire');
      throw error;
    }

    toast.success('Commentaire ajouté');
    const effectiveClassId = classId || userClassId;
    await fetchComments(effectiveClassId);
    return data;
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('photo_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      toast.error('Erreur lors de la suppression du commentaire');
      throw error;
    }

    toast.success('Commentaire supprimé');
    const effectiveClassId = classId || userClassId;
    await fetchComments(effectiveClassId);
  };

  const isLiked = (photoId: string): boolean => {
    if (!user) return false;
    return likes.some(l => l.photo_id === photoId && l.user_id === user.id);
  };

  const getPhotosForAlbum = (albumId: string): ClassPhoto[] => {
    return photos.filter(p => p.album_id === albumId);
  };

  const getCommentsForPhoto = (photoId: string): PhotoComment[] => {
    return comments.filter(c => c.photo_id === photoId);
  };

  const getRecentAlbums = (limit = 5): PhotoAlbum[] => {
    return albums.slice(0, limit);
  };

  return {
    albums,
    photos,
    likes,
    comments,
    loading,
    userClassId,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addPhoto,
    updatePhoto,
    deletePhoto,
    toggleLike,
    addComment,
    deleteComment,
    isLiked,
    getPhotosForAlbum,
    getCommentsForPhoto,
    getRecentAlbums,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      return fetchAllData(effectiveClassId);
    },
  };
}
