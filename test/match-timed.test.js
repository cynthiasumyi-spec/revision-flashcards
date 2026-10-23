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

test('correct and wrong feedback uses the irasutoya cats', () => {
  const root = path.join(__dirname, '..');
  ['feedback-ok.png', 'feedback-bad.png'].forEach(name => {
    const file = path.join(root, 'practice/icons', name);
    const buf = fs.readFileSync(file);
    assert.ok(buf.length > 1000);
    assert.equal(buf[0], 0x89);
    assert.equal(buf[1], 0x50);
    assert.equal(buf[2], 0x4e);
    assert.equal(buf[3], 0x47);
  });
  const pages = ['practice/fill.html', 'practice/letters.html', 'practice/timed.html', 'practice/common.js'];
  const joined = pages.map(rel => fs.readFileSync(path.join(root, rel), 'utf8')).join('\n');
  assert.match(joined, /icons\/feedback-ok\.png/);
  assert.match(joined, /icons\/feedback-bad\.png/);
  assert.equal(joined.includes('太棒了'), false);
  assert.equal(joined.includes('好棒'), false);
});

test('timed page has no penalty control', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'practice/timed.html'), 'utf8');
  assert.equal(/time penalty/i.test(html), false);
  assert.equal(html.includes('- 3'), false);
  assert.equal(html.includes('−3'), false);
  assert.match(html, /do not take time away/i);
});
