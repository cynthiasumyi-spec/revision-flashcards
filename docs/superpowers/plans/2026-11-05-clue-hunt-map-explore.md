# Clue Hunt Map Explore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Clue Hunt so the player wanders a four-stop school-fair map, keeps one English notebook card per stop, and only then answers a short vocabulary-and-grammar solve page for who took the raffle box and where Leo is.

**Architecture:** A pure state module (`game/clue-hunt-state.js`) owns hotspots, notebook cards, the single misleading clue, practice questions, and solve grading. `node:test` loads that file with `require`. `game/clue-hunt.html` is a static intro, map, scene, notebook, solve page, and ending, with a short inline script that renders clicks through the module. `game/game.css` styles the map, scenes, and notebook. The home header and the Be a Detective entry stay as they are.

**Tech Stack:** Static HTML, CSS, and vanilla JavaScript on GitHub Pages. Tests are `node:test`, `node:assert/strict`, and `fs.readFileSync`. No browser test runner. No build step.

This is one subsystem, the Clue Hunt page, so it stays one plan.

## Global Constraints

- Student-facing copy stays in English.
- Entry stays the small Be a Detective mark at the top-left of the cream packs panel on the home page (`index.html` → `game/clue-hunt.html`).
- The home header stays Revision | Practice. Do not put a Game link back in that header.
- `game/index.html` and `game/clue-hunt.html` stay in the repo. Be a Detective is the student entry. Do not delete the game pages.
- The same case: Leo left the charity stall, and the raffle box is gone.
- The same true solution: the film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe. The stall can collect the tickets after the film.
- P6 tone: a school fair, a missing boy who is safe, a box borrowed for a class film. No violence, no threat, no scary crime.
- English UI, the same gentle illustration style already used by Practice, fill instead of borders, and rounded pictures that stay fully visible.
- Exactly one notebook card is false or misleading, and it is Ken’s wrong time at the storeroom.
- v1 collects four cards, one from each hotspot. Do not add a fifth required card.
- The false card looks like the others. Do not label it “false” or “wrong” on the notebook.
- Solve Case stays locked until all four notebook cards are collected.
- The solve page shows the notebook fully open, asks two or three mixed vocabulary and grammar questions, then asks who took the box and where Leo is.
- Do not also ask “who is missing?”. Leo is already the missing boy.
- A wrong case answer names the notebook card to re-read and does not give the culprit or the place on the first miss.
- No alternate endings, no interaction types other than talk and search, no timing minigame, no second case, no Clue Hunt inside Practice, no scoring, streaks, or badges for this redesign, and no Chinese-language play mode.
- The Clue Hunt back link stays `href="index.html"` (the game hub, labeled `← Game`). Do not add a Game link to the site header in `index.html`.
- When `game/game.css` changes, set the Clue Hunt stylesheet link to `game.css?v=3`. It is `game.css?v=2` today.
- Do not modify `index.html`, `assets/site.css`, or any file under `practice/`.

---

## File structure

- `game/clue-hunt-state.js` — pure data and rules. Creates the notebook, accepts one visit at a time, and grades the solve page. No DOM.
- `game/clue-hunt.html` — intro, four map hotspots, talk/search scene, notebook, solve page, ending, and the inline script that calls the state module.
- `game/game.css` — map, hotspot, scene, notebook, and practice-question presentation. Linked only from `game/clue-hunt.html`.
- `game/index.html` — one-line Clue Hunt blurb, so the hub no longer says “sealed cards”.
- `test/clue-hunt-state.test.js` — `require`s the state module and checks cards, the misleading clue, unlock, hints, and the ending.
- `test/clue-hunt-map.test.js` — reads the HTML and CSS source for the map, notebook, solve markers, stylesheet version, and inline wiring.
- `test/game-hub.test.js` — keep the home-entry test. Replace the old sealed-card expectations.
- `test/home-nav.test.js` — do not edit. Run it to prove the header is still Revision and Practice.

State names used by every later task:

```javascript
createHunt()
// returns { found: {}, order: [] }

visit(state, hotspotId, actionId)
// returns { state, added, duplicate, reply, card }
// hotspotId: "stall" | "hall" | "film" | "store"
// actionId: "tickets" | "flags" | "books" | "comedy" | "when" | "ken"
//           | "asked" | "caretaker" | "wheel" | "noon" | "who" | "hall"

notebook(state)           // card objects in the order they were found
solveUnlocked(state)      // true only when order.length === 4
displayCard(card)         // { title, text } only
submitSolve(practiceAnswers, picks)
// returns { ok, hint, ending }
// practiceAnswers keys: "table", "hall-sentence", "asked"
// picks keys: "who", "where"
```

---

### Task 1: Notebook and solve state

