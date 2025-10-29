import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  FileText,
  Video,
  Image as ImageIcon,
  File,
  Download,
  Eye,
  Trash2,
  Plus,
  Search,
  Book,
  Calendar,
  Heart,
  ExternalLink,
  Loader2,
  Link as LinkIcon,
  Presentation,
  ClipboardList,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { useCourseResources } from '../hooks/useCourseResources';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';

const typeConfig: Record<string, any> = {
  pdf: { label: 'PDF', icon: FileText, color: 'bg-red-500', emoji: '📄' },
  video: { label: 'Vidéo', icon: Video, color: 'bg-purple-500', emoji: '🎥' },
  image: { label: 'Image', icon: ImageIcon, color: 'bg-blue-500', emoji: '🖼️' },
  document: { label: 'Document', icon: File, color: 'bg-green-500', emoji: '📝' },
  exercise: { label: 'Exercice', icon: ClipboardList, color: 'bg-orange-500', emoji: '✏️' },
  presentation: { label: 'Présentation', icon: Presentation, color: 'bg-pink-500', emoji: '📊' },
  link: { label: 'Lien', icon: LinkIcon, color: 'bg-cyan-500', emoji: '🔗' },
};

const subjectConfig: Record<string, any> = {
  math: { label: 'Mathématiques', emoji: '➕' },
  french: { label: 'Français', emoji: '📝' },
  science: { label: 'Sciences', emoji: '🔬' },
  history: { label: 'Histoire', emoji: '🏛️' },
  geography: { label: 'Géographie', emoji: '🌍' },
  english: { label: 'Anglais', emoji: '🇬🇧' },
  arabic: { label: 'Arabe', emoji: '📚' },
  general: { label: 'Général', emoji: '📖' },
};

