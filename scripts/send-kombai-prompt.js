const { spawn } = require('child_process');

function sendToKombai(promptText, threadId = '533b2a1608f540b49187f2d792012468') {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      'C:\\Users\\USER\\AppData\\Local\\Programs\\@kombaielectron-app\\resources\\app.asar.unpacked\\dist\\chat-mcp-gateway.cjs',
      '--registration',
      'C:\\Users\\USER\\.kombai\\electron-chat-mcp.Kombai.json'
    ]);

    let buffer = '';
    let runId = null;

    child.stdout.on('data', data => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 2) {
            console.log('Kombai MCP Response:', JSON.stringify(msg.result, null, 2));
            child.kill();
            resolve(msg.result);
          }
        } catch(e) {}
      }
    });

    child.stderr.on('data', data => {
      console.error('STDERR:', data.toString());
    });

    child.on('error', reject);

    // Initialize MCP
    child.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'antigravity-orchestrator', version: '2.0' }
      }
    }) + '\n');

    // Call chat_start
    const callPayload = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'chat_start',
        arguments: {
          workspace_root: 'C:\\Users\\USER\\Desktop\\rapIA',
          thread_id: threadId,
          prompt: promptText
        }
      }
    };

    setTimeout(() => {
      child.stdin.write(JSON.stringify(callPayload) + '\n');
    }, 500);
  });
}

const promptMessage = `🚨 ORQUESTACIÓN Y DIRECTRIZ OFICIAL: UNIFICACIÓN EN 1 SOLA VARIANTE OFICIAL DE LANDING 🚨

Kombai, por directriz del director del proyecto, debes UNIFICAR todas tus fuerzas y las 3 variantes ("Scoreboard Gantry", "Gala Ceremony", "Collector's Vault") en UNA SOLA VARIANTE MAESTRA definitiva:
"THE GOLDEN VOTE — GALA OFICIAL & ESCRUTINIO EN VIVO"

Características esenciales de la única variante maestra:
1. ELEGANCIA & ATMÓSFERA:
   - Fondo Obsidiana Profundo (#09090C / #121216) con resplandor dorado (#FFE082 / #D4AF37).
   - Tipografía Cinzel para titulares monumentales y Plus Jakarta Sans para el cuerpo moderno y legible.

2. TENSIÓN & VITALIDAD EN TIEMPO REAL:
   - Contador de votos verificados en vivo (14,842+ votos y subiendo) con reloj UTC sincronizado y badge "100% AUDITADO ANTI-BOTS".
   - Ticker de escrutinio público en el Hero.

3. SOPORTE DE IMÁGENES & ACTIVOS:
   - Ya tienes disponibles todos los activos vectoriales y retratos en "assets/" y ".kombai/assets/":
     * super-ballon-dor-trophy.svg (Trofeo histórico de 1989 con orbes dorados y rubí).
     * badge-official-seal.svg (Sello dorado de voto oficial auditado).
     * Retratos/Cartas de leyendas: lionel-messi-card.svg, cristiano-ronaldo-card.svg, diego-maradona-card.svg, pel--card.svg, alfredo-di-st-fano-card.svg, johan-cruyff-card.svg, zinedine-zidane-card.svg, ronaldo-naz-rio-card.svg, ronaldinho-card.svg, franz-beckenbauer-card.svg.
     * Retratos fotográficos: maradona-legend-portrait-825eb937.png, pele-legend-portrait-811a23e7.png, ronaldo-vault-portrait-d647505e.jpg.

4. SECCIÓN DE CONTEXTO HISTÓRICO (PROMPT #2):
   - Línea de tiempo interactiva (1956 a 2026) que explica por qué Pelé y Maradona nunca ganaron el Balón de Oro (regla eurocéntrica de nacionalidad antes de 1995), el recálculo oficial de France Football de 2016 (Pelé = 7, Maradona = 2), el Super Balón de Oro único de Di Stéfano (1989) y por qué este voto de la gente salda la deuda histórica.

5. SECCIONES SIGUIENTES A INTEGRAR EN LA MISMA PÁGINA:
   - Selector de Modalidad (Super Balón de Oro Histórico vs Balón de Oro 2026).
   - Tier List interactiva Top 10 (con puntuación France Football 25, 18, 15... a 1 pt) con comodín.
   - Resumen y Checkout de $1 USD para voto verificado anti-bot.
   - Generador de Certificado 9:16 "Golden Ballot Pass" compartible en Twitter/X.
   - Marcador en vivo y duelos clásicos (Messi vs Cristiano, Pelé vs Maradona).
   - FAQ Accordion con preguntas clave y footer legal.

Por favor genera o actualiza la variante única en golden_vote_landing.canvas consolidando esta visión completa y limpia.`;

sendToKombai(promptMessage)
  .then(() => console.log('Message delivered to Kombai successfully!'))
  .catch(err => console.error('Error sending to Kombai:', err));

