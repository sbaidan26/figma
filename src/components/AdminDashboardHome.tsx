import { CartoonEmoji } from './CartoonEmoji';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function AdminDashboardHome() {
  const stats = [
    {
      title: "Élèves inscrits",
      value: "245",
      change: "+12 ce mois",
      trend: "up",
      icon: GraduationCap,
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Parents connectés",
      value: "82%",
      change: "Taux de connexion",
      trend: "up",
      icon: Users,
      color: "from-green-400 to-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Enseignants actifs",
      value: "15/15",
      change: "100% cette semaine",
      trend: "stable",
      icon: UserCheck,
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Moyenne générale",
      value: "14.2/20",
      change: "+0.3 vs trimestre dernier",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Mme Benali",
      action: "a publié une nouvelle évaluation",
      class: "CM2-A",
      time: "Il y a 2h",
      type: "grade"
    },
    {
      id: 2,
      user: "M. Alaoui (parent)",
      action: "a signé le cahier de liaison",
      class: "CM2-A",
      time: "Il y a 3h",
      type: "liaison"
    },
    {
      id: 3,
      user: "Admin",
      action: "a créé 3 nouveaux comptes élèves",
      class: "CE2-B",
      time: "Il y a 5h",
      type: "user"
    },
    {
      id: 4,
      user: "M. El Amrani",
      action: "a mis à jour l'emploi du temps",
      class: "CE2-B",
      time: "Hier à 16:30",
      type: "schedule"
    }
  ];

  const pendingActions = [
    {
      id: 1,
      title: "Valider les absences",
      description: "3 demandes d'absence en attente de validation",
      priority: "high",
      count: 3
    },
    {
      id: 2,
      title: "Approuver les bulletins",
      description: "Les bulletins du 1er trimestre sont prêts",
      priority: "medium",
      count: 12
    },
    {
      id: 3,
      title: "Renouveler les licences",
      description: "2 applications nécessitent un renouvellement",
      priority: "low",
      count: 2
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-admin-primary/10 via-admin-accent-green/10 to-admin-accent-orange/10 border-admin-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <CartoonEmoji type="wave" className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-admin-text mb-1">Bienvenue, M. Alami</h2>
            <p className="text-admin-text-light">
              Voici un aperçu de l'activité de votre établissement
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-admin-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-admin-text">Activité récente</h3>
            <Button variant="ghost" size="sm" className="text-admin-primary hover:text-admin-primary-hover">
              Tout voir
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-admin-bg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-admin-bg flex items-center justify-center shrink-0 mt-1">
                  {activity.type === 'grade' && <CheckCircle2 className="w-5 h-5 text-admin-accent-green" />}
                  {activity.type === 'liaison' && <Calendar className="w-5 h-5 text-admin-primary" />}
                  {activity.type === 'user' && <Users className="w-5 h-5 text-admin-accent-orange" />}
                  {activity.type === 'schedule' && <Clock className="w-5 h-5 text-purple-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-admin-text">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.class}
                    </Badge>
                    <span className="text-xs text-admin-text-light">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Actions */}
        <Card className="border-admin-border p-6">
          <h3 className="text-admin-text mb-4">Actions en attente</h3>
          <div className="space-y-3">
            {pendingActions.map(action => (
              <div
                key={action.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm ${
                  action.priority === 'high'
                    ? 'border-admin-danger/30 bg-admin-danger/5'
                    : action.priority === 'medium'
                    ? 'border-admin-accent-orange/30 bg-admin-accent-orange/5'
                    : 'border-admin-border bg-admin-bg'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm text-admin-text">{action.title}</h4>
                  {action.priority === 'high' && (
                    <AlertCircle className="w-4 h-4 text-admin-danger shrink-0" />
                  )}
                </div>
                <p className="text-xs text-admin-text-light mb-3">{action.description}</p>
                <Button 
                  size="sm" 
                  className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white"
                >
                  Traiter ({action.count})
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="border-admin-border p-6">
        <h3 className="text-admin-text mb-4">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary">
            <Users className="w-5 h-5 text-admin-primary" />
            <span className="text-sm">Ajouter un élève</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary">
            <GraduationCap className="w-5 h-5 text-admin-accent-green" />
            <span className="text-sm">Créer une classe</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary">
            <Calendar className="w-5 h-5 text-admin-accent-orange" />
            <span className="text-sm">Envoyer un message</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm">Voir les rapports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
