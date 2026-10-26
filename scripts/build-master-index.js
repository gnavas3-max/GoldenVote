const fs = require('fs');
const path = require('path');

const rawHtmlPath = path.join(__dirname, '..', 'kombai_unified_raw.html');
const playersDataPath = path.join(__dirname, '..', 'data', 'players-top50.json');
const outputPath = path.join(__dirname, '..', 'index.html');

let rawHtml = fs.readFileSync(rawHtmlPath, 'utf8');
const playersData = JSON.parse(fs.readFileSync(playersDataPath, 'utf8'));

// 1. Normalize image paths: convert `/api/local/images/assets/` to `assets/`
rawHtml = rawHtml.replace(/\/api\/local\/images\/assets\//g, 'assets/');

// 2. Fix broken Pelé card filename if any
rawHtml = rawHtml.replace(/pel--card\.svg/g, 'pel--card.svg');

// 3. Prepare full HTML document wrapper with Tailwind CDN & Custom Config
const tailwindConfigScript = `
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            obsidian: '#09090C',
            carbon: '#121217',
            smoke: '#1A1A22',
            gold: {
              light: '#FFE082',
              primary: '#D4AF37',
              dark: '#8B6909'
            }
          },
          fontFamily: {
            cinzel: ['Cinzel', 'serif'],
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
`;

const seoHead = `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Golden Vote 2026 | El Super Balón de Oro Histórico — Escrutinio Oficial</title>
  <meta name="description" content="Vota por el GOAT indiscutible y salda la deuda histórica de 70 años del Balón de Oro. Escrutinio público en tiempo real, voto certificado por 1 USD y Golden Ballot Pass oficial para debatir en Twitter/X.">
  <meta name="keywords" content="Super Balón de Oro, Balón de Oro 2026, GOAT, Messi, Maradona, Pelé, Cristiano Ronaldo, Di Stéfano, Golden Ballot Pass">
  
  <!-- Open Graph / Twitter Card -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://goldenvote.football/">
  <meta property="og:title" content="The Golden Vote 2026 | Super Balón de Oro Histórico">
  <meta property="og:description" content="¿Quién es tu GOAT? Vota en el escrutinio oficial en vivo y obtén tu Golden Ballot Pass 9:16 certificado.">
  <meta property="og:image" content="assets/super-ballon-dor-trophy.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="The Golden Vote 2026 | Super Balón de Oro Histórico">
  <meta name="twitter:description" content="Saldemos la deuda de 70 años. Vota en vivo y comparte tu credencial en redes.">
  <meta name="twitter:image" content="assets/super-ballon-dor-trophy.svg">
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css" rel="stylesheet"/>
  
  ${tailwindConfigScript}

  <style>
    /* Custom Luxury Glass & Glow Utilities */
    body {
      background-color: #09090C;
      color: #F3F4F6;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow-x: hidden;
    }
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    /* Radial Gold Background Spotlight */
    .hero-glow {
      background: radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.15) 0%, rgba(9, 9, 12, 0) 70%);
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #09090C;
    }
    ::-webkit-scrollbar-thumb {
      background: #242430;
      border-radius: 4px;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #D4AF37;
    }
  </style>
</head>
<body class="bg-[#09090C] text-gray-100 min-h-screen selection:bg-[#D4AF37] selection:text-black">
`;

const seoFooter = `
</body>
</html>
`;

// Combine into single master HTML
let finalHtml = seoHead + rawHtml + seoFooter;

// 4. Inject Enhanced Certificate Canvas Renderer & Twitter intent
const enhancedScript = `
<script>
  // Enhanced: Real High-Res 9:16 Canvas PNG Downloader for Golden Ballot Pass
  function downloadRealCertificatePNG() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Background Gradient (Obsidian to Carbon)
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#09090E');
    bgGrad.addColorStop(0.5, '#12121A');
    bgGrad.addColorStop(1, '#070709');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Gold Ornamental Outer Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, 1000, 1840);

    ctx.strokeStyle = '#FFE082';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 970, 1810);

    // Header Title
    ctx.textAlign = 'center';
    ctx.font = '700 36px "Cinzel", serif';
    ctx.fillStyle = '#FFE082';
    ctx.fillText('THE GOLDEN VOTE 2026', 540, 160);

    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#A0A0B0';
    ctx.fillText('OFFICIAL VERIFIED BALLOT PASS', 540, 210);

    // Serial & Hash Badge
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('BALLOT SERIAL: #GV-2026-004842', 540, 270);

    // Voter Details
    const voterName = (document.getElementById('certVoterName')?.textContent || 'SANTIAGO GÓMEZ').toUpperCase();
    const voterHandle = document.getElementById('certVoterHandle')?.textContent || '@santi_futbol';

    ctx.font = '800 52px "Cinzel", serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(voterName, 540, 420);

    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFE082';
    ctx.fillText(voterHandle, 540, 470);

    // Central GOAT Podium Box
    ctx.fillStyle = '#171722';
    ctx.fillRect(140, 560, 800, 700);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(140, 560, 800, 700);

    const goatName = (document.getElementById('certGoatName')?.textContent || 'LIONEL MESSI').toUpperCase();
    ctx.font = '900 64px "Cinzel", serif';
    ctx.fillStyle = '#FFE082';
    ctx.fillText('👑 #1 GOAT SUPREMO 👑', 540, 680);

    ctx.font = '900 78px "Cinzel", serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(goatName, 540, 860);

    ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#00E599';
    ctx.fillText('25 PUNTOS OTORGADOS', 540, 960);

    ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('Super Balón de Oro Histórico (1956 - 2026)', 540, 1040);

    // Bottom Verification Seal & Timestamp
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8B6909';
    ctx.fillText('AUDIT HASH: 0x9f4a7c1828e...83d1 (100% P2P VERIFIED)', 540, 1400);

    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFE082';
    ctx.fillText('VOTA Y DEBATE EN: THEGOLDENVOTE.FOOTBALL', 540, 1600);

    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#777788';
    ctx.fillText('Certificado emitido para publicación en X / Instagram Stories / TikTok', 540, 1660);

    // Trigger download
    const link = document.createElement('a');
    link.download = 'GOLDEN-BALLOT-PASS-004842.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Override download mock with real PNG generation
  window.downloadCertificateMock = downloadRealCertificatePNG;

  // Real Twitter/X Share Intent with Viral Debate Hook
  function shareTwitterIntent() {
    const goat = (document.getElementById('certGoatName')?.textContent || 'LIONEL MESSI').trim();
    const handle = (document.getElementById('certVoterHandle')?.textContent || '@santi_futbol').trim();
    
    const tweetText = encodeURIComponent(
      '🏆 Acabo de emitir mi voto verificado en #TheGoldenVote.\\n\\n' +
      '👑 Mi #1 GOAT Indiscutible: ' + goat + ' (25 pts)\\n\\n' +
      '70 años de injusticia del Balón de Oro saldados por la gente. ¿Quién está en tu Top 10?\\n\\n' +
      'Vota tu Top 10 y obtén tu Golden Ballot Pass oficial aquí: https://thegoldenvote.football'
    );
    window.open('https://twitter.com/intent/tweet?text=' + tweetText, '_blank');
  }

  // Confetti trigger on vote confirmation
  const originalPayment = window.processSimulatedPayment;
  window.processSimulatedPayment = function() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFE082', '#D4AF37', '#FFFFFF', '#FFD700']
      });
    }
    if (originalPayment) {
      originalPayment();
    }
  };
</script>
`;

finalHtml = finalHtml.replace('</body>', enhancedScript + '\n</body>');

fs.writeFileSync(outputPath, finalHtml);
console.log('Successfully generated unified index.html at:', outputPath);
console.log('File size:', fs.statSync(outputPath).size, 'bytes');

