/**
 * Practice unit registry. Load unit*.js first, then this.
 * getUnit(id) returns the pack or null.
 */
window.PracticeRegistry = (function () {
  const map = {
    unit1: () => window.PRACTICE_UNIT1,
    unit2: () => window.PRACTICE_UNIT2,
    unit3: () => window.PRACTICE_UNIT3,
    unit4: () => window.PRACTICE_UNIT4,
    dictation3: () => window.PRACTICE_DICTATION3
  };

  const meta = [
    { id: 'unit1', label: 'Unit 1', tone: 'sunny', ready: true },
    { id: 'unit2', label: 'Unit 2', tone: 'green', ready: true },
    { id: 'unit3', label: 'Unit 3', tone: 'sky', ready: true },
    { id: 'unit4', label: 'Unit 4', tone: 'coral', ready: true },
    { id: 'dictation3', label: 'Dictation 3', tone: 'pink', ready: true }
  ];

  function getUnit(id) {
    if (id === 'mixed') return buildMixed();
    const fn = map[id];
    return fn ? fn() || null : null;
  }

  function listUnits() {
    return meta.map(m => {
      const u = getUnit(m.id);
      const has = u && ((u.fillIn && u.fillIn.length) || (u.matching && u.matching.length) || (u.missingLetters && u.missingLetters.length));
      return Object.assign({}, m, { ready: !!has, title: (u && u.title) || m.label });
    });
  }

  const MIXED_ROUND = 10;
  const SOURCE_IDS = meta.map(function (m) { return m.id; });

  function gather(field) {
    const out = [];
    SOURCE_IDS.forEach(function (id) {
      const pack = getUnit(id);
      const list = pack && pack[field];
      if (list && list.length) out.push.apply(out, list);
    });
    return out;
  }

  function sample(list, n) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = copy[i];
      copy[i] = copy[j];
      copy[j] = t;
    }
    return copy.slice(0, Math.min(n, copy.length));
  }

  function buildMixed() {
    const fillHard = gather('fillInHard');
    return {
      id: 'mixed',
      title: 'Mixed topic',
      words: gather('words'),
      fillIn: sample(gather('fillIn'), MIXED_ROUND),
      fillInHard: fillHard.length ? sample(fillHard, MIXED_ROUND) : [],
      missingLetters: sample(gather('missingLetters'), MIXED_ROUND),
      matching: gather('matching')
    };
  }

  function practiceChoices() {
    return listUnits().concat([{
      id: 'mixed',
      label: 'Mixed topic',
      tone: 'navy',
      ready: true,
      title: 'Mixed topic'
    }]);
  }

  function qsUnit() {
    const q = new URLSearchParams(location.search);
    return q.get('unit') || 'unit1';
  }

  return { getUnit, listUnits, practiceChoices, qsUnit, meta };
})();
