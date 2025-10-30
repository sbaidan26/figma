import { useState } from 'react';
import { motion } from 'motion/react';
import { CartoonEmoji } from './CartoonEmoji';
import { Calendar, MapPin, Clock, Plus, Users, Loader2, CheckCircle, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';

const eventTypeConfig: Record<string, any> = {
  meeting: { color: 'bg-blue-500', label: 'Réunion', emoji: 'school' as const, icon: '👥' },
  activity: { color: 'bg-primary', label: 'Activité', emoji: 'book' as const, icon: '🎨' },
  celebration: { color: 'bg-pink-500', label: 'Célébration', emoji: 'star' as const, icon: '🎉' },
  trip: { color: 'bg-green-500', label: 'Sortie', emoji: 'calendar' as const, icon: '🚌' },
  exam: { color: 'bg-destructive', label: 'Examen', emoji: 'calendar' as const, icon: '📝' },
  holiday: { color: 'bg-amber-500', label: 'Vacances', emoji: 'star' as const, icon: '🏖️' },
  other: { color: 'bg-purple-500', label: 'Autre', emoji: 'book' as const, icon: '📌' },
};

export function EventsList() {
  const { user } = useAuth();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string; level: string }>>([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type: 'meeting' as any,
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    color: '#3b82f6',
    requires_permission: false,
    is_public: false,
  });

  const {
    events,
    loading,
    createEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
    getUpcomingEvents,
    formatEventDate,
    formatEventTime,
    getEventDaysUntil,
  } = useEvents();

  const upcomingEvents = getUpcomingEvents(5);

  const fetchAvailableClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, level')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setAvailableClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.event_date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await createEvent({
        title: eventForm.title,
        description: eventForm.description || undefined,
        event_type: eventForm.event_type,
        event_date: eventForm.event_date,
        start_time: eventForm.start_time || undefined,
        end_time: eventForm.end_time || undefined,
        location: eventForm.location || undefined,
        class_id: selectedClassId || undefined,
        color: eventForm.color,
        requires_permission: eventForm.requires_permission,
        is_public: eventForm.is_public,
        status: 'upcoming',
      });

      setIsCreatingEvent(false);
      setEventForm({
        title: '',
        description: '',
        event_type: 'meeting',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        color: '#3b82f6',
        requires_permission: false,
        is_public: false,
      });
      setSelectedClassId(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleRegisterToggle = async (eventId: string) => {
    try {
      if (isRegistered(eventId)) {
        await unregisterFromEvent(eventId);
      } else {
        await registerForEvent(eventId);
      }
    } catch (error) {
      console.error('Error toggling registration:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-100 to-blue-150 rounded-3xl p-8 shadow-lg border-2 border-white/50"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-100 to-blue-150 rounded-3xl p-8 shadow-lg border-2 border-white/50"
      >
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <CartoonEmoji type="calendar" className="w-10 h-10" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="text-blue-900">Événements à venir</h3>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Les prochaines dates importantes
            </p>
          </div>

          {user?.role === 'teacher' && (
            <Button
              onClick={() => {
                setIsCreatingEvent(true);
                fetchAvailableClasses();
              }}
              size="sm"
              className="rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}

          <div className="flex-shrink-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="text-3xl">📅</span>
            </motion.div>
          </div>
        </div>

        <div className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-blue-700">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun événement à venir</p>
            </div>
          ) : (
            upcomingEvents.map((event, index) => {
              const typeInfo = eventTypeConfig[event.event_type] || eventTypeConfig.other;
              const daysUntil = getEventDaysUntil(event.event_date);
              const registered = isRegistered(event.id);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${typeInfo.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <span className="text-2xl">{typeInfo.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-blue-900 line-clamp-1">
                          {event.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {typeInfo.label}
                        </Badge>
                      </div>

                      {event.description && (
                        <p className="text-sm text-blue-700 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-blue-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatEventDate(event.event_date)}</span>
                        </div>

                        {event.start_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatEventTime(event.start_time)}
                              {event.end_time && ` - ${formatEventTime(event.end_time)}`}
                            </span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.participants_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.participants_count} participant{event.participants_count > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>

                      {daysUntil >= 0 && daysUntil <= 7 && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? 'Demain' : `Dans ${daysUntil} jours`}
                          </Badge>
                        </div>
                      )}

                      {event.requires_permission && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            Autorisation parentale requise
                          </Badge>
                        </div>
                      )}

                      {user && user.role !== 'teacher' && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant={registered ? "outline" : "default"}
                            onClick={() => handleRegisterToggle(event.id)}
                            className="rounded-xl text-xs"
                          >
                            {registered ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Inscrit
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 mr-1" />
                                S'inscrire
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {upcomingEvents.length > 0 && events.length > 5 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-700">
              +{events.length - 5} événement{events.length - 5 > 1 ? 's' : ''} à venir
            </p>
          </div>
        )}
      </motion.div>

      <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvel événement</DialogTitle>
            <DialogDescription>
              Créer un nouvel événement pour la classe ou l'école
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {availableClasses.length > 0 && (
              <div>
                <Label>Classe (optionnel)</Label>
                <Select value={selectedClassId || 'none'} onValueChange={(val) => setSelectedClassId(val === 'none' ? null : val)}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue placeholder="Toutes les classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Toutes les classes</SelectItem>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Titre *</Label>
              <Input
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Ex: Sortie au musée"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Description de l'événement..."
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select value={eventForm.event_type} onValueChange={(val: any) => setEventForm({ ...eventForm, event_type: val })}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.icon} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heure de début</Label>
                <Input
                  type="time"
                  value={eventForm.start_time}
                  onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={eventForm.end_time}
                  onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Lieu</Label>
              <Input
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Ex: Salle polyvalente"
                className="rounded-xl mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label>Autorisation parentale requise</Label>
                <p className="text-xs text-muted-foreground">Les parents devront donner leur accord</p>
              </div>
              <Switch
                checked={eventForm.requires_permission}
                onCheckedChange={(checked) => setEventForm({ ...eventForm, requires_permission: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label>Événement public</Label>
                <p className="text-xs text-muted-foreground">Visible par tous les utilisateurs</p>
              </div>
              <Switch
                checked={eventForm.is_public}
                onCheckedChange={(checked) => setEventForm({ ...eventForm, is_public: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreatingEvent(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateEvent}
              className="rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer l'événement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
