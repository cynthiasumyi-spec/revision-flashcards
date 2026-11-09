const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const TOKEN = '--font-display: "Nunito", "jfOpenHuninn", system-ui, sans-serif;';
const TEXT = '--font-text: "Nunito", "jfOpenHuninn", system-ui, sans-serif;';
const ZH = '--font-zh: "jfOpenHuninn", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif;';

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'docs' || name === '.git' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

test('student pages use Nunito and a local full jfOpenHuninn file', () => {
  const font = path.join(root, 'assets/fonts/jf-openhuninn-2.1.woff2');
  const bytes = fs.readFileSync(font);
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'wOF2');
  assert.equal(bytes.length, 2180784);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), '304f86772869a5907ad6390d7c3bab1ec0eeb411fc0a89cafe95b3130af0989b');
  assert.equal(fs.existsSync(path.join(root, 'assets/fonts/OFL.txt')), true);
  const face = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8');
  assert.match(face, /font-family:\s*"jfOpenHuninn"/);
  assert.match(face, /font-weight:\s*400/);
  assert.match(face, /url\("fonts\/jf-openhuninn-2\.1\.woff2\?v=2"\) format\("woff2"\)/);
  assert.doesNotMatch(face, /emfont|Fredoka/);

  for (const rel of [
    'assets/unit.css',
    'assets/site.css',
    'practice/practice.css',
    'practice/grammar/grammar.css',
    'practice/grammar/assets/site.css',
    'watch/watch.css'
  ]) {
    const css = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.match(css, new RegExp(TOKEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), rel);
    assert.match(css, new RegExp(TEXT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), rel);
    assert.match(css, new RegExp(ZH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), rel);
    assert.match(css, /@import url\("[^"]*fonts\.css\?v=2"\)/, rel);
    assert.doesNotMatch(css, /Fredoka|jf-openhuninn"|emfont/, rel);
  }

  const pages = walk(root).filter((file) => file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.svg'));
  for (const file of pages) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    assert.doesNotMatch(text, /Fredoka/, rel);
    assert.doesNotMatch(text, /emfont/, rel);
    if (text.includes('fonts.googleapis.com')) {
      assert.match(text, /family=Nunito:wght@400;500;600;700;800/, rel);
      assert.doesNotMatch(text, /family=Fredoka/, rel);
      assert.match(text, /jf-openhuninn-2\.1\.woff2/, rel);
    }
  }
});
