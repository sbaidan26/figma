import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Plus,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  PenTool,
  Calculator,
  Globe,
  Beaker,
  BookText
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { CartoonEmoji } from './CartoonEmoji';
import { Checkbox } from './ui/checkbox';

interface Homework {
  id: number;
  title: string;
  subject: 'math' | 'french' | 'science' | 'history' | 'geography' | 'english';
  description: string;
  dueDate: string;
  dueTime: string;
  assignedDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  assignedBy: string;
  totalStudents?: number;
  completedStudents?: number;
  status: 'pending' | 'in-progress' | 'late' | 'completed';
}

interface StudentHomeworkStatus {
  studentId: number;
  studentName: string;
  completed: boolean;
  completedDate?: string;
  grade?: number;
}

const mockHomework: Homework[] = [
  {
    id: 1,
    title: "Exercices de fractions - Page 45",
    subject: 'math',
    description: "Faire les exercices 1 à 10 sur les fractions. Bien détailler les calculs.",
    dueDate: "21 Oct 2025",
    dueTime: "08:00",
    assignedDate: "18 Oct 2025",
    difficulty: 'medium',
    estimatedTime: "45 min",
    assignedBy: "Mme Benali",
    totalStudents: 28,
    completedStudents: 24,
    status: 'completed'
  },
  {
    id: 2,
    title: "Dictée préparée n°5",
    subject: 'french',
    description: "Apprendre les 20 mots de la liste. Revoir les règles d'accord du participe passé.",
    dueDate: "20 Oct 2025",
    dueTime: "10:00",
    assignedDate: "17 Oct 2025",
    difficulty: 'easy',
    estimatedTime: "30 min",
    assignedBy: "Mme Benali",
    totalStudents: 28,
    completedStudents: 18,
    status: 'in-progress'
  },
  {
    id: 3,
    title: "Révision contrôle - La révolution française",
    subject: 'history',
    description: "Relire les chapitres 3 et 4. Faire la fiche de révision distribuée en classe.",
    dueDate: "22 Oct 2025",
    dueTime: "14:00",
    assignedDate: "19 Oct 2025",
    difficulty: 'hard',
    estimatedTime: "1h 30min",
    assignedBy: "M. Dubois",
    totalStudents: 28,
    completedStudents: 12,
    status: 'in-progress'
  },
  {
    id: 4,
    title: "Expérience sur le cycle de l'eau",
    subject: 'science',
    description: "Dessiner et légender le schéma du cycle de l'eau vu en classe.",
    dueDate: "23 Oct 2025",
    dueTime: "09:00",
    assignedDate: "19 Oct 2025",
    difficulty: 'medium',
    estimatedTime: "1h",
    assignedBy: "Mme Martin",
    totalStudents: 28,
    completedStudents: 8,
    status: 'pending'
  },
  {
    id: 5,
    title: "Conjugaison - Passé composé",
    subject: 'french',
    description: "Conjuguer les 15 verbes de la liste au passé composé avec être et avoir.",
    dueDate: "19 Oct 2025",
    dueTime: "08:00",
    assignedDate: "16 Oct 2025",
    difficulty: 'medium',
    estimatedTime: "40 min",
    assignedBy: "Mme Benali",
    totalStudents: 28,
    completedStudents: 28,
    status: 'completed'
  },
];

const mockStudentStatuses: Record<number, StudentHomeworkStatus[]> = {
  1: [
    { studentId: 1, studentName: "Amira Ben Ahmed", completed: true, completedDate: "20 Oct 2025", grade: 18 },
    { studentId: 2, studentName: "Youssef Mansouri", completed: true, completedDate: "20 Oct 2025", grade: 16 },
    { studentId: 3, studentName: "Salma Khalil", completed: true, completedDate: "21 Oct 2025", grade: 19 },
    { studentId: 4, studentName: "Omar Benjelloun", completed: false },
    { studentId: 5, studentName: "Leila Rachidi", completed: true, completedDate: "20 Oct 2025", grade: 17 },
  ],
  2: [
    { studentId: 1, studentName: "Amira Ben Ahmed", completed: true, completedDate: "19 Oct 2025" },
    { studentId: 2, studentName: "Youssef Mansouri", completed: false },
    { studentId: 3, studentName: "Salma Khalil", completed: true, completedDate: "19 Oct 2025" },
    { studentId: 4, studentName: "Omar Benjelloun", completed: false },
    { studentId: 5, studentName: "Leila Rachidi", completed: true, completedDate: "20 Oct 2025" },
  ],
};

const subjectConfig = {
  math: { label: 'Mathématiques', icon: Calculator, color: 'bg-blue-500', emoji: '➕' },
  french: { label: 'Français', icon: PenTool, color: 'bg-purple-500', emoji: '📝' },
  science: { label: 'Sciences', icon: Beaker, color: 'bg-primary', emoji: '🔬' },
  history: { label: 'Histoire', icon: BookText, color: 'bg-warning', emoji: '🏛️' },
  geography: { label: 'Géographie', icon: Globe, color: 'bg-amber-500', emoji: '🌍' },
  english: { label: 'Anglais', icon: FileText, color: 'bg-destructive', emoji: '🇬🇧' }
};

const difficultyConfig = {
  easy: { label: 'Facile', color: 'bg-success', textColor: 'text-success' },
  medium: { label: 'Moyen', color: 'bg-warning', textColor: 'text-warning' },
  hard: { label: 'Difficile', color: 'bg-destructive', textColor: 'text-destructive' }
};

