import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

interface LiaisonCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LiaisonCreateModal({ open, onOpenChange, onSuccess }: LiaisonCreateModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'information' as 'note' | 'information' | 'event' | 'authorization',
    requiresSignature: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      toast.error('Seuls les enseignants et administrateurs peuvent créer des messages');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('liaison_entries')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          type: formData.type,
          created_by: user.id,
          created_by_name: user.name,
          author_role: user.role,
          class_id: user.metadata?.classId || null,
          requires_signature: formData.requiresSignature,
        });

      if (error) throw error;

      toast.success('Message publié avec succès');
      setFormData({
        title: '',
        content: '',
        type: 'information',
        requiresSignature: false,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating liaison entry:', error);
      toast.error('Erreur lors de la publication du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau message - Cahier de liaison</DialogTitle>
          <DialogDescription>
            Créez un nouveau message pour les parents d'élèves
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Titre du message <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex: Sortie scolaire au musée"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de message</Label>
              <Select
                value={formData.type}
                onValueChange={(value: typeof formData.type) =>
                  setFormData({ ...formData, type: value })
                }
                disabled={loading}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="information">Information</SelectItem>
                  <SelectItem value="note">Note importante</SelectItem>
                  <SelectItem value="event">Événement</SelectItem>
                  <SelectItem value="authorization">Autorisation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Contenu du message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Rédigez votre message ici..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                disabled={loading}
                required
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="signature" className="text-base">
                  Signature requise
                </Label>
                <p className="text-sm text-muted-foreground">
                  Les parents devront signer ce message
                </p>
              </div>
              <Switch
                id="signature"
                checked={formData.requiresSignature}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, requiresSignature: checked })
                }
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publication...
                </>
              ) : (
                'Publier le message'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
