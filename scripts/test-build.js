const fs = require('fs');
const path = require('path');

const historicData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'players-top50.json'), 'utf8'));
const currentData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'players-2026.json'), 'utf8'));

console.log('Historic players:', historicData.players.length);
console.log('2026 players:', currentData.players.length);

