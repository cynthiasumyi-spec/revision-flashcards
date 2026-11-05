# Clue Hunt Amy Raffle Case Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Clue Hunt case with Amy’s secret raffle draw: six map places, one unlabeled false clue, and a solve page that asks who, why, and about what time.

**Architecture:** `game/clue-hunt-state.js` stays the pure notebook and solve module that `node:test` loads with `require`. `game/clue-hunt.html` keeps the paper map, lined notebook, and the existing visit script, and gains two markers plus who/why/time choices. Scene pictures that the current files do not show are new PNGs under `game/illust/`. Map pins can keep an existing place photo when that photo already shows the place.

**Tech Stack:** Static HTML, CSS, and vanilla JavaScript on GitHub Pages. Tests are `node:test`, `node:assert/strict`, and `fs.readFileSync`. New pictures are flat school clip-art in the same look as the irasutoya files already in `practice/grammar/illust/`. No browser test runner. No build step.

This is one subsystem, the Clue Hunt page, so it stays one plan. Do not ship until Task 6. After Task 1 the page still reads `CASE.where`, so Solve Case throws until Task 5.

## Global Constraints

- Student-facing copy stays in English.
- P6 tone: a school fair, a missing boy who is safe, a box opened to draw a ticket. No violence, no threat, no scary crime.
- Entry is the small Be a Detective mark at the top-left of the packs panel. It opens `game/clue-hunt.html`.
- The home header stays Revision and Practice. Do not add a Game link.
- The explore screen stays the open paper map (`game/illust/map-open.png`) with place markers on it, not a grid of large cards.
- The notebook stays lined paper, with the purpose line that clues from talking and searching are written there and used to solve the case.
- No vocabulary blank and no grammar blank on the solve page.
- Culprit: Amy, a classmate.
- Motive: she wanted to draw a raffle ticket in secret and win the big prize, a new bike.
- Ken says he saw Leo go into the storeroom at noon. That is the only false card. The notebook must not label it false or wrong. Leo must not be drawn inside the storeroom.
- The picture must show that place, and the people who belong in that moment.
- Prefer an existing file under `practice/grammar/illust/` or `game/illust/` when the picture already shows that place and those people. If none matches, generate a new illustration in the same flat, cute school clip-art look. Do not switch to a different style.
- Amy is a P6 girl with dark hair and a blue jacket over her school clothes. Her film-club picture includes her apple lunch and does not include apple memo paper.
- Six markers. Solve Case unlocks after all six cards. The player names who took the box and why. The optional time answer is about 1:20.
- Do not modify `index.html` or `assets/site.css`.
- When `game/game.css` changes, set the Clue Hunt stylesheet link to `game.css?v=6`. It is `game.css?v=5` today.

---

## File structure

- `game/clue-hunt-state.js` — six hotspots, notebook cards, who/why/time grading, and the ending. No DOM.
- `game/clue-hunt.html` — intro labels, six map pins, solve controls, and the inline script that already calls `ClueHunt.visit`.
- `game/game.css` — two extra pin positions. Lined notebook rules stay.
- `game/index.html` — one-line hub blurb, so it no longer says “where he is”.
- `game/illust/scene-stall-memo.png` — generated stall table and unsigned apple-pattern memo.
- `game/illust/scene-prize-wheel.png` — generated wheel, new bike, blue jacket leaving with Leo.
- `game/illust/scene-film-amy.png` — generated Amy, apple lunch, wish-list sticker, no memo paper.
- `game/illust/scene-hall-backstage.png` — generated backstage, Leo waiting, apple core, wish slip.
- `game/illust/miss-chan-desk.png` — generated Miss Chan at her desk. Used as both the pin and the scene.
- `test/clue-hunt-state.test.js` — cards, the false clue, six-card unlock, hints, ending.
- `test/clue-hunt-map.test.js` — six pins, no practice block, who/why/time markers, stylesheet version.
- `test/home-nav.test.js` — do not edit. Run it to prove the header is still Revision and Practice.

Ids and fields used by every later task:

```javascript
createHunt()
// returns { found: {}, order: [] }

visit(state, hotspotId, actionId)
// returns { state, added, duplicate, reply, card }
// hotspotId: "stall" | "wheel" | "film" | "hall" | "desk" | "store"
// useful actionId: "memo" | "jacket" | "lunch" | "core" | "move" | "noon"

notebook(state)           // cards in the order they were found
solveUnlocked(state)      // true only when order.length === 6
displayCard(card)         // { title, text } only
submitSolve(picks)
// picks: { time, who, why }
// returns { ok, hint, ending }

// each hotspot:
// { id, name, kind, marker, art, intro, cardTitle, cardText, misleading, spots|prompts }
// kind "search" uses spots; kind "talk" uses prompts
// marker is the map pin (path relative to game/clue-hunt.html)
// art is the opened scene
```

---

### Task 1: Six-place case state

