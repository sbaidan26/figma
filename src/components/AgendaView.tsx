import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { CourseDetailModal } from './CourseDetailModal';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  Home,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';

interface Course {
  id: number;
  subject: string;
  time: string;
  duration: string;
  color: string;
  room?: string;
  attendanceDone?: boolean;
}

interface AgendaViewProps {
  onTakeAttendance: (courseId: number) => void;
}

export function AgendaView({ onTakeAttendance }: AgendaViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'week' | 'day'>('day');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fonction pour vérifier si une date est en vacances scolaires (France 2025)
  const isSchoolHoliday = (date: Date): boolean => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    // Vacances scolaires 2025 (dates approximatives - zone B par défaut)
    const holidays = [
      // Vacances d'hiver février 2025
      { start: new Date(2025, 1, 15), end: new Date(2025, 2, 3) }, // 15 fév - 3 mars
      // Vacances de printemps avril 2025
      { start: new Date(2025, 3, 12), end: new Date(2025, 3, 28) }, // 12 avril - 28 avril
      // Vacances d'été 2025
      { start: new Date(2025, 6, 5), end: new Date(2025, 8, 1) }, // 5 juillet - 1 sept
      // Vacances de la Toussaint 2025
      { start: new Date(2025, 9, 18), end: new Date(2025, 10, 3) }, // 18 oct - 3 nov
      // Vacances de Noël 2025
      { start: new Date(2025, 11, 20), end: new Date(2026, 0, 5) }, // 20 déc - 5 jan
    ];

    return holidays.some(holiday => date >= holiday.start && date <= holiday.end);
  };

  // Fonction pour générer les cours du samedi
  const generateSaturdayCourse = (date: Date): Course | null => {
    // Vérifier que c'est un samedi (6)
    if (date.getDay() !== 6) return null;
    
    // Vérifier que ce n'est pas en vacances
    if (isSchoolHoliday(date)) return null;

    // Générer un ID unique basé sur la date
    const dateStr = date.toISOString().split('T')[0];
    const id = parseInt(dateStr.replace(/-/g, '').substring(2)); // Convertir YYYYMMDD en nombre

    return {
      id,
      subject: 'Cours Test Samedi',
      time: '09:00',
      duration: '3h',
      color: '#8E44AD',
      room: 'Salle Test',
      attendanceDone: false,
    };
  };

  // Mock data for courses
  const baseCourses: Record<string, Course[]> = {
    'Mon Oct 20 2025': [
      { id: 1, subject: 'Mathématiques', time: '08:30', duration: '1h', color: '#3498DB', room: 'Salle 101', attendanceDone: true },
      { id: 2, subject: 'Français', time: '10:00', duration: '1h', color: '#E74C3C', room: 'Salle 101', attendanceDone: true },
      { id: 3, subject: 'Sciences', time: '14:00', duration: '1h30', color: '#2ECC71', room: 'Labo', attendanceDone: false },
    ],
    'Tue Oct 21 2025': [
      { id: 4, subject: 'Histoire', time: '08:30', duration: '1h', color: '#F39C12', room: 'Salle 101', attendanceDone: false },
      { id: 5, subject: 'Géographie', time: '10:00', duration: '1h', color: '#1ABC9C', room: 'Salle 101', attendanceDone: false },
      { id: 6, subject: 'Arts Plastiques', time: '14:00', duration: '2h', color: '#9B59B6', room: 'Atelier', attendanceDone: false },
    ],
    'Wed Oct 22 2025': [
      { id: 7, subject: 'Mathématiques', time: '08:30', duration: '1h', color: '#3498DB', room: 'Salle 101', attendanceDone: false },
      { id: 8, subject: 'EPS', time: '10:00', duration: '2h', color: '#E67E22', room: 'Gymnase', attendanceDone: false },
    ],
    'Thu Oct 23 2025': [
      { id: 9, subject: 'Français', time: '08:30', duration: '1h', color: '#E74C3C', room: 'Salle 101', attendanceDone: false },
      { id: 10, subject: 'Musique', time: '10:00', duration: '1h', color: '#8E44AD', room: 'Salle de musique', attendanceDone: false },
      { id: 11, subject: 'Sciences', time: '14:00', duration: '1h30', color: '#2ECC71', room: 'Labo', attendanceDone: false },
    ],
    'Fri Oct 24 2025': [
      { id: 12, subject: 'Mathématiques', time: '08:30', duration: '1h', color: '#3498DB', room: 'Salle 101', attendanceDone: false },
      { id: 13, subject: 'Français', time: '10:00', duration: '1h', color: '#E74C3C', room: 'Salle 101', attendanceDone: false },
      { id: 14, subject: 'Projet', time: '14:00', duration: '2h', color: '#16A085', room: 'Salle 101', attendanceDone: false },
    ],
  };

  // Fonction pour obtenir les cours d'une date donnée (incluant les samedis)
  const getCoursesForDate = (date: Date): Course[] => {
    const dateKey = date.toDateString();
    const regularCourses = baseCourses[dateKey] || [];
    
    // Ajouter le cours du samedi si applicable
    const saturdayCourse = generateSaturdayCourse(date);
    if (saturdayCourse) {
      return [...regularCourses, saturdayCourse];
    }
    
    return regularCourses;
  };

  const dateKey = selectedDate.toDateString();
  const todaysCourses = getCoursesForDate(selectedDate);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const getWeekDates = () => {
    const dates = [];
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    
    for (let i = 0; i < 6; i++) { // Changé de 5 à 6 pour inclure le samedi
      const date = new Date(current.setDate(diff + i));
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs */}
      <div className="bg-white border-b border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setView('day')}
              className={`rounded-[20px] px-3.5 py-2.5 text-sm ${
                view === 'day' 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setView('week')}
              className={`rounded-[20px] px-3.5 py-2.5 text-sm ${
                view === 'week' 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Calendrier
            </button>
            <button className="bg-secondary text-secondary-foreground rounded-[20px] px-3.5 py-2.5 text-sm">
              Rapports
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-dashed border-border px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Home className="w-5 h-5" />
          <span>Tableau de bord — Classe 5A</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

      {view === 'day' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Picker */}
          <Card className="p-6 rounded-[20px] border-border shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04)]">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md"
            />
            <div className="mt-4 p-3 bg-primary/10 rounded-xl border-2 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-2xl opacity-20">📅</div>
              <p className="text-primary flex items-center gap-2">
                <span>ℹ️</span>
                <span>Cours Test Samedi</span>
              </p>
              <p className="text-muted-foreground mt-1">Tous les samedis de 9h à 12h (hors vacances scolaires)</p>
            </div>
          </Card>

          {/* Day Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 rounded-[20px] border-border shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <h3>{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-[20px]"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() - 1);
                      setSelectedDate(newDate);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-[20px]"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() + 1);
                      setSelectedDate(newDate);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isSchoolHoliday(selectedDate) && selectedDate.getDay() === 6 ? (
                <div className="text-center py-12">
                  <div className="inline-block px-6 py-4 bg-warning/10 rounded-xl border-4 border-warning/20 relative">
                    <div className="absolute top-0 right-0 text-3xl opacity-30">🌴</div>
                    <div className="absolute bottom-0 left-0 text-3xl opacity-30">☀️</div>
                    <p className="text-warning mb-2 flex items-center gap-2 justify-center">
                      <span>🏖️</span>
                      <span>Vacances scolaires</span>
                      <span>🏖️</span>
                    </p>
                    <p className="text-muted-foreground">Pas de cours test ce samedi</p>
                  </div>
                </div>
              ) : todaysCourses.length > 0 ? (
                <div className="space-y-3">
                  {todaysCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border-l-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-white hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group hover:scale-102"
                      style={{ borderLeftColor: course.color }}
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="absolute top-2 right-2 text-2xl opacity-10 group-hover:opacity-30 transition-opacity">📚</div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge style={{ backgroundColor: course.color }}>
                              {course.subject}
                            </Badge>
                            {course.attendanceDone && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Appel fait
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.time} - {course.duration}</span>
                            </div>
                            {course.room && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{course.room}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={course.attendanceDone ? 'bg-success' : 'bg-primary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTakeAttendance(course.id);
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          {course.attendanceDone ? 'Modifier l\'appel' : 'Faire l\'appel'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun cours prévu ce jour</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        // Week View
        <Card className="p-6 overflow-x-auto rounded-[20px] border-border shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04)]">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-7 gap-4 mb-4">
              <div className="text-muted-foreground">Horaire</div>
              {weekDays.map((day, i) => {
                const date = getWeekDates()[i];
                const isToday = date.toDateString() === new Date().toDateString();
                const isSaturday = date.getDay() === 6;
                const isHoliday = isSchoolHoliday(date);
                return (
                  <div key={day} className="text-center">
                    <p className={isToday ? 'text-primary' : ''}>{day}</p>
                    <p className={`text-muted-foreground ${isToday ? 'text-primary' : ''}`}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </p>
                    {isSaturday && isHoliday && (
                      <p className="text-warning">Vacances</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time slots */}
            {['08:30', '09:00', '10:00', '14:00', '16:00'].map((time) => (
              <div key={time} className="grid grid-cols-7 gap-4 mb-3">
                <div className="text-muted-foreground py-2">{time}</div>
                {getWeekDates().map((date) => {
                  const dayCourses = getCoursesForDate(date);
                  const courseAtTime = dayCourses.find(c => c.time === time);
                  
                  return (
                    <div key={date.toISOString()} className="min-h-[60px]">
                      {courseAtTime ? (
                        <div
                          className="p-2 rounded-lg h-full cursor-pointer hover:shadow-md transition-shadow"
                          style={{ backgroundColor: courseAtTime.color + '20', borderLeft: `3px solid ${courseAtTime.color}` }}
                          onClick={() => handleCourseClick(courseAtTime)}
                        >
                          <p className="truncate">{courseAtTime.subject}</p>
                          <p className="text-muted-foreground truncate">{courseAtTime.duration}</p>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted rounded-lg h-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      )}

      <CourseDetailModal
        course={selectedCourse}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onTakeAttendance={onTakeAttendance}
      />
      </div>
    </div>
  );
}
