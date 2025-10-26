import { useState } from 'react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Camera,
  FileText,
  Users,
  Bell,
  Star,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AppConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'communication' | 'pedagogique' | 'suivi';
  permissions: string[];
}

export function AppConfigurationView() {
  const [apps, setApps] = useState<AppConfig[]>([
    {
      id: 'liaison',
      name: 'Cahier de liaison',
      description: 'Communication école-famille avec signatures numériques',
      icon: FileText,
      enabled: true,
      category: 'communication',
      permissions: ['teacher', 'parent', 'admin']
    },
    {
      id: 'messaging',
      name: 'Messagerie école-famille',
      description: 'Messages directs entre enseignants et parents',
      icon: MessageSquare,
      enabled: true,
      category: 'communication',
      permissions: ['teacher', 'parent', 'admin']
    },
    {
      id: 'student-messaging',
      name: 'Messagerie élèves',
      description: 'Messagerie modérée pour les élèves',
      icon: Users,
      enabled: true,
      category: 'communication',
      permissions: ['student', 'teacher', 'admin']
    },
    {
      id: 'resources',
      name: 'Supports de cours',
      description: 'Bibliothèque de ressources pédagogiques',
      icon: BookOpen,
      enabled: true,
      category: 'pedagogique',
      permissions: ['teacher', 'student', 'parent', 'admin']
    },
    {
      id: 'homework',
      name: 'Devoirs',
      description: 'Gestion et suivi des devoirs',
      icon: FileText,
      enabled: true,
      category: 'pedagogique',
      permissions: ['teacher', 'student', 'parent', 'admin']
    },
    {
      id: 'schedule',
      name: 'Emploi du temps',
      description: 'Consultation des emplois du temps',
      icon: Calendar,
      enabled: true,
      category: 'pedagogique',
      permissions: ['teacher', 'student', 'parent', 'admin']
    },
    {
      id: 'grades',
      name: 'Notes & évaluations',
      description: 'Gestion des notes et bulletins',
      icon: Star,
      enabled: true,
      category: 'suivi',
      permissions: ['teacher', 'parent', 'admin']
    },
    {
      id: 'absences',
      name: 'Gestion des absences',
      description: 'Suivi des absences et retards',
      icon: Bell,
      enabled: true,
      category: 'suivi',
      permissions: ['teacher', 'parent', 'admin']
    },
    {
      id: 'photos',
      name: 'Photos de classe',
      description: 'Galerie photos sécurisée',
      icon: Camera,
      enabled: false,
      category: 'communication',
      permissions: ['teacher', 'parent', 'admin']
    }
  ]);

  const toggleApp = (appId: string) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        toast.success(`${app.name} ${!app.enabled ? 'activée' : 'désactivée'}`);
        return { ...app, enabled: !app.enabled };
      }
      return app;
    }));
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'communication': return 'Communication';
      case 'pedagogique': return 'Pédagogique';
      case 'suivi': return 'Suivi';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'from-blue-400 to-blue-500';
      case 'pedagogique': return 'from-green-400 to-green-500';
      case 'suivi': return 'from-orange-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const categories = ['communication', 'pedagogique', 'suivi'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-admin-text mb-1">Configuration des applications</h2>
        <p className="text-admin-text-light">
          Activez ou désactivez les applications disponibles dans Madrasati
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Applications actives</p>
              <h3 className="text-3xl text-admin-text">
                {apps.filter(app => app.enabled).length}/{apps.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Communication</p>
              <h3 className="text-3xl text-admin-text">
                {apps.filter(app => app.category === 'communication' && app.enabled).length}/
                {apps.filter(app => app.category === 'communication').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="border-admin-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-admin-text-light mb-1">Pédagogique</p>
              <h3 className="text-3xl text-admin-text">
                {apps.filter(app => app.category === 'pedagogique' && app.enabled).length}/
                {apps.filter(app => app.category === 'pedagogique').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Apps by Category */}
      {categories.map(category => {
        const categoryApps = apps.filter(app => app.category === category);
        
        return (
          <div key={category}>
            <h3 className="text-admin-text mb-4 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${getCategoryColor(category)}`} />
              {getCategoryLabel(category)}
            </h3>
            <div className="space-y-3">
              {categoryApps.map(app => {
                const Icon = app.icon;
                return (
                  <Card
                    key={app.id}
                    className={`border-2 transition-all ${
                      app.enabled 
                        ? 'border-admin-primary/30 bg-admin-primary/5' 
                        : 'border-admin-border bg-white'
                    }`}
                  >
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-admin-text">{app.name}</h4>
                            {app.enabled && (
                              <Badge className="bg-admin-accent-green text-white">
                                Activée
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-admin-text-light mb-3">
                            {app.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-admin-text-light">Accessible par:</span>
                            {app.permissions.map(perm => (
                              <Badge key={perm} variant="outline" className="text-xs border-admin-border">
                                {perm === 'teacher' && 'Enseignants'}
                                {perm === 'parent' && 'Parents'}
                                {perm === 'student' && 'Élèves'}
                                {perm === 'admin' && 'Admin'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Switch
                          checked={app.enabled}
                          onCheckedChange={() => toggleApp(app.id)}
                          className="data-[state=checked]:bg-admin-primary"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <Card className="border-admin-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-admin-text mb-1">Actions globales</h4>
            <p className="text-sm text-admin-text-light">
              Gérez toutes les applications en une seule fois
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-admin-border"
              onClick={() => {
                setApps(apps.map(app => ({ ...app, enabled: true })));
                toast.success('Toutes les applications ont été activées');
              }}
            >
              Tout activer
            </Button>
            <Button
              variant="outline"
              className="border-admin-danger text-admin-danger hover:bg-admin-danger/10"
              onClick={() => {
                setApps(apps.map(app => ({ ...app, enabled: false })));
                toast.success('Toutes les applications ont été désactivées');
              }}
            >
              Tout désactiver
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