**Files:**
- Create: `game/clue-hunt-state.js`
- Create: `test/clue-hunt-state.test.js`
- Test: `test/clue-hunt-state.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: `ClueHunt.createHunt`, `ClueHunt.visit`, `ClueHunt.notebook`, `ClueHunt.solveUnlocked`, `ClueHunt.displayCard`, `ClueHunt.submitSolve`, `ClueHunt.HOTSPOTS`, `ClueHunt.PRACTICE`, `ClueHunt.CASE`, `ClueHunt.ENDING` for both `require` and `globalThis.ClueHunt`

- [ ] **Step 1: Create the feature branch from current main**

Run from the repository root:

```bash
git status --short
git checkout main
git pull origin main
git checkout -b cursor/clue-hunt-map-explore-6c4f
```

Expected: `git status --short` prints nothing before the checkout. The last command prints `Switched to a new branch 'cursor/clue-hunt-map-explore-6c4f'`.

- [ ] **Step 2: Write the failing state tests**

Create `test/clue-hunt-state.test.js` with this exact source:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ClueHunt = require('../game/clue-hunt-state.js');

const root = path.join(__dirname, '..');

function practiceOk() {
  return {
    table: 'The flags and the old books',
    'hall-sentence': 'is',
    asked: 'The film club'
  };
}

test('four hotspots, one per stop, and only Ken is misleading', () => {
  assert.equal(ClueHunt.HOTSPOTS.length, 4);
  assert.deepEqual(ClueHunt.HOTSPOTS.map((spot) => spot.id), ['stall', 'hall', 'film', 'store']);
  assert.deepEqual(ClueHunt.HOTSPOTS.map((spot) => spot.kind), ['search', 'talk', 'talk', 'talk']);
  const misleading = ClueHunt.HOTSPOTS.filter((spot) => spot.misleading);
  assert.equal(misleading.length, 1);
  assert.equal(misleading[0].id, 'store');
  assert.equal(misleading[0].cardTitle, 'Storeroom');
  assert.equal(misleading[0].cardText, 'Ken says he saw Leo go into the storeroom at noon.');
  assert.equal(ClueHunt.HOTSPOTS[0].cardText, 'The raffle tickets are gone. The flags and the old books are still there.');
  assert.equal(ClueHunt.HOTSPOTS[1].cardText, 'A comedy is on in the school hall. A boy came in with the raffle box.');
  assert.equal(ClueHunt.HOTSPOTS[2].cardText, 'The film club asked Amy to bring the tickets for their comedy draw.');
  const film = ClueHunt.HOTSPOTS[2];
  assert.match(film.intro, /Amy left the stall with Leo/);
  assert.match(film.prompts.find((item) => item.id === 'wheel').reply, /beside the prize wheel/);
  const src = fs.readFileSync(path.join(root, 'game/clue-hunt-state.js'), 'utf8');
  assert.doesNotMatch(src, /Who is missing/);
  assert.doesNotMatch(src, /answer: "Leo"/);
});

test('each hotspot has one useful action and the others add nothing', () => {
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
  const found = ClueHunt.visit(start, 'stall', 'tickets');
  assert.deepEqual(start.order, []);
  assert.equal(found.added, true);
  assert.equal(found.duplicate, false);
  assert.equal(found.reply, 'The raffle tickets are gone. The flags and the old books are still there.');
  assert.deepEqual(ClueHunt.notebook(found.state).map((card) => card.id), ['stall']);
});

test('revisiting a hotspot does not duplicate its card', () => {
  const once = ClueHunt.visit(ClueHunt.createHunt(), 'hall', 'comedy');
  const twice = ClueHunt.visit(once.state, 'hall', 'comedy');
  const aside = ClueHunt.visit(once.state, 'hall', 'when');
  assert.equal(twice.added, false);
  assert.equal(twice.duplicate, true);
  assert.equal(twice.state.order.length, 1);
  assert.equal(aside.added, false);
  assert.equal(aside.duplicate, false);
  assert.equal(aside.reply, 'The comedy is in the afternoon. I did not see him at noon.');
  assert.equal(aside.state.order.length, 1);
  assert.equal(ClueHunt.notebook(twice.state)[0].text, 'A comedy is on in the school hall. A boy came in with the raffle box.');
});

test('solve stays locked until all four cards exist, in any order', () => {
  let state = ClueHunt.createHunt();
  const steps = [['film', 'asked'], ['store', 'noon'], ['hall', 'comedy'], ['stall', 'tickets']];
  steps.forEach((pair, index) => {
    state = ClueHunt.visit(state, pair[0], pair[1]).state;
    assert.equal(ClueHunt.solveUnlocked(state), index === 3);
  });
  assert.deepEqual(ClueHunt.notebook(state).map((card) => card.id), ['film', 'store', 'hall', 'stall']);
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

test('practice questions confirm the true cards and do not ask who is missing', () => {
  assert.equal(ClueHunt.PRACTICE.length, 3);
  assert.deepEqual(ClueHunt.PRACTICE.map((item) => item.kind), ['Vocab', 'Grammar', 'Vocab']);
  assert.deepEqual(ClueHunt.PRACTICE.map((item) => item.id), ['table', 'hall-sentence', 'asked']);
  assert.equal(ClueHunt.PRACTICE[1].prompt, 'A comedy ___ on in the school hall.');
  assert.equal(ClueHunt.PRACTICE[1].answer, 'is');
  assert.deepEqual(Object.keys(ClueHunt.CASE), ['who', 'where']);
  assert.equal(ClueHunt.CASE.who.answer, 'The film club');
  assert.equal(ClueHunt.CASE.where.answer, 'In the school hall');
  assert.deepEqual(ClueHunt.CASE.where.options, [
    'In the school hall',
    'In the storeroom',
    'Beside the prize wheel',
    'At the charity stall'
  ]);
  const joined = JSON.stringify(ClueHunt.PRACTICE) + JSON.stringify(ClueHunt.CASE);
  assert.doesNotMatch(joined, /Who is missing/);
  assert.doesNotMatch(joined, /Vocab · Unit/);
  assert.doesNotMatch(joined, /Grammar ·/);
});

test('a wrong practice answer hints that card and hides the ending', () => {
  const result = ClueHunt.submitSolve(
    { table: 'The raffle tickets', 'hall-sentence': 'is', asked: 'The film club' },
    { who: 'The film club', where: 'In the school hall' }
  );
  assert.deepEqual(result, { ok: false, hint: 'Read the charity stall card again.', ending: '' });
});

test('a wrong case answer names the card to reread and does not reveal the ending', () => {
  const whoOnly = ClueHunt.submitSolve(practiceOk(), { who: 'Ken', where: 'In the school hall' });
  const whereOnly = ClueHunt.submitSolve(practiceOk(), { who: 'The film club', where: 'In the storeroom' });
  const both = ClueHunt.submitSolve(practiceOk(), { who: 'Miss Chan', where: 'Beside the prize wheel' });
  assert.equal(whoOnly.ok, false);
  assert.equal(whoOnly.ending, '');
  assert.equal(whoOnly.hint, 'Read the film club card again.');
  assert.equal(whereOnly.hint, 'Read the school hall card again.');
  assert.equal(both.hint, 'Read the film club card and the school hall card again.');
  assert.doesNotMatch(both.hint, /took the raffle tickets/);
});

test('the correct pair returns the one ending', () => {
  const result = ClueHunt.submitSolve(practiceOk(), {
    who: 'The film club',
    where: 'In the school hall'
  });
  assert.deepEqual(result, {
    ok: true,
    hint: '',
    ending: 'The film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe, and the stall can collect the tickets after the film.'
  });
  assert.equal(result.ending, ClueHunt.ENDING);
});
```

