const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers');

function setup() {
  return loadScripts(['practice/badges.js', 'practice/mastery.js']);
}

test('storage has no score fields', () => {
  const { window, localStorage } = setup();
  window.Badges.recordSession('unit1', 'fill', 'easy');
  const raw = localStorage.getItem(window.Badges.KEY);
  assert.ok(raw);
  assert.equal(raw.includes('totalScore'), false);
  assert.equal(raw.includes('todayScore'), false);
  assert.equal(raw.includes('unitScores'), false);
  const data = JSON.parse(raw);
  assert.equal(Object.prototype.hasOwnProperty.call(data, 'totalScore'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(data, 'todayScore'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(data, 'unitScores'), false);
});

test('起步新手 unlocks after any one finished session', () => {
  const { window } = setup();
  assert.equal(window.Badges.isEarned('starter'), false);
  const result = window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.isEarned('starter'), true);
  assert.equal(result.newBadges.some(b => b.id === 'starter'), true);
  assert.equal(typeof window.Badges.getEarned('starter').earnedAt, 'number');
});

test('earn date stays on a second completion', () => {
  const { window } = setup();
  window.Badges.recordSession('unit1', 'timed');
  const first = window.Badges.getEarned('starter').earnedAt;
  window.Badges.recordSession('unit1', 'timed');
  assert.equal(window.Badges.getEarned('starter').earnedAt, first);
});

test('unit completer needs fill, letters, and match', () => {
  const { window } = setup();
  window.Badges.recordSession('unit1', 'fill', 'easy');
  window.Badges.recordSession('unit1', 'letters', 'hard');
  assert.equal(window.Badges.isEarned('unit-done:unit1'), false);
  window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.isEarned('unit-done:unit1'), true);
  assert.equal(window.Badges.coreComplete('unit1'), true);
});

test('hard fill counts as the fill core, not as easy', () => {
  const { window } = setup();
  window.Badges.recordSession('unit1', 'fill', 'hard');
  window.Badges.recordSession('unit1', 'letters', 'easy');
  window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.coreComplete('unit1'), true);
  assert.equal(window.Badges.hardUnlocked('unit1'), false);
});

test('unit 1 is open and later units wait for the previous core', () => {
  const { window } = setup();
  assert.equal(window.Badges.unitUnlocked('unit1'), true);
  assert.equal(window.Badges.unitUnlocked('unit2'), false);
  assert.equal(window.Badges.unitUnlocked('dictation3'), false);
  window.Badges.recordSession('unit1', 'fill', 'easy');
  window.Badges.recordSession('unit1', 'letters', 'easy');
  window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.unitUnlocked('unit2'), true);
  assert.equal(window.Badges.unitUnlocked('unit3'), false);
});

test('dictation 3 opens only after unit 4 core', () => {
  const { window } = setup();
  ['unit1', 'unit2', 'unit3'].forEach(id => {
    window.Badges.recordSession(id, 'fill', 'easy');
    window.Badges.recordSession(id, 'letters', 'easy');
    window.Badges.recordSession(id, 'match');
  });
  assert.equal(window.Badges.unitUnlocked('unit4'), true);
  assert.equal(window.Badges.unitUnlocked('dictation3'), false);
  window.Badges.recordSession('unit4', 'fill', 'hard');
  window.Badges.recordSession('unit4', 'letters', 'easy');
  window.Badges.recordSession('unit4', 'match');
  assert.equal(window.Badges.unitUnlocked('dictation3'), true);
});

test('hard mode waits for easy fill and easy letters', () => {
  const { window } = setup();
  assert.equal(window.Badges.hardUnlocked('unit1'), false);
  window.Badges.recordSession('unit1', 'fill', 'easy');
  assert.equal(window.Badges.hardUnlocked('unit1'), false);
  window.Badges.recordSession('unit1', 'letters', 'easy');
  assert.equal(window.Badges.hardUnlocked('unit1'), true);
});

test('phrase, match, timed, and hard badges unlock once', () => {
  const { window } = setup();
  window.Badges.recordSession('unit2', 'letters', 'easy');
  assert.equal(window.Badges.isEarned('letters-phrase'), true);
  window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.isEarned('match-pro'), true);
  window.Badges.recordSession('unit1', 'timed');
  assert.equal(window.Badges.isEarned('timed-brave'), true);
  assert.equal(window.Badges.isEarned('hard-challenger'), false);
  window.Badges.recordSession('unit3', 'letters', 'hard');
  assert.equal(window.Badges.isEarned('hard-challenger'), true);
});

test('hard fill also unlocks the hard challenger badge', () => {
  const { window } = setup();
  window.Badges.recordSession('unit4', 'fill', 'hard');
  assert.equal(window.Badges.isEarned('hard-challenger'), true);
});

