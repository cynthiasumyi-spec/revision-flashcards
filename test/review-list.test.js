const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadScripts } = require('./helpers');

const root = path.join(__dirname, '..');

function setup() {
  return loadScripts([
    'practice/data/unit1.js',
    'practice/data/unit2.js',
    'practice/data/unit3.js',
    'practice/data/unit4.js',
    'practice/data/dictation3.js',
    'practice/data/registry.js',
    'practice/mastery.js',
    'practice/badges.js',
    'assets/review-list.js'
  ]);
}

test('needs review lists only words in the review state, grouped by unit', () => {
  const { window } = setup();
  const M = window.Mastery;
  const R = window.PracticeRegistry;
  M.markWrong('unit1:adopt');
  M.markCorrect('unit1:donate');
  M.markCorrect('unit1:donate');
  M.markCorrect('unit1:donate');
  M.markWrong('unit2:earthquake');
  const groups = window.ReviewList.groups(R, M, {
    practicePage: 'practice/letters.html',
    cardPrefix: ''
  });
  const unit1 = groups.find(g => g.id === 'unit1');
  const unit2 = groups.find(g => g.id === 'unit2');
  assert.ok(unit1);
  assert.equal([...unit1.words].map(w => w.key).join(','), 'unit1:adopt');
  assert.equal(unit1.words[0].en, 'adopt a pet');
  assert.equal(unit1.words[0].zh, '領養寵物');
  assert.match(unit1.words[0].href, /practice\/letters\.html\?unit=unit1&focus=unit1%3Aadopt/);
  assert.equal(groups.some(g => g.words.some(w => w.key === 'unit1:donate')), false);
  const quakeIndex = R.getUnit('unit2').words.findIndex(w => w.key === 'unit2:earthquake');
  assert.equal(unit2.words[0].href, 'unit2/index.html#c' + (quakeIndex + 1));
  assert.equal(unit2.words[0].zh.length > 0, true);
});

test('an empty mastery store has no review groups', () => {
  const { window } = setup();
  assert.equal(window.ReviewList.groups(window.PracticeRegistry, window.Mastery).length, 0);
});

test('every badge states exactly how to unlock it', () => {
  const { window } = setup();
  const byId = {};
  window.Badges.catalog().forEach(b => { byId[b.id] = b.detail; });
  assert.equal(byId.starter, 'Finish any one practice session.');
  assert.equal(byId['letters-phrase'], 'Finish Missing Letters for one unit.');
  assert.equal(byId['match-pro'], 'Finish one Memory Match (six cards).');
  assert.equal(byId['timed-brave'], 'Finish one Timed Challenge.');
  assert.equal(byId['hard-challenger'], 'Finish Hard Sentence Fill or Hard Missing Letters for one unit.');
  assert.equal(byId['review-clear'], 'Clear every 需要重溫 word in one unit.');
  ['unit1', 'unit2', 'unit3', 'unit4', 'dictation3'].forEach(id => {
    const label = id === 'dictation3' ? 'Dictation 3' : ('Unit ' + id.slice(-1));
    assert.equal(
      byId['unit-done:' + id],
      'Finish Sentence Fill, Missing Letters, and Memory Match for ' + label + '.'
    );
  });
});

test('homepage, practice hub, and badges page expose the review list and how-to', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const hub = fs.readFileSync(path.join(root, 'practice/index.html'), 'utf8');
  const badges = fs.readFileSync(path.join(root, 'badges.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');
  assert.match(home, /id="needs-review"/);
  assert.match(home, /Needs review/);
  assert.match(home, /需要重溫/);
  assert.match(home, /assets\/review-list\.js/);
  assert.match(hub, /id="needs-review"/);
  assert.match(hub, /review-list\.js/);
  assert.match(badges, /badge-how/);
  assert.match(badges, /b\.detail/);
  assert.match(badges, /index\.html#needs-review/);
  assert.match(badges, /Needs review 需要重溫/);
  const how = css.slice(css.indexOf('.badge-how {'), css.indexOf('.badge-how a'));
  assert.match(how, /color:\s*var\(--navy\)/);
  assert.doesNotMatch(how, /border:\s*[1-9]/);
});
