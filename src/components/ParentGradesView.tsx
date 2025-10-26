import { useState } from 'react';
import { motion } from 'motion/react';
import { 
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
  BarChart3,
  Target,
  Activity
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { CartoonEmoji } from './CartoonEmoji';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsContent, TabsTrigger } from './ui/tabs';

interface Evaluation {
  id: number;
  title: string;
  subject: 'math' | 'french' | 'science' | 'history' | 'geography' | 'english';
  type: 'test' | 'quiz' | 'homework' | 'project' | 'oral';
  date: string;
  maxGrade: number;
  coefficient: number;
  grade: number | null;
  classAverage: number;
  classMin: number;
  classMax: number;
  comment?: string;
}

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

// Données mockées pour Amira Ben Ahmed
const mockEvaluations: Evaluation[] = [
  {
    id: 1,
    title: "Contrôle Chapitres 1-3",
    subject: 'math',
    type: 'test',
    date: "15 Oct 2025",
    maxGrade: 20,
    coefficient: 3,
    grade: 18,
    classAverage: 15.2,
    classMin: 10,
    classMax: 20,
    comment: "Excellent travail ! Continue ainsi."
  },
  {
    id: 2,
    title: "Interrogation Tables",
    subject: 'math',
    type: 'quiz',
    date: "10 Oct 2025",
    maxGrade: 20,
    coefficient: 1,
    grade: 16,
    classAverage: 15.1,
    classMin: 9,
    classMax: 19
  },
  {
    id: 3,
    title: "Projet Géométrie",
    subject: 'math',
    type: 'project',
    date: "18 Oct 2025",
    maxGrade: 20,
    coefficient: 2,
    grade: 19,
    classAverage: 15.8,
    classMin: 11,
    classMax: 20,
    comment: "Très beau travail de construction !"
  },
  {
    id: 4,
    title: "Devoir Équations",
    subject: 'math',
    type: 'homework',
    date: "12 Oct 2025",
    maxGrade: 20,
    coefficient: 1,
    grade: 17.5,
    classAverage: 14.9,
    classMin: 8,
    classMax: 19
  },
  // Français
  {
    id: 5,
    title: "Dictée préparée n°5",
    subject: 'french',
    type: 'test',
    date: "16 Oct 2025",
    maxGrade: 20,
    coefficient: 2,
    grade: 17,
    classAverage: 14.3,
    classMin: 9,
    classMax: 19,
    comment: "Très bonne orthographe !"
  },
  {
    id: 6,
    title: "Rédaction - Description",
    subject: 'french',
    type: 'homework',
    date: "13 Oct 2025",
    maxGrade: 20,
    coefficient: 3,
    grade: 18.5,
    classAverage: 15.1,
    classMin: 10,
    classMax: 19
  },
  // Sciences
  {
    id: 7,
    title: "Le cycle de l'eau",
    subject: 'science',
    type: 'test',
    date: "14 Oct 2025",
    maxGrade: 20,
    coefficient: 2,
    grade: 19,
    classAverage: 14.8,
    classMin: 9,
    classMax: 20,
    comment: "Parfaite maîtrise du sujet !"
  }
];

interface ParentGradesViewProps {
  studentName?: string;
}