**Files:**
- Modify: `game/clue-hunt-state.js` (replace the whole file)
- Modify: `test/clue-hunt-state.test.js` (replace the whole file)
- Test: `test/clue-hunt-state.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: `ClueHunt.HOTSPOTS` (length 6), `ClueHunt.CASE.who`, `ClueHunt.CASE.why`, `ClueHunt.CASE.time`, `ClueHunt.ENDING`, `ClueHunt.createHunt`, `ClueHunt.visit`, `ClueHunt.notebook`, `ClueHunt.solveUnlocked`, `ClueHunt.displayCard`, `ClueHunt.submitSolve`. There is no `ClueHunt.PRACTICE` and no `CASE.where`.

- [ ] **Step 1: Create the feature branch from current main**

Run from the repository root:

```bash
git status --short
git checkout main
git pull origin main
git checkout -b cursor/clue-hunt-amy-case-6c4f
```

Expected: `git status --short` prints nothing before the checkout. The last command prints `Switched to a new branch 'cursor/clue-hunt-amy-case-6c4f'`.

- [ ] **Step 2: Replace the state tests**

Replace `test/clue-hunt-state.test.js` with:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ClueHunt = require('../game/clue-hunt-state.js');

const root = path.join(__dirname, '..');

function solved() {
  return {
    time: 'About 1:20',
    who: 'Amy',
    why: 'To draw a ticket in secret and win the big prize'
  };
}

test('six hotspots and only Ken is misleading', () => {
  assert.equal(ClueHunt.HOTSPOTS.length, 6);
  assert.deepEqual(ClueHunt.HOTSPOTS.map((spot) => spot.id), ['stall', 'wheel', 'film', 'hall', 'desk', 'store']);
  assert.deepEqual(ClueHunt.HOTSPOTS.map((spot) => spot.kind), ['search', 'talk', 'talk', 'search', 'talk', 'talk']);
  const misleading = ClueHunt.HOTSPOTS.filter((spot) => spot.misleading);
  assert.equal(misleading.length, 1);
  assert.equal(misleading[0].id, 'store');
  assert.equal(misleading[0].cardText, 'Ken says he saw Leo go into the storeroom at noon.');
  const byId = Object.fromEntries(ClueHunt.HOTSPOTS.map((spot) => [spot.id, spot]));
  assert.equal(byId.stall.cardText, 'An unsigned note with an apple pattern says: Please move the raffle box to the hall. Thanks!');
  assert.doesNotMatch(byId.stall.cardText, /Amy/);
  assert.match(byId.wheel.cardText, /About 1:15/);
  assert.match(byId.wheel.cardText, /blue jacket/);
  assert.match(byId.wheel.cardText, /new bike/);
  assert.doesNotMatch(byId.wheel.cardText, /Amy/);
  assert.match(byId.film.cardText, /red apple every day/);
  assert.match(byId.film.cardText, /apple sticker on a wish list/);
  assert.match(byId.film.cardText, /would not wait for the bus/);
  assert.doesNotMatch(byId.film.cardText, /memo/);
  assert.doesNotMatch(byId.film.cardText, /blue jacket/);
  assert.match(byId.hall.cardText, /About 1:20/);
  assert.match(byId.hall.cardText, /still waiting/);
  assert.match(byId.hall.cardText, /apple core/);
  assert.match(byId.hall.cardText, /Win bike/);
  assert.doesNotMatch(byId.hall.cardText, /Amy/);
  assert.equal(byId.desk.cardText, 'Miss Chan did not ask anyone to move the raffle box.');
  assert.doesNotMatch(byId.desk.cardText, /Amy/);
  assert.equal(byId.store.art, '../practice/grammar/illust/u1_07_books.jpg');
  assert.equal(byId.store.marker, '../practice/grammar/illust/u1_07_books.jpg');
  const src = fs.readFileSync(path.join(root, 'game/clue-hunt-state.js'), 'utf8');
  assert.doesNotMatch(src, /Who is missing/);
  assert.doesNotMatch(src, /A comedy ___/);
  assert.equal(ClueHunt.PRACTICE, undefined);
});

test('each hotspot has one useful action and a useless stall tap adds nothing', () => {
  ClueHunt.HOTSPOTS.forEach((spot) => {
    const actions = spot.kind === 'search' ? spot.spots : spot.prompts;
    assert.equal(actions.length, 3);
    assert.equal(actions.filter((item) => item.useful).length, 1);
  });
  const missed = ClueHunt.visit(ClueHunt.createHunt(), 'stall', 'flags');
  assert.equal(missed.added, false);
  assert.equal(missed.duplicate, false);
  assert.equal(missed.card, null);
  assert.equal(missed.reply, 'The flags are still on the table.');
  assert.deepEqual(missed.state.order, []);
  assert.equal(ClueHunt.visit.length, 3);
});

test('a useful visit adds one card and does not mutate the previous state', () => {
  const start = ClueHunt.createHunt();
  const found = ClueHunt.visit(start, 'stall', 'memo');
  assert.deepEqual(start.order, []);
  assert.equal(found.added, true);
  assert.equal(found.duplicate, false);
  assert.match(found.reply, /apple pattern/);
  assert.deepEqual(ClueHunt.notebook(found.state).map((card) => card.id), ['stall']);
});

test('revisiting a hotspot does not duplicate its card', () => {
  const once = ClueHunt.visit(ClueHunt.createHunt(), 'hall', 'core');
  const twice = ClueHunt.visit(once.state, 'hall', 'core');
  const aside = ClueHunt.visit(once.state, 'hall', 'seats');
  assert.equal(twice.added, false);
  assert.equal(twice.duplicate, true);
  assert.equal(twice.state.order.length, 1);
  assert.equal(aside.added, false);
  assert.equal(aside.state.order.length, 1);
  assert.match(ClueHunt.notebook(twice.state)[0].text, /apple core/);
});

test('solve stays locked until all six cards exist, in any order', () => {
  let state = ClueHunt.createHunt();
  const steps = [['desk', 'move'], ['store', 'noon'], ['hall', 'core'], ['stall', 'memo'], ['wheel', 'jacket'], ['film', 'lunch']];
  steps.forEach((pair, index) => {
    state = ClueHunt.visit(state, pair[0], pair[1]).state;
    assert.equal(ClueHunt.solveUnlocked(state), index === 5);
  });
  assert.deepEqual(ClueHunt.notebook(state).map((card) => card.id), ['desk', 'store', 'hall', 'stall', 'wheel', 'film']);
});

test('the notebook view of Ken’s card is unlabeled', () => {
  const state = ClueHunt.visit(ClueHunt.createHunt(), 'store', 'noon').state;
  const view = ClueHunt.displayCard(ClueHunt.notebook(state)[0]);
  assert.deepEqual(view, {
    title: 'Storeroom',
    text: 'Ken says he saw Leo go into the storeroom at noon.'
  });
  assert.equal(Object.prototype.hasOwnProperty.call(view, 'misleading'), false);
  assert.doesNotMatch(view.title + view.text, /false|wrong/i);
});

test('solve asks who, why, and about 1:20, with no grammar blank', () => {
  assert.deepEqual(Object.keys(ClueHunt.CASE), ['who', 'why', 'time']);
  assert.equal(ClueHunt.CASE.who.answer, 'Amy');
  assert.deepEqual(ClueHunt.CASE.who.options, ['Amy', 'Ken', 'Miss Chan', 'The caretaker']);
  assert.equal(ClueHunt.CASE.why.answer, 'To draw a ticket in secret and win the big prize');
  assert.equal(ClueHunt.CASE.time.answer, 'About 1:20');
  assert.deepEqual(ClueHunt.CASE.time.options, ['About 1:20', 'At noon', 'At 11:30', 'About 2:00']);
  assert.equal(ClueHunt.CASE.where, undefined);
  const joined = JSON.stringify(ClueHunt.CASE);
  assert.doesNotMatch(joined, /Who is missing/);
  assert.doesNotMatch(joined, /A comedy ___/);
});

test('a wrong time hints a card and hides the ending', () => {
  const noon = ClueHunt.submitSolve({ time: 'At noon', who: 'Amy', why: 'To draw a ticket in secret and win the big prize' });
  const other = ClueHunt.submitSolve({ time: 'At 11:30', who: 'Amy', why: 'To draw a ticket in secret and win the big prize' });
  assert.deepEqual(noon, { ok: false, hint: 'Read the storeroom card again.', ending: '' });
  assert.equal(other.hint, 'Read the school hall card again.');
  assert.doesNotMatch(noon.hint + other.hint, /Amy/);
});

test('a wrong who or why names a card and does not reveal the ending', () => {
  const whoOnly = ClueHunt.submitSolve({ time: 'About 1:20', who: 'Ken', why: 'To draw a ticket in secret and win the big prize' });
  const whyOnly = ClueHunt.submitSolve({ time: 'About 1:20', who: 'Amy', why: 'To hide the box in the storeroom' });
  const both = ClueHunt.submitSolve({ time: 'About 1:20', who: 'Miss Chan', why: 'To give the tickets to the film club' });
  assert.equal(whoOnly.ok, false);
  assert.equal(whoOnly.ending, '');
  assert.equal(whoOnly.hint, 'Read the film club card again.');
  assert.equal(whyOnly.hint, 'Read the prize wheel card again.');
  assert.equal(both.hint, 'Read the film club card and the prize wheel card again.');
  assert.doesNotMatch(whoOnly.hint + whyOnly.hint + both.hint, /Amy/);
});

test('the correct who, why, and time return the one ending', () => {
  const result = ClueHunt.submitSolve(solved());
  assert.equal(result.ok, true);
  assert.equal(result.hint, '');
  assert.equal(result.ending, ClueHunt.ENDING);
  assert.match(result.ending, /Amy brings the tickets back and says sorry/);
  assert.match(result.ending, /He is safe/);
  assert.doesNotMatch(result.ending, /film club took/);
});
```

