import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Search,
  Send,
  AlertCircle,
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
import { toast } from 'sonner@2.0.3';

interface Student {
  id: number;
  name: string;
  parentEmail: string;
  status?: 'present' | 'absent' | 'late';
}

interface AttendanceViewProps {
  courseId: number;
  courseName: string;
  courseTime: string;
  onBack: () => void;
}

export function AttendanceView({ courseId, courseName, courseTime, onBack }: AttendanceViewProps) {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Martin', parentEmail: 'parent.martin@email.com', status: undefined },
    { id: 2, name: 'Bob Dubois', parentEmail: 'parent.dubois@email.com', status: undefined },
    { id: 3, name: 'Clara Petit', parentEmail: 'parent.petit@email.com', status: undefined },
    { id: 4, name: 'David Moreau', parentEmail: 'parent.moreau@email.com', status: undefined },
    { id: 5, name: 'Emma Bernard', parentEmail: 'parent.bernard@email.com', status: undefined },
    { id: 6, name: 'Félix Lambert', parentEmail: 'parent.lambert@email.com', status: undefined },
    { id: 7, name: 'Gabriel Rousseau', parentEmail: 'parent.rousseau@email.com', status: undefined },
    { id: 8, name: 'Hannah Lefebvre', parentEmail: 'parent.lefebvre@email.com', status: undefined },
    { id: 9, name: 'Inès Garnier', parentEmail: 'parent.garnier@email.com', status: undefined },
    { id: 10, name: 'Jules Faure', parentEmail: 'parent.faure@email.com', status: undefined },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [justificationNote, setJustificationNote] = useState('');

  const updateStudentStatus = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const sendJustificationRequest = (student: Student) => {
    // Simulate sending email to parent
    toast.success(`Demande de justification envoyée`, {
      description: `Email envoyé à ${student.parentEmail}`,
    });
    
    setShowJustificationDialog(false);
    setSelectedStudent(null);
    setJustificationNote('');
  };

  const handleAbsent = (student: Student) => {
    updateStudentStatus(student.id, 'absent');
    setSelectedStudent(student);
    setShowJustificationDialog(true);
  };

  const saveAttendance = () => {
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    const absentStudents = students.filter(s => s.status === 'absent');
    
    // Send justification requests to all absent students
    absentStudents.forEach(student => {
      toast.info(`Demande envoyée à ${student.name}`, {
        description: `Email envoyé à ${student.parentEmail}`,
      });
    });

    toast.success('Appel enregistré avec succès', {
      description: `${absentStudents.length} demande(s) de justification envoyée(s)`,
    });
    
    setShowConfirmDialog(false);
    setTimeout(() => onBack(), 1000);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="flex-1">
          <h2>Appel - {courseName}</h2>
          <p className="text-muted-foreground">{courseTime}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total</p>
              <h3>{students.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              {students.length}
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-success/10 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Présents</p>
              <h3 className="text-success">{presentCount}</h3>
            </div>
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
        </Card>
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Absents</p>
              <h3 className="text-destructive">{absentCount}</h3>
            </div>
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
        </Card>
        <Card className="p-4 bg-warning/10 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Retards</p>
              <h3 className="text-warning">{lateCount}</h3>
            </div>
            <Clock className="w-10 h-10 text-warning" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un élève..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Student List */}
      <Card className="p-6">
        <div className="space-y-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                student.status === 'present'
                  ? 'border-success bg-success/5'
                  : student.status === 'absent'
                  ? 'border-destructive bg-destructive/5'
                  : student.status === 'late'
                  ? 'border-warning bg-warning/5'
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
                    <p>{student.name}</p>
                    <p className="text-muted-foreground">{student.parentEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {student.status && (
                    <Badge
                      variant={
                        student.status === 'present'
                          ? 'default'
                          : student.status === 'absent'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={
                        student.status === 'present'
                          ? 'bg-success'
                          : student.status === 'late'
                          ? 'bg-warning'
                          : ''
                      }
                    >
                      {student.status === 'present'
                        ? 'Présent'
                        : student.status === 'absent'
                        ? 'Absent'
                        : 'Retard'}
                    </Badge>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      className={student.status === 'present' ? 'bg-success hover:bg-success/90' : ''}
                      onClick={() => updateStudentStatus(student.id, 'present')}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      className={student.status === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                      onClick={() => updateStudentStatus(student.id, 'late')}
                    >
                      <Clock className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      onClick={() => handleAbsent(student)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Annuler
        </Button>
        <Button
          className="bg-primary"
          onClick={saveAttendance}
          disabled={students.every(s => !s.status)}
        >
          Enregistrer l'appel
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'appel</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'enregistrer l'appel pour {courseName}.
              {absentCount > 0 && (
                <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <p className="text-warning">
                        {absentCount} élève(s) absent(s) détecté(s)
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Une demande de justification sera automatiquement envoyée aux parents.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmSave} className="bg-primary">
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Justification Request Dialog */}
      <Dialog open={showJustificationDialog} onOpenChange={setShowJustificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demande de justification</DialogTitle>
            <DialogDescription>
              {selectedStudent && `${selectedStudent.name} est marqué(e) absent(e). Une demande de justification sera envoyée à ${selectedStudent.parentEmail}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-muted-foreground">Note optionnelle pour les parents</label>
              <Textarea
                placeholder="Ajoutez une note pour les parents..."
                value={justificationNote}
                onChange={(e) => setJustificationNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowJustificationDialog(false);
                setSelectedStudent(null);
                setJustificationNote('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={() => selectedStudent && sendJustificationRequest(selectedStudent)}
              className="bg-primary"
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
