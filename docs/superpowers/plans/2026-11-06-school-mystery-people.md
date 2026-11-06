# School Mystery People Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the School Mystery cast: You on the case intro, round avatars and names on talk bubbles, and a People album that starts with You and unlocks the others from talk.

**Architecture:** `game/clue-hunt-state.js` stays the pure module `node:test` loads with `require`. It gains a `people` map on hunt state and unlocks people inside `visit` without changing notebook cards or solve answers. `game/clue-hunt.html` draws the intro, the talk rows, and the People panel from that data. One PNG per person lives in `game/illust/people/` and is circular-cropped in CSS. The same path is used on the intro, in talk, and in People.

**Tech Stack:** Static HTML, CSS, and vanilla JavaScript on GitHub Pages. Tests are `node:test`, `node:assert/strict`, and `fs.readFileSync`. Portraits are official いらすとや PNGs downloaded with `curl`. No build step. No image generator.

This is one subsystem, the School Mystery page, so it stays one plan. Do not ship until Task 6. Tasks 1–5 may land on a branch; Task 6 fast-forwards `main`.

## Global Constraints

- Student-facing copy stays in English. P6 tone stays mild: a school fair, a missing boy who is safe, a box opened to pick a ticket. No violence and no threat.
- The page address stays `game/clue-hunt.html`. Do not rename the file.
- The home easter egg stays the text **Be a Detective** and the link `game/clue-hunt.html` in `index.html`. Do not edit that link or that label.
- Illustrations come only from official いらすとや files. Do not generate portraits. Do not crop faces out of `game/illust/scene-*.png`.
- The notebook stays clues only. People do not appear in `#notebook-cards`. Clue cards do not appear in the People album.
- Case answers stay Amy, “To pick a ticket in secret and win the new bike”, and “About 1:20”. Ken’s noon line stays unlabeled as false.
- Unlocks live only in the current page session, on the same object as the notebook. Do not write them to `localStorage`.
- The film-club replies stay in the third person (“She left…”). Do not rewrite them to “I”.
- When `game/game.css` changes, set the stylesheet link in `game/clue-hunt.html` to `game.css?v=23`. It is `game.css?v=22` today.
- `#notebook` stays a direct child of `.hunt-layout`, because `.hunt-layout:has(> #notebook[hidden])` depends on that.

---

## File structure

- `game/illust/people/you.png` — magnifying-glass boy, the player.
- `game/illust/people/amy.png` — blazer schoolgirl, the closest official jacket portrait.
- `game/illust/people/may.png` — elementary schoolgirl walking to school. She must not be the same file as Amy.
- `game/illust/people/leo.png` — elementary schoolboy walking to school.
- `game/illust/people/sam.png` — elementary schoolboy with a randoseru, no yellow hat, so he is not Leo.
- `game/illust/people/ken.png` — a different energetic boy, so he is not Leo or Sam.
- `game/illust/people/miss-chan.png` — smiling woman teacher with a pointer and a book.
- `game/illust/people/SOURCES.txt` — page URL, file URL, and the Drive mirror note.
- `game/clue-hunt-state.js` — `PEOPLE`, `createHunt().people`, `visit` unlocks, `peopleAlbum`, `personById`, `speakerId`.
- `game/clue-hunt.html` — You on **The case**, talk rows, `#open-people`, `#people`.
- `game/game.css` — `.person-avatar` circle, `.talk-line`, `.hunt-side-bar`, `.people-detail`.
- `test/clue-hunt-people.test.js` — unlock rules and key facts.
- `test/clue-hunt-map.test.js` — DOM hooks and `game.css?v=23`.
- `test/clue-hunt-state.test.js` — do not change expected notebook sentences. Re-run it to prove cards and solve answers still pass.

Ids and fields later tasks rely on:

```javascript
createHunt()
// { found: {}, order: [], people: { you: { fact: YOU_FACT } } }

YOU_FACT
// "You are a Primary 6 student. You are looking into what happened to the raffle box."

PEOPLE
// array, cast order:
// { id, name, art, speakerFor }
// speakerFor is "wheel" | "film" | "desk" | "store" | null
// art is "illust/people/<id>.png" except miss-chan, whose id is "miss-chan"

speakerId(hotspotId)          // "may" | "amy" | "miss-chan" | "ken" | null
personById(id)                 // one PEOPLE record
peopleAlbum(state)             // unlocked people in PEOPLE order: { id, name, art, fact }
visit(state, hotspotId, actionId)
// same return as today: { state, added, duplicate, reply, card }
// state.people gains the speaker, and Leo or Sam when the reply names them
// a search does not change state.people
// a useless talk still returns added: false and does not push state.order
```

---

### Task 1: Official portraits in the repo

