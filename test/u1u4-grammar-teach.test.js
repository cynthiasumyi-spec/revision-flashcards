const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const WORDS = { unit1: 10, unit2: 10, unit3: 12, unit4: 14 };
const EXPECTED = {
  "unit1": [
    {
      "n": 11,
      "en": "so many",
      "zh": "這麼多（可數）",
      "pattern": "so many + plural countable noun",
      "ex_en": "Ben sells so many flags at the fair.",
      "ex_zh": "Ben在嘉年華賣出這麼多面旗。",
      "adv_en": "Because the walkathon is popular, Ben sells so many flags before lunch.",
      "adv_zh": "因為步行籌款很受歡迎，Ben在午飯前就賣出這麼多面旗。"
    },
    {
      "n": 12,
      "en": "so much",
      "zh": "這麼多（不可數）",
      "pattern": "so much + uncountable noun",
      "ex_en": "The class raises so much money for the shelter.",
      "ex_zh": "這個班為收容所籌得這麼多錢。",
      "adv_en": "After they visit the elderly home, the children donate so much money that the teacher smiles.",
      "adv_zh": "探訪安老院之後，孩子們捐出這麼多錢，老師也笑了。"
    },
    {
      "n": 13,
      "en": "who",
      "zh": "……的人（關係代名詞）",
      "pattern": "person / people + who + clause",
      "ex_en": "She is the volunteer who looks after the pets.",
      "ex_zh": "她就是那位照顧寵物的志願者。",
      "adv_en": "Although he is busy after school, Tom is the boy who always helps at the fund-raising fair.",
      "adv_zh": "雖然放學後很忙，Tom仍是那位常常在籌款嘉年華幫忙的男孩。",
      "note_zh": "who 只用於人；動物不是人，不要寫 who",
      "chips": [
        [
          "which（動物）",
          true
        ],
        [
          "who（動物）",
          false
        ]
      ]
    },
    {
      "n": 14,
      "en": "which",
      "zh": "……的事物（關係代名詞）",
      "pattern": "thing / things + which + clause",
      "ex_en": "This is the raffle ticket which wins a prize.",
      "ex_zh": "這就是那張會得獎的抽獎券。",
      "adv_en": "While May packs the box, she chooses the book which she will give away.",
      "adv_zh": "May收拾箱子時，選了她要贈送的那本書。"
    }
  ],
  "unit2": [
    {
      "n": 11,
      "en": "If …, … will …",
      "zh": "如果……，就會……（可能發生）",
      "pattern": "If-clause (simple present) + main clause (future / will)",
      "ex_en": "If a typhoon comes, we will stay at home.",
      "ex_zh": "如果颱風來，我們會留在家裡。",
      "adv_en": "If the flood blocks the roads, the workers will help the injured people first.",
      "adv_zh": "如果水災堵塞道路，工作人員會先幫助受傷的人。"
    },
    {
      "n": 12,
      "en": "so that",
      "zh": "以便／為了……",
      "pattern": "… so that + clause",
      "ex_en": "We pack dry food so that we can help after the flood.",
      "ex_zh": "我們準備乾糧，以便水災後能夠幫忙。",
      "adv_en": "The firemen clear the landslip so that cars can use the road again.",
      "adv_zh": "消防員清理山泥傾瀉，以便汽車能再上路。",
      "note_zh": "so 表示「所以／因此」；so that 表示「以便／為了」（目的）"
    }
  ],
  "unit3": [
    {
      "n": 13,
      "en": "although",
      "zh": "雖然……",
      "pattern": "Although + clause, …",
      "ex_en": "Although the soup is hot, Mum still tastes it.",
      "ex_zh": "雖然湯很燙，媽媽仍然試味。",
      "adv_en": "Ben keeps stirring the sauce until it is smooth although he is tired.",
      "adv_zh": "Ben繼續攪拌醬汁，直到它變得滑溜，雖然他很累。",
      "note_zh": "不要同句再用 but（Although … but … ✕）",
      "chips": [
        [
          "Although",
          true
        ],
        [
          "Although … but",
          false
        ]
      ]
    },
    {
      "n": 14,
      "en": "after",
      "zh": "在……之後",
      "pattern": "After + clause, … / … after + clause",
      "ex_en": "After Mum peels the apples, she chops them.",
      "ex_zh": "媽媽削完蘋果皮後，把蘋果切碎。",
      "adv_en": "Amy pours the mixture into the pan after she beats the eggs.",
      "adv_zh": "Amy把混合物倒進鍋裡，是在她打好蛋之後。",
      "note_zh": "子句在前要加逗號；用來講先後順序"
    },
    {
      "n": 15,
      "en": "before",
      "zh": "在……之前",
      "pattern": "Before + clause, … / … before + clause",
      "ex_en": "Before you fry the fish, wash it carefully.",
      "ex_zh": "煎魚之前，要先仔細清洗。",
      "adv_en": "While the oil is heating, wash the fish carefully before you fry it.",
      "adv_zh": "趁油在加熱時，先仔細清洗魚，然後才煎。",
      "note_zh": "子句在前要加逗號；用來講先後順序"
    }
  ],
  "unit4": [
    {
      "n": 15,
      "en": "If … were …, … would …",
      "zh": "如果……是……（假設／建議）",
      "pattern": "If + past (were), … would …",
      "ex_en": "If I were you, I would take the offer.",
      "ex_zh": "如果我是你，我會接受這個提議／工作機會。",
      "adv_en": "If I were the hero in that action film, I would save the timid boy first.",
      "adv_zh": "如果我是那部動作片裡的英雄，我會先救出那個膽小的男孩。",
      "note_zh": "If I were you，不要寫 If I was you",
      "chips": [
        [
          "were",
          true
        ],
        [
          "was",
          false
        ]
      ]
    },
    {
      "n": 16,
      "en": "as … as",
      "zh": "和……一樣……",
      "pattern": "as + adjective + as",
      "ex_en": "She is as determined as her brother.",
      "ex_zh": "她和她哥哥一樣堅定。",
      "adv_en": "Although the wicked witch looks gentle, she is as cruel as the harsh winter.",
      "adv_zh": "雖然邪惡的女巫看起來很溫柔，但她像嚴冬一樣無情殘忍。"
    }
  ]
};

