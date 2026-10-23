/**
 * Score, unlock, and badge rules.
 * Run: node --test practice/score.test.js
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'score.js'), 'utf8');

function memoryStorage() {
  const data = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    },
    removeItem(key) {
      delete data[key];
    },
    dump() {
      return data;
    }
  };
}

function loadScore(storage, now) {
  const sandbox = { console, localStorage: storage };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  assert.equal(typeof sandbox.createScore, 'function');
  return sandbox.createScore({ storage, now });
}

function harness(start) {
  const storage = memoryStorage();
  let current = start || new Date(2026, 9, 23, 15, 0, 0);
  const score = loadScore(storage, function () { return new Date(current.getTime()); });
  return {
    storage,
    score,
    setDate(date) { current = date; }
  };
}

function part(result, label) {
  return (result.parts || []).find(function (p) { return p.label === label; });
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('easy correct awards +2 once per word per day and stores the word under today', function () {
  const { score, storage } = harness();
  const first = score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'easy' });
  assert.equal(first.points, 2);
  assert.equal(first.reason, 'easy');
  assert.equal(first.awarded, 2);
  assert.deepEqual(plain(first.parts), [{ label: 'Correct', points: 2 }]);
  assert.equal(score.today(), 2);
  assert.equal(score.total(), 2);
  assert.equal(score.unitScore('unit1'), 2);

  const again = score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'hard' });
  assert.equal(again.points, 0);
  assert.equal(again.reason, 'already');
  assert.equal(again.awarded, 0);
  assert.equal(score.total(), 2);
  assert.equal(score.today(), 2);

  const earned = JSON.parse(storage.getItem('todayEarnedWords'));
  assert.deepEqual(earned['2026-10-23'], ['unit1:adopt']);
  assert.equal(storage.getItem('p6-flash-mastery-v1'), null);
});

test('hard awards +5 and normal awards +2', function () {
  const { score } = harness();
  const hard = score.awardCorrect({ wordKey: 'unit1:flags', unitId: 'unit1', mode: 'hard' });
  assert.equal(hard.points, 5);
  assert.equal(hard.reason, 'hard');
  const normal = score.awardCorrect({ wordKey: 'unit1:fair', unitId: 'unit1', mode: 'normal' });
  assert.equal(normal.points, 2);
  assert.equal(normal.reason, 'easy');
  assert.equal(score.unitScore('unit1'), 7);
});

test('wrong answers add 0, do not remove points, and do not spend the daily word', function () {
  const { score } = harness();
  score.awardCorrect({ wordKey: 'unit1:keep', unitId: 'unit1', mode: 'easy' });
  const wrong = score.awardWrong({ wordKey: 'unit1:donate' });
  assert.equal(wrong.points, 0);
  assert.equal(score.total(), 2);
  assert.deepEqual(plain(score.needsReview('unit1')), ['unit1:donate']);

  const later = score.awardCorrect({ wordKey: 'unit1:donate', unitId: 'unit1', mode: 'hard' });
  assert.equal(later.reason, 'review');
  assert.equal(later.points, 15);
});

test('a needs-review word pays +15 instead of easy or hard points and clears that word', function () {
  const { score } = harness();
  score.awardWrong({ wordKey: 'unit1:a' });
  score.awardWrong({ wordKey: 'unit1:b' });
  const first = score.awardCorrect({ wordKey: 'unit1:a', unitId: 'unit1', mode: 'hard' });
  assert.equal(first.points, 15);
  assert.equal(first.reason, 'review');
  assert.equal(first.awarded, 15);
  assert.equal(part(first, 'Review slayer'), undefined);
  assert.deepEqual(plain(score.needsReview('unit1')), ['unit1:b']);

  const last = score.awardCorrect({ wordKey: 'unit1:b', unitId: 'unit1', mode: 'easy' });
  assert.equal(last.points, 15);
  assert.equal(part(last, 'Review slayer').points, 20);
  assert.equal(last.awarded, 35);
  assert.deepEqual(plain(score.needsReview('unit1')), []);
  assert.equal(score.badges().reviewSlayer.unitId, 'unit1');
  assert.equal(score.unitScore('unit1'), 50);

  score.awardWrong({ wordKey: 'unit2:flood' });
  const other = score.awardCorrect({ wordKey: 'unit2:flood', unitId: 'unit2', mode: 'normal' });
  assert.equal(other.points, 15);
  assert.equal(other.awarded, 15);
  assert.equal(score.badges().reviewSlayer.unitId, 'unit1');
});

test('mastery review flag pays +15 even when the word is not listed yet', function () {
  const { score } = harness();
  const result = score.awardCorrect({
    wordKey: 'unit3:chop',
    unitId: 'unit3',
    mode: 'hard',
    review: true
  });
  assert.equal(result.points, 15);
  assert.equal(result.reason, 'review');
});

test('a correct answer still clears needs-review after the word already earned points today', function () {
  const { score } = harness();
  score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'easy' });
  score.awardWrong({ wordKey: 'unit1:adopt' });
  const again = score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'easy' });
  assert.equal(again.points, 0);
  assert.equal(again.reason, 'already');
  assert.equal(part(again, 'Review slayer').points, 20);
  assert.equal(again.awarded, 20);
  assert.deepEqual(plain(score.needsReview('unit1')), []);
  assert.equal(score.total(), 22);
});

test('a new calendar day resets today score and lets the same word earn again', function () {
  const h = harness(new Date(2026, 9, 23, 9, 0, 0));
  h.score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'easy' });
  h.score.completePractice({ unitId: 'unit1', practice: 'match', mode: 'normal' });
  assert.equal(h.score.today(), 7);
  const total = h.score.total();

  h.setDate(new Date(2026, 9, 24, 9, 0, 0));
  assert.equal(h.score.today(), 0);
  assert.equal(h.score.total(), total);
  const again = h.score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'easy' });
  assert.equal(again.points, 2);
  assert.equal(h.score.today(), 2);
  const earned = JSON.parse(h.storage.getItem('todayEarnedWords'));
  assert.deepEqual(earned['2026-10-23'], ['unit1:adopt']);
  assert.deepEqual(earned['2026-10-24'], ['unit1:adopt']);
});

test('finishing a practice run awards +5 every time and +10 the first time a unit is fully finished', function () {
  const { score } = harness();
  const fill = score.completePractice({ unitId: 'unit1', practice: 'fill', mode: 'easy' });
  assert.equal(part(fill, 'Practice complete').points, 5);
  assert.equal(part(fill, 'Unit finisher'), undefined);
  assert.equal(fill.awarded, 5);

  score.completePractice({ unitId: 'unit1', practice: 'letters', mode: 'easy' });
  const match = score.completePractice({ unitId: 'unit1', practice: 'match', mode: 'normal' });
  assert.equal(part(match, 'Practice complete').points, 5);
  assert.equal(part(match, 'Unit finisher').points, 10);
  assert.equal(match.awarded, 15);
  assert.equal(score.badges().unitFinisher.unitId, 'unit1');
  assert.equal(score.unitScore('unit1'), 25);

  const replay = score.completePractice({ unitId: 'unit1', practice: 'fill', mode: 'easy' });
  assert.equal(part(replay, 'Unit finisher'), undefined);
  assert.equal(replay.awarded, 5);

  score.completePractice({ unitId: 'unit2', practice: 'fill', mode: 'hard' });
  score.completePractice({ unitId: 'unit2', practice: 'letters', mode: 'easy' });
  const second = score.completePractice({ unitId: 'unit2', practice: 'match', mode: 'normal' });
  assert.equal(part(second, 'Unit finisher').points, 10);
  assert.equal(score.badges().unitFinisher.unitId, 'unit1');
  assert.equal(score.badges().hardChallenger.unitId, 'unit2');
  assert.equal(score.unitScore('unit2'), 55);
});

test('hard mode unlocks at 80 unit points or after both easy practices, and never locks again', function () {
  const easy = harness();
  assert.equal(easy.score.isHardUnlocked('unit1'), false);
  easy.score.completePractice({ unitId: 'unit1', practice: 'fill', mode: 'easy' });
  assert.equal(easy.score.isHardUnlocked('unit1'), false);
  easy.score.completePractice({ unitId: 'unit1', practice: 'letters', mode: 'easy' });
  assert.equal(easy.score.isHardUnlocked('unit1'), true);
  assert.equal(JSON.parse(easy.storage.getItem('hardUnlocked')).unit1, true);

  const grind = harness();
  assert.equal(grind.score.isHardUnlocked('unit2'), false);
  for (let i = 0; i < 16; i += 1) {
    grind.score.awardCorrect({ wordKey: 'unit2:w' + i, unitId: 'unit2', mode: 'hard' });
  }
  assert.equal(grind.score.unitScore('unit2'), 80);
  assert.equal(grind.score.isHardUnlocked('unit2'), true);
  assert.equal(grind.score.isHardUnlocked('unit3'), false);
});

test('the first finished hard session awards Hard Challenger +30 once', function () {
  const { score } = harness();
  const first = score.completePractice({ unitId: 'unit1', practice: 'letters', mode: 'hard' });
  assert.equal(part(first, 'Hard challenger').points, 30);
  assert.equal(part(first, 'Practice complete').points, 5);
  assert.equal(first.awarded, 35);
  assert.equal(score.badges().hardChallenger.unitId, 'unit1');
  assert.equal(score.unitScore('unit1'), 35);

  const second = score.completePractice({ unitId: 'unit4', practice: 'fill', mode: 'hard' });
  assert.equal(part(second, 'Hard challenger'), undefined);
  assert.equal(second.awarded, 5);
});

test('units unlock from total score milestones and the score is not spent', function () {
  const { score, storage } = harness();
  assert.equal(score.isUnitUnlocked('unit1'), true);
  assert.equal(score.isUnitUnlocked('unit2'), false);
  assert.equal(score.pointsToUnlock('unit2'), 150);
  assert.equal(score.pointsToUnlock('dictation3'), 600);

  for (let i = 0; i < 75; i += 1) {
    score.awardCorrect({ wordKey: 'unit1:n' + i, unitId: 'unit1', mode: 'easy' });
  }
  assert.equal(score.total(), 150);
  assert.equal(score.isUnitUnlocked('unit2'), true);
  assert.equal(score.isUnitUnlocked('unit3'), false);

  for (let i = 0; i < 225; i += 1) {
    score.awardCorrect({ wordKey: 'unit1:m' + i, unitId: 'unit1', mode: 'easy' });
  }
  assert.equal(score.total(), 600);
  assert.equal(score.isUnitUnlocked('unit3'), true);
  assert.equal(score.isUnitUnlocked('unit4'), true);
  assert.equal(score.isUnitUnlocked('dictation3'), true);
  assert.deepEqual(plain(score.unlocked()), ['unit1', 'unit2', 'unit3', 'unit4', 'dictation3']);
  assert.equal(score.total(), 600);

  storage.setItem('unlockedUnits', '[]');
  assert.equal(score.isUnitUnlocked('unit1'), true);
  assert.ok(JSON.parse(storage.getItem('unlockedUnits')).includes('unit1'));
  assert.ok(JSON.parse(storage.getItem('unlockedUnits')).includes('dictation3'));
});

test('timed score is eligible corrects times 10 plus remaining seconds times 2', function () {
  const { score, storage } = harness();
  score.awardCorrect({ wordKey: 'unit1:a', unitId: 'unit1', mode: 'easy' });
  const run = score.completeTimed({
    unitId: 'unit1',
    correctWordKeys: ['unit1:a', 'unit1:b', 'unit1:b', 'unit1:c'],
    remainingSeconds: 7.9
  });
  assert.equal(part(run, 'Correct').points, 20);
  assert.equal(part(run, 'Time bonus').points, 14);
  assert.equal(run.awarded, 34);
  assert.equal(score.unitScore('unit1'), 36);

  const earned = JSON.parse(storage.getItem('todayEarnedWords'))['2026-10-23'];
  assert.deepEqual(earned, ['unit1:a', 'unit1:b', 'unit1:c']);

  const timeOnly = score.completeTimed({
    unitId: 'unit1',
    correctWordKeys: ['unit1:b'],
    remainingSeconds: 9
  });
  assert.equal(part(timeOnly, 'Correct'), undefined);
  assert.equal(part(timeOnly, 'Time bonus').points, 18);
  assert.equal(timeOnly.awarded, 18);

  const negative = score.completeTimed({
    unitId: 'unit1',
    correctWordKeys: [],
    remainingSeconds: -4
  });
  assert.equal(negative.awarded, 0);
});

test('a timed run of at least 100 awards Timed Ace +15 once', function () {
  const { score } = harness();
  const keys = [];
  for (let i = 0; i < 10; i += 1) keys.push('unit4:t' + i);
  const ace = score.completeTimed({ unitId: 'unit4', correctWordKeys: keys, remainingSeconds: 0 });
  assert.equal(part(ace, 'Correct').points, 100);
  assert.equal(part(ace, 'Timed ace').points, 15);
  assert.equal(ace.awarded, 115);
  assert.equal(score.badges().timedAce.unitId, 'unit4');

  const keys2 = keys.map(function (key) { return key + 'x'; });
  const again = score.completeTimed({ unitId: 'unit4', correctWordKeys: keys2, remainingSeconds: 3 });
  assert.equal(part(again, 'Timed ace'), undefined);
  assert.equal(again.awarded, 106);
});

test('timed corrects clear a unit review list and can award Review Slayer once', function () {
  const { score } = harness();
  score.awardWrong({ wordKey: 'unit1:a' });
  score.awardWrong({ wordKey: 'unit1:b' });
  const run = score.completeTimed({
    unitId: 'unit1',
    correctWordKeys: ['unit1:a', 'unit1:b'],
    remainingSeconds: 0
  });
  assert.equal(part(run, 'Correct').points, 20);
  assert.equal(part(run, 'Review slayer').points, 20);
  assert.equal(run.awarded, 40);
  assert.deepEqual(plain(score.needsReview('unit1')), []);
});

test('points on three consecutive local days award Streak 3 +25 once', function () {
  const h = harness(new Date(2026, 9, 21, 12, 0, 0));
  h.score.awardCorrect({ wordKey: 'unit1:a', unitId: 'unit1', mode: 'easy' });
  h.setDate(new Date(2026, 9, 22, 12, 0, 0));
  h.score.awardCorrect({ wordKey: 'unit1:b', unitId: 'unit1', mode: 'easy' });
  h.setDate(new Date(2026, 9, 23, 12, 0, 0));
  const third = h.score.awardCorrect({ wordKey: 'unit1:c', unitId: 'unit1', mode: 'easy' });
  assert.equal(part(third, 'Streak 3').points, 25);
  assert.equal(third.awarded, 27);
  assert.equal(h.score.today(), 27);
  assert.equal(h.score.badges().streak3.earnedAt, '2026-10-23');
  assert.equal(h.score.unitScore('unit1'), 6);

  h.setDate(new Date(2026, 9, 24, 12, 0, 0));
  const fourth = h.score.awardCorrect({ wordKey: 'unit1:d', unitId: 'unit1', mode: 'easy' });
  assert.equal(part(fourth, 'Streak 3'), undefined);
  assert.equal(fourth.awarded, 2);
});

test('a gap in the calendar does not count as a streak until three days are consecutive', function () {
  const h = harness(new Date(2026, 9, 30, 8, 0, 0));
  h.score.awardCorrect({ wordKey: 'unit1:a', unitId: 'unit1', mode: 'easy' });
  h.setDate(new Date(2026, 10, 1, 8, 0, 0));
  const skipped = h.score.awardCorrect({ wordKey: 'unit1:b', unitId: 'unit1', mode: 'easy' });
  assert.equal(part(skipped, 'Streak 3'), undefined);
  h.setDate(new Date(2026, 10, 2, 8, 0, 0));
  const third = h.score.awardCorrect({ wordKey: 'unit1:c', unitId: 'unit1', mode: 'easy' });
  assert.equal(part(third, 'Streak 3'), undefined);

  const boundary = harness(new Date(2026, 9, 30, 8, 0, 0));
  boundary.score.completePractice({ unitId: 'unit1', practice: 'match', mode: 'normal' });
  boundary.setDate(new Date(2026, 9, 31, 8, 0, 0));
  boundary.score.completePractice({ unitId: 'unit1', practice: 'match', mode: 'normal' });
  boundary.setDate(new Date(2026, 10, 1, 8, 0, 0));
  const crossed = boundary.score.completePractice({ unitId: 'unit1', practice: 'match', mode: 'normal' });
  assert.equal(part(crossed, 'Streak 3').points, 25);
  assert.equal(boundary.score.badges().streak3.earnedAt, '2026-11-01');
});

test('preview, ledger, and toast text match the session summary', function () {
  const { score } = harness();
  score.awardWrong({ wordKey: 'unit1:review' });
  const ledger = score.ledger();
  ledger.add(score.awardCorrect({ wordKey: 'unit1:easy', unitId: 'unit1', mode: 'easy' }));
  ledger.add(score.awardCorrect({ wordKey: 'unit1:review', unitId: 'unit1', mode: 'easy' }));
  ledger.add(score.completePractice({ unitId: 'unit1', practice: 'fill', mode: 'easy' }));
  assert.equal(ledger.points(), 42);
  assert.equal(ledger.detail(), 'Correct +2 · Review bonus +15 · Review slayer +20 · Practice complete +5');
  assert.equal(score.formatTotals(42, 42), 'Today: 42 · Total: 42');
  assert.equal(score.formatCorrectToast({ points: 5, reason: 'hard', parts: [{ label: 'Correct', points: 5 }] }, 'Nice!'), 'Nice! +5');
  assert.equal(score.formatCorrectToast({ points: 0, reason: 'already', parts: [] }, 'Nice!'), 'Already earned today');
  assert.equal(score.previewTimedCorrect({
    wordKey: 'unit1:easy',
    sessionKeys: []
  }).reason, 'already');
  assert.equal(score.previewTimedCorrect({
    wordKey: 'unit1:fresh',
    sessionKeys: ['unit1:fresh']
  }).points, 0);
  assert.equal(score.previewTimedCorrect({
    wordKey: 'unit1:fresh',
    sessionKeys: []
  }).points, 10);
  assert.equal(score.formatEarnedDate('2026-10-23'), '23 Oct 2026');
});

test('opening the score on a new day rewrites todayScore without touching totalScore', function () {
  const h = harness(new Date(2026, 9, 23, 18, 0, 0));
  h.score.awardCorrect({ wordKey: 'unit1:adopt', unitId: 'unit1', mode: 'easy' });
  const stored = JSON.parse(h.storage.getItem('todayScore'));
  assert.equal(stored.date, '2026-10-23');
  assert.equal(stored.points, 2);
  h.setDate(new Date(2026, 9, 25, 8, 0, 0));
  assert.equal(h.score.today(), 0);
  assert.deepEqual(JSON.parse(h.storage.getItem('todayScore')), { date: '2026-10-25', points: 0 });
  assert.equal(h.storage.getItem('totalScore'), '2');
});
