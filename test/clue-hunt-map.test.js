const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function huntHtml() {
  return fs.readFileSync(path.join(root, 'game/clue-hunt.html'), 'utf8');
}

test('intro leads to a six-stop paper map before any quiz', () => {
  const html = huntHtml();
  const intro = html.slice(html.indexOf('id="intro"'), html.indexOf('id="fair-map"'));
  assert.match(intro, />The case</);
  assert.match(intro, />How to play</);
  assert.match(intro, /Leo was guarding the raffle box at the school charity fair/);
  assert.match(intro, /The box is gone, and Leo has not come back/);
  assert.match(intro, /name who took the box, and why/);
  assert.match(intro, /id="start-map"/);
  assert.match(intro, /u1_09_fair\.jpg/);
  assert.doesNotMatch(intro, /class="choice"/);
  assert.equal((html.match(/class="hotspot\b/g) || []).length, 6);
  ['stall', 'wheel', 'film', 'hall', 'desk', 'store'].forEach((id) => {
    assert.match(html, new RegExp('data-hotspot="' + id + '"'));
  });
  const map = html.slice(html.indexOf('id="fair-map"'), html.indexOf('id="scene"'));
  assert.match(map, /illust\/map-school-busy\.png/);
  assert.doesNotMatch(map, /class="hotspot\b[^>]*>\s*<img/);
  ['Charity stall', 'Prize wheel', 'Film club', 'School hall', "Miss Chan's desk", 'Storeroom'].forEach((label) => {
    assert.match(map, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
  assert.doesNotMatch(html, /u4_comedy\.png/);
  assert.doesNotMatch(html, /id="ask"/);
});

test('notebook and solve page are present, without a missing-person picker', () => {
  const html = huntHtml();
  const notebook = html.slice(html.indexOf('<aside id="notebook"'), html.indexOf('</aside>'));
  assert.match(notebook, /id="notebook-cards"/);
  assert.match(notebook, /where clues go when you talk and search/);
  assert.doesNotMatch(notebook, /Nothing written yet/);
  assert.match(notebook, /id="open-solve"/);
  assert.match(notebook, /Solve Case/);
  assert.match(notebook, /disabled/);
  const solve = html.slice(html.indexOf('id="solve"'), html.indexOf('id="ending"'));
  assert.match(solve, /hidden/);
  assert.doesNotMatch(solve, /id="practice"/);
  assert.doesNotMatch(solve, /A comedy ___/);
  assert.match(solve, /About what time did the box leave the stall\?/);
  assert.match(solve, /id="time-choices"/);
  assert.match(solve, /Who took the box\?/);
  assert.match(solve, /id="who-choices"/);
  assert.match(solve, /Why\?/);
  assert.match(solve, /id="why-choices"/);
  assert.doesNotMatch(solve, /Where is Leo/);
  assert.doesNotMatch(solve, /id="where-choices"/);
  assert.match(solve, /id="solve-back"/);
  assert.doesNotMatch(solve, /id="what-choices"/);
  assert.doesNotMatch(solve, /Who is missing/);
  assert.match(html, /href="index\.html">← Game</);
  assert.match(html, /id="back-map"/);
  assert.match(html, /id="scene-actions"/);
  assert.match(html, /id="scene-spots"/);
  assert.match(html, /id="zoom-pop"/);
  assert.match(html, /id="zoom-close"/);
  assert.match(html, /id="ask-pop"/);
  assert.match(html, /id="ask-thread"/);
  assert.doesNotMatch(html, /id="ask-choices"/);
  assert.doesNotMatch(html, /Look on the picture/);
  assert.match(html, /id="ending-copy"/);
});

test('clue hunt styles use fills and contain the pictures', () => {
  const html = huntHtml();
  const css = fs.readFileSync(path.join(root, 'game/game.css'), 'utf8');
  assert.match(html, /game\.css\?v=18/);
  assert.match(css, /\.fair-map \{/);
  assert.match(css, /\.hotspot \{[^}]*position:\s*absolute/);
  assert.match(css, /\.hotspot \{[^}]*border:\s*0/);
  assert.match(css, /\.hotspot \{[^}]*background:\s*transparent/);
  assert.doesNotMatch(css, /grid-template-columns:\s*1fr 1fr/);
  assert.match(css, /\.notebook \{[^}]*border:\s*0/);
  assert.match(css, /\.clue-card \{[^}]*border:\s*0/);
  assert.match(css, /\.notebook \{[^}]*repeating-linear-gradient/);
  assert.match(css, /#scene-art \{[^}]*object-fit:\s*contain/);
  assert.match(css, /\.fair-map-base \{[^}]*object-fit:\s*contain/);
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
  assert.doesNotMatch(script, /ClueHunt\.PRACTICE/);
  assert.doesNotMatch(script, /renderPractice/);
});

test('the page script opens every state hotspot by talk or search', () => {
  const html = huntHtml();
  const ClueHunt = require('../game/clue-hunt-state.js');
  ClueHunt.HOTSPOTS.forEach((spot) => {
    assert.match(html, new RegExp('data-hotspot="' + spot.id + '"'));
  });
  const script = html.slice(html.lastIndexOf('<script>'), html.lastIndexOf('</script>'));
  assert.match(script, /hotspot\.kind === "search" \? hotspot\.spots : hotspot\.prompts/);
  assert.match(script, /Talk to this person/);
  assert.match(script, /function askNext/);
  assert.doesNotMatch(script, /textContent = "\?"/);
  assert.match(script, /ClueHunt\.visit\(hunt, hotspot\.id, item\.id\)/);
  assert.doesNotMatch(script, /data-hotspot="stall"/);
});

test('scene art files exist and Ken still marks the storeroom pin', () => {
  const ClueHunt = require('../game/clue-hunt-state.js');
  const expected = {
    stall: 'illust/scene-stall-unsigned.png',
    wheel: 'illust/scene-prize-wheel-fair.png',
    film: 'illust/scene-film-sticker.png',
    hall: 'illust/scene-hall-full.png',
    desk: 'illust/scene-miss-chan-class.png',
    store: 'illust/scene-storeroom-ken.png'
  };
  ClueHunt.HOTSPOTS.forEach((spot) => {
    assert.equal(spot.art, expected[spot.id]);
    const file = spot.art.startsWith('illust/')
      ? path.join(root, 'game', spot.art)
      : path.join(root, 'game', spot.art);
    const buf = fs.readFileSync(file);
    if (spot.art.startsWith('illust/')) {
      assert.equal(buf[0], 0x89);
      assert.equal(buf.slice(1, 4).toString(), 'PNG');
    } else {
      assert.ok(buf.length > 1000);
    }
  });
  assert.equal(ClueHunt.HOTSPOTS.find((spot) => spot.id === 'store').marker, '../practice/grammar/illust/u1_07_books.jpg');
  const zoomArts = [];
  ClueHunt.HOTSPOTS.forEach((spot) => {
    (spot.spots || []).forEach((action) => {
      (action.hits || []).forEach((hit) => {
        assert.ok(hit.art, spot.id + ' ' + action.id);
        zoomArts.push(hit.art);
        const buf = fs.readFileSync(path.join(root, 'game', hit.art));
        assert.equal(buf[0], 0x89);
        assert.equal(buf.slice(1, 4).toString(), 'PNG');
      });
    });
  });
  assert.equal(new Set(zoomArts).size, 7);
});
