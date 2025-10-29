import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Plus,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  Send,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useClassPhotos } from '../hooks/useClassPhotos';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';

export function ClassPhotosView() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [albumForm, setAlbumForm] = useState({
    title: '',
    description: '',
    event_date: '',
    is_public: false,
  });
  const [photoForm, setPhotoForm] = useState({
    photo_url: '',
    caption: '',
  });

  const {
    albums,
    photos,
    loading,
    userClassId,
    createAlbum,
    deleteAlbum,
    addPhoto,
    deletePhoto,
    toggleLike,
    addComment,
    deleteComment,
    isLiked,
    getPhotosForAlbum,
    getCommentsForPhoto,
  } = useClassPhotos(selectedClassId || undefined);

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

  const handleCreateAlbum = async () => {
    if (!albumForm.title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    const effectiveClassId = selectedClassId || userClassId;
    if (!effectiveClassId) {
      toast.error('Veuillez sélectionner une classe');
      return;
    }

    try {
      await createAlbum({
        title: albumForm.title,
        description: albumForm.description || undefined,
        class_id: effectiveClassId,
        event_date: albumForm.event_date || undefined,
        is_public: albumForm.is_public,
        status: 'active',
      });

      setIsCreatingAlbum(false);
      setAlbumForm({
        title: '',
        description: '',
        event_date: '',
        is_public: false,
      });
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet album et toutes ses photos ?')) return;

    try {
      await deleteAlbum(id);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const handleAddPhoto = async () => {
    if (!photoForm.photo_url.trim()) {
      toast.error('Veuillez entrer une URL de photo');
      return;
    }

    if (!selectedAlbumId) {
      toast.error('Veuillez sélectionner un album');
      return;
    }

    try {
      const albumPhotos = getPhotosForAlbum(selectedAlbumId);
      await addPhoto({
        album_id: selectedAlbumId,
        photo_url: photoForm.photo_url,
        caption: photoForm.caption || undefined,
        order_index: albumPhotos.length,
        status: 'active',
      });

      setIsAddingPhoto(false);
      setPhotoForm({
        photo_url: '',
        caption: '',
      });
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

    try {
      await deletePhoto(id);
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPhoto) return;

    try {
      await addComment(selectedPhoto.id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading || loadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const AlbumCard = ({ album }: { album: any }) => {
    const albumPhotos = getPhotosForAlbum(album.id);
    const coverPhoto = albumPhotos[0]?.photo_url || album.cover_photo_url;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
          <div
            className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer relative group"
            onClick={() => setSelectedAlbumId(album.id)}
          >
            {coverPhoto ? (
              <img
                src={coverPhoto}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-16 h-16 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold line-clamp-1 mb-1">{album.title}</h4>
                {album.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {album.description}
                  </p>
                )}
              </div>
              {user?.role === 'teacher' && album.created_by === user.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAlbum(album.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>{album.photos_count} photo{album.photos_count > 1 ? 's' : ''}</span>
              </div>
              {album.event_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(album.event_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
            {album.is_public && (
              <Badge variant="secondary" className="mt-2 text-xs">
                Public
              </Badge>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  const PhotoGrid = ({ albumId }: { albumId: string }) => {
    const albumPhotos = getPhotosForAlbum(albumId);

    if (albumPhotos.length === 0) {
      return (
        <Card className="p-8 text-center">
          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune photo dans cet album</p>
          {user?.role === 'teacher' && (
            <Button
              onClick={() => {
                setSelectedAlbumId(albumId);
                setIsAddingPhoto(true);
              }}
              className="mt-4 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une photo
            </Button>
          )}
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Photos</h3>
          {user?.role === 'teacher' && (
            <Button
              onClick={() => {
                setSelectedAlbumId(albumId);
                setIsAddingPhoto(true);
              }}
              size="sm"
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.thumbnail_url || photo.photo_url}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2 text-white text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 ${isLiked(photo.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{photo.likes_count}</span>
                    <MessageCircle className="w-4 h-4 ml-2" />
                    <span>{getCommentsForPhoto(photo.id).length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="book" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Photos de classe</h2>
          <p className="text-muted-foreground">Souvenirs et moments partagés</p>
        </div>
        {user?.role === 'teacher' && (
          <Button
            onClick={() => setIsCreatingAlbum(true)}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel album
          </Button>
        )}
      </div>

      {selectedAlbumId ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setSelectedAlbumId(null)}
            className="rounded-xl"
          >
            ← Retour aux albums
          </Button>
          <PhotoGrid albumId={selectedAlbumId} />
        </div>
      ) : albums.length === 0 ? (
        <Card className="p-8 text-center">
          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Aucun album pour le moment</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}

      <Dialog open={isCreatingAlbum} onOpenChange={setIsCreatingAlbum}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nouvel album</DialogTitle>
            <DialogDescription>
              Créer un nouvel album photo pour la classe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={albumForm.title}
                onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                placeholder="Ex: Sortie au musée"
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Description (optionnel)</Label>
              <Textarea
                value={albumForm.description}
                onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                placeholder="Description de l'événement..."
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label>Date de l'événement (optionnel)</Label>
              <Input
                type="date"
                value={albumForm.event_date}
                onChange={(e) => setAlbumForm({ ...albumForm, event_date: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label>Album public</Label>
                <p className="text-xs text-muted-foreground">Visible par tous les utilisateurs</p>
              </div>
              <Switch
                checked={albumForm.is_public}
                onCheckedChange={(checked) => setAlbumForm({ ...albumForm, is_public: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreatingAlbum(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateAlbum}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer l'album
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une photo</DialogTitle>
            <DialogDescription>
              Ajouter une nouvelle photo à l'album
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL de la photo</Label>
              <Input
                value={photoForm.photo_url}
                onChange={(e) => setPhotoForm({ ...photoForm, photo_url: e.target.value })}
                placeholder="https://..."
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Légende (optionnel)</Label>
              <Textarea
                value={photoForm.caption}
                onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                placeholder="Description de la photo..."
                className="rounded-xl mt-1"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingPhoto(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddPhoto}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="rounded-2xl max-w-4xl">
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedPhoto.photo_url}
                  alt={selectedPhoto.caption || 'Photo'}
                  className="w-full rounded-xl max-h-[500px] object-contain bg-black/5"
                />
                {user?.role === 'teacher' && selectedPhoto.uploaded_by === user.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePhoto(selectedPhoto.id)}
                    className="absolute top-2 right-2 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {selectedPhoto.caption && (
                <p className="text-sm text-muted-foreground">{selectedPhoto.caption}</p>
              )}

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className="rounded-xl"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked(selectedPhoto.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {selectedPhoto.likes_count}
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-5 h-5" />
                  <span>{getCommentsForPhoto(selectedPhoto.id).length}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground ml-auto text-xs">
                  <User className="w-4 h-4" />
                  <span>{selectedPhoto.uploaded_by_name}</span>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                <h4 className="font-medium">Commentaires</h4>
                {getCommentsForPhoto(selectedPhoto.id).map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-xl">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {comment.user_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{comment.user_name}</p>
                        {user?.id === comment.user_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteComment(comment.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
