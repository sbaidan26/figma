import { motion } from 'motion/react';

interface CartoonEmojiProps {
  type: 'home' | 'book' | 'calendar' | 'art' | 'star' | 'school' | 'bell' | 'message' | 'parent' | 'student' | 'teacher' | 'wave' | 'door' | 'heart' | 'calculator' | 'science' | 'globe' | 'music' | 'megaphone';
  className?: string;
  animated?: boolean;
}

export function CartoonEmoji({ type, className = "w-8 h-8", animated = true }: CartoonEmojiProps) {
  const MotionWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  } : {};

  const icons = {
    home: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Base de la maison */}
          <path
            d="M 20 45 L 50 20 L 80 45 L 80 80 L 20 80 Z"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Toit */}
          <path
            d="M 15 45 L 50 15 L 85 45 L 75 45 L 50 25 L 25 45 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Porte */}
          <rect x="42" y="55" width="16" height="25" rx="2" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="2" />
          {/* Poignée */}
          <circle cx="52" cy="67" r="1.5" fill="#7b6b4a" />
          {/* Fenêtres */}
          <rect x="28" y="50" width="10" height="10" rx="1" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="62" y="50" width="10" height="10" rx="1" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          {/* Croix fenêtres */}
          <line x1="33" y1="50" x2="33" y2="60" stroke="#7b6b4a" strokeWidth="1.5" />
          <line x1="28" y1="55" x2="38" y2="55" stroke="#7b6b4a" strokeWidth="1.5" />
          <line x1="67" y1="50" x2="67" y2="60" stroke="#7b6b4a" strokeWidth="1.5" />
          <line x1="62" y1="55" x2="72" y2="55" stroke="#7b6b4a" strokeWidth="1.5" />
          {/* Cheminée */}
          <rect x="65" y="28" width="8" height="15" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
          {/* Fumée */}
          <motion.circle
            cx="69"
            cy="20"
            r="3"
            fill="#d7edea"
            opacity="0.7"
            animate={animated ? {
              y: [0, -10],
              opacity: [0.7, 0],
              scale: [1, 1.5]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    book: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotateY: [0, 15, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Livre fermé */}
          <path
            d="M 25 25 L 75 25 L 75 80 L 25 80 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pages */}
          <rect x="30" y="28" width="40" height="49" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2" />
          {/* Lignes de texte */}
          <line x1="35" y1="35" x2="60" y2="35" stroke="#beeaf7" strokeWidth="2" strokeLinecap="round" />
          <line x1="35" y1="42" x2="65" y2="42" stroke="#beeaf7" strokeWidth="2" strokeLinecap="round" />
          <line x1="35" y1="49" x2="55" y2="49" stroke="#beeaf7" strokeWidth="2" strokeLinecap="round" />
          <line x1="35" y1="56" x2="62" y2="56" stroke="#beeaf7" strokeWidth="2" strokeLinecap="round" />
          <line x1="35" y1="63" x2="58" y2="63" stroke="#beeaf7" strokeWidth="2" strokeLinecap="round" />
          {/* Marque-page */}
          <path
            d="M 50 25 L 50 15 L 55 18 L 60 15 L 60 25"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          {/* Étoile décorative */}
          <motion.path
            d="M 50 50 L 52 56 L 58 56 L 53 60 L 55 66 L 50 62 L 45 66 L 47 60 L 42 56 L 48 56 Z"
            fill="#f5c25b"
            opacity="0.8"
            animate={animated ? {
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -5, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Corps du calendrier */}
          <rect x="20" y="30" width="60" height="55" rx="4" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="3" />
          {/* En-tête */}
          <rect x="20" y="30" width="60" height="15" rx="4" fill="#e76f51" />
          <rect x="20" y="38" width="60" height="7" fill="#e76f51" />
          {/* Anneaux */}
          <circle cx="32" cy="25" r="3" fill="none" stroke="#7b6b4a" strokeWidth="3" />
          <circle cx="50" cy="25" r="3" fill="none" stroke="#7b6b4a" strokeWidth="3" />
          <circle cx="68" cy="25" r="3" fill="none" stroke="#7b6b4a" strokeWidth="3" />
          <rect x="30" y="20" width="4" height="12" fill="#7b6b4a" />
          <rect x="48" y="20" width="4" height="12" fill="#7b6b4a" />
          <rect x="66" y="20" width="4" height="12" fill="#7b6b4a" />
          {/* Grille de dates */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={25 + col * 9}
                y={50 + row * 8}
                width="7"
                height="6"
                rx="1"
                fill={row === 1 && col === 3 ? "#2bb59a" : "#beeaf7"}
                stroke="#7b6b4a"
                strokeWidth="1"
              />
            ))
          )}
          {/* Checkmark animé */}
          <motion.path
            d="M 51 60 L 53 62 L 56 58"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={animated ? {
              pathLength: [0, 1],
              opacity: [0, 1, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    art: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Palette */}
          <ellipse cx="50" cy="55" rx="30" ry="25" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          {/* Trou pour le pouce */}
          <ellipse cx="68" cy="62" rx="6" ry="8" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2" />
          {/* Peintures colorées */}
          <circle cx="40" cy="45" r="5" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
          <circle cx="55" cy="42" r="5" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="2" />
          <circle cx="48" cy="55" r="5" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          <circle cx="38" cy="62" r="5" fill="#9B59B6" stroke="#7b6b4a" strokeWidth="2" />
          {/* Pinceau */}
          <motion.g
            animate={animated ? {
              rotate: [0, -15, 15, 0],
              x: [0, 5, -5, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <rect x="60" y="15" width="4" height="35" fill="#7b6b4a" strokeWidth="0" />
            <path
              d="M 58 48 L 62 15 L 66 15 L 66 48 Z"
              fill="#f5c25b"
              stroke="#7b6b4a"
              strokeWidth="2"
            />
            <path
              d="M 58 48 L 60 52 L 64 52 L 66 48 Z"
              fill="#333333"
            />
            <ellipse cx="62" cy="52" rx="3" ry="1" fill="#2bb59a" opacity="0.7" />
          </motion.g>
        </motion.g>
      </svg>
    ),
    star: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, 360],
            scale: [1, 1.15, 1]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            d="M 50 15 L 58 42 L 87 42 L 64 58 L 72 85 L 50 69 L 28 85 L 36 58 L 13 42 L 42 42 Z"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Brillance */}
          <motion.circle
            cx="42"
            cy="35"
            r="3"
            fill="#ffffff"
            opacity="0.9"
            animate={animated ? {
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx="60"
            cy="50"
            r="2"
            fill="#ffffff"
            opacity="0.9"
            animate={animated ? {
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.g>
      </svg>
    ),
    school: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -4, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Bâtiment principal */}
          <rect x="25" y="45" width="50" height="40" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="3" />
          {/* Toit */}
          <path
            d="M 20 45 L 50 25 L 80 45 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Coupole/Dôme oriental */}
          <motion.g
            animate={animated ? {
              scale: [1, 1.05, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ellipse cx="50" cy="25" rx="8" ry="10" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
            <path d="M 50 15 L 48 20 L 52 20 Z" fill="#7b6b4a" />
            <circle cx="50" cy="13" r="2" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="1.5" />
          </motion.g>
          {/* Porte */}
          <path
            d="M 42 65 L 42 85 L 58 85 L 58 65 Q 50 60 42 65 Z"
            fill="#f6fbf9"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          {/* Fenêtres */}
          <rect x="32" y="52" width="8" height="8" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="60" y="52" width="8" height="8" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="32" y="65" width="8" height="8" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="60" y="65" width="8" height="8" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          {/* Étoile et croissant */}
          <motion.path
            d="M 50 38 L 51 40 L 53 40 L 51.5 41.5 L 52 43.5 L 50 42 L 48 43.5 L 48.5 41.5 L 47 40 L 49 40 Z"
            fill="#f5c25b"
            animate={animated ? {
              opacity: [1, 0.5, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, 15, -15, 15, -15, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1
          }}
          style={{ originX: 0.5, originY: 0.2 }}
        >
          {/* Support */}
          <rect x="48" y="15" width="4" height="8" fill="#7b6b4a" />
          <circle cx="50" cy="15" r="3" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
          {/* Cloche */}
          <path
            d="M 35 45 Q 35 30 50 25 Q 65 30 65 45 L 65 60 Q 65 65 60 68 L 40 68 Q 35 65 35 60 Z"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Battant */}
          <motion.g
            animate={animated ? {
              x: [0, -3, 3, -3, 3, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1
            }}
          >
            <line x1="50" y1="30" x2="50" y2="65" stroke="#7b6b4a" strokeWidth="2" />
            <circle cx="50" cy="65" r="4" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
          </motion.g>
          {/* Brillance */}
          <ellipse cx="42" cy="40" rx="4" ry="6" fill="#ffffff" opacity="0.6" />
          {/* Base */}
          <ellipse cx="50" cy="68" rx="20" ry="4" fill="#7b6b4a" opacity="0.3" />
          {/* Ondes sonores */}
          <motion.path
            d="M 70 40 Q 75 40 75 45"
            stroke="#f5c25b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0, 1, 0],
              x: [0, 5, 10]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 0.5
            }}
          />
          <motion.path
            d="M 30 40 Q 25 40 25 45"
            stroke="#f5c25b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0, 1, 0],
              x: [0, -5, -10]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 0.5
            }}
          />
        </motion.g>
      </svg>
    ),
    message: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Enveloppe */}
          <rect x="20" y="35" width="60" height="40" rx="3" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="3" />
          {/* Rabat fermé */}
          <path
            d="M 20 35 L 50 55 L 80 35"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Lignes décoratives */}
          <line x1="28" y1="55" x2="45" y2="55" stroke="#7b6b4a" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <line x1="28" y1="62" x2="52" y2="62" stroke="#7b6b4a" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          {/* Coeur */}
          <motion.g
            animate={animated ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              d="M 63 48 Q 63 45 65 45 Q 67 45 67 48 Q 67 51 63 54 Q 59 51 59 48 Q 59 45 61 45 Q 63 45 63 48 Z"
              fill="#e76f51"
              stroke="#7b6b4a"
              strokeWidth="1.5"
            />
          </motion.g>
          {/* Timbre */}
          <rect x="66" y="62" width="10" height="8" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="1.5" />
          <circle cx="71" cy="66" r="2" fill="#f6fbf9" opacity="0.6" />
        </motion.g>
      </svg>
    ),
    parent: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Adulte (parent) */}
          <circle cx="42" cy="35" r="12" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2.5" />
          <path
            d="M 25 70 Q 25 50 42 50 Q 59 50 59 70 L 25 70 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          {/* Yeux */}
          <circle cx="38" cy="33" r="2" fill="#7b6b4a" />
          <circle cx="46" cy="33" r="2" fill="#7b6b4a" />
          {/* Sourire */}
          <path d="M 37 39 Q 42 42 47 39" stroke="#7b6b4a" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Enfant */}
          <motion.g
            animate={animated ? {
              x: [0, 2, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          >
            <circle cx="62" cy="48" r="9" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2.5" />
            <path
              d="M 50 78 Q 50 60 62 60 Q 74 60 74 78 L 50 78 Z"
              fill="#beeaf7"
              stroke="#7b6b4a"
              strokeWidth="2.5"
            />
            {/* Yeux */}
            <circle cx="59" cy="47" r="1.5" fill="#7b6b4a" />
            <circle cx="65" cy="47" r="1.5" fill="#7b6b4a" />
            {/* Sourire */}
            <path d="M 59 51 Q 62 53 65 51" stroke="#7b6b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.g>
          
          {/* Coeur entre eux */}
          <motion.path
            d="M 52 45 Q 52 43 53.5 43 Q 55 43 55 45 Q 55 47 52 49 Q 49 47 49 45 Q 49 43 50.5 43 Q 52 43 52 45 Z"
            fill="#e76f51"
            opacity="0.8"
            animate={animated ? {
              scale: [1, 1.3, 1],
              y: [0, -2, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    student: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Tête */}
          <circle cx="50" cy="35" r="15" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          {/* Corps */}
          <path
            d="M 30 75 Q 30 52 50 52 Q 70 52 70 75 L 30 75 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
          />
          {/* Yeux */}
          <circle cx="44" cy="33" r="2.5" fill="#7b6b4a" />
          <circle cx="56" cy="33" r="2.5" fill="#7b6b4a" />
          {/* Sourire */}
          <path d="M 43 40 Q 50 44 57 40" stroke="#7b6b4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Sac à dos */}
          <rect x="62" y="50" width="14" height="18" rx="2" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="65" y="53" width="8" height="5" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="1.5" />
          <line x1="69" y1="48" x2="69" y2="52" stroke="#7b6b4a" strokeWidth="2" strokeLinecap="round" />
          {/* Chapeau d'étudiant */}
          <motion.g
            animate={animated ? {
              rotate: [0, -5, 5, 0],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ originX: 0.5, originY: 0.2 }}
          >
            <path
              d="M 35 25 L 50 20 L 65 25 L 50 30 Z"
              fill="#053d52"
              stroke="#7b6b4a"
              strokeWidth="2"
            />
            <rect x="48" y="22" width="4" height="15" fill="#053d52" />
            <circle cx="50" cy="37" r="3" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="1.5" />
          </motion.g>
          {/* Étoiles de réussite */}
          <motion.path
            d="M 75 35 L 76 37 L 78 37 L 76.5 38.5 L 77 40.5 L 75 39 L 73 40.5 L 73.5 38.5 L 72 37 L 74 37 Z"
            fill="#f5c25b"
            animate={animated ? {
              scale: [0, 1.2, 1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    teacher: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Tête */}
          <circle cx="40" cy="35" r="13" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2.5" />
          {/* Lunettes */}
          <circle cx="35" cy="35" r="4" fill="none" stroke="#7b6b4a" strokeWidth="2" />
          <circle cx="45" cy="35" r="4" fill="none" stroke="#7b6b4a" strokeWidth="2" />
          <line x1="39" y1="35" x2="41" y2="35" stroke="#7b6b4a" strokeWidth="2" />
          {/* Yeux */}
          <circle cx="35" cy="35" r="1.5" fill="#7b6b4a" />
          <circle cx="45" cy="35" r="1.5" fill="#7b6b4a" />
          {/* Sourire */}
          <path d="M 34 41 Q 40 44 46 41" stroke="#7b6b4a" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Corps */}
          <path
            d="M 22 75 Q 22 52 40 52 Q 58 52 58 75 L 22 75 Z"
            fill="#053d52"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          {/* Cravate */}
          <path
            d="M 40 52 L 38 60 L 40 75 L 42 60 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="1.5"
          />
          {/* Livre */}
          <motion.g
            animate={animated ? {
              rotate: [0, -8, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <rect x="60" y="45" width="20" height="25" rx="2" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="2.5" />
            <rect x="63" y="48" width="14" height="19" fill="#f6fbf9" />
            <line x1="66" y1="52" x2="74" y2="52" stroke="#beeaf7" strokeWidth="1.5" />
            <line x1="66" y1="56" x2="74" y2="56" stroke="#beeaf7" strokeWidth="1.5" />
            <line x1="66" y1="60" x2="74" y2="60" stroke="#beeaf7" strokeWidth="1.5" />
          </motion.g>
          {/* Pomme */}
          <motion.g
            animate={animated ? {
              y: [0, -2, 0],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <circle cx="75" cy="30" r="6" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
            <path d="M 75 24 Q 73 22 75 20" stroke="#2bb59a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="73" cy="28" rx="2" ry="3" fill="#ffffff" opacity="0.5" />
          </motion.g>
        </motion.g>
      </svg>
    ),
    wave: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Bras */}
          <motion.path
            d="M 35 55 Q 20 45 15 30"
            stroke="#f5c25b"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 35 55 Q 20 45 15 30",
                "M 35 55 Q 25 40 20 25",
                "M 35 55 Q 20 45 15 30"
              ],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main qui salue */}
          <motion.g
            animate={animated ? {
              rotate: [0, 20, -20, 20, 0],
              x: [0, -2, 2, -2, 0],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ originX: 0.15, originY: 0.3 }}
          >
            {/* Paume */}
            <ellipse cx="15" cy="28" rx="8" ry="10" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2.5" />
            
            {/* Doigts */}
            <ellipse cx="12" cy="18" rx="2.5" ry="5" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
            <ellipse cx="15" cy="15" rx="2.5" ry="6" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
            <ellipse cx="18" cy="17" rx="2.5" ry="5.5" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
            <ellipse cx="21" cy="20" rx="2.5" ry="4.5" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
          </motion.g>
          
          {/* Visage souriant */}
          <circle cx="60" cy="45" r="18" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          
          {/* Yeux joyeux */}
          <motion.path
            d="M 52 40 Q 54 43 56 40"
            stroke="#7b6b4a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 52 40 Q 54 43 56 40",
                "M 52 42 L 56 42",
                "M 52 40 Q 54 43 56 40"
              ]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 64 40 Q 66 43 68 40"
            stroke="#7b6b4a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 64 40 Q 66 43 68 40",
                "M 64 42 L 68 42",
                "M 64 40 Q 66 43 68 40"
              ]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          
          {/* Grand sourire */}
          <path
            d="M 52 50 Q 60 56 68 50"
            stroke="#7b6b4a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Joues rouges */}
          <ellipse cx="48" cy="48" rx="4" ry="3" fill="#e76f51" opacity="0.5" />
          <ellipse cx="72" cy="48" rx="4" ry="3" fill="#e76f51" opacity="0.5" />
          
          {/* Corps */}
          <path
            d="M 45 63 Q 45 65 48 68 L 48 80 L 72 80 L 72 68 Q 75 65 75 63 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
          />
          
          {/* Étoiles de joie */}
          <motion.path
            d="M 28 45 L 29 47 L 31 47 L 29.5 48.5 L 30 50.5 L 28 49 L 26 50.5 L 26.5 48.5 L 25 47 L 27 47 Z"
            fill="#f5c25b"
            animate={animated ? {
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 85 35 L 86 37 L 88 37 L 86.5 38.5 L 87 40.5 L 85 39 L 83 40.5 L 83.5 38.5 L 82 37 L 84 37 Z"
            fill="#beeaf7"
            animate={animated ? {
              scale: [0, 1.2, 0],
              rotate: [0, -180, -360]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.g>
      </svg>
    ),
    door: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            scale: [1, 1.03, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Cadre de porte oriental */}
          <rect x="20" y="15" width="60" height="75" rx="6" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="3" />
          
          {/* Porte */}
          <motion.rect
            x="25"
            y="20"
            width="50"
            height="65"
            rx="4"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="2.5"
            animate={animated ? {
              scaleX: [1, 0.95, 1],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Décoration orientale sur la porte - arche */}
          <path
            d="M 35 30 Q 35 25 50 25 Q 65 25 65 30"
            stroke="#7b6b4a"
            strokeWidth="2"
            fill="none"
          />
          <ellipse cx="50" cy="30" rx="12" ry="8" fill="none" stroke="#7b6b4a" strokeWidth="2" />
          
          {/* Motif géométrique */}
          <motion.g
            animate={animated ? {
              opacity: [0.7, 1, 0.7],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              d="M 50 45 L 52 50 L 57 50 L 53 53 L 55 58 L 50 55 L 45 58 L 47 53 L 43 50 L 48 50 Z"
              fill="#e76f51"
              stroke="#7b6b4a"
              strokeWidth="1.5"
            />
          </motion.g>
          
          {/* Poignée */}
          <circle cx="63" cy="55" r="3" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
          <ellipse cx="63" cy="55" rx="1.5" ry="2" fill="#7b6b4a" />
          
          {/* Lumière qui entre (effet d'ouverture) */}
          <motion.path
            d="M 75 20 L 90 35 L 90 70 L 75 85"
            fill="#beeaf7"
            opacity="0.4"
            animate={animated ? {
              opacity: [0.2, 0.5, 0.2],
              x: [0, 2, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Tapis d'accueil */}
          <ellipse cx="50" cy="92" rx="25" ry="6" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" opacity="0.7" />
          <rect x="30" y="89" width="40" height="3" rx="1.5" fill="#7b6b4a" opacity="0.3" />
          
          {/* Décorations orientales sur le cadre */}
          <circle cx="30" cy="25" r="2" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="1" />
          <circle cx="70" cy="25" r="2" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="1" />
          <circle cx="30" cy="80" r="2" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="1" />
          <circle cx="70" cy="80" r="2" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="1" />
        </motion.g>
      </svg>
    ),
    teacher: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -2, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Tête */}
          <circle cx="50" cy="35" r="18" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          
          {/* Cheveux */}
          <path
            d="M 35 28 Q 35 20 43 18 Q 50 17 57 18 Q 65 20 65 28"
            fill="#7b6b4a"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          
          {/* Lunettes */}
          <g>
            <circle cx="43" cy="35" r="5" fill="none" stroke="#7b6b4a" strokeWidth="2.5" />
            <circle cx="57" cy="35" r="5" fill="none" stroke="#7b6b4a" strokeWidth="2.5" />
            <line x1="48" y1="35" x2="52" y2="35" stroke="#7b6b4a" strokeWidth="2.5" />
          </g>
          
          {/* Sourire */}
          <path
            d="M 42 42 Q 50 46 58 42"
            stroke="#7b6b4a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Corps - chemise */}
          <path
            d="M 35 50 L 30 55 L 30 85 L 70 85 L 70 55 L 65 50 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
          />
          
          {/* Cravate */}
          <path
            d="M 50 50 L 47 60 L 50 75 L 53 60 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          
          {/* Livre sous le bras */}
          <motion.rect
            x="68"
            y="60"
            width="12"
            height="16"
            rx="1"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="2"
            animate={animated ? {
              y: [0, -2, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Étoiles d'excellence */}
          <motion.path
            d="M 20 30 L 21 32 L 23 32 L 21.5 33.5 L 22 35.5 L 20 34 L 18 35.5 L 18.5 33.5 L 17 32 L 19 32 Z"
            fill="#f5c25b"
            animate={animated ? {
              scale: [1, 1.3, 1],
              rotate: [0, 360, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    student: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Tête */}
          <circle cx="50" cy="38" r="16" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          
          {/* Cheveux enfant */}
          <path
            d="M 36 32 Q 40 24 50 23 Q 60 24 64 32"
            fill="#7b6b4a"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          <circle cx="38" cy="30" r="3" fill="#7b6b4a" />
          <circle cx="62" cy="30" r="3" fill="#7b6b4a" />
          
          {/* Yeux enjoués */}
          <motion.circle
            cx="44"
            cy="37"
            r="2.5"
            fill="#7b6b4a"
            animate={animated ? {
              scaleY: [1, 0.1, 1],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx="56"
            cy="37"
            r="2.5"
            fill="#7b6b4a"
            animate={animated ? {
              scaleY: [1, 0.1, 1],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          
          {/* Grand sourire */}
          <path
            d="M 42 44 Q 50 48 58 44"
            stroke="#7b6b4a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Joues roses */}
          <circle cx="38" cy="42" r="3" fill="#e76f51" opacity="0.5" />
          <circle cx="62" cy="42" r="3" fill="#e76f51" opacity="0.5" />
          
          {/* Corps - t-shirt */}
          <path
            d="M 36 52 L 32 56 L 32 82 L 68 82 L 68 56 L 64 52 Z"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="3"
          />
          
          {/* Sac à dos */}
          <motion.path
            d="M 65 55 Q 72 55 75 60 L 75 75 Q 75 78 72 78 L 68 78 L 68 60 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="2.5"
            animate={animated ? {
              x: [0, 1, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <line x1="68" y1="58" x2="72" y2="58" stroke="#7b6b4a" strokeWidth="2" />
          
          {/* Étoile de motivation */}
          <motion.path
            d="M 24 60 L 25 62 L 27 62 L 25.5 63.5 L 26 65.5 L 24 64 L 22 65.5 L 22.5 63.5 L 21 62 L 23 62 Z"
            fill="#f5c25b"
            animate={animated ? {
              scale: [1, 1.4, 1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            d="M 50 75 L 30 55 Q 25 50 25 42 Q 25 30 35 28 Q 42 27 50 35 Q 58 27 65 28 Q 75 30 75 42 Q 75 50 70 55 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <motion.ellipse
            cx="42"
            cy="40"
            rx="5"
            ry="7"
            fill="#ffffff"
            opacity="0.5"
            animate={animated ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </motion.g>
      </svg>
    ),
    calculator: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <rect x="25" y="15" width="50" height="70" rx="5" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="3" />
          <rect x="30" y="22" width="40" height="15" rx="2" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2" />
          <text x="50" y="33" textAnchor="middle" fill="#7b6b4a" fontSize="10" fontWeight="bold">123</text>
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={32 + col * 12}
                y={42 + row * 10}
                width="10"
                height="8"
                rx="2"
                fill="#beeaf7"
                stroke="#7b6b4a"
                strokeWidth="1.5"
              />
            ))
          )}
        </motion.g>
      </svg>
    ),
    science: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            d="M 40 25 L 40 50 L 30 70 Q 28 75 32 78 L 68 78 Q 72 75 70 70 L 60 50 L 60 25 Z"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x="38" y="20" width="24" height="8" rx="2" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
          <motion.circle
            cx="45"
            cy="65"
            r="4"
            fill="#2bb59a"
            animate={animated ? {
              y: [-5, 5],
              opacity: [0.7, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <circle cx="55" cy="68" r="3" fill="#e76f51" opacity="0.8" />
        </motion.g>
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <circle cx="50" cy="50" r="30" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="30" ry="15" fill="none" stroke="#2bb59a" strokeWidth="2" />
          <ellipse cx="50" cy="50" rx="15" ry="30" fill="none" stroke="#2bb59a" strokeWidth="2" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="#2bb59a" strokeWidth="2" />
          <path d="M 35 30 Q 40 35 45 30 Q 50 25 55 30 Q 60 35 65 30" fill="none" stroke="#2bb59a" strokeWidth="2" />
          <path d="M 35 70 Q 40 65 45 70 Q 50 75 55 70 Q 60 65 65 70" fill="none" stroke="#2bb59a" strokeWidth="2" />
        </motion.g>
      </svg>
    ),
    music: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -5, 0],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <line x1="45" y1="25" x2="45" y2="65" stroke="#7b6b4a" strokeWidth="3" strokeLinecap="round" />
          <line x1="65" y1="20" x2="65" y2="60" stroke="#7b6b4a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="45" cy="68" rx="8" ry="10" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          <ellipse cx="65" cy="63" rx="8" ry="10" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          <path d="M 45 25 Q 55 28 65 20" stroke="#7b6b4a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <motion.path
            d="M 25 40 Q 28 35 33 38"
            stroke="#2bb59a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </svg>
    ),
    megaphone: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, -5, 5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            d="M 25 45 L 45 35 L 45 65 L 25 55 Z"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 45 35 Q 60 30 75 25 Q 80 25 80 35 L 80 65 Q 80 75 75 75 Q 60 70 45 65 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 28 55 L 28 60 Q 28 68 35 70 Q 40 71 43 68 L 43 63"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          <motion.path
            d="M 82 40 Q 88 38 90 35"
            stroke="#beeaf7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0, 1, 0],
              x: [0, 5]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.path
            d="M 82 50 Q 90 50 95 48"
            stroke="#beeaf7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0, 1, 0],
              x: [0, 5]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3
            }}
          />
          <motion.path
            d="M 82 60 Q 88 62 90 65"
            stroke="#beeaf7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0, 1, 0],
              x: [0, 5]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.6
            }}
          />
        </motion.g>
      </svg>
    ),
  };

  return (
    <MotionWrapper {...animationProps} className="inline-flex items-center justify-center">
      {icons[type]}
    </MotionWrapper>
  );
}