**Files:**
- Create: `game/illust/people/you.png`
- Create: `game/illust/people/amy.png`
- Create: `game/illust/people/may.png`
- Create: `game/illust/people/leo.png`
- Create: `game/illust/people/sam.png`
- Create: `game/illust/people/ken.png`
- Create: `game/illust/people/miss-chan.png`
- Create: `game/illust/people/SOURCES.txt`
- Test: `test/clue-hunt-people.test.js`

**Interfaces:**
- Consumes: nothing from the game yet.
- Produces: seven PNG files whose paths match `PEOPLE[].art` in Task 2. `SOURCES.txt` tells Wu / Grok Bot to copy those same bytes into Drive folder `people/`.

The VM cannot upload into Wu’s Drive. Do not call the Drive API. Download into the repo, and say so in `SOURCES.txt`.

No official Primary 6 portrait of a girl in a blue jacket was on いらすとや. Amy uses the official blazer uniform (`seifuku4_blazer_girl.png`), which is a junior-high / high-school jacket, not a yellow-hat elementary uniform. Do not redraw her younger. May uses a different elementary schoolgirl so the two faces are not the same file.

- [ ] **Step 1: Write the failing file test**

Create `test/clue-hunt-people.test.js`:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const peopleDir = path.join(root, 'game/illust/people');
const files = ['you.png', 'amy.png', 'may.png', 'leo.png', 'sam.png', 'ken.png', 'miss-chan.png'];

