const fs = require('fs');
const path = require('path');

console.log('Upgrading build-production-app.js with premium typography, high-contrast header & hero redesign...');

const buildScriptPath = path.join(__dirname, 'build-production-app.js');
let code = fs.readFileSync(buildScriptPath, 'utf8');

// 1. Add Cormorant/Cinzel Decorative font & animations
const fontSearch = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap';
const fontReplacement = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap';
if (code.includes(fontSearch)) {
  code = code.replace(fontSearch, fontReplacement);
}

// 2. Add animation styles
const styleNeedle = '/* Shimmer effect */';
const enhancedStyles = `
    .font-cinzel-dec { font-family: 'Cinzel Decorative', 'Cinzel', serif; }
    
    /* Subtle breathing glow for hero trophy */
    @keyframes heroTrophyFloat {
      0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 25px rgba(212, 175, 55, 0.3)); }
      50% { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 0 45px rgba(255, 224, 130, 0.5)); }
    }
    .animate-trophy-float {
      animation: heroTrophyFloat 6s ease-in-out infinite;
    }

    /* Live pulse indicator */
    @keyframes badgeGlowPulse {
      0%, 100% { opacity: 0.85; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.03); box-shadow: 0 0 20px rgba(0, 229, 153, 0.4); }
    }
    .animate-badge-pulse {
      animation: badgeGlowPulse 2.8s ease-in-out infinite;
    }

    /* Gold text shine */
    .gold-shine-text {
      background: linear-gradient(120deg, #FFFFFF 0%, #FFE082 25%, #D4AF37 55%, #FFFFFF 80%, #FFE082 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: goldShine 6s linear infinite;
    }
    @keyframes goldShine {
      to { background-position: 200% center; }
    }
`;

if (!code.includes('heroTrophyFloat')) {
  code = code.replace(styleNeedle, enhancedStyles + '\n    ' + styleNeedle);
}

// 3. Find and replace Header & Hero
const headerStart = code.indexOf('<!-- 1. TOP AUDIT & LIVE SCRUTINY BAR -->');
const heroEnd = code.indexOf('<!-- 4. MASTER RANKING GLOBAL TABLE');

if (headerStart === -1 || heroEnd === -1) {
  console.error('Could not find header or hero boundaries in build script!');
  process.exit(1);
}

