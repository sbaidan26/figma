import { useState } from 'react';
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
import { Plus, Search, Edit, Trash2, Users, BookOpen, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Class {
  id: number;
  name: string;
  level: string;
  teacher: string;
  studentCount: number;
  subjects: string[];
  room: string;
}

export function ClassManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [classes] = useState<Class[]>([
    {
      id: 1,
      name: 'CM2-A',
      level: 'CM2',
      teacher: 'Mme Benali',
      studentCount: 25,
      subjects: ['Mathématiques', 'Français', 'Sciences'],
      room: 'Salle 201'
    },
    {
      id: 2,
      name: 'CM2-B',
      level: 'CM2',
      teacher: 'M. Idrissi',
      studentCount: 23,
      subjects: ['Mathématiques', 'Français', 'Histoire'],
      room: 'Salle 202'
    },
    {
      id: 3,
      name: 'CM1-A',
      level: 'CM1',
      teacher: 'Mme Chakir',
      studentCount: 24,
      subjects: ['Sciences', 'Géographie'],
      room: 'Salle 103'
    },
    {
      id: 4,
      name: 'CE2-B',
      level: 'CE2',
      teacher: 'M. El Amrani',
      studentCount: 22,
      subjects: ['Français', 'Mathématiques'],
      room: 'Salle 104'
    }
  ]);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClass = () => {
    toast.success('Classe créée avec succès');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteClass = (className: string) => {
    toast.success(`${className} a été supprimée`);
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
                <Input id="className" placeholder="Ex: CM2-A" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cp">CP</SelectItem>
                    <SelectItem value="ce1">CE1</SelectItem>
                    <SelectItem value="ce2">CE2</SelectItem>
                    <SelectItem value="cm1">CM1</SelectItem>
                    <SelectItem value="cm2">CM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Enseignant principal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benali">Mme Benali</SelectItem>
                    <SelectItem value="elamrani">M. El Amrani</SelectItem>
                    <SelectItem value="chakir">Mme Chakir</SelectItem>
                    <SelectItem value="idrissi">M. Idrissi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Salle</Label>
                <Input id="room" placeholder="Ex: Salle 201" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateClass} className="bg-admin-primary hover:bg-admin-primary-hover text-white">
                Créer la classe
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
                {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
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
                {Math.round(classes.reduce((sum, cls) => sum + cls.studentCount, 0) / classes.length)}
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
                <TableCell className="text-admin-text">{cls.teacher}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-admin-text-light" />
                    <span className="text-admin-text">{cls.studentCount}</span>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-admin-bg">
                      <Edit className="w-4 h-4 text-admin-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-admin-danger/10"
                      onClick={() => handleDeleteClass(cls.name)}
                    >
                      <Trash2 className="w-4 h-4 text-admin-danger" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-admin-bg">
                      <MoreHorizontal className="w-4 h-4 text-admin-text-light" />
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