- [ ] **Step 3: Run the state tests and confirm they fail**

Run:

```bash
node --test test/clue-hunt-state.test.js
```

Expected: exit code 1. The failure includes `4 !== 6` or `CASE.where` still existing.

- [ ] **Step 4: Replace the state module**

Replace `game/clue-hunt-state.js` with:

```javascript
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClueHunt = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ENDING = "Amy opened the raffle box backstage to draw a ticket for the new bike. Leo was waiting there the whole time. He is safe. Amy brings the tickets back and says sorry. The stall can use the tickets again.";

  var HOTSPOTS = [
    {
      id: "stall",
      name: "Charity stall",
      kind: "search",
      marker: "../practice/grammar/illust/u1_s4_carnival_stalls.jpg",
      art: "illust/scene-stall-memo.png",
      intro: "Look at the charity stall table.",
      cardTitle: "Charity stall",
      cardText: "An unsigned note with an apple pattern says: Please move the raffle box to the hall. Thanks!",
      misleading: false,
      spots: [
        { id: "memo", label: "Apple-pattern note", useful: true, reply: "An unsigned note with an apple pattern says: Please move the raffle box to the hall. Thanks!" },
        { id: "flags", label: "Flags", useful: false, reply: "The flags are still on the table." },
        { id: "books", label: "Old books", useful: false, reply: "The old books are still there." }
      ]
    },
    {
      id: "wheel",
      name: "Prize wheel",
      kind: "talk",
      marker: "../practice/grammar/illust/u1_s4_lucky_draw.jpg",
      art: "illust/scene-prize-wheel.png",
      intro: "A student is watching the prize wheel.",
      cardTitle: "Prize wheel",
      cardText: "About 1:15, someone in a blue jacket left the stall with Leo. The big prize is a new bike. People keep guessing the lucky ticket.",
      misleading: false,
      prompts: [
        { id: "jacket", label: "Who left with Leo?", useful: true, reply: "About 1:15, someone in a blue jacket left the stall with Leo. The big prize is a new bike. People keep guessing the lucky ticket." },
        { id: "lucky", label: "What are people guessing?", useful: false, reply: "People keep guessing which ticket is the lucky one." },
        { id: "noon", label: "Was this at noon?", useful: false, reply: "I saw them after lunch, not at noon." }
      ]
    },
    {
      id: "film",
      name: "Film club",
      kind: "talk",
      marker: "../practice/grammar/illust/u4_s5_studio_lights.jpg",
      art: "illust/scene-film-amy.png",
      intro: "Amy is here with the film club.",
      cardTitle: "Film club",
      cardText: "Amy's lunch box has a red apple every day. She once stuck an apple sticker on a wish list. She said if she won the bike, she would not wait for the bus.",
      misleading: false,
      prompts: [
        { id: "lunch", label: "What is in Amy's lunch?", useful: true, reply: "Amy's lunch box has a red apple every day. She once stuck an apple sticker on a wish list. She said if she won the bike, she would not wait for the bus." },
        { id: "note", label: "Did Amy write a note?", useful: false, reply: "I only know about her lunch and her wish list." },
        { id: "box", label: "Did you see the box?", useful: false, reply: "I did not see the box leave." }
      ]
    },
    {
      id: "hall",
      name: "School hall",
      kind: "search",
      marker: "../practice/grammar/illust/u4_s4_musical_finale.jpg",
      art: "illust/scene-hall-backstage.png",
      intro: "Look backstage.",
      cardTitle: "School hall",
      cardText: "About 1:20 someone brought the raffle box backstage. Leo is still waiting. A half-eaten apple core is by the side door. A wish slip says Win bike, with a tiny apple sticker.",
      misleading: false,
      spots: [
        { id: "core", label: "Apple core and wish slip", useful: true, reply: "About 1:20 someone brought the raffle box backstage. Leo is still waiting. A half-eaten apple core is by the side door. A wish slip says Win bike, with a tiny apple sticker." },
        { id: "curtain", label: "Stage curtain", useful: false, reply: "The stage curtain is still closed." },
        { id: "seats", label: "Empty seats", useful: false, reply: "The seats are empty." }
      ]
    },
    {
      id: "desk",
      name: "Miss Chan's desk",
      kind: "talk",
      marker: "illust/miss-chan-desk.png",
      art: "illust/miss-chan-desk.png",
      intro: "Miss Chan is at her desk.",
      cardTitle: "Miss Chan's desk",
      cardText: "Miss Chan did not ask anyone to move the raffle box.",
      misleading: false,
      prompts: [
        { id: "move", label: "Did you ask anyone to move the box?", useful: true, reply: "Miss Chan did not ask anyone to move the raffle box." },
        { id: "leo", label: "Where is Leo?", useful: false, reply: "I have not seen Leo since this morning." },
        { id: "note", label: "Who wrote the note?", useful: false, reply: "I do not know who wrote a note." }
      ]
    },
    {
      id: "store",
      name: "Storeroom",
      kind: "talk",
      marker: "../practice/grammar/illust/u1_07_books.jpg",
      art: "../practice/grammar/illust/u1_07_books.jpg",
      intro: "Ken is in the storeroom with the books.",
      cardTitle: "Storeroom",
      cardText: "Ken says he saw Leo go into the storeroom at noon.",
      misleading: true,
      prompts: [
        { id: "noon", label: "What time did you see Leo?", useful: true, reply: "Ken says he saw Leo go into the storeroom at noon." },
        { id: "who", label: "Who took the box?", useful: false, reply: "I am not sure. I only remember the storeroom." },
        { id: "hall", label: "Where is the school hall?", useful: false, reply: "The school hall is across the fair, not in here." }
      ]
    }
  ];

  var CASE = {
    who: {
      prompt: "Who took the box?",
      options: ["Amy", "Ken", "Miss Chan", "The caretaker"],
      answer: "Amy"
    },
    why: {
      prompt: "Why?",
      options: [
        "To draw a ticket in secret and win the big prize",
        "To help Miss Chan move the box",
        "To hide the box in the storeroom",
        "To give the tickets to the film club"
      ],
      answer: "To draw a ticket in secret and win the big prize"
    },
    time: {
      prompt: "About what time did the box leave the stall?",
      options: ["About 1:20", "At noon", "At 11:30", "About 2:00"],
      answer: "About 1:20"
    }
  };

  function findHotspot(hotspotId) {
    for (var i = 0; i < HOTSPOTS.length; i++) {
      if (HOTSPOTS[i].id === hotspotId) return HOTSPOTS[i];
    }
    return null;
  }

  function findAction(hotspot, actionId) {
    var list = hotspot.kind === "search" ? hotspot.spots : hotspot.prompts;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === actionId) return list[i];
    }
    return null;
  }

  function createHunt() {
    return { found: {}, order: [] };
  }

  function visit(state, hotspotId, actionId) {
    var hotspot = findHotspot(hotspotId);
    if (!hotspot) {
      return { state: state, added: false, duplicate: false, reply: "That place is not on the map.", card: null };
    }
    var action = findAction(hotspot, actionId);
    if (!action) {
      return { state: state, added: false, duplicate: false, reply: "Try another spot.", card: null };
    }
    if (!action.useful) {
      return { state: state, added: false, duplicate: false, reply: action.reply, card: null };
    }
    if (state.found[hotspot.id]) {
      return { state: state, added: false, duplicate: true, reply: hotspot.cardText, card: state.found[hotspot.id] };
    }
    var card = {
      id: hotspot.id,
      title: hotspot.cardTitle,
      text: hotspot.cardText,
      misleading: hotspot.misleading
    };
    var found = Object.assign({}, state.found);
    found[hotspot.id] = card;
    var next = { found: found, order: state.order.concat([hotspot.id]) };
    return { state: next, added: true, duplicate: false, reply: hotspot.cardText, card: card };
  }

  function notebook(state) {
    return state.order.map(function (id) { return state.found[id]; });
  }

  function solveUnlocked(state) {
    return state.order.length === 6;
  }

  function displayCard(card) {
    return { title: card.title, text: card.text };
  }

  function timeHint(time) {
    if (time === "At noon") return "Read the storeroom card again.";
    return "Read the school hall card again.";
  }

  function caseHint(picks) {
    var whoOk = picks.who === CASE.who.answer;
    var whyOk = picks.why === CASE.why.answer;
    if (!whoOk && !whyOk) return "Read the film club card and the prize wheel card again.";
    if (!whoOk) return "Read the film club card again.";
    return "Read the prize wheel card again.";
  }

  function submitSolve(picks) {
    var chosen = picks || {};
    if (chosen.time !== CASE.time.answer) {
      return { ok: false, hint: timeHint(chosen.time), ending: "" };
    }
    if (chosen.who !== CASE.who.answer || chosen.why !== CASE.why.answer) {
      return { ok: false, hint: caseHint(chosen), ending: "" };
    }
    return { ok: true, hint: "", ending: ENDING };
  }

  return {
    HOTSPOTS: HOTSPOTS,
    CASE: CASE,
    ENDING: ENDING,
    createHunt: createHunt,
    visit: visit,
    notebook: notebook,
    solveUnlocked: solveUnlocked,
    displayCard: displayCard,
    submitSolve: submitSolve
  };
});
```

