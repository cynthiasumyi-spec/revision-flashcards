const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('home page tucks Be a Detective at the top-left of the packs sheet', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const hero = home.slice(home.indexOf('class="hero'), home.indexOf('class="badge-prompt"'));
  const sheet = home.slice(home.indexOf('class="sheet'), home.indexOf('id="packs-title"'));
  assert.doesNotMatch(hero, /detective-peek/);
  assert.match(sheet, /class="detective-peek" href="game\/clue-hunt\.html"/);
  assert.match(home, />Be a Detective</);
  assert.match(home, /Unlock your badges/);
  assert.doesNotMatch(home, /class="detective-card"/);
  assert.doesNotMatch(home, /Start Clue Hunt/);
  const css = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');
  const rule = css.slice(css.indexOf('.sheet .detective-peek {'), css.indexOf('.sheet .detective-peek img'));
  assert.match(rule, /position:\s*absolute/);
  assert.match(rule, /left:/);
  assert.doesNotMatch(rule, /right:/);
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
