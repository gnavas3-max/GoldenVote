const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('C:/Users/USER/Desktop/rapIA/index.html', 'utf8');
const srcs = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
const uniqueSrcs = [...new Set(srcs)];

console.log('Total unique src attributes:', uniqueSrcs.length);

let missing = 0;
for (const s of uniqueSrcs) {
  if (s.startsWith('http') || s.startsWith('//') || s.includes('${')) continue;
  const cleanPath = s.replace(/^\//, '');
  const fullPath = path.join('C:/Users/USER/Desktop/rapIA', cleanPath);
  if (!fs.existsSync(fullPath)) {
    console.log('MISSING ASSET:', s, '-> Expected at:', fullPath);
    missing++;
  } else {
    console.log('OK:', s);
  }
}

if (missing === 0) {
  console.log('ALL LOCAL ASSETS VERIFIED ON DISK!');
} else {
  console.log('Total missing assets:', missing);
}

