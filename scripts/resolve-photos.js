const fs = require('fs');
const path = require('path');
const https = require('https');

const historic = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'players-top50.json'), 'utf8'));
const current = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'players-2026.json'), 'utf8'));

// High-confidence Wikipedia search mapping
const wikiTitles = {
  // Historic
  "Pelé": "Pelé",
  "Diego Maradona": "Diego_Maradona",
  "Lionel Messi": "Lionel_Messi",
  "Cristiano Ronaldo": "Cristiano_Ronaldo",
  "Johan Cruyff": "Johan_Cruyff",
  "Alfredo Di Stéfano": "Alfredo_Di_St%C3%A9fano",
  "Franz Beckenbauer": "Franz_Beckenbauer",
  "Zinedine Zidane": "Zinedine_Zidane",
  "Ronaldo Nazário": "Ronaldo_(Brazilian_footballer)",
  "Ronaldinho": "Ronaldinho",
  "Michel Platini": "Michel_Platini",
  "Marco van Basten": "Marco_van_Basten",
  "Gerd Müller": "Gerd_M%C3%BCller",
  "Ferenc Puskás": "Ferenc_Pusk%C3%A1s",
  "George Best": "George_Best",
  "Eusébio": "Eus%C3%A9bio",
  "Lev Yashin": "Lev_Yashin",
  "Bobby Charlton": "Bobby_Charlton",
  "Paolo Maldini": "Paolo_Maldini",
  "Franco Baresi": "Franco_Baresi",
  "Romário": "Rom%C3%A1rio",
  "Roberto Baggio": "Roberto_Baggio",
  "Zico": "Zico_(footballer)",
  "Garrincha": "Garrincha",
  "Thierry Henry": "Thierry_Henry",
  "Andrés Iniesta": "Andr%C3%A9s_Iniesta",
  "Xavi Hernández": "Xavi",
  "Luka Modrić": "Luka_Modri%C4%87",
  "Kaká": "Kak%C3%A1",
  "Karl-Heinz Rummenigge": "Karl-Heinz_Rummenigge",
  "Kevin Keegan": "Kevin_Keegan",
  "Ruud Gullit": "Ruud_Gullit",
  "Lothar Matthäus": "Lothar_Matth%C3%A4us",
  "Hristo Stoichkov": "Hristo_Stoichkov",
  "George Weah": "George_Weah",
  "Rivaldo": "Rivaldo",
  "Luís Figo": "Lu%C3%ADs_Figo",
  "Pavel Nedvěd": "Pavel_Nedv%C4%9Bd",
  "Andriy Shevchenko": "Andriy_Shevchenko",
  "Fabio Cannavaro": "Fabio_Cannavaro",
  "Gianluigi Buffon": "Gianluigi_Buffon",
  "Carles Puyol": "Carles_Puyol",
  "Iker Casillas": "Iker_Casillas",
  "Dennis Bergkamp": "Dennis_Bergkamp",
  "Sócrates": "S%C3%B3crates",
  "Didier Drogba": "Didier_Drogba",
  "Samuel Eto'o": "Samuel_Eto%27o",
  "Wayne Rooney": "Wayne_Rooney",
  "Neymar Jr": "Neymar",
  "Karim Benzema": "Karim_Benzema",

  // 2026
  "Vinicius Júnior": "Vin%C3%ADcius_J%C3%BAnior",
  "Kylian Mbappé": "Kylian_Mbapp%C3%A9",
  "Erling Haaland": "Erling_Haaland",
  "Jude Bellingham": "Jude_Bellingham",
  "Rodri": "Rodri_(footballer)",
  "Lamine Yamal": "Lamine_Yamal",
  "Harry Kane": "Harry_Kane",
  "Florian Wirtz": "Florian_Wirtz",
  "Phil Foden": "Phil_Foden",
  "Dani Carvajal": "Dani_Carvajal",
  "Toni Kroos": "Toni_Kroos",
  "Mohamed Salah": "Mohamed_Salah",
  "Kevin De Bruyne": "Kevin_De_Bruyne",
  "Cole Palmer": "Cole_Palmer",
  "Lautaro Martínez": "Lautaro_Mart%C3%ADnez",
  "Bukayo Saka": "Bukayo_Saka",
  "Jamal Musiala": "Jamal_Musiala",
  "Federico Valverde": "Federico_Valverde",
  "Antoine Griezmann": "Antoine_Griezmann",
  "Martin Ødegaard": "Martin_%C3%98degaard",
  "William Saliba": "William_Saliba",
  "Declan Rice": "Declan_Rice",
  "Rúben Dias": "R%C3%BAben_Dias",
  "Bernardo Silva": "Bernardo_Silva",
  "Antonio Rüdiger": "Antonio_R%C3%BCdiger",
  "Nico Williams": "Nico_Williams",
  "Dani Olmo": "Dani_Olmo",
  "Robert Lewandowski": "Robert_Lewandowski",
  "Raphinha": "Raphinha",
  "Emiliano Martínez": "Emiliano_Mart%C3%ADnez",
  "Thibaut Courtois": "Thibaut_Courtois",
  "Alisson Becker": "Alisson",
  "Virgil van Dijk": "Virgil_van_Dijk",
  "Trent Alexander-Arnold": "Trent_Alexander-Arnold",
  "Alexis Mac Allister": "Alexis_Mac_Allister",
  "Julián Álvarez": "Juli%C3%A1n_%C3%81lvarez_(footballer)",
  "Victor Boniface": "Victor_Boniface",
  "Granit Xhaka": "Granit_Xhaka",
  "Jeremie Frimpong": "Jeremie_Frimpong",
  "Alejandro Grimaldo": "Alejandro_Grimaldo",
  "Hakan Çalhanoğlu": "Hakan_%C3%87alhano%C4%9Flu",
  "Nicolò Barella": "Nicol%C3%B2_Barella",
  "Alessandro Bastoni": "Alessandro_Bastoni",
  "Vitinha": "Vitinha_(footballer,_born_February_2000)",
  "Achraf Hakimi": "Achraf_Hakimi",
  "Ousmane Dembélé": "Ousmane_Demb%C3%A9l%C3%A9",
  "Bradley Barcola": "Bradley_Barcola",
  "Viktor Gyökeres": "Viktor_Gy%C3%B6keres",
  "Alexander Isak": "Alexander_Isak",
  "Son Heung-min": "Son_Heung-min"
};