- [ ] **Step 5: Run the state tests and confirm they pass**

Run:

```bash
node --test test/clue-hunt-state.test.js
```

Expected: exit code 0 and `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add game/clue-hunt-state.js test/clue-hunt-state.test.js
git commit -m "$(cat <<'EOF'
feat: add Amy raffle-box notebook and solve state

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 2: Six markers on the paper map

**Files:**
- Modify: `game/clue-hunt.html` (intro copy, fair-map pins, stylesheet query)
- Modify: `game/game.css` (pin positions only)
- Modify: `test/clue-hunt-map.test.js` (the intro/map test and the stylesheet version)
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `HOTSPOTS[].id` and `HOTSPOTS[].marker` from Task 1
- Produces: buttons `data-hotspot` `stall`, `wheel`, `film`, `hall`, `desk`, `store`, each with class `hotspot` plus `pin-stall`, `pin-wheel`, `pin-film`, `pin-hall`, `pin-desk`, or `pin-store`. The map image stays `illust/map-open.png`.

- [ ] **Step 1: Update the map assertions so they fail**

In `test/clue-hunt-map.test.js`, replace the test named `intro leads to a four-stop map before any quiz` with:

```javascript
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
  assert.match(html, /illust\/map-open\.png/);
  assert.match(html, /u1_s4_carnival_stalls\.jpg/);
  assert.match(html, /u1_s4_lucky_draw\.jpg/);
  assert.match(html, /u4_s5_studio_lights\.jpg/);
  assert.match(html, /u4_s4_musical_finale\.jpg/);
  assert.match(html, /illust\/miss-chan-desk\.png/);
  assert.match(html, /u1_07_books\.jpg/);
  assert.doesNotMatch(html, /u4_comedy\.png/);
  assert.doesNotMatch(html, /id="ask"/);
});
```

In the stylesheet test, change `game\.css\?v=5` to `game\.css\?v=6`.

- [ ] **Step 2: Run the map test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "six-stop paper map" test/clue-hunt-map.test.js
```

