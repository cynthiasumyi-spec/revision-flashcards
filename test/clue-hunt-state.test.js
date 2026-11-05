const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ClueHunt = require('../game/clue-hunt-state.js');

const root = path.join(__dirname, '..');

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

test('solve asks who and where only', () => {
  assert.equal(ClueHunt.PRACTICE, undefined);
  assert.deepEqual(Object.keys(ClueHunt.CASE), ['who', 'where']);
  assert.equal(ClueHunt.CASE.who.answer, 'The film club');
  assert.equal(ClueHunt.CASE.where.answer, 'In the school hall');
  assert.deepEqual(ClueHunt.CASE.where.options, [
    'In the school hall',
    'In the storeroom',
    'Beside the prize wheel',
    'At the charity stall'
  ]);
  const src = fs.readFileSync(path.join(root, 'game/clue-hunt-state.js'), 'utf8');
  assert.doesNotMatch(src, /A comedy ___/);
  assert.doesNotMatch(src, /Who is missing/);
  assert.doesNotMatch(JSON.stringify(ClueHunt.CASE), /Who is missing/);
});

test('a wrong case answer names the card to reread and does not reveal the ending', () => {
  const whoOnly = ClueHunt.submitSolve({ who: 'Ken', where: 'In the school hall' });
  const whereOnly = ClueHunt.submitSolve({ who: 'The film club', where: 'In the storeroom' });
  const both = ClueHunt.submitSolve({ who: 'Miss Chan', where: 'Beside the prize wheel' });
  assert.equal(whoOnly.ok, false);
  assert.equal(whoOnly.ending, '');
  assert.equal(whoOnly.hint, 'Read the film club card again.');
  assert.equal(whereOnly.hint, 'Read the school hall card again.');
  assert.equal(both.hint, 'Read the film club card and the school hall card again.');
  assert.doesNotMatch(both.hint, /took the raffle tickets/);
});

test('the correct pair returns the one ending', () => {
  const result = ClueHunt.submitSolve({
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