- [ ] **Step 3: Run the state tests and confirm they fail**

Run:

```bash
node --test test/clue-hunt-state.test.js
```

Expected: exit code 1. The output includes `Cannot find module '../game/clue-hunt-state.js'`.

- [ ] **Step 4: Write the state module**

Create `game/clue-hunt-state.js` with this exact source. Practice questions confirm the three true cards. They do not ask the player to mark the storeroom card false. A wrong place on the case step points at the school hall card, not back at Ken’s sentence as if it were the key.

```javascript
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClueHunt = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ENDING = "The film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe, and the stall can collect the tickets after the film.";

  var HOTSPOTS = [
    {
      id: "stall",
      name: "Charity stall",
      kind: "search",
      art: "../practice/grammar/illust/u1_s4_carnival_stalls.jpg",
      intro: "Tap the table. Look for what left with Leo.",
      cardTitle: "Charity stall",
      cardText: "The raffle tickets are gone. The flags and the old books are still there.",
      misleading: false,
      spots: [
        { id: "tickets", label: "Empty raffle spot", useful: true, reply: "The raffle tickets are gone. The flags and the old books are still there." },
        { id: "flags", label: "Flags", useful: false, reply: "The flags are still on the table." },
        { id: "books", label: "Old books", useful: false, reply: "The old books are still there." }
      ]
    },
    {
      id: "hall",
      name: "School hall",
      kind: "talk",
      art: "../practice/grammar/illust/u4_comedy.png",
      intro: "A student is watching the film.",
      cardTitle: "School hall",
      cardText: "A comedy is on in the school hall. A boy came in with the raffle box.",
      misleading: false,
      prompts: [
        { id: "comedy", label: "What is on in the hall?", useful: true, reply: "A comedy is on in the school hall. A boy came in with the raffle box." },
        { id: "when", label: "What time did you see him?", useful: false, reply: "The comedy is in the afternoon. I did not see him at noon." },
        { id: "ken", label: "Was Ken here?", useful: false, reply: "I did not see Ken in the hall." }
      ]
    },
    {
      id: "film",
      name: "Film club",
      kind: "talk",
      art: "../practice/grammar/illust/u4_curious.png",
      intro: "Amy left the stall with Leo. She is here with the film club list.",
      cardTitle: "Film club",
      cardText: "The film club asked Amy to bring the tickets for their comedy draw.",
      misleading: false,
      prompts: [
        { id: "asked", label: "Who asked for the tickets?", useful: true, reply: "The film club asked Amy to bring the tickets for their comedy draw." },
        { id: "caretaker", label: "Did the caretaker take the box?", useful: false, reply: "No. The caretaker did not ask for the tickets." },
        { id: "wheel", label: "Is Leo at the prize wheel?", useful: false, reply: "Ken looked beside the prize wheel. Leo was not there." }
      ]
    },
    {
      id: "store",
      name: "Storeroom",
      kind: "talk",
      art: "../practice/grammar/illust/u4_timid.png",
      intro: "Ken is by the storeroom door.",
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

  var PRACTICE = [
    {
      id: "table",
      kind: "Vocab",
      prompt: "What is still on the charity stall table?",
      options: ["The flags and the old books", "The raffle tickets", "A pet", "The prize wheel"],
      answer: "The flags and the old books",
      hint: "Read the charity stall card again."
    },
    {
      id: "hall-sentence",
      kind: "Grammar",
      prompt: "A comedy ___ on in the school hall.",
      options: ["is", "are", "am", "be"],
      answer: "is",
      hint: "Read the school hall card again."
    },
    {
      id: "asked",
      kind: "Vocab",
      prompt: "Who asked Amy to bring the tickets?",
      options: ["The film club", "Ken", "Miss Chan", "The caretaker"],
      answer: "The film club",
      hint: "Read the film club card again."
    }
  ];

  var CASE = {
    who: {
      prompt: "Who took the box?",
      options: ["The film club", "Ken", "Miss Chan", "The caretaker"],
      answer: "The film club"
    },
    where: {
      prompt: "Where is Leo?",
      options: ["In the school hall", "In the storeroom", "Beside the prize wheel", "At the charity stall"],
      answer: "In the school hall"
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
    return state.order.length === 4;
  }

  function displayCard(card) {
    return { title: card.title, text: card.text };
  }

  function caseHint(picks) {
    var whoOk = picks.who === CASE.who.answer;
    var whereOk = picks.where === CASE.where.answer;
    if (!whoOk && !whereOk) return "Read the film club card and the school hall card again.";
    if (!whoOk) return "Read the film club card again.";
    return "Read the school hall card again.";
  }

  function submitSolve(practiceAnswers, picks) {
    var answers = practiceAnswers || {};
    var chosen = picks || {};
    for (var i = 0; i < PRACTICE.length; i++) {
      if (answers[PRACTICE[i].id] !== PRACTICE[i].answer) {
        return { ok: false, hint: PRACTICE[i].hint, ending: "" };
      }
    }
    if (chosen.who !== CASE.who.answer || chosen.where !== CASE.where.answer) {
      return { ok: false, hint: caseHint(chosen), ending: "" };
    }
    return { ok: true, hint: "", ending: ENDING };
  }

  return {
    HOTSPOTS: HOTSPOTS,
    PRACTICE: PRACTICE,
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

Expected: exit code 0. The output includes `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add test/clue-hunt-state.test.js game/clue-hunt-state.js
git commit -m "$(cat <<'EOF'
feat: add Clue Hunt notebook and solve state