test('錯題殺手 only after missed words in one unit are cleared', () => {
  const { window } = setup();
  window.Badges.noteReview('unit1', []);
  assert.equal(window.Badges.isEarned('review-clear'), false);
  window.Badges.noteReview('unit1', [{ state: 'review', wrong: 1 }]);
  assert.equal(window.Badges.isEarned('review-clear'), false);
  window.Badges.noteReview('unit1', [
    { state: 'mastered', wrong: 1 },
    { state: 'review', wrong: 2 }
  ]);
  assert.equal(window.Badges.isEarned('review-clear'), false);
  window.Badges.noteReview('unit1', [
    { state: 'mastered', wrong: 1 },
    { state: 'mastered', wrong: 2 }
  ]);
  assert.equal(window.Badges.isEarned('review-clear'), true);
});

test('a correct streak that never missed a word does not award 錯題殺手', () => {
  const { window } = setup();
  window.Badges.noteReview('unit1', [{ state: 'review', wrong: 0 }]);
  window.Badges.noteReview('unit1', [{ state: 'mastered', wrong: 0 }]);
  assert.equal(window.Badges.isEarned('review-clear'), false);
});

test('catalog lists five unit badges and no streak badge', () => {
  const { window } = setup();
  const ids = window.Badges.catalog().map(b => b.id);
  assert.equal(ids.filter(id => id.indexOf('unit-done:') === 0).length, 5);
  assert.ok(ids.includes('starter'));
  assert.ok(ids.includes('letters-phrase'));
  assert.ok(ids.includes('match-pro'));
  assert.ok(ids.includes('timed-brave'));
  assert.ok(ids.includes('hard-challenger'));
  assert.ok(ids.includes('review-clear'));
  assert.equal(ids.some(id => /streak|連續/.test(id)), false);
  const titles = window.Badges.catalog().map(b => b.title);
  assert.ok(titles.includes('起步新手'));
  assert.ok(titles.includes('詞組拼寫手'));
  assert.ok(titles.includes('配對高手'));
  assert.ok(titles.includes('限時勇者'));
  assert.ok(titles.includes('Hard 挑戰者'));
  assert.ok(titles.includes('錯題殺手'));
  assert.ok(titles.includes('Unit 完成者'));
  const english = {
    starter: 'First Steps',
    'letters-phrase': 'Phrase Speller',
    'match-pro': 'Match Master',
    'timed-brave': 'Timed Hero',
    'hard-challenger': 'Hard Challenger',
    'review-clear': 'Review Slayer'
  };
  window.Badges.catalog().forEach(b => {
    assert.equal(typeof b.english, 'string');
    assert.match(b.english, /[A-Za-z]/);
    assert.match(b.image, /^assets\/badges\/[a-z0-9-]+\.png$/);
    if (english[b.id]) assert.equal(b.english, english[b.id]);
    if (b.id.indexOf('unit-done:') === 0) {
      assert.equal(b.english, 'Unit Completer');
      assert.match(b.image, /^assets\/badges\/unit-completer-[a-z0-9]+\.png$/);
    }
  });
  const unitImages = window.Badges.catalog()
    .filter(b => b.id.indexOf('unit-done:') === 0)
    .map(b => b.image);
  assert.equal(new Set(unitImages).size, 5);
});

test('a newly earned badge carries its English title and medal path', () => {
  const { window } = setup();
  const result = window.Badges.recordSession('unit1', 'fill', 'easy');
  const starter = result.newBadges.find(b => b.id === 'starter');
  assert.equal(starter.title, '起步新手');
  assert.equal(starter.english, 'First Steps');
  assert.equal(starter.image, 'assets/badges/first-steps.png');
  const listed = window.Badges.listWithStatus().find(b => b.id === 'starter');
  assert.equal(listed.earned, true);
  assert.equal(listed.english, 'First Steps');
  const locked = window.Badges.listWithStatus().find(b => b.id === 'match-pro');
  assert.equal(locked.earned, false);
  assert.equal(locked.english, 'Match Master');
  assert.equal(locked.image, 'assets/badges/match-master.png');
  const fs = require('fs');
  const path = require('path');
  window.Badges.catalog().forEach(b => {
    const color = path.join(__dirname, '..', b.image);
    const gray = color.replace(/\.png$/, '-locked.png');
    assert.equal(fs.existsSync(color), true);
    assert.equal(fs.existsSync(gray), true);
  });
});

test('mastery wrong then three corrects clears 需要重溫 for that unit', () => {
  const { window } = setup();
  const M = window.Mastery;
  M.markWrong('unit2:flood');
  assert.equal(window.Badges.isEarned('review-clear'), false);
  M.markCorrect('unit2:flood');
  M.markCorrect('unit2:flood');
  M.markCorrect('unit2:flood');
  assert.equal(M.get('unit2:flood').state, 'mastered');
  assert.equal(window.Badges.isEarned('review-clear'), true);
});
