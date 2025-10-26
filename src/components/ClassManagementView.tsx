import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Plus, Search, Edit, Trash2, Users, BookOpen, MoreHorizontal, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';

interface Class {
  id: string;
  name: string;
  level: string;
  teacher_id: string | null;
  teacher_name: string | null;
  student_count: number;
  subjects: string[];
  room: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  class_id: string | null;
  class?: string | null;
}

interface Parent {
  id: string;
  name: string;
  children: string[];
}

export function ClassManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAssignStudentsDialogOpen, setIsAssignStudentsDialogOpen] = useState(false);
  const [selectedClassForAssignment, setSelectedClassForAssignment] = useState<Class | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    level: '',
    teacher_id: '',
    room: '',
    subjects: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClasses(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des classes');
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .eq('role', 'teacher')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, class_id, class')
        .eq('role', 'student')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cls.teacher_name && cls.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      name: '',
      level: '',
      teacher_id: '',
      room: '',
      subjects: ''
    });
    setEditingClass(null);
  };

  const handleCreateClass = async () => {
    try {
      const teacherName = teachers.find(t => t.id === formData.teacher_id)?.name || null;
      const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);

      const { error } = await supabase
        .from('classes')
        .insert([{
          name: formData.name,
          level: formData.level,
          teacher_id: formData.teacher_id || null,
          teacher_name: teacherName,
          room: formData.room || null,
          subjects: subjectsArray
        }]);

      if (error) throw error;

      toast.success('Classe créée avec succès');
      setIsCreateDialogOpen(false);
      resetForm();
      await fetchClasses();
      await updateClassStudentCounts();
    } catch (error: any) {
      toast.error('Erreur lors de la création de la classe');
      console.error('Error creating class:', error);
    }
  };

  const handleEditClass = async () => {
    if (!editingClass) return;

    try {
      const teacherName = teachers.find(t => t.id === formData.teacher_id)?.name || null;
      const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);

      const { error } = await supabase
        .from('classes')
        .update({
          name: formData.name,
          level: formData.level,
          teacher_id: formData.teacher_id || null,
          teacher_name: teacherName,
          room: formData.room || null,
          subjects: subjectsArray
        })
        .eq('id', editingClass.id);

      if (error) throw error;

      toast.success('Classe modifiée avec succès');
      setIsEditDialogOpen(false);
      resetForm();
      await fetchClasses();
      await updateClassStudentCounts();
    } catch (error: any) {
      toast.error('Erreur lors de la modification de la classe');
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (classId: string, className: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${className} ?`)) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      toast.success(`${className} a été supprimée`);
      await fetchClasses();
      await updateClassStudentCounts();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la classe');
      console.error('Error deleting class:', error);
    }
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      level: cls.level,
      teacher_id: cls.teacher_id || '',
      room: cls.room || '',
      subjects: cls.subjects?.join(', ') || ''
    });
    setIsEditDialogOpen(true);
  };

  const openAssignStudentsDialog = (cls: Class) => {
    setSelectedClassForAssignment(cls);
    const studentsInClass = students.filter(s => s.class_id === cls.id).map(s => s.id);
    setSelectedStudents(studentsInClass);
    setIsAssignStudentsDialogOpen(true);
  };

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const updateClassStudentCounts = async () => {
    try {
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id');

      if (classesError) throw classesError;

      for (const cls of classesData || []) {
        const { count, error: countError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('class_id', cls.id)
          .eq('role', 'student');

        if (countError) {
          console.error('Error counting students:', countError);
          continue;
        }

        await supabase
          .from('classes')
          .update({ student_count: count || 0 })
          .eq('id', cls.id);
      }
    } catch (error) {
      console.error('Error updating class student counts:', error);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedClassForAssignment) return;

    setAssignmentLoading(true);

    try {
      const currentClassStudents = students.filter(s => s.class_id === selectedClassForAssignment.id);
      const studentsToRemove = currentClassStudents
        .filter(s => !selectedStudents.includes(s.id))
        .map(s => s.id);
      const studentsToAdd = selectedStudents.filter(
        id => !currentClassStudents.some(s => s.id === id)
      );

      if (studentsToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('users')
          .update({ class_id: null, class: null })
          .in('id', studentsToRemove);

        if (removeError) throw removeError;
      }

      if (studentsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from('users')
          .update({
            class_id: selectedClassForAssignment.id,
            class: selectedClassForAssignment.name
          })
          .in('id', studentsToAdd);

        if (addError) throw addError;
      }

      await updateClassStudentCounts();
      await fetchClasses();
      await fetchStudents();

      toast.success('Élèves assignés avec succès');
      setIsAssignStudentsDialogOpen(false);
      setSelectedClassForAssignment(null);
      setSelectedStudents([]);
    } catch (error: any) {
      toast.error('Erreur lors de l\'assignation des élèves');
      console.error('Error assigning students:', error);
    } finally {
      setAssignmentLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-admin-text">Gestion des classes</h2>
          <p className="text-admin-text-light">
            Gérez les classes et leurs affectations
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin-primary hover:bg-admin-primary-hover text-white gap-2">
              <Plus className="w-5 h-5" />
              Créer une classe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle classe</DialogTitle>
              <DialogDescription>
                Configurez les informations de la classe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Nom de la classe</Label>
                <Input
                  id="className"
                  placeholder="Ex: CM2-A"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Select value={formData.level} onValueChange={(val) => setFormData({...formData, level: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CP">CP</SelectItem>
                    <SelectItem value="CE1">CE1</SelectItem>
                    <SelectItem value="CE2">CE2</SelectItem>
                    <SelectItem value="CM1">CM1</SelectItem>
                    <SelectItem value="CM2">CM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Enseignant principal</Label>
                <Select value={formData.teacher_id} onValueChange={(val) => setFormData({...formData, teacher_id: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Salle</Label>
                <Input
                  id="room"
                  placeholder="Ex: Salle 201"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjects">Matières (séparées par des virgules)</Label>
                <Input
                  id="subjects"
                  placeholder="Ex: Mathématiques, Français, Sciences"
                  value={formData.subjects}
                  onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleCreateClass} className="bg-admin-primary hover:bg-admin-primary-hover text-white">
                Créer la classe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Class Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier la classe</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la classe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-className">Nom de la classe</Label>
                <Input
                  id="edit-className"
                  placeholder="Ex: CM2-A"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-level">Niveau</Label>
                <Select value={formData.level} onValueChange={(val) => setFormData({...formData, level: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CP">CP</SelectItem>
                    <SelectItem value="CE1">CE1</SelectItem>
                    <SelectItem value="CE2">CE2</SelectItem>
                    <SelectItem value="CM1">CM1</SelectItem>
                    <SelectItem value="CM2">CM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-teacher">Enseignant principal</Label>
                <Select value={formData.teacher_id} onValueChange={(val) => setFormData({...formData, teacher_id: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-room">Salle</Label>
                <Input
                  id="edit-room"
                  placeholder="Ex: Salle 201"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subjects">Matières (séparées par des virgules)</Label>
                <Input
                  id="edit-subjects"
                  placeholder="Ex: Mathématiques, Français, Sciences"
                  value={formData.subjects}
                  onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleEditClass} className="bg-admin-primary hover:bg-admin-primary-hover text-white">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Students Dialog */}
        <Dialog open={isAssignStudentsDialogOpen} onOpenChange={(open) => {
          setIsAssignStudentsDialogOpen(open);
          if (!open) {
            setSelectedClassForAssignment(null);
            setSelectedStudents([]);
          }
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Assigner des élèves à {selectedClassForAssignment?.name}</DialogTitle>
              <DialogDescription>
                Sélectionnez les élèves à assigner à cette classe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 overflow-y-auto max-h-[50vh]">
              {students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun élève disponible</p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => handleStudentSelection(student.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium">{student.name}</span>
                        {student.class_id && student.class_id !== selectedClassForAssignment?.id && (
                          <Badge variant="outline" className="ml-2">
                            {student.class || 'Autre classe'}
                          </Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignStudentsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleAssignStudents}
                disabled={assignmentLoading}
                className="bg-admin-primary hover:bg-admin-primary-hover text-white"
              >
                {assignmentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assignation...
                  </>
                ) : (
                  <>
                    Assigner {selectedStudents.length} élève{selectedStudents.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="border-admin-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-light" />
          <Input
            placeholder="Rechercher une classe ou un enseignant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-admin-border"
          />
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Total des classes</p>
              <h3 className="text-3xl text-admin-text">{classes.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Total élèves</p>
              <h3 className="text-3xl text-admin-text">
                {classes.reduce((sum, cls) => sum + cls.student_count, 0)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Moyenne par classe</p>
              <h3 className="text-3xl text-admin-text">
                {classes.length > 0 ? Math.round(classes.reduce((sum, cls) => sum + cls.student_count, 0) / classes.length) : 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Classes Table */}
      <Card className="border-admin-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-bg hover:bg-admin-bg">
              <TableHead className="text-admin-text">Classe</TableHead>
              <TableHead className="text-admin-text">Niveau</TableHead>
              <TableHead className="text-admin-text">Enseignant</TableHead>
              <TableHead className="text-admin-text">Élèves</TableHead>
              <TableHead className="text-admin-text">Salle</TableHead>
              <TableHead className="text-admin-text">Matières</TableHead>
              <TableHead className="text-admin-text text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((cls) => (
              <TableRow key={cls.id} className="hover:bg-admin-bg/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-admin-primary to-admin-accent-green flex items-center justify-center text-white font-medium">
                      {cls.name.substring(0, 2)}
                    </div>
                    <span className="font-medium text-admin-text">{cls.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-admin-border">
                    {cls.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-admin-text">{cls.teacher_name || 'Non assigné'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-admin-text-light" />
                    <span className="text-admin-text">{cls.student_count}</span>
                  </div>
                </TableCell>
                <TableCell className="text-admin-text-light">{cls.room}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.slice(0, 2).map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {cls.subjects.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{cls.subjects.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-admin-bg"
                      onClick={() => openEditDialog(cls)}
                    >
                      <Edit className="w-4 h-4 text-admin-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-admin-danger/10"
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                    >
                      <Trash2 className="w-4 h-4 text-admin-danger" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-admin-bg"
                      onClick={() => openAssignStudentsDialog(cls)}
                    >
                      <UserPlus className="w-4 h-4 text-admin-text-light" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