function fetchWikipediaThumbnails(titlesList) {
  return new Promise((resolve) => {
    const titleChunks = [];
    for (let i = 0; i < titlesList.length; i += 20) {
      titleChunks.push(titlesList.slice(i, i + 20));
    }

    const results = {};
    let completed = 0;

    if (titleChunks.length === 0) return resolve(results);

    titleChunks.forEach(chunk => {
      const titlesQuery = chunk.map(encodeURIComponent).join('|');
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titlesQuery}&prop=pageimages&format=json&pithumbsize=400`;

      https.get(url, {
        headers: { 'User-Agent': 'TheGoldenVoteGlobal/1.0 (contact@goldenvote.football)' }
      }, (res) => {
        let raw = '';
        res.on('data', d => raw += d);
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            if (data.query && data.query.pages) {
              for (const id in data.query.pages) {
                const page = data.query.pages[id];
                if (page.title && page.thumbnail && page.thumbnail.source) {
                  results[page.title.toLowerCase()] = page.thumbnail.source;
                }
              }
            }
          } catch (e) {
            console.error('Parse error chunk:', e.message);
          }
          completed++;
          if (completed === titleChunks.length) resolve(results);
        });
      }).on('error', (e) => {
        console.error('Request error:', e.message);
        completed++;
        if (completed === titleChunks.length) resolve(results);
      });
    });
  });
}

async function run() {
  console.log('Resolving photos for 50 historic legends and 50 2026 candidates...');
  const allTitles = Object.values(wikiTitles);
  const thumbs = await fetchWikipediaThumbnails(allTitles);
  console.log('Fetched thumbnails:', Object.keys(thumbs).length);

  // Attach to historic
  historic.players.forEach(p => {
    const rawTitle = wikiTitles[p.name] || p.name;
    const key = decodeURIComponent(rawTitle).replace(/_/g, ' ').toLowerCase();
    const photo = thumbs[key] || `https://images.weserv.nl/?url=images.football-espana.net/wp-content/uploads/2023/10/ballon-dor.jpg&w=400&fit=cover`;
    p.photo = photo;
  });

  // Attach to 2026
  current.players.forEach(p => {
    const rawTitle = wikiTitles[p.name] || p.name;
    const key = decodeURIComponent(rawTitle).replace(/_/g, ' ').toLowerCase();
    const photo = thumbs[key] || `https://images.weserv.nl/?url=images.football-espana.net/wp-content/uploads/2023/10/ballon-dor.jpg&w=400&fit=cover`;
    p.photo = photo;
  });

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'players-top50.json'), JSON.stringify(historic, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'players-2026.json'), JSON.stringify(current, null, 2));
  console.log('Updated data/players-top50.json and data/players-2026.json successfully!');
}

run();

