const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const UNITS = ['unit1', 'unit2', 'unit3', 'unit4'];

function cards(unit) {
  const html = fs.readFileSync(path.join(root, unit, 'index.html'), 'utf8');
  const match = html.match(/const CARDS = (\[.*?\]);/s);
  assert.ok(match, unit + ' defines CARDS');
  return { html, cards: JSON.parse(match[1]) };
}

function samePhrase(en, syllables) {
  const words = en.split(/\s+/);
  const pieces = syllables.split(/\s+/);
  if (words.length !== pieces.length) return false;
  return words.every((word, i) => {
    const piece = pieces[i];
    if (word === 'a' || word === 'an' || word === 'the') return piece === word;
    return piece.replace(/-/g, '') === word.replace(/-/g, '');
  });
}

test('unit word cards show the headword and a gold syllable line', () => {
  for (const unit of UNITS) {
    const { html, cards: list } = cards(unit);
    assert.match(html, /unit\.css\?v=10/);
    assert.match(html, /class="headword"/);
    assert.doesNotMatch(html, /syl-hint|下方是分音節寫法/);
    assert.match(html, /class="syllables is-break"/);
    assert.ok(list.length > 0, unit);
    for (const card of list) {
      assert.equal(typeof card.en, 'string');
      assert.equal(typeof card.syllables, 'string');
      assert.ok(samePhrase(card.en, card.syllables), unit + ' ' + card.en + ' / ' + card.syllables);
    }
  }
  const quake = cards('unit2').cards.find((card) => card.en === 'an earthquake');
  assert.equal(quake.syllables, 'an earth-quake');
  const drought = cards('unit2').cards.find((card) => card.en === 'a drought');
  assert.equal(drought.syllables, 'a drought');
  const css = fs.readFileSync(path.join(root, 'assets/unit.css'), 'utf8');
  assert.equal(css.includes('.syl-hint'), false);
  const syllableRule = css.slice(css.indexOf('.syllables {'), css.indexOf('.zh {'));
  assert.match(syllableRule, /\.syllables \{[^}]*color:\s*#a67c00/);
  assert.match(syllableRule, /\.syllables\.is-break \{[^}]*color:\s*#a67c00/);
});

test('wicked card art has no title band and the unit 4 cover has no white top strip', () => {
  const { execFileSync } = require('node:child_process');
  const script = `
from PIL import Image
import os
root = ${JSON.stringify(root)}
cover = Image.open(os.path.join(root, 'covers', 'unit4.jpg')).convert('RGB')
w, h = cover.size
px = cover.load()
white = sum(1 for x in range(w) if px[x, 0][0] > 245 and px[x, 0][1] > 245 and px[x, 0][2] > 245)
if white / w > 0.2:
    raise SystemExit('cover white ' + str(white))
import hashlib
def digest(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()
cover_path = os.path.join(root, 'covers', 'unit4.jpg')
home_path = os.path.join(root, 'home-eduhome', 'covers', 'unit4.jpg')
if digest(cover_path) != digest(home_path):
    raise SystemExit('home cover differs')
art = Image.open(os.path.join(root, 'unit4', 'thumb_13.png')).convert('RGB')
aw, ah = art.size
ap = art.load()
pale = n = 0
for y in range(int(ah * 0.08)):
    for x in range(0, aw, 2):
        r, g, b = ap[x, y]
        n += 1
        if r > 230 and g > 220 and b > 210:
            pale += 1
if pale / n > 0.2:
    raise SystemExit('wicked pale title ' + str(pale / n))
print('ok')
`;
  const out = execFileSync('python3', ['-c', script], { encoding: 'utf8' });
  assert.match(out, /ok/);
});
