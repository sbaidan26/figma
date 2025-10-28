import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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

      <div className="relative z-10 flex min-h-screen flex-col">
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
                  <p className="text-sm">Élève</p>
                  <p className="text-sm text-muted-foreground">{user?.name || 'Élève'}</p>
                </div>
                <Avatar className="w-12 h-12 border-2 border-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'E'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="rounded-full text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
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

                  {/* Carousel d'applications - Une seule par slide */}
                  <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex gap-6">
                        {sections.flatMap((section) =>
                          section.apps.map((app, appIdx) => (
                            <div
                              key={`${section.title}-${appIdx}`}
                              className="flex-[0_0_100%] min-w-0"
                            >
                              <div className={`${section.bgColor} rounded-3xl p-12 shadow-lg border-2 border-white/50 hover:shadow-xl transition-all h-full flex flex-col items-center justify-center min-h-[400px]`}>
                                {/* Section Badge */}
                                <div className="mb-8 flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3">
                                  <CartoonEmoji type={section.emoji} className="w-8 h-8" />
                                  <span className="text-sm font-medium text-foreground/70">{section.title}</span>
                                </div>

                                {/* App Card */}
                                <button
                                  onClick={() => setCurrentView(app.view)}
                                  onMouseEnter={() => setHoveredApp(app.view)}
                                  onMouseLeave={() => setHoveredApp(null)}
                                  className={`relative ${section.cardColor} rounded-3xl p-16 flex flex-col items-center justify-center gap-8 transition-all hover:scale-105 hover:shadow-2xl border-4 border-white/50 group w-full max-w-2xl`}
                                >
                                  {/* Badge notification */}
                                  {app.badge && (
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-destructive text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10 animate-bounce">
                                      {app.badge}
                                    </div>
                                  )}

                                  {/* Icon */}
                                  <div className={`transition-transform duration-300 ${hoveredApp === app.view ? 'scale-110' : 'scale-100'}`}>
                                    <AppIcon
                                      type={app.iconType}
                                      className="w-32 h-32"
                                      animated={true}
                                    />
                                  </div>

                                  {/* Title */}
                                  <h3 className="text-white text-center text-3xl font-bold leading-tight">
                                    {app.title}
                                  </h3>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    {canScrollPrev && (
                      <button
                        onClick={scrollPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110 z-10"
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </button>
                    )}
                    {canScrollNext && (
                      <button
                        onClick={scrollNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110 z-10 rotate-180"
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </button>
                    )}
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
  );
}
