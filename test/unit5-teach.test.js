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

const NOTE = new Set([17, 18, 19, 22, 25, 27, 29, 31, 32]);
const PATTERN_ONLY = new Set([20, 21, 23, 24, 26, 28, 30, 33]);

const TEACH = {
  17: { note_zh: '用 of，不要寫 afraid to + (n.)', pattern: 'be + afraid of + noun / pronoun', chips: [['of', true], ['to', false]] },
  18: { note_zh: '用 of，不要寫 fond with', pattern: 'be + fond of + noun / pronoun', chips: [['of', true], ['with', false]] },
  19: { note_zh: '用 of，不要寫 full about', pattern: 'be + full of + noun', chips: [['of', true], ['about', false]] },
  20: { pattern: 'be + angry with + noun / pronoun' },
  21: { pattern: 'be + bored with + noun / pronoun' },
  22: { note_zh: '用 with，不要寫 pleased about（對人）', pattern: 'be + pleased with + noun / pronoun', chips: [['with', true], ['about', false]] },
  23: { pattern: 'be + popular with + noun' },
  24: { pattern: 'be + crazy about + noun / pronoun' },
  25: { note_zh: '用 about，不要寫 excited with', pattern: 'be + excited about + noun', chips: [['about', true], ['with', false]] },
  26: { pattern: 'be + happy about + noun / pronoun' },
  27: { note_zh: '用 about，不要寫 worried of／in', pattern: 'be + worried about + noun', chips: [['about', true], ['of', false], ['in', false]] },
  28: { pattern: 'be + bad for + noun / pronoun' },
  29: { note_zh: '表示出名的原因用 for，不要寫 famous in', pattern: 'be + famous for + noun', chips: [['for', true], ['in', false]] },
  30: { pattern: 'be + good for + noun / pronoun' },
  31: { note_zh: '用 in，不要寫 interested on', pattern: 'be + interested in + noun', chips: [['in', true], ['on', false]] },
  32: { note_zh: '用 in，不要寫 successful for', pattern: 'be + successful in + noun', chips: [['in', true], ['for', false]] },
  33: { pattern: 'place + where + clause' }
};

test('unit 5 grammar notes stay only on Miss Chan common-mistake cards', () => {
  const { html, cards } = unit5();
  assert.equal(cards.length, 33);
  assert.match(html, /unit\.css\?v=16/);
  assert.match(html, /note-bulb\.png\?v=15/);
  assert.match(html, /teach teach-tip/);
  assert.match(html, /Note<img class="note-bulb"/);
  assert.match(html, />Pattern</);
  assert.match(html, /appendTeach\(article, card\)/);
  assert.match(html, /var hasNote = !!card\.note_zh \|\| \(card\.chips && card\.chips\.length\)/);
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
    assert.equal(card.pattern, teach.pattern);
    assert.equal(typeof card.ex_en, 'string');
    assert.equal(typeof card.adv_en, 'string');
    assert.ok(card.ex_en.includes(card.highlight), card.en);
    assert.ok(card.adv_en.toLowerCase().includes(card.highlight.toLowerCase()) || card.n === 33, card.en);
    if (NOTE.has(card.n)) {
      assert.equal(card.note_zh, teach.note_zh);
      assert.deepEqual(card.chips.map((chip) => [chip.text, chip.ok]), teach.chips);
    } else {
      assert.ok(PATTERN_ONLY.has(card.n), card.en);
      assert.equal(card.note_zh, undefined, card.en);
      assert.equal(card.chips, undefined, card.en);
    }
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
  const angry = cards.find((card) => card.n === 20);
  assert.equal(angry.ex_en, 'Dad is angry with my brother.');
  assert.equal(angry.audio, 'audio/audio_20.mp3');
  const where = cards.find((card) => card.n === 33);
  assert.equal(where.pos, '');
  assert.equal(where.zh, '為地方加資料');
  assert.equal(where.ex_en, 'This is the museum where we saw the dinosaur bones.');
  assert.equal(where.adv_en, 'After school we go to the park where the children play football.');
  assert.equal(cards[0].en, 'go snowboarding');
  assert.equal(cards[15].en, 'visit an aquarium');
});

test('pattern-only grammar cards render Pattern without an empty Note block', () => {
  const { html, cards } = unit5();
  const start = html.indexOf('function esc(');
  const end = html.indexOf('CARDS.forEach');
  const src = html.slice(start, end);
  const document = {
    createElement() {
      return { className: '', innerHTML: '' };
    }
  };
  const api = new Function('document', src + '\nreturn { appendTeach };')(document);
  for (const card of cards) {
    const article = { children: [], appendChild(child) { this.children.push(child); } };
    api.appendTeach(article, card);
    const tips = article.children.filter((el) => String(el.className).includes('teach-tip'));
    const patterns = article.children.filter((el) => el.className === 'teach');
    if (card.n <= 16) {
      assert.equal(article.children.length, 0, card.en);
    } else if (NOTE.has(card.n)) {
      assert.equal(tips.length, 1, card.en);
      assert.match(tips[0].innerHTML, /Note<img class="note-bulb"/);
      assert.match(tips[0].innerHTML, /class="chip/);
      assert.equal(patterns.length, 1, card.en);
      assert.match(patterns[0].innerHTML, />Pattern</);
    } else {
      assert.equal(tips.length, 0, card.en);
      assert.equal(patterns.length, 1, card.en);
      assert.match(patterns[0].innerHTML, />Pattern</);
      assert.doesNotMatch(patterns[0].innerHTML, /note-bulb|class="chip/);
    }
  }
});

test('unit teach css uses Nunito for English and jfOpenHuninn for Chinese notes', () => {
  const css = fs.readFileSync(path.join(root, 'assets/unit.css'), 'utf8');
  assert.match(css, /--font-display:\s*"Nunito",\s*"jfOpenHuninn",\s*system-ui,\s*sans-serif;/);
  assert.match(css, /--font-text:\s*"Nunito",\s*"jfOpenHuninn",\s*system-ui,\s*sans-serif;/);
  assert.match(css, /--font-zh:\s*"jfOpenHuninn",\s*"PingFang TC",\s*"Noto Sans TC",\s*"Microsoft JhengHei",\s*system-ui,\s*sans-serif;/);
  assert.doesNotMatch(css, /Fredoka/);
  assert.match(css, /@import url\("fonts\.css\?v=1"\)/);
  for (const selector of ['.teach', '.teach-tip', '.note-label', '.note-bulb', '.tip-en', '.tip-inline', '.pattern', '.chip', '.chip-ok', '.chip-no']) {
    assert.match(css, new RegExp(selector.replace('.', '\\.') + '\\s*\\{'));
  }
  const teach = css.slice(css.indexOf('.teach {'), css.indexOf('.header-nav'));
  assert.match(teach, /\.tip-en \{[^}]*font-family:\s*var\(--font-zh\)/);
  assert.match(teach, /\.pattern \{[^}]*font-family:\s*var\(--font-text\)/);
  assert.match(teach, /\.chip-ok \{[^}]*background:/);
  assert.match(teach, /\.chip-no \{[^}]*background:/);
  assert.match(css, /\.zh \{[^}]*font-family:\s*var\(--font-zh\)/);
  assert.match(css, /\.ex-zh \{[^}]*font-family:\s*var\(--font-zh\)/);
  assert.match(css, /\.headword \{[^}]*font-family:\s*var\(--font-display\)/);
  assert.match(css, /\.ex-label \{[^}]*font-weight:\s*700/);
  assert.equal(fs.existsSync(path.join(root, 'assets/note-bulb.png')), true);
});
