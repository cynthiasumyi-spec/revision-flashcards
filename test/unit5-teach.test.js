const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function unit5() {
  const html = fs.readFileSync(path.join(root, 'unit5/index.html'), 'utf8');
  const match = html.match(/const CARDS = (\[.*?\]);/s);
  assert.ok(match, 'unit5 defines CARDS');
  return { html, cards: JSON.parse(match[1]) };
}

const TEACH = {
  17: { note_zh: '用 of，不要寫 afraid to + (n.)', pattern: 'be + afraid of + noun / pronoun', chips: [['of', true], ['to', false]] },
  18: { note_zh: '用 of，不要寫 fond with', pattern: 'be + fond of + noun / pronoun', chips: [['of', true], ['with', false]] },
  19: { note_zh: '用 of，不要寫 full about', pattern: 'be + full of + noun', chips: [['of', true], ['about', false]] },
  20: { note_zh: '對人生氣用 with', pattern: 'be + angry with + noun / pronoun', chips: [['with', true]] },
  21: { note_zh: '用 with', pattern: 'be + bored with + noun / pronoun', chips: [['with', true]] },
  22: { note_zh: '用 with，不要寫 pleased about（對人）', pattern: 'be + pleased with + noun / pronoun', chips: [['with', true], ['about', false]] },
  23: { note_zh: '用 with', pattern: 'be + popular with + noun', chips: [['with', true]] },
  24: { note_zh: '用 about', pattern: 'be + crazy about + noun / pronoun', chips: [['about', true]] },
  25: { note_zh: '用 about，不要寫 excited with', pattern: 'be + excited about + noun', chips: [['about', true], ['with', false]] },
  26: { note_zh: '用 about', pattern: 'be + happy about + noun / pronoun', chips: [['about', true]] },
  27: { note_zh: '用 about，不要寫 worried of／in', pattern: 'be + worried about + noun', chips: [['about', true], ['of', false], ['in', false]] },
  28: { note_zh: '用 for', pattern: 'be + bad for + noun / pronoun', chips: [['for', true]] },
  29: { note_zh: '表示出名的原因用 for，不要寫 famous in', pattern: 'be + famous for + noun', chips: [['for', true], ['in', false]] },
  30: { note_zh: '用 for', pattern: 'be + good for + noun / pronoun', chips: [['for', true]] },
  31: { note_zh: '用 in，不要寫 interested on', pattern: 'be + interested in + noun', chips: [['in', true], ['on', false]] },
  32: { note_zh: '用 in，不要寫 successful for', pattern: 'be + successful in + noun', chips: [['in', true], ['for', false]] },
  33: { note_zh: '用 where 為地方加資料（＝ in／at which）', pattern: 'place + where + clause', chips: [['where', true]] }
};

test('unit 5 grammar cards keep live examples and add Miss Chan note, chips, and pattern', () => {
  const { html, cards } = unit5();
  assert.equal(cards.length, 33);
  assert.match(html, /unit\.css\?v=15/);
  assert.match(html, /note-bulb\.png\?v=15/);
  assert.match(html, /teach teach-tip/);
  assert.match(html, /Note<img class="note-bulb"/);
  assert.match(html, />Pattern</);
  assert.match(html, /appendTeach\(article, card\)/);
  assert.doesNotMatch(html, /句型|留意/);
  for (const card of cards) {
    if (card.n <= 16) {
      assert.equal(card.note_zh, undefined, card.en);
      assert.equal(card.chips, undefined, card.en);
      assert.equal(card.pattern, undefined, card.en);
      continue;
    }
    const teach = TEACH[card.n];
    assert.ok(teach, 'teach for ' + card.n);
    assert.equal(card.note_zh, teach.note_zh);
    assert.equal(card.pattern, teach.pattern);
    assert.deepEqual(card.chips.map((chip) => [chip.text, chip.ok]), teach.chips);
    assert.equal(typeof card.ex_en, 'string');
    assert.equal(typeof card.adv_en, 'string');
    assert.ok(card.ex_en.includes(card.highlight), card.en);
    assert.ok(card.adv_en.toLowerCase().includes(card.highlight.toLowerCase()) || card.n === 33, card.en);
  }
  const worried = cards.find((card) => card.n === 27);
  assert.equal(worried.ex_en, 'Mum is worried about the long flight.');
  assert.equal(worried.adv_en, 'Because the plane leaves at night, Mum is worried about the long flight.');
  assert.equal(worried.ex_zh, '媽媽擔心那趟長途飛行。');
  assert.equal(worried.adv_zh, '因為飛機在晚上起飛，媽媽擔心那趟長途飛行。');
  const famous = cards.find((card) => card.n === 29);
  assert.equal(famous.note_zh, '表示出名的原因用 for，不要寫 famous in');
  assert.equal(famous.ex_en, 'That town is famous for kimchi.');
  const interested = cards.find((card) => card.n === 31);
  assert.equal(interested.note_zh, '用 in，不要寫 interested on');
  const where = cards.find((card) => card.n === 33);
  assert.equal(where.pos, '');
  assert.equal(where.zh, '為地方加資料');
  assert.equal(where.ex_en, 'This is the museum where we saw the dinosaur bones.');
  assert.equal(where.adv_en, 'After school we go to the park where the children play football.');
});

test('teach block css uses the unit text stack and does not restyle the site fonts', () => {
  const css = fs.readFileSync(path.join(root, 'assets/unit.css'), 'utf8');
  assert.match(css, /--font-display:\s*"Fredoka"/);
  assert.match(css, /--font-text:\s*"Nunito"/);
  assert.doesNotMatch(css, /jf-openhuninn|粉圓/);
  for (const selector of ['.teach', '.teach-tip', '.note-label', '.note-bulb', '.tip-en', '.tip-inline', '.pattern', '.chip', '.chip-ok', '.chip-no']) {
    assert.match(css, new RegExp(selector.replace('.', '\\.') + '\\s*\\{'));
  }
  const teach = css.slice(css.indexOf('.teach {'), css.indexOf('.header-nav'));
  assert.match(teach, /\.tip-en \{[^}]*var\(--font-text\)/);
  assert.match(teach, /\.pattern \{[^}]*font-family:\s*var\(--font-text\)/);
  assert.match(teach, /\.chip-ok \{[^}]*background:/);
  assert.match(teach, /\.chip-no \{[^}]*background:/);
  assert.match(css, /\.ex-label \{[^}]*font-weight:\s*700/);
  assert.equal(fs.existsSync(path.join(root, 'assets/note-bulb.png')), true);
});
