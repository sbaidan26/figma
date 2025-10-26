import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  animation?: 'bounce' | 'shake' | 'spin' | 'wiggle' | 'pulse' | 'float';
}

const animations = {
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  shake: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  },
  spin: {
    rotate: [0, 360],
    transition: { duration: 0.8, ease: "easeInOut" }
  },
  wiggle: {
    rotate: [0, -15, 15, -15, 15, 0],
    x: [0, -3, 3, -3, 3, 0],
    transition: { duration: 0.6 }
  },
  pulse: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.4 }
  },
  float: {
    y: [0, -8, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

export function AnimatedIcon({ 
  icon: Icon, 
  className = "w-5 h-5", 
  animation = 'bounce' 
}: AnimatedIconProps) {
  return (
    <motion.div
      className="inline-block"
      whileHover={animations[animation]}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      <Icon className={className} />
    </motion.div>
  );
}
