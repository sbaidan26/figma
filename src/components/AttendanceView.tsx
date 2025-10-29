import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Calendar as CalendarIcon,
  Loader2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { useAttendance } from '../hooks/useAttendance';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface StudentStatus {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrival_time?: string;
  notes?: string;
}

export function AttendanceView() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  const [currentAttendanceId, setCurrentAttendanceId] = useState<string | null>(null);
  const [studentStatuses, setStudentStatuses] = useState<Record<string, StudentStatus>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [courseName, setCourseName] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    attendanceRecords,
    students,
    loading,
    userClassId,
    createAttendanceRecord,
    saveAttendanceEntries,
    getAttendanceStats,
  } = useAttendance(selectedClassId || undefined);

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

  const handleCreateAttendance = async () => {
    if (!courseName.trim()) {
      toast.error('Veuillez entrer le nom du cours');
      return;
    }

    const effectiveClassId = selectedClassId || userClassId;
    if (!effectiveClassId) {
      toast.error('Veuillez sélectionner une classe');
      return;
    }

    try {
      const record = await createAttendanceRecord({
        date: new Date().toISOString().split('T')[0],
        class_id: effectiveClassId,
        course_name: courseName,
        notes: '',
      });

      if (record) {
        setCurrentAttendanceId(record.id);
        const initialStatuses: Record<string, StudentStatus> = {};
        students.forEach(student => {
          initialStatuses[student.id] = {
            student_id: student.id,
            status: 'present',
          };
        });
        setStudentStatuses(initialStatuses);
        setIsCreatingAttendance(false);
        toast.success('Session d\'appel créée');
      }
    } catch (error) {
      console.error('Error creating attendance:', error);
    }
  };

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        status,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    if (!currentAttendanceId) {
      toast.error('Aucune session d\'appel en cours');
      return;
    }

    setSaving(true);
    try {
      const entries = Object.values(studentStatuses);
      await saveAttendanceEntries(currentAttendanceId, entries);

      setCurrentAttendanceId(null);
      setStudentStatuses({});
      setCourseName('');
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = Object.values(studentStatuses).filter(s => s.status === 'present').length;
  const absentCount = Object.values(studentStatuses).filter(s => s.status === 'absent').length;
  const lateCount = Object.values(studentStatuses).filter(s => s.status === 'late').length;
  const excusedCount = Object.values(studentStatuses).filter(s => s.status === 'excused').length;

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
            <CartoonEmoji type="checkmark" className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2>Appel / Absences</h2>
            <p className="text-muted-foreground">Sélectionnez une classe pour commencer</p>
          </div>
        </div>

        <Card className="p-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg font-medium mb-2">Choisissez une classe</p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une classe pour gérer les présences
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
          <CartoonEmoji type="checkmark" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Appel / Absences</h2>
          <p className="text-muted-foreground">
            Gérer les présences et absences
          </p>
        </div>
        {!currentAttendanceId && user?.role === 'teacher' && (
          <Button
            onClick={() => setIsCreatingAttendance(true)}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel appel
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

      {currentAttendanceId ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                  {students.length}
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-success/10 border-success/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-success">Présents</p>
                  <p className="text-2xl font-bold text-success">{presentCount}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
            </Card>
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-destructive">Absents</p>
                  <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                </div>
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
            </Card>
            <Card className="p-4 bg-warning/10 border-warning/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warning">Retards</p>
                  <p className="text-2xl font-bold text-warning">{lateCount}</p>
                </div>
                <Clock className="w-10 h-10 text-warning" />
              </div>
            </Card>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un élève..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <Card className="p-6">
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const status = studentStatuses[student.id]?.status;
                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      status === 'present'
                        ? 'border-success bg-success/5'
                        : status === 'absent'
                        ? 'border-destructive bg-destructive/5'
                        : status === 'late'
                        ? 'border-warning bg-warning/5'
                        : status === 'excused'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-muted hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          {student.email && (
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {status && (
                          <Badge
                            variant={
                              status === 'present'
                                ? 'default'
                                : status === 'absent'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={
                              status === 'present'
                                ? 'bg-success'
                                : status === 'late'
                                ? 'bg-warning'
                                : status === 'excused'
                                ? 'bg-blue-500'
                                : ''
                            }
                          >
                            {status === 'present'
                              ? 'Présent'
                              : status === 'absent'
                              ? 'Absent'
                              : status === 'late'
                              ? 'Retard'
                              : 'Justifié'}
                          </Badge>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={status === 'present' ? 'default' : 'outline'}
                            className={status === 'present' ? 'bg-success hover:bg-success/90' : ''}
                            onClick={() => updateStudentStatus(student.id, 'present')}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'late' ? 'default' : 'outline'}
                            className={status === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                            onClick={() => updateStudentStatus(student.id, 'late')}
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => updateStudentStatus(student.id, 'absent')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentAttendanceId(null);
                setStudentStatuses({});
                setCourseName('');
              }}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveAttendance}
              disabled={saving}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer l\'appel'
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-150 border-2 border-white/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Appels effectués</p>
                  <p className="text-2xl font-bold text-blue-900">{attendanceRecords.length}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            {attendanceRecords.length > 0 && (
              <>
                <Card className="p-4 bg-gradient-to-br from-success/20 to-success/10 border-2 border-white/50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-success">Taux de présence</p>
                      <p className="text-2xl font-bold text-success">
                        {Math.round(
                          (attendanceRecords.reduce((sum, record) => {
                            const stats = getAttendanceStats(record.id);
                            return sum + (stats.total > 0 ? (stats.present / stats.total) * 100 : 0);
                          }, 0) / attendanceRecords.length)
                        )}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-white/50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-destructive">Absences totales</p>
                      <p className="text-2xl font-bold text-destructive">
                        {attendanceRecords.reduce((sum, record) => {
                          const stats = getAttendanceStats(record.id);
                          return sum + stats.absent;
                        }, 0)}
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-destructive" />
                  </div>
                </Card>
              </>
            )}
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Historique des appels</h3>
            {attendanceRecords.length > 0 ? (
              <div className="space-y-3">
                {attendanceRecords.slice(0, 10).map((record) => {
                  const stats = getAttendanceStats(record.id);
                  return (
                    <div
                      key={record.id}
                      className="p-4 rounded-lg border-2 border-muted hover:border-border transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{record.course_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-success">{stats.present} présents</Badge>
                            <Badge variant="destructive">{stats.absent} absents</Badge>
                            {stats.late > 0 && (
                              <Badge className="bg-warning">{stats.late} retards</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun appel effectué pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cliquez sur "Nouvel appel" pour commencer
                </p>
              </div>
            )}
          </Card>
        </>
      )}

      <Dialog open={isCreatingAttendance} onOpenChange={setIsCreatingAttendance}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nouvel appel</DialogTitle>
            <DialogDescription>
              Créer une nouvelle session d'appel pour la classe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom du cours</Label>
              <Input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Ex: Mathématiques"
                className="rounded-xl mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreatingAttendance(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateAttendance}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer l'appel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
