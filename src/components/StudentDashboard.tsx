import { useState } from 'react';
import { ParentBackground } from './ParentBackground';
import { CartoonEmoji } from './CartoonEmoji';
import { AppIcon } from './AppIcon';
import { LiaisonFeed } from './LiaisonFeed';
import { MessagingView } from './MessagingView';
import { AbsencesView } from './AbsencesView';
import { BoardsGallery } from './BoardsGallery';
import { EventsList } from './EventsList';
import { CourseResourcesView } from './CourseResourcesView';
import { HomeworkView } from './HomeworkView';
import { ScheduleView } from './ScheduleView';
import { StudentGradesView } from './StudentGradesView';
import {
  Home,
  Bell,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface StudentDashboardProps {
  onLogout: () => void;
}

type ViewType = 'home' | 'messaging' | 'badges' | 'absences' | 'notes' | 'schedule' | 'textbook' | 'media' | 'photos';

type AppIconType = 'messaging' | 'absences' | 'notes' | 'schedule' | 'textbook' | 'media' | 'photos';

interface AppItem {
  iconType: AppIconType;
  title: string;
  badge?: string;
  view: ViewType;
}

interface AppSection {
  title: string;
  emoji: 'home' | 'book' | 'calendar' | 'art' | 'star' | 'school' | 'student';
  bgColor: string;
  cardColor: string;
  apps: AppItem[];
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const { user } = useAuth();
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const sections: AppSection[] = [
    {
      title: "Mon espace",
      emoji: 'student',
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-150",
      cardColor: "bg-gradient-to-br from-purple-400 to-purple-500",
      apps: [
        { iconType: 'messaging', title: "Messagerie élève", badge: "2", view: 'messaging' },
      ],
    },
    {
      title: "Suivi scolaire",
      emoji: 'book',
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-150",
      cardColor: "bg-gradient-to-br from-blue-400 to-blue-500",
      apps: [
        { iconType: 'notes', title: "Notes & évaluations", view: 'notes' },
        { iconType: 'schedule', title: "Emploi du temps", view: 'schedule' },
        { iconType: 'absences', title: "Absences", view: 'absences' },
      ],
    },
    {
      title: "Vie de classe",
      emoji: 'school',
      bgColor: "bg-gradient-to-br from-amber-100 to-amber-150",
      cardColor: "bg-gradient-to-br from-amber-400 to-amber-500",
      apps: [
        { iconType: 'textbook', title: "Devoirs", view: 'homework' },
        { iconType: 'media', title: "Supports de cours", view: 'resources' },
        { iconType: 'photos', title: "Photos de classe", view: 'photos' },
      ],
    },
  ];

  const getViewTitle = () => {
    switch (currentView) {
      case 'messaging': return 'Messagerie élève';
      case 'badges': return 'Mes badges';
      case 'absences': return 'Absences';
      case 'notes': return 'Notes & évaluations';
      case 'schedule': return 'Emploi du temps';
      case 'homework': return 'Devoirs';
      case 'resources': return 'Supports de cours';
      case 'photos': return 'Photos de classe';
      default: return 'Mon espace';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'messaging':
        return <MessagingView />;
      case 'absences':
        return <AbsencesView />;
      case 'resources':
        return <CourseResourcesView isTeacher={false} />;
      case 'homework':
        return <HomeworkView role="student" />;
      case 'schedule':
        return <ScheduleView role="student" />;
      case 'notes':
        return <StudentGradesView />;
      default:
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">🚧</span>
            </div>
            <h3>Section en construction</h3>
            <p className="text-muted-foreground mt-2">
              Cette fonctionnalité sera bientôt disponible
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animé */}
      <ParentBackground />
      
      <div className="relative z-10 flex min-h-screen">
        {/* Compact Sidebar */}
        <aside className="w-24 bg-white/90 backdrop-blur-sm border-r border-border/50 flex flex-col items-center py-6 gap-6 shadow-lg">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <CartoonEmoji type="school" className="w-8 h-8" />
            </div>
            <span className="text-xs text-center px-2 opacity-60">Madrasati</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-3 w-full px-3">
            <button
              onClick={() => setCurrentView('home')}
              className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all hover:bg-primary/10 hover:scale-105 group ${
                currentView === 'home' ? 'bg-primary/20' : ''
              }`}
            >
              <Home 
                className={`w-6 h-6 ${
                  currentView === 'home' ? 'text-primary' : 'text-foreground'
                }`}
              />
              <span className="text-xs mt-1 opacity-70">Accueil</span>
            </button>
          </nav>

          {/* Bottom actions */}
          <div className="flex flex-col gap-3 w-full px-3">
            <button className="w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all hover:bg-warning/10 hover:scale-105 group">
              <div className="relative">
                <Bell className="w-6 h-6 text-warning" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-white" />
              </div>
              <span className="text-xs mt-1 opacity-70">Alertes</span>
            </button>
            
            <button
              onClick={onLogout}
              className="w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all hover:bg-destructive/10 hover:scale-105 group"
            >
              <LogOut className="w-6 h-6 text-destructive" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 px-8 py-5 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                {currentView !== 'home' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentView('home')}
                    className="rounded-full -ml-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                )}
                
                <div className="flex items-center gap-3">
                  <CartoonEmoji 
                    type={currentView === 'home' ? 'door' : 'home'} 
                    className="w-10 h-10" 
                  />
                  <div>
                    <h1 className="leading-tight">{getViewTitle()}</h1>
                    <p className="text-sm text-muted-foreground">
                      {currentView === 'home' ? 'Bienvenue dans ton espace' : 'Retour à l\'accueil'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm">Élève • Classe CM2-A</p>
                  <p className="text-sm text-muted-foreground">Marie Dupont</p>
                </div>
                <Avatar className="w-12 h-12 border-2 border-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    MD
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {currentView === 'home' ? (
                <div className="space-y-8">
                  {/* Message de bienvenue personnalisé */}
                  <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 rounded-3xl p-6 border-2 border-white/50 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <CartoonEmoji type="wave" className="w-10 h-10" />
                      </div>
                      <div>
                        <h2 className="font-bold">Bonjour {user?.name || 'Élève'} !</h2>
                        <p className="text-muted-foreground">
                          Bienvenue dans ton espace personnel
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sections Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sections.map((section, sectionIdx) => {
                      const isSectionHovered = hoveredApp?.startsWith(`${sectionIdx}-`);
                      
                      return (
                        <div
                          key={sectionIdx}
                          className={`${section.bgColor} rounded-3xl p-6 shadow-lg border-2 border-white/50 hover:shadow-xl transition-all`}
                        >
                          {/* Section Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`transition-transform duration-300 ${isSectionHovered ? 'scale-125' : 'scale-100'}`}>
                              <CartoonEmoji type={section.emoji} className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold">{section.title}</h3>
                          </div>

                          {/* Apps Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            {section.apps.map((app, appIdx) => {
                              const isHovered = hoveredApp === `${sectionIdx}-${appIdx}`;
                              
                              return (
                                <button
                                  key={appIdx}
                                  onClick={() => setCurrentView(app.view)}
                                  onMouseEnter={() => setHoveredApp(`${sectionIdx}-${appIdx}`)}
                                  onMouseLeave={() => setHoveredApp(null)}
                                  className={`relative ${section.cardColor} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-110 hover:shadow-xl border-2 border-white/50 min-h-[120px] group`}
                                >
                                  {/* Badge notification */}
                                  {app.badge && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10">
                                      {app.badge}
                                    </div>
                                  )}
                                  
                                  {/* Icon */}
                                  <div className={`transition-transform duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`}>
                                    <AppIcon 
                                      type={app.iconType}
                                      className="w-14 h-14"
                                      animated={true}
                                    />
                                  </div>
                                  
                                  {/* Title */}
                                  <span className="text-white text-center text-sm font-medium leading-tight mt-1">
                                    {app.title}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Section Événements */}
                  <EventsList />
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-white/50">
                  {renderView()}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
