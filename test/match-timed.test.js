const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts } = require('./helpers');

test('each match round is exactly 3 pairs and 6 cards', () => {
  const { window } = loadScripts(['practice/match-logic.js']);
  const pairs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({ id: 'p' + n }));
  const picked = window.MatchLogic.pickPairs(pairs, arr => arr.slice());
  assert.equal(picked.length, 3);
  assert.equal(window.MatchLogic.cardCount(picked), 6);
  assert.equal(window.MatchLogic.ROUND_PAIRS, 3);
});

test('a face-up card stays up, and a miss flips both down together', () => {
  const { window } = loadScripts(['practice/match-logic.js']);
  const open = window.MatchLogic.judge(
    { pairId: 'a', side: 'en' },
    null
  );
  assert.equal(open.firstStaysFaceUp, true);
  assert.equal(open.flipBothDown, false);

  const miss = window.MatchLogic.judge(
    { pairId: 'a', side: 'en' },
    { pairId: 'b', side: 'zh' }
  );
  assert.equal(miss.matched, false);
  assert.equal(miss.flipBothDown, true);
  assert.equal(miss.matchedStayFaceUp, false);

  const hit = window.MatchLogic.judge(
    { pairId: 'a', side: 'en' },
    { pairId: 'a', side: 'zh' }
  );
  assert.equal(hit.matched, true);
  assert.equal(hit.flipBothDown, false);
  assert.equal(hit.matchedStayFaceUp, true);
});

test('same side of one pair is not a match', () => {
  const { window } = loadScripts(['practice/match-logic.js']);
  const same = window.MatchLogic.judge(
    { pairId: 'a', side: 'en' },
    { pairId: 'a', side: 'en' }
  );
  assert.equal(same.matched, false);
  assert.equal(same.flipBothDown, true);
});

test('timed answers never subtract seconds', () => {
  const { window } = loadScripts(['practice/timed-logic.js']);
  assert.equal(window.TimedLogic.TIME_PENALTY_SECONDS, 0);
  assert.equal(window.TimedLogic.nextRemaining(60, false), 60);
  assert.equal(window.TimedLogic.nextRemaining(9, false), 9);
  assert.equal(window.TimedLogic.nextRemaining(40, true), 40);
});

test('timed page has no penalty control', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'practice/timed.html'), 'utf8');
  assert.equal(/time penalty/i.test(html), false);
  assert.equal(html.includes('- 3'), false);
  assert.equal(html.includes('−3'), false);
  assert.match(html, /do not take time away/i);
});
