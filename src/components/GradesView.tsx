import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { motion } from 'motion/react';
import {
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  Award,
  Calculator,
  PenTool,
  Beaker,
  Globe,
  BookText,
  FileText,
  Calendar,
  Edit,
  Eye,
  Users,
  BarChart3,
  Loader2
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsContent, TabsTrigger } from './ui/tabs';
import { useGrades } from '../hooks/useGrades';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const subjectConfig = {
  math: { label: 'Mathématiques', icon: Calculator, color: 'bg-blue-500', emoji: '➕' },
  french: { label: 'Français', icon: PenTool, color: 'bg-purple-500', emoji: '📝' },
  science: { label: 'Sciences', icon: Beaker, color: 'bg-primary', emoji: '🔬' },
  history: { label: 'Histoire', icon: BookText, color: 'bg-warning', emoji: '🏛️' },
  geography: { label: 'Géographie', icon: Globe, color: 'bg-amber-500', emoji: '🌍' },
  english: { label: 'Anglais', icon: FileText, color: 'bg-destructive', emoji: '🇬🇧' }
};

const evaluationTypes = {
  test: { label: 'Contrôle', color: 'bg-destructive', icon: '📝' },
  quiz: { label: 'Interrogation', color: 'bg-warning', icon: '❓' },
  homework: { label: 'Devoir maison', color: 'bg-blue-500', icon: '🏠' },
  project: { label: 'Projet', color: 'bg-purple-500', icon: '📊' },
  oral: { label: 'Oral', color: 'bg-primary', icon: '🗣️' }
};