interface HomeworkViewProps {
  role: 'teacher' | 'parent' | 'student';
  studentName?: string;
}

export function HomeworkView({ role, studentName = "Amira Ben Ahmed" }: HomeworkViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedHomework, setSelectedHomework] = useState<number | null>(null);
  const [completedHomework, setCompletedHomework] = useState<Set<number>>(new Set([1, 5]));

  const filteredHomework = mockHomework.filter(hw => {
    const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hw.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || hw.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || hw.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const toggleHomeworkCompletion = (id: number) => {
    const newCompleted = new Set(completedHomework);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedHomework(newCompleted);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (role === 'student' || role === 'parent') {
      return completed ? CheckCircle2 : XCircle;
    }
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'late': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string, completed: boolean) => {
    if (role === 'student' || role === 'parent') {
      return completed ? 'text-success' : 'text-destructive';
    }
    switch (status) {
      case 'completed': return 'text-success';
      case 'late': return 'text-destructive';
      case 'in-progress': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const HomeworkCard = ({ homework }: { homework: Homework }) => {
    const subjectInfo = subjectConfig[homework.subject];
    const SubjectIcon = subjectInfo.icon;
    const difficultyInfo = difficultyConfig[homework.difficulty];
    const isCompleted = completedHomework.has(homework.id);
    const StatusIcon = getStatusIcon(homework.status, isCompleted);
    const statusColor = getStatusColor(homework.status, isCompleted);
    const completionRate = homework.totalStudents 
      ? Math.round((homework.completedStudents! / homework.totalStudents) * 100)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`p-5 hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl ${
          isCompleted && role !== 'teacher' ? 'opacity-75' : ''
        }`}>
          {/* En-tête */}
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

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {homework.description}
          </p>

          {/* Métadonnées */}
          <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">À rendre le</p>
                <p className="font-medium">{homework.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Durée estimée</p>
                <p className="font-medium">{homework.estimatedTime}</p>
              </div>
            </div>
          </div>

          {/* Barre de progression pour enseignant */}
          {role === 'teacher' && homework.totalStudents && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taux de complétion</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{homework.completedStudents} / {homework.totalStudents} élèves</span>
              </div>
            </div>
          )}

          {/* Statut pour parent/élève */}
          {(role === 'parent' || role === 'student') && (
            <div className={`mb-3 p-3 rounded-xl ${isCompleted ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className={`font-medium ${isCompleted ? 'text-success' : 'text-destructive'}`}>
                    {isCompleted ? 'Devoir fait ✓' : 'Devoir à faire'}
                  </span>
                </div>
                {role === 'student' && (
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleHomeworkCompletion(homework.id)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Auteur */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {homework.assignedBy.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{homework.assignedBy}</span>
            </div>
            {role === 'teacher' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl"
                onClick={() => setSelectedHomework(homework.id)}
              >
                <Users className="w-4 h-4 mr-1" />
                Détails
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  const StudentStatusModal = () => {
    if (!selectedHomework) return null;
    
    const homework = mockHomework.find(hw => hw.id === selectedHomework);
    const statuses = mockStudentStatuses[selectedHomework] || [];
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
        >
          {/* En-tête */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-2">{homework?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Suivi des élèves - {statuses.filter(s => s.completed).length} / {statuses.length} ont rendu
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedHomework(null)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Liste des élèves */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-3">
              {statuses.map((status) => (
                <div
                  key={status.studentId}
                  className={`p-4 rounded-xl border-2 ${
                    status.completed 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-destructive/5 border-destructive/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`text-sm ${
                          status.completed ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {status.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{status.studentName}</p>
                        {status.completed && status.completedDate && (
                          <p className="text-xs text-muted-foreground">
                            Rendu le {status.completedDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {status.completed && status.grade && (
                        <Badge className="bg-primary text-white">
                          {status.grade}/20
                        </Badge>
                      )}
                      {status.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const completedCount = Array.from(completedHomework).length;
  const totalCount = mockHomework.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="books" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>
            {role === 'teacher' && 'Gestion des devoirs'}
            {role === 'parent' && `Devoirs de ${studentName}`}
            {role === 'student' && 'Mes devoirs'}
          </h2>
          <p className="text-muted-foreground">
            {role === 'teacher' && "Suivez la progression de vos élèves"}
            {role === 'parent' && "Consultez les devoirs à faire"}
            {role === 'student' && "Gérez vos devoirs et marquez-les comme faits"}
          </p>
        </div>
        {role === 'teacher' && (
          <Button className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau devoir
          </Button>
        )}
      </div>

      {/* Statistiques */}
      {(role === 'parent' || role === 'student') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-150 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total</p>
                <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-success/20 to-success/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success">Faits</p>
                <p className="text-2xl font-bold text-success">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive">À faire</p>
                <p className="text-2xl font-bold text-destructive">{totalCount - completedCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </Card>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un devoir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-2"
            />
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="rounded-xl border-2">
              <SelectValue placeholder="Toutes les matières" />
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

          {role === 'teacher' && (
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Liste des devoirs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted-foreground">
            {filteredHomework.length} devoir{filteredHomework.length > 1 ? 's' : ''}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHomework.map((homework) => (
            <HomeworkCard key={homework.id} homework={homework} />
          ))}
        </div>

        {filteredHomework.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2">Aucun devoir trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Modal détails élèves (enseignant) */}
      {selectedHomework && <StudentStatusModal />}
    </div>
  );
}
