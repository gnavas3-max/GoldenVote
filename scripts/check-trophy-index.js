const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const regex = /super-ballon-dor-real\.(jpg|png)/g;
let m;
while ((m = regex.exec(indexHtml)) !== null) {
  const start = Math.max(0, m.index - 50);
  const end = Math.min(indexHtml.length, m.index + 50);
  console.log('Match in index.html:', indexHtml.slice(start, end));
}
