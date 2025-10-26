import { motion } from 'motion/react';

export function CartoonBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient de fond principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100" />
      
      {/* Nuages cartoon */}
      <motion.div
        className="absolute top-10 left-[10%] opacity-30"
        animate={{
          x: [0, 30, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="120" height="60" viewBox="0 0 120 60">
          <path
            d="M 20 40 Q 10 30 20 20 Q 30 15 40 20 Q 50 10 60 20 Q 75 15 85 25 Q 100 20 105 35 Q 110 45 95 48 Q 85 52 75 48 Q 65 52 55 48 Q 45 52 35 48 Q 25 50 20 40 Z"
            fill="white"
            stroke="#2bb59a"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-32 right-[15%] opacity-25"
        animate={{
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="100" height="50" viewBox="0 0 100 50">
          <path
            d="M 15 35 Q 8 28 15 20 Q 22 16 30 20 Q 38 12 48 20 Q 58 16 68 24 Q 78 20 82 32 Q 85 40 75 42 Q 65 45 55 42 Q 45 45 35 42 Q 25 44 15 35 Z"
            fill="white"
            stroke="#beeaf7"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Étoiles orientales décoratives */}
      <motion.div
        className="absolute top-[20%] right-[25%]"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path
            d="M 20 2 L 22 18 L 38 20 L 22 22 L 20 38 L 18 22 L 2 20 L 18 18 Z"
            fill="#f5c25b"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[60%] left-[20%]"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="35" height="35" viewBox="0 0 35 35">
          <path
            d="M 17.5 1.5 L 19 15.5 L 33 17.5 L 19 19.5 L 17.5 33.5 L 16 19.5 L 2 17.5 L 16 15.5 Z"
            fill="#2bb59a"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Motifs arabesques simplifiés */}
      <motion.div
        className="absolute bottom-[15%] right-[10%]"
        animate={{
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#f1e8da" strokeWidth="3" opacity="0.5" />
          <circle cx="40" cy="40" r="20" fill="none" stroke="#2bb59a" strokeWidth="2" opacity="0.4" />
          <path
            d="M 40 10 Q 50 25 40 40 Q 30 25 40 10 M 70 40 Q 55 50 40 40 Q 55 30 70 40 M 40 70 Q 30 55 40 40 Q 50 55 40 70 M 10 40 Q 25 30 40 40 Q 25 50 10 40"
            fill="#beeaf7"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Lanternes orientales cartoon */}
      <motion.div
        className="absolute top-[40%] left-[5%]"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="50" height="70" viewBox="0 0 50 70">
          {/* Corde */}
          <line x1="25" y1="0" x2="25" y2="10" stroke="#7b6b4a" strokeWidth="2" />
          {/* Haut de la lanterne */}
          <ellipse cx="25" cy="12" rx="12" ry="4" fill="#f5c25b" />
          {/* Corps de la lanterne */}
          <path
            d="M 13 12 Q 10 35 13 50 L 37 50 Q 40 35 37 12 Z"
            fill="#e76f51"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          {/* Motif central */}
          <ellipse cx="25" cy="31" rx="8" ry="15" fill="#f5c25b" opacity="0.6" />
          {/* Bas de la lanterne */}
          <ellipse cx="25" cy="50" rx="12" ry="4" fill="#f5c25b" />
          {/* Gland */}
          <circle cx="25" cy="58" r="4" fill="#f5c25b" />
          <line x1="25" y1="54" x2="25" y2="62" stroke="#7b6b4a" strokeWidth="2" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] left-[80%]"
        animate={{
          y: [0, -15, 0],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="45" height="65" viewBox="0 0 45 65">
          <line x1="22.5" y1="0" x2="22.5" y2="8" stroke="#7b6b4a" strokeWidth="2" />
          <ellipse cx="22.5" cy="10" rx="10" ry="3" fill="#2bb59a" />
          <path
            d="M 12.5 10 Q 10 30 12.5 45 L 32.5 45 Q 35 30 32.5 10 Z"
            fill="#beeaf7"
            stroke="#7b6b4a"
            strokeWidth="2"
          />
          <ellipse cx="22.5" cy="27.5" rx="7" ry="12" fill="#2bb59a" opacity="0.5" />
          <ellipse cx="22.5" cy="45" rx="10" ry="3" fill="#2bb59a" />
          <circle cx="22.5" cy="52" r="3.5" fill="#2bb59a" />
          <line x1="22.5" y1="48.5" x2="22.5" y2="55.5" stroke="#7b6b4a" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Oiseaux cartoon volants */}
      <motion.div
        className="absolute top-[25%] left-[40%]"
        animate={{
          x: [0, 100, 200],
          y: [0, -10, -5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path
            d="M 5 10 Q 0 5 5 8 Q 10 5 15 10 Q 20 5 25 8 Q 30 5 25 10"
            fill="none"
            stroke="#053d52"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Cercles décoratifs flottants */}
      <motion.div
        className="absolute top-[70%] right-[40%]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-20 h-20 rounded-full border-4 border-primary/30" />
      </motion.div>

      <motion.div
        className="absolute top-[15%] left-[70%]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="w-16 h-16 rounded-full border-4 border-secondary/40" />
      </motion.div>

      {/* Points lumineux scintillants */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-warning"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
