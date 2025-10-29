import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Loader2,
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
import { CartoonEmoji } from './CartoonEmoji';
import { useSchedule } from '../hooks/useSchedule';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';

const subjectConfig = {
  math: { label: 'Mathématiques', icon: Calculator, color: 'bg-blue-500', emoji: '➕' },
  french: { label: 'Français', icon: PenTool, color: 'bg-purple-500', emoji: '📝' },
  science: { label: 'Sciences', icon: Beaker, color: 'bg-primary', emoji: '🔬' },
  history: { label: 'Histoire', icon: BookText, color: 'bg-warning', emoji: '🏛️' },
  geography: { label: 'Géographie', icon: Globe, color: 'bg-amber-500', emoji: '🌍' },
  english: { label: 'Anglais', icon: FileText, color: 'bg-destructive', emoji: '🇬🇧' },
  sport: { label: 'Sport', icon: User, color: 'bg-success', emoji: '⚽' },
  art: { label: 'Arts plastiques', icon: PenTool, color: 'bg-purple-400', emoji: '🎨' },
  arabic: { label: 'Arabe', icon: BookText, color: 'bg-amber-600', emoji: '🇦🇪' },
  islamic_studies: { label: 'Études islamiques', icon: BookText, color: 'bg-success', emoji: '☪️' },
  physical_education: { label: 'EPS', icon: User, color: 'bg-success', emoji: '🏃' },
  arts: { label: 'Arts', icon: PenTool, color: 'bg-purple-400', emoji: '🎨' },
  music: { label: 'Musique', icon: PenTool, color: 'bg-pink-500', emoji: '🎵' }
};

const daysConfig = [
  { label: 'Lundi', short: 'Lun' },
  { label: 'Mardi', short: 'Mar' },
  { label: 'Mercredi', short: 'Mer' },
  { label: 'Jeudi', short: 'Jeu' },
  { label: 'Vendredi', short: 'Ven' }
];

interface ScheduleViewProps {
  role: 'teacher' | 'parent' | 'student';
}

export function ScheduleView({ role }: ScheduleViewProps) {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const {
    scheduleEntries,
    loading,
    userClassId,
    createScheduleEntry,
    getEntriesForDay
  } = useSchedule(selectedClassId || undefined);

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

  const CourseCard = ({ entry }: { entry: any }) => {
    const subjectInfo = subjectConfig[entry.subject as keyof typeof subjectConfig] || {
      label: entry.subject,
      icon: BookText,
      color: 'bg-gray-500',
      emoji: '📚'
    };
    const SubjectIcon = subjectInfo.icon;
    const duration = calculateDuration(entry.start_time, entry.end_time);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-4 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl hover:shadow-lg transition-all overflow-hidden relative">
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${subjectInfo.color}`} />

          <div className="pl-2">
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
                    <span className="font-medium text-foreground">
                      {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                    </span>
                    <span className="text-xs">({duration})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-muted-foreground">Professeur :</span>
                <span className="font-medium">{entry.teacher}</span>
              </div>
              {entry.room && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-warning" />
                  </div>
                  <span className="text-muted-foreground">Salle :</span>
                  <span className="font-medium">{entry.room}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const DayColumn = ({ dayIndex }: { dayIndex: number }) => {
    const entries = getEntriesForDay(dayIndex);
    const dayInfo = daysConfig[dayIndex];
    const isToday = selectedDay === dayIndex;

    return (
      <div className="space-y-3">
        <div className={`text-center p-3 rounded-2xl ${
          isToday
            ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg'
            : 'bg-white/70 backdrop-blur-sm border-2 border-white/50'
        }`}>
          <h4 className={isToday ? 'text-white' : ''}>{dayInfo.label}</h4>
          <p className={`text-sm ${isToday ? 'text-white/90' : 'text-muted-foreground'}`}>
            {entries.length} cours
          </p>
        </div>
        <div className="space-y-3">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <CourseCard key={entry.id} entry={entry} />
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

  const AddCourseDialog = () => {
    const [formData, setFormData] = useState({
      subject: 'math',
      teacher: '',
      room: '',
      day_of_week: '0',
      start_time: '08:00',
      end_time: '09:30'
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

      if (!formData.teacher.trim()) {
        toast.error('Veuillez entrer le nom du professeur');
        return;
      }

      setCreating(true);
      try {
        await createScheduleEntry({
          subject: formData.subject,
          teacher: formData.teacher.trim(),
          room: formData.room.trim() || undefined,
          day_of_week: parseInt(formData.day_of_week),
          start_time: formData.start_time,
          end_time: formData.end_time,
          class_id: effectiveClassId,
        });

        setIsAddingCourse(false);
        setFormData({
          subject: 'math',
          teacher: '',
          room: '',
          day_of_week: '0',
          start_time: '08:00',
          end_time: '09:30'
        });
      } catch (error) {
        console.error('Error creating schedule entry:', error);
      } finally {
        setCreating(false);
      }
    };

    return (
      <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un cours</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau cours à l'emploi du temps
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Matière</Label>
                <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
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
                <Label>Jour</Label>
                <Select value={formData.day_of_week} onValueChange={(v) => setFormData({ ...formData, day_of_week: v })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysConfig.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Professeur</Label>
                <Input
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="Nom du professeur"
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Salle (optionnel)</Label>
                <Input
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Ex: Salle 12"
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heure de début</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingCourse(false)}
                className="rounded-xl"
                disabled={creating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreate}
                className="rounded-xl bg-gradient-to-br from-primary to-secondary"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le cours
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
            <CartoonEmoji type="calendar" className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2>Emploi du temps</h2>
            <p className="text-muted-foreground">Sélectionnez une classe pour commencer</p>
          </div>
        </div>

        <Card className="p-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Choisissez une classe</p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une classe pour voir l'emploi du temps
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
          <CartoonEmoji type="calendar" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Emploi du temps</h2>
          <p className="text-muted-foreground">
            Semaine de cours
          </p>
        </div>
        {role === 'teacher' && (
          <Button
            onClick={() => setIsAddingCourse(true)}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
            disabled={!selectedClassId && !userClassId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un cours
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

      <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-150 border-2 border-white/50 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700">Total cours</p>
            <p className="text-2xl font-bold text-blue-900">{scheduleEntries.length}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {daysConfig.map((_, index) => (
          <DayColumn key={index} dayIndex={index} />
        ))}
      </div>

      <AddCourseDialog />
    </div>
  );
}
