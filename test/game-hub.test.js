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
  const nav = home.match(/<nav class="nav-plain"[\s\S]*?<\/nav>/)[0];
  assert.doesNotMatch(nav, />Game</);
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
  assert.match(hub, />School Mystery</);
  assert.match(hub, /href="\.\.\/index\.html"/);
  assert.match(hub, /Walk the school fair, fill your notebook/);
  assert.match(hub, /who took the box, and why/);
  assert.match(hub, /Easy, fun mystery games/);
  assert.match(hub, />Choose a case</);
  assert.doesNotMatch(hub, />Choose a game</);
  assert.match(hub, /class="case-file-kicker">Case file</);
  assert.match(hub, /class="case-no">Case No\. 001</);
  assert.match(hub, /class="game-card gc-mystery"/);
  assert.doesNotMatch(hub, /Mixed games/);
  assert.match(hub, /illust\/zoom-raffle-box\.png/);
  assert.doesNotMatch(hub, /u4_curious\.png/);
  assert.doesNotMatch(hub, /where he is/);
  assert.doesNotMatch(hub, /sealed cards/);
  assert.doesNotMatch(hub, /practice-entry\.html/);
  const hunt = fs.readFileSync(path.join(root, 'game/clue-hunt.html'), 'utf8');
  assert.match(hunt, /id="fair-map"/);
  assert.match(hunt, /id="notebook"/);
  assert.match(hunt, /src="clue-hunt-state\.js"/);
  assert.doesNotMatch(hunt, /Where is the missing boy/);
  assert.doesNotMatch(hunt, /Who is missing/);
  assert.doesNotMatch(hunt, /answer: "Leo"/);
  assert.doesNotMatch(hunt, /Vocab · Unit/);
  assert.doesNotMatch(hunt, /Grammar ·/);
});