EOF
)"
```

Expected: one commit, and `git status --short` prints nothing.

---

### Task 2: Map page structure

**Files:**
- Modify: `game/clue-hunt.html` (replace the whole file)
- Modify: `game/index.html` (the Clue Hunt card paragraph only)
- Modify: `test/game-hub.test.js` (replace the whole file)
- Create: `test/clue-hunt-map.test.js`
- Test: `test/clue-hunt-map.test.js`, `test/game-hub.test.js`

**Interfaces:**
- Consumes: `game/clue-hunt-state.js` from Task 1, loaded by `<script src="clue-hunt-state.js"></script>`
- Produces: DOM ids `intro`, `start-map`, `fair-map`, `scene`, `scene-kicker`, `scene-title`, `scene-art`, `scene-reply`, `scene-actions`, `back-map`, `notebook`, `notebook-empty`, `notebook-cards`, `open-solve`, `solve`, `solve-back`, `practice`, `who-choices`, `where-choices`, `solve-btn`, `solve-feedback`, `ending`, `ending-copy`, `step-label`. Hotspot buttons use `data-hotspot` values `stall`, `hall`, `film`, and `store`.

- [ ] **Step 1: Write the failing page-source tests**

Replace `test/game-hub.test.js` with:

```javascript
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
  assert.match(hub, />Clue Hunt</);
  assert.match(hub, /href="\.\.\/index\.html"/);
  assert.match(hub, /Walk the school fair, fill your notebook/);
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
```

Create `test/clue-hunt-map.test.js` with:

```javascript
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
```

- [ ] **Step 2: Run the page tests and confirm they fail**

Run:

```bash
node --test test/clue-hunt-map.test.js test/game-hub.test.js
```

Expected: exit code 1. The output says the current `game/clue-hunt.html` does not match `/id="fair-map"/` or does not match `/Walk the school fair, fill your notebook/`.

- [ ] **Step 3: Replace the Clue Hunt page and the hub blurb**

Replace `game/clue-hunt.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<title>Clue Hunt · Game</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../practice/grammar/grammar.css?v=36"/>
<link rel="stylesheet" href="game.css?v=2"/>
</head>
<body>
<header class="prac-header">
  <a class="back" href="index.html">← Game</a>
  <h1>Clue Hunt</h1>
  <p class="sub" id="step-label">Look around the school fair</p>
</header>
<main class="wrap">
  <div class="hunt-layout">
    <div class="hunt-stage">
      <section id="intro">
        <div class="case-art">
          <img src="../practice/grammar/illust/u1_09_fair.jpg" alt="" width="640" height="480"/>
        </div>
        <p class="case-lead" id="case-lead">Leo has not come back from the charity stall. The raffle box is gone too. Look around the fair and write what you find in the notebook.</p>
        <div class="btn-row">
          <button type="button" class="btn btn-primary" id="start-map">Look around the fair</button>
        </div>
      </section>
      <section id="fair-map" hidden>
        <h2 class="hunt-q">School fair</h2>
        <div class="fair-map">
          <button type="button" class="hotspot" data-hotspot="stall">
            <img src="../practice/grammar/illust/u1_s4_carnival_stalls.jpg" alt="" width="320" height="240"/>
            Charity stall
          </button>
          <button type="button" class="hotspot" data-hotspot="hall">
            <img src="../practice/grammar/illust/u4_comedy.png" alt="" width="320" height="240"/>
            School hall
          </button>
          <button type="button" class="hotspot" data-hotspot="film">
            <img src="../practice/grammar/illust/u4_curious.png" alt="" width="320" height="240"/>
            Film club
          </button>
          <button type="button" class="hotspot" data-hotspot="store">
            <img src="../practice/grammar/illust/u4_timid.png" alt="" width="320" height="240"/>
            Storeroom
          </button>
        </div>
      </section>
      <section id="scene" hidden>
        <div class="btn-row">
          <button type="button" class="btn btn-ghost" id="back-map">Back to the map</button>
        </div>
        <p class="hunt-kind" id="scene-kicker"></p>
        <h2 class="hunt-q" id="scene-title"></h2>
        <img id="scene-art" alt="" width="640" height="480"/>
        <p class="case-lead" id="scene-reply"></p>
        <div class="choices" id="scene-actions"></div>
      </section>
      <section id="solve" hidden>
        <div class="btn-row">
          <button type="button" class="btn btn-ghost" id="solve-back">Back to the map</button>
        </div>
        <h2 class="hunt-q">Solve the case</h2>
        <div id="practice"></div>
        <span class="solve-label">Who took the box?</span>
        <div class="choices" id="who-choices"></div>
        <span class="solve-label">Where is Leo?</span>
        <div class="choices" id="where-choices"></div>
        <div class="btn-row">
          <button type="button" class="btn btn-primary" id="solve-btn" disabled>Close the case</button>
        </div>
        <p class="hint" id="solve-feedback" hidden></p>
      </section>
      <section class="ending" id="ending" hidden>
        <h2>Found it</h2>
        <p id="ending-copy"></p>
      </section>
    </div>
    <aside id="notebook" class="notebook" hidden>
      <h2>Notebook</h2>
      <p id="notebook-empty">Nothing written yet.</p>
      <div id="notebook-cards"></div>
      <div class="btn-row">
        <button type="button" class="btn btn-primary" id="open-solve" disabled>Solve Case</button>
      </div>
    </aside>
  </div>
