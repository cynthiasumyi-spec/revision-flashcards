const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function huntHtml() {
  return fs.readFileSync(path.join(root, 'game/clue-hunt.html'), 'utf8');
}

test('intro leads to a four-stop map before any quiz', () => {
  const html = huntHtml();
  const intro = html.slice(html.indexOf('id="intro"'), html.indexOf('id="fair-map"'));
  assert.match(intro, /Leo has not come back from the charity stall/);
  assert.match(intro, /The raffle box is gone too/);
  assert.match(intro, /Tap a place on the map/);
  assert.match(intro, /Talk to a person, or tap something to search/);
  assert.match(intro, /Your notebook fills in as you find clues/);
  assert.match(intro, /Tap Solve Case when the notebook is ready/);
  assert.match(intro, /id="start-map"/);
  assert.match(intro, /u1_09_fair\.jpg/);
  assert.doesNotMatch(intro, /class="choice"/);
  assert.equal((html.match(/class="hotspot"/g) || []).length, 4);
  assert.match(html, /data-hotspot="stall"/);
  assert.match(html, /data-hotspot="hall"/);
  assert.match(html, /data-hotspot="film"/);
  assert.match(html, /data-hotspot="store"/);
  assert.match(html, /u1_s4_carnival_stalls\.jpg/);
  assert.match(html, /u4_s4_musical_finale\.jpg/);
  assert.match(html, /u4_s5_studio_lights\.jpg/);
  assert.match(html, /u1_07_books\.jpg/);
  assert.doesNotMatch(html, /u4_comedy\.png/);
  assert.doesNotMatch(html, /u4_curious\.png/);
  assert.doesNotMatch(html, /u4_timid\.png/);
  const state = fs.readFileSync(path.join(root, 'game/clue-hunt-state.js'), 'utf8');
  assert.match(state, /u1_s4_carnival_stalls\.jpg/);
  assert.match(state, /u4_s4_musical_finale\.jpg/);
  assert.match(state, /u4_s5_studio_lights\.jpg/);
  assert.match(state, /u1_07_books\.jpg/);
  assert.doesNotMatch(html, /id="ask"/);
  assert.doesNotMatch(html, /Sealed/);
  assert.doesNotMatch(html, /Open this card/);
});

test('notebook and solve page are present, without a missing-person picker', () => {
  const html = huntHtml();
  const notebook = html.slice(html.indexOf('<aside id="notebook"'), html.indexOf('</aside>'));
  assert.match(notebook, /id="notebook-cards"/);
  assert.match(notebook, /id="notebook-empty"/);
  assert.match(notebook, /Nothing written yet/);
  assert.match(notebook, /id="open-solve"/);
  assert.match(notebook, /Solve Case/);
  assert.match(notebook, /disabled/);
  const solve = html.slice(html.indexOf('id="solve"'), html.indexOf('id="ending"'));
  assert.match(solve, /hidden/);
  assert.match(solve, /id="practice"/);
  assert.match(solve, /Who took the box\?/);
  assert.match(solve, /Where is Leo\?/);
  assert.match(solve, /id="who-choices"/);
  assert.match(solve, /id="where-choices"/);
  assert.match(solve, /id="solve-back"/);
  assert.doesNotMatch(solve, /id="what-choices"/);
  assert.doesNotMatch(solve, /Who is missing/);
  assert.match(html, /href="index\.html">← Game</);
  assert.match(html, /id="back-map"/);
  assert.match(html, /id="scene-actions"/);
  assert.match(html, /id="ending-copy"/);
});

test('clue hunt styles use fills and contain the pictures', () => {
  const html = huntHtml();
  const css = fs.readFileSync(path.join(root, 'game/game.css'), 'utf8');
  assert.match(html, /game\.css\?v=4/);
  assert.match(css, /\.fair-map \{/);
  assert.match(css, /\.hotspot \{[^}]*border:\s*0/);
  assert.match(css, /\.notebook \{[^}]*border:\s*0/);
  assert.match(css, /\.clue-card \{[^}]*border:\s*0/);
  assert.match(css, /\.practice-q \{[^}]*border:\s*0/);
  assert.match(css, /#scene-art \{[^}]*object-fit:\s*contain/);
  assert.match(css, /\.hotspot img \{[^}]*object-fit:\s*contain/);
});

test('page script explores before it grades and does not label the false card', () => {
  const html = huntHtml();
  const script = html.slice(html.lastIndexOf('<script>'), html.lastIndexOf('</script>'));
  assert.equal((script.match(/ClueHunt\.createHunt\(\)/g) || []).length, 1);
  assert.match(script, /ClueHunt\.visit/);
  assert.match(script, /ClueHunt\.notebook/);
  assert.match(script, /ClueHunt\.solveUnlocked/);
  assert.match(script, /ClueHunt\.displayCard/);
  assert.match(script, /ClueHunt\.submitSolve/);
  assert.match(script, /querySelectorAll\("\.hotspot"\)/);
  assert.match(script, /if \(ended\) return;/);
  assert.match(script, /if \(ended \|\| !ClueHunt\.solveUnlocked\(hunt\)\) return;/);
  assert.doesNotMatch(script, /notebook\.hidden = true/);
  assert.doesNotMatch(script, /Who is missing/);
  assert.doesNotMatch(script, /misleading/);
  assert.doesNotMatch(script, /step \+= 1/);
  assert.doesNotMatch(script, /Open this card/);
});
