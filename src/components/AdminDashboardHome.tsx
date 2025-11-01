import { useState } from 'react';
import { CartoonEmoji } from './CartoonEmoji';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Users,
  GraduationCap,
  UserCheck,
  TrendingUp,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardStats } from '../hooks/useDashboardStats';

interface AdminDashboardHomeProps {
  onNavigate?: (view: string) => void;
}

export function AdminDashboardHome({ onNavigate }: AdminDashboardHomeProps) {
  const { session, user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const dashboardStats = useDashboardStats();

  const handleSyncUsers = async () => {
    if (!session) return;

    setSyncing(true);
    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9846636e`;
      const response = await fetch(`${serverUrl}/users/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync users');
      }

      toast.success(`Synchronisation réussie: ${data.synced} utilisateurs synchronisés`);
    } catch (error) {
      console.error('Error syncing users:', error);
      toast.error('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const stats = [
    {
      title: "Élèves inscrits",
      value: dashboardStats.loading ? '...' : dashboardStats.totalStudents.toString(),
      change: dashboardStats.totalStudents > 0 ? `${dashboardStats.totalStudents} élèves actifs` : 'Aucun élève',
      trend: "up",
      icon: GraduationCap,
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Parents connectés",
      value: dashboardStats.loading ? '...' : `${dashboardStats.connectedParentsRate}%`,
      change: `${dashboardStats.totalParents} parents inscrits`,
      trend: dashboardStats.connectedParentsRate >= 70 ? "up" : "stable",
      icon: Users,
      color: "from-green-400 to-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Enseignants actifs",
      value: dashboardStats.loading ? '...' : `${dashboardStats.activeTeachers}/${dashboardStats.totalTeachers}`,
      change: dashboardStats.totalTeachers > 0 ? `${Math.round((dashboardStats.activeTeachers / dashboardStats.totalTeachers) * 100)}% cette semaine` : 'Aucun enseignant',
      trend: "stable",
      icon: UserCheck,
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Moyenne générale",
      value: dashboardStats.loading ? '...' : dashboardStats.averageGrade ? `${dashboardStats.averageGrade}/20` : 'N/A',
      change: dashboardStats.averageGrade ? 'Notes enregistrées' : 'Aucune note',
      trend: dashboardStats.averageGrade && dashboardStats.averageGrade >= 12 ? "up" : "stable",
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-admin-primary/10 via-admin-accent-green/10 to-admin-accent-orange/10 border-admin-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <CartoonEmoji type="wave" className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-admin-text mb-1">Bienvenue, {user?.name || 'Administrateur'}</h2>
              <p className="text-admin-text-light">
                Voici un aperçu de l'activité de votre établissement
              </p>
            </div>
          </div>
          <Button
            onClick={handleSyncUsers}
            disabled={syncing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronisation...' : 'Synchroniser les utilisateurs'}
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      {dashboardStats.loading ? (
        <Card className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
          <span>Chargement des statistiques...</span>
        </Card>
      ) : dashboardStats.error ? (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-800 font-semibold">Erreur lors du chargement des statistiques</p>
          <p className="text-red-600 text-sm mt-1">{dashboardStats.error}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-admin-border hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-admin-text-light mb-1">{stat.title}</p>
                    <h3 className="text-3xl text-admin-text mb-1">{stat.value}</h3>
                    <div className="flex items-center gap-1 text-xs">
                      {stat.trend === 'up' && (
                        <TrendingUp className="w-3 h-3 text-admin-accent-green" />
                      )}
                      <span className="text-admin-text-light">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-admin-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-admin-text">Activité récente</h3>
          </div>
          <div className="text-center py-8 text-admin-text-light">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune activité récente</p>
            <p className="text-xs mt-1">Les activités apparaîtront ici</p>
          </div>
        </Card>

        {/* Pending Actions */}
        <Card className="border-admin-border p-6">
          <h3 className="text-admin-text mb-4">Actions en attente</h3>
          <div className="text-center py-8 text-admin-text-light">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune action en attente</p>
            <p className="text-xs mt-1">Tout est à jour</p>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="border-admin-border p-6">
        <h3 className="text-admin-text mb-4">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary"
            onClick={() => onNavigate?.('users')}
          >
            <Users className="w-5 h-5 text-admin-primary" />
            <span className="text-sm">Ajouter un élève</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary"
            onClick={() => onNavigate?.('classes')}
          >
            <GraduationCap className="w-5 h-5 text-admin-accent-green" />
            <span className="text-sm">Créer une classe</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary"
            onClick={() => onNavigate?.('messaging')}
          >
            <Calendar className="w-5 h-5 text-admin-accent-orange" />
            <span className="text-sm">Envoyer un message</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary"
            onClick={() => onNavigate?.('grades')}
          >
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm">Voir les rapports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
