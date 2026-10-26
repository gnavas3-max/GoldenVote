const fs = require('fs');
const path = require('path');
const https = require('https');

const historicData = require('../data/players-top50.json');

// 2026 Candidates List
const candidates2026 = [
  { id: 101, name: "Vinicius Júnior", fullName: "Vinícius José Paixão de Oliveira Júnior", country: "Brasil", countryCode: "BR", club: "Real Madrid", position: "Extremo Izquierdo", stats: "Champions League & LaLiga Champion", highlight: "Desequilibrante absoluto, 24 goles y 11 asistencias" },
  { id: 102, name: "Kylian Mbappé", fullName: "Kylian Mbappé Lottin", country: "Francia", countryCode: "FR", club: "Real Madrid", position: "Delantero", stats: "Bota de Oro Mundial & Ligue 1", highlight: "Máximo goleador europeo, velocidad supersónica" },
  { id: 103, name: "Erling Haaland", fullName: "Erling Braut Haaland", country: "Noruega", countryCode: "NO", club: "Manchester City", position: "Delantero Centro", stats: "Bota de Oro Premier League", highlight: "Depredador del área, récord histórico de goles por partido" },
  { id: 104, name: "Jude Bellingham", fullName: "Jude Victor William Bellingham", country: "Inglaterra", countryCode: "EN", club: "Real Madrid", position: "Mediocampista", stats: "Mejor Jugador de LaLiga & Champions", highlight: "Liderazgo total con apenas 21 años" },
  { id: 105, name: "Rodri", fullName: "Rodrigo Hernández Cascante", country: "España", countryCode: "ES", club: "Manchester City", position: "Pivote", stats: "Campeón de Eurocopa & Premier League", highlight: "El metrónomo invicto y MVP de la Euro 2024" },
  { id: 106, name: "Lamine Yamal", fullName: "Lamine Yamal Nasraoui Ebana", country: "España", countryCode: "ES", club: "Barcelona", position: "Extremo Derecho", stats: "Mejor Jugador Joven Eurocopa", highlight: "Genio generacional a los 17 años, gol histórico en semifinales" },
  { id: 107, name: "Harry Kane", fullName: "Harry Edward Kane", country: "Inglaterra", countryCode: "EN", club: "Bayern Múnich", position: "Delantero Centro", stats: "Bota de Oro Europea (36 goles)", highlight: "Eficacia letal y visión de juego como 9 clásico" },
  { id: 108, name: "Florian Wirtz", fullName: "Florian Richard Wirtz", country: "Alemania", countryCode: "DE", club: "Bayer Leverkusen", position: "Mediapunta", stats: "Campeón Invicto Bundesliga & Copa", highlight: "Magia pura, 18 goles y 20 asistencias con el Leverkusen" },
  { id: 109, name: "Phil Foden", fullName: "Philip Walter Foden", country: "Inglaterra", countryCode: "EN", club: "Manchester City", position: "Mediapunta", stats: "Jugador del Año Premier League", highlight: "Temporada estelar con 27 goles en todas las competiciones" },
  { id: 110, name: "Dani Carvajal", fullName: "Daniel Carvajal Ramos", country: "España", countryCode: "ES", club: "Real Madrid", position: "Lateral Derecho", stats: "Champions + Eurocopa + Gol en final", highlight: "Temporada perfecta ganando todo como titular" },
  { id: 111, name: "Toni Kroos", fullName: "Toni Kroos", country: "Alemania", countryCode: "DE", club: "Real Madrid", position: "Mediocampista", stats: "Champions League Champion (Retirado)", highlight: "Retiro en la cúspide con precisión de pase del 95%" },
  { id: 112, name: "Mohamed Salah", fullName: "Mohamed Salah Hamed Mahrous Ghaly", country: "Egipto", countryCode: "EG", club: "Liverpool", position: "Extremo Derecho", stats: "Máximo goleador africano", highlight: "Consistencia legendaria en la élite mundial" },
  { id: 113, name: "Kevin De Bruyne", fullName: "Kevin De Bruyne", country: "Bélgica", countryCode: "BE", club: "Manchester City", position: "Mediocampista", stats: "Campeón Premier League", highlight: "El mejor pasador del planeta, visión milimétrica" },
  { id: 114, name: "Cole Palmer", fullName: "Cole Jermaine Palmer", country: "Inglaterra", countryCode: "EN", club: "Chelsea", position: "Mediapunta", stats: "Revelación Premier League (22 goles)", highlight: "Frialdad absoluta 'Cold Palmer', especialista de penalti" },
  { id: 115, name: "Lautaro Martínez", fullName: "Lautaro Javier Martínez", country: "Argentina", countryCode: "AR", club: "Inter Milán", position: "Delantero", stats: "Capocannoniere Serie A & Bota de Oro Copa América", highlight: "Gol agónico del título en la final de Copa América" },
  { id: 116, name: "Bukayo Saka", fullName: "Bukayo Ayoyinka T. M. Saka", country: "Inglaterra", countryCode: "EN", club: "Arsenal", position: "Extremo", stats: "Subcampeón Premier & Eurocopa", highlight: "Desborde y precisión constante en banda derecha" },
  { id: 117, name: "Jamal Musiala", fullName: "Jamal Musiala", country: "Alemania", countryCode: "DE", club: "Bayern Múnich", position: "Mediapunta", stats: "Bota de Oro Eurocopa (compartida)", highlight: "Regate en espacios reducidos y técnica brillante" },
  { id: 118, name: "Federico Valverde", fullName: "Federico Santiago Valverde Dipetta", country: "Uruguay", countryCode: "UY", club: "Real Madrid", position: "Mediocampista", stats: "Champions League Champion", highlight: "Pulmón incansable, despliegue físico y disparo demoledor" },
  { id: 119, name: "Antoine Griezmann", fullName: "Antoine Griezmann", country: "Francia", countryCode: "FR", club: "Atlético de Madrid", position: "Delantero", stats: "Máximo goleador histórico del Atleti", highlight: "Inteligencia táctica y visión total del campo" },
  { id: 120, name: "Martin Ødegaard", fullName: "Martin Ødegaard", country: "Noruega", countryCode: "NO", club: "Arsenal", position: "Mediocampista", stats: "Capitán del Arsenal", highlight: "Maestro en la creación de ocasiones de gol" },
  { id: 121, name: "William Saliba", fullName: "William Alain André Gabriel Saliba", country: "Francia", countryCode: "FR", club: "Arsenal", position: "Defensa Central", stats: "Mejor central Premier League", highlight: "Muralla infranqueable en el uno contra uno" },
  { id: 122, name: "Declan Rice", fullName: "Declan Rice", country: "Inglaterra", countryCode: "EN", club: "Arsenal", position: "Pivote", stats: "Pilar de la selección inglesa", highlight: "Recuperación de balón y potencia en transiciones" },
  { id: 123, name: "Rúben Dias", fullName: "Rúben dos Santos Gato Alves Dias", country: "Portugal", countryCode: "PT", club: "Manchester City", position: "Defensa Central", stats: "Campeón Premier League", highlight: "Liderazgo defensivo y jerarquía en la zaga" },
  { id: 124, name: "Bernardo Silva", fullName: "Bernardo Mota Veiga de Carvalho e Silva", country: "Portugal", countryCode: "PT", club: "Manchester City", position: "Mediocampista", stats: "Tetracampeón Premier League", highlight: "Técnica excelsa y retención de balón inmaculada" },
  { id: 125, name: "Antonio Rüdiger", fullName: "Antonio Rüdiger", country: "Alemania", countryCode: "DE", club: "Real Madrid", position: "Defensa Central", stats: "Campeón Champions League", highlight: "Imponente físicamente, secó a los mejores 9 de Europa" },
  { id: 126, name: "Nico Williams", fullName: "Nicholas Williams Arthuer", country: "España", countryCode: "ES", club: "Athletic Club", position: "Extremo Izquierdo", stats: "Campeón Copa del Rey & Eurocopa", highlight: "Gol decisivo en la final de la Euro 2024" },
  { id: 127, name: "Dani Olmo", fullName: "Daniel Olmo Carvajal", country: "España", countryCode: "ES", club: "Barcelona", position: "Mediapunta", stats: "Bota de Oro Eurocopa (3 goles)", highlight: "Salvada en la línea en el min 90 y calidad superlativa" },
  { id: 128, name: "Robert Lewandowski", fullName: "Robert Lewandowski", country: "Polonia", countryCode: "PL", club: "Barcelona", position: "Delantero Centro", stats: "Goleador histórico de Champions", highlight: "Instinto goleador intacto en la alta competencia" },
  { id: 129, name: "Raphinha", fullName: "Raphael Dias Belloli", country: "Brasil", countryCode: "BR", club: "Barcelona", position: "Extremo", stats: "Capitán y motor del FC Barcelona", highlight: "Hat-trick en Champions y compromiso incansable" },
  { id: 130, name: "Emiliano Martínez", fullName: "Damián Emiliano Martínez", country: "Argentina", countryCode: "AR", club: "Aston Villa", position: "Arquero", stats: "Bicampeón Copa América & Trofeo Yashin", highlight: "Héroe en tandas de penales y cerrojo total" },
  { id: 131, name: "Thibaut Courtois", fullName: "Thibaut Nicolas Marc Courtois", country: "Bélgica", countryCode: "BE", club: "Real Madrid", position: "Arquero", stats: "Valla invicta final de Champions", highlight: "Gigante bajo los tres palos en las noches grandes" },
  { id: 132, name: "Alisson Becker", fullName: "Alisson Ramses Becker", country: "Brasil", countryCode: "BR", club: "Liverpool", position: "Arquero", stats: "Guante de Oro Premier League", highlight: "Seguridad y mano a mano prodigioso" },
  { id: 133, name: "Virgil van Dijk", fullName: "Virgil van Dijk", country: "Países Bajos", countryCode: "NL", club: "Liverpool", position: "Defensa Central", stats: "Capitán del Liverpool y Países Bajos", highlight: "Presencia dominante por aire y suelo" },
  { id: 134, name: "Trent Alexander-Arnold", fullName: "Trent John Alexander-Arnold", country: "Inglaterra", countryCode: "EN", club: "Liverpool", position: "Lateral / Mediocampista", stats: "Especialista en asistencias de larga distancia", highlight: "Golpeo de balón de clase mundial" },
  { id: 135, name: "Alexis Mac Allister", fullName: "Alexis Mac Allister", country: "Argentina", countryCode: "AR", club: "Liverpool", position: "Mediocampista", stats: "Campeón de Copa América & Carabao", highlight: "Cerebro táctico y equilibrio en mediocampo" },
  { id: 136, name: "Julián Álvarez", fullName: "Julián Álvarez", country: "Argentina", countryCode: "AR", club: "Atlético de Madrid", position: "Delantero", stats: "Campeón de todo a sus 24 años", highlight: "Presión incansable y definición quirúrgica" },
  { id: 137, name: "Victor Boniface", fullName: "Victor Okoh Boniface", country: "Nigeria", countryCode: "NG", club: "Bayer Leverkusen", position: "Delantero", stats: "Campeón invicto de Alemania", highlight: "Potencia deslumbrante y carisma goleador" },
  { id: 138, name: "Granit Xhaka", fullName: "Granit Xhaka", country: "Suiza", countryCode: "CH", club: "Bayer Leverkusen", position: "Mediocampista", stats: "Líder invicto de Bundesliga", highlight: "Personalidad de hierro y distribución impecable" },
  { id: 139, name: "Jeremie Frimpong", fullName: "Jeremie Agyekum Frimpong", country: "Países Bajos", countryCode: "NL", club: "Bayer Leverkusen", position: "Carrilero Derecho", stats: "14 goles y 12 asistencias", highlight: "Velocidad explosiva por la banda" },
  { id: 140, name: "Alejandro Grimaldo", fullName: "Alejandro Grimaldo García", country: "España", countryCode: "ES", club: "Bayer Leverkusen", position: "Carrilero Izquierdo", stats: "Campeón Euro 2024 & Bundesliga", highlight: "Zurdazo letal a balón parado" },
  { id: 141, name: "Hakan Çalhanoğlu", fullName: "Hakan Çalhanoğlu", country: "Turquía", countryCode: "TR", club: "Inter Milán", position: "Pivote", stats: "Scudetto con Inter Milán", highlight: "Infalible desde el punto de penal" },
  { id: 142, name: "Nicolò Barella", fullName: "Nicolò Barella", country: "Italia", countryCode: "IT", club: "Inter Milán", position: "Mediocampista", stats: "Campeón de la Serie A", highlight: "Dinamismo box-to-box y garra italiana" },
  { id: 143, name: "Alessandro Bastoni", fullName: "Alessandro Bastoni", country: "Italia", countryCode: "IT", club: "Inter Milán", position: "Defensa Central", stats: "Mejor defensor de la Serie A", highlight: "Salida limpia con la zurda" },
  { id: 144, name: "Vitinha", fullName: "Vítor Machado Ferreira", country: "Portugal", countryCode: "PT", club: "PSG", position: "Mediocampista", stats: "Campeón Ligue 1", highlight: "El timonel del PSG en Champions" },
  { id: 145, name: "Achraf Hakimi", fullName: "Achraf Hakimi Mouh", country: "Marruecos", countryCode: "MA", club: "PSG", position: "Lateral Derecho", stats: "Bronce Olímpico con Marruecos", highlight: "Proyección ofensiva imparable" },
  { id: 146, name: "Ousmane Dembélé", fullName: "Masour Ousmane Dembélé", country: "Francia", countryCode: "FR", club: "PSG", position: "Extremo", stats: "Líder de asistencias Ligue 1", highlight: "Manejo de ambas piernas impredecible" },
  { id: 147, name: "Bradley Barcola", fullName: "Bradley Laurent Barcola", country: "Francia", countryCode: "FR", club: "PSG", position: "Extremo Izquierdo", stats: "Gran revelación francesa", highlight: "Regate eléctrico y velocidad punta" },
  { id: 148, name: "Viktor Gyökeres", fullName: "Viktor Einar Gyökeres", country: "Suecia", countryCode: "SE", club: "Sporting CP", position: "Delantero Centro", stats: "43 goles en 50 partidos", highlight: "La sensación más arrolladora de Europa" },
  { id: 149, name: "Alexander Isak", fullName: "Alexander Isak", country: "Suecia", countryCode: "SE", club: "Newcastle United", position: "Delantero", stats: "21 goles en Premier League", highlight: "Elegancia y frialdad frente al arco" },
  { id: 150, name: "Son Heung-min", fullName: "Son Heung-min", country: "Corea del Sur", countryCode: "KR", club: "Tottenham", position: "Extremo / Delantero", stats: "Capitán del Tottenham", highlight: "Ícono asiático mundial con disparo letal" }
];

fs.writeFileSync(path.join(__dirname, '..', 'data', 'players-2026.json'), JSON.stringify({
  description: "Top 50 candidatos oficiales para el Balón de Oro 2026",
  year: 2026,
  players: candidates2026
}, null, 2));

console.log('Saved data/players-2026.json with 50 candidates');

