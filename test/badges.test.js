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

test('review progress rises with each finished practice, not with mastered words', () => {
  const { window } = setup();
  assert.equal(window.Badges.practiceProgress('unit1'), 0);
  window.Badges.recordSession('unit1', 'fill', 'easy');
  assert.equal(window.Badges.practiceProgress('unit1'), 17);
  window.Badges.recordSession('unit1', 'fill', 'easy');
  assert.equal(window.Badges.practiceProgress('unit1'), 17);
  window.Badges.recordSession('unit1', 'letters', 'hard');
  window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.practiceProgress('unit1'), 50);
  window.Badges.recordSession('unit1', 'fill', 'hard');
  window.Badges.recordSession('unit1', 'letters', 'easy');
  window.Badges.recordSession('unit1', 'timed');
  assert.equal(window.Badges.practiceProgress('unit1'), 100);
  assert.equal(window.Badges.practiceProgress('unit2'), 0);
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
  assert.equal(window.Badges.hardUnlocked('unit1', 'fill'), false);
  assert.equal(window.Badges.hardUnlocked('unit1', 'letters'), true);
});

test('unit 1 and dictation 3 are open and later units wait for the previous core', () => {
  const { window } = setup();
  assert.equal(window.Badges.unitUnlocked('unit1'), true);
  assert.equal(window.Badges.unitUnlocked('dictation3'), true);
  assert.equal(window.Badges.lockReason('dictation3'), '');
  assert.equal(window.Badges.unitUnlocked('unit2'), false);
  window.Badges.recordSession('unit1', 'fill', 'easy');
  window.Badges.recordSession('unit1', 'letters', 'easy');
  window.Badges.recordSession('unit1', 'match');
  assert.equal(window.Badges.unitUnlocked('unit2'), true);
  assert.equal(window.Badges.unitUnlocked('unit3'), false);
  assert.equal(window.Badges.unitUnlocked('dictation3'), true);
});

test('units 2 to 4 stay gated and dictation 3 stays open', () => {
  const { window } = setup();
  assert.equal(window.Badges.unitUnlocked('dictation3'), true);
  assert.equal(window.Badges.unitUnlocked('unit4'), false);
  ['unit1', 'unit2'].forEach(id => {
    window.Badges.recordSession(id, 'fill', 'easy');
    window.Badges.recordSession(id, 'letters', 'easy');
    window.Badges.recordSession(id, 'match');
  });
  assert.equal(window.Badges.unitUnlocked('unit3'), true);
  assert.equal(window.Badges.unitUnlocked('unit4'), false);
  assert.equal(window.Badges.unitUnlocked('dictation3'), true);
  window.Badges.recordSession('unit3', 'fill', 'easy');
  window.Badges.recordSession('unit3', 'letters', 'easy');
  window.Badges.recordSession('unit3', 'match');
  assert.equal(window.Badges.unitUnlocked('unit4'), true);
  assert.equal(window.Badges.unitUnlocked('dictation3'), true);
});

test('easy unlocks hard for that same practice only', () => {
  const { window } = setup();
  assert.equal(window.Badges.hardUnlocked('unit1', 'fill'), false);
  assert.equal(window.Badges.hardUnlocked('unit1', 'letters'), false);
  assert.equal(window.Badges.hardUnlocked('unit1', 'match'), false);
  window.Badges.recordSession('unit1', 'fill', 'easy');
  assert.equal(window.Badges.hardUnlocked('unit1', 'fill'), true);
  assert.equal(window.Badges.hardUnlocked('unit1', 'letters'), false);
  assert.equal(window.Badges.hardUnlocked('unit1', 'match'), false);
  window.Badges.recordSession('unit1', 'letters', 'easy');
  assert.equal(window.Badges.hardUnlocked('unit1', 'letters'), true);
  assert.equal(window.Badges.hardUnlocked('unit2', 'letters'), false);
  window.Badges.recordSession('unit2', 'letters', 'easy');
  assert.equal(window.Badges.hardUnlocked('unit2', 'letters'), true);
  assert.equal(window.Badges.hardUnlocked('unit2', 'fill'), false);
});

test('phrase speller needs Missing Letters Easy at 100% for units 1 to 4', () => {
  const { window, localStorage } = setup();
  ['unit1', 'unit2', 'unit3'].forEach(id => {
    window.Badges.recordSession(id, 'letters', 'easy', { correct: 10, total: 10 });
  });
  window.Badges.recordSession('unit4', 'letters', 'easy', { correct: 9, total: 10 });
  assert.equal(window.Badges.isEarned('letters-phrase'), false);
  window.Badges.recordSession('dictation3', 'letters', 'easy', { correct: 10, total: 10 });
  assert.equal(window.Badges.isEarned('letters-phrase'), false);
  window.Badges.recordSession('unit4', 'letters', 'easy', { correct: 8, total: 8 });
  assert.equal(window.Badges.isEarned('letters-phrase'), true);
  const saved = JSON.parse(localStorage.getItem(window.Badges.KEY));
  assert.equal(saved.units.unit4.lettersEasyBest, 1);
  assert.ok(saved.units.unit4.lettersEasyBest > 0.9);
});

