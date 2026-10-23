const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function nav(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const match = html.match(/<nav class="nav-plain"[\s\S]*?<\/nav>/);
  assert.ok(match, file + ' has a primary nav');
  return { html, nav: match[0] };
}

test('homepage header is Revision and Practice only', () => {
  const { nav: bar } = nav('index.html');
  assert.match(bar, /href="#packs"/);
  assert.match(bar, />Revision</);
  assert.match(bar, /href="practice\/index.html"/);
  assert.match(bar, />Practice</);
  assert.doesNotMatch(bar, />Packs</);
  assert.doesNotMatch(bar, />Start</);
  assert.doesNotMatch(bar, /nav-action/);
  assert.equal(bar.match(/<a\b/g).length, 2);
});

test('packs are a swipe carousel, not a grid', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /class="pack-track"/);
  assert.match(html, /id="pack-status"/);
  assert.doesNotMatch(html, /id="pack-prev"/);
  assert.doesNotMatch(html, /id="pack-next"/);
  assert.doesNotMatch(html, />Previous</);
  assert.doesNotMatch(html, />Next</);
  assert.doesNotMatch(html, /61 words/);
  assert.doesNotMatch(html, /pack-grid/);
  assert.equal((html.match(/class="pack-card/g) || []).length, 5);
  const css = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /\.nav-jump[\s\S]*border:\s*0/);
  assert.match(css, /\.nav-jump[\s\S]*box-shadow:\s*none/);
});

test('badges page has no illustration caption and the same two links', () => {
  const { html, nav: bar } = nav('badges.html');
  assert.equal(html.includes('Illustrations of people'), false);
  assert.equal(html.includes('badge-credit'), false);
  assert.equal(html.includes('schoolboy'), false);
  assert.match(bar, /href="index\.html#packs"/);
  assert.match(bar, />Revision</);
  assert.match(bar, />Practice</);
  assert.equal(bar.match(/<a\b/g).length, 2);
});