Expected: exit code 1. The current page has four hotspot buttons and the old intro sentence.

- [ ] **Step 3: Update the intro and the map pins**

In `game/clue-hunt.html`, change the stylesheet link to:

```html
<link rel="stylesheet" href="game.css?v=6"/>
```

Replace the case and how-to-play blocks with:

```html
        <div class="case-block">
          <h2 class="block-label">The case</h2>
          <p class="case-lead" id="case-lead">Leo was guarding the raffle box at the school charity fair. The box is gone, and Leo has not come back.</p>
        </div>
        <div class="play-block">
          <h2 class="block-label">How to play</h2>
          <ol class="case-steps">
            <li>Tap a place on the map.</li>
            <li>Talk to a person, or search.</li>
            <li>Clues are written in the notebook.</li>
            <li>When the notes are ready, tap Solve Case and name who took the box, and why.</li>
          </ol>
        </div>
```

Replace the four buttons inside `.fair-map` with these six. Leave the `map-open.png` image as the first child.

```html
          <button type="button" class="hotspot pin-stall" data-hotspot="stall">
            <img src="../practice/grammar/illust/u1_s4_carnival_stalls.jpg" alt="" width="320" height="240"/>
            <span>Charity stall</span>
          </button>
          <button type="button" class="hotspot pin-wheel" data-hotspot="wheel">
            <img src="../practice/grammar/illust/u1_s4_lucky_draw.jpg" alt="" width="320" height="240"/>
            <span>Prize wheel</span>
          </button>
          <button type="button" class="hotspot pin-film" data-hotspot="film">
            <img src="../practice/grammar/illust/u4_s5_studio_lights.jpg" alt="" width="320" height="240"/>
            <span>Film club</span>
          </button>
          <button type="button" class="hotspot pin-hall" data-hotspot="hall">
            <img src="../practice/grammar/illust/u4_s4_musical_finale.jpg" alt="" width="320" height="240"/>
            <span>School hall</span>
          </button>
          <button type="button" class="hotspot pin-desk" data-hotspot="desk">
            <img src="illust/miss-chan-desk.png" alt="" width="320" height="240"/>
            <span>Miss Chan's desk</span>
          </button>
          <button type="button" class="hotspot pin-store" data-hotspot="store">
            <img src="../practice/grammar/illust/u1_07_books.jpg" alt="" width="320" height="240"/>
            <span>Storeroom</span>
          </button>
```

