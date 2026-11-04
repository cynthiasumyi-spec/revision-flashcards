const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const grammar = path.join(root, 'practice', 'grammar');

function read(name) {
  return fs.readFileSync(path.join(grammar, name), 'utf8');
}

test('story chat and join pages record a grammar session when the set advances', () => {
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    ['story', 'chat', 'join'].forEach(mode => {
      const html = read(unit + '-' + mode + '.html');
      assert.match(html, /src="\.\.\/\.\.\/practice\/badges\.js"/, unit + '-' + mode);
      assert.match(
        html,
        new RegExp("Badges\\.recordGrammarSession\\('" + unit + "', '" + mode + "'\\)"),
        unit + '-' + mode
      );
    });
  });
});

test('chat pages count a correct final inference and boss records lives left', () => {
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    const html = read(unit + '-chat.html');
    assert.match(html, /Badges\.recordGrammarInference\(\)/, unit);
  });
  const boss = read('boss.html');
  assert.match(boss, /src="\.\.\/\.\.\/practice\/badges\.js"/);
  assert.match(boss, /Badges\.recordGrammarBoss\(lives\)/);
});

test('join pages use one blank stem and lowercase choices', () => {
  const vm = require('node:vm');
  let total = 0;
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    const html = read(unit + '-join.html');
    assert.doesNotMatch(html, /Read A and B/);
    assert.doesNotMatch(html, /Join with/);
    assert.doesNotMatch(html, /join-line/);
    assert.doesNotMatch(html, />Sentences</);
    assert.match(html, /id="stem"/);
    assert.match(html, /class="choices join-choices"/);
    assert.match(html, /class="btn-row join-actions"/);
    assert.match(html, /renderStem\(/);
    const code = html.match(/<script>\s*\(function \(\) \{([\s\S]*)\}\)\(\);\s*<\/script>/)[1];
    const cut = code.split('const SETS')[0] + '\nthis.__sets = {set1Data,set2Data,set3Data,set4Data,set5Data};';
    const context = vm.createContext({});
    vm.runInContext(cut, context);
    const optContext = vm.createContext({});
    const optCut = (code.match(/const choiceOpts = \[[^\]]+\];/) || ['const choiceOpts = ["who","which"];'])[0] + '\nthis.choiceOpts = choiceOpts;';
    vm.runInContext(optCut, optContext);
    optContext.choiceOpts.forEach(opt => {
      assert.equal(opt, opt.toLowerCase(), unit + ' ' + opt);
    });
    let count = 0;
    Object.values(context.__sets).forEach(data => {
      data.items.forEach(it => {
        count += 1;
        assert.equal(it.answer, it.answer.toLowerCase(), it.full);
        assert.ok(it.preview.includes('REL'), it.full);
        const built = it.preview.map(p => {
          if (p !== 'REL') return p;
          if (it.fillMap && it.fillMap[it.answer]) return it.fillMap[it.answer];
          return it.answer;
        }).join('');
        assert.equal(built.toLowerCase(), it.full.toLowerCase(), it.full);
      });
    });
    assert.equal(count, 30, unit);
    total += count;
  });
  assert.equal(total, 120);
  const boss = read('boss.html');
  assert.doesNotMatch(boss, /join-line/);
  assert.doesNotMatch(boss, /Tap <strong>who<\/strong>/);
  assert.match(boss, /renderJoinStem\(/);
  const joins = [...boss.matchAll(/kind: "join"[\s\S]*?full: "([^"]+)"/g)];
  assert.equal(joins.length, 10);
  joins.forEach(m => {
    assert.match(m[1], / (who|which) /);
  });
});

test('grammar hub keeps the back link and adds a top-right Practice control', () => {
  const html = read('grammar-hub.html');
  assert.match(html, /class="back" href="practice-entry\.html"/);
  assert.match(html, /class="header-practice" href="practice-entry\.html"/);
  assert.match(html, />Practice</);
});

test('chat bubbles are not outlined in coral', () => {
  const css = read('grammar.css');
  const rule = css.slice(css.indexOf('.bubble.active-bubble'), css.indexOf('.chat-reply-label'));
  assert.match(rule, /\.bubble\.active-bubble/);
  assert.doesNotMatch(rule, /coral/);
  assert.match(css, /\.join-choices \.choice/);
  assert.match(css, /\.join-actions \.btn-primary/);
  assert.match(css, /\.join-actions \.btn-ghost/);
  const illust = css.slice(css.indexOf('.illust img'), css.indexOf('.illust svg'));
  assert.match(illust, /object-fit:\s*contain/);
  assert.doesNotMatch(illust, /cover/);
  const story = css.slice(css.indexOf('.story-panel-art img'), css.indexOf('.story-beat-label'));
  assert.match(story, /object-fit:\s*contain/);
  assert.doesNotMatch(story, /cover/);
});