test('seven irasutoya people portraits exist and differ', () => {
  const hashes = files.map((name) => {
    const buf = fs.readFileSync(path.join(peopleDir, name));
    assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', name);
    assert.ok(buf.length > 1000, name);
    return buf.toString('base64').slice(0, 80);
  });
  assert.equal(new Set(hashes).size, files.length);
  const sources = fs.readFileSync(path.join(peopleDir, 'SOURCES.txt'), 'utf8');
  assert.match(sources, /https:\/\/www\.irasutoya\.com\/2013\/08\/blog-post_7373\.html/);
  assert.match(sources, /https:\/\/www\.irasutoya\.com\/2015\/09\/blog-post_768\.html/);
  assert.match(sources, /https:\/\/www\.irasutoya\.com\/2016\/02\/blog-post_84\.html/);
  assert.match(sources, /Drive library folder people\//);
  assert.match(sources, /1DcRpsm74eklw_ces2NqQd_dp5xcU2KwN/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/clue-hunt-people.test.js`

Expected: FAIL because `game/illust/people` does not exist.

- [ ] **Step 3: Download the seven official files**

```bash
mkdir -p game/illust/people
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/you.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhC4-5UU4BRNQhcQSxc4itejid3E-XlcjTEqp72sdndlUHcsuIezDlw_7ASt6aqnniD1X-01ZGbiphwko64Av0wjNTs9hV3oOaQgGbedunrpHmIKc9EFhJRxA_I7YEipNpgfzDwsetx0pfs/s800/mushimegane_boy.png"
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/amy.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsFiF890ydvyTXHhXwaIgtpzkLRQYUr4ie1G77tmKjPst9oZMmWOmK6PUalzFtdb_v0g77eqBkbXlziivx0sgGuVOZdefnax2z5w5vD56KwSFSryz8o-pX2UTdjB2bKMV0s19vyS2mpEo/s800/seifuku4_blazer_girl.png"
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/may.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiw2g_UDq44tNp5dZ-uutCrFG1olbTC1NpDA7YOgMBGBgxp5srxeK_wEcMlcECwSKXARnrX6PNVVnftqbbEGAjDg6SENJfMPqLTkCOuWzt0F5V-E6sMnQamLHpcxqrkOK-SzofciNHj4YJQ/s800/tsugaku_girl.png"
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/leo.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWc8uAJXu58E8msMVjAPHfJIfnoVw7doym2ER66PqEoXF2AlKtYi9Un9idyrUFLNy1nEMD1wu68pNFeV-bPr_kM2x4T4oUXiZFMOlr-aFBYTuPsonvpnb1wjT-GaO2PFbVAkb-o3VZYDn9/s800/tsugaku_boy.png"
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/sam.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZD_0oZPdff5EXGhJq7npkiQcgRSOqhfJBAt1MwKX_T05RwhTiTTBjF4Z2cDbvd3hyoneBFlxFlMPrOv02XOPkkgDNzeyX9HfYanXuNH3hmbk2QZldkl6dfcUDMypva7y2d_BkWy1HtyOm/s1600/school_randoseru_boy.png"
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/ken.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPMlWIBQyODz4-vIG7xABOfS1sCfjf_0-UJzoEs_BBd9DO2JVmBUHxdDQOuSE-zmWMtU00Pp03WuPICzWQQ5tbe9hzwNHXKh7qBRb0dCBbyAVNvpZgEFke_gAVxVkQZB8qxpjqwjOG0Uw/s800/pose_genki01_boy.png"
curl -fsSL -A "Mozilla/5.0" -o game/illust/people/miss-chan.png \
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6cVGchklhipf-oWZV29_qEMbfma-eB8Xt3sfKNcgoWCtwnG4c-ElR7pzffKqG9-1PprYMJ8cJMBuMwrK_Uq-LGJEw4H7y6MzRfZI53C83A-qRD0Tq32bbPb9GNQ79s8xLxHDD16_RS91g/s800/job_teacher_woman.png"
```

Write `game/illust/people/SOURCES.txt` with this exact text:

```text
School Mystery people portraits. Official いらすとや only. Do not generate replacements.

You — boy with a magnifying glass, not a police officer
Page: https://www.irasutoya.com/2013/08/blog-post_7373.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhC4-5UU4BRNQhcQSxc4itejid3E-XlcjTEqp72sdndlUHcsuIezDlw_7ASt6aqnniD1X-01ZGbiphwko64Av0wjNTs9hV3oOaQgGbedunrpHmIKc9EFhJRxA_I7YEipNpgfzDwsetx0pfs/s800/mushimegane_boy.png
Repo: game/illust/people/you.png

Amy — blazer schoolgirl (junior-high / high-school jacket; closest official jacket portrait; do not redraw)
Page: https://www.irasutoya.com/2015/09/blog-post_768.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsFiF890ydvyTXHhXwaIgtpzkLRQYUr4ie1G77tmKjPst9oZMmWOmK6PUalzFtdb_v0g77eqBkbXlziivx0sgGuVOZdefnax2z5w5vD56KwSFSryz8o-pX2UTdjB2bKMV0s19vyS2mpEo/s800/seifuku4_blazer_girl.png
Repo: game/illust/people/amy.png

May — elementary schoolgirl, different file from Amy
Page: https://www.irasutoya.com/2013/11/blog-post_3364.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiw2g_UDq44tNp5dZ-uutCrFG1olbTC1NpDA7YOgMBGBgxp5srxeK_wEcMlcECwSKXARnrX6PNVVnftqbbEGAjDg6SENJfMPqLTkCOuWzt0F5V-E6sMnQamLHpcxqrkOK-SzofciNHj4YJQ/s800/tsugaku_girl.png
Repo: game/illust/people/may.png

Leo — elementary schoolboy walking to school
Page: https://www.irasutoya.com/2013/11/blog-post_508.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWc8uAJXu58E8msMVjAPHfJIfnoVw7doym2ER66PqEoXF2AlKtYi9Un9idyrUFLNy1nEMD1wu68pNFeV-bPr_kM2x4T4oUXiZFMOlr-aFBYTuPsonvpnb1wjT-GaO2PFbVAkb-o3VZYDn9/s800/tsugaku_boy.png
Repo: game/illust/people/leo.png

Sam — elementary schoolboy with a randoseru and no yellow hat
Page: https://www.irasutoya.com/2020/01/blog-post_35.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZD_0oZPdff5EXGhJq7npkiQcgRSOqhfJBAt1MwKX_T05RwhTiTTBjF4Z2cDbvd3hyoneBFlxFlMPrOv02XOPkkgDNzeyX9HfYanXuNH3hmbk2QZldkl6dfcUDMypva7y2d_BkWy1HtyOm/s1600/school_randoseru_boy.png
Repo: game/illust/people/sam.png

Ken — different boy from Leo and Sam
Page: https://www.irasutoya.com/2016/01/blog-post_2.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPMlWIBQyODz4-vIG7xABOfS1sCfjf_0-UJzoEs_BBd9DO2JVmBUHxdDQOuSE-zmWMtU00Pp03WuPICzWQQ5tbe9hzwNHXKh7qBRb0dCBbyAVNvpZgEFke_gAVxVkQZB8qxpjqwjOG0Uw/s800/pose_genki01_boy.png
Repo: game/illust/people/ken.png

Miss Chan — woman teacher
Page: https://www.irasutoya.com/2016/02/blog-post_84.html
File: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6cVGchklhipf-oWZV29_qEMbfma-eB8Xt3sfKNcgoWCtwnG4c-ElR7pzffKqG9-1PprYMJ8cJMBuMwrK_Uq-LGJEw4H7y6MzRfZI53C83A-qRD0Tq32bbPb9GNQ79s8xLxHDD16_RS91g/s800/job_teacher_woman.png
Repo: game/illust/people/miss-chan.png

Drive mirror: this VM cannot upload to Wu's Drive. Grok Bot or Wu should copy these seven PNGs into Drive library folder people/ at https://drive.google.com/drive/folders/1DcRpsm74eklw_ces2NqQd_dp5xcU2KwN and add the page URLs to that library's SOURCES.txt.
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test test/clue-hunt-people.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game/illust/people test/clue-hunt-people.test.js
git commit -m "feat: add School Mystery irasutoya portraits"
```

---

### Task 2: Cast data and unlock rules

**Files:**
- Modify: `game/clue-hunt-state.js` (add `PEOPLE` above `createHunt`, change `createHunt` and `visit`, export the new functions)
- Modify: `test/clue-hunt-people.test.js` (append tests; keep the file test from Task 1)
- Test: `test/clue-hunt-state.test.js` (re-run only)

**Interfaces:**
- Consumes: portrait paths from Task 1.
- Produces: `YOU_FACT`, `PEOPLE`, `speakerId`, `personById`, `peopleAlbum`, and `visit` that fills `state.people` without changing `reply`, `card`, `added`, or `order` for the existing cases.

- [ ] **Step 1: Write the failing unlock tests**

Append to `test/clue-hunt-people.test.js`:

```javascript
const ClueHunt = require('../game/clue-hunt-state.js');

test('a new hunt unlocks only You', () => {
  const album = ClueHunt.peopleAlbum(ClueHunt.createHunt());
  assert.deepEqual(album.map((person) => person.id), ['you']);
  assert.equal(album[0].name, 'You');
  assert.equal(album[0].fact, 'You are a Primary 6 student. You are looking into what happened to the raffle box.');
  assert.equal(album[0].art, 'illust/people/you.png');
});

test('the first question at a talk unlocks that speaker, even when the question is useless', () => {
  const may = ClueHunt.visit(ClueHunt.createHunt(), 'wheel', 'noon');
  assert.equal(may.added, false);
  assert.deepEqual(ClueHunt.peopleAlbum(may.state).map((person) => person.id), ['you', 'may']);
  assert.equal(ClueHunt.speakerId('wheel'), 'may');
  assert.equal(ClueHunt.speakerId('film'), 'amy');
  assert.equal(ClueHunt.speakerId('desk'), 'miss-chan');
  assert.equal(ClueHunt.speakerId('store'), 'ken');
  assert.equal(ClueHunt.speakerId('hall'), null);
});

test('a reply that names Leo or Sam unlocks that boy and keeps the first sentence', () => {
  const both = ClueHunt.visit(ClueHunt.createHunt(), 'wheel', 'jacket');
  const ids = ClueHunt.peopleAlbum(both.state).map((person) => person.id);
  assert.deepEqual(ids, ['you', 'may', 'leo', 'sam']);
  const leo = ClueHunt.personFact(both.state, 'leo');
  const sam = ClueHunt.personFact(both.state, 'sam');
  assert.equal(leo, 'About 1:15, I saw someone in a blue jacket leave the stall with Leo.');
  assert.equal(sam, 'Before that, Sam left with a big box.');
  const later = ClueHunt.visit(both.state, 'store', 'noon');
  assert.equal(ClueHunt.personFact(later.state, 'leo'), leo);
  assert.equal(ClueHunt.personFact(later.state, 'ken'), 'I saw Leo go into the storeroom at noon.');
});

test('searching does not unlock Leo, and Miss Chan unlocks only from her own talk', () => {
  const hall = ClueHunt.visit(ClueHunt.createHunt(), 'hall', 'box');
  assert.deepEqual(ClueHunt.peopleAlbum(hall.state).map((person) => person.id), ['you']);
  const store = ClueHunt.visit(ClueHunt.createHunt(), 'store', 'books');
  const ids = ClueHunt.peopleAlbum(store.state).map((person) => person.id);
  assert.deepEqual(ids, ['you', 'ken', 'sam']);
  assert.equal(ids.includes('miss-chan'), false);
  const chan = ClueHunt.visit(ClueHunt.createHunt(), 'desk', 'move');
  assert.equal(ClueHunt.personFact(chan.state, 'miss-chan'), 'I did not ask Sam, or anyone else, to move the raffle box.');
  assert.equal(ClueHunt.personFact(chan.state, 'sam'), 'I did not ask Sam, or anyone else, to move the raffle box.');
});

test('film club unlocks Amy without rewriting her third-person reply', () => {
  const film = ClueHunt.visit(ClueHunt.createHunt(), 'film', 'lunch');
  assert.match(film.reply, /^She left /);
  assert.equal(ClueHunt.personFact(film.state, 'amy'), film.reply.split(/(?<=\.)\s/)[0]);
  assert.equal(film.card.text, 'Amy left in her blue jacket just after lunch, and she came back later. She wished for the new bike. She said if she won the bike, she would not have to wait for the bus.');
});
```

Add `personFact` to the produced API. It returns `state.people[id].fact` or `""`.

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `node --test test/clue-hunt-people.test.js`

Expected: FAIL with `peopleAlbum is not a function` (the PNG test from Task 1 still passes).

- [ ] **Step 3: Implement cast and unlock**

In `game/clue-hunt-state.js`, add this above `createHunt` and use it from `visit`. Do not change `HOTSPOTS`, `CASE`, or `ENDING`.

```javascript
var YOU_FACT = "You are a Primary 6 student. You are looking into what happened to the raffle box.";

var PEOPLE = [
  { id: "you", name: "You", art: "illust/people/you.png", speakerFor: null },
  { id: "may", name: "May", art: "illust/people/may.png", speakerFor: "wheel" },
  { id: "amy", name: "Amy", art: "illust/people/amy.png", speakerFor: "film" },
  { id: "miss-chan", name: "Miss Chan", art: "illust/people/miss-chan.png", speakerFor: "desk" },
  { id: "ken", name: "Ken", art: "illust/people/ken.png", speakerFor: "store" },
  { id: "leo", name: "Leo", art: "illust/people/leo.png", speakerFor: null },
  { id: "sam", name: "Sam", art: "illust/people/sam.png", speakerFor: null }
];

function firstSentence(text) {
  var match = String(text).match(/[^.!?]*[.!?]/);
  return match ? match[0].trim() : String(text).trim();
}

function sentenceWith(text, name) {
  var parts = String(text).split(/(?<=[.!?])\s+/);
  var pattern = new RegExp("\\b" + name + "\\b");
  for (var i = 0; i < parts.length; i++) {
    if (pattern.test(parts[i])) return parts[i].trim();
  }
  return firstSentence(text);
}

function speakerId(hotspotId) {
  for (var i = 0; i < PEOPLE.length; i++) {
    if (PEOPLE[i].speakerFor === hotspotId) return PEOPLE[i].id;
  }
  return null;
}

function personById(id) {
  for (var i = 0; i < PEOPLE.length; i++) {
    if (PEOPLE[i].id === id) return PEOPLE[i];
  }
  return null;
}

function withPerson(state, id, fact) {
  if (state.people[id]) return state;
  var people = Object.assign({}, state.people);
  people[id] = { fact: fact };
  return { found: state.found, order: state.order, people: people };
}

function unlockFromTalk(state, hotspot, reply) {
  var next = state;
  var speaker = speakerId(hotspot.id);
  if (speaker) next = withPerson(next, speaker, firstSentence(reply));
  if (/\bLeo\b/.test(reply)) next = withPerson(next, "leo", sentenceWith(reply, "Leo"));
  if (/\bSam\b/.test(reply)) next = withPerson(next, "sam", sentenceWith(reply, "Sam"));
  return next;
}

function peopleAlbum(state) {
  return PEOPLE.filter(function (person) {
    return state.people[person.id];
  }).map(function (person) {
    return { id: person.id, name: person.name, art: person.art, fact: state.people[person.id].fact };
  });
}

function personFact(state, id) {
  return state.people[id] ? state.people[id].fact : "";
}
```

Change `createHunt` to:

```javascript
function createHunt() {
  return { found: {}, order: [], people: { you: { fact: YOU_FACT } } };
}
```

In `visit`, after `findAction` succeeds and before the `if (!action.useful)` return, set `state` from talk only:

```javascript
if (hotspot.kind === "talk") state = unlockFromTalk(state, hotspot, action.reply);
```

Every later `return` and the object built for a new card must use that `state`, including `state.people` on the new card object:

```javascript
var next = { found: found, order: state.order.concat([hotspot.id]), people: state.people };
```

The useless and duplicate returns already pass `state` through once the reassignment above is in place. Do not unlock inside the search branch.

Export `YOU_FACT`, `PEOPLE`, `speakerId`, `personById`, `peopleAlbum`, and `personFact` on the returned object.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test test/clue-hunt-people.test.js test/clue-hunt-state.test.js`

Expected: PASS. Notebook sentences, the six-card unlock, and the ending text are unchanged.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt-state.js test/clue-hunt-people.test.js
git commit -m "feat: unlock School Mystery people from talk"
```

---

### Task 3: You on the case intro

**Files:**
- Modify: `game/clue-hunt.html` (the `#intro` case block, about lines 26–28; stylesheet link line 11)
- Modify: `game/game.css` (add `.case-you` and `.person-avatar`)
- Modify: `test/clue-hunt-map.test.js` (the `game.css?v=22` assertion and a new intro assertion)
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `illust/people/you.png` and `YOU_FACT` from Tasks 1 and 2. The visible sentence is the same string as `YOU_FACT`.
- Produces: `#you-intro` and `.person-avatar` for Tasks 4 and 5.

- [ ] **Step 1: Write the failing intro assertion**

In `test/clue-hunt-map.test.js`, inside `intro leads to a six-stop paper map before any quiz`, after the Leo case-lead assertion, add:

```javascript
  assert.match(intro, /id="you-intro"/);
  assert.match(intro, /You are a Primary 6 student\. You are looking into what happened to the raffle box\./);
  assert.match(intro, /src="illust\/people\/you\.png"/);
  assert.match(intro, /Leo was looking after the raffle box at the school charity fair/);
```

In `clue hunt styles use fills and contain the pictures`, change `game.css?v=22` to `game.css?v=23` and add:

```javascript
  assert.match(css, /\.person-avatar \{[^}]*border-radius:\s*50%/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --test-name-pattern "intro leads" test/clue-hunt-map.test.js`

Expected: FAIL because `#you-intro` is missing.

- [ ] **Step 3: Add the intro picture and the circle class**

In `game/clue-hunt.html`, change the stylesheet to `game.css?v=23`.

Inside `#intro .case-block`, before the existing `#case-lead` paragraph, add:

```html
        <div class="case-you">
          <img class="person-avatar person-avatar-lg" src="illust/people/you.png" alt="" width="96" height="96"/>
          <p class="case-lead" id="you-intro">You are a Primary 6 student. You are looking into what happened to the raffle box.</p>
        </div>
```

Leave the Leo paragraph and **How to play** untouched.

Append to `game/game.css`:

```css
.case-you {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0 0 0.8rem;
}
.person-avatar {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  object-fit: cover;
  flex: 0 0 auto;
  background: transparent;
}
.person-avatar-lg {
  width: 6rem;
  height: 6rem;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test test/clue-hunt-map.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt.html game/game.css test/clue-hunt-map.test.js
git commit -m "feat: show You on the School Mystery case page"
```

---

### Task 4: Round avatar and name on talk bubbles

**Files:**
- Modify: `game/clue-hunt.html` function `openAsk` (about lines 237–270)
- Modify: `game/game.css` (add `.talk-line` and `.talk-name`)
- Modify: `test/clue-hunt-map.test.js`
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `ClueHunt.speakerId` and `ClueHunt.personById` from Task 2. Question rows use person id `"you"`. Reply rows use `speakerId(hotspot.id)`.
- Produces: DOM class `.talk-line` with `img.person-avatar` and `.talk-name` inside both `.talk-said` rows and `.talk-reply` rows.

- [ ] **Step 1: Write the failing script assertion**

In `test/clue-hunt-map.test.js`, inside `page script explores before it grades`, add:

```javascript
  assert.match(script, /function talkLine/);
  assert.match(script, /speakerId\(hotspot\.id\)/);
  assert.match(script, /talkLine\("you"/);
  assert.doesNotMatch(script, /className = "talk-said"/);
  assert.doesNotMatch(script, /className = "talk-reply"/);
```

The last two assertions force the old bare `<p class="talk-said">` / `<p class="talk-reply">` lines to go away. `talkLine` creates those classes on the row instead.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --test-name-pattern "page script explores" test/clue-hunt-map.test.js`

Expected: FAIL because `function talkLine` is absent.

- [ ] **Step 3: Render talk rows**

In the page script in `game/clue-hunt.html`, add `talkLine` next to `openAsk` and use it when a question is sent:

```javascript
  function talkLine(personId, text, rowClass) {
    var person = ClueHunt.personById(personId);
    var row = document.createElement("div");
    row.className = "talk-line " + rowClass;
    var img = document.createElement("img");
    img.className = "person-avatar";
    img.src = person.art;
    img.alt = "";
    var copy = document.createElement("div");
    var name = document.createElement("span");
    name.className = "talk-name";
    name.textContent = person.name;
    var body = document.createElement("p");
    body.textContent = text;
    copy.appendChild(name);
    copy.appendChild(body);
    row.appendChild(img);
    row.appendChild(copy);
    return row;
  }
```

Inside the question click handler, replace the `talk-said` paragraph and the `talk-reply` paragraph with:

```javascript
        var said = talkLine("you", item.label, "talk-said");
        btn.replaceWith(said);
        var result = ClueHunt.visit(hunt, hotspot.id, item.id);
        hunt = result.state;
        renderNotebook();
        askThread.appendChild(talkLine(ClueHunt.speakerId(hotspot.id), result.reply, "talk-reply"));
```

Do not show an avatar for search zoom popups.

Append to `game/game.css`:

```css
.talk-line {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  margin: 0.45rem 0;
}
.talk-name {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.78rem;
}
.talk-line p { margin: 0; }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test test/clue-hunt-map.test.js test/clue-hunt-state.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt.html game/game.css test/clue-hunt-map.test.js
git commit -m "feat: label School Mystery talk bubbles with faces"
```

---

### Task 5: People album next to the notebook

**Files:**
- Modify: `game/clue-hunt.html` (notebook aside around lines 112–124, new `#people` section inside `.hunt-stage`, `showMap`, and the page script)
- Modify: `game/game.css`
- Modify: `test/clue-hunt-map.test.js`
- Test: `test/clue-hunt-map.test.js`

**Interfaces:**
- Consumes: `ClueHunt.peopleAlbum` and `ClueHunt.personById`.
- Produces: `#open-people`, `#people`, `#people-list`, `#people-detail`, `#people-to-map`. `#notebook-cards` still receives only clue cards from `renderNotebook`.

- [ ] **Step 1: Write the failing DOM assertions**

In `test/clue-hunt-map.test.js`, inside `notebook and solve page are present`, add:

```javascript
  assert.match(notebook, /id="open-people"/);
  assert.match(notebook, />People</);
  assert.doesNotMatch(notebook, /id="people-list"/);
  const stage = html.slice(html.indexOf('class="hunt-stage"'), html.indexOf('id="notebook"'));
  assert.match(stage, /id="people"/);
  assert.match(stage, /id="people-list"/);
  assert.match(stage, /id="people-detail"/);
  assert.match(stage, /id="people-to-map"/);
  assert.match(stage, />Back to the map</);
```

`#open-people` is inside the notebook aside. The album itself is in the stage, so the notebook slice must not contain `#people-list`.

In `page script explores before it grades`, add:

```javascript
  assert.match(script, /function renderPeople/);
  assert.match(script, /ClueHunt\.peopleAlbum\(hunt\)/);
  assert.match(script, /function showMap/);
  assert.match(script, /people\.hidden = true/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --test-name-pattern "notebook and solve page" test/clue-hunt-map.test.js`

Expected: FAIL because `#open-people` is missing.

- [ ] **Step 3: Add the button, the panel, and the script**

At the top of `<aside id="notebook">`, before `.notebook-sheet`, add:

```html
      <div class="hunt-side-bar">
        <button type="button" class="btn btn-ghost" id="open-people">People</button>
      </div>
```

Inside `.hunt-stage`, after `#fair-map` and before `#scene`, add:

```html
      <section id="people" hidden>
        <div class="btn-row">
          <button type="button" class="btn btn-ghost" id="people-close">Back</button>
        </div>
        <h2 class="hunt-q">People</h2>
        <div id="people-list"></div>
        <div id="people-detail" hidden>
          <img id="people-detail-art" class="person-avatar person-avatar-lg" alt="" width="160" height="160"/>
          <h3 id="people-detail-name"></h3>
          <p id="people-detail-fact"></p>
          <button type="button" class="btn btn-ghost" id="people-to-map">Back to the map</button>
        </div>
      </section>
```

In `showMap`, after `map.hidden = false`, add `document.getElementById("people").hidden = true`.

Add this script next to `renderNotebook`. `peopleFrom` is `"map"` or `"scene"`.

```javascript
  var people = document.getElementById("people");
  var peopleList = document.getElementById("people-list");
  var peopleDetail = document.getElementById("people-detail");
  var peopleFrom = "map";

  function renderPeople() {
    var album = ClueHunt.peopleAlbum(hunt);
    peopleList.innerHTML = "";
    peopleDetail.hidden = true;
    peopleList.hidden = false;
    album.forEach(function (person) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "people-row";
      var img = document.createElement("img");
      img.className = "person-avatar";
      img.src = person.art;
      img.alt = "";
      var name = document.createElement("span");
      name.textContent = person.name;
      btn.appendChild(img);
      btn.appendChild(name);
      btn.addEventListener("click", function () {
        peopleList.hidden = true;
        peopleDetail.hidden = false;
        document.getElementById("people-detail-art").src = person.art;
        document.getElementById("people-detail-name").textContent = person.name;
        document.getElementById("people-detail-fact").textContent = person.fact;
      });
      peopleList.appendChild(btn);
    });
  }

  function openPeople() {
    peopleFrom = scene.hidden ? "map" : "scene";
    map.hidden = true;
    scene.hidden = true;
    people.hidden = false;
    renderPeople();
  }

  function closePeople() {
    people.hidden = true;
    if (peopleFrom === "scene") scene.hidden = false;
    else map.hidden = false;
  }
```

Wire the buttons:

```javascript
  document.getElementById("open-people").addEventListener("click", openPeople);
  document.getElementById("people-close").addEventListener("click", closePeople);
  document.getElementById("people-to-map").addEventListener("click", showMap);
```

Call `renderPeople()` at the end of `renderNotebook` only when `people.hidden === false`, so a talk unlocked while the album is open refreshes the list. Do not put person rows into `#notebook-cards`.

Append to `game/game.css`:

```css
.hunt-side-bar {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 0.35rem;
}
.people-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  margin: 0 0 0.45rem;
  padding: 0.45rem 0.6rem;
  border: 0;
  border-radius: 16px;
  background: var(--cream, #fcf0d8);
  color: var(--navy);
  font-family: var(--font-display);
  font-weight: 700;
  cursor: pointer;
}
.people-detail { text-align: center; }
#people-detail-fact { font-weight: 700; }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test test/clue-hunt-map.test.js test/clue-hunt-people.test.js test/clue-hunt-state.test.js test/game-hub.test.js test/home-nav.test.js`

Expected: PASS. `index.html` still matches `>Be a Detective</` and `game/clue-hunt.html`.

- [ ] **Step 5: Commit**

```bash
git add game/clue-hunt.html game/game.css test/clue-hunt-map.test.js
git commit -m "feat: add the School Mystery People album"
```

---

### Task 6: Manual check and ship

**Files:**
- Modify: none, unless a check shows a broken string. Fix that string in the file from the earlier task, then commit again.

**Interfaces:**
- Consumes: the page from Tasks 1–5.
- Produces: `main` at a new commit, and a live GitHub Pages deploy of `https://cynthiasumyi-spec.github.io/revision-flashcards/game/clue-hunt.html`.

- [ ] **Step 1: Check the three screens in a browser**

Serve the repo at `http://127.0.0.1:8765/` and open `game/clue-hunt.html`.

- Intro: You’s circular picture and the sentence “You are a Primary 6 student. You are looking into what happened to the raffle box.” The Leo sentence is still under it.
- People on the map, before any question: the list is only You. Back returns to the map.
- Prize wheel: send “Was that at noon?” The reply row shows May’s face and the name May. People now lists You and May. The notebook does not gain a card.
- Send “Who left with Leo?” People gains Leo and Sam, and the notebook gains the prize-wheel card. The key fact for both boys is “About 1:15, I saw someone in a blue jacket leave the stall with Leo.”
- Open Leo and press **Back to the map**. The map is showing, not the prize-wheel scene.
- School hall search does not add Leo if he was not already unlocked. Use a fresh load for this check.
- Film club “What did Amy do after lunch?” unlocks Amy. The reply text still starts with “She”.
- Storeroom “What time did you see Leo?” unlocks Ken. The People fact is his noon sentence and does not say “false”.
- Solve still accepts About 1:20, Amy, and “To pick a ticket in secret and win the new bike”.
- Home page `index.html` still says **Be a Detective** and still links to `game/clue-hunt.html`.

Save screenshots of the intro, one talk row, and the People list with more than You.

- [ ] **Step 2: Re-run the automated tests**

Run: `node --test test/clue-hunt-people.test.js test/clue-hunt-state.test.js test/clue-hunt-map.test.js test/game-hub.test.js test/home-nav.test.js`

Expected: PASS.

- [ ] **Step 3: Fast-forward main and deploy**

```bash
git push -u origin HEAD
git checkout main
git merge --ff-only HEAD@{1}
git push origin main
gh run watch "$(gh run list --branch main --workflow pages-build-deployment --limit 1 --json databaseId --jq '.[0].databaseId')" --exit-status
```

Use the feature branch name `cursor/school-mystery-people-6c4f` if this agent’s branch rule requires the `-6c4f` suffix. If `HEAD@{1}` is not that branch, merge the feature branch by name.

- [ ] **Step 4: Confirm the live page**

```bash
curl -fsSL "https://cynthiasumyi-spec.github.io/revision-flashcards/game/clue-hunt.html" | rg -n "you-intro|open-people|School Mystery"
curl -fsSL -o /dev/null -w "%{http_code}\n" "https://cynthiasumyi-spec.github.io/revision-flashcards/game/illust/people/you.png"
```

Expected: the HTML contains `id="you-intro"`, `id="open-people"`, and `School Mystery`. The PNG returns `200`. The URL path is still `game/clue-hunt.html`.

---

## Self-review

- Spec intro, talk avatars, album, unlock rules, key-fact rule, search exception, Ken unlabeled, art library, circular crop, session reset, URL, and Be a Detective each have a task above.
- Amy’s blazer file is an official jacket portrait. The plan does not invent a Primary 6 blue-jacket PNG, because いらすとや did not have one.
- `visit`’s notebook return values stay stable so `test/clue-hunt-state.test.js` does not need new expected sentences.
