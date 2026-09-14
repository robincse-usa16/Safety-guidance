const frontendOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const apiHealth = 'http://127.0.0.1:4000/api/health';

console.log(`Node.js: ${process.version} ${Number(process.versions.node.split('.')[0]) >= 20 ? '✓' : '✗ (20.19+ required)'}`);
console.log(`Expected website: ${frontendOrigins.join(' or ')}`);
try {
  const response = await fetch(apiHealth, { signal: AbortSignal.timeout(2500) });
  const payload = await response.json();
  console.log(`API: connected ✓ (${apiHealth})`);
  console.log(`Google Web Risk: ${payload.providers?.googleWebRisk || 'unknown'}`);
  console.log(`VirusTotal: ${payload.providers?.virusTotal || 'unknown'}`);
} catch {
  console.log(`API: offline ✗ (${apiHealth})`);
  console.log('Fix: open the project root in VS Code and run: npm run dev');
}
