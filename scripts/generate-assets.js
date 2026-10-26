const fs = require('fs');
const path = require('path');

const targetDir = 'C:/Users/USER/Desktop/rapIA/assets';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Official Super Ballon d'Or Trophy SVG
const superBallonTrophy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%" fill="none">
  <defs>
    <radialGradient id="goldGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#FFE082" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#D4AF37" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2B2"/>
      <stop offset="25%" stop-color="#FFE082"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="75%" stop-color="#9A7B1C"/>
      <stop offset="100%" stop-color="#664F0C"/>
    </linearGradient>
    <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="50%" stop-color="#C62828"/>
      <stop offset="100%" stop-color="#5C0000"/>
    </linearGradient>
    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A2A35"/>
      <stop offset="50%" stop-color="#16161C"/>
      <stop offset="100%" stop-color="#0A0A0D"/>
    </linearGradient>
    <filter id="goldShine" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Ambient Glow -->
  <circle cx="200" cy="210" r="180" fill="url(#goldGlow)"/>

  <!-- Pedestal / Base -->
  <path d="M100 420 L300 420 L320 450 L80 450 Z" fill="url(#baseGrad)" stroke="#D4AF37" stroke-width="1.5"/>
  <path d="M120 370 L280 370 L295 420 L105 420 Z" fill="url(#baseGrad)" stroke="#D4AF37" stroke-width="1.2"/>
  <rect x="130" y="382" width="140" height="26" rx="3" fill="#111115" stroke="#D4AF37" stroke-width="1"/>
  <text x="200" y="399" font-family="'Cinzel', serif" font-size="10" font-weight="700" fill="#FFE082" text-anchor="middle" letter-spacing="2">SUPER BALLON D'OR</text>
  
  <!-- Red Ruby Plinth Jewel (Historical 1989 signature) -->
  <polygon points="200,340 225,355 200,370 175,355" fill="url(#rubyGrad)" stroke="#FFE082" stroke-width="1" filter="url(#goldShine)"/>

  <!-- Trophy Column & Laurel Branches -->
  <path d="M190 340 L190 260 L210 260 L210 340 Z" fill="url(#goldGrad)"/>
  <path d="M160 330 C130 280 140 220 170 190" stroke="url(#goldGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M240 330 C270 280 260 220 230 190" stroke="url(#goldGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>

  <!-- Side mini golden spheres (Di Stefano 1989 trophy layout) -->
  <circle cx="140" cy="220" r="24" fill="url(#goldGrad)" stroke="#FFE082" stroke-width="1"/>
  <circle cx="260" cy="220" r="24" fill="url(#goldGrad)" stroke="#FFE082" stroke-width="1"/>

  <!-- Central Great Golden Ball (Ballon d'Or) -->
  <circle cx="200" cy="150" r="75" fill="url(#goldGrad)" filter="url(#goldShine)"/>
  
  <!-- Soccer Ball Pentagons & Seams pattern -->
  <polygon points="200,125 218,138 211,158 189,158 182,138" fill="#8B6909" opacity="0.85"/>
  <line x1="200" y1="125" x2="200" y2="98" stroke="#664F0C" stroke-width="2.5"/>
  <line x1="218" y1="138" x2="240" y2="130" stroke="#664F0C" stroke-width="2.5"/>
  <line x1="211" y1="158" x2="230" y2="180" stroke="#664F0C" stroke-width="2.5"/>
  <line x1="189" y1="158" x2="170" y2="180" stroke="#664F0C" stroke-width="2.5"/>
  <line x1="182" y1="138" x2="160" y2="130" stroke="#664F0C" stroke-width="2.5"/>

  <!-- Outer Pentagon accents -->
  <polygon points="240,130 260,115 265,135 250,150 235,142" fill="#8B6909" opacity="0.6"/>
  <polygon points="160,130 140,115 135,135 150,150 165,142" fill="#8B6909" opacity="0.6"/>

  <!-- Golden light sparkle -->
  <circle cx="170" cy="115" r="6" fill="#FFFFFF" opacity="0.8"/>
  <polygon points="170,105 173,115 183,115 175,119 178,129 170,123 162,129 165,119 157,115 167,115" fill="#FFFFFF" opacity="0.9"/>
</svg>`;

// 2. Official Golden Seal SVG
const officialSeal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2B2"/>
      <stop offset="30%" stop-color="#FFE082"/>
      <stop offset="60%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#8B6909"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="90" stroke="url(#sealGrad)" stroke-width="3" stroke-dasharray="4 3"/>
  <circle cx="100" cy="100" r="82" stroke="url(#sealGrad)" stroke-width="1"/>
  <circle cx="100" cy="100" r="76" fill="#121217" stroke="url(#sealGrad)" stroke-width="1.5"/>
  <path id="curveTop" d="M35 100 A65 65 0 0 1 165 100" fill="none"/>
  <path id="curveBottom" d="M165 100 A65 65 0 0 1 35 100" fill="none"/>
  <text font-family="'Cinzel', serif" font-size="9" font-weight="800" fill="#FFE082" letter-spacing="2.5">
    <textPath href="#curveTop" startOffset="50%" text-anchor="middle">VERIFIED BALLOT PASS</textPath>
  </text>
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#D4AF37" letter-spacing="2">
    <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">OFFICIAL 2026 AUDIT</textPath>
  </text>
  <polygon points="100,55 105,70 120,70 108,80 112,95 100,85 88,95 92,80 80,70 95,70" fill="url(#sealGrad)"/>
  <text x="100" y="125" font-family="'Cinzel', serif" font-size="16" font-weight="900" fill="#FFF2B2" text-anchor="middle">100%</text>
  <text x="100" y="138" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600" fill="#FFE082" text-anchor="middle" letter-spacing="1.5">LEGAL AUDIT</text>
</svg>`;

// 3. Helper to generate stylized SVG player portraits
function createPlayerCardSVG(name, nickname, country, era, bdorCount, estimatedBdor, colorTheme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="cardBg_${name.replace(/\s+/g, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1A24"/>
      <stop offset="50%" stop-color="#121217"/>
      <stop offset="100%" stop-color="#0A0A0E"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2B2"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#8B6909"/>
    </linearGradient>
    <radialGradient id="playerGlow_${name.replace(/\s+/g, '_')}" cx="50%" cy="40%" r="45%">
      <stop offset="0%" stop-color="${colorTheme}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${colorTheme}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Card Border & Background -->
  <rect x="2" y="2" width="316" height="436" rx="16" fill="url(#cardBg_${name.replace(/\s+/g, '_')})" stroke="url(#borderGrad)" stroke-width="2"/>
  
  <!-- Subtle Guilloche Mesh Background -->
  <circle cx="160" cy="180" r="140" fill="url(#playerGlow_${name.replace(/\s+/g, '_')})"/>
  <circle cx="160" cy="180" r="110" stroke="rgba(212,175,55,0.12)" stroke-width="1" stroke-dasharray="6 4"/>
  <circle cx="160" cy="180" r="85" stroke="rgba(212,175,55,0.1)" stroke-width="1"/>

  <!-- Top Header Pill -->
  <rect x="20" y="20" width="80" height="22" rx="4" fill="rgba(212,175,55,0.15)" stroke="#D4AF37" stroke-width="1"/>
  <text x="60" y="35" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#FFE082" text-anchor="middle">${era}</text>

  <!-- Country Flag Pill -->
  <rect x="220" y="20" width="80" height="22" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="260" y="35" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" fill="#E0E0E0" text-anchor="middle">${country}</text>

  <!-- Player Silhouette / Artistic Vector Monogram -->
  <g transform="translate(60, 60)">
    <circle cx="100" cy="110" r="65" fill="#1C1C26" stroke="#D4AF37" stroke-width="1.5"/>
    <!-- Abstract Football Legend Silhouette -->
    <path d="M100 70 C115 70 125 82 125 98 C125 114 115 124 100 124 C85 124 75 114 75 98 C75 82 85 70 100 70 Z" fill="url(#borderGrad)"/>
    <path d="M60 165 C60 135 80 130 100 130 C120 130 140 135 140 165 Z" fill="url(#borderGrad)"/>
    <!-- Golden Crown / Star for Legend -->
    <polygon points="100,48 104,58 115,58 106,65 109,75 100,68 91,75 94,65 85,58 96,58" fill="#FFE082"/>
  </g>

  <!-- Name & Nickname -->
  <text x="160" y="285" font-family="'Cinzel', serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${name.toUpperCase()}</text>
  <text x="160" y="306" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-style="italic" fill="#D4AF37" text-anchor="middle">"${nickname}"</text>

  <!-- Historical Stat Bar -->
  <line x1="40" y1="325" x2="280" y2="325" stroke="rgba(212,175,55,0.25)" stroke-width="1"/>
  
  <rect x="35" y="340" width="115" height="55" rx="6" fill="rgba(10,10,14,0.7)" stroke="rgba(212,175,55,0.2)" stroke-width="1"/>
  <text x="92" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#A0A0B0" text-anchor="middle">OFICIALES</text>
  <text x="92" y="384" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#FFE082" text-anchor="middle">${bdorCount} 🏆</text>

  <rect x="170" y="340" width="115" height="55" rx="6" fill="rgba(212,175,55,0.1)" stroke="#D4AF37" stroke-width="1"/>
  <text x="227" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#FFE082" font-weight="700" text-anchor="middle">CALC. 2016 FF</text>
  <text x="227" y="384" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#FFE082" text-anchor="middle">${estimatedBdor}</text>

  <!-- Bottom Chamfer Footer Tag -->
  <text x="160" y="420" font-family="'JetBrains Mono', monospace" font-size="8" fill="#757585" text-anchor="middle" letter-spacing="2">OFFICIAL CANDIDATE #THEGOLDENVOTE</text>
</svg>`;
}

fs.writeFileSync(path.join(targetDir, 'super-ballon-dor-trophy.svg'), superBallonTrophy);
fs.writeFileSync(path.join(targetDir, 'badge-official-seal.svg'), officialSeal);

// Generate cards for 10 legendary icons
const icons = [
  { name: 'Lionel Messi', nickname: 'La Pulga / El GOAT', country: 'ARGENTINA', era: 'SIGLO XXI', bdor: '8', est: '8 OFICIALES', color: '#00D4FF' },
  { name: 'Cristiano Ronaldo', nickname: 'El Bicho / CR7', country: 'PORTUGAL', era: 'SIGLO XXI', bdor: '5', est: '5 OFICIALES', color: '#FF3B30' },
  { name: 'Pelé', nickname: 'O Rei', country: 'BRASIL', era: '1956-1977', bdor: '0*', est: '7 ESTIMADOS', color: '#00E676' },
  { name: 'Diego Maradona', nickname: 'D10S / El Pibe de Oro', country: 'ARGENTINA', era: '1976-1997', bdor: '0*', est: '2 ESTIMADOS', color: '#29B6F6' },
  { name: 'Alfredo Di Stéfano', nickname: 'La Saeta Rubia', country: 'ESP / ARG', era: 'SUPER 1989', bdor: '2', est: '1 SUPER BDOR', color: '#FFD700' },
  { name: 'Johan Cruyff', nickname: 'El Salvador / Fútbol Total', country: 'PAÍSES BAJOS', era: '1964-1984', bdor: '3', est: '3 OFICIALES', color: '#FF9100' },
  { name: 'Zinedine Zidane', nickname: 'Zizou / El Mago', country: 'FRANCIA', era: '1989-2006', bdor: '1', est: '1 OFICIAL', color: '#3D5AFE' },
  { name: 'Ronaldo Nazário', nickname: 'O Fenômeno / R9', country: 'BRASIL', era: '1993-2011', bdor: '2', est: '2 OFICIALES', color: '#00E5FF' },
  { name: 'Ronaldinho', nickname: 'La Sonrisa del Fútbol', country: 'BRASIL', era: '1998-2018', bdor: '1', est: '1 OFICIAL', color: '#E040FB' },
  { name: 'Franz Beckenbauer', nickname: 'Der Kaiser', country: 'ALEMANIA', era: '1964-1983', bdor: '2', est: '2 OFICIALES', color: '#FFFFFF' }
];

for (const p of icons) {
  const fileName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-card.svg';
  fs.writeFileSync(path.join(targetDir, fileName), createPlayerCardSVG(p.name, p.nickname, p.country, p.era, p.bdor, p.est, p.color));
}

console.log('Generated all trophy, seal, and legend player card SVGs successfully in assets!');

