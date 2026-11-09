const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

function page(unit) {
  const html = fs.readFileSync(path.join(root, unit, 'index.html'), 'utf8');
  const match = html.match(/const CARDS = (\[.*?\]);/s);
  assert.ok(match, unit + ' defines CARDS');
  const words = html.match(/const WORDS_MAX = (\d+);/);
  return { html, cards: JSON.parse(match[1]), wordsMax: words ? Number(words[1]) : null };
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

function showSyllableLine(html, wordsMax) {
  const start = html.indexOf('function showSyllableLine');
  const end = html.indexOf('function esc');
  assert.ok(start >= 0 && end > start, 'showSyllableLine is defined');
  return new Function('WORDS_MAX', html.slice(start, end) + '\nreturn showSyllableLine;')(wordsMax);
}

test('grammar cards keep an empty syllable field and the section never prints one', () => {
  const units = [
    { id: 'unit1', wordsMax: 10, word: 'adopt a pet', wordSyllables: 'a-dopt a pet', plain: 'buy/sell flags' },
    { id: 'unit2', wordsMax: 10, word: 'an earthquake', wordSyllables: 'an earth-quake', plain: 'a drought' },
    { id: 'unit3', wordsMax: 12, word: 'sprinkle', wordSyllables: 'sprin-kle', plain: 'beat' },
    { id: 'unit4', wordsMax: 14, word: 'cruel', wordSyllables: 'cru-el', plain: 'wise' },
    { id: 'unit5', wordsMax: 16, word: 'go snowboarding', wordSyllables: 'go snow-board-ing', plain: 'go on a guided tour' },
    { id: 'unit6', wordsMax: 19, word: 'China', wordSyllables: 'Chi-na', plain: 'a kilt' }
  ];
  for (const spec of units) {
    const { html, cards, wordsMax } = page(spec.id);
    assert.equal(wordsMax, spec.wordsMax);
    assert.match(html, /if \(card\.n > WORDS_MAX\) return false;/);
    assert.match(html, /showSyllableLine\(card\) \? '<p class="syllables is-break">'/);
    const show = showSyllableLine(html, wordsMax);
    const grammar = cards.filter((card) => card.n > wordsMax);
    assert.ok(grammar.length > 0, spec.id);
    for (const card of cards) {
      if (card.n <= wordsMax) {
        assert.notEqual(card.syllables, '', card.en);
        assert.ok(samePhrase(card.en, card.syllables), spec.id + ' ' + card.en + ' / ' + card.syllables);
        continue;
      }
      assert.equal(card.syllables, '', card.en);
      assert.equal(show(card), false, card.en);
      assert.equal(show(Object.assign({}, card, { syllables: 'hy-phen' })), false, card.en);
      const line = show(card) ? '<p class="syllables is-break">' + card.syllables + '</p>' : '';
      assert.equal(line, '', card.en);
    }
    const word = cards.find((card) => card.en === spec.word);
    assert.equal(word.syllables, spec.wordSyllables);
    assert.equal(show(word), true);
    assert.equal(show(cards.find((card) => card.en === spec.plain)), false);
  }
});

test('units 1-4 grammar sections use the same teach shell as units 5-6', () => {
  for (const unit of ['unit1', 'unit2', 'unit3', 'unit4']) {
    const { html, wordsMax } = page(unit);
    assert.ok(wordsMax > 0, unit);
    assert.match(html, /Grammar in use/);
    assert.match(html, /data-section="grammar"/);
    assert.match(html, /appendTeach\(article, card\)/);
    assert.match(html, /unit\.css\?v=19/);
    assert.match(html, /no-illust/);
  }
});

test('watch packs drop syllables on the same grammar cards and still show word syllables', () => {
  const src = fs.readFileSync(path.join(root, 'watch/packs.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  const watchHtml = fs.readFileSync(path.join(root, 'watch/index.html'), 'utf8');
  assert.match(watchHtml, /packs\.js\?v=3/);
  assert.match(watchHtml, /sylEl\.hidden = !c\.syllables/);
  assert.match(watchHtml, /imgEl\.parentElement\.hidden = true/);
  const limits = { unit1: 10, unit2: 10, unit3: 12, unit4: 14, unit5: 16, unit6: 19 };
  for (const [id, wordsMax] of Object.entries(limits)) {
    for (const card of sandbox.window.WATCH_PACKS[id].cards) {
      if (card.n > wordsMax) {
        assert.equal(card.syllables, '', id + ' ' + card.en);
      } else {
        assert.notEqual(card.syllables, '', card.en);
        assert.ok(samePhrase(card.en, card.syllables), id + ' ' + card.en);
      }
    }
  }
  assert.equal(sandbox.window.WATCH_PACKS.unit5.cards.find((card) => card.n === 1).syllables, 'go snow-board-ing');
  assert.equal(sandbox.window.WATCH_PACKS.unit6.cards.find((card) => card.n === 1).syllables, 'Chi-na');
  assert.equal(sandbox.window.WATCH_PACKS.unit1.cards[0].syllables, 'a-dopt a pet');
});