export function ParentGradesView({ studentName = "Amira Ben Ahmed" }: ParentGradesViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredEvaluations = selectedSubject === 'all' 
    ? mockEvaluations 
    : mockEvaluations.filter(e => e.subject === selectedSubject);

  const calculateSubjectAverage = (subject: string) => {
    const subjectEvals = subject === 'all' 
      ? mockEvaluations 
      : mockEvaluations.filter(e => e.subject === subject);
    
    let totalPoints = 0;
    let totalCoefficients = 0;

    subjectEvals.forEach(evaluation => {
      if (evaluation.grade !== null) {
        totalPoints += (evaluation.grade / evaluation.maxGrade) * 20 * evaluation.coefficient;
        totalCoefficients += evaluation.coefficient;
      }
    });

    return totalCoefficients > 0 ? totalPoints / totalCoefficients : null;
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getPerformanceLevel = (studentGrade: number, classAverage: number) => {
    const diff = studentGrade - classAverage;
    if (diff >= 3) return { label: 'Excellent', color: 'bg-success', icon: '🌟' };
    if (diff >= 1) return { label: 'Bon', color: 'bg-primary', icon: '👍' };
    if (diff >= -1) return { label: 'Moyen', color: 'bg-warning', icon: '📊' };
    return { label: 'À améliorer', color: 'bg-destructive', icon: '💪' };
  };

  const subjectAverages = Object.keys(subjectConfig).map(subject => ({
    subject,
    average: calculateSubjectAverage(subject),
    ...subjectConfig[subject as keyof typeof subjectConfig]
  })).filter(s => s.average !== null);

  const generalAverage = calculateSubjectAverage('all');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="star" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Notes & Résultats</h2>
          <p className="text-muted-foreground">
            Suivi scolaire de {studentName}
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Moyenne générale</p>
          <p className="text-3xl font-bold">{generalAverage?.toFixed(2) || '-'}/20</p>
          <Progress value={(generalAverage || 0) * 5} className="mt-3 h-2" />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/20 to-success/10 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-success" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Meilleure note</p>
          <p className="text-3xl font-bold text-success">
            {Math.max(...mockEvaluations.filter(e => e.grade !== null).map(e => e.grade!))}/20
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {mockEvaluations.find(e => e.grade === Math.max(...mockEvaluations.filter(e => e.grade !== null).map(e => e.grade!)))?.title}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-100 to-blue-150 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Notes saisies</p>
          <p className="text-3xl font-bold text-blue-900">
            {mockEvaluations.filter(e => e.grade !== null).length}
          </p>
          <p className="text-xs text-muted-foreground mt-2">évaluations complétées</p>
        </Card>
      </div>

      {/* Moyennes par matière */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
        <h4 className="mb-4">Moyennes par matière</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectAverages.map(({ subject, average, label, icon: Icon, color, emoji }) => {
            const percentage = ((average || 0) / 20) * 100;
            
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-muted/30 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{emoji} {label}</p>
                    <p className="text-xl font-bold">{average?.toFixed(2)}/20</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Sélecteur de matière */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-md">
        <Label className="mb-2 block">Filtrer par matière</Label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="rounded-xl border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📚 Toutes les matières</SelectItem>
            {Object.entries(subjectConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.emoji} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des évaluations */}
      <div className="space-y-4">
        <h4>Détail des évaluations</h4>
        {filteredEvaluations.length === 0 ? (
          <Card className="p-8 text-center bg-white/70 border-2 border-white/50 rounded-2xl">
            <p className="text-muted-foreground">Aucune évaluation pour cette sélection</p>
          </Card>
        ) : (
          filteredEvaluations
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((evaluation, index) => {
              const typeConfig = evaluationTypes[evaluation.type];
              const subjectInfo = subjectConfig[evaluation.subject];
              const SubjectIcon = subjectInfo.icon;
              const performance = evaluation.grade !== null 
                ? getPerformanceLevel(evaluation.grade, evaluation.classAverage)
                : null;

              return (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl hover:shadow-lg transition-all">
                    {/* En-tête */}
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`${subjectInfo.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                          <SubjectIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${typeConfig.color} text-white border-0`}>
                              {typeConfig.icon} {typeConfig.label}
                            </Badge>
                            <Badge variant="outline">Coef. {evaluation.coefficient}</Badge>
                            {performance && (
                              <Badge className={`${performance.color} text-white border-0`}>
                                {performance.icon} {performance.label}
                              </Badge>
                            )}
                          </div>
                          <h4 className="mb-1">{evaluation.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {evaluation.date}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes et statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Note de l'élève */}
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Note obtenue</p>
                        {evaluation.grade !== null ? (
                          <div>
                            <div className="flex items-baseline gap-2">
                              <p className={`text-4xl font-bold ${getGradeColor(evaluation.grade, evaluation.maxGrade)}`}>
                                {evaluation.grade}
                              </p>
                              <p className="text-xl text-muted-foreground">/{evaluation.maxGrade}</p>
                              <Badge className={`ml-2 ${getGradeColor(evaluation.grade, evaluation.maxGrade)} bg-transparent border-0`}>
                                {((evaluation.grade / evaluation.maxGrade) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                            {evaluation.comment && (
                              <div className="mt-3 p-3 bg-primary/10 rounded-xl">
                                <p className="text-sm text-primary">💬 Commentaire de l'enseignant :</p>
                                <p className="text-sm mt-1">{evaluation.comment}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Note non encore saisie</p>
                        )}
                      </div>

                      {/* Statistiques de la classe */}
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Statistiques de la classe</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                            <span className="text-sm">Moyenne classe</span>
                            <span className="font-bold">{evaluation.classAverage.toFixed(2)}/20</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-success/10 rounded-lg">
                            <span className="text-sm flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-success" />
                              Note maximale
                            </span>
                            <span className="font-bold text-success">{evaluation.classMax}/20</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                            <span className="text-sm flex items-center gap-1">
                              <TrendingDown className="w-4 h-4 text-destructive" />
                              Note minimale
                            </span>
                            <span className="font-bold text-destructive">{evaluation.classMin}/20</span>
                          </div>
                          {evaluation.grade !== null && (
                            <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <span className="text-sm">
                                  <span className="font-bold">
                                    {evaluation.grade > evaluation.classAverage ? '+' : ''}
                                    {(evaluation.grade - evaluation.classAverage).toFixed(2)}
                                  </span>
                                  {' '}points par rapport à la moyenne
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
        )}
      </div>
    </div>
  );
}
