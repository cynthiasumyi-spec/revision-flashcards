const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const peopleDir = path.join(root, 'game/illust/people');
const files = ['you.png', 'zoe.png', 'may.png', 'leo.png', 'sam.png', 'ken.png', 'miss-chan.png'];

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
  assert.match(sources, /heads\/ are square crops/);
  files.forEach((name) => {
    const head = fs.readFileSync(path.join(peopleDir, 'heads', name));
    const full = fs.readFileSync(path.join(peopleDir, name));
    assert.equal(head.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', name);
    assert.notEqual(head.toString('base64').slice(0, 80), full.toString('base64').slice(0, 80));
  });
  assert.match(sources, /1DcRpsm74eklw_ces2NqQd_dp5xcU2KwN/);
});

const ClueHunt = require('../game/clue-hunt-state.js');

test('a new hunt unlocks only You', () => {
  const album = ClueHunt.peopleAlbum(ClueHunt.createHunt());
  assert.deepEqual(album.map((person) => person.id), ['you']);
  assert.equal(album[0].name, 'You');
  assert.equal(album[0].fact, 'You are a Primary 6 student. You are looking into what happened to the raffle box.');
  assert.equal(album[0].art, 'illust/people/you.png');
  assert.equal(album[0].head, 'illust/people/heads/you.png');
});

test('the first question at a talk unlocks that speaker, even when the question is useless', () => {
  const may = ClueHunt.visit(ClueHunt.createHunt(), 'wheel', 'noon');
  assert.equal(may.added, false);
  assert.deepEqual(ClueHunt.peopleAlbum(may.state).map((person) => person.id), ['you', 'may']);
  assert.equal(ClueHunt.speakerId('wheel'), 'may');
  assert.equal(ClueHunt.speakerId('film'), 'zoe');
  assert.equal(ClueHunt.personById('zoe').name, 'Zoe');
  assert.equal(ClueHunt.PEOPLE.some((person) => person.name === 'Amy' || person.id === 'amy'), false);
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

test('film club unlocks Zoe and the notebook still names Amy the thief', () => {
  const filmSpot = ClueHunt.HOTSPOTS.find((spot) => spot.id === 'film');
  assert.equal(filmSpot.intro, 'Zoe is here with the film club.');
  assert.equal(filmSpot.prompts[0].label, 'What did Amy do after lunch?');
  assert.equal(filmSpot.prompts[1].label, 'Did Amy write a note?');
  const film = ClueHunt.visit(ClueHunt.createHunt(), 'film', 'lunch');
  assert.match(film.reply, /^She left /);
  assert.equal(ClueHunt.personFact(film.state, 'zoe'), film.reply.split(/(?<=\.)\s/)[0]);
  assert.equal(ClueHunt.peopleAlbum(film.state).find((person) => person.id === 'zoe').name, 'Zoe');
  assert.equal(film.card.text, 'Amy left in her blue jacket just after lunch, and she came back later. She wished for the new bike. She said if she won the bike, she would not have to wait for the bus.');
  assert.equal(ClueHunt.CASE.who.answer, 'Amy');
});