const newHeaderAndHero = `<!-- 1. TOP AUDIT & LIVE SCRUTINY BAR -->
  <header class="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#07070a]/90 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
    
    <!-- Top Micro Bar with High-Contrast Text -->
    <div class="w-full bg-[#0a0a0f] border-b border-white/5 py-1.5 px-4 sm:px-8 text-xs flex justify-between items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase animate-badge-pulse">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          EN VIVO • ESCRUTINIO GLOBAL
        </span>
        <span class="text-gray-600 hidden sm:inline">|</span>
        <span class="text-gray-300 font-medium text-[11px] tracking-wide hidden md:inline">
          <i class="ri-shield-check-fill text-gold-light mr-1"></i> SISTEMA AUDITADO 100% ANTI-BOTS • 1 VOTO = 1 USD
        </span>
      </div>
      
      <div class="flex items-center gap-4 text-[11px]">
        <div class="hidden sm:flex items-center gap-1.5 text-gray-300 font-mono">
          <span class="text-gray-400">VALOR:</span>
          <span class="font-bold text-gold-light bg-gold-primary/10 px-2 py-0.5 rounded border border-gold-primary/30">1 PUNTO = 1 USD</span>
        </div>
        <span class="text-gray-400 font-mono font-semibold" id="headerClock">UTC --:--:--</span>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center gap-4">
      
      <!-- Premium Brand & Logo -->
      <a href="#rankingGlobalSection" class="flex items-center gap-3.5 group flex-shrink-0">
        <!-- Luxury Geometric Emblem Logo -->
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-gold-light via-gold-primary to-amber-700 p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_30px_rgba(255,224,130,0.6)] group-hover:scale-105 transition-all duration-300">
          <div class="w-full h-full bg-[#0a0a0e] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-tr from-gold-primary/20 to-transparent"></div>
            <i class="ri-vip-crown-fill text-gold-light text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(212,175,55,0.8)]"></i>
          </div>
        </div>

        <div>
          <span class="font-cinzel font-black tracking-[0.18em] text-lg sm:text-xl text-white group-hover:text-gold-light transition-colors block leading-tight">
            THE GOLDEN VOTE
          </span>
          <span class="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-gold-light/90 uppercase font-semibold block">
            Escrutinio Oficial Mundial
          </span>
        </div>
      </a>

      <!-- Quick Switcher in Header (Pills with clear contrast) -->
      <div class="hidden lg:inline-flex bg-[#12121a] border border-white/10 p-1 rounded-2xl shadow-inner gap-1">
        <button id="navBtnHistoric" onclick="switchCategory('historic')" class="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary text-black transition-all flex items-center gap-2 shadow-md">
          <i class="ri-vip-crown-fill text-black text-sm"></i> Super Balón Histórico
        </button>
        <button id="navBtn2026" onclick="switchCategory('2026')" class="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-2">
          <i class="ri-football-line text-blue-400 text-sm"></i> Balón de Oro 2026
        </button>
      </div>

      <!-- Action CTA Buttons in Header -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <a href="#statusCardSection" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14141d] hover:bg-[#1a1a26] text-gray-300 hover:text-white text-xs font-bold border border-white/10 transition-all">
          <i class="ri-qr-code-line text-gold-light"></i> Mi Pase
        </a>
        
        <a href="#rankingGlobalSection" class="gold-shimmer-btn px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary text-black font-extrabold text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
          <i class="ri-fire-fill text-base"></i> VOTAR AHORA
        </a>
      </div>

    </div>
  </header>

  <!-- 2. REAL-TIME ROLLING TICKER (Enhanced Contrast) -->
  <div class="w-full bg-[#0d0d13] border-b border-white/10 py-2.5 overflow-hidden text-xs text-gray-300 relative z-10">
    <div class="max-w-7xl mx-auto px-4 flex items-center gap-3">
      <span class="bg-gradient-to-r from-gold-primary/25 to-gold-light/10 text-gold-light text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-gold-primary/40 uppercase whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        TRANSACCIÓN EN VIVO
      </span>
      <div class="overflow-hidden whitespace-nowrap w-full">
        <div class="inline-block animate-marquee font-medium text-gray-300" id="liveTickerContent">
          🔥 Hace 8s: Santiago M. (Buenos Aires) otorgó 50 puntos a Lionel Messi &nbsp;•&nbsp; 
          ⭐ Hace 19s: Marco V. (Milán) otorgó 20 puntos a Pelé &nbsp;•&nbsp; 
          ⚡ Hace 34s: Carlos R. (Madrid) otorgó 10 puntos a Vinicius Júnior &nbsp;•&nbsp; 
          💎 Hace 48s: Kenji T. (Tokio) otorgó 100 puntos a Diego Maradona &nbsp;•&nbsp; 
          ⚽ Hace 1m: Lucas D. (Londres) otorgó 25 puntos a Cristiano Ronaldo &nbsp;•&nbsp; 
          🏆 Hace 2m: Gabriel F. (Río de Janeiro) otorgó 50 puntos a Ronaldo Nazário
        </div>
      </div>
    </div>
  </div>

  <main class="relative z-10">

    <!-- 3. HERO SECTION (REDESIGNED: High Impact, Zero Friction, Direct Flow) -->
    <section class="pt-8 pb-4 px-4 sm:px-6 max-w-7xl mx-auto">
      
      <!-- Hero Main Showcase Banner -->
      <div class="relative rounded-3xl bg-gradient-to-b from-[#14141e] via-[#0d0d14] to-[#08080c] border border-gold-primary/30 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        <!-- Ambient Radial Light -->
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute top-1/2 -right-32 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          <!-- Trophy Showcase (Floating Animation + High Contrast Badging) -->
          <div class="lg:col-span-5 flex flex-col items-center text-center">
            <div class="relative group animate-trophy-float">
              
              <!-- Ambient Halo Glow -->
              <div class="absolute -inset-3 bg-gradient-to-r from-gold-primary via-gold-light to-amber-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition duration-500"></div>
              
              <!-- Container with luxury gold border -->
              <div class="relative w-56 h-64 sm:w-68 sm:h-76 rounded-2xl overflow-hidden border-2 border-gold-primary bg-[#050508] shadow-2xl flex items-center justify-center">
                <img id="activeTrophyImg" src="assets/super-ballon-dor-real.jpg" alt="Super Balón de Oro Real" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                
                <!-- Overlay verified badge -->
                <div class="absolute bottom-3 left-3 right-3 bg-[#0a0a0f]/95 backdrop-blur-md border border-gold-primary/60 rounded-xl py-2 px-3 text-center shadow-lg">
                  <div class="flex items-center justify-center gap-1.5 text-gold-light text-xs font-mono font-bold">
                    <i class="ri-verified-badge-fill text-gold-primary text-sm"></i>
                    <span id="trophyBadgeText">DI STÉFANO 1989 & GOAT HISTÓRICO</span>
                  </div>
                  <span class="text-[10px] text-gray-400 block mt-0.5">France Football • Edición Especial</span>
                </div>
              </div>
            </div>

            <!-- Trophy Label -->
            <p class="text-xs text-gray-300 mt-3 font-mono tracking-wide" id="trophyDescCaption">
              <i class="ri-trophy-line text-gold-primary mr-1"></i> El galardón individual más exclusivo en la historia del fútbol
            </p>
          </div>

          <!-- Hero Headline & Rapid CTA -->
          <div class="lg:col-span-7 flex flex-col items-start">
            
            <!-- Category Tag Badge with High Contrast -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-primary/15 border border-gold-primary/40 text-gold-light text-xs font-mono font-bold mb-4 uppercase tracking-wider" id="activeCategoryTag">
              <i class="ri-vip-crown-fill text-gold-primary"></i> DISTINCIÓN HISTÓRICA MÁXIMA (1956 - 2026)
            </div>

            <!-- Big Impact Headline with Gold Shine Typography -->
            <h1 class="font-cinzel text-3xl sm:text-5xl lg:text-5xl font-black text-white leading-[1.15] mb-4" id="activeCategoryTitle">
              El Super Balón de Oro: <br>
              <span class="gold-shine-text">Corona al Rey de la Historia</span>
            </h1>

            <!-- Crisp, High-Contrast Explanation (Zero Clutter) -->
            <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-normal" id="activeCategoryDescription">
              Saldamos 70 años de injusticia. Ya no deciden comités cerrados ni encuestas gratuitas vulnerables a firmas falsas y bots. <strong class="text-gold-light font-bold">1 PUNTO = 1 USD</strong>: cada voto es una orden real de apoyo respaldada por un aficionado legítimo. Elige a tu candidato y otorga los puntos que desees.
            </p>

            <!-- Mode Selector Switcher inside Hero (Large, High Contrast Buttons) -->
            <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              
              <!-- Historic Button -->
              <button onclick="switchCategory('historic')" id="heroTabHistBtn" class="text-left p-4 rounded-2xl border-2 border-gold-primary bg-gradient-to-r from-gold-primary/25 to-gold-primary/10 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between shadow-lg">
                <span class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-gold-primary text-black flex items-center justify-center font-black">
                    <i class="ri-vip-crown-fill text-base"></i>
                  </div>
                  <div>
                    <span class="block text-white font-cinzel font-bold text-sm">Super Balón de Oro</span>
                    <span class="block text-[11px] text-gold-light/80 font-normal">Top 50 Histórico (GOAT)</span>
                  </div>
                </span>
                <i class="ri-checkbox-circle-fill text-gold-light text-xl"></i>
              </button>
              
              <!-- 2026 Season Button -->
              <button onclick="switchCategory('2026')" id="heroTab2026Btn" class="text-left p-4 rounded-2xl border border-white/10 bg-[#12121a] hover:bg-[#181822] text-gray-300 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between">
                <span class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
                    <i class="ri-football-line text-base"></i>
                  </div>
                  <div>
                    <span class="block text-white font-cinzel font-bold text-sm">Balón de Oro 2026</span>
                    <span class="block text-[11px] text-gray-400 font-normal">Top 50 Temporada Actual</span>
                  </div>
                </span>
                <span class="text-[11px] text-gray-400 font-mono">Cambiar</span>
              </button>

            </div>

            <!-- Direct Quick Action Banner -->
            <div class="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a href="#rankingGlobalSection" class="gold-shimmer-btn w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary text-black font-black text-sm sm:text-base tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2.5">
                <i class="ri-cursor-fill text-lg"></i> VOTAR DIRECTO EN EL RANKING
              </a>

              <div class="flex items-center gap-2 text-xs text-gray-300 font-mono">
                <i class="ri-shield-check-line text-emerald-400 text-base"></i>
                <span>Pagos directos vía Stripe & PayPal</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>

`;