In `game/game.css`, replace the four `.pin-*` rules with:

```css
.pin-stall { left: 20%; top: 38%; }
.pin-wheel { left: 24%; top: 70%; }
.pin-film { left: 76%; top: 34%; }
.pin-hall { left: 48%; top: 18%; }
.pin-desk { left: 80%; top: 68%; }
.pin-store { left: 50%; top: 76%; }
```

Keep `.hotspot { position: absolute; border: 0; ... }` and `.fair-map` as they are. The desk pin file is created in Task 4, so that one image is blank until then.

- [ ] **Step 4: Run the map tests and confirm they pass**

Run:

```bash
node --test test/clue-hunt-map.test.js test/clue-hunt-state.test.js
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt.html game/game.css test/clue-hunt-map.test.js
git commit -m "$(cat <<'EOF'
feat: put six Clue Hunt places on the paper map

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 3: Hub line and generic talk/search wiring

**Files:**
- Modify: `game/index.html` (the Clue Hunt card paragraph only)
- Modify: `test/game-hub.test.js` (the hub blurb assertion)
- Modify: `test/clue-hunt-map.test.js` (append one test)
- Test: `test/game-hub.test.js`, `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: the six `data-hotspot` buttons from Task 2 and `ClueHunt.visit(state, hotspotId, actionId)` from Task 1
- Produces: a hub sentence that asks who and why. The existing inline script already opens every `.hotspot` through `hotspot.spots` or `hotspot.prompts`. Do not add a second click handler.

- [ ] **Step 1: Write the failing hub and wiring assertions**

In `test/game-hub.test.js`, inside `game hub lists Clue Hunt and is not inside Practice`, add:

```javascript
  assert.match(hub, /who took the box, and why/);
  assert.doesNotMatch(hub, /where he is/);
```

Append this test to `test/clue-hunt-map.test.js`:

```javascript
test('the page script opens every state hotspot by talk or search', () => {
  const html = huntHtml();
  const ClueHunt = require('../game/clue-hunt-state.js');
  ClueHunt.HOTSPOTS.forEach((spot) => {
    assert.match(html, new RegExp('data-hotspot="' + spot.id + '"'));
  });
  const script = html.slice(html.lastIndexOf('<script>'), html.lastIndexOf('</script>'));
  assert.match(script, /hotspot\.kind === "search" \? hotspot\.spots : hotspot\.prompts/);
  assert.match(script, /ClueHunt\.visit\(hunt, hotspot\.id, item\.id\)/);
  assert.doesNotMatch(script, /data-hotspot="stall"/);
});
```

- [ ] **Step 2: Run the hub test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "game hub lists Clue Hunt" test/game-hub.test.js
```

Expected: exit code 1. The hub paragraph still says `where he is`.

- [ ] **Step 3: Replace the hub paragraph**

In `game/index.html`, replace the Clue Hunt paragraph with:

```html
<p>Leo was guarding the raffle box and did not come back. Walk the school fair, fill your notebook, and find who took the box, and why.</p>
```

Do not edit the home `index.html` header.

- [ ] **Step 4: Run the tests and confirm they pass**

Run:

```bash
node --test test/game-hub.test.js test/clue-hunt-map.test.js test/clue-hunt-state.test.js
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add game/index.html test/game-hub.test.js test/clue-hunt-map.test.js
git commit -m "$(cat <<'EOF'
feat: point the game hub at who took the box and why

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 4: Scene pictures that match the place and the people

**Files:**
- Create: `game/illust/scene-stall-memo.png`
- Create: `game/illust/scene-prize-wheel.png`
- Create: `game/illust/scene-film-amy.png`
- Create: `game/illust/scene-hall-backstage.png`
- Create: `game/illust/miss-chan-desk.png`
- Modify: `test/clue-hunt-map.test.js` (append one test)
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `HOTSPOTS[].art` and `HOTSPOTS[].marker` from Task 1. The page sets `#scene-art.src` from `hotspot.art`. The pin images in Task 2 stay the marker files.
- Produces: five PNG files. Storeroom keeps `../practice/grammar/illust/u1_07_books.jpg` for both marker and scene. Do not draw Leo in that storeroom picture.

- [ ] **Step 1: Write the failing file test**

Append this test to `test/clue-hunt-map.test.js`:

```javascript
test('scene art files exist and the storeroom picture is the book bin', () => {
  const ClueHunt = require('../game/clue-hunt-state.js');
  const expected = {
    stall: 'illust/scene-stall-memo.png',
    wheel: 'illust/scene-prize-wheel.png',
    film: 'illust/scene-film-amy.png',
    hall: 'illust/scene-hall-backstage.png',
    desk: 'illust/miss-chan-desk.png',
    store: '../practice/grammar/illust/u1_07_books.jpg'
  };
  ClueHunt.HOTSPOTS.forEach((spot) => {
    assert.equal(spot.art, expected[spot.id]);
    const file = spot.art.startsWith('illust/')
      ? path.join(root, 'game', spot.art)
      : path.join(root, 'game', spot.art);
    const buf = fs.readFileSync(file);
    assert.equal(buf[0], 0x89);
    assert.equal(buf.slice(1, 4).toString(), 'PNG');
  });
  assert.equal(ClueHunt.HOTSPOTS.find((spot) => spot.id === 'store').marker, expected.store);
});
```

The `illust/` branch joins `game/` plus `illust/...`. The storeroom path joins `game/` plus `../practice/...`, which lands on `practice/grammar/illust/u1_07_books.jpg`.

