const fs = require('fs');

const html = fs.readFileSync('C:/Users/USER/Desktop/rapIA/kombai_unified_raw.html', 'utf8');

// Find all headings
const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h3s = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

console.log('=== H1 HEADINGS ===');
console.log(h1s);

console.log('\n=== H2 HEADINGS ===');
console.log(h2s);

console.log('\n=== H3 HEADINGS (Sample) ===');
console.log(h2s.slice(0, 15));

// Find all IDs
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\n=== UNIQUE IDS (' + idMatches.length + ') ===');
console.log([...new Set(idMatches)].slice(0, 25));

// Find all script tags
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1].trim());
console.log('\n=== SCRIPTS FOUND ===', scripts.length);
scripts.forEach((s, i) => {
  console.log(`Script ${i + 1} preview (${s.length} chars):`, s.slice(0, 150) + '...');
});

// Find image src
const imgMatches = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\n=== IMAGE SRCS (' + imgMatches.length + ') ===');
console.log([...new Set(imgMatches)]);