code = code.slice(0, headerStart) + newHeaderAndHero + code.slice(heroEnd);

// 4. Update switchCategory function logic to match new button classes
const switchStart = code.indexOf('function switchCategory(cat) {');
const switchRenderIdx = code.indexOf('renderMasterRankingTable();', switchStart);

const updatedSwitchLogic = `function switchCategory(cat) {
      activeCategory = cat;

      const navHist = document.getElementById('navBtnHistoric');
      const nav2026 = document.getElementById('navBtn2026');
      const heroHist = document.getElementById('heroTabHistBtn');
      const hero2026 = document.getElementById('heroTab2026Btn');

      const trophyImg = document.getElementById('activeTrophyImg');
      const trophyBadge = document.getElementById('trophyBadgeText');
      const trophyDesc = document.getElementById('trophyDescCaption');
      const catTag = document.getElementById('activeCategoryTag');
      const catTitle = document.getElementById('activeCategoryTitle');
      const catDesc = document.getElementById('activeCategoryDescription');
      const tableHeading = document.getElementById('rankingTableHeading');

      if (cat === 'historic') {
        if (navHist) navHist.className = "px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary text-black transition-all flex items-center gap-2 shadow-md";
        if (nav2026) nav2026.className = "px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-2";

        if (heroHist) {
          heroHist.className = "text-left p-4 rounded-2xl border-2 border-gold-primary bg-gradient-to-r from-gold-primary/25 to-gold-primary/10 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between shadow-lg";
        }
        if (hero2026) hero2026.className = "text-left p-4 rounded-2xl border border-white/10 bg-[#12121a] hover:bg-[#181822] text-gray-300 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between";

        trophyImg.src = "assets/super-ballon-dor-real.jpg";
        trophyBadge.textContent = "DI STÉFANO 1989 & GOAT HISTÓRICO";
        trophyDesc.innerHTML = '<i class="ri-trophy-line text-gold-primary mr-1"></i> El galardón individual más exclusivo en la historia del fútbol';
        catTag.innerHTML = '<i class="ri-vip-crown-fill text-gold-primary"></i> DISTINCIÓN HISTÓRICA MÁXIMA (1956 - 2026)';
        catTitle.innerHTML = 'El Super Balón de Oro: <br><span class="gold-shine-text">Corona al Rey de la Historia</span>';
        catDesc.innerHTML = "Saldamos 70 años de injusticia. Ya no deciden comités cerrados ni encuestas gratuitas vulnerables a firmas falsas y bots. <strong class=\\'text-gold-light font-bold\\'>1 PUNTO = 1 USD</strong>: cada voto es una orden real de apoyo respaldada por un aficionado legítimo. Elige a tu candidato y otorga los puntos que desees.";
        tableHeading.textContent = "Los mejores del fútbol mundial";
      } else {
        if (nav2026) nav2026.className = "px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white transition-all flex items-center gap-2 shadow-md";
        if (navHist) navHist.className = "px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-2";

        if (hero2026) hero2026.className = "text-left p-4 rounded-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-500/25 to-blue-500/10 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between shadow-lg";
        if (heroHist) heroHist.className = "text-left p-4 rounded-2xl border border-white/10 bg-[#12121a] hover:bg-[#181822] text-gray-300 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between";

        trophyImg.src = "assets/super-ballon-dor-real.jpg";
        trophyBadge.textContent = "BALÓN DE ORO TEMPORADA 2026";
        trophyDesc.innerHTML = '<i class="ri-football-line text-blue-400 mr-1"></i> Balón de Oro Oficial 2026 — Edición Actual de la Temporada';
        catTag.innerHTML = '<i class="ri-football-line text-blue-400"></i> EDICIÓN ACTUAL (TEMPORADA 2025/2026)';
        catTitle.innerHTML = 'Balón de Oro 2026: <br><span class="text-white">¿Quién Es el Mejor del Mundo Hoy?</span>';
        catDesc.innerHTML = "Vota por el futbolista más determinante de la presente temporada. Vinicius Júnior, Kylian Mbappé, Rodri, Jude Bellingham, Erling Haaland, Lamine Yamal y las 50 máximas estrellas compitiendo con cada gol, título y asistencia del año.";
        tableHeading.textContent = "Las 50 estrellas mundiales de 2026";
      }

      `;

code = code.slice(0, switchStart) + updatedSwitchLogic + code.slice(switchRenderIdx);

fs.writeFileSync(buildScriptPath, code, 'utf8');
console.log('scripts/build-production-app.js successfully updated with Premium Header and Hero redesign!');

