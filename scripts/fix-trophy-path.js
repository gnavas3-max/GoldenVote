const fs = require('fs');
let canvas = fs.readFileSync('.kombai/canvas/golden_vote_landing.canvas', 'utf8');
canvas = canvas.replace(/src=\\"assets\/super-ballon-dor-real\.jpg\\"/g, 'src=\\"/api/local/images/assets/super-ballon-dor-real.jpg\\"');
fs.writeFileSync('.kombai/canvas/golden_vote_landing.canvas', canvas, 'utf8');

if (fs.existsSync('kombai_unified_raw.html')) {
  let rawHtml = fs.readFileSync('kombai_unified_raw.html', 'utf8');
  rawHtml = rawHtml.replace(/src="assets\/super-ballon-dor-real\.jpg"/g, 'src="/api/local/images/assets/super-ballon-dor-real.jpg"');
  fs.writeFileSync('kombai_unified_raw.html', rawHtml, 'utf8');
}

console.log('Fixed trophy image path in canvas and raw html');
