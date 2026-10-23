/**
 * Mastery tracker — localStorage key p6-flash-mastery-v1
 * States: new | review | mastered
 * Word keys like unit1:adopt
 * Mastered after STREAK_N consecutive corrects (default 3).
 */
window.Mastery = (function () {
  const KEY = 'p6-flash-mastery-v1';
  const STREAK_N = 3;
  const MATCH_BEST = 'p6-flash-match-best-v1';
  const TIMED_BEST = 'p6-flash-timed-best-v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { words: {} };
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return { words: {} };
      if (!data.words) data.words = {};
      return data;
    } catch (e) {
      return { words: {} };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) { /* quota / private mode */ }
  }

  function ensure(data, wordKey) {
    if (!data.words[wordKey]) {
      data.words[wordKey] = {
        state: 'new',
        streak: 0,
        correct: 0,
        wrong: 0,
        last: null
      };
    }
    return data.words[wordKey];
  }

  function get(wordKey) {
    const data = load();
    return ensure(data, wordKey);
  }

  function markCorrect(wordKey) {
    const data = load();
    const w = ensure(data, wordKey);
    w.correct += 1;
    w.streak += 1;
    w.last = Date.now();
    if (w.streak >= STREAK_N) {
      w.state = 'mastered';
    } else if (w.state === 'new') {
      w.state = 'review';
    }
    save(data);
    notifyReview(wordKey);
    return Object.assign({}, w);
  }

  function markWrong(wordKey) {
    const data = load();
    const w = ensure(data, wordKey);
    w.wrong += 1;
    w.streak = 0;
    w.last = Date.now();
    if (w.state === 'mastered') w.state = 'review';
    else if (w.state === 'new') w.state = 'review';
    save(data);
    notifyReview(wordKey);
    return Object.assign({}, w);
  }

  function notifyReview(wordKey) {
    if (!window.Badges || !wordKey) return;
    const unitId = String(wordKey).split(':')[0];
    const data = load();
    const prefix = unitId + ':';
    const records = Object.keys(data.words).filter(function (k) {
      return k.indexOf(prefix) === 0;
    }).map(function (k) {
      return { state: data.words[k].state, wrong: data.words[k].wrong || 0 };
    });
    window.Badges.noteReview(unitId, records);
  }

  function summary(unitId) {
    const data = load();
    const prefix = unitId ? unitId + ':' : '';
    let neu = 0, review = 0, mastered = 0, total = 0;
    Object.keys(data.words).forEach(k => {
      if (prefix && k.indexOf(prefix) !== 0) return;
      total += 1;
      const s = data.words[k].state;
      if (s === 'mastered') mastered += 1;
      else if (s === 'review') review += 1;
      else neu += 1;
    });
    return { new: neu, review, mastered, total };
  }

  /**
   * Words needing attention today: review first, then new.
   * Pass knownKeys (array of word keys from unit packs) so new words appear even before first attempt.
   */
  function suggestToday(knownKeys, limit) {
    limit = limit || 12;
    const data = load();
    const keys = knownKeys && knownKeys.length
      ? knownKeys.slice()
      : Object.keys(data.words);

    const scored = keys.map(k => {
      const w = data.words[k] || { state: 'new', streak: 0, last: null };
      let priority = 0;
      if (w.state === 'review') priority = 3;
      else if (w.state === 'new' || !data.words[k]) priority = 2;
      else if (w.state === 'mastered') priority = 0;
      // older last-seen gets a slight boost among same priority
      const age = w.last ? (Date.now() - w.last) : 1e15;
      return { key: k, state: w.state || 'new', priority, age, streak: w.streak || 0 };
    });

    scored.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return b.age - a.age;
    });

    return scored.filter(x => x.priority > 0).slice(0, limit);
  }

  function allKnownKeysFromRegistry() {
    if (!window.PracticeRegistry) return [];
    const keys = [];
    window.PracticeRegistry.listUnits().forEach(u => {
      const pack = window.PracticeRegistry.getUnit(u.id);
      if (pack && pack.words) pack.words.forEach(w => keys.push(w.key));
    });
    return keys;
  }

  function getMatchBest(unitId) {
    try {
      const all = JSON.parse(localStorage.getItem(MATCH_BEST) || '{}');
      return all[unitId] || null;
    } catch (e) { return null; }
  }

  function setMatchBest(unitId, record) {
    try {
      const all = JSON.parse(localStorage.getItem(MATCH_BEST) || '{}');
      const prev = all[unitId];
      // better = fewer flips, then faster time
      if (!prev || record.flips < prev.flips || (record.flips === prev.flips && record.ms < prev.ms)) {
        all[unitId] = record;
        localStorage.setItem(MATCH_BEST, JSON.stringify(all));
        return true;
      }
    } catch (e) {}
    return false;
  }

  function getTimedBest(unitId) {
    try {
      const all = JSON.parse(localStorage.getItem(TIMED_BEST) || '{}');
      return all[unitId] || null;
    } catch (e) { return null; }
  }

  function setTimedBest(unitId, score) {
    try {
      const all = JSON.parse(localStorage.getItem(TIMED_BEST) || '{}');
      if (!all[unitId] || score > all[unitId]) {
        all[unitId] = score;
        localStorage.setItem(TIMED_BEST, JSON.stringify(all));
        return true;
      }
    } catch (e) {}
    return false;
  }

  return {
    KEY, STREAK_N, load, get, markCorrect, markWrong, summary,
    suggestToday, allKnownKeysFromRegistry,
    getMatchBest, setMatchBest, getTimedBest, setTimedBest
  };
})();
