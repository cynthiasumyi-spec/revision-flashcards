const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, loadPacks } = require('./helpers');

test('easy and hard masks keep spaces and punctuation', () => {
  const { window } = loadScripts(['practice/common.js']);
  const phrase = 'buy/sell raffle tickets';
  const easy = window.PracticeCommon.maskPhrase(phrase, 'easy');
  const hard = window.PracticeCommon.maskPhrase(phrase, 'hard', arr => arr.slice());
  [easy, hard].forEach(mask => {
    assert.equal(mask.length, phrase.length);
    for (let i = 0; i < phrase.length; i++) {
      const ch = phrase[i];
      if (!/[a-zA-Z]/.test(ch)) assert.equal(mask[i], ch);
      else assert.ok(mask[i] === ch || mask[i] === '_');
    }
    assert.ok(mask.includes('_'));
    assert.ok(mask.includes('/'));
    assert.ok(mask.includes(' '));
  });
  const slots = window.PracticeCommon.patternToSlots(phrase, easy);
  const shown = slots.filter(s => s.type === 'show').map(s => s.char).join('');
  assert.ok(shown.includes('/'));
  assert.ok(shown.includes(' '));
});

test('missing letters use each unit phrase, not a single keyword', () => {
  const { window } = loadPacks();
  const packs = [
    window.PRACTICE_UNIT1,
    window.PRACTICE_UNIT2,
    window.PRACTICE_UNIT3,
    window.PRACTICE_UNIT4,
    window.PRACTICE_DICTATION3
  ];
  packs.forEach(pack => {
    assert.equal(pack.missingLetters.length, pack.words.length);
    pack.missingLetters.forEach(item => {
      const word = pack.words.find(w => w.key === item.wordKey);
      assert.ok(word, item.wordKey);
      assert.equal(item.word, word.en);
      assert.ok(item.audio);
    });
  });
  const raffle = window.PRACTICE_UNIT1.missingLetters.find(i => i.wordKey === 'unit1:raffle');
  assert.equal(raffle.word, 'buy/sell raffle tickets');
  const adopt = window.PRACTICE_UNIT1.missingLetters.find(i => i.wordKey === 'unit1:adopt');
  assert.equal(adopt.word, 'adopt a pet');
  const walk = window.PRACTICE_UNIT1.missingLetters.find(i => i.wordKey === 'unit1:walkathon');
  assert.equal(walk.word, 'go on a walkathon');
});
