import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calculator,
  PenTool,
  Beaker,
  Globe,
  BookText,
  FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from './ui/tabs';
import { CartoonEmoji } from './CartoonEmoji';

interface Homework {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Course {
  id: number;
  subject: 'math' | 'french' | 'science' | 'history' | 'geography' | 'english' | 'sport' | 'art';
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  homework?: Homework[];
}

const subjectConfig = {
  math: { label: 'Mathématiques', icon: Calculator, color: 'bg-blue-500', emoji: '➕' },
  french: { label: 'Français', icon: PenTool, color: 'bg-purple-500', emoji: '📝' },
  science: { label: 'Sciences', icon: Beaker, color: 'bg-primary', emoji: '🔬' },
  history: { label: 'Histoire', icon: BookText, color: 'bg-warning', emoji: '🏛️' },
  geography: { label: 'Géographie', icon: Globe, color: 'bg-amber-500', emoji: '🌍' },
  english: { label: 'Anglais', icon: FileText, color: 'bg-destructive', emoji: '🇬🇧' },
  sport: { label: 'Sport', icon: User, color: 'bg-success', emoji: '⚽' },
  art: { label: 'Arts plastiques', icon: PenTool, color: 'bg-purple-400', emoji: '🎨' }
};

const daysConfig = {
  monday: { label: 'Lundi', short: 'Lun' },
  tuesday: { label: 'Mardi', short: 'Mar' },
  wednesday: { label: 'Mercredi', short: 'Mer' },
  thursday: { label: 'Jeudi', short: 'Jeu' },
  friday: { label: 'Vendredi', short: 'Ven' }
};

const mockSchedule: Course[] = [
  // Lundi
  {
    id: 1,
    subject: 'math',
    teacher: 'Mme Benali',
    room: 'Salle 12',
    startTime: '08:00',
    endTime: '09:30',
    day: 'monday',
    homework: [
      { id: 1, title: 'Exercices de fractions - Page 45', dueDate: '21 Oct', completed: true }
    ]
  },
  {
    id: 2,
    subject: 'french',
    teacher: 'Mme Benali',
    room: 'Salle 12',
    startTime: '09:45',
    endTime: '11:15',
    day: 'monday',
    homework: [
      { id: 2, title: 'Dictée préparée n°5', dueDate: '20 Oct', completed: false }
    ]
  },
  {
    id: 3,
    subject: 'sport',
    teacher: 'M. Aziz',
    room: 'Gymnase',
    startTime: '14:00',
    endTime: '15:30',
    day: 'monday'
  },
  // Mardi
  {
    id: 4,
    subject: 'science',
    teacher: 'Mme Martin',
    room: 'Salle 8',
    startTime: '08:00',
    endTime: '09:30',
    day: 'tuesday',
    homework: [
      { id: 4, title: 'Expérience sur le cycle de l\'eau', dueDate: '23 Oct', completed: false }
    ]
  },
  {
    id: 5,
    subject: 'geography',
    teacher: 'M. Dubois',
    room: 'Salle 15',
    startTime: '09:45',
    endTime: '11:15',
    day: 'tuesday'
  },
  {
    id: 6,
    subject: 'english',
    teacher: 'Mrs. Smith',
    room: 'Salle 6',
    startTime: '14:00',
    endTime: '15:00',
    day: 'tuesday',
    homework: [
      { id: 6, title: 'Learn vocabulary list 10', dueDate: '22 Oct', completed: true }
    ]
  },
  // Mercredi
  {
    id: 7,
    subject: 'math',
    teacher: 'Mme Benali',
    room: 'Salle 12',
    startTime: '08:00',
    endTime: '09:30',
    day: 'wednesday'
  },
  {
    id: 8,
    subject: 'art',
    teacher: 'Mme Fadila',
    room: 'Atelier',
    startTime: '09:45',
    endTime: '11:15',
    day: 'wednesday'
  },
  // Jeudi
  {
    id: 9,
    subject: 'history',
    teacher: 'M. Dubois',
    room: 'Salle 15',
    startTime: '08:00',
    endTime: '09:30',
    day: 'thursday',
    homework: [
      { id: 3, title: 'Révision contrôle - La révolution française', dueDate: '22 Oct', completed: false }
    ]
  },
  {
    id: 10,
    subject: 'french',
    teacher: 'Mme Benali',
    room: 'Salle 12',
    startTime: '09:45',
    endTime: '11:15',
    day: 'thursday',
    homework: [
      { id: 5, title: 'Conjugaison - Passé composé', dueDate: '19 Oct', completed: true }
    ]
  },
  {
    id: 11,
    subject: 'science',
    teacher: 'Mme Martin',
    room: 'Salle 8',
    startTime: '14:00',
    endTime: '15:30',
    day: 'thursday'
  },
  // Vendredi
  {
    id: 12,
    subject: 'math',
    teacher: 'Mme Benali',
    room: 'Salle 12',
    startTime: '08:00',
    endTime: '09:30',
    day: 'friday'
  },
  {
    id: 13,
    subject: 'geography',
    teacher: 'M. Dubois',
    room: 'Salle 15',
    startTime: '09:45',
    endTime: '11:15',
    day: 'friday'
  },
  {
    id: 14,
    subject: 'sport',
    teacher: 'M. Aziz',
    room: 'Stade',
    startTime: '14:00',
    endTime: '15:30',
    day: 'friday'
  }
];

interface ScheduleViewProps {
  role: 'teacher' | 'parent' | 'student';
}

export function ScheduleView({ role }: ScheduleViewProps) {
  const [selectedDay, setSelectedDay] = useState<keyof typeof daysConfig>('monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [currentWeek, setCurrentWeek] = useState(0);

  const days = Object.keys(daysConfig) as Array<keyof typeof daysConfig>;
  
  const getCoursesForDay = (day: keyof typeof daysConfig) => {
    return mockSchedule
      .filter(course => course.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getCurrentDayLabel = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + currentWeek * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 4);
    
    return `Semaine du ${weekStart.getDate()} au ${weekEnd.getDate()} octobre 2025`;
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const subjectInfo = subjectConfig[course.subject];
    const SubjectIcon = subjectInfo.icon;
    const duration = calculateDuration(course.startTime, course.endTime);
    const hasHomework = course.homework && course.homework.length > 0;
    const completedHomework = course.homework?.filter(hw => hw.completed).length || 0;
    const totalHomework = course.homework?.length || 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`p-4 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl hover:shadow-lg transition-all overflow-hidden relative`}>
          {/* Bande de couleur à gauche */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${subjectInfo.color}`} />
          
          <div className="pl-2">
            {/* En-tête avec matière */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className={`${subjectInfo.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                  <SubjectIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="text-xs mb-1">
                    {subjectInfo.emoji} {subjectInfo.label}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-medium text-foreground">{course.startTime} - {course.endTime}</span>
                    <span className="text-xs">({duration})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations professeur et salle */}
            <div className="space-y-2 mb-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-muted-foreground">Professeur :</span>
                <span className="font-medium">{course.teacher}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-warning" />
                </div>
                <span className="text-muted-foreground">Salle :</span>
                <span className="font-medium">{course.room}</span>
              </div>
            </div>

            {/* Devoirs associés */}
            {hasHomework ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Devoirs associés</span>
                  <Badge className="ml-auto text-xs bg-primary/20 text-primary border-0">
                    {completedHomework}/{totalHomework}
                  </Badge>
                </div>
                {course.homework!.map((hw) => (
                  <div
                    key={hw.id}
                    className={`p-2 rounded-xl text-sm flex items-start gap-2 ${
                      hw.completed 
                        ? 'bg-success/10 border border-success/20' 
                        : 'bg-destructive/10 border border-destructive/20'
                    }`}
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`line-clamp-1 ${hw.completed ? 'text-success' : 'text-destructive'}`}>
                        {hw.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        À rendre le {hw.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground italic">Aucun devoir pour ce cours</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  const DayColumn = ({ day }: { day: keyof typeof daysConfig }) => {
    const courses = getCoursesForDay(day);
    const dayInfo = daysConfig[day];
    const isToday = selectedDay === day;

    return (
      <div className="space-y-3">
        <div className={`text-center p-3 rounded-2xl ${
          isToday 
            ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg' 
            : 'bg-white/70 backdrop-blur-sm border-2 border-white/50'
        }`}>
          <h4 className={isToday ? 'text-white' : ''}>{dayInfo.label}</h4>
          <p className={`text-sm ${isToday ? 'text-white/90' : 'text-muted-foreground'}`}>
            {courses.length} cours
          </p>
        </div>
        <div className="space-y-3">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Pas de cours</p>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes}`;
  };

  const getTotalHomework = () => {
    let total = 0;
    let completed = 0;
    mockSchedule.forEach(course => {
      if (course.homework) {
        total += course.homework.length;
        completed += course.homework.filter(hw => hw.completed).length;
      }
    });
    return { total, completed };
  };

  const homeworkStats = getTotalHomework();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="calendar" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Emploi du temps</h2>
          <p className="text-muted-foreground">
            {getCurrentDayLabel()}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-150 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total cours</p>
              <p className="text-2xl font-bold text-blue-900">{mockSchedule.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-100 to-purple-150 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Devoirs totaux</p>
              <p className="text-2xl font-bold text-purple-900">{homeworkStats.total}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-success/20 to-success/10 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success">Devoirs faits</p>
              <p className="text-2xl font-bold text-success">{homeworkStats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-white/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-destructive">À faire</p>
              <p className="text-2xl font-bold text-destructive">{homeworkStats.total - homeworkStats.completed}</p>
            </div>
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Tabs Vue jour / semaine */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-md">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'day' | 'week')}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="day" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Vue du jour
            </TabsTrigger>
            <TabsTrigger value="week" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Vue de la semaine
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Navigation semaine */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(currentWeek - 1)}
          className="rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Semaine précédente
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(0)}
          className="rounded-xl"
          disabled={currentWeek === 0}
        >
          Aujourd'hui
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(currentWeek + 1)}
          className="rounded-xl"
        >
          Semaine suivante
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Contenu principal */}
      {viewMode === 'day' ? (
        <div>
          {/* Sélecteur de jour */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? 'default' : 'outline'}
                onClick={() => setSelectedDay(day)}
                className="rounded-xl flex-shrink-0"
              >
                {daysConfig[day].short}
              </Button>
            ))}
          </div>
          
          {/* Vue du jour sélectionné */}
          <div className="max-w-2xl mx-auto">
            <DayColumn day={selectedDay} />
          </div>
        </div>
      ) : (
        /* Vue de la semaine */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {days.map((day) => (
            <DayColumn key={day} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}
