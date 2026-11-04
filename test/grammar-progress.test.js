const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const grammar = path.join(root, 'practice', 'grammar');

function read(name) {
  return fs.readFileSync(path.join(grammar, name), 'utf8');
}

test('story chat and join pages record a grammar session when the set advances', () => {
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    ['story', 'chat', 'join'].forEach(mode => {
      const html = read(unit + '-' + mode + '.html');
      assert.match(html, /src="\.\.\/\.\.\/practice\/badges\.js"/, unit + '-' + mode);
      assert.match(
        html,
        new RegExp("Badges\\.recordGrammarSession\\('" + unit + "', '" + mode + "'\\)"),
        unit + '-' + mode
      );
    });
  });
});

test('chat pages count a correct final inference and boss records lives left', () => {
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    const html = read(unit + '-chat.html');
    assert.match(html, /Badges\.recordGrammarInference\(\)/, unit);
  });
  const boss = read('boss.html');
  assert.match(boss, /src="\.\.\/\.\.\/practice\/badges\.js"/);
  assert.match(boss, /Badges\.recordGrammarBoss\(lives\)/);
});

test('join pages drop the read-A-and-B hint and separate choices from actions', () => {
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    const html = read(unit + '-join.html');
    assert.doesNotMatch(html, /Read A and B/);
    assert.match(html, /class="choices join-choices"/);
    assert.match(html, /class="btn-row join-actions"/);
    assert.match(html, /Join with/);
  });
});

test('grammar hub keeps the back link and adds a top-right Practice control', () => {
  const html = read('grammar-hub.html');
  assert.match(html, /class="back" href="practice-entry\.html"/);
  assert.match(html, /class="header-practice" href="practice-entry\.html"/);
  assert.match(html, />Practice</);
});

test('chat bubbles are not outlined in coral', () => {
  const css = read('grammar.css');
  const rule = css.slice(css.indexOf('.bubble.active-bubble'), css.indexOf('.chat-reply-label'));
  assert.match(rule, /\.bubble\.active-bubble/);
  assert.doesNotMatch(rule, /coral/);
  assert.match(css, /\.join-choices \.choice/);
  assert.match(css, /\.join-actions \.btn-primary/);
  assert.match(css, /\.join-actions \.btn-ghost/);
});
