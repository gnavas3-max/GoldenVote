const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g));
console.log('Script tag count:', scriptMatches.length);
scriptMatches.forEach((m, idx) => {
  try {
    new Function(m[1]);
    console.log('Script ' + (idx + 1) + ' syntax: OK');
  } catch(e) {
    console.error('Script ' + (idx + 1) + ' ERROR:', e.message);
  }
});