test('an earlier imperfect letters session can be upgraded', () => {
  const { window, localStorage } = setup();
  window.Badges.recordSession('unit1', 'letters', 'easy', { correct: 5, total: 10 });
  let saved = JSON.parse(localStorage.getItem(window.Badges.KEY));
  assert.equal(saved.units.unit1.lettersEasy, true);
  assert.ok(saved.units.unit1.lettersEasyBest < 1);
  window.Badges.recordSession('unit1', 'letters', 'easy', { correct: 4, total: 10 });
  saved = JSON.parse(localStorage.getItem(window.Badges.KEY));
  assert.equal(saved.units.unit1.lettersEasyBest, 0.5);
});

test('match master and timed hero need units 1 to 4, not dictation 3', () => {
  const { window } = setup();
  ['unit1', 'unit2', 'unit3'].forEach(id => window.Badges.recordSession(id, 'match'));
  window.Badges.recordSession('dictation3', 'match');
  assert.equal(window.Badges.isEarned('match-pro'), false);
  window.Badges.recordSession('unit4', 'match');
  assert.equal(window.Badges.isEarned('match-pro'), true);
  ['unit1', 'unit2', 'unit3'].forEach(id => window.Badges.recordSession(id, 'timed', null, { correct: 3, total: 5 }));
  assert.equal(window.Badges.isEarned('timed-brave'), false);
  window.Badges.recordSession('unit4', 'timed', null, { correct: 1, total: 4 });
  assert.equal(window.Badges.isEarned('timed-brave'), true);
});

test('hard challenger needs fill hard and letters hard at 90% for units 1 to 4', () => {
  const { window } = setup();
  const units = ['unit1', 'unit2', 'unit3', 'unit4'];
  units.forEach(id => {
    window.Badges.recordSession(id, 'fill', 'hard', { correct: 9, total: 10 });
    window.Badges.recordSession(id, 'letters', 'hard', { correct: 9, total: 10 });
  });
  window.Badges.recordSession('unit4', 'letters', 'hard', { correct: 8, total: 10 });
  assert.equal(window.Badges.isEarned('hard-challenger'), true);
  const fresh = setup();
  ['unit1', 'unit2', 'unit3'].forEach(id => {
    fresh.window.Badges.recordSession(id, 'fill', 'hard', { correct: 9, total: 10 });
    fresh.window.Badges.recordSession(id, 'letters', 'hard', { correct: 9, total: 10 });
  });
  fresh.window.Badges.recordSession('unit4', 'fill', 'hard', { correct: 9, total: 10 });
  fresh.window.Badges.recordSession('unit4', 'letters', 'hard', { correct: 89, total: 100 });
  assert.equal(fresh.window.Badges.isEarned('hard-challenger'), false);
  fresh.window.Badges.recordSession('unit4', 'letters', 'hard', { correct: 90, total: 100 });
  assert.equal(fresh.window.Badges.isEarned('hard-challenger'), true);
  fresh.window.Badges.recordSession('dictation3', 'fill', 'hard', { correct: 1, total: 10 });
  assert.equal(fresh.window.Badges.isEarned('unit-done:dictation3'), false);
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
  assert.equal(ids.includes('review-clear'), false);
  assert.equal(ids.some(id => /streak|連續/.test(id)), false);
  const titles = window.Badges.catalog().map(b => b.title);
  assert.ok(titles.includes('起步新手'));
  assert.ok(titles.includes('詞組拼寫手'));
  assert.ok(titles.includes('配對高手'));
  assert.ok(titles.includes('限時勇者'));
  assert.ok(titles.includes('Hard 挑戰者'));
  assert.equal(titles.includes('錯題殺手'), false);
  assert.ok(titles.includes('Unit 完成者'));
  const english = {
    starter: 'First Steps',
    'letters-phrase': 'Phrase Speller',
    'match-pro': 'Match Master',
    'timed-brave': 'Timed Hero',
    'hard-challenger': 'Hard Challenger'
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

test('mastery still tracks review words without awarding a badge', () => {
  const { window } = setup();
  const M = window.Mastery;
  M.markWrong('unit2:flood');
  assert.equal(M.get('unit2:flood').state, 'review');
  M.markCorrect('unit2:flood');
  M.markCorrect('unit2:flood');
  M.markCorrect('unit2:flood');
  assert.equal(M.get('unit2:flood').state, 'mastered');
  assert.equal(window.Badges.catalog().some(b => b.id === 'review-clear'), false);
});
