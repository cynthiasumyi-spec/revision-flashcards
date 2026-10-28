const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts } = require('./helpers');

const PACKS = [
  'practice/data/unit1.js',
  'practice/data/unit2.js',
  'practice/data/unit3.js',
  'practice/data/unit4.js',
  'practice/data/dictation3.js',
  'practice/data/registry.js'
];

function packPrefix(key) {
  return String(key || '').split(':')[0];
}

test('mixed topic samples every pack and keeps a normal round size', () => {
  const { window } = loadScripts(PACKS);
  const R = window.PracticeRegistry;
  const ids = R.listUnits().map(u => u.id);
  assert.equal(ids.join(','), 'unit1,unit2,unit3,unit4,dictation3');
  const choices = R.practiceChoices();
  assert.equal(choices[choices.length - 1].id, 'mixed');
  assert.equal(choices[choices.length - 1].label, 'Mixed topic');

  const mixed = R.getUnit('mixed');
  assert.equal(mixed.title, 'Mixed topic');
  assert.equal(mixed.fillIn.length, 10);
  assert.equal(mixed.fillInHard.length, 10);
  assert.equal(mixed.missingLetters.length, 10);
  assert.ok(mixed.matching.length >= 10);
  assert.ok(mixed.words.length > 40);

  function sources(list, keyName) {
    return new Set(list.map(item => packPrefix(item[keyName])));
  }
  assert.ok(sources(mixed.words, 'key').size === 5);
  assert.ok(sources(mixed.matching, 'wordKey').size === 5);
  const roundSources = new Set([
    ...sources(mixed.fillIn, 'wordKey'),
    ...sources(mixed.missingLetters, 'wordKey')
  ]);
  assert.ok(roundSources.size >= 2);

  const hub = fs.readFileSync(path.join(__dirname, '..', 'practice/index.html'), 'utf8');
  assert.match(hub, /practiceChoices\(\)/);
  assert.match(hub, /practice\.css\?v=7/);
});

test('mixed practice stays open and does not unlock unit badges', () => {
  const { window } = loadScripts(['practice/badges.js']);
  assert.equal(window.Badges.unitUnlocked('mixed'), true);
  assert.equal(window.Badges.lockReason('mixed'), '');
  assert.equal(window.Badges.unitUnlocked('unit2'), false);
  window.Badges.recordSession('mixed', 'match', null, { correct: 5, total: 5 });
  window.Badges.recordSession('mixed', 'letters', 'easy', { correct: 10, total: 10 });
  window.Badges.recordSession('mixed', 'timed', null, { correct: 4, total: 4 });
  assert.equal(window.Badges.isEarned('all-rounder'), false);
  window.Badges.recordSession('mixed', 'fill', 'hard', { correct: 8, total: 10 });
  assert.equal(window.Badges.isEarned('all-rounder'), true);
  assert.equal(window.Badges.isEarned('match-pro'), false);
  assert.equal(window.Badges.isEarned('unit-done:mixed'), false);
  assert.equal(window.Badges.unitUnlocked('unit2'), false);
  const badge = window.Badges.catalog().find(b => b.id === 'all-rounder');
  assert.equal(badge.english, 'All-rounder');
  assert.equal(badge.title, '全能練習生');
  assert.match(badge.detail, /Mixed topic/);
  assert.match(badge.detail, /Sentence Fill/);
  assert.match(badge.detail, /Missing Letters/);
  assert.match(badge.detail, /Memory Match/);
  assert.match(badge.detail, /Timed Challenge/);
});

test('unit practice does not earn All-rounder', () => {
  const { window } = loadScripts(['practice/badges.js']);
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(id => {
    window.Badges.recordSession(id, 'fill', 'easy');
    window.Badges.recordSession(id, 'letters', 'easy');
    window.Badges.recordSession(id, 'match');
    window.Badges.recordSession(id, 'timed');
  });
  assert.equal(window.Badges.isEarned('all-rounder'), false);
  assert.equal(window.Badges.isEarned('match-pro'), true);
});
