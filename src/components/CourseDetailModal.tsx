import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  FileText,
  Calendar,
  Plus,
  Trash2,
  Send,
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  avatar: string;
}

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  submitted: number;
  total: number;
}

interface Course {
  id: number;
  subject: string;
  time: string;
  duration: string;
  color: string;
  room?: string;
  attendanceDone?: boolean;
}

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakeAttendance: (courseId: number) => void;
}

export function CourseDetailModal({
  course,
  open,
  onOpenChange,
  onTakeAttendance,
}: CourseDetailModalProps) {
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [showAddHomework, setShowAddHomework] = useState(false);

  if (!course) return null;

  // Mock data - classe et élèves
  const classInfo = {
    name: 'CM2-A',
    level: 'CM2',
    studentsCount: 24,
  };

  const students: Student[] = [
    { id: 1, name: 'Emma Dubois', avatar: '👧' },
    { id: 2, name: 'Lucas Martin', avatar: '👦' },
    { id: 3, name: 'Léa Bernard', avatar: '👧' },
    { id: 4, name: 'Noah Petit', avatar: '👦' },
    { id: 5, name: 'Chloé Durand', avatar: '👧' },
    { id: 6, name: 'Hugo Moreau', avatar: '👦' },
    { id: 7, name: 'Manon Laurent', avatar: '👧' },
    { id: 8, name: 'Louis Simon', avatar: '👦' },
  ];

  // Mock data - devoirs
  const [homeworks, setHomeworks] = useState<Homework[]>([
    {
      id: 1,
      title: 'Exercices page 45',
      description: 'Faire les exercices 1 à 5 page 45 du manuel',
      dueDate: '2025-10-25',
      submitted: 18,
      total: 24,
    },
    {
      id: 2,
      title: 'Lecture chapitre 3',
      description: 'Lire le chapitre 3 et préparer un résumé',
      dueDate: '2025-10-27',
      submitted: 12,
      total: 24,
    },
  ]);

  const handleAddHomework = () => {
    if (newHomework.title && newHomework.dueDate) {
      const homework: Homework = {
        id: Date.now(),
        title: newHomework.title,
        description: newHomework.description,
        dueDate: newHomework.dueDate,
        submitted: 0,
        total: classInfo.studentsCount,
      };
      setHomeworks([...homeworks, homework]);
      setNewHomework({ title: '', description: '', dueDate: '' });
      setShowAddHomework(false);
    }
  };

  const handleDeleteHomework = (id: number) => {
    setHomeworks(homeworks.filter((hw) => hw.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-accent/20 relative">
        {/* Décoration */}
        <div className="absolute top-4 right-4 text-4xl opacity-10 pointer-events-none">✨</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-10 pointer-events-none">🌙</div>
        
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge style={{ backgroundColor: course.color }} className="text-white shadow-lg border-2 border-white/20">
                📚 {course.subject}
              </Badge>
              {course.attendanceDone && (
                <Badge variant="outline" className="bg-success/10 text-success border-success shadow-md">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  ✅ Appel fait
                </Badge>
              )}
            </div>
          </div>
          <DialogTitle className="sr-only">Détails du cours</DialogTitle>
          <DialogDescription className="sr-only">
            Gérer les détails, ressources et devoirs du cours
          </DialogDescription>
        </DialogHeader>

        {/* Course Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <Card className="p-4 bg-gradient-to-br from-white to-muted/20 border-2 border-primary/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span>⏰</span>
              <span>Horaire</span>
            </div>
            <p>
              {course.time} - {course.duration}
            </p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-white to-muted/20 border-2 border-primary/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span>🚪</span>
              <span>Salle</span>
            </div>
            <p>{course.room || 'Non définie'}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-white to-muted/20 border-2 border-primary/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span>🎓</span>
              <span>Classe</span>
            </div>
            <p>{classInfo.name}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-white to-muted/20 border-2 border-primary/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span>👥</span>
              <span>Élèves</span>
            </div>
            <p>{classInfo.studentsCount} élèves</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="class" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="class" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              🎓 Classe
            </TabsTrigger>
            <TabsTrigger value="homework" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              📝 Devoirs
              {homeworks.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-accent text-white">
                  {homeworks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              ✅ Appel
            </TabsTrigger>
          </TabsList>

          {/* Classe Tab */}
          <TabsContent value="class" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3>Liste des élèves - {classInfo.name}</h3>
                <Badge>{classInfo.studentsCount} élèves</Badge>
              </div>
              <div className="grid gap-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span>{student.avatar}</span>
                    </div>
                    <span>{student.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Homework Tab */}
          <TabsContent value="homework" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Devoirs donnés</h3>
              <Button
                size="sm"
                onClick={() => setShowAddHomework(!showAddHomework)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un devoir
              </Button>
            </div>

            {showAddHomework && (
              <Card className="p-4 border-primary/50">
                <h4 className="mb-4">Nouveau devoir</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre du devoir</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Exercices page 45"
                      value={newHomework.title}
                      onChange={(e) =>
                        setNewHomework({ ...newHomework, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Détails du devoir..."
                      value={newHomework.description}
                      onChange={(e) =>
                        setNewHomework({
                          ...newHomework,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Date limite</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newHomework.dueDate}
                      onChange={(e) =>
                        setNewHomework({ ...newHomework, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddHomework}>
                      <Send className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddHomework(false);
                        setNewHomework({ title: '', description: '', dueDate: '' });
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {homeworks.length > 0 ? (
              <div className="space-y-3">
                {homeworks.map((homework) => (
                  <Card key={homework.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <h4>{homework.title}</h4>
                        </div>
                        {homework.description && (
                          <p className="text-muted-foreground mb-3">
                            {homework.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Pour le{' '}
                              {new Date(homework.dueDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {homework.submitted}/{homework.total} rendus
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteHomework(homework.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucun devoir pour ce cours</p>
              </Card>
            )}
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card className="p-4">
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="mb-2">Faire l'appel</h3>
                <p className="text-muted-foreground mb-6">
                  Cliquez sur le bouton ci-dessous pour ouvrir la feuille d'appel
                  complète
                </p>
                <Button
                  size="lg"
                  onClick={() => {
                    onTakeAttendance(course.id);
                    onOpenChange(false);
                  }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Ouvrir la feuille d'appel
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
