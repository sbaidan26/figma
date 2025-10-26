import { useState } from 'react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BookOpen, TrendingUp, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

interface TeacherProgress {
  teacherId: number;
  teacherName: string;
  class: string;
  subjects: {
    name: string;
    totalChapters: number;
    completedChapters: number;
    progress: number;
    onTrack: boolean;
  }[];
  overallProgress: number;
  status: 'ahead' | 'on-track' | 'behind';
}

export function CurriculumMonitoringView() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const teachersProgress: TeacherProgress[] = [
    {
      teacherId: 1,
      teacherName: 'Mme Benali',
      class: 'CM2-A',
      overallProgress: 58,
      status: 'on-track',
      subjects: [
        { name: 'Mathématiques', totalChapters: 12, completedChapters: 7, progress: 58, onTrack: true },
        { name: 'Français', totalChapters: 10, completedChapters: 6, progress: 60, onTrack: true },
        { name: 'Sciences', totalChapters: 8, completedChapters: 5, progress: 63, onTrack: true },
      ],
    },
    {
      teacherId: 2,
      teacherName: 'M. El Amrani',
      class: 'CE2-B',
      overallProgress: 71,
      status: 'ahead',
      subjects: [
        { name: 'Mathématiques', totalChapters: 10, completedChapters: 8, progress: 80, onTrack: true },
        { name: 'Français', totalChapters: 12, completedChapters: 9, progress: 75, onTrack: true },
        { name: 'Géographie', totalChapters: 6, completedChapters: 4, progress: 67, onTrack: true },
      ],
    },
    {
      teacherId: 3,
      teacherName: 'Mme Chakir',
      class: 'CM1-A',
      overallProgress: 42,
      status: 'behind',
      subjects: [
        { name: 'Sciences', totalChapters: 8, completedChapters: 3, progress: 38, onTrack: false },
        { name: 'Géographie', totalChapters: 6, completedChapters: 2, progress: 33, onTrack: false },
        { name: 'Histoire', totalChapters: 7, completedChapters: 4, progress: 57, onTrack: true },
      ],
    },
    {
      teacherId: 4,
      teacherName: 'M. Idrissi',
      class: 'CM2-B',
      overallProgress: 65,
      status: 'on-track',
      subjects: [
        { name: 'Mathématiques', totalChapters: 12, completedChapters: 8, progress: 67, onTrack: true },
        { name: 'Français', totalChapters: 10, completedChapters: 6, progress: 60, onTrack: true },
        { name: 'Histoire', totalChapters: 7, completedChapters: 5, progress: 71, onTrack: true },
      ],
    },
  ];

  const getStatusBadge = (status: TeacherProgress['status']) => {
    switch (status) {
      case 'ahead':
        return (
          <Badge className="bg-success gap-1">
            <TrendingUp className="w-3 h-3" />
            En avance
          </Badge>
        );
      case 'on-track':
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Dans les temps
          </Badge>
        );
      case 'behind':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            En retard
          </Badge>
        );
    }
  };

  const getProgressColor = (progress: number, onTrack: boolean) => {
    if (!onTrack) return 'bg-destructive';
    if (progress >= 70) return 'bg-success';
    if (progress >= 50) return 'bg-primary';
    return 'bg-warning';
  };

  // Calculate subject statistics
  const getSubjectStats = () => {
    const subjects = new Map<string, { total: number; completed: number; teachers: number }>();
    
    teachersProgress.forEach(teacher => {
      teacher.subjects.forEach(subject => {
        const current = subjects.get(subject.name) || { total: 0, completed: 0, teachers: 0 };
        subjects.set(subject.name, {
          total: current.total + subject.totalChapters,
          completed: current.completed + subject.completedChapters,
          teachers: current.teachers + 1,
        });
      });
    });
    
    return Array.from(subjects.entries()).map(([name, stats]) => ({
      name,
      ...stats,
      progress: Math.round((stats.completed / stats.total) * 100),
    }));
  };

  const subjectStats = getSubjectStats();

  const filteredTeachers = selectedSubject === 'all' 
    ? teachersProgress 
    : teachersProgress.filter(teacher => 
        teacher.subjects.some(s => s.name === selectedSubject)
      );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <CartoonEmoji type="book" className="w-7 h-7" />
          </div>
          <div>
            <h2>Suivi du programme</h2>
            <p className="text-muted-foreground">
              Monitoring de la progression pédagogique par enseignant
            </p>
          </div>
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            <SelectItem value="Mathématiques">Mathématiques</SelectItem>
            <SelectItem value="Français">Français</SelectItem>
            <SelectItem value="Sciences">Sciences</SelectItem>
            <SelectItem value="Géographie">Géographie</SelectItem>
            <SelectItem value="Histoire">Histoire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border-2 border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              <CartoonEmoji type="teacher" className="w-6 h-6" />
            </div>
          </div>
          <h4 className="text-3xl mb-1">{teachersProgress.length}</h4>
          <p className="text-sm text-muted-foreground">Enseignants suivis</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-success/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
          <h4 className="text-3xl mb-1 text-success">
            {teachersProgress.filter(t => t.status === 'ahead').length}
          </h4>
          <p className="text-sm text-muted-foreground">En avance</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h4 className="text-3xl mb-1 text-primary">
            {teachersProgress.filter(t => t.status === 'on-track').length}
          </h4>
          <p className="text-sm text-muted-foreground">Dans les temps</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-destructive/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-destructive/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <h4 className="text-3xl mb-1 text-destructive">
            {teachersProgress.filter(t => t.status === 'behind').length}
          </h4>
          <p className="text-sm text-muted-foreground">En retard</p>
        </div>
      </div>

      {/* Subject Overview */}
      <div className="bg-white rounded-2xl p-6 border-2 border-border/50">
        <h3 className="mb-4">Vue d'ensemble par matière</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map(subject => (
            <div
              key={subject.name}
              className="bg-muted/30 rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm">{subject.name}</h4>
                <Badge variant="outline">{subject.teachers} prof(s)</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-bold">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {subject.completed}/{subject.total} chapitres complétés
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teachers Detailed Progress */}
      <div className="space-y-4">
        <h3>Progression détaillée par enseignant</h3>

        {filteredTeachers.map(teacher => (
          <div
            key={teacher.teacherId}
            className="bg-white rounded-2xl border-2 border-border/50 overflow-hidden hover:border-primary/50 transition-all"
          >
            {/* Teacher Header */}
            <div className="bg-gradient-to-r from-muted/50 to-transparent p-5 border-b-2 border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {teacher.teacherName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4>{teacher.teacherName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{teacher.class}</Badge>
                      {getStatusBadge(teacher.status)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Progression globale</p>
                  <div className="text-3xl font-bold">{teacher.overallProgress}%</div>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="mt-4">
                <Progress value={teacher.overallProgress} className="h-3" />
              </div>
            </div>

            {/* Subjects Progress */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teacher.subjects.map(subject => (
                  <div
                    key={subject.name}
                    className={`rounded-xl p-4 border-2 ${
                      subject.onTrack ? 'bg-muted/30 border-border/50' : 'bg-destructive/5 border-destructive/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-sm">{subject.name}</h4>
                      </div>
                      {!subject.onTrack && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {subject.completedChapters}/{subject.totalChapters} chapitres
                        </span>
                        <span className={`font-bold ${subject.onTrack ? 'text-primary' : 'text-destructive'}`}>
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressColor(subject.progress, subject.onTrack)}`}
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Voir le détail
                </Button>
                {teacher.status === 'behind' && (
                  <Button variant="outline" size="sm" className="gap-2 border-warning text-warning hover:bg-warning/10">
                    <AlertTriangle className="w-4 h-4" />
                    Contacter l'enseignant
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
