const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('home page has a detective card into Clue Hunt and a Game nav link', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(home, /class="detective-card" href="game\/clue-hunt\.html"/);
  assert.match(home, />Be a Detective</);
  assert.match(home, /practice\/grammar\/illust\/u4_curious\.png/);
  assert.match(home, /href="game\/index\.html"/);
  assert.match(home, />Game</);
});

test('game hub lists Clue Hunt and is not inside Practice', () => {
  const hub = fs.readFileSync(path.join(root, 'game/index.html'), 'utf8');
  assert.match(hub, /href="clue-hunt\.html"/);
  assert.match(hub, />Clue Hunt</);
  assert.match(hub, /href="\.\.\/index\.html"/);
  assert.doesNotMatch(hub, /practice-entry\.html/);
  const hunt = fs.readFileSync(path.join(root, 'game/clue-hunt.html'), 'utf8');
  assert.match(hunt, /buy\/sell raffle tickets/);
  assert.match(hunt, /a comedy/);
  assert.match(hunt, /The film club/);
  assert.match(hunt, /In the school hall/);
  assert.equal((hunt.match(/answer: "/g) || []).length >= 8, true);
});
