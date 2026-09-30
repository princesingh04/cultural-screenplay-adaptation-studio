const fs = require('fs');
const path = require('path');

// Stylized Character Portraits for Script 3
const DEV_PORTRAIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="devBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#devBg)"/>
  
  <!-- Subtle Arid Background Rays -->
  <polygon points="300,100 0,800 600,800" fill="#78350f" opacity="0.15"/>

  <!-- Dev Body: Indigo Mechanic Shirt & Red Gamchha -->
  <path d="M 140 800 L 170 560 L 220 500 L 380 500 L 430 560 L 460 800 Z" fill="#1e3a8a"/>
  <!-- Rolled Sleeves with Grease Stains -->
  <rect x="180" y="580" width="40" height="120" rx="10" fill="#d97706" opacity="0.6"/>
  <!-- Red Gamchha Drape -->
  <path d="M 220 500 Q 300 570 380 500 L 370 550 Q 300 620 230 550 Z" fill="#dc2626"/>

  <!-- Neck & Strong Jawline -->
  <rect x="260" y="380" width="80" height="130" fill="#d97706"/>
  <path d="M 200 300 Q 200 480 300 480 Q 400 480 400 300 Z" fill="#f59e0b"/>
  
  <!-- Weathered Stubble & Hardened Eyes -->
  <path d="M 230 380 Q 300 460 370 380 Z" fill="#78350f" opacity="0.7"/>
  <ellipse cx="260" cy="310" rx="16" ry="10" fill="#1c1917"/>
  <ellipse cx="340" cy="310" rx="16" ry="10" fill="#1c1917"/>
  <circle cx="262" cy="310" r="4" fill="#ffffff"/>
  <circle cx="342" cy="310" r="4" fill="#ffffff"/>

  <!-- Short Dark Hair -->
  <path d="M 190 280 Q 300 160 410 280 Q 400 230 300 210 Q 200 230 190 280 Z" fill="#0f172a"/>

  <!-- Stamped Badge -->
  <rect x="40" y="40" width="160" height="30" rx="6" fill="#000" opacity="0.8"/>
  <text x="120" y="60" font-family="monospace" font-size="12" fill="#38bdf8" text-anchor="middle">CHAR_DEV (34)</text>
</svg>`;

const BALWANT_PORTRAIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="balBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#balBg)"/>

  <!-- Crisp Starched White Linen Kurta -->
  <path d="M 120 800 L 160 520 L 220 460 L 380 460 L 440 520 L 480 800 Z" fill="#f8fafc"/>
  <line x1="300" y1="460" x2="300" y2="760" stroke="#cbd5e1" stroke-width="4"/>

  <!-- Silver Bamboo Cane Head in Foreground -->
  <circle cx="480" cy="620" r="32" fill="#e2e8f0"/>
  <line x1="480" y1="620" x2="480" y2="800" stroke="#94a3b8" stroke-width="14"/>

  <!-- Fleshy Face, Silver Trimmed Hair -->
  <rect x="250" y="340" width="100" height="130" fill="#fdba74"/>
  <path d="M 180 260 Q 180 460 300 460 Q 420 460 420 260 Z" fill="#fed7aa"/>
  
  <!-- Heavy Aristocratic Twirled Mustache -->
  <path d="M 230 380 Q 300 420 370 380 Q 420 360 400 400 Q 300 460 200 400 Z" fill="#475569"/>

  <!-- Polarized Aviator Sunglasses (Hiding cold eyes) -->
  <rect x="210" y="270" width="80" height="50" rx="10" fill="#09090b" stroke="#ca8a04" stroke-width="4"/>
  <rect x="310" y="270" width="80" height="50" rx="10" fill="#09090b" stroke="#ca8a04" stroke-width="4"/>
  <line x1="290" y1="285" x2="310" y2="285" stroke="#ca8a04" stroke-width="4"/>

  <!-- Slick Silver-Grey Hair -->
  <path d="M 180 260 Q 300 150 420 260 Q 410 200 300 180 Q 190 200 180 260 Z" fill="#94a3b8"/>

  <rect x="40" y="40" width="220" height="30" rx="6" fill="#000" opacity="0.8"/>
  <text x="150" y="60" font-family="monospace" font-size="12" fill="#facc15" text-anchor="middle">CHAUDHARY BALWANT (58)</text>
</svg>`;

const ANANYA_PORTRAIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="anaBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#042f2e"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#anaBg)"/>

  <!-- White Doctor's Lab Coat over Teal Saree -->
  <path d="M 130 800 L 170 540 L 220 480 L 380 480 L 430 540 L 470 800 Z" fill="#f8fafc"/>
  <path d="M 260 480 L 300 660 L 340 480 Z" fill="#0d9488"/>

  <!-- Stethoscope around Neck -->
  <path d="M 230 480 Q 220 620 300 640 Q 380 620 370 480" fill="none" stroke="#334155" stroke-width="10"/>
  <circle cx="300" cy="640" r="16" fill="#94a3b8"/>

  <!-- Expressive Intelligent Face, Ink-Stained Fingers -->
  <rect x="260" y="360" width="80" height="130" fill="#fbcfe8"/>
  <path d="M 200 280 Q 200 460 300 460 Q 400 460 400 280 Z" fill="#fce7f3"/>

  <!-- Intense Kind Eyes with Clinical Fatigue Shadows -->
  <ellipse cx="255" cy="300" rx="16" ry="10" fill="#1c1917"/>
  <ellipse cx="345" cy="300" rx="16" ry="10" fill="#1c1917"/>
  <circle cx="257" cy="298" r="4" fill="#ffffff"/>
  <circle cx="347" cy="298" r="4" fill="#ffffff"/>

  <!-- Neatly Tied Dark Hair in Bun -->
  <path d="M 190 260 Q 300 150 410 260 Q 400 190 300 170 Q 200 190 190 260 Z" fill="#09090b"/>
  <circle cx="300" cy="160" r="35" fill="#09090b"/>

  <rect x="40" y="40" width="180" height="30" rx="6" fill="#000" opacity="0.8"/>
  <text x="130" y="60" font-family="monospace" font-size="12" fill="#2dd4bf" text-anchor="middle">DR. ANANYA (28)</text>
</svg>`;

const charDir = path.join(__dirname, '..', 'public', 'images', 'characters');
const costDir = path.join(__dirname, '..', 'public', 'images', 'costumes');

fs.writeFileSync(path.join(charDir, 'dev.svg'), DEV_PORTRAIT, 'utf8');
fs.writeFileSync(path.join(costDir, 'dev_costume.svg'), DEV_PORTRAIT, 'utf8');

fs.writeFileSync(path.join(charDir, 'balwant.svg'), BALWANT_PORTRAIT, 'utf8');
fs.writeFileSync(path.join(costDir, 'balwant_costume.svg'), BALWANT_PORTRAIT, 'utf8');

fs.writeFileSync(path.join(charDir, 'ananya.svg'), ANANYA_PORTRAIT, 'utf8');
fs.writeFileSync(path.join(costDir, 'ananya_costume.svg'), ANANYA_PORTRAIT, 'utf8');

console.log('✓ Successfully created Script 3 character and costume SVGs!');
