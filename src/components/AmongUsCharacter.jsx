export default function AmongUsCharacter({ color = "#C51111", className = "" }) {
  return (
    <svg 
      viewBox="0 0 200 250" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="visor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9BD8E0" />
          <stop offset="50%" stopColor="#41879B" />
          <stop offset="100%" stopColor="#255169" />
        </linearGradient>
        <radialGradient id="visor-highlight" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Backpack */}
      <path 
        d="M 60 70 C 40 70, 20 80, 20 110 L 20 170 C 20 190, 40 190, 60 190 Z" 
        fill={color} 
        stroke="#000" 
        strokeWidth="12" 
        strokeLinejoin="round" 
      />

      {/* Body and Legs */}
      <path 
        d="M 60 100 
           C 60 20, 160 20, 160 100 
           L 160 210 
           C 160 230, 140 230, 130 230 
           C 120 230, 120 220, 120 210 
           L 120 180 
           L 100 180 
           L 100 210 
           C 100 230, 80 230, 70 230 
           C 60 230, 60 220, 60 210 
           Z" 
        fill={color} 
        stroke="#000" 
        strokeWidth="12" 
        strokeLinejoin="round" 
      />

      {/* Visor Base */}
      <path 
        d="M 90 75 
           C 160 75, 185 85, 185 105 
           C 185 125, 160 135, 90 135 
           C 70 135, 70 75, 90 75 Z" 
        fill="url(#visor-gradient)" 
        stroke="#000" 
        strokeWidth="10" 
      />
      
      {/* Visor Highlight */}
      <ellipse cx="145" cy="95" rx="20" ry="8" fill="white" transform="rotate(-10 145 95)" />
    </svg>
  );
}
