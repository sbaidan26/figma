import { motion } from 'motion/react';

interface AppIconProps {
  type: 'coffee' | 'liaison' | 'messaging' | 'absences' | 'notes' | 'schedule' | 'textbook' | 
        'media' | 'photos';
  className?: string;
  animated?: boolean;
}

export function AppIcon({ type, className = "w-8 h-8", animated = true }: AppIconProps) {
  const MotionWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: {
      scale: 1.15,
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  } : {};

  const icons = {
    coffee: (
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
          {/* Tasse */}
          <path
            d="M 25 45 L 25 70 Q 25 75 30 75 L 55 75 Q 60 75 60 70 L 60 45 Z"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Anse */}
          <path
            d="M 60 50 Q 72 50 72 60 Q 72 68 60 68"
            fill="none"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Soucoupe */}
          <ellipse cx="42.5" cy="75" rx="22" ry="5" fill="#e76f51" stroke="#7b6b4a" strokeWidth="2" />
          {/* Café */}
          <rect x="28" y="48" width="29" height="20" fill="#7b6b4a" opacity="0.7" rx="2" />
          {/* Vapeur animée */}
          <motion.path
            d="M 35 38 Q 35 32 37 30"
            stroke="#beeaf7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0.3, 1, 0.3],
              y: [0, -5, -10],
              pathLength: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 42 36 Q 42 30 44 28"
            stroke="#beeaf7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0.3, 1, 0.3],
              y: [0, -5, -10],
              pathLength: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />
          <motion.path
            d="M 50 38 Q 50 32 52 30"
            stroke="#beeaf7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              opacity: [0.3, 1, 0.3],
              y: [0, -5, -10],
              pathLength: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          />
          {/* Coeur dans la mousse */}
          <motion.path
            d="M 42 56 Q 42 54 43.5 54 Q 45 54 45 56 Q 45 58 42 60 Q 39 58 39 56 Q 39 54 40.5 54 Q 42 54 42 56 Z"
            fill="#e76f51"
            opacity="0.6"
            animate={animated ? {
              scale: [1, 1.2, 1],
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
    liaison: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotateY: [0, 10, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Carnet ouvert */}
          <path
            d="M 20 30 L 50 30 L 50 75 L 20 75 Z"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          <path
            d="M 50 30 L 80 30 L 80 75 L 50 75 Z"
            fill="#f6fbf9"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          {/* Spirale */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              cx="50"
              cy={35 + i * 8}
              r="2"
              fill="none"
              stroke="#7b6b4a"
              strokeWidth="2"
            />
          ))}
          {/* Lignes page gauche */}
          <line x1="25" y1="38" x2="45" y2="38" stroke="#2bb59a" strokeWidth="1.5" opacity="0.6" />
          <line x1="25" y1="44" x2="43" y2="44" stroke="#2bb59a" strokeWidth="1.5" opacity="0.6" />
          <line x1="25" y1="50" x2="45" y2="50" stroke="#2bb59a" strokeWidth="1.5" opacity="0.6" />
          <line x1="25" y1="56" x2="42" y2="56" stroke="#2bb59a" strokeWidth="1.5" opacity="0.6" />
          {/* Signature page droite */}
          <motion.path
            d="M 55 45 Q 60 42 65 45 Q 70 48 75 45"
            stroke="#e76f51"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              pathLength: [0, 1],
              opacity: [0, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1
            }}
          />
          {/* Stylo */}
          <motion.g
            animate={animated ? {
              x: [0, 3, 0],
              rotate: [0, 5, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <rect x="68" y="52" width="4" height="18" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="1.5" />
            <path d="M 68 70 L 70 74 L 72 70 Z" fill="#7b6b4a" />
            <circle cx="70" cy="54" r="2" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="1" />
          </motion.g>
        </motion.g>
      </svg>
    ),
    messaging: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Bulle de chat principale */}
          <path
            d="M 25 35 Q 25 25 35 25 L 75 25 Q 85 25 85 35 L 85 55 Q 85 65 75 65 L 40 65 L 25 75 L 25 35 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Points de conversation */}
          <motion.circle
            cx="45"
            cy="45"
            r="4"
            fill="#f6fbf9"
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
          <motion.circle
            cx="55"
            cy="45"
            r="4"
            fill="#f6fbf9"
            animate={animated ? {
              scale: [1, 1.3, 1],
              y: [0, -2, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          <motion.circle
            cx="65"
            cy="45"
            r="4"
            fill="#f6fbf9"
            animate={animated ? {
              scale: [1, 1.3, 1],
              y: [0, -2, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
          {/* Petite bulle */}
          <motion.path
            d="M 70 70 Q 70 65 74 65 L 85 65 Q 90 65 90 70 L 90 78 Q 90 83 85 83 L 78 83 L 70 88 Z"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="2.5"
            animate={animated ? {
              y: [0, -3, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          {/* Coeur dans la petite bulle */}
          <motion.path
            d="M 80 74 Q 80 72 81 72 Q 82 72 82 74 Q 82 75.5 80 77 Q 78 75.5 78 74 Q 78 72 79 72 Q 80 72 80 74 Z"
            fill="#e76f51"
            animate={animated ? {
              scale: [1, 1.2, 1],
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
    absences: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -4, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Presse-papiers */}
          <rect x="30" y="25" width="40" height="55" rx="3" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="3" />
          {/* Pince */}
          <rect x="42" y="18" width="16" height="10" rx="2" fill="#7b6b4a" />
          <rect x="45" y="20" width="10" height="6" rx="1" fill="#f6fbf9" />
          {/* Lignes de texte */}
          <line x1="38" y1="38" x2="62" y2="38" stroke="#2bb59a" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="46" x2="60" y2="46" stroke="#2bb59a" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="54" x2="62" y2="54" stroke="#2bb59a" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="62" x2="58" y2="62" stroke="#2bb59a" strokeWidth="2" strokeLinecap="round" />
          {/* Croix d'absence */}
          <motion.g
            animate={animated ? {
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <line x1="43" y1="65" x2="57" y2="73" stroke="#e76f51" strokeWidth="3" strokeLinecap="round" />
            <line x1="57" y1="65" x2="43" y2="73" stroke="#e76f51" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
        </motion.g>
      </svg>
    ),
    notes: (
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
          {/* Médaille */}
          <circle cx="50" cy="45" r="20" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="3" />
          <circle cx="50" cy="45" r="14" fill="none" stroke="#7b6b4a" strokeWidth="2" />
          {/* Étoile au centre */}
          <motion.path
            d="M 50 35 L 52 41 L 58 41 L 53 45 L 55 51 L 50 47 L 45 51 L 47 45 L 42 41 L 48 41 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="1.5"
            animate={animated ? {
              rotate: [0, 360],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Rubans */}
          <path
            d="M 45 62 L 40 82 L 45 78 L 50 82 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          <path
            d="M 55 62 L 60 82 L 55 78 L 50 82 Z"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          {/* Note */}
          <motion.text
            x="50"
            y="48"
            fontSize="10"
            fill="#7b6b4a"
            textAnchor="middle"
            fontWeight="bold"
            animate={animated ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            A+
          </motion.text>
        </motion.g>
      </svg>
    ),
    schedule: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Horloge */}
          <circle cx="50" cy="50" r="28" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="3" />
          <circle cx="50" cy="50" r="3" fill="#7b6b4a" />
          {/* Marqueurs d'heures */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
            const angle = (hour * 30 - 90) * (Math.PI / 180);
            const x = 50 + 23 * Math.cos(angle);
            const y = 50 + 23 * Math.sin(angle);
            return (
              <circle
                key={hour}
                cx={x}
                cy={y}
                r="1.5"
                fill="#7b6b4a"
              />
            );
          })}
        </motion.g>
        {/* Aiguilles */}
        <motion.line
          x1="50"
          y1="50"
          x2="50"
          y2="32"
          stroke="#e76f51"
          strokeWidth="3"
          strokeLinecap="round"
          animate={animated ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ originX: '50px', originY: '50px' }}
        />
        <motion.line
          x1="50"
          y1="50"
          x2="65"
          y2="50"
          stroke="#2bb59a"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={animated ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ originX: '50px', originY: '50px' }}
        />
      </svg>
    ),
    textbook: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotateY: [0, 10, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Cahier de texte */}
          <path
            d="M 25 20 L 75 20 L 75 85 L 25 85 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
          />
          {/* Pages intérieures */}
          <rect x="30" y="23" width="40" height="59" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2" />
          
          {/* Spirale */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.circle
              key={i}
              cx="25"
              cy={28 + i * 7}
              r="2.5"
              fill="none"
              stroke="#7b6b4a"
              strokeWidth="2"
              animate={animated ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              }}
            />
          ))}
          
          {/* Étiquette "Cahier de texte" */}
          <rect x="35" y="28" width="30" height="8" rx="2" fill="#f5c25b" />
          
          {/* Lignes de dates et devoirs */}
          <line x1="33" y1="42" x2="45" y2="42" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="48" y1="42" x2="67" y2="42" stroke="#2bb59a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          
          <line x1="33" y1="49" x2="45" y2="49" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="48" y1="49" x2="65" y2="49" stroke="#2bb59a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          
          <line x1="33" y1="56" x2="45" y2="56" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="48" y1="56" x2="67" y2="56" stroke="#2bb59a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          
          <line x1="33" y1="63" x2="45" y2="63" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="48" y1="63" x2="63" y2="63" stroke="#2bb59a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          
          {/* Crayon qui écrit */}
          <motion.g
            animate={animated ? {
              x: [0, 3, 0],
              y: [0, 2, 0],
              rotate: [0, -5, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <rect x="60" y="65" width="5" height="18" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" transform="rotate(-30 62.5 74)" />
            <path d="M 54 80 L 57 77 L 59 79 Z" fill="#7b6b4a" />
            <circle cx="67" cy="68" r="2" fill="#e76f51" stroke="#7b6b4a" strokeWidth="1.5" />
          </motion.g>
          
          {/* Étoile de devoir fait */}
          <motion.path
            d="M 40 70 L 41 72 L 43 72 L 41.5 73.5 L 42 75.5 L 40 74 L 38 75.5 L 38.5 73.5 L 37 72 L 39 72 Z"
            fill="#f5c25b"
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
    boards: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Panneau */}
          <rect x="20" y="25" width="60" height="45" rx="4" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="3" />
          {/* Décorations orientales */}
          <motion.path
            d="M 35 38 Q 40 35 45 38 Q 50 35 55 38 Q 60 35 65 38"
            stroke="#f5c25b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={animated ? {
              pathLength: [0, 1, 0],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Étoiles */}
          <motion.path
            d="M 35 50 L 36 52 L 38 52 L 36.5 53.5 L 37 55.5 L 35 54 L 33 55.5 L 33.5 53.5 L 32 52 L 34 52 Z"
            fill="#f5c25b"
            animate={animated ? {
              rotate: [0, 360],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.path
            d="M 65 50 L 66 52 L 68 52 L 66.5 53.5 L 67 55.5 L 65 54 L 63 55.5 L 63.5 53.5 L 62 52 L 64 52 Z"
            fill="#beeaf7"
            animate={animated ? {
              rotate: [0, -360],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Texte simulé */}
          <rect x="30" y="58" width="15" height="3" rx="1.5" fill="#f6fbf9" />
          <rect x="48" y="58" width="22" height="3" rx="1.5" fill="#f6fbf9" />
          {/* Poteau */}
          <rect x="47" y="70" width="6" height="22" fill="#7b6b4a" />
          <ellipse cx="50" cy="92" rx="10" ry="3" fill="#7b6b4a" opacity="0.5" />
        </motion.g>
      </svg>
    ),
    media: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotateY: [0, 20, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Cadre photo */}
          <rect x="20" y="25" width="60" height="50" rx="3" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="3" />
          <rect x="25" y="30" width="50" height="40" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          {/* Soleil */}
          <motion.circle
            cx="40"
            cy="42"
            r="6"
            fill="#f5c25b"
            animate={animated ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Rayons */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * 45) * (Math.PI / 180);
            return (
              <motion.line
                key={i}
                x1={40 + 8 * Math.cos(angle)}
                y1={42 + 8 * Math.sin(angle)}
                x2={40 + 11 * Math.cos(angle)}
                y2={42 + 11 * Math.sin(angle)}
                stroke="#f5c25b"
                strokeWidth="2"
                strokeLinecap="round"
                animate={animated ? {
                  opacity: [0.5, 1, 0.5],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            );
          })}
          {/* Montagnes */}
          <path d="M 25 65 L 35 50 L 45 60 L 55 45 L 65 58 L 75 65 Z" fill="#2bb59a" opacity="0.7" />
          <path d="M 25 65 L 40 52 L 52 62 L 75 62 L 75 70 L 25 70 Z" fill="#2bb59a" />
          {/* Symbole play */}
          <motion.g
            animate={animated ? {
              scale: [1, 1.15, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <circle cx="65" cy="55" r="8" fill="#e76f51" opacity="0.9" stroke="#7b6b4a" strokeWidth="2" />
            <path d="M 62 50 L 62 60 L 70 55 Z" fill="#f6fbf9" />
          </motion.g>
        </motion.g>
      </svg>
    ),
    photos: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            rotate: [0, -3, 3, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Photos empilées */}
          <rect x="35" y="35" width="35" height="30" rx="2" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" transform="rotate(-5 52.5 50)" />
          <rect x="32" y="40" width="35" height="30" rx="2" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" transform="rotate(5 49.5 55)" />
          <rect x="30" y="45" width="40" height="35" rx="2" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="3" />
          {/* Visages souriants */}
          <circle cx="42" cy="58" r="5" fill="#2bb59a" />
          <circle cx="39" cy="57" r="1" fill="#7b6b4a" />
          <circle cx="45" cy="57" r="1" fill="#7b6b4a" />
          <path d="M 40 60 Q 42 61 44 60" stroke="#7b6b4a" strokeWidth="1" fill="none" />
          
          <circle cx="58" cy="58" r="5" fill="#e76f51" />
          <circle cx="55" cy="57" r="1" fill="#7b6b4a" />
          <circle cx="61" cy="57" r="1" fill="#7b6b4a" />
          <path d="M 56 60 Q 58 61 60 60" stroke="#7b6b4a" strokeWidth="1" fill="none" />
          {/* Coeurs */}
          <motion.path
            d="M 50 67 Q 50 65 51.5 65 Q 53 65 53 67 Q 53 69 50 71 Q 47 69 47 67 Q 47 65 48.5 65 Q 50 65 50 67 Z"
            fill="#e76f51"
            animate={animated ? {
              scale: [1, 1.3, 1],
              y: [0, -3, 0]
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
          {/* Calendrier */}
          <rect x="25" y="30" width="50" height="50" rx="4" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="3" />
          <rect x="25" y="30" width="50" height="12" rx="4" fill="#e76f51" />
          <rect x="25" y="37" width="50" height="5" fill="#e76f51" />
          {/* Anneaux */}
          {[35, 50, 65].map((x) => (
            <g key={x}>
              <circle cx={x} cy="27" r="2.5" fill="none" stroke="#7b6b4a" strokeWidth="2.5" />
              <rect x={x - 1.5} y="22" width="3" height="8" fill="#7b6b4a" />
            </g>
          ))}
          {/* Grille */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={29 + col * 8.5}
                y={47 + row * 7.5}
                width="6"
                height="5.5"
                rx="1"
                fill={row === 1 && col === 2 ? "#2bb59a" : "#beeaf7"}
                stroke="#7b6b4a"
                strokeWidth="1"
              />
            ))
          )}
          {/* Événement spécial */}
          <motion.circle
            cx="46.5"
            cy="57.5"
            r="2"
            fill="#e76f51"
            animate={animated ? {
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
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
    meetings: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Écran */}
          <rect x="20" y="25" width="60" height="40" rx="3" fill="#053d52" stroke="#7b6b4a" strokeWidth="3" />
          <rect x="24" y="29" width="52" height="32" fill="#beeaf7" />
          {/* Grille de visages (comme Zoom) */}
          {[0, 1].map((row) =>
            [0, 1].map((col) => (
              <g key={`${row}-${col}`}>
                <rect
                  x={27 + col * 26}
                  y={32 + row * 15}
                  width="24"
                  height="13"
                  fill="#f6fbf9"
                  stroke="#7b6b4a"
                  strokeWidth="1"
                />
                <circle
                  cx={39 + col * 26}
                  cy={38 + row * 15}
                  r="3"
                  fill="#f5c25b"
                />
                <circle cx={37 + col * 26} cy={37 + row * 15} r="0.7" fill="#7b6b4a" />
                <circle cx={41 + col * 26} cy={37 + row * 15} r="0.7" fill="#7b6b4a" />
                <path
                  d={`M ${37 + col * 26} ${39 + row * 15} Q ${39 + col * 26} ${40 + row * 15} ${41 + col * 26} ${39 + row * 15}`}
                  stroke="#7b6b4a"
                  strokeWidth="0.8"
                  fill="none"
                />
              </g>
            ))
          )}
          {/* Support */}
          <rect x="47" y="65" width="6" height="12" fill="#7b6b4a" />
          <ellipse cx="50" cy="77" rx="15" ry="3" fill="#7b6b4a" />
          {/* Indicateur actif */}
          <motion.circle
            cx="70"
            cy="35"
            r="3"
            fill="#2bb59a"
            animate={animated ? {
              opacity: [1, 0.3, 1],
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
    documents: (
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
          {/* Dossier */}
          <path
            d="M 25 35 L 45 35 L 50 30 L 75 30 L 75 75 L 25 75 Z"
            fill="#f5c25b"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 25 40 L 75 40 L 75 75 L 25 75 Z"
            fill="#f6fbf9"
            stroke="#7b6b4a"
            strokeWidth="2.5"
          />
          {/* Documents à l'intérieur */}
          <motion.g
            animate={animated ? {
              y: [0, -2, 0],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          >
            <rect x="32" y="48" width="36" height="3" rx="1.5" fill="#2bb59a" opacity="0.7" />
            <rect x="32" y="55" width="30" height="3" rx="1.5" fill="#beeaf7" opacity="0.7" />
            <rect x="32" y="62" width="33" height="3" rx="1.5" fill="#2bb59a" opacity="0.7" />
          </motion.g>
          {/* Indicateur important */}
          <motion.circle
            cx="65"
            cy="50"
            r="4"
            fill="#e76f51"
            animate={animated ? {
              scale: [1, 1.3, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <text x="65" y="52" fontSize="6" fill="#fff" textAnchor="middle" fontWeight="bold">!</text>
        </motion.g>
      </svg>
    ),
    resources: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -4, 0],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Chapeau de graduation */}
          <motion.g
            animate={animated ? {
              rotate: [0, -3, 3, 0],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              d="M 30 45 L 50 35 L 70 45 L 50 55 Z"
              fill="#053d52"
              stroke="#7b6b4a"
              strokeWidth="3"
            />
            <rect x="48" y="45" width="4" height="20" fill="#053d52" />
            <circle cx="50" cy="65" r="4" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
            {/* Pompon */}
            <motion.circle
              cx="50"
              cy="65"
              r="2.5"
              fill="#e76f51"
              animate={animated ? {
                scale: [1, 1.3, 1],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>
          {/* Livres empilés */}
          <rect x="30" y="70" width="40" height="8" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="35" y="62" width="30" height="8" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="38" y="54" width="24" height="8" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="2" />
          {/* Étoiles de connaissance */}
          <motion.path
            d="M 22 35 L 23 37 L 25 37 L 23.5 38.5 L 24 40.5 L 22 39 L 20 40.5 L 20.5 38.5 L 19 37 L 21 37 Z"
            fill="#f5c25b"
            animate={animated ? {
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 78 35 L 79 37 L 81 37 L 79.5 38.5 L 80 40.5 L 78 39 L 76 40.5 L 76.5 38.5 L 75 37 L 77 37 Z"
            fill="#2bb59a"
            animate={animated ? {
              rotate: [0, -360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.g>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            y: [0, -5, 0, -2, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Pin de localisation */}
          <path
            d="M 50 25 Q 35 25 35 42 Q 35 55 50 75 Q 65 55 65 42 Q 65 25 50 25 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Cercle intérieur */}
          <circle cx="50" cy="42" r="10" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2" />
          {/* Point central */}
          <motion.circle
            cx="50"
            cy="42"
            r="4"
            fill="#2bb59a"
            animate={animated ? {
              scale: [1, 1.5, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Ondes de localisation */}
          <motion.circle
            cx="50"
            cy="42"
            r="15"
            fill="none"
            stroke="#2bb59a"
            strokeWidth="2"
            animate={animated ? {
              scale: [1, 1.5],
              opacity: [1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.circle
            cx="50"
            cy="42"
            r="15"
            fill="none"
            stroke="#2bb59a"
            strokeWidth="2"
            animate={animated ? {
              scale: [1, 1.5],
              opacity: [1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1
            }}
          />
        </motion.g>
      </svg>
    ),
    reports: (
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
          {/* Livret */}
          <path
            d="M 30 25 L 70 25 L 70 80 L 30 80 Z"
            fill="#2bb59a"
            stroke="#7b6b4a"
            strokeWidth="3"
          />
          {/* Pages */}
          <rect x="35" y="28" width="30" height="48" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2" />
          {/* Titre */}
          <rect x="38" y="33" width="24" height="4" rx="2" fill="#f5c25b" />
          {/* Lignes de texte */}
          <line x1="38" y1="43" x2="62" y2="43" stroke="#beeaf7" strokeWidth="1.5" opacity="0.7" />
          <line x1="38" y1="48" x2="60" y2="48" stroke="#beeaf7" strokeWidth="1.5" opacity="0.7" />
          <line x1="38" y1="53" x2="62" y2="53" stroke="#beeaf7" strokeWidth="1.5" opacity="0.7" />
          {/* Évaluations */}
          {[0, 1, 2].map((i) => (
            <motion.g key={i}>
              <rect
                x="38"
                y={60 + i * 5}
                width="18"
                height="3"
                rx="1.5"
                fill="#beeaf7"
                opacity="0.5"
              />
              <motion.rect
                x="38"
                y={60 + i * 5}
                width={12 + i * 3}
                height="3"
                rx="1.5"
                fill="#2bb59a"
                animate={animated ? {
                  width: [0, 12 + i * 3],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                  delay: i * 0.2
                }}
              />
            </motion.g>
          ))}
          {/* Sceau d'approbation */}
          <motion.g
            animate={animated ? {
              rotate: [0, 360],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <circle cx="58" cy="67" r="5" fill="#e76f51" stroke="#7b6b4a" strokeWidth="1.5" />
            <path
              d="M 56 67 L 57.5 68.5 L 60 65.5"
              stroke="#f6fbf9"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </svg>
    ),
    workshops: (
      <svg viewBox="0 0 100 100" fill="none" className={className}>
        <motion.g
          animate={animated ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Table d'atelier */}
          <rect x="25" y="55" width="50" height="35" rx="3" fill="#7b6b4a" stroke="#7b6b4a" strokeWidth="2" />
          <rect x="28" y="58" width="44" height="28" rx="2" fill="#D5C4A1" />
          
          {/* Pieds de table */}
          <rect x="30" y="85" width="5" height="8" fill="#7b6b4a" />
          <rect x="65" y="85" width="5" height="8" fill="#7b6b4a" />
          
          {/* Objets créatifs sur la table */}
          
          {/* Pots de peinture */}
          <motion.g
            animate={animated ? {
              y: [0, -2, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
          >
            <rect x="33" y="63" width="8" height="10" rx="1" fill="#e76f51" stroke="#7b6b4a" strokeWidth="1.5" />
            <ellipse cx="37" cy="63" rx="4" ry="2" fill="#f6fbf9" opacity="0.8" />
          </motion.g>
          
          <motion.g
            animate={animated ? {
              y: [0, -2, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          >
            <rect x="44" y="63" width="8" height="10" rx="1" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="1.5" />
            <ellipse cx="48" cy="63" rx="4" ry="2" fill="#f6fbf9" opacity="0.8" />
          </motion.g>
          
          <motion.g
            animate={animated ? {
              y: [0, -2, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          >
            <rect x="55" y="63" width="8" height="10" rx="1" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="1.5" />
            <ellipse cx="59" cy="63" rx="4" ry="2" fill="#f6fbf9" opacity="0.8" />
          </motion.g>
          
          {/* Pinceaux */}
          <motion.g
            animate={animated ? {
              rotate: [0, -5, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <rect x="35" y="75" width="2" height="12" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="0.5" />
            <path d="M 34 75 L 36 72 L 38 75" fill="#e76f51" stroke="#7b6b4a" strokeWidth="0.5" />
          </motion.g>
          
          <motion.g
            animate={animated ? {
              rotate: [0, 5, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <rect x="60" y="75" width="2" height="12" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="0.5" />
            <path d="M 59 75 L 61 72 L 63 75" fill="#2bb59a" stroke="#7b6b4a" strokeWidth="0.5" />
          </motion.g>
          
          {/* Œuvre en cours - cadre avec dessin */}
          <rect x="35" y="20" width="30" height="35" rx="2" fill="#f6fbf9" stroke="#7b6b4a" strokeWidth="2.5" />
          
          {/* Dessin d'enfant - maison */}
          <path d="M 45 35 L 50 30 L 55 35 L 55 48 L 45 48 Z" fill="#beeaf7" stroke="#7b6b4a" strokeWidth="1.5" />
          <rect x="48" y="42" width="4" height="6" fill="#e76f51" stroke="#7b6b4a" strokeWidth="1" />
          <rect x="47" y="36" width="3" height="3" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="1" />
          
          {/* Soleil */}
          <motion.g
            animate={animated ? {
              rotate: [0, 360],
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <circle cx="57" cy="27" r="3" fill="#f5c25b" stroke="#7b6b4a" strokeWidth="1" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 57 + Math.cos(rad) * 3.5;
              const y1 = 27 + Math.sin(rad) * 3.5;
              const x2 = 57 + Math.cos(rad) * 5;
              const y2 = 27 + Math.sin(rad) * 5;
              
              return (
                <line
                  key={angle}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#f5c25b"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              );
            })}
          </motion.g>
          
          {/* Étoiles décoratives */}
          <motion.path
            d="M 40 25 L 40.5 26.5 L 42 26.5 L 40.8 27.5 L 41.2 29 L 40 28 L 38.8 29 L 39.2 27.5 L 38 26.5 L 39.5 26.5 Z"
            fill="#e76f51"
            animate={animated ? {
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
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
  };

  return (
    <MotionWrapper {...animationProps} className="inline-flex items-center justify-center">
      {icons[type]}
    </MotionWrapper>
  );
}
