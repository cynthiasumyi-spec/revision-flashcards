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

test('chat mysteries need more than one clue and do not name the answer', () => {
  const vm = require('node:vm');
  const banned = ['sword', 'collar', 'cape', 'microphone', 'badge', 'apron', 'whisk', 'mitt'];
  let count = 0;
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    const html = read(unit + '-chat.html');
    const code = html.match(/<script>\s*\(function \(\) \{([\s\S]*)\}\)\(\);\s*<\/script>/)[1];
    const cut = code.split(/const SETS/)[0] + '\nthis.__sets = {set1Data,set2Data,set3Data,set4Data,set5Data};';
    const context = vm.createContext({});
    vm.runInContext(cut, context);
    Object.values(context.__sets).forEach(data => {
      count += 1;
      const q = data.endQ;
      assert.ok(q.options.includes(q.answer), q.q);
      assert.equal(q.options.length, 4, q.q);
      assert.equal(q.q.toLowerCase().includes(q.answer.toLowerCase()), false, q.q);
      const obvious = /who (carried|hung|left|wheeled|locked|found|took) /i;
      assert.equal(obvious.test(q.q), false, q.q);
      banned.forEach(word => {
        if (q.answer.toLowerCase().includes(word)) {
          assert.equal(q.q.toLowerCase().includes(word), false, q.q);
        }
      });
      data.bubbles.forEach(bubble => {
        assert.equal(bubble.options.includes(bubble.answer), true, bubble.explain);
      });
    });
  });
  assert.equal(count, 20);
});

test('chat quest questions are not wrapped in a panel frame', () => {
  ['unit1', 'unit2', 'unit3', 'unit4'].forEach(unit => {
    const html = read(unit + '-chat.html');
    assert.match(html, /class="chat-stage" id="game"/, unit);
    assert.doesNotMatch(html, /class="panel" id="game"/, unit);
  });
  const css = read('grammar.css');
  const stage = css.slice(css.indexOf('.chat-stage {'), css.indexOf('.chat-thread {'));
  assert.match(stage, /background:\s*transparent/);
  assert.match(stage, /border:\s*0/);
  assert.match(stage, /box-shadow:\s*none/);
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
  const blank = css.slice(css.indexOf('.bubble .blank {'), css.indexOf('.bubble .blank.filled'));
  assert.match(blank, /justify-content:\s*center/);
  assert.match(blank, /align-items:\s*center/);
  assert.match(blank, /text-align:\s*center/);
  const rule = css.slice(css.indexOf('.bubble.active-bubble'), css.indexOf('.chat-reply-label'));
  assert.match(rule, /\.bubble\.active-bubble/);
  assert.doesNotMatch(rule, /coral/);
  assert.match(css, /\.join-choices \{/);
  assert.match(css, /--choice-bg:\s*color-mix\(in srgb, var\(--sky\) 42%, #fff\)/);
  assert.match(css, /--choice-ink:\s*var\(--navy\)/);
  assert.match(css, /--choice-selected-bg:\s*var\(--sky\)/);
  const choiceRule = css.slice(css.indexOf('.choice {'), css.indexOf('.choice:hover'));
  assert.match(choiceRule, /background:\s*var\(--choice-bg\)/);
  assert.match(choiceRule, /color:\s*var\(--choice-ink\)/);
  assert.doesNotMatch(choiceRule, /background:\s*var\(--cream\)/);
  assert.match(css, /\.btn-ghost \{ background: var\(--cream\)/);
  assert.match(css, /\.btn-primary \{ background: var\(--coral\)/);
  assert.match(css, /\.join-actions \.btn-primary/);
  assert.match(css, /\.join-actions \.btn-ghost/);
  const illust = css.slice(css.indexOf('.illust img'), css.indexOf('.illust svg'));
  assert.match(illust, /object-fit:\s*contain/);
  assert.doesNotMatch(illust, /cover/);
  assert.match(illust, /border-radius:\s*var\(--radius-sm\)/);
  assert.match(illust, /max-height:\s*var\(--q-art-max\)/);
  assert.match(css, /--q-art-max:\s*min\(34vh,\s*300px\)/);
  assert.match(css, /--q-art-max:\s*min\(28vh,\s*220px\)/);
  assert.match(css, /--q-art-max:\s*min\(32vh,\s*340px\)/);
  assert.doesNotMatch(css, /max-height:\s*min\(15vh,\s*112px\)/);
  assert.doesNotMatch(css, /max-height:\s*min\(18vh,\s*148px\)/);
  const story = css.slice(css.indexOf('.story-panel-art img'), css.indexOf('.story-beat-label'));
  assert.match(story, /object-fit:\s*contain/);
  assert.doesNotMatch(story, /cover/);
  assert.match(story, /border-radius:\s*var\(--radius-sm\)/);
  const frame = css.slice(css.indexOf('.illust {'), css.indexOf('.illust.sky'));
  assert.match(frame, /overflow:\s*hidden/);
  assert.match(frame, /border-radius:\s*var\(--radius-sm\)/);
});