export function GradesView() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const {
    evaluations,
    grades,
    students,
    loading,
    userClassId,
    createEvaluation,
    saveMultipleGrades,
    getGradeForStudent,
    getGradesForEvaluation
  } = useGrades(selectedClassId || undefined);

  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);
  const [isAddingEvaluation, setIsAddingEvaluation] = useState(false);
  const [editingGrades, setEditingGrades] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'input' | 'overview'>('input');
  const [savingGrades, setSavingGrades] = useState(false);

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

  const filteredEvaluations = evaluations.filter(e => e.subject === selectedSubject);

  const updateGrade = (studentId: string, evaluationId: string, grade: string) => {
    setEditingGrades(prev => ({
      ...prev,
      [`${studentId}-${evaluationId}`]: grade
    }));
  };

  const handleSaveGrades = async () => {
    setSavingGrades(true);
    try {
      const gradesToSave = Object.entries(editingGrades).map(([key, value]) => {
        const [studentId, evaluationId] = key.split('-');
        const numValue = parseFloat(value);
        return {
          evaluationId,
          studentId,
          grade: isNaN(numValue) || value === '' ? null : numValue,
        };
      });

      await saveMultipleGrades(gradesToSave);
      setEditingGrades({});
    } catch (error) {
      console.error('Error saving grades:', error);
    } finally {
      setSavingGrades(false);
    }
  };

  const calculateClassStats = (evaluationId: string) => {
    const evalGrades = getGradesForEvaluation(evaluationId)
      .map(g => g.grade)
      .filter((g): g is number => g !== null && g !== undefined);

    if (evalGrades.length === 0) {
      return { average: null, min: null, max: null, count: 0 };
    }

    const average = evalGrades.reduce((sum, g) => sum + g, 0) / evalGrades.length;
    const min = Math.min(...evalGrades);
    const max = Math.max(...evalGrades);

    return { average, min, max, count: evalGrades.length };
  };

  const calculateStudentAverage = (studentId: string, subject?: string) => {
    const relevantEvals = subject
      ? evaluations.filter(e => e.subject === subject)
      : evaluations;

    let totalPoints = 0;
    let totalCoefficients = 0;

    relevantEvals.forEach(evaluation => {
      const gradeEntry = getGradeForStudent(evaluation.id, studentId);
      if (gradeEntry && gradeEntry.grade !== null) {
        totalPoints += (gradeEntry.grade / evaluation.max_grade) * 20 * evaluation.coefficient;
        totalCoefficients += evaluation.coefficient;
      }
    });

    return totalCoefficients > 0 ? totalPoints / totalCoefficients : null;
  };

  const calculateOverallClassAverage = () => {
    const averages = students
      .map(s => calculateStudentAverage(s.id, selectedSubject))
      .filter((avg): avg is number => avg !== null);

    if (averages.length === 0) return null;
    return averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const NewEvaluationDialog = () => {
    const [newEval, setNewEval] = useState({
      title: '',
      type: 'test' as keyof typeof evaluationTypes,
      date: '',
      max_grade: '20',
      coefficient: '1',
      description: ''
    });
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
      if (!user) {
        toast.error('Utilisateur non connecté');
        return;
      }

      const effectiveClassId = selectedClassId || userClassId;
      if (!effectiveClassId) {
        toast.error('Veuillez sélectionner une classe');
        return;
      }

      setCreating(true);
      try {
        await createEvaluation({
          title: newEval.title,
          subject: selectedSubject,
          type: newEval.type,
          date: newEval.date,
          max_grade: parseFloat(newEval.max_grade),
          coefficient: parseFloat(newEval.coefficient),
          description: newEval.description || undefined,
          class_id: effectiveClassId,
          teacher_id: user.id,
          teacher_name: user.name,
        });

        setIsAddingEvaluation(false);
        setNewEval({
          title: '',
          type: 'test',
          date: '',
          max_grade: '20',
          coefficient: '1',
          description: ''
        });
      } catch (error) {
        console.error('Error creating evaluation:', error);
      } finally {
        setCreating(false);
      }
    };

    return (
      <Dialog open={isAddingEvaluation} onOpenChange={setIsAddingEvaluation}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle évaluation</DialogTitle>
            <DialogDescription>
              Créez une nouvelle évaluation pour votre classe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre de l'évaluation</Label>
              <Input
                value={newEval.title}
                onChange={(e) => setNewEval({ ...newEval, title: e.target.value })}
                placeholder="Ex: Contrôle Chapitres 1-3"
                className="rounded-xl mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type d'évaluation</Label>
                <Select value={newEval.type} onValueChange={(v: any) => setNewEval({ ...newEval, type: v })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(evaluationTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.icon} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newEval.date}
                  onChange={(e) => setNewEval({ ...newEval, date: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Note maximale</Label>
                <Input
                  type="number"
                  value={newEval.max_grade}
                  onChange={(e) => setNewEval({ ...newEval, max_grade: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Coefficient</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={newEval.coefficient}
                  onChange={(e) => setNewEval({ ...newEval, coefficient: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Description (optionnelle)</Label>
              <Textarea
                value={newEval.description}
                onChange={(e) => setNewEval({ ...newEval, description: e.target.value })}
                placeholder="Détails sur l'évaluation..."
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingEvaluation(false)}
                className="rounded-xl"
                disabled={creating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreate}
                className="rounded-xl bg-gradient-to-br from-primary to-secondary"
                disabled={!newEval.title || !newEval.date || creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer l'évaluation
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const GradeInputView = () => {
    if (!selectedEvaluation) {
      return (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <Edit className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3>Sélectionnez une évaluation</h3>
          <p className="text-muted-foreground mt-2">
            Choisissez une évaluation pour saisir les notes
          </p>
        </div>
      );
    }

    const evaluation = evaluations.find(e => e.id === selectedEvaluation)!;
    const stats = calculateClassStats(selectedEvaluation);

    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-white/50 rounded-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${evaluationTypes[evaluation.type as keyof typeof evaluationTypes].color} text-white border-0`}>
                  {evaluationTypes[evaluation.type as keyof typeof evaluationTypes].icon} {evaluationTypes[evaluation.type as keyof typeof evaluationTypes].label}
                </Badge>
                <Badge variant="outline">Coef. {evaluation.coefficient}</Badge>
              </div>
              <h3 className="mb-1">{evaluation.title}</h3>
              <p className="text-sm text-muted-foreground">{evaluation.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                {new Date(evaluation.date).toLocaleDateString('fr-FR')}
              </div>
              <p className="text-sm">Note sur {evaluation.max_grade}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Notes saisies</p>
              <p className="text-xl font-bold text-primary">{stats.count}/{students.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Moyenne classe</p>
              <p className="text-xl font-bold">
                {stats.average !== null ? stats.average.toFixed(2) : '-'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Note max</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <p className="text-xl font-bold text-success">
                  {stats.max !== null ? stats.max.toFixed(2) : '-'}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Note min</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <p className="text-xl font-bold text-destructive">
                  {stats.min !== null ? stats.min.toFixed(2) : '-'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4>Saisie des notes</h4>
            <Button
              onClick={handleSaveGrades}
              disabled={Object.keys(editingGrades).length === 0 || savingGrades}
              className="rounded-xl bg-success"
            >
              {savingGrades ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {students.map((student, index) => {
              const gradeEntry = getGradeForStudent(selectedEvaluation, student.id);
              const editKey = `${student.id}-${selectedEvaluation}`;
              const displayGrade = editingGrades[editKey] !== undefined
                ? editingGrades[editKey]
                : gradeEntry?.grade?.toString() || '';

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Moyenne générale: {calculateStudentAverage(student.id, selectedSubject)?.toFixed(2) || '-'}/20
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max={evaluation.max_grade}
                        value={displayGrade}
                        onChange={(e) => updateGrade(student.id, selectedEvaluation, e.target.value)}
                        placeholder="Note"
                        className="w-24 rounded-xl text-center"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        /{evaluation.max_grade}
                      </span>
                    </div>
                    {gradeEntry?.grade !== null && gradeEntry?.grade !== undefined && (
                      <Badge className={`${getGradeColor(gradeEntry.grade, evaluation.max_grade)} bg-transparent border-0`}>
                        {((gradeEntry.grade / evaluation.max_grade) * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  const OverviewView = () => {
    const classAverage = calculateOverallClassAverage();
    const studentAverages = students
      .map(s => ({
        student: s,
        average: calculateStudentAverage(s.id, selectedSubject)
      }))
      .filter(item => item.average !== null)
      .sort((a, b) => b.average! - a.average!);

    const bestStudent = studentAverages[0];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Moyenne de la classe</p>
            <p className="text-3xl font-bold">{classAverage?.toFixed(2) || '-'}/20</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-success/20 to-success/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-success" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Meilleure moyenne</p>
            <p className="text-3xl font-bold text-success">{bestStudent?.average?.toFixed(2) || '-'}/20</p>
            {bestStudent && (
              <p className="text-xs text-muted-foreground mt-1">{bestStudent.student.name}</p>
            )}
          </Card>

          <Card className="p-6 bg-gradient-to-br from-warning/20 to-warning/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Élèves en difficulté</p>
            <p className="text-3xl font-bold text-warning">
              {studentAverages.filter(s => s.average! < 10).length}
            </p>
          </Card>
        </div>

        <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
          <h4 className="mb-4">Classement général - {subjectConfig[selectedSubject as keyof typeof subjectConfig].label}</h4>

          <div className="space-y-2">
            {studentAverages.map((item, index) => {
              const percentage = (item.average! / 20) * 100;
              const isTop3 = index < 3;

              return (
                <motion.div
                  key={item.student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl ${
                    isTop3 ? 'bg-gradient-to-r from-warning/20 to-warning/10 border-2 border-warning/30' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isTop3 ? 'bg-warning text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>

                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {item.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium">{item.student.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={percentage} className="h-2 flex-1 max-w-xs" />
                        <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        item.average! >= 16 ? 'text-success' :
                        item.average! >= 12 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {item.average!.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">/20</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    );
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
            <CartoonEmoji type="star" className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2>Notes & Évaluations</h2>
            <p className="text-muted-foreground">
              Sélectionnez une classe pour commencer
            </p>
          </div>
        </div>

        <Card className="p-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Choisissez une classe</p>
              <p className="text-sm text-muted-foreground">
                Vous devez sélectionner une classe pour gérer les évaluations et les notes
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="star" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Notes & Évaluations</h2>
          <p className="text-muted-foreground">
            Saisir et suivre les notes de vos élèves
          </p>
        </div>
        <Button
          onClick={() => setIsAddingEvaluation(true)}
          className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          disabled={!selectedClassId && !userClassId}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle évaluation
        </Button>
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

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-md">
        <Label className="mb-2 block">Matière</Label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="rounded-xl border-2">
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

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="input" className="rounded-xl">
            <Edit className="w-4 h-4 mr-2" />
            Saisie des notes
          </TabsTrigger>
          <TabsTrigger value="overview" className="rounded-xl">
            <Eye className="w-4 h-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h4>Évaluations</h4>
              {filteredEvaluations.length === 0 ? (
                <Card className="p-6 text-center bg-white/70 border-2 border-white/50 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    Aucune évaluation pour cette matière
                  </p>
                </Card>
              ) : (
                filteredEvaluations.map((evaluation) => {
                  const stats = calculateClassStats(evaluation.id);
                  const typeConfig = evaluationTypes[evaluation.type as keyof typeof evaluationTypes];

                  return (
                    <motion.div
                      key={evaluation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`p-4 cursor-pointer transition-all rounded-2xl ${
                          selectedEvaluation === evaluation.id
                            ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg'
                            : 'bg-white/90 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedEvaluation(evaluation.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={`${
                            selectedEvaluation === evaluation.id
                              ? 'bg-white/20 text-white'
                              : typeConfig.color + ' text-white'
                          } border-0`}>
                            {typeConfig.icon}
                          </Badge>
                          <span className="text-xs opacity-70">{new Date(evaluation.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <h4 className={`mb-1 text-sm ${selectedEvaluation === evaluation.id ? 'text-white' : ''}`}>
                          {evaluation.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <span className="opacity-70">Coef. {evaluation.coefficient}</span>
                          <span className="opacity-70">{stats.count}/{students.length}</span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="lg:col-span-3">
              <GradeInputView />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <OverviewView />
        </TabsContent>
      </Tabs>

      <NewEvaluationDialog />
    </div>
  );
}