export function CourseResourcesView() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreatingResource, setIsCreatingResource] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'pdf' as any,
    subject: 'math',
    external_link: '',
    tags: '',
    is_public: false,
  });

  const {
    resources,
    loading,
    userClassId,
    createResource,
    deleteResource,
    trackDownload,
    incrementViewsCount,
    toggleFavorite,
    isFavorite,
    formatFileSize,
  } = useCourseResources(selectedClassId || undefined);

  useEffect(() => {
    fetchAvailableClasses();
  }, []);

  useEffect(() => {
    if (userClassId) {
      setSelectedClassId(userClassId);
    }
  }, [userClassId]);

  const fetchAvailableClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, level')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setAvailableClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Erreur lors du chargement des classes');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleCreateResource = async () => {
    if (!resourceForm.title.trim() || !resourceForm.description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (resourceForm.type === 'link' && !resourceForm.external_link.trim()) {
      toast.error('Veuillez fournir un lien externe');
      return;
    }

    const effectiveClassId = selectedClassId || userClassId;

    try {
      const tags = resourceForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await createResource({
        title: resourceForm.title,
        description: resourceForm.description,
        type: resourceForm.type,
        subject: resourceForm.subject,
        class_id: effectiveClassId || undefined,
        external_link: resourceForm.external_link || undefined,
        tags,
        level: 'primaire',
        is_public: resourceForm.is_public,
        status: 'active',
      });

      setIsCreatingResource(false);
      setResourceForm({
        title: '',
        description: '',
        type: 'pdf',
        subject: 'math',
        external_link: '',
        tags: '',
        is_public: false,
      });
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) return;

    try {
      await deleteResource(id);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleDownload = async (resource: any) => {
    await trackDownload(resource.id);

    if (resource.external_link) {
      window.open(resource.external_link, '_blank');
    } else if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    } else {
      toast.info('Fichier non disponible');
    }
  };

  const handleView = async (resource: any) => {
    await incrementViewsCount(resource.id);

    if (resource.external_link) {
      window.open(resource.external_link, '_blank');
    } else if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    } else {
      toast.info('Aperçu non disponible');
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || res.subject === selectedSubject;
    const matchesType = selectedType === 'all' || res.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  if (loading || loadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userClassId && availableClasses.length > 0 && !selectedClassId && user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <CartoonEmoji type="book" className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2>Supports de cours</h2>
            <p className="text-muted-foreground">Sélectionnez une classe pour commencer</p>
          </div>
        </div>

        <Card className="p-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Choisissez une classe</p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une classe pour voir les ressources
              </p>
            </div>

            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={selectedClassId || ''} onValueChange={setSelectedClassId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const ResourceCard = ({ resource }: { resource: any }) => {
    const typeInfo = typeConfig[resource.type] || typeConfig.document;
    const TypeIcon = typeInfo.icon;
    const subjectInfo = subjectConfig[resource.subject] || subjectConfig.general;
    const favorite = isFavorite(resource.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-5 hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
          <div className="flex items-start gap-4 mb-3">
            <div className={`${typeInfo.color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
              <TypeIcon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold line-clamp-1 mb-1">{resource.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {typeInfo.emoji} {typeInfo.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {subjectInfo.emoji} {subjectInfo.label}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(resource.id)}
                  className="flex-shrink-0"
                >
                  <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {resource.description}
          </p>

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.slice(0, 3).map((tag: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{resource.downloads_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{resource.views_count}</span>
            </div>
            {resource.file_size_bytes && (
              <div className="flex items-center gap-1">
                <File className="w-3 h-3" />
                <span>{formatFileSize(resource.file_size_bytes)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(resource.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Par {resource.uploaded_by_name || 'Enseignant'}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleView(resource)}
                className="rounded-xl"
              >
                <Eye className="w-3 h-3 mr-1" />
                Voir
              </Button>
              <Button
                size="sm"
                onClick={() => handleDownload(resource)}
                className="rounded-xl bg-gradient-to-br from-primary to-secondary"
              >
                <Download className="w-3 h-3 mr-1" />
                Télécharger
              </Button>
              {user?.role === 'teacher' && resource.uploaded_by === user.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteResource(resource.id)}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="book" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Supports de cours</h2>
          <p className="text-muted-foreground">Ressources pédagogiques et documents</p>
        </div>
        {user?.role === 'teacher' && (
          <Button
            onClick={() => setIsCreatingResource(true)}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle ressource
          </Button>
        )}
      </div>

      {!userClassId && availableClasses.length > 0 && user?.role !== 'admin' && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-md">
          <Label className="mb-2 block">Classe sélectionnée</Label>
          <Select value={selectedClassId || ''} onValueChange={setSelectedClassId}>
            <SelectTrigger className="rounded-xl border-2">
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} - {cls.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une ressource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-48 rounded-xl">
            <SelectValue placeholder="Matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            {Object.entries(subjectConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.emoji} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-48 rounded-xl">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(typeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.emoji} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredResources.length === 0 ? (
        <Card className="p-8 text-center">
          <Book className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune ressource disponible</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <Dialog open={isCreatingResource} onOpenChange={setIsCreatingResource}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle ressource</DialogTitle>
            <DialogDescription>
              Ajouter une nouvelle ressource pédagogique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={resourceForm.title}
                onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                placeholder="Ex: Les fractions - Leçon complète"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={resourceForm.description}
                onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                placeholder="Description de la ressource..."
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={resourceForm.type} onValueChange={(val: any) => setResourceForm({ ...resourceForm, type: val })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Matière</Label>
                <Select value={resourceForm.subject} onValueChange={(val) => setResourceForm({ ...resourceForm, subject: val })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(subjectConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Lien externe (optionnel)</Label>
              <Input
                value={resourceForm.external_link}
                onChange={(e) => setResourceForm({ ...resourceForm, external_link: e.target.value })}
                placeholder="https://..."
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Tags (séparés par des virgules)</Label>
              <Input
                value={resourceForm.tags}
                onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })}
                placeholder="CM2, Chapitre 3, Fractions"
                className="rounded-xl mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label>Ressource publique</Label>
                <p className="text-xs text-muted-foreground">Accessible à tous les utilisateurs</p>
              </div>
              <Switch
                checked={resourceForm.is_public}
                onCheckedChange={(checked) => setResourceForm({ ...resourceForm, is_public: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreatingResource(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateResource}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer la ressource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
