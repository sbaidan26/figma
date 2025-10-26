export function IllustratedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#beeaf7] via-[#d4f1f9] to-[#e8f7fa]" />
      
      {/* Clouds */}
      <div className="absolute top-10 right-32 w-24 h-8 bg-white/60 rounded-full blur-sm" />
      <div className="absolute top-16 right-40 w-20 h-6 bg-white/50 rounded-full blur-sm" />
      <div className="absolute top-8 left-1/3 w-32 h-10 bg-white/60 rounded-full blur-sm" />
      <div className="absolute top-24 left-1/4 w-28 h-8 bg-white/50 rounded-full blur-sm" />
      
      {/* Birds */}
      <div className="absolute top-20 right-1/3 text-white/40">
        <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor">
          <path d="M2 8C2 8 4 6 6 6C8 6 10 8 10 8C10 8 12 6 14 6C16 6 18 8 18 8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-32 right-1/4 text-white/40">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M2 6C2 6 4 4 6 4C8 4 10 6 10 6C10 6 12 4 14 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      
      {/* Decorative plane */}
      <div className="absolute top-12 left-24 opacity-70">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M42 18L28 22L18 8L14 10L20 24L10 28L6 24L4 26L8 32L14 36L16 34L12 30L16 20L30 26L32 12L42 18Z" 
                fill="#f5c25b" opacity="0.8"/>
        </svg>
      </div>
      
      {/* Bottom landscape */}
      <div className="absolute bottom-0 left-0 right-0 h-64">
        {/* Green hills */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 200 L0 100 Q200 60 400 100 Q600 140 800 80 Q1000 40 1200 100 L1200 200 Z" 
                  fill="#4a9d7f" opacity="0.9"/>
            <path d="M0 200 L0 120 Q300 80 600 120 Q900 160 1200 110 L1200 200 Z" 
                  fill="#5cb592" opacity="0.8"/>
          </svg>
        </div>
        
        {/* Buildings - Left side */}
        <div className="absolute bottom-0 left-12 w-32 h-40">
          {/* Mosque-inspired building */}
          <div className="absolute bottom-0 left-8 w-16 h-28 bg-[#f1e8da] rounded-t-xl border-2 border-[#d4c5a9]">
            {/* Dome */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#2bb59a] rounded-full border-2 border-[#229980]" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-2 h-6 bg-[#f5c25b]" />
            {/* Windows */}
            <div className="absolute top-8 left-2 w-3 h-4 bg-[#beeaf7] rounded-t-full" />
            <div className="absolute top-8 right-2 w-3 h-4 bg-[#beeaf7] rounded-t-full" />
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#beeaf7] rounded-t-lg" />
          </div>
          
          {/* Small building */}
          <div className="absolute bottom-0 left-0 w-10 h-20 bg-[#f8f3e8] rounded-t-lg border-2 border-[#e0d5c0]">
            <div className="absolute top-2 left-2 w-2 h-2 bg-[#beeaf7] rounded" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#beeaf7] rounded" />
          </div>
        </div>
        
        {/* Buildings - Right side */}
        <div className="absolute bottom-0 right-16 w-40 h-48">
          {/* Large building */}
          <div className="absolute bottom-0 right-8 w-24 h-36 bg-[#eaf9f5] rounded-t-2xl border-2 border-[#d7edea]">
            {/* Roof */}
            <div className="absolute -top-4 -left-2 -right-2 h-6 bg-[#e76f51] rounded-t-xl border-2 border-[#d45a3c]" />
            {/* Windows pattern */}
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex gap-3 justify-center mt-3">
                {[0, 1, 2].map((col) => (
                  <div key={col} className="w-3 h-3 bg-[#beeaf7] rounded" />
                ))}
              </div>
            ))}
          </div>
          
          {/* Tower */}
          <div className="absolute bottom-0 right-0 w-12 h-44 bg-[#f1e8da] rounded-t-3xl border-2 border-[#d4c5a9]">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2bb59a] rounded-full" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-5 bg-[#beeaf7] rounded-t-lg" />
          </div>
        </div>
        
        {/* Decorative trees */}
        {[120, 280, 420, 680, 820, 950].map((left, i) => (
          <div key={i} className="absolute bottom-12" style={{ left: `${left}px` }}>
            {/* Tree */}
            <div className="relative w-8 h-24">
              {/* Trunk */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-[#7b6b4a]" />
              {/* Foliage */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#2d6854] rounded-full opacity-90" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#3a7d63] rounded-full opacity-80" />
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#4a9d7f] rounded-full" />
            </div>
          </div>
        ))}
        
        {/* Lanterns */}
        {[200, 500, 750, 1000].map((left, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: `${left}px` }}>
            {/* Pole */}
            <div className="w-1 h-20 bg-[#7b6b4a] mx-auto" />
            {/* Lantern */}
            <div className="w-6 h-8 bg-[#f5c25b] rounded-lg border-2 border-[#e0a83e] -mt-2 mx-auto">
              <div className="w-3 h-3 bg-[#fff8dc] rounded-full mx-auto mt-2 opacity-70" />
            </div>
            {/* Top ornament */}
            <div className="w-2 h-2 bg-[#2bb59a] rounded-full mx-auto -mt-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
