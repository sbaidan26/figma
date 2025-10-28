import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ParentBackground } from './ParentBackground';
import { CartoonEmoji } from './CartoonEmoji';
import { AppIcon } from './AppIcon';
import { LiaisonFeed } from './LiaisonFeed';
import { MessagingView } from './MessagingView';
import { AbsencesView } from './AbsencesView';
import { BoardsGallery } from './BoardsGallery';
import { ParentCafeView } from './ParentCafeView';
import { EventsList } from './EventsList';
import { CourseResourcesView } from './CourseResourcesView';
import { HomeworkView } from './HomeworkView';
import { ScheduleView } from './ScheduleView';
import { ParentGradesView } from './ParentGradesView';
import {
  Home,
  Bell,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ParentDashboardProps {
  onLogout: () => void;
}

type ViewType = 'home' | 'liaison' | 'messaging' | 'absences' | 'cafe' | 'notes' | 'schedule' | 'textbook' | 'media' | 'photos';

type AppIconType = 'coffee' | 'liaison' | 'messaging' | 'absences' | 'notes' | 'schedule' | 'textbook' | 
        'media' | 'photos';

interface AppItem {
  iconType: AppIconType;
  title: string;
  badge?: string;
  view: ViewType;
}

interface AppSection {
  title: string;
  emoji: 'home' | 'book' | 'calendar' | 'art' | 'star' | 'school' | 'parent';
  bgColor: string;
  cardColor: string;
  apps: AppItem[];
}

export function ParentDashboard({ onLogout }: ParentDashboardProps) {
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
      title: "Coin des parents",
      emoji: 'parent',
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-150",
      cardColor: "bg-gradient-to-br from-purple-400 to-purple-500",
      apps: [
        { iconType: 'coffee', title: "Le Café des Parents", badge: "3", view: 'cafe' },
        { iconType: 'liaison', title: "Cahier de liaison", badge: "1", view: 'liaison' },
        { iconType: 'messaging', title: "Messagerie école-famille", view: 'messaging' },
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
      case 'cafe': return 'Le Café des Parents';
      case 'liaison': return 'Cahier de liaison';
      case 'messaging': return 'Messagerie';
      case 'absences': return 'Absences';
      case 'notes': return 'Notes & évaluations';
      case 'schedule': return 'Emploi du temps';
      case 'homework': return 'Devoirs';
      case 'resources': return 'Supports de cours';
      case 'photos': return 'Photos de classe';
      default: return 'Espace Parent';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'cafe':
        return <ParentCafeView />;
      case 'liaison':
        return <LiaisonFeed />;
      case 'messaging':
        return <MessagingView />;
      case 'absences':
        return <AbsencesView />;
      case 'boards':
        return <BoardsGallery />;
      case 'resources':
        return <CourseResourcesView isTeacher={false} />;
      case 'homework':
        return <HomeworkView role="parent" studentName="Amira Ben Ahmed" />;
      case 'schedule':
        return <ScheduleView role="parent" />;
      case 'notes':
        return <ParentGradesView studentName="Amira Ben Ahmed" />;
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
      {/* Parent Background - Subtle Middle Eastern Theme */}
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
                      {currentView === 'home' ? 'Bienvenue dans votre espace parent' : 'Retour à l\'accueil'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm">Parent</p>
                  <p className="text-sm text-muted-foreground">{user?.name || 'Parent'}</p>
                </div>
                <Avatar className="w-12 h-12 border-2 border-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P'}
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
                        <h2 className="font-bold">Bonjour {user?.name || 'Parent'} !</h2>
                        <p className="text-muted-foreground">
                          Suivez la scolarité de Marie en temps réel
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Carousel de sections */}
                  <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex gap-6">
                        {sections.map((section, sectionIdx) => {
                          const isSectionHovered = hoveredApp?.startsWith(`${sectionIdx}-`);

                          return (
                            <div
                              key={sectionIdx}
                              className="flex-[0_0_100%] min-w-0"
                            >
                              <div className={`${section.bgColor} rounded-3xl p-6 shadow-lg border-2 border-white/50 hover:shadow-xl transition-all h-full`}>
                                {/* Section Header */}
                                <div className="flex items-center gap-3 mb-6">
                                  <div className={`transition-transform duration-300 ${isSectionHovered ? 'scale-125' : 'scale-100'}`}>
                                    <CartoonEmoji type={section.emoji} className="w-10 h-10" />
                                  </div>
                                  <h3 className="text-xl font-bold">{section.title}</h3>
                                </div>

                                {/* Apps Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                  {section.apps.map((app, appIdx) => {
                                    const isHovered = hoveredApp === `${sectionIdx}-${appIdx}`;

                                    return (
                                      <button
                                        key={appIdx}
                                        onClick={() => setCurrentView(app.view)}
                                        onMouseEnter={() => setHoveredApp(`${sectionIdx}-${appIdx}`)}
                                        onMouseLeave={() => setHoveredApp(null)}
                                        className={`relative ${section.cardColor} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-xl border-2 border-white/50 min-h-[140px] group`}
                                      >
                                        {/* Badge notification */}
                                        {app.badge && (
                                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10">
                                            {app.badge}
                                          </div>
                                        )}

                                        {/* Icon */}
                                        <div className={`transition-transform duration-300 ${isHovered ? 'scale-125' : 'scale-100'}`}>
                                          <AppIcon
                                            type={app.iconType}
                                            className="w-16 h-16"
                                            animated={true}
                                          />
                                        </div>

                                        {/* Title */}
                                        <span className="text-white text-center text-sm font-medium leading-tight">
                                          {app.title}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    {canScrollPrev && (
                      <button
                        onClick={scrollPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110 z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    )}
                    {canScrollNext && (
                      <button
                        onClick={scrollNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110 z-10 rotate-180"
                      >
                        <ChevronLeft className="w-6 h-6" />
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
