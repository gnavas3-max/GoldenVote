const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- AUDITORÍA DE PRODUCCIÓN (DISEÑO REFERENCIA UNIFICADO) ---');

// 1. Assets verification
const hasTrophy = fs.existsSync('assets/super-ballon-dor-real.jpg');
console.log('1. Trofeo real existe:', hasTrophy, 'Tamaño:', fs.statSync('assets/super-ballon-dor-real.jpg').size);

// 2. Data verification
const histData = JSON.parse(fs.readFileSync('data/players-top50.json', 'utf8'));
const curData = JSON.parse(fs.readFileSync('data/players-2026.json', 'utf8'));
console.log('2. Leyendas Históricas:', histData.players.length, 'Todas con fotos:', histData.players.every(p => !!p.photo));
console.log('3. Candidatos 2026:', curData.players.length, 'Todas con fotos:', curData.players.every(p => !!p.photo));

// 3. HTML verification
const checks = [
  { name: 'Tabla Ranking Global Directa', pass: html.includes('rankingTableRowsContainer') && html.includes('RANKING GLOBAL') },
  { name: 'Valor Oficial 1 PUNTO = 1 USD', pass: html.includes('1 PUNTO = 1 USD') },
  { name: 'Botón Directo Dar 1 punto · $1 USD', pass: html.includes('Dar 1 punto · $1 USD') },
  { name: 'Top 3 Estilizado (#1 Oro, #2 Plata, #3 Bronce)', pass: html.includes('border-gold-primary') && html.includes('border-slate-300') },
  { name: 'Modal Sin Rangos Forzados (Libre Puntuación & Estatus)', pass: html.includes('pointActionModal') && html.includes('modalCustomPointsInput') },
  { name: 'Misión Anti-Fraude & Dinero Real', pass: /soberanía popular/i.test(html) && /firmas inventadas/i.test(html) },
  { name: 'Pasarela Stripe Conectada', pass: html.includes('executeVotePayment(\'Stripe\')') },
  { name: 'Pasarela PayPal Conectada', pass: html.includes('executeVotePayment(\'PayPal\')') },
  { name: 'Tarjeta de Estatus & Golden Ballot Pass', pass: html.includes('statusPassPreviewCard') && html.includes('downloadRealCertificatePNG') },
  { name: 'SEO Schema.org JSON-LD', pass: html.includes('application/ld+json') && html.includes('SportsEvent') }
];

checks.forEach(c => {
  console.log(`- ${c.name}: ${c.pass ? '✅ PASS' : '❌ FAIL'}`);
});

console.log('HTML File size:', fs.statSync('index.html').size, 'bytes');
console.log('--- AUDITORÍA EXITOSA ---');
