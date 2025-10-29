import { useState } from 'react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Loader2,
  Calculator,
  PenTool,
  Beaker,
  Globe,
  Music,
  Palette,
  Edit,
  Trash2,
} from 'lucide-react';
import { useCurriculum } from '../hooks/useCurriculum';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../utils/supabase/client';

const subjectIcons: Record<string, any> = {
  calculator: Calculator,
  book: BookOpen,
  science: Beaker,
  globe: Globe,
  music: Music,
  art: Palette,
};

const subjectColors: Record<string, string> = {
  math: 'from-blue-400 to-blue-500',
  french: 'from-purple-400 to-purple-500',
  science: 'from-green-400 to-green-500',
  geography: 'from-amber-400 to-amber-500',
  history: 'from-red-400 to-red-500',
  english: 'from-pink-400 to-pink-500',
  arabic: 'from-orange-400 to-orange-500',
  music: 'from-indigo-400 to-indigo-500',
  art: 'from-purple-400 to-purple-500',
};

export function CurriculumProgressView() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [topicForm, setTopicForm] = useState({
    title: '',
    description: '',
    week_number: '',
    duration_hours: '',
  });

  const {
    subjects,
    topics,
    loading,
    userClassId,
    createTopic,
    updateTopic,
    deleteTopic,
    updateProgress,
    getTopicsForSubject,
    getProgressForTopic,
    calculateSubjectProgress,
  } = useCurriculum(selectedClassId || undefined);

  useState(() => {
    fetchAvailableClasses();
  });

  useState(() => {
    if (userClassId) {
      setSelectedClassId(userClassId);
    }
  });

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

  const handleAddTopic = async () => {
    if (!selectedSubjectId) {
      toast.error('Veuillez sélectionner une matière');
      return;
    }

    if (!topicForm.title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    try {
      const subjectTopics = getTopicsForSubject(selectedSubjectId);
      await createTopic({
        subject_id: selectedSubjectId,
        title: topicForm.title.trim(),
        description: topicForm.description.trim() || undefined,
        week_number: topicForm.week_number ? parseInt(topicForm.week_number) : undefined,
        duration_hours: topicForm.duration_hours ? parseInt(topicForm.duration_hours) : undefined,
        order_index: subjectTopics.length,
      });

      setIsAddingTopic(false);
      setTopicForm({ title: '', description: '', week_number: '', duration_hours: '' });
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleEditTopic = async () => {
    if (!editingTopic) return;

    try {
      await updateTopic(editingTopic.id, {
        title: topicForm.title.trim(),
        description: topicForm.description.trim() || undefined,
        week_number: topicForm.week_number ? parseInt(topicForm.week_number) : undefined,
        duration_hours: topicForm.duration_hours ? parseInt(topicForm.duration_hours) : undefined,
      });

      setEditingTopic(null);
      setTopicForm({ title: '', description: '', week_number: '', duration_hours: '' });
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) return;

    try {
      await deleteTopic(topicId);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleToggleCompletion = async (topicId: string) => {
    const effectiveClassId = selectedClassId || userClassId;
    if (!effectiveClassId) return;

    const currentProgress = getProgressForTopic(topicId, effectiveClassId);
    const newStatus = currentProgress?.status === 'completed' ? 'not_started' : 'completed';

    try {
      await updateProgress(topicId, effectiveClassId, {
        status: newStatus,
        completion_percentage: newStatus === 'completed' ? 100 : 0,
        completion_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const openEditDialog = (topic: any) => {
    setEditingTopic(topic);
    setTopicForm({
      title: topic.title,
      description: topic.description || '',
      week_number: topic.week_number?.toString() || '',
      duration_hours: topic.duration_hours?.toString() || '',
    });
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
            <h2>Programme de l'année</h2>
            <p className="text-muted-foreground">Sélectionnez une classe pour commencer</p>
          </div>
        </div>

        <Card className="p-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Choisissez une classe</p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une classe pour voir le programme
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

  const effectiveClassId = selectedClassId || userClassId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="book" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Programme de l'année</h2>
          <p className="text-muted-foreground">Suivi des objectifs pédagogiques</p>
        </div>
        {user?.role === 'teacher' && (
          <Button
            onClick={() => setIsAddingTopic(true)}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un sujet
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

      {subjects.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune matière dans le programme</p>
        </Card>
      ) : (
        <Tabs defaultValue={subjects[0]?.id} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {subjects.map((subject) => {
              const IconComponent = subjectIcons[subject.icon || 'book'] || BookOpen;
              const progress = effectiveClassId ? calculateSubjectProgress(subject.id, effectiveClassId) : 0;

              return (
                <TabsTrigger
                  key={subject.id}
                  value={subject.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subjectColors[subject.code] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{subject.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {progress}%
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {subjects.map((subject) => {
            const subjectTopics = getTopicsForSubject(subject.id);
            const progress = effectiveClassId ? calculateSubjectProgress(subject.id, effectiveClassId) : 0;

            return (
              <TabsContent key={subject.id} value={subject.id} className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{subject.name}</h3>
                      {subject.description && (
                        <p className="text-muted-foreground mt-1">{subject.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{progress}%</p>
                      <p className="text-sm text-muted-foreground">Progression</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-3" />
                </Card>

                {subjectTopics.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Circle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun sujet pour cette matière</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {subjectTopics.map((topic) => {
                      const topicProgress = effectiveClassId ? getProgressForTopic(topic.id, effectiveClassId) : undefined;
                      const isCompleted = topicProgress?.status === 'completed';

                      return (
                        <Card
                          key={topic.id}
                          className={`p-4 transition-all ${
                            isCompleted ? 'bg-success/5 border-success' : 'hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => handleToggleCompletion(topic.id)}
                              className="mt-1 flex-shrink-0"
                              disabled={user?.role !== 'teacher'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-success" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className={`font-medium ${isCompleted ? 'text-success' : ''}`}>
                                    {topic.title}
                                  </h4>
                                  {topic.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {topic.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2">
                                    {topic.week_number && (
                                      <Badge variant="secondary" className="text-xs">
                                        Semaine {topic.week_number}
                                      </Badge>
                                    )}
                                    {topic.duration_hours && (
                                      <Badge variant="secondary" className="text-xs">
                                        {topic.duration_hours}h
                                      </Badge>
                                    )}
                                    {isCompleted && topicProgress?.completion_date && (
                                      <Badge className="bg-success text-xs">
                                        Complété le {new Date(topicProgress.completion_date).toLocaleDateString('fr-FR')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {user?.role === 'teacher' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => openEditDialog(topic)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteTopic(topic.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      <Dialog open={isAddingTopic} onOpenChange={setIsAddingTopic}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un sujet</DialogTitle>
            <DialogDescription>
              Ajouter un nouveau sujet au programme
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Matière</Label>
              <Select value={selectedSubjectId || ''} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Titre</Label>
              <Input
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                placeholder="Ex: Les fractions"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                placeholder="Description du sujet"
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Semaine</Label>
                <Input
                  type="number"
                  value={topicForm.week_number}
                  onChange={(e) => setTopicForm({ ...topicForm, week_number: e.target.value })}
                  placeholder="Ex: 5"
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Durée (heures)</Label>
                <Input
                  type="number"
                  value={topicForm.duration_hours}
                  onChange={(e) => setTopicForm({ ...topicForm, duration_hours: e.target.value })}
                  placeholder="Ex: 3"
                  className="rounded-xl mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingTopic(false);
                setTopicForm({ title: '', description: '', week_number: '', duration_hours: '' });
              }}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddTopic}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTopic} onOpenChange={(open) => !open && setEditingTopic(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le sujet</DialogTitle>
            <DialogDescription>
              Modifier les informations du sujet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Semaine</Label>
                <Input
                  type="number"
                  value={topicForm.week_number}
                  onChange={(e) => setTopicForm({ ...topicForm, week_number: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Durée (heures)</Label>
                <Input
                  type="number"
                  value={topicForm.duration_hours}
                  onChange={(e) => setTopicForm({ ...topicForm, duration_hours: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingTopic(null);
                setTopicForm({ title: '', description: '', week_number: '', duration_hours: '' });
              }}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleEditTopic}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
