import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Check,
  AlertCircle,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  PenTool,
  Calculator,
  Globe,
  Beaker,
  BookText,
  Loader2,
  Edit,
  Trash2,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useHomework } from '../hooks/useHomework';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';

const subjectConfig: Record<string, any> = {
  math: { label: 'Mathématiques', icon: Calculator, color: 'bg-blue-500', emoji: '➕' },
  french: { label: 'Français', icon: PenTool, color: 'bg-purple-500', emoji: '📝' },
  science: { label: 'Sciences', icon: Beaker, color: 'bg-primary', emoji: '🔬' },
  history: { label: 'Histoire', icon: BookText, color: 'bg-warning', emoji: '🏛️' },
  geography: { label: 'Géographie', icon: Globe, color: 'bg-amber-500', emoji: '🌍' },
  english: { label: 'Anglais', icon: FileText, color: 'bg-destructive', emoji: '🇬🇧' },
  arabic: { label: 'Arabe', icon: BookOpen, color: 'bg-orange-500', emoji: '📚' },
};

const difficultyConfig = {
  easy: { label: 'Facile', color: 'bg-success', textColor: 'text-success' },
  medium: { label: 'Moyen', color: 'bg-warning', textColor: 'text-warning' },
  hard: { label: 'Difficile', color: 'bg-destructive', textColor: 'text-destructive' }
};

