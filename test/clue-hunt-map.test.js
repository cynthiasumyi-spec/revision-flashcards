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
  assert.match(intro, /write what you find in the notebook/);
  assert.match(intro, /id="start-map"/);
  assert.match(intro, /u1_09_fair\.jpg/);
  assert.doesNotMatch(intro, /class="choice"/);
  assert.equal((html.match(/class="hotspot"/g) || []).length, 4);
  assert.match(html, /data-hotspot="stall"/);
  assert.match(html, /data-hotspot="hall"/);
  assert.match(html, /data-hotspot="film"/);
  assert.match(html, /data-hotspot="store"/);
  assert.match(html, /u1_s4_carnival_stalls\.jpg/);
  assert.match(html, /u4_comedy\.png/);
  assert.match(html, /u4_curious\.png/);
  assert.match(html, /u4_timid\.png/);
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
