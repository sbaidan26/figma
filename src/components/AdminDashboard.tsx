import { useState } from 'react';
import { AdminDashboardHome } from './AdminDashboardHome';
import { UserManagementView } from './UserManagementView';
import { ClassManagementView } from './ClassManagementView';
import { AppConfigurationView } from './AppConfigurationView';
import { SchoolSettingsView } from './SchoolSettingsView';
import { GradesReportsView } from './GradesReportsView';
import { SchoolCommunicationsView } from './SchoolCommunicationsView';
import { CurriculumMonitoringView } from './CurriculumMonitoringView';
import {
  LayoutDashboard,
  Users,
  School,
  Grid3x3,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  GraduationCap,
  FileText,
  Megaphone,
  BookOpen
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Toaster } from './ui/sonner';

interface AdminDashboardProps {
  onLogout: () => void;
}

type ViewType = 'home' | 'users' | 'classes' | 'apps' | 'settings' | 'grades' | 'communications' | 'curriculum';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const navigationItems = [
    { id: 'home' as ViewType, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'users' as ViewType, label: 'Utilisateurs', icon: Users, badge: '245' },
    { id: 'classes' as ViewType, label: 'Classes', icon: School },
    { id: 'grades' as ViewType, label: 'Notes & bulletins', icon: GraduationCap },
    { id: 'communications' as ViewType, label: 'Communications', icon: Megaphone, badge: '2' },
    { id: 'curriculum' as ViewType, label: 'Suivi programme', icon: BookOpen },
    { id: 'apps' as ViewType, label: 'Applications', icon: Grid3x3 },
    { id: 'settings' as ViewType, label: 'Paramètres', icon: Settings },
  ];

  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return 'Tableau de bord';
      case 'users': return 'Gestion des utilisateurs';
      case 'classes': return 'Gestion des classes';
      case 'apps': return 'Configuration des applications';
      case 'settings': return 'Paramètres généraux';
      case 'grades': return 'Notes & bulletins';
      case 'communications': return 'Communications école';
      case 'curriculum': return 'Suivi du programme';
      default: return 'Administration';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <AdminDashboardHome />;
      case 'users':
        return <UserManagementView />;
      case 'classes':
        return <ClassManagementView />;
      case 'apps':
        return <AppConfigurationView />;
      case 'settings':
        return <SchoolSettingsView />;
      case 'grades':
        return <GradesReportsView />;
      case 'communications':
        return <SchoolCommunicationsView />;
      case 'curriculum':
        return <CurriculumMonitoringView />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-admin-sidebar text-white flex flex-col shadow-xl">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-primary to-admin-accent-green flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Madrasati</h3>
                <p className="text-xs text-white/70">Administration</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-admin-primary text-white shadow-lg'
                      : 'text-white/70 hover:bg-admin-sidebar-hover hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-admin-accent-orange text-white text-xs px-2">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </nav>

          {/* User & Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-admin-sidebar-hover hover:text-white transition-all">
              <Bell className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">Notifications</span>
              <Badge className="bg-admin-danger text-white text-xs px-2">3</Badge>
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-admin-danger/20 hover:text-admin-danger transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-admin-border px-8 py-5 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl text-admin-text mb-1">{getViewTitle()}</h1>
                <p className="text-sm text-admin-text-light">
                  École Madrasati - Année scolaire 2024-2025
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-admin-text">M. Alami</p>
                  <p className="text-xs text-admin-text-light">Directeur</p>
                </div>
                <Avatar className="w-12 h-12 border-2 border-admin-border">
                  <AvatarFallback className="bg-gradient-to-br from-admin-primary to-admin-accent-green text-white font-medium">
                    MA
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