</main>
<script src="clue-hunt-state.js"></script>
<script>
(function () {
  document.getElementById("start-map").addEventListener("click", function () {
    document.getElementById("intro").hidden = true;
    document.getElementById("fair-map").hidden = false;
    document.getElementById("notebook").hidden = false;
  });
})();
</script>
</body>
</html>
```

In `game/index.html`, replace the Clue Hunt paragraph with:

```html
<p>Leo left the charity stall and did not come back. Walk the school fair, fill your notebook, and find who took the box and where he is.</p>
```

Do not edit `index.html`.

- [ ] **Step 4: Run the page tests and confirm they pass**

Run:

```bash
node --test test/clue-hunt-map.test.js test/game-hub.test.js test/clue-hunt-state.test.js test/home-nav.test.js
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt.html game/index.html test/game-hub.test.js test/clue-hunt-map.test.js
git commit -m "$(cat <<'EOF'
feat: rebuild Clue Hunt as a school-fair map page

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 3: Map, notebook, and scene styles

**Files:**
- Modify: `game/game.css` (replace the whole file)
- Modify: `game/clue-hunt.html` (one stylesheet query: `game.css?v=2` becomes `game.css?v=3`)
- Modify: `test/clue-hunt-map.test.js` (append one test)
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: the class names and ids from Task 2: `hunt-layout`, `fair-map`, `hotspot`, `notebook`, `clue-card`, `practice-q`, `scene-art`, `case-art`
- Produces: those rules in `game/game.css`, with `border: 0` on the hotspot, notebook, clue card, and practice question, and `object-fit: contain` on the pictures

- [ ] **Step 1: Append the failing CSS test**

Append this test to `test/clue-hunt-map.test.js`:

```javascript
test('clue hunt styles use fills and contain the pictures', () => {
  const html = huntHtml();
  const css = fs.readFileSync(path.join(root, 'game/game.css'), 'utf8');
  assert.match(html, /game\.css\?v=3/);
  assert.match(css, /\.fair-map \{/);
  assert.match(css, /\.hotspot \{[^}]*border:\s*0/);
  assert.match(css, /\.notebook \{[^}]*border:\s*0/);
  assert.match(css, /\.clue-card \{[^}]*border:\s*0/);
  assert.match(css, /\.practice-q \{[^}]*border:\s*0/);
  assert.match(css, /#scene-art \{[^}]*object-fit:\s*contain/);
  assert.match(css, /\.hotspot img \{[^}]*object-fit:\s*contain/);
});
```

