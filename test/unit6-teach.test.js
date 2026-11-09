const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function unit6() {
  const html = fs.readFileSync(path.join(root, 'unit6/index.html'), 'utf8');
  const match = html.match(/const CARDS = (\[.*?\]);/s);
  assert.ok(match, 'unit6 defines CARDS');
  return { html, cards: JSON.parse(match[1]) };
}

const TEACH = {
  20: {
    en: 'until',
    note_zh: '表示事情何時結束；不要寫 until to',
    pattern: '… + until + time / clause',
    chips: [['until', true], ['until to', false]],
    pos: '',
    zh: '直到……為止',
    syllables: '',
    ex_en: 'We play outside until the weather gets too cold.',
    ex_zh: '我們在外面玩，直到天氣變得太冷。',
    adv_en: 'The children stay in the park until the weather gets too cold, and then they go indoors.',
    adv_zh: '孩子們留在公園，直到天氣變得太冷，然後他們走進室內。',
    audio: 'audio/audio_20.mp3',
    img: 'thumb_20.png'
  },
  21: {
    en: 'each',
    note_zh: 'each 後用單數名詞，不要加複數',
    pattern: 'each + singular noun',
    chips: [['dancer', true], ['dancers', false]],
    pos: '',
    zh: '每一',
    syllables: '',
    ex_en: 'Each dancer holds a pair of candles.',
    ex_zh: '每一位舞者拿着一對蠟燭。',
    adv_en: 'On the stage, each dancer holds a pair of candles while the music plays.',
    adv_zh: '在舞台上，每一位舞者在音樂聲中拿着一對蠟燭。',
    audio: 'audio/audio_21.mp3',
    img: 'thumb_21.png'
  },
  22: {
    en: 'both',
    note_zh: 'both 指兩個，後面用複數名詞',
    pattern: 'both + plural noun',
    chips: [['dancers', true], ['dancer', false]],
    pos: '',
    zh: '兩個都',
    syllables: '',
    ex_en: 'Both dancers come from India.',
    ex_zh: '兩位舞者都來自印度。',
    adv_en: 'Although they are still young, both dancers come from India and train hard.',
    adv_zh: '雖然他們年紀尚輕，兩位舞者都來自印度並努力練習。',
    audio: 'audio/audio_22.mp3',
    img: 'thumb_22.png'
  },
  23: {
    en: 'several',
    note_zh: 'several 指三個或以上，後面用複數名詞',
    pattern: 'several + plural noun',
    chips: [['balloons', true], ['balloon', false]],
    pos: '',
    zh: '幾個（三個或以上）',
    syllables: '',
    ex_en: 'Several balloons floated above the stage.',
    ex_zh: '有幾個氣球漂浮在舞台上方。',
    adv_en: 'Although the party was over, several balloons were still hanging from the ceiling.',
    adv_zh: '雖然派對已結束，天花板上仍掛着幾個氣球。',
    audio: 'audio/audio_23.mp3',
    img: 'thumb_23.png'
  }
};

test('unit 6 grammar cards keep live examples and add Note, chips, and Pattern', () => {
  const { html, cards } = unit6();
  assert.equal(cards.length, 23);
  assert.match(html, /fonts\.css\?v=3/);
  assert.match(html, /unit\.css\?v=18/);
  assert.match(html, /family=Nunito/);
  assert.match(html, /note-bulb\.png\?v=15/);
  assert.match(html, /teach teach-tip/);
  assert.match(html, /Note<img class="note-bulb"/);
  assert.match(html, />Pattern</);
  assert.match(html, /tip-inline/);
  assert.match(html, /appendTeach\(article, card\)/);
  assert.doesNotMatch(html, /句型|留意/);
  for (const card of cards) {
    if (card.n <= 19) {
      assert.equal(card.note_zh, undefined, card.en);
      assert.equal(card.chips, undefined, card.en);
      assert.equal(card.pattern, undefined, card.en);
      continue;
    }
    const teach = TEACH[card.n];
    assert.ok(teach, 'teach for ' + card.n);
    assert.equal(card.en, teach.en);
    assert.equal(card.pos, teach.pos);
    assert.equal(card.zh, teach.zh);
    assert.equal(card.syllables, teach.syllables);
    assert.equal(card.note_zh, teach.note_zh);
    assert.equal(card.pattern, teach.pattern);
    assert.deepEqual(card.chips.map((chip) => [chip.text, chip.ok]), teach.chips);
    assert.equal(card.ex_en, teach.ex_en);
    assert.equal(card.ex_zh, teach.ex_zh);
    assert.equal(card.adv_en, teach.adv_en);
    assert.equal(card.adv_zh, teach.adv_zh);
    assert.equal(card.audio, teach.audio);
    assert.equal(card.img, teach.img);
    assert.equal(card.highlight, teach.en);
  }
});

test('unit 6 grammar teach blocks put Note above Pattern with ok and no chips', () => {
  const { html, cards } = unit6();
  const start = html.indexOf('function esc(');
  const end = html.indexOf('CARDS.forEach');
  assert.ok(start >= 0 && end > start, 'unit6 defines esc and appendTeach before the card loop');
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
    if (card.n <= 19) {
      assert.equal(article.children.length, 0, card.en);
      continue;
    }
    assert.equal(tips.length, 1, card.en);
    assert.equal(patterns.length, 1, card.en);
    assert.ok(article.children.indexOf(tips[0]) < article.children.indexOf(patterns[0]), card.en);
    assert.match(tips[0].innerHTML, /Note<img class="note-bulb"/);
    assert.match(tips[0].innerHTML, /class="tip-inline"/);
    assert.match(tips[0].innerHTML, /class="tip-en"/);
    assert.match(patterns[0].innerHTML, />Pattern</);
    assert.match(patterns[0].innerHTML, /class="pattern"/);
    const teach = TEACH[card.n];
    assert.match(tips[0].innerHTML, new RegExp(teach.note_zh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(patterns[0].innerHTML, new RegExp(teach.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    for (const [text, ok] of teach.chips) {
      const mark = ok ? '✓' : '✕';
      const klass = ok ? 'chip-ok' : 'chip-no';
      assert.match(tips[0].innerHTML, new RegExp('class="chip ' + klass + '">' + mark + ' ' + text));
    }
  }
});
