export function OrientalDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Étoiles décoratives */}
      <div className="absolute top-4 left-4 text-accent animate-pulse">⭐</div>
      <div className="absolute top-8 right-12 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute bottom-12 left-8 text-primary animate-pulse" style={{ animationDelay: '1s' }}>🌙</div>
      <div className="absolute bottom-4 right-4 text-accent animate-pulse" style={{ animationDelay: '1.5s' }}>⭐</div>
      
      {/* Motifs géométriques arabesques */}
      <svg className="absolute top-0 right-0 w-32 h-32 text-secondary/10" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,10 Q60,30 50,50 Q40,30 50,10 M50,50 Q70,60 50,90 Q30,60 50,50" />
        <circle cx="50" cy="50" r="5" />
      </svg>
      
      <svg className="absolute bottom-0 left-0 w-40 h-40 text-accent/10" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,20 L60,40 L50,60 L40,40 Z M50,60 L70,70 L50,90 L30,70 Z" />
      </svg>
    </div>
  );
}

export function MoroccanPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="moroccan" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <circle cx="40" cy="40" r="3"/>
            <path d="M40,20 Q30,30 40,40 Q50,30 40,20 Z"/>
            <path d="M40,60 Q30,50 40,40 Q50,50 40,60 Z"/>
            <path d="M20,40 Q30,30 40,40 Q30,50 20,40 Z"/>
            <path d="M60,40 Q50,30 40,40 Q50,50 60,40 Z"/>
          </g>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#moroccan)" className="text-secondary"/>
    </svg>
  );
}
