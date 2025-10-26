import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
import { UserPlus, Search, Edit, Trash2, Mail, Phone, Users, GraduationCap, Heart, MoreHorizontal, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'parent' | 'student';
  class?: string;
  subject?: string;
  children?: string[];
  status?: 'active' | 'inactive';
}

export function UserManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'parent' | 'student'>('student');

  const [users] = useState<User[]>([
    // Teachers
    { id: 1, name: 'Mme Benali', email: 'benali@madrasati.ma', phone: '0612345678', role: 'teacher', class: 'CM2-A', subject: 'Mathématiques', status: 'active' },
    { id: 2, name: 'M. El Amrani', email: 'elamrani@madrasati.ma', phone: '0612345679', role: 'teacher', class: 'CE2-B', subject: 'Français', status: 'active' },
    { id: 3, name: 'Mme Chakir', email: 'chakir@madrasati.ma', phone: '0612345680', role: 'teacher', class: 'CM1-A', subject: 'Sciences', status: 'active' },
    
    // Parents
    { id: 11, name: 'M. Alaoui', email: 'alaoui@email.com', phone: '0623456789', role: 'parent', children: ['Yasmine Alaoui', 'Mehdi Alaoui'], status: 'active' },
    { id: 12, name: 'Mme Benjelloun', email: 'benjelloun@email.com', phone: '0623456790', role: 'parent', children: ['Sara Benjelloun'], status: 'active' },
    { id: 13, name: 'M. Tazi', email: 'tazi@email.com', phone: '0623456791', role: 'parent', children: ['Omar Tazi'], status: 'inactive' },
    
    // Students
    { id: 21, name: 'Yasmine Alaoui', email: '', phone: '', role: 'student', class: 'CM2-A', status: 'active' },
    { id: 22, name: 'Mehdi Alaoui', email: '', phone: '', role: 'student', class: 'CE2-B', status: 'active' },
    { id: 23, name: 'Sara Benjelloun', email: '', phone: '', role: 'student', class: 'CM2-A', status: 'active' },
    { id: 24, name: 'Omar Tazi', email: '', phone: '', role: 'student', class: 'CM1-A', status: 'active' },
    { id: 25, name: 'Fatima Idrissi', email: '', phone: '', role: 'student', class: 'CM2-A', status: 'active' },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUsersByRole = (role: 'teacher' | 'parent' | 'student') => {
    return filteredUsers.filter(user => user.role === role);
  };

  const handleAddUser = () => {
    toast.success('Utilisateur ajouté avec succès');
    setIsAddDialogOpen(false);
  };

  const handleDeleteUser = (userName: string) => {
    toast.success(`${userName} a été supprimé`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-admin-text">Gestion des utilisateurs</h2>
          <p className="text-admin-text-light">
            Gérez les profils des enseignants, parents et élèves
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin-primary hover:bg-admin-primary-hover text-white gap-2">
              <UserPlus className="w-5 h-5" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau profil pour un enseignant, parent ou élève
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role">Type de profil</Label>
                <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Élève</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Enseignant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Ex: Yasmine Alaoui" />
              </div>

              {selectedRole !== 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="exemple@email.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" placeholder="06XXXXXXXX" />
                  </div>
                </>
              )}

              {selectedRole === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Matière principale</Label>
                    <Input id="subject" placeholder="Ex: Mathématiques" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Classe</Label>
                    <Input id="class" placeholder="Ex: CM2-A" />
                  </div>
                </>
              )}

              {selectedRole === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="class">Classe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm2-a">CM2-A</SelectItem>
                      <SelectItem value="cm2-b">CM2-B</SelectItem>
                      <SelectItem value="cm1-a">CM1-A</SelectItem>
                      <SelectItem value="ce2-b">CE2-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddUser} className="bg-admin-primary hover:bg-admin-primary-hover text-white">
                Créer le profil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="border-admin-border p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-light" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-admin-border"
            />
          </div>
          <Button variant="outline" className="border-admin-border gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Enseignants</p>
              <h3 className="text-3xl text-admin-text">{getUsersByRole('teacher').length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Parents</p>
              <h3 className="text-3xl text-admin-text">{getUsersByRole('parent').length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Élèves</p>
              <h3 className="text-3xl text-admin-text">{getUsersByRole('student').length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Users Tables by Role */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="bg-admin-bg border border-admin-border">
          <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:text-admin-primary">
            Élèves ({getUsersByRole('student').length})
          </TabsTrigger>
          <TabsTrigger value="parents" className="data-[state=active]:bg-white data-[state=active]:text-admin-primary">
            Parents ({getUsersByRole('parent').length})
          </TabsTrigger>
          <TabsTrigger value="teachers" className="data-[state=active]:bg-white data-[state=active]:text-admin-primary">
            Enseignants ({getUsersByRole('teacher').length})
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <Card className="border-admin-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-bg hover:bg-admin-bg">
                  <TableHead className="text-admin-text">Nom</TableHead>
                  <TableHead className="text-admin-text">Classe</TableHead>
                  <TableHead className="text-admin-text">Statut</TableHead>
                  <TableHead className="text-admin-text text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getUsersByRole('student').map(user => (
                  <TableRow key={user.id} className="hover:bg-admin-bg/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-amber-300">
                          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-admin-text">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-admin-border">{user.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'active' ? 'bg-admin-accent-green' : 'bg-admin-text-light'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
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
                          onClick={() => handleDeleteUser(user.name)}
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
        </TabsContent>

        {/* Parents Tab */}
        <TabsContent value="parents" className="mt-4">
          <Card className="border-admin-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-bg hover:bg-admin-bg">
                  <TableHead className="text-admin-text">Nom</TableHead>
                  <TableHead className="text-admin-text">Contact</TableHead>
                  <TableHead className="text-admin-text">Enfants</TableHead>
                  <TableHead className="text-admin-text">Statut</TableHead>
                  <TableHead className="text-admin-text text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getUsersByRole('parent').map(user => (
                  <TableRow key={user.id} className="hover:bg-admin-bg/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-blue-300">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-500 text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-admin-text">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-admin-text-light">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-admin-text-light">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-admin-text">
                        {user.children?.join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'active' ? 'bg-admin-accent-green' : 'bg-admin-text-light'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
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
                          onClick={() => handleDeleteUser(user.name)}
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
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="mt-4">
          <Card className="border-admin-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-bg hover:bg-admin-bg">
                  <TableHead className="text-admin-text">Nom</TableHead>
                  <TableHead className="text-admin-text">Contact</TableHead>
                  <TableHead className="text-admin-text">Matière</TableHead>
                  <TableHead className="text-admin-text">Classe</TableHead>
                  <TableHead className="text-admin-text">Statut</TableHead>
                  <TableHead className="text-admin-text text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getUsersByRole('teacher').map(user => (
                  <TableRow key={user.id} className="hover:bg-admin-bg/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-purple-300">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500 text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-admin-text">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-admin-text-light">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-admin-text-light">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.subject}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-admin-border">{user.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'active' ? 'bg-admin-accent-green' : 'bg-admin-text-light'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
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
                          onClick={() => handleDeleteUser(user.name)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
