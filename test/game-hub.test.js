const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('home page hides a small detective link in the blue header', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(home, /class="detective-peek" href="game\/clue-hunt\.html"/);
  assert.match(home, />Be a Detective</);
  assert.match(home, /practice\/grammar\/illust\/u4_curious\.png/);
  assert.doesNotMatch(home, /class="detective-card"/);
  assert.doesNotMatch(home, /Start Clue Hunt/);
  assert.match(home, /badge-prompt/);
  assert.match(home, /Unlock your badges/);
  assert.match(home, /href="game\/index\.html"/);
  assert.match(home, />Game</);
  const css = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');
  assert.match(css, /\.detective-peek[\s\S]*position:\s*absolute/);
  assert.match(css, /\.detective-peek[\s\S]*right:/);
});

test('game hub lists Clue Hunt and is not inside Practice', () => {
  const hub = fs.readFileSync(path.join(root, 'game/index.html'), 'utf8');
  assert.match(hub, /href="clue-hunt\.html"/);
  assert.match(hub, />Clue Hunt</);
  assert.match(hub, /href="\.\.\/index\.html"/);
  assert.doesNotMatch(hub, /practice-entry\.html/);
  const hunt = fs.readFileSync(path.join(root, 'game/clue-hunt.html'), 'utf8');
  assert.match(hunt, /Who left with Leo/);
  assert.match(hunt, /Where is the missing boy/);
  assert.match(hunt, /Who wanted the box/);
  assert.match(hunt, /The film club/);
  assert.match(hunt, /answer: "Leo"/);
  assert.match(hunt, /In the school hall/);
  assert.doesNotMatch(hunt, /Vocab · Unit/);
  assert.doesNotMatch(hunt, /Grammar ·/);
  assert.equal((hunt.match(/answer: "/g) || []).length >= 8, true);
});