- [ ] **Step 2: Run the art test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "scene art files exist" test/clue-hunt-map.test.js
```

Expected: exit code 1. The error is `ENOENT` for `game/illust/scene-stall-memo.png`.

- [ ] **Step 3: Generate the five pictures**

Generate each PNG in the same flat, cute school clip-art look as `practice/grammar/illust/u1_09_fair.jpg`: soft outlines, solid colours, no text except the two notes named below, no photo style, no scary faces. Save the tool output at the path. Use one Amy (dark hair, blue jacket, school clothes) and one Miss Chan (adult teacher, hair in a bun, calm) so they match across pictures.

1. `game/illust/scene-stall-memo.png` — charity-stall table at a school fair. An unsigned rectangular note with a repeating red-apple pattern lies where a box was. The only readable words on the note are “Please move the raffle box to the hall. Thanks!” No signature and no portrait of Amy.
2. `game/illust/scene-prize-wheel.png` — a colourful prize wheel and a new bicycle as the big prize. A girl seen from the side, in a blue jacket, walks away with a boy. Do not print the name Amy.
3. `game/illust/scene-film-amy.png` — the same girl, dark hair and blue jacket, in a school film room with a camera. She holds a lunch box with a red apple. A wish list on the table has one tiny apple sticker. No apple-pattern memo paper.
4. `game/illust/scene-hall-backstage.png` — school-hall backstage. A boy waits safely beside a half-open raffle box. A half-eaten apple core is by a side door. A small slip beside the box reads “Win bike” and has a tiny apple sticker. He is not frightened.
5. `game/illust/miss-chan-desk.png` — the same adult teacher sits at a wooden school desk with papers. The room is a calm classroom. No raffle box in her hands.

Do not create a new storeroom file.

- [ ] **Step 4: Run the art test and confirm it passes**

Run:

```bash
node --test --test-name-pattern "scene art files exist" test/clue-hunt-map.test.js
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add game/illust/scene-stall-memo.png game/illust/scene-prize-wheel.png game/illust/scene-film-amy.png game/illust/scene-hall-backstage.png game/illust/miss-chan-desk.png test/clue-hunt-map.test.js
git commit -m "$(cat <<'EOF'
feat: add Clue Hunt scene pictures for the raffle case

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 5: Who, why, and about 1:20

**Files:**
- Modify: `game/clue-hunt.html` (the solve section and the inline `openSolvePanel` / solve button)
- Modify: `test/clue-hunt-map.test.js` (the solve-page test)
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `ClueHunt.CASE.time`, `ClueHunt.CASE.who`, `ClueHunt.CASE.why`, and `ClueHunt.submitSolve(picks)` from Task 1
- Produces: DOM ids `time-choices`, `who-choices`, and `why-choices`. There is no `where-choices` and no `id="practice"`.

- [ ] **Step 1: Update the solve-page assertions so they fail**

In the test `notebook and solve page are present, without a missing-person picker`, replace the solve assertions that mention `Where is Leo` and `where-choices` with:

```javascript
  assert.match(solve, /About what time did the box leave the stall\?/);
  assert.match(solve, /id="time-choices"/);
  assert.match(solve, /Who took the box\?/);
  assert.match(solve, /id="who-choices"/);
  assert.match(solve, /Why\?/);
  assert.match(solve, /id="why-choices"/);
  assert.doesNotMatch(solve, /Where is Leo/);
  assert.doesNotMatch(solve, /id="where-choices"/);
  assert.doesNotMatch(solve, /id="practice"/);
  assert.doesNotMatch(solve, /A comedy ___/);
```

Keep the notebook assertions and `id="solve-back"` in that same test.

- [ ] **Step 2: Run the solve test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "without a missing-person picker" test/clue-hunt-map.test.js
```

Expected: exit code 1. The page still has `Where is Leo?`.

- [ ] **Step 3: Replace the solve markup and the solve script**

Replace the solve section in `game/clue-hunt.html` with:

```html
      <section id="solve" hidden>
        <div class="btn-row">
          <button type="button" class="btn btn-ghost" id="solve-back">Back to the map</button>
        </div>
        <h2 class="hunt-q">Solve the case</h2>
        <span class="solve-label">About what time did the box leave the stall?</span>
        <div class="choices" id="time-choices"></div>
        <span class="solve-label">Who took the box?</span>
        <div class="choices" id="who-choices"></div>
        <span class="solve-label">Why?</span>
        <div class="choices" id="why-choices"></div>
        <div class="btn-row">
          <button type="button" class="btn btn-primary" id="solve-btn" disabled>Close the case</button>
        </div>
        <p class="hint" id="solve-feedback" hidden></p>
      </section>
```

In the inline script, change `var casePicks = { who: null, where: null };` to:

```javascript
  var casePicks = { time: null, who: null, why: null };
```

Inside `renderCaseGroup`, change the disabled check to:

```javascript
        solveBtn.disabled = !(casePicks.time && casePicks.who && casePicks.why);
```

Replace the body of `openSolvePanel` after `feedback.textContent = "";` with:

```javascript
    stepLabel.textContent = "Who took the box, and why?";
    renderCaseGroup(document.getElementById("time-choices"), "time", ClueHunt.CASE.time.options);
    renderCaseGroup(document.getElementById("who-choices"), "who", ClueHunt.CASE.who.options);
    renderCaseGroup(document.getElementById("why-choices"), "why", ClueHunt.CASE.why.options);
    renderNotebook();
```

The solve button already calls `ClueHunt.submitSolve(casePicks)`. Leave that call. Do not add a practice renderer.

- [ ] **Step 4: Run the tests and confirm they pass**

Run:

```bash
node --test test/clue-hunt-state.test.js test/clue-hunt-map.test.js test/game-hub.test.js test/home-nav.test.js
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt.html test/clue-hunt-map.test.js
git commit -m "$(cat <<'EOF'
feat: solve the raffle case with who, why, and time

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 6: Manual check and ship

