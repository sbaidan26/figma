import { useState } from 'react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Megaphone, Send, Calendar, Eye, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Communication {
  id: number;
  title: string;
  message: string;
  target: 'all' | 'parents' | 'teachers' | 'class';
  targetDetails?: string;
  date: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledDate?: string;
  readCount?: number;
  totalRecipients?: number;
}

export function SchoolCommunicationsView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<'all' | 'parents' | 'teachers' | 'class'>('all');

  const [communications] = useState<Communication[]>([
    {
      id: 1,
      title: 'Réunion parents-professeurs',
      message: 'La réunion annuelle se tiendra le 15 novembre à 18h. Votre présence est importante.',
      target: 'parents',
      date: '2024-10-15',
      status: 'sent',
      readCount: 45,
      totalRecipients: 50,
    },
    {
      id: 2,
      title: 'Sortie scolaire au musée',
      message: 'Les classes CM2-A et CM2-B visiteront le Musée d\'Histoire Naturelle le 20 novembre.',
      target: 'class',
      targetDetails: 'CM2-A, CM2-B',
      date: '2024-10-18',
      status: 'sent',
      readCount: 38,
      totalRecipients: 48,
    },
    {
      id: 3,
      title: 'Formation pédagogique',
      message: 'Session de formation sur les nouvelles méthodes d\'enseignement le 25 octobre.',
      target: 'teachers',
      date: '2024-10-20',
      status: 'scheduled',
      scheduledDate: '2024-10-20',
      totalRecipients: 15,
    },
    {
      id: 4,
      title: 'Vacances de la Toussaint',
      message: 'L\'école sera fermée du 28 octobre au 5 novembre. Bonnes vacances à tous !',
      target: 'all',
      date: '2024-10-19',
      status: 'draft',
      totalRecipients: 250,
    },
  ]);

  const handleCreateCommunication = () => {
    toast.success('Communication créée avec succès');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteCommunication = (title: string) => {
    toast.success(`"${title}" a été supprimée`);
  };

  const getStatusBadge = (status: Communication['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-success">Envoyé</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Programmé</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const getTargetIcon = (target: Communication['target']) => {
    switch (target) {
      case 'all':
        return <CartoonEmoji type="school" className="w-5 h-5" />;
      case 'parents':
        return <CartoonEmoji type="heart" className="w-5 h-5" />;
      case 'teachers':
        return <CartoonEmoji type="teacher" className="w-5 h-5" />;
      case 'class':
        return <CartoonEmoji type="student" className="w-5 h-5" />;
    }
  };

  const getTargetLabel = (target: Communication['target'], details?: string) => {
    switch (target) {
      case 'all':
        return 'Toute l\'école';
      case 'parents':
        return 'Tous les parents';
      case 'teachers':
        return 'Tous les enseignants';
      case 'class':
        return details || 'Classes spécifiques';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <CartoonEmoji type="megaphone" className="w-7 h-7" />
          </div>
          <div>
            <h2>Communications école</h2>
            <p className="text-muted-foreground">
              Gérez et envoyez des communications à la communauté scolaire
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Megaphone className="w-5 h-5" />
              Nouvelle communication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer une communication</DialogTitle>
              <DialogDescription>
                Rédigez et programmez une communication pour votre communauté scolaire
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Ex: Réunion parents-professeurs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Rédigez votre message..."
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Destinataires</Label>
                <Select value={selectedTarget} onValueChange={(val) => setSelectedTarget(val as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toute l'école</SelectItem>
                    <SelectItem value="parents">Tous les parents</SelectItem>
                    <SelectItem value="teachers">Tous les enseignants</SelectItem>
                    <SelectItem value="class">Classes spécifiques</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTarget === 'class' && (
                <div className="space-y-2">
                  <Label>Sélectionner les classes</Label>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-xl">
                    {['CM2-A', 'CM2-B', 'CM1-A', 'CE2-B'].map(className => (
                      <div key={className} className="flex items-center space-x-2">
                        <Checkbox id={className} />
                        <Label htmlFor={className} className="cursor-pointer">
                          {className}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="schedule">Programmer l'envoi (optionnel)</Label>
                <Input id="schedule" type="datetime-local" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Enregistrer comme brouillon
              </Button>
              <Button onClick={handleCreateCommunication} className="gap-2">
                <Send className="w-4 h-4" />
                Envoyer maintenant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-100 to-green-150 rounded-2xl p-6 border-2 border-white/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Communications envoyées</p>
              <h3 className="text-3xl">
                {communications.filter(c => c.status === 'sent').length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center">
              <Send className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-150 rounded-2xl p-6 border-2 border-white/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Programmées</p>
              <h3 className="text-3xl">
                {communications.filter(c => c.status === 'scheduled').length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-amber-150 rounded-2xl p-6 border-2 border-white/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 mb-1">Brouillons</p>
              <h3 className="text-3xl">
                {communications.filter(c => c.status === 'draft').length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center">
              <Edit className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Communications List */}
      <div className="space-y-4">
        <h3>Toutes les communications</h3>
        
        {communications.map(comm => (
          <div
            key={comm.id}
            className="bg-white rounded-2xl p-5 border-2 border-border/50 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  {getTargetIcon(comm.target)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4>{comm.title}</h4>
                    {getStatusBadge(comm.status)}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {comm.message}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {getTargetLabel(comm.target, comm.targetDetails)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(comm.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {comm.status === 'sent' && comm.readCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {comm.readCount}/{comm.totalRecipients} lectures
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {comm.status === 'draft' && (
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDeleteCommunication(comm.title)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress bar for sent communications */}
            {comm.status === 'sent' && comm.readCount !== undefined && comm.totalRecipients !== undefined && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Taux de lecture</span>
                  <span className="font-medium">
                    {Math.round((comm.readCount / comm.totalRecipients) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                    style={{ width: `${(comm.readCount / comm.totalRecipients) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
