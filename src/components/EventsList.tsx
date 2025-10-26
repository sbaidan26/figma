import { motion } from 'motion/react';
import { CartoonEmoji } from './CartoonEmoji';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'school' | 'class' | 'holiday' | 'exam';
  description?: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Réunion parents-enseignants",
    date: "25 Oct 2025",
    time: "18h00",
    location: "Salle polyvalente",
    type: "school",
    description: "Échange sur le premier trimestre"
  },
  {
    id: 2,
    title: "Sortie au musée des sciences",
    date: "28 Oct 2025",
    time: "09h00",
    location: "Musée des Sciences",
    type: "class",
    description: "Autorisation parentale requise"
  },
  {
    id: 3,
    title: "Vacances de la Toussaint",
    date: "30 Oct - 6 Nov",
    time: "",
    location: "",
    type: "holiday",
    description: "Bonnes vacances à tous !"
  },
  {
    id: 4,
    title: "Évaluation de mathématiques",
    date: "8 Nov 2025",
    time: "10h00",
    location: "CM2-A",
    type: "exam",
    description: "Chapitres 1 à 4"
  },
  {
    id: 5,
    title: "Journée portes ouvertes",
    date: "15 Nov 2025",
    time: "14h00 - 17h00",
    location: "École",
    type: "school",
    description: "Découvrez notre établissement"
  }
];

const eventTypeConfig = {
  school: { color: 'bg-blue-500', label: 'École', emoji: 'school' as const },
  class: { color: 'bg-primary', label: 'Classe', emoji: 'book' as const },
  holiday: { color: 'bg-amber-500', label: 'Vacances', emoji: 'star' as const },
  exam: { color: 'bg-destructive', label: 'Examen', emoji: 'calendar' as const }
};

export function EventsList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-blue-100 to-blue-150 rounded-3xl p-8 shadow-lg border-2 border-white/50"
    >
      <div className="flex items-start gap-6 mb-6">
        {/* Icône décorative */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <CartoonEmoji type="calendar" className="w-10 h-10" />
          </div>
        </div>

        {/* Titre */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-blue-900">Événements à venir</h3>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Les prochaines dates importantes
          </p>
        </div>

        {/* Décoration */}
        <div className="flex-shrink-0">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <CartoonEmoji type="star" className="w-8 h-8" />
          </motion.div>
        </div>
      </div>

      {/* Liste des événements en grille horizontale */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingEvents.map((event, index) => {
          const config = eventTypeConfig[event.type];
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer group"
            >
              {/* En-tête avec badge */}
              <div className="flex items-start justify-between mb-3">
                <Badge className={`${config.color} text-white border-0 text-xs`}>
                  {config.label}
                </Badge>
                <div className="w-8 h-8 opacity-70 group-hover:scale-110 transition-transform">
                  <CartoonEmoji type={config.emoji} className="w-8 h-8" animated={false} />
                </div>
              </div>

              {/* Titre */}
              <h4 className="text-blue-900 mb-2 line-clamp-2 min-h-[3rem]">
                {event.title}
              </h4>

              {/* Détails */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{event.date}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.time}</span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-blue-600 text-sm mt-3 line-clamp-2 italic">
                  {event.description}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