export function HomeworkView() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isCreatingHomework, setIsCreatingHomework] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string | null>(null);
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    description: '',
    subject: 'math',
    due_date: '',
    due_time: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    estimated_time_minutes: '30',
  });

  const {
    assignments,
    submissions,
    loading,
    userClassId,
    createAssignment,
    deleteAssignment,
    submitHomework,
    getHomeworkStats,
    getSubmissionForStudent,
  } = useHomework(selectedClassId || undefined);

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

  const handleCreateHomework = async () => {
    if (!homeworkForm.title.trim() || !homeworkForm.description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const effectiveClassId = selectedClassId || userClassId;
    if (!effectiveClassId) {
      toast.error('Veuillez sélectionner une classe');
      return;
    }

    try {
      await createAssignment({
        title: homeworkForm.title,
        description: homeworkForm.description,
        subject: homeworkForm.subject,
        class_id: effectiveClassId,
        due_date: homeworkForm.due_date,
        due_time: homeworkForm.due_time || undefined,
        assigned_date: new Date().toISOString().split('T')[0],
        difficulty: homeworkForm.difficulty,
        estimated_time_minutes: parseInt(homeworkForm.estimated_time_minutes),
        status: 'active',
      });

      setIsCreatingHomework(false);
      setHomeworkForm({
        title: '',
        description: '',
        subject: 'math',
        due_date: '',
        due_time: '',
        difficulty: 'medium',
        estimated_time_minutes: '30',
      });
    } catch (error) {
      console.error('Error creating homework:', error);
    }
  };

  const handleDeleteHomework = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) return;

    try {
      await deleteAssignment(id);
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  const handleSubmitHomework = async (homeworkId: string) => {
    try {
      await submitHomework(homeworkId);
    } catch (error) {
      console.error('Error submitting homework:', error);
    }
  };

  const filteredHomework = assignments.filter(hw => {
    const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hw.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || hw.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const getStatusIcon = (homeworkId: string) => {
    if (!user) return Clock;

    if (user.role === 'student') {
      const submission = getSubmissionForStudent(homeworkId, user.id);
      if (submission?.status === 'submitted' || submission?.status === 'graded') {
        return CheckCircle2;
      }
      return XCircle;
    }

    return Clock;
  };

  const getStatusColor = (homeworkId: string) => {
    if (!user) return 'text-muted-foreground';

    if (user.role === 'student') {
      const submission = getSubmissionForStudent(homeworkId, user.id);
      if (submission?.status === 'submitted' || submission?.status === 'graded') {
        return 'text-success';
      }
      return 'text-destructive';
    }

    return 'text-muted-foreground';
  };

  if (loading || loadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userClassId && availableClasses.length > 0 && !selectedClassId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <CartoonEmoji type="book" className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2>Devoirs</h2>
            <p className="text-muted-foreground">Sélectionnez une classe pour commencer</p>
          </div>
        </div>

        <Card className="p-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Choisissez une classe</p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une classe pour voir les devoirs
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

  const HomeworkCard = ({ homework }: { homework: any }) => {
    const subjectInfo = subjectConfig[homework.subject] || subjectConfig.math;
    const SubjectIcon = subjectInfo.icon;
    const difficultyInfo = difficultyConfig[homework.difficulty];
    const stats = getHomeworkStats(homework.id);
    const StatusIcon = getStatusIcon(homework.id);
    const statusColor = getStatusColor(homework.id);
    const completionRate = stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0;
    const isSubmitted = user?.role === 'student' && getSubmissionForStudent(homework.id, user.id)?.status === 'submitted';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`p-5 hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl ${
          isSubmitted ? 'opacity-75' : ''
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`${subjectInfo.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                <SubjectIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {subjectInfo.emoji} {subjectInfo.label}
                  </Badge>
                  <Badge className={`${difficultyInfo.color} text-white text-xs border-0`}>
                    {difficultyInfo.label}
                  </Badge>
                </div>
                <h4 className="mb-1 line-clamp-1">{homework.title}</h4>
              </div>
            </div>
            <StatusIcon className={`w-6 h-6 ${statusColor} flex-shrink-0 ml-2`} />
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {homework.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">À rendre le</p>
                <p className="font-medium">
                  {new Date(homework.due_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Durée estimée</p>
                <p className="font-medium">{homework.estimated_time_minutes} min</p>
              </div>
            </div>
          </div>

          {user?.role === 'teacher' && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taux de complétion</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{stats.submitted} / {stats.total} élèves</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-3">
            {user?.role === 'student' && !isSubmitted && (
              <Button
                className="flex-1 rounded-xl bg-gradient-to-br from-primary to-secondary"
                onClick={() => handleSubmitHomework(homework.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                Marquer comme fait
              </Button>
            )}

            {user?.role === 'teacher' && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setSelectedHomeworkId(homework.id)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir soumissions
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteHomework(homework.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </>
            )}
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
          <h2>Devoirs</h2>
          <p className="text-muted-foreground">
            {user?.role === 'teacher' ? 'Gestion des devoirs' : 'Mes devoirs à faire'}
          </p>
        </div>
        {user?.role === 'teacher' && (
          <Button
            onClick={() => setIsCreatingHomework(true)}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau devoir
          </Button>
        )}
      </div>

      {!userClassId && availableClasses.length > 0 && (
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
            placeholder="Rechercher un devoir..."
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
      </div>

      {filteredHomework.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Aucun devoir pour le moment</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHomework.map((homework) => (
            <HomeworkCard key={homework.id} homework={homework} />
          ))}
        </div>
      )}

      <Dialog open={isCreatingHomework} onOpenChange={setIsCreatingHomework}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau devoir</DialogTitle>
            <DialogDescription>
              Créer un nouveau devoir pour la classe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={homeworkForm.title}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                placeholder="Ex: Exercices de fractions"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={homeworkForm.description}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                placeholder="Détails du devoir..."
                className="rounded-xl mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Matière</Label>
                <Select value={homeworkForm.subject} onValueChange={(val) => setHomeworkForm({ ...homeworkForm, subject: val })}>
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

              <div>
                <Label>Difficulté</Label>
                <Select value={homeworkForm.difficulty} onValueChange={(val: any) => setHomeworkForm({ ...homeworkForm, difficulty: val })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(difficultyConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date limite</Label>
                <Input
                  type="date"
                  value={homeworkForm.due_date}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, due_date: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Heure limite (optionnel)</Label>
                <Input
                  type="time"
                  value={homeworkForm.due_time}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, due_time: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Durée estimée (minutes)</Label>
              <Input
                type="number"
                value={homeworkForm.estimated_time_minutes}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, estimated_time_minutes: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreatingHomework(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateHomework}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer le devoir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