- [ ] **Step 2: Run the CSS test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "clue hunt styles use fills" test/clue-hunt-map.test.js
```

Expected: exit code 1. The failure says the HTML or CSS did not match `game.css?v=3` or `.fair-map {`.

- [ ] **Step 3: Replace the stylesheet and bump the link**

In `game/clue-hunt.html`, change:

```html
<link rel="stylesheet" href="game.css?v=2"/>
```

to:

```html
<link rel="stylesheet" href="game.css?v=3"/>
```

Replace `game/game.css` with:

```css
.case-art {
  width: fit-content;
  max-width: min(100%, 420px);
  margin: 0 auto 0.8rem;
  background: color-mix(in srgb, var(--pink) 28%, #fff);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.case-art img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: min(28vh, 220px);
  margin: 0 auto;
  object-fit: contain;
}
.case-lead {
  margin: 0 0 0.85rem;
  font-weight: 700;
  color: var(--navy);
}
.hunt-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 17rem);
  gap: 0.8rem;
  align-items: start;
}
.fair-map {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
  margin: 0 0 0.9rem;
}
.hotspot {
  border: 0;
  border-radius: 16px;
  background: color-mix(in srgb, var(--sunny) 55%, #fff);
  color: var(--navy);
  font-family: var(--font-display);
  font-weight: 650;
  font-size: 1rem;
  padding: 0.7rem;
  text-align: left;
  cursor: pointer;
}
.hotspot img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 92px;
  margin: 0 auto 0.35rem;
  object-fit: contain;
  border-radius: 12px;
}
.hotspot:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: 2px;
}
#scene-art {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: min(28vh, 220px);
  margin: 0 auto 0.8rem;
  object-fit: contain;
  border-radius: 12px;
  background: color-mix(in srgb, var(--pink) 28%, #fff);
}
.notebook {
  border: 0;
  border-radius: 16px;
  background: color-mix(in srgb, var(--sky) 22%, #fff);
  color: var(--navy);
  padding: 0.75rem;
}
.notebook h2 {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
}
.notebook.is-open {
  background: color-mix(in srgb, var(--sunny) 34%, #fff);
}
.notebook-empty,
#notebook-empty {
  margin: 0 0 0.55rem;
  font-weight: 700;
}
.clue-card {
  margin: 0 0 0.45rem;
  padding: 0.55rem 0.65rem;
  border: 0;
  border-radius: 16px;
  background: color-mix(in srgb, var(--sky) 28%, #fff);
  color: var(--navy);
}
.clue-card strong {
  display: block;
  font-family: var(--font-display);
  font-size: 0.82rem;
  margin-bottom: 0.15rem;
}
.clue-card p {
  margin: 0;
  font-weight: 700;
  font-size: 0.92rem;
}
.hunt-q {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-weight: 650;
  font-size: 1.2rem;
  color: var(--navy);
}
.hunt-kind {
  margin: 0 0 0.35rem;
  font-weight: 700;
  color: var(--muted);
  font-size: 0.85rem;
}
.practice-q {
  border: 0;
  margin: 0 0 0.8rem;
  padding: 0;
}
.practice-q legend {
  padding: 0;
  margin: 0 0 0.3rem;
  font-weight: 800;
  color: var(--navy);
}
.solve-label {
  display: block;
  margin: 0.55rem 0 0.3rem;
  font-weight: 800;
  color: var(--navy);
}
.hint {
  margin: 0.6rem 0 0;
  font-weight: 700;
  color: var(--navy);
}
.ending {
  margin-top: 0.8rem;
  padding: 0.85rem 0.95rem;
  border: 0;
  border-radius: 16px;
  background: color-mix(in srgb, var(--green) 18%, #fff);
  color: var(--navy);
  font-weight: 700;
}
.ending h2 {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
}
.ending p { margin: 0; }
@media (max-width: 720px) {
  .hunt-layout { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run the page tests and confirm they pass**

Run:

```bash
node --test test/clue-hunt-map.test.js test/game-hub.test.js test/clue-hunt-state.test.js
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add game/game.css game/clue-hunt.html test/clue-hunt-map.test.js
git commit -m "$(cat <<'EOF'
feat: style the Clue Hunt fair map and notebook

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 4: Exploration and solve wiring

**Files:**
- Modify: `game/clue-hunt.html` (replace only the inline script, not the `src="clue-hunt-state.js"` tag)
- Modify: `test/clue-hunt-map.test.js` (append one test)
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `ClueHunt.createHunt()`, `ClueHunt.visit(state, hotspotId, actionId)`, `ClueHunt.notebook(state)`, `ClueHunt.solveUnlocked(state)`, `ClueHunt.displayCard(card)`, `ClueHunt.submitSolve(practiceAnswers, picks)`, `ClueHunt.HOTSPOTS`, `ClueHunt.PRACTICE`, `ClueHunt.CASE`, and the DOM ids from Task 2
- Produces: a page script that lets the player open hotspots in any order, writes each card once, unlocks Solve Case after four cards, grades practice before who and where, shows `result.hint` on a miss, and shows `result.ending` on a hit

- [ ] **Step 1: Append the failing wiring test**

Append this test to `test/clue-hunt-map.test.js`:

```javascript
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
```

- [ ] **Step 2: Run the wiring test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "page script explores before it grades" test/clue-hunt-map.test.js
```

Expected: exit code 1. The current stub script does not match `/ClueHunt\.visit/`.

- [ ] **Step 3: Replace the inline script**

Replace the second `<script>` block in `game/clue-hunt.html` (the inline one, not `<script src="clue-hunt-state.js"></script>`) with:

```html
<script>
(function () {
  var hunt = ClueHunt.createHunt();
  var practicePicks = {};
  var casePicks = { who: null, where: null };
  var ended = false;

  var intro = document.getElementById("intro");
  var map = document.getElementById("fair-map");
  var scene = document.getElementById("scene");
  var notebook = document.getElementById("notebook");
  var cardsEl = document.getElementById("notebook-cards");
  var emptyEl = document.getElementById("notebook-empty");
  var solve = document.getElementById("solve");
  var ending = document.getElementById("ending");
  var openSolve = document.getElementById("open-solve");
  var replyEl = document.getElementById("scene-reply");
  var actionsEl = document.getElementById("scene-actions");
  var stepLabel = document.getElementById("step-label");
  var feedback = document.getElementById("solve-feedback");
  var solveBtn = document.getElementById("solve-btn");

  function hotspotById(id) {
    return ClueHunt.HOTSPOTS.filter(function (item) { return item.id === id; })[0];
  }

  function renderNotebook() {
    var cards = ClueHunt.notebook(hunt);
    cardsEl.innerHTML = "";
    emptyEl.hidden = cards.length > 0;
    cards.forEach(function (card) {
      var view = ClueHunt.displayCard(card);
      var article = document.createElement("article");
      article.className = "clue-card";
      article.setAttribute("data-card", card.id);
      var title = document.createElement("strong");
      title.textContent = view.title;
      var body = document.createElement("p");
      body.textContent = view.text;
      article.appendChild(title);
      article.appendChild(body);
      cardsEl.appendChild(article);
    });
    openSolve.disabled = ended || !solve.hidden || !ClueHunt.solveUnlocked(hunt);
    notebook.classList.toggle("is-open", !solve.hidden || !ending.hidden);
  }

  function showMap() {
    if (ended) return;
    intro.hidden = true;
    scene.hidden = true;
    solve.hidden = true;
    ending.hidden = true;
    map.hidden = false;
    notebook.hidden = false;
    stepLabel.textContent = "Walk the school fair";
    renderNotebook();
  }

  function renderActions(hotspot) {
    actionsEl.innerHTML = "";
    var items = hotspot.kind === "search" ? hotspot.spots : hotspot.prompts;
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = item.label;
      btn.addEventListener("click", function () {
        var result = ClueHunt.visit(hunt, hotspot.id, item.id);
        hunt = result.state;
        replyEl.textContent = result.reply;
        renderNotebook();
      });
      actionsEl.appendChild(btn);
    });
  }

  function openHotspot(id) {
    if (ended) return;
    var hotspot = hotspotById(id);
    map.hidden = true;
    solve.hidden = true;
    ending.hidden = true;
    scene.hidden = false;
    notebook.hidden = false;
    document.getElementById("scene-kicker").textContent = hotspot.kind === "search" ? "Search" : "Talk";
    document.getElementById("scene-title").textContent = hotspot.name;
    document.getElementById("scene-art").src = hotspot.art;
    replyEl.textContent = hotspot.intro;
    renderActions(hotspot);
    stepLabel.textContent = hotspot.name;
    renderNotebook();
  }

  function renderPractice() {
    var box = document.getElementById("practice");
    box.innerHTML = "";
    practicePicks = {};
    ClueHunt.PRACTICE.forEach(function (q) {
      var block = document.createElement("fieldset");
      block.className = "practice-q";
      var legend = document.createElement("legend");
      legend.textContent = q.prompt;
      block.appendChild(legend);
      var kind = document.createElement("p");
      kind.className = "hunt-kind";
      kind.textContent = q.kind;
      block.appendChild(kind);
      var choices = document.createElement("div");
      choices.className = "choices";
      q.options.forEach(function (opt) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice";
        btn.textContent = opt;
        btn.addEventListener("click", function () {
          practicePicks[q.id] = opt;
          Array.prototype.forEach.call(choices.children, function (el) { el.classList.remove("selected"); });
          btn.classList.add("selected");
        });
        choices.appendChild(btn);
      });
      block.appendChild(choices);
      box.appendChild(block);
    });
  }

  function renderCaseGroup(container, key, options) {
    container.innerHTML = "";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = opt;
      btn.addEventListener("click", function () {
        casePicks[key] = opt;
        Array.prototype.forEach.call(container.children, function (el) { el.classList.remove("selected"); });
        btn.classList.add("selected");
        solveBtn.disabled = !(casePicks.who && casePicks.where);
      });
      container.appendChild(btn);
    });
  }

  function openSolvePanel() {
    if (ended || !ClueHunt.solveUnlocked(hunt)) return;
    map.hidden = true;
    scene.hidden = true;
    ending.hidden = true;
    solve.hidden = false;
    notebook.hidden = false;
    casePicks = { who: null, where: null };
    solveBtn.disabled = true;
    feedback.hidden = true;
    feedback.textContent = "";
    stepLabel.textContent = "Who took the box, and where is Leo?";
    renderPractice();
    renderCaseGroup(document.getElementById("who-choices"), "who", ClueHunt.CASE.who.options);
    renderCaseGroup(document.getElementById("where-choices"), "where", ClueHunt.CASE.where.options);
    renderNotebook();
  }

  document.getElementById("start-map").addEventListener("click", showMap);
  document.getElementById("back-map").addEventListener("click", showMap);
  document.getElementById("solve-back").addEventListener("click", showMap);
  openSolve.addEventListener("click", openSolvePanel);

  Array.prototype.forEach.call(document.querySelectorAll(".hotspot"), function (btn) {
    btn.addEventListener("click", function () {
      openHotspot(btn.getAttribute("data-hotspot"));
    });
  });

  solveBtn.addEventListener("click", function () {
    var result = ClueHunt.submitSolve(practicePicks, casePicks);
    feedback.hidden = false;
    if (!result.ok) {
      feedback.textContent = result.hint;
      return;
    }
    ended = true;
    solve.hidden = true;
    map.hidden = true;
    scene.hidden = true;
    ending.hidden = false;
    document.getElementById("ending-copy").textContent = result.ending;
    stepLabel.textContent = "Case closed";
    renderNotebook();
  });
})();
</script>
```

Leave the `<script src="clue-hunt-state.js"></script>` tag above it. Do not edit `index.html`.

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
feat: wire Clue Hunt exploration and the solve page

EOF
)"
```

Expected: `git status --short` prints nothing.

---

### Task 5: Manual check and ship

**Files:**
- Modify: none unless a check below fails
- Test: the four test files from Tasks 1–4, then the local page and the live page

**Interfaces:**
- Consumes: the page and state module from Tasks 1–4
- Produces: `main` containing those commits. Live Clue Hunt is served from `https://cynthiasumyi-spec.github.io/revision-flashcards/game/clue-hunt.html`.

- [ ] **Step 1: Re-run the automated tests**

Run:

```bash
node --test test/clue-hunt-state.test.js test/clue-hunt-map.test.js test/game-hub.test.js test/home-nav.test.js
```

Expected: exit code 0.

- [ ] **Step 2: Play the local page**

From the repository root, start a static server if one is not already serving this repo:

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/` and `http://127.0.0.1:8765/game/clue-hunt.html`. Check both a 1280px-wide window and a 390px-wide window.

Expected, in this order:

1. The home header contains only Revision and Practice. There is no Game link.
2. The Achievements banner still says “Unlock your badges!”.
3. Be a Detective is at the top-left of the cream packs panel and opens `game/clue-hunt.html`.
4. The intro names Leo, the charity stall, and the missing raffle box. It has no choice buttons.
5. “Look around the fair” shows four hotspots: Charity stall, School hall, Film club, Storeroom. Solve Case is disabled. The notebook says “Nothing written yet.”
6. Open Storeroom and choose “What time did you see Leo?”. The notebook shows “Ken says he saw Leo go into the storeroom at noon.” The words false and wrong are not on that card.
7. Ask “What time did you see Leo?” again. The notebook still has one Storeroom card.
8. Ask “Who took the box?” in the storeroom. A reply appears, and the notebook still has one card.
9. Use Back to the map. Open the other three stops and choose “Empty raffle spot”, “What is on in the hall?”, and “Who asked for the tickets?”. Solve Case becomes enabled only after the fourth card. The four cards can be collected in any order.
10. Open Solve Case. The map is replaced by the solve page, the notebook stays visible with all four sentences, and Back to the map returns to the four hotspots without clearing the notebook.
11. The solve page has three practice questions, then “Who took the box?” and “Where is Leo?”. It does not ask who is missing.
12. Choose “The flags and the old books”, “is”, and “The film club”, then choose Ken and “In the storeroom”, and press Close the case. The feedback is “Read the film club card and the school hall card again.” The ending stays hidden. The notebook is unchanged.
13. Choose “The film club” and “In the school hall”, and press Close the case again. The ending reads: “The film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe, and the stall can collect the tickets after the film.”
14. After the ending, the map hotspots no longer open a new scene.
15. At 390px and at 1280px, the notebook is readable, the four hotspots are tappable, and the fair pictures are fully visible inside their rounded frames.

- [ ] **Step 3: Commit a fix only if a check failed**

If Step 1 or Step 2 forced a code change, re-run Step 1, then:

```bash
git add game/clue-hunt-state.js game/clue-hunt.html game/game.css game/index.html test/clue-hunt-state.test.js test/clue-hunt-map.test.js test/game-hub.test.js
git commit -m "$(cat <<'EOF'
fix: Clue Hunt map explore follow-ups

EOF
)"
```

If `git status --short` is empty, do not create a commit.

- [ ] **Step 4: Push the branch and fast-forward main**

```bash
git push -u origin cursor/clue-hunt-map-explore-6c4f
git checkout main
git merge --ff-only cursor/clue-hunt-map-explore-6c4f
git push origin main
```

If `git push -u` is rejected because the branch already exists on the remote, run `git push origin cursor/clue-hunt-map-explore-6c4f` instead. A pull request for this repository returns `must be a collaborator`. The fast-forward push above is the ship path. Do not force-push `main`.

- [ ] **Step 5: Confirm the live page**

```bash
gh run list --workflow pages-build-deployment --limit 1 --json databaseId,headSha,status,conclusion
gh run watch <databaseId> --exit-status
```

Replace `<databaseId>` with the id whose `headSha` is the `main` commit just pushed.

Expected: the watch command exits 0 and the conclusion is `success`.

Then:

```bash
python3 - << 'PY'
import urllib.request
url = "https://cynthiasumyi-spec.github.io/revision-flashcards/game/clue-hunt.html?live=map"
html = urllib.request.urlopen(urllib.request.Request(url, headers={"Cache-Control": "no-cache"})).read().decode()
home = urllib.request.urlopen(urllib.request.Request(
    "https://cynthiasumyi-spec.github.io/revision-flashcards/?live=map",
    headers={"Cache-Control": "no-cache"})).read().decode()
nav = home.split('<nav class="nav-plain"', 1)[1].split('</nav>', 1)[0]
assert "fair-map" in html
assert "clue-hunt-state.js" in html
assert "Who is missing" not in html
assert ">Game<" not in nav
assert 'href="game/clue-hunt.html"' in home
print("live clue hunt ok")
PY
```

Expected: the script prints `live clue hunt ok`.

---

## Spec coverage

Checked against `docs/superpowers/specs/2026-11-05-clue-hunt-map-explore-design.md`.

| Spec requirement | Plan |
| --- | --- |
| Exploration, not a quiz that unlocks cards | Task 2 removes the sealed-card quiz. Task 4 adds cards from `visit`, before `submitSolve`. |
| Vocabulary and grammar on the solve page | Task 1 `PRACTICE`: Vocab table, Grammar “is”, Vocab film club. |
| Be a Detective entry and no Game nav | No task edits `index.html`. Task 2 keeps the home test. Task 5 checks both. |
| Campus map with stall, hall, film club, storeroom | Task 2 HTML. Task 1 ids `stall`, `hall`, `film`, `store`. |
| Stall is search; hall, film club, and storeroom are talk | Task 1 `kind` values and the action tests. |
| One useful question or spot, other taps do not score | Task 1 “one useful action” test. Task 4 renders every action through `visit`. |
| Four cards, no fifth required card | Task 1 hotspot length and `solveUnlocked`. |
| Exactly one misleading card: Ken at noon, unlabeled | Task 1 misleading filter and `displayCard`. Task 4 forbids the page script from reading `misleading`. |
| Notebook always visible on the map and inside a hotspot | Task 2 aside stays outside the stage. Task 4 never sets `notebook.hidden = true` after the intro. |
| Revisit does not duplicate a card | Task 1 revisit test. Task 4 uses that `visit` result. |
| Map stays open until the ending | Task 4 `showMap` and `openHotspot` return only when `ended` is true. Solve has Back to the map. |
| Solve unlocks after four cards | Task 1 `solveUnlocked`. Task 4 disables `#open-solve` until then. |
| Solve shows the notebook, practice, who, and where | Task 2 markers. Task 4 `openSolvePanel`. |
| No “who is missing?” picker | Task 1 `CASE` keys. Task 2 rejects `what-choices`. |
| Wrong answer hints a card and can be retried | Task 1 hint strings. Task 4 writes `result.hint` and does not clear `hunt`. |
| One ending | Task 1 `ENDING`. Task 4 copies `result.ending`. |
| P6 tone and reused fair art | Task 2 image paths. No new art pipeline. |
| Fill instead of borders, pictures contained | Task 3 CSS test. |
| Out of scope items are absent | No task adds endings, a timer, a second case, Practice embedding, scoring, or a Chinese mode. |
