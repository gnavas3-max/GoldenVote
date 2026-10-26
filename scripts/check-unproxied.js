const fs = require('fs');
const raw = fs.readFileSync('.kombai/canvas/golden_vote_landing.canvas', 'utf8');
const regex = /src=\\"(assets\/[^\\"]+)\\"/g;
let m;
const found = new Set();
while ((m = regex.exec(raw)) !== null) {
  found.add(m[1]);
}
console.log('Unproxied paths found:', Array.from(found));
