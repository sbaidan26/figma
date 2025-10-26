export function ParentBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Dégradé de base : couleurs vives */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#F5DEB3] to-[#FFE4B5]" />

      {/* Motifs géométriques au centre (inspirés du zellige) */}
      <svg className="absolute inset-0 w-full h-full opacity-15">
        <defs>
          <pattern id="zellige-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Étoile à 8 branches stylisée */}
            <path
              d="M 40 20 L 45 35 L 60 40 L 45 45 L 40 60 L 35 45 L 20 40 L 35 35 Z"
              fill="#2bb59a"
              opacity="0.5"
            />
            {/* Petits losanges */}
            <path d="M 10 10 L 15 15 L 10 20 L 5 15 Z" fill="#beeaf7" opacity="0.4" />
            <path d="M 70 10 L 75 15 L 70 20 L 65 15 Z" fill="#f5c25b" opacity="0.4" />
            <path d="M 10 70 L 15 75 L 10 80 L 5 75 Z" fill="#e76f51" opacity="0.4" />
            <path d="M 70 70 L 75 75 L 70 80 L 65 75 Z" fill="#2bb59a" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zellige-pattern)" />
      </svg>

      {/* Architecture - Arche élégante à gauche */}
      <svg
        className="absolute left-0 top-1/4 w-64 h-96 opacity-80"
        viewBox="0 0 200 300"
        fill="none"
      >
        {/* Arche principale */}
        <path
          d="M 20 300 L 20 120 Q 20 40, 100 40 Q 180 40, 180 120 L 180 300"
          fill="#e76f51"
          opacity="0.7"
        />
        <path
          d="M 20 300 L 20 120 Q 20 40, 100 40 Q 180 40, 180 120 L 180 300"
          stroke="#D2691E"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        />
        
        {/* Détails géométriques de l'arche */}
        <circle cx="100" cy="60" r="8" fill="#2bb59a" opacity="0.8" />
        <rect x="90" y="100" width="20" height="40" rx="4" fill="#2bb59a" opacity="0.7" />
        
        {/* Colonnes stylisées */}
        <rect x="25" y="200" width="15" height="100" fill="#D2691E" opacity="0.8" />
        <rect x="160" y="200" width="15" height="100" fill="#D2691E" opacity="0.8" />
        
        {/* Détails décoratifs horizontaux */}
        <line x1="40" y1="150" x2="160" y2="150" stroke="#D2691E" strokeWidth="2" opacity="0.7" />
        <line x1="50" y1="180" x2="150" y2="180" stroke="#D2691E" strokeWidth="2" opacity="0.7" />
      </svg>

      {/* Architecture - Moucharabieh stylisé à droite */}
      <svg
        className="absolute right-0 top-1/3 w-56 h-80 opacity-80"
        viewBox="0 0 180 250"
        fill="none"
      >
        {/* Mur avec fenêtre */}
        <rect x="20" y="0" width="160" height="250" fill="#f5c25b" opacity="0.6" />
        
        {/* Fenêtre à moucharabieh */}
        <rect x="50" y="40" width="80" height="120" rx="8" fill="#fff" opacity="0.7" />
        <rect x="50" y="40" width="80" height="120" rx="8" stroke="#D2691E" strokeWidth="3" fill="none" opacity="0.8" />
        
        {/* Grille du moucharabieh (simplifiée) */}
        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row}>
            {[0, 1, 2, 3].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={60 + col * 18}
                cy={55 + row * 22}
                r="3"
                fill="#2bb59a"
                opacity="0.7"
              />
            ))}
          </g>
        ))}
        
        {/* Lignes verticales du moucharabieh */}
        <line x1="68" y1="50" x2="68" y2="150" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        <line x1="86" y1="50" x2="86" y2="150" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        <line x1="104" y1="50" x2="104" y2="150" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        <line x1="122" y1="50" x2="122" y2="150" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        
        {/* Bordure décorative */}
        <rect x="45" y="170" width="90" height="3" fill="#D2691E" opacity="0.8" />
      </svg>

      {/* Végétation - Palmier gauche (bas) */}
      <svg
        className="absolute left-10 bottom-0 w-48 h-64 opacity-75"
        viewBox="0 0 150 200"
        fill="none"
      >
        {/* Tronc */}
        <path
          d="M 70 200 Q 75 150, 70 100 Q 68 50, 72 30"
          stroke="#8B4513"
          strokeWidth="7"
          fill="none"
          opacity="0.8"
        />
        
        {/* Feuilles de palmier */}
        <path
          d="M 72 30 Q 40 10, 20 5"
          stroke="#2bb59a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 72 30 Q 50 20, 35 25"
          stroke="#2bb59a"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 72 30 Q 100 10, 120 5"
          stroke="#2bb59a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 72 30 Q 90 20, 105 25"
          stroke="#2bb59a"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 72 30 Q 70 5, 72 0"
          stroke="#2bb59a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Feuilles secondaires */}
        <path
          d="M 72 30 Q 30 25, 10 30"
          stroke="#2bb59a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 72 30 Q 110 25, 130 30"
          stroke="#2bb59a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* Végétation - Feuillages tropicaux droite (bas) */}
      <svg
        className="absolute right-8 bottom-0 w-56 h-72 opacity-75"
        viewBox="0 0 180 220"
        fill="none"
      >
        {/* Feuilles larges style monstera */}
        <ellipse cx="90" cy="180" rx="45" ry="60" fill="#2bb59a" opacity="0.7" />
        <ellipse cx="70" cy="160" rx="40" ry="55" fill="#2bb59a" opacity="0.75" />
        <ellipse cx="110" cy="165" rx="38" ry="50" fill="#2bb59a" opacity="0.7" />
        
        {/* Tiges */}
        <path d="M 90 180 Q 85 200, 88 220" stroke="#8B4513" strokeWidth="4" opacity="0.8" />
        <path d="M 70 160 Q 68 180, 70 220" stroke="#8B4513" strokeWidth="3.5" opacity="0.8" />
        <path d="M 110 165 Q 112 185, 110 220" stroke="#8B4513" strokeWidth="3.5" opacity="0.8" />
        
        {/* Nervures des feuilles */}
        <line x1="90" y1="140" x2="90" y2="200" stroke="#1a8d75" strokeWidth="2" opacity="0.5" />
        <line x1="70" y1="120" x2="70" y2="180" stroke="#1a8d75" strokeWidth="2" opacity="0.5" />
        <line x1="110" y1="130" x2="110" y2="185" stroke="#1a8d75" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* Soleil stylisé en haut à droite */}
      <svg
        className="absolute right-20 top-16 w-32 h-32 opacity-70"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Cercle du soleil */}
        <circle cx="50" cy="50" r="25" fill="#f5c25b" opacity="0.9" />
        <circle cx="50" cy="50" r="25" stroke="#e76f51" strokeWidth="3" fill="none" opacity="0.8" />
        
        {/* Rayons simplifiés */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(rad) * 30;
          const y1 = 50 + Math.sin(rad) * 30;
          const x2 = 50 + Math.cos(rad) * 40;
          const y2 = 50 + Math.sin(rad) * 40;
          
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e76f51"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />
          );
        })}
      </svg>

      {/* Nuages décoratifs très subtils */}
      <svg className="absolute left-1/4 top-20 w-40 h-24 opacity-20" viewBox="0 0 120 60">
        <ellipse cx="30" cy="30" rx="25" ry="15" fill="#fff" />
        <ellipse cx="50" cy="25" rx="30" ry="18" fill="#fff" />
        <ellipse cx="75" cy="30" rx="25" ry="15" fill="#fff" />
      </svg>

      <svg className="absolute right-1/3 top-32 w-32 h-20 opacity-15" viewBox="0 0 100 50">
        <ellipse cx="25" cy="25" rx="20" ry="12" fill="#fff" />
        <ellipse cx="45" cy="22" rx="25" ry="15" fill="#fff" />
        <ellipse cx="65" cy="25" rx="20" ry="12" fill="#fff" />
      </svg>

      {/* Éléments géométriques décoratifs flottants */}
      <svg className="absolute left-1/3 bottom-1/4 w-16 h-16 opacity-40" viewBox="0 0 50 50">
        <path
          d="M 25 5 L 30 20 L 45 25 L 30 30 L 25 45 L 20 30 L 5 25 L 20 20 Z"
          fill="#2bb59a"
        />
      </svg>

      <svg className="absolute right-1/4 top-1/2 w-12 h-12 opacity-35" viewBox="0 0 40 40">
        <path
          d="M 20 2 L 23 15 L 38 20 L 23 25 L 20 38 L 17 25 L 2 20 L 17 15 Z"
          fill="#f5c25b"
        />
      </svg>

      {/* Vignette douce sur les bords pour donner de la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFE4B5]/40 via-transparent to-[#FFE4B5]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFE4B5]/30" />
    </div>
  );
}