**Files:**
- Modify: none unless a check below fails
- Test: `test/clue-hunt-state.test.js`, `test/clue-hunt-map.test.js`, `test/game-hub.test.js`, `test/home-nav.test.js`

**Interfaces:**
- Consumes: the page and state module from Tasks 1–5
- Produces: `main` containing those commits. Live Clue Hunt is `https://cynthiasumyi-spec.github.io/revision-flashcards/game/clue-hunt.html`.

- [ ] **Step 1: Re-run the automated tests**

Run:

```bash
node --test test/clue-hunt-state.test.js test/clue-hunt-map.test.js test/game-hub.test.js test/home-nav.test.js
```

Expected: exit code 0.

- [ ] **Step 2: Play the local page**

From the repository root:

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/game/clue-hunt.html` at 1280×900 and at 390×844.

Expected:

1. The case and How to play are separate blocks. The case says Leo was guarding the raffle box.
2. The paper map shows six pins: Charity stall, Prize wheel, Film club, School hall, Miss Chan's desk, Storeroom. They do not cover one another.
3. Charity stall search of the apple-pattern note adds one card and does not say Amy wrote it.
4. Prize wheel, film club, hall, and Miss Chan each add one card. The film-club card does not say memo paper. The hall card says about 1:20, Leo is waiting, the apple core, and Win bike.
5. Ken’s storeroom card says he saw Leo at noon. The picture is the boy with the book bin. Leo is not in that picture. The card does not say false or wrong.
6. Asking again does not add a second copy. Solve Case enables only after the sixth card.
7. Solve Case has time, who, and why. It has no grammar blank and does not ask where Leo is.
8. Noon plus Amy plus the secret-ticket motive hints “Read the storeroom card again.” The ending stays hidden.
9. About 1:20, Amy, and “To draw a ticket in secret and win the big prize” shows the ending where Leo is safe and Amy says sorry.
10. Home still has only Revision and Practice, and Be a Detective still opens this page.

- [ ] **Step 3: Commit a fix only if a check failed**

If Step 1 or Step 2 forced a code change, re-run Step 1, then:

```bash
git add game/clue-hunt-state.js game/clue-hunt.html game/game.css game/index.html game/illust test/clue-hunt-state.test.js test/clue-hunt-map.test.js test/game-hub.test.js
git commit -m "$(cat <<'EOF'
fix: Clue Hunt raffle case follow-ups

EOF
)"
```

If `git status --short` is empty, do not create a commit.

- [ ] **Step 4: Push the branch and fast-forward main**

```bash
git push -u origin cursor/clue-hunt-amy-case-6c4f
git checkout main
git merge --ff-only cursor/clue-hunt-amy-case-6c4f
git push origin main
```

If the branch already exists on the remote, run `git push origin cursor/clue-hunt-amy-case-6c4f` instead. A pull request for this repository returns `must be a collaborator`. The fast-forward push above is the ship path. Do not force-push `main`.

- [ ] **Step 5: Confirm the live page**

```bash
gh run list --workflow pages-build-deployment --limit 1 --json databaseId,headSha,status,conclusion
gh run watch <databaseId> --exit-status
```

Replace `<databaseId>` with the id whose `headSha` is the `main` commit just pushed. Expected: the watch command exits 0.

Then:

```bash
python3 - << 'PY'
import urllib.request
url = "https://cynthiasumyi-spec.github.io/revision-flashcards/game/clue-hunt.html?live=amy"
html = urllib.request.urlopen(urllib.request.Request(url, headers={"Cache-Control": "no-cache"})).read().decode()
assert "data-hotspot=\"wheel\"" in html
assert "data-hotspot=\"desk\"" in html
assert "illust/map-open.png" in html
assert "Why?" in html
assert "About 1:20" in html or "About what time did the box leave the stall?" in html
assert "Where is Leo" not in html
assert "id=\"practice\"" not in html
print("live amy case ok")
PY
```

Expected: the script prints `live amy case ok`.

---

## Spec coverage

Checked against `docs/superpowers/specs/2026-11-05-clue-hunt-amy-raffle-case-design.md`.

| Spec requirement | Plan |
| --- | --- |
| Full story first, then scattered clues | Task 2 intro. Task 1 cards do not name Amy on the memo, wheel, hall, or desk. |
| Solve is culprit plus motive, no grammar practice | Task 1 `CASE.who` and `CASE.why`. Task 5 removes `where-choices` and `practice`. |
| Paper map and lined notebook stay | Task 2 keeps `map-open.png` and does not restyle `.notebook`. |
| Amy, secret ticket, new bike | Task 1 who and why answers and the ending string. |
| Timeline 11:30 through about 2:00 | Task 1 wheel card “About 1:15”, hall card “About 1:20”, time options include 11:30, noon, and about 2:00. |
| Ken’s noon is the only unlabeled false clue | Task 1 misleading filter and `displayCard`. Storeroom art stays the book bin. |
| Six places and the six card sentences | Task 1 hotspot list. Task 2 six pins. |
| Apple chain without saying Amy wrote the memo | Task 1 `doesNotMatch` on memo, film “memo”, and Amy’s name on stall, wheel, hall, and desk cards. |
| Blue jacket is visual, not a film-club sentence | Task 4 film prompt. Task 1 film card test rejects `blue jacket`. |
| Optional 1:20 filter and card hints | Task 1 `timeHint` and `caseHint`. |
| Mild ending, Leo safe, Amy apologises | Task 1 `ENDING`. |
| Be a Detective and no Game nav | No task edits `index.html`. Task 6 runs `test/home-nav.test.js`. |
| Art: existing pin when it matches, else generate | Task 4 file list and the five generation briefs. Storeroom reuses `u1_07_books.jpg`. |
