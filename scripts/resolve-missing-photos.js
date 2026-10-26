const fs = require('fs');
const path = require('path');
const https = require('https');

const historic = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'players-top50.json'), 'utf8'));
const current = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'players-2026.json'), 'utf8'));

// Fetch single thumbnail by searching Wikipedia for the player's full football name
function fetchSingleThumbnail(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' footballer')}&gsrlimit=1&prop=pageimages&pithumbsize=400&format=json`;

    https.get(url, {
      headers: { 'User-Agent': 'TheGoldenVoteGlobal/1.0 (contact@goldenvote.football)' }
    }, (res) => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (data.query && data.query.pages) {
            const firstPageId = Object.keys(data.query.pages)[0];
            const page = data.query.pages[firstPageId];
            if (page && page.thumbnail && page.thumbnail.source) {
              return resolve(page.thumbnail.source);
            }
          }
        } catch (e) {}
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

// Fallback high-resolution sports portrait generator for any edge case
function getFallbackPortrait(name, countryCode) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1c1c24&color=FFE082&size=400&bold=true&font-size=0.35`;
}

async function fixAllMissing() {
  console.log('Resolving missing player portraits via Wikipedia search API...');

  for (let p of historic.players) {
    if (!p.photo || p.photo.includes('weserv')) {
      const searchName = p.fullName || p.name;
      const found = await fetchSingleThumbnail(searchName);
      if (found) {
        p.photo = found;
        console.log(`[Historic] Found for ${p.name}: ${found.substring(0, 50)}...`);
      } else {
        p.photo = getFallbackPortrait(p.name, p.countryCode);
        console.log(`[Historic] Fallback for ${p.name}`);
      }
    }
  }

  for (let p of current.players) {
    if (!p.photo || p.photo.includes('weserv')) {
      const searchName = p.fullName || p.name;
      const found = await fetchSingleThumbnail(searchName);
      if (found) {
        p.photo = found;
        console.log(`[2026] Found for ${p.name}: ${found.substring(0, 50)}...`);
      } else {
        p.photo = getFallbackPortrait(p.name, p.countryCode);
        console.log(`[2026] Fallback for ${p.name}`);
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'players-top50.json'), JSON.stringify(historic, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'players-2026.json'), JSON.stringify(current, null, 2));
  console.log('Finished resolving all player portraits!');
}

fixAllMissing();

