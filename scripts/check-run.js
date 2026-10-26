const { spawn } = require('child_process');
const fs = require('fs');

const runId = process.argv[2] || 'run_0c0f36b5-3983-4c17-9b12-6fab65d657b2';
const waitSec = parseInt(process.argv[3] || '10', 10);

function checkStatus(id, wait) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      'C:\\Users\\USER\\AppData\\Local\\Programs\\@kombaielectron-app\\resources\\app.asar.unpacked\\dist\\chat-mcp-gateway.cjs',
      '--registration',
      'C:\\Users\\USER\\.kombai\\electron-chat-mcp.Kombai.json'
    ]);

    let buffer = '';

    child.stdout.on('data', data => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 2) {
            child.kill();
            resolve(JSON.parse(msg.result.content[0].text));
          }
        } catch(e) {}
      }
    });

    child.stderr.on('data', data => {});
    child.on('error', reject);

    child.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'checker', version: '1.0' } }
    }) + '\n');

    setTimeout(() => {
      child.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'chat_status',
          arguments: { run_id: id, wait: wait }
        }
      }) + '\n');
    }, 300);
  });
}

checkStatus(runId, waitSec)
  .then(status => {
    console.log('STATUS:', status.status, '| keep_polling:', status.keep_polling);
    if (status.transcript_file_path && fs.existsSync(status.transcript_file_path)) {
      const content = fs.readFileSync(status.transcript_file_path, 'utf8');
      console.log('TRANSCRIPT LENGTH:', content.length);
      console.log('TAIL:\n', content.slice(-500));
    }
    if (status.artifacts && status.artifacts.length) {
      console.log('ARTIFACTS:', JSON.stringify(status.artifacts, null, 2));
    }
  })
  .catch(err => console.error(err));