const ART = {
  unit1: {
    11: 'generated',
    12: 'irasutoya:https://www.irasutoya.com/2014/01/blog-post_5281.html',
    13: 'irasutoya:https://www.irasutoya.com/2015/09/blog-post_738.html',
    14: 'irasutoya:https://www.irasutoya.com/2013/11/blog-post_6260.html'
  },
  unit2: {
    11: 'generated',
    12: 'irasutoya:https://www.irasutoya.com/2020/10/blog-post_460.html'
  },
  unit3: {
    13: 'irasutoya:https://www.irasutoya.com/2014/04/blog-post_6903.html',
    14: 'irasutoya:https://www.irasutoya.com/2016/09/blog-post_584.html',
    15: 'generated'
  },
  unit4: {
    15: 'irasutoya:https://www.irasutoya.com/2015/03/blog-post_64.html',
    16: 'generated'
  }
};

function load(unit) {
  const html = fs.readFileSync(path.join(root, unit, 'index.html'), 'utf8');
  const match = html.match(/const CARDS = (\[.*?\]);/s);
  assert.ok(match, unit + ' defines CARDS');
  return { html, cards: JSON.parse(match[1]) };
}

test('units 1-4 grammar cards use the approved Wu text and leave word cards alone', () => {
  for (const [unit, expected] of Object.entries(EXPECTED)) {
    const { html, cards } = load(unit);
    const wordsMax = WORDS[unit];
    assert.equal(cards.length, wordsMax + expected.length, unit);
    assert.match(html, new RegExp('const WORDS_MAX = ' + wordsMax + ';'));
    assert.match(html, />Pattern</);
    assert.match(html, /Example</);
    assert.match(html, /Advanced example</);
    assert.match(html, /note-bulb\.png\?v=15/);
    assert.match(html, /card\.cutout/);
    assert.doesNotMatch(html, /句型|留意|keep_note|rewrite_note/);
    const classLine = html.split('\n').find((line) => line.includes("wrap.className = 'illust'"));
    const expr = classLine.replace(/^.*wrap\.className = /, '').replace(/;\s*$/, '');
    const illustClass = new Function('card', 'return ' + expr);
    assert.match(illustClass({ cutout: true, img: 'thumb_grammar.png' }), /cutout/, unit);
    assert.doesNotMatch(illustClass({ img: 'thumb_99.jpg' }), /cutout/, unit);
    const words = cards.filter((card) => card.n <= wordsMax);
    assert.equal(words.length, wordsMax, unit);
    for (const card of words) {
      assert.equal(card.pattern, undefined, card.en);
      assert.equal(card.note_zh, undefined, card.en);
      assert.equal(card.chips, undefined, card.en);
      assert.ok(card.pos, card.en);
      assert.ok(card.img, card.en);
      assert.ok(card.audio, card.en);
    }
    expected.forEach((spec, index) => {
      const card = cards.find((item) => item.n === spec.n);
      assert.ok(card, unit + ' #' + spec.n);
      assert.equal(cards.indexOf(card), wordsMax + index, spec.en);
      assert.equal(card.en, spec.en);
      assert.equal(card.zh, spec.zh);
      assert.equal(card.pattern, spec.pattern);
      assert.equal(card.ex_en, spec.ex_en);
      assert.equal(card.ex_zh, spec.ex_zh);
      assert.equal(card.adv_en, spec.adv_en);
      assert.equal(card.adv_zh, spec.adv_zh);
      assert.equal(card.syllables, '');
      assert.equal(card.pos, '');
      assert.equal(card.highlight, spec.en);
      assert.equal(card.audio, 'audio/audio_' + String(spec.n).padStart(2, '0') + '.mp3');
      assert.equal(card.img, 'thumb_' + String(spec.n).padStart(2, '0') + '.png', spec.en);
      assert.equal(card.cutout, true, spec.en);
      assert.equal(card.art_source, ART[unit][spec.n], spec.en);
      const imgPath = path.join(root, unit, card.img);
      const imgBytes = fs.readFileSync(imgPath);
      assert.equal(imgBytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', imgPath);
      assert.ok(imgBytes.length > 20000, imgPath);
      assert.equal(card.keep_note, undefined);
      assert.equal(card.rewrite_note, undefined);
      const audioPath = path.join(root, unit, card.audio);
      assert.equal(fs.existsSync(audioPath), true, audioPath);
      assert.ok(fs.statSync(audioPath).size > 2000, audioPath);
      if (spec.note_zh) {
        assert.equal(card.note_zh, spec.note_zh);
        if (spec.chips) {
          assert.deepEqual(card.chips.map((chip) => [chip.text, chip.ok]), spec.chips);
        } else {
          assert.equal(card.chips, undefined, spec.en);
        }
      } else {
        assert.equal(card.note_zh, undefined, spec.en);
        assert.equal(card.chips, undefined, spec.en);
      }
    });
  }
  const unit1 = load('unit1').cards;
  assert.equal(unit1[0].en, 'adopt a pet');
  assert.equal(unit1[0].ex_en, 'The family wants to adopt a pet from the shelter.');
  assert.equal(unit1[9].en, 'visit an elderly home');
  const unit2 = load('unit2').cards;
  assert.equal(unit2[0].en, 'a drought');
  assert.equal(unit2[0].ex_en, 'The dry land shows there is a drought.');
  const unit3 = load('unit3').cards;
  assert.equal(unit3[0].en, 'beat');
  assert.equal(unit3[0].ex_zh, '媽媽用打蛋器攪打雞蛋。');
  const unit4 = load('unit4').cards;
  assert.equal(unit4[0].en, 'an action film');
  assert.equal(unit4[13].en, 'wise');
  assert.equal(unit4[13].ex_en, 'The wise old man reads many books.');
  assert.equal(unit1[2].img, 'thumb_03.jpg');
  assert.equal(unit1[2].art_source, 'generated');
  assert.equal(unit1[2].cutout, undefined);

  const watchSrc = fs.readFileSync(path.join(root, 'watch/packs.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(watchSrc, sandbox);
  const packs = sandbox.window.WATCH_PACKS;
  for (const [unit, expected] of Object.entries(EXPECTED)) {
    for (const spec of expected) {
      const watched = packs[unit].cards.find((card) => card.n === spec.n);
      assert.equal(watched.en, spec.en);
      assert.ok(watched.img.includes('thumb_' + String(spec.n).padStart(2, '0') + '.png'), watched.img);
    }
    assert.ok(packs[unit].cards[0].img.includes('thumb_01'), unit);
  }
});

test('note cards show Note and chips, and pattern-only cards do not', () => {
  for (const unit of Object.keys(EXPECTED)) {
    const { html, cards } = load(unit);
    const start = html.indexOf('function esc(');
    const end = html.indexOf('CARDS.forEach');
    assert.ok(start >= 0 && end > start, unit);
    const document = { createElement() { return { className: '', innerHTML: '' }; } };
    const api = new Function('document', html.slice(start, end) + '\nreturn { appendTeach };')(document);
    for (const card of cards) {
      const article = { children: [], appendChild(child) { this.children.push(child); } };
      api.appendTeach(article, card);
      const tips = article.children.filter((el) => String(el.className).includes('teach-tip'));
      const patterns = article.children.filter((el) => el.className === 'teach');
      if (card.n <= WORDS[unit]) {
        assert.equal(article.children.length, 0, card.en);
        continue;
      }
      assert.equal(patterns.length, 1, card.en);
      assert.match(patterns[0].innerHTML, />Pattern</);
      assert.match(patterns[0].innerHTML, new RegExp(card.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      if (card.note_zh) {
        assert.equal(tips.length, 1, card.en);
        assert.ok(article.children.indexOf(tips[0]) < article.children.indexOf(patterns[0]), card.en);
        assert.match(tips[0].innerHTML, /Note<img class="note-bulb"/);
        assert.match(tips[0].innerHTML, new RegExp(card.note_zh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        if (card.chips && card.chips.length) {
          for (const chip of card.chips) {
            const mark = chip.ok ? '✓' : '✕';
            const klass = chip.ok ? 'chip-ok' : 'chip-no';
            assert.match(tips[0].innerHTML, new RegExp('class="chip ' + klass + '">' + mark + ' ' + chip.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
          }
        } else {
          assert.doesNotMatch(tips[0].innerHTML, /class="chip/);
        }
      } else {
        assert.equal(tips.length, 0, card.en);
        assert.doesNotMatch(patterns[0].innerHTML, /note-bulb|class="chip/);
      }
    }
  }
});
