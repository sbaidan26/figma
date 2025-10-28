import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
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
  Clock,
  RefreshCw,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';

export function AdminDashboardHome() {
  const { session } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const [emblaRefStats, emblaApiStats] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrevStats, setCanScrollPrevStats] = useState(false);
  const [canScrollNextStats, setCanScrollNextStats] = useState(false);

  const [emblaRefActivity, emblaApiActivity] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrevActivity, setCanScrollPrevActivity] = useState(false);
  const [canScrollNextActivity, setCanScrollNextActivity] = useState(false);

  const [emblaRefLinks, emblaApiLinks] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrevLinks, setCanScrollPrevLinks] = useState(false);
  const [canScrollNextLinks, setCanScrollNextLinks] = useState(false);

  const onSelectStats = useCallback(() => {
    if (!emblaApiStats) return;
    setCanScrollPrevStats(emblaApiStats.canScrollPrev());
    setCanScrollNextStats(emblaApiStats.canScrollNext());
  }, [emblaApiStats]);

  const onSelectActivity = useCallback(() => {
    if (!emblaApiActivity) return;
    setCanScrollPrevActivity(emblaApiActivity.canScrollPrev());
    setCanScrollNextActivity(emblaApiActivity.canScrollNext());
  }, [emblaApiActivity]);

  const onSelectLinks = useCallback(() => {
    if (!emblaApiLinks) return;
    setCanScrollPrevLinks(emblaApiLinks.canScrollPrev());
    setCanScrollNextLinks(emblaApiLinks.canScrollNext());
  }, [emblaApiLinks]);

  useEffect(() => {
    if (!emblaApiStats) return;
    onSelectStats();
    emblaApiStats.on('select', onSelectStats);
    emblaApiStats.on('reInit', onSelectStats);
  }, [emblaApiStats, onSelectStats]);

  useEffect(() => {
    if (!emblaApiActivity) return;
    onSelectActivity();
    emblaApiActivity.on('select', onSelectActivity);
    emblaApiActivity.on('reInit', onSelectActivity);
  }, [emblaApiActivity, onSelectActivity]);

  useEffect(() => {
    if (!emblaApiLinks) return;
    onSelectLinks();
    emblaApiLinks.on('select', onSelectLinks);
    emblaApiLinks.on('reInit', onSelectLinks);
  }, [emblaApiLinks, onSelectLinks]);

  const scrollPrevStats = useCallback(() => emblaApiStats && emblaApiStats.scrollPrev(), [emblaApiStats]);
  const scrollNextStats = useCallback(() => emblaApiStats && emblaApiStats.scrollNext(), [emblaApiStats]);

  const scrollPrevActivity = useCallback(() => emblaApiActivity && emblaApiActivity.scrollPrev(), [emblaApiActivity]);
  const scrollNextActivity = useCallback(() => emblaApiActivity && emblaApiActivity.scrollNext(), [emblaApiActivity]);

  const scrollPrevLinks = useCallback(() => emblaApiLinks && emblaApiLinks.scrollPrev(), [emblaApiLinks]);
  const scrollNextLinks = useCallback(() => emblaApiLinks && emblaApiLinks.scrollNext(), [emblaApiLinks]);

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
        <div className="flex items-center justify-between">
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

      {/* Stats Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRefStats}>
          <div className="flex gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-12px)] min-w-0">
                  <Card className="border-admin-border hover:shadow-md transition-shadow p-5 h-full">
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
                </div>
              );
            })}
          </div>
        </div>

        {canScrollPrevStats && (
          <button
            onClick={scrollPrevStats}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollNextStats && (
          <button
            onClick={scrollNextStats}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10 rotate-180"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
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
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRefActivity}>
              <div className="flex gap-3">
                {recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex-[0_0_100%] md:flex-[0_0_calc(50%-6px)] min-w-0"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-admin-bg transition-colors h-full border border-admin-border">
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
                  </div>
                ))}
              </div>
            </div>

            {canScrollPrevActivity && (
              <button
                onClick={scrollPrevActivity}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {canScrollNextActivity && (
              <button
                onClick={scrollNextActivity}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10 rotate-180"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
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
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRefLinks}>
            <div className="flex gap-3">
              <div className="flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(25%-9px)] min-w-0">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary w-full">
                  <Users className="w-5 h-5 text-admin-primary" />
                  <span className="text-sm">Ajouter un élève</span>
                </Button>
              </div>
              <div className="flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(25%-9px)] min-w-0">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary w-full">
                  <GraduationCap className="w-5 h-5 text-admin-accent-green" />
                  <span className="text-sm">Créer une classe</span>
                </Button>
              </div>
              <div className="flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(25%-9px)] min-w-0">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary w-full">
                  <Calendar className="w-5 h-5 text-admin-accent-orange" />
                  <span className="text-sm">Envoyer un message</span>
                </Button>
              </div>
              <div className="flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(25%-9px)] min-w-0">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-admin-border hover:border-admin-primary w-full">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Voir les rapports</span>
                </Button>
              </div>
            </div>
          </div>

          {canScrollPrevLinks && (
            <button
              onClick={scrollPrevLinks}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {canScrollNextLinks && (
            <button
              onClick={scrollNextLinks}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10 rotate-180"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
