const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('Synchronizing changes into Kombai canvas and raw files...');

const indexPath = path.join(__dirname, '..', 'index.html');
const canvasPath = path.join(__dirname, '..', '.kombai', 'canvas', 'golden_vote_landing.canvas');
const rawHtmlPath = path.join(__dirname, '..', 'kombai_unified_raw.html');

const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Extract style
const styleMatch = indexHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
const styleContent = styleMatch ? styleMatch[0] : '';

// Extract body inner content
const bodyMatch = indexHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const bodyContent = bodyMatch ? bodyMatch[1] : '';

// Format node HTML for Kombai (with /api/local/images/ proxy for canvas iframe)
const proxyBodyContent = bodyContent.replace(/src="assets\//g, 'src="/api/local/images/assets/');
const kombaiNodeHtml = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css');

  :root {
    --gold-light: #FFE082;
    --gold-primary: #D4AF37;
    --gold-dark: #8B6909;
    --obsidian: #070709;
    --carbon: #101015;
    --smoke: #181820;
  }
</style>
${styleContent}
<div class="kombai-root bg-[#070709] text-gray-100 min-h-screen selection:bg-[#D4AF37] selection:text-black antialiased relative overflow-x-hidden">
${proxyBodyContent}
</div>`;

// 1. Write kombai_unified_raw.html
fs.writeFileSync(rawHtmlPath, kombaiNodeHtml, 'utf8');
console.log('Updated kombai_unified_raw.html (size:', fs.statSync(rawHtmlPath).size, 'bytes)');

// 2. Read and update .kombai/canvas/golden_vote_landing.canvas
const canvasRaw = fs.readFileSync(canvasPath, 'utf8');
const headerMatch = canvasRaw.match(/^(\/\/[^\n]*\n)+/);
const headerBanner = headerMatch ? headerMatch[0] : '';
const jsonStr = canvasRaw.slice(headerBanner.length);

const canvasData = JSON.parse(jsonStr);

if (canvasData.nodes && canvasData.nodes['var_fd6e329d0f99']) {
  canvasData.nodes['var_fd6e329d0f99'].html = kombaiNodeHtml;
  canvasData.nodes['var_fd6e329d0f99'].label = 'THE GOLDEN VOTE — Escrutinio Oficial & Votación en Vivo';
  canvasData.nodes['var_fd6e329d0f99'].modified = new Date().toISOString();
}

canvasData.modified = new Date().toISOString();

const finalCanvasContent = headerBanner + JSON.stringify(canvasData, null, 2);
fs.writeFileSync(canvasPath, finalCanvasContent, 'utf8');
console.log('Updated .kombai/canvas/golden_vote_landing.canvas (size:', fs.statSync(canvasPath).size, 'bytes)');

// 3. Send notification to Kombai Desktop Chat MCP
function notifyKombai(promptText, threadId = '533b2a1608f540b49187f2d792012468') {
  return new Promise((resolve) => {
    console.log('Sending update to Kombai Desktop MCP on thread:', threadId);

    const child = spawn(process.execPath, [
      'C:\\Users\\USER\\AppData\\Local\\Programs\\@kombaielectron-app\\resources\\app.asar.unpacked\\dist\\chat-mcp-gateway.cjs',
      '--registration',
      'C:\\Users\\USER\\.kombai\\electron-chat-mcp.Kombai.json'
    ]);

    let resolved = false;

    child.stdout.on('data', data => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 2) {
            console.log('Kombai MCP Accepted Update:', JSON.stringify(msg.result, null, 2));
            resolved = true;
            child.kill();
            resolve(msg.result);
          }
        } catch(e) {}
      }
    });

    child.stderr.on('data', data => {
      // console.log('Kombai MCP:', data.toString().trim());
    });

    child.on('error', err => {
      console.error('Kombai process error:', err.message);
      resolve(null);
    });

    // Initialize MCP
    child.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'antigravity-sync', version: '2.0' }
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
          workspace_root: path.resolve(__dirname, '..'),
          thread_id: threadId,
          prompt: promptText
        }
      }
    };

    setTimeout(() => {
      child.stdin.write(JSON.stringify(callPayload) + '\n');
    }, 600);

    setTimeout(() => {
      if (!resolved) {
        child.kill();
        resolve(null);
      }
    }, 6000);
  });
}

const syncMessage = `✅ ACTUALIZACIÓN INTEGRAL APLICADA AL PROYECTO Y AL CANVAS DE KOMBAI:

Se han incorporado todos los requerimientos solicitados por el usuario:
1. SISTEMA 1 USD = 1 VOTO (UPSELL & PERSONALIZACIÓN):
   - Presets de 1, 5, 10, 20, 50, 100 votos y campo de entrada libre a $1 USD c/u.
   - Posibilidad de dar el 100% de los votos a un jugador o distribuirlos libremente con controles directos.
2. FOTOS REALES DE LOS 50 JUGADORES EN AMBAS CATEGORÍAS:
   - Super Balón de Oro Histórico: 50 leyendas con sus rostros reales, era, trofeos y datos.
   - Balón de Oro 2026: 50 candidatos actuales de la temporada (Vinicius, Mbappé, Haaland, Rodri, Bellingham, Yamal...) con sus fotos reales y clubes.
3. IMAGEN REAL DEL TROFEO DEL SUPER BALÓN DE ORO:
   - Incorporada fotografía de estudio del trofeo real de Alfredo Di Stéfano (1989) en assets/super-ballon-dor-real.jpg y .kombai/assets/super-ballon-dor-real.jpg.
4. ARQUITECTURA VISUAL PRIORITARIA:
   - Ambas modalidades separadas en la parte superior de la página (Super Balón principal y Balón 2026 secundario pero 100% interactivo).
5. BARRA DE TIEMPO REAL & RANKING EN VIVO:
   - Ticker animado de votos mundiales entrantes y ranking en vivo con barras dinámicas.
6. TARJETA DE ESTATUS Y GOLDEN BALLOT PASS:
   - Desglose exacto de cuántos votos compró, a quién se los dio y cómo los repartió, estatus honorífico y descarga en PNG 9:16.
7. PAGOS CONECTADOS (STRIPE Y PAYPAL):
   - Checkout con tarjeta y PayPal listos para producción.

El canvas .kombai/canvas/golden_vote_landing.canvas y kombai_unified_raw.html han sido actualizados con la versión maestra.`;

notifyKombai(syncMessage).then(() => {
  console.log('Kombai synchronization complete!');
  process.exit(0);
});

