import { useState, useEffect } from 'react';
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
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { UserPlus, Search, Edit, Trash2, Mail, Phone, Users, GraduationCap, Heart, MoreHorizontal, Filter, Key, ChevronsUpDown, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  auth_user_id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'parent' | 'student' | 'admin';
  class?: string;
  subject?: string;
  children?: string[];
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export function UserManagementView() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'parent' | 'student'>('student');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    subject: '',
    children: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Fetch users from database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);

      const studentsList = (data || []).filter(u => u.role === 'student');
      setStudents(studentsList);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUsersByRole = (role: 'teacher' | 'parent' | 'student') => {
    return filteredUsers.filter(user => user.role === role);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      class: '',
      subject: '',
      children: '',
      status: 'active'
    });
    setSelectedChildren([]);
    setEditingUser(null);
  };

  const handleAddUser = async () => {
    try {
      const userData: any = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        role: selectedRole,
        status: formData.status
      };

      if (selectedRole === 'teacher') {
        userData.subject = formData.subject || null;
        userData.class = formData.class || null;
      }

      if (selectedRole === 'student') {
        userData.class = formData.class || null;
      }

      if (selectedRole === 'parent' && selectedChildren.length > 0) {
        userData.children = selectedChildren;
      }

      const { error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) throw error;

      toast.success('Utilisateur ajouté avec succès');
      setIsAddDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const userData: any = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        status: formData.status
      };

      if (editingUser.role === 'teacher') {
        userData.subject = formData.subject || null;
        userData.class = formData.class || null;
      }

      if (editingUser.role === 'student') {
        userData.class = formData.class || null;
      }

      if (editingUser.role === 'parent' && selectedChildren.length > 0) {
        userData.children = selectedChildren;
      }

      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', editingUser.id);

      if (error) throw error;

      toast.success('Utilisateur modifié avec succès');
      setIsEditDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error('Erreur lors de la modification de l\'utilisateur');
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success(`${userName} a été supprimé`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de l\'utilisateur');
      console.error('Error deleting user:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword || !session) return;

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setResettingPassword(true);

    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9846636e`;
      const response = await fetch(`${serverUrl}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auth_user_id: resetPasswordUser.auth_user_id,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast.success(`Mot de passe réinitialisé pour ${resetPasswordUser.name}`);
      setIsResetPasswordDialogOpen(false);
      setResetPasswordUser(null);
      setNewPassword('');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setResettingPassword(false);
    }
  };

  const openResetPasswordDialog = (user: User) => {
    if (user.role === 'admin') {
      toast.error('Impossible de réinitialiser le mot de passe d\'un administrateur');
      return;
    }
    setResetPasswordUser(user);
    setNewPassword('');
    setIsResetPasswordDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      class: user.class || '',
      subject: user.subject || '',
      children: user.children?.join(', ') || '',
      status: user.status
    });
    setSelectedChildren(user.children || []);
    setIsEditDialogOpen(true);
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
                <Input
                  id="name"
                  placeholder="Ex: Yasmine Alaoui"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {selectedRole !== 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="06XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </>
              )}

              {selectedRole === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Matière principale</Label>
                    <Input
                      id="subject"
                      placeholder="Ex: Mathématiques"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Classe</Label>
                    <Input
                      id="class"
                      placeholder="Ex: CM2-A"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    />
                  </div>
                </>
              )}

              {selectedRole === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="class">Classe</Label>
                  <Select value={formData.class} onValueChange={(val) => setFormData({...formData, class: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CM2-A">CM2-A</SelectItem>
                      <SelectItem value="CM2-B">CM2-B</SelectItem>
                      <SelectItem value="CM1-A">CM1-A</SelectItem>
                      <SelectItem value="CE2-B">CE2-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedRole === 'parent' && (
                <div className="space-y-2">
                  <Label>Enfants</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedChildren.length > 0
                          ? `${selectedChildren.length} enfant(s) sélectionné(s)`
                          : "Sélectionner les enfants"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un élève..." />
                        <CommandEmpty>Aucun élève trouvé.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {students.map((student) => (
                            <CommandItem
                              key={student.id}
                              value={student.name}
                              onSelect={() => {
                                setSelectedChildren(prev =>
                                  prev.includes(student.id)
                                    ? prev.filter(id => id !== student.id)
                                    : [...prev, student.id]
                                );
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Checkbox
                                  checked={selectedChildren.includes(student.id)}
                                  onCheckedChange={() => {}}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{student.name}</div>
                                  {student.class && (
                                    <div className="text-xs text-muted-foreground">{student.class}</div>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleAddUser} className="bg-admin-primary hover:bg-admin-primary-hover text-white">
                Créer le profil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier un utilisateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom complet</Label>
                <Input
                  id="edit-name"
                  placeholder="Ex: Yasmine Alaoui"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {editingUser?.role !== 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Téléphone</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      placeholder="06XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </>
              )}

              {editingUser?.role === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-subject">Matière principale</Label>
                    <Input
                      id="edit-subject"
                      placeholder="Ex: Mathématiques"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-class">Classe</Label>
                    <Input
                      id="edit-class"
                      placeholder="Ex: CM2-A"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    />
                  </div>
                </>
              )}

              {editingUser?.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Classe</Label>
                  <Select value={formData.class} onValueChange={(val) => setFormData({...formData, class: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CM2-A">CM2-A</SelectItem>
                      <SelectItem value="CM2-B">CM2-B</SelectItem>
                      <SelectItem value="CM1-A">CM1-A</SelectItem>
                      <SelectItem value="CE2-B">CE2-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {editingUser?.role === 'parent' && (
                <div className="space-y-2">
                  <Label>Enfants</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedChildren.length > 0
                          ? `${selectedChildren.length} enfant(s) sélectionné(s)`
                          : "Sélectionner les enfants"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un élève..." />
                        <CommandEmpty>Aucun élève trouvé.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {students.map((student) => (
                            <CommandItem
                              key={student.id}
                              value={student.name}
                              onSelect={() => {
                                setSelectedChildren(prev =>
                                  prev.includes(student.id)
                                    ? prev.filter(id => id !== student.id)
                                    : [...prev, student.id]
                                );
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Checkbox
                                  checked={selectedChildren.includes(student.id)}
                                  onCheckedChange={() => {}}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{student.name}</div>
                                  {student.class && (
                                    <div className="text-xs text-muted-foreground">{student.class}</div>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleEditUser} className="bg-admin-primary hover:bg-admin-primary-hover text-white">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
              <DialogDescription>
                Définissez un nouveau mot de passe pour {resetPasswordUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <p className="text-xs text-admin-text-light">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetPasswordDialogOpen(false)}
                disabled={resettingPassword}
              >
                Annuler
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={resettingPassword || !newPassword}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {resettingPassword ? 'Réinitialisation...' : 'Réinitialiser'}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-admin-bg"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4 text-admin-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-amber-100"
                          onClick={() => openResetPasswordDialog(user)}
                        >
                          <Key className="w-4 h-4 text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-admin-danger/10"
                          onClick={() => handleDeleteUser(user.id, user.name)}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-admin-bg"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4 text-admin-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-amber-100"
                          onClick={() => openResetPasswordDialog(user)}
                        >
                          <Key className="w-4 h-4 text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-admin-danger/10"
                          onClick={() => handleDeleteUser(user.id, user.name)}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-admin-bg"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4 text-admin-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-amber-100"
                          onClick={() => openResetPasswordDialog(user)}
                        >
                          <Key className="w-4 h-4 text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-admin-danger/10"
                          onClick={() => handleDeleteUser(user.id, user.name)}
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
