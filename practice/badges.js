/**
 * Completion badges. localStorage key p6-flash-badges-v1.
 * Earned only from finished practice sessions and cleared review words.
 * No points, totals, or streaks.
 */
window.Badges = (function () {
  const KEY = 'p6-flash-badges-v1';
  const ORDER = [
    { id: 'unit1', label: 'Unit 1' },
    { id: 'unit2', label: 'Unit 2' },
    { id: 'unit3', label: 'Unit 3' },
    { id: 'unit4', label: 'Unit 4' },
    { id: 'dictation3', label: 'Dictation 3' }
  ];

  function empty() {
    return { earned: {}, units: {}, hadReview: {} };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return empty();
      if (!data.earned || typeof data.earned !== 'object') data.earned = {};
      if (!data.units || typeof data.units !== 'object') data.units = {};
      if (!data.hadReview || typeof data.hadReview !== 'object') data.hadReview = {};
      return data;
    } catch (e) {
      return empty();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) { /* quota / private mode */ }
  }

  function unitState(data, unitId) {
    if (!data.units[unitId]) {
      data.units[unitId] = {
        fillEasy: false,
        fillHard: false,
        lettersEasy: false,
        lettersHard: false,
        match: false,
        timed: false
      };
    }
    return data.units[unitId];
  }

  /*
   * Badge art is original いらすとや clipart of people, saved locally (not generated).
   * Locked files are a flat gray fill of that same figure’s outline.
   * First Steps: https://www.irasutoya.com/2013/11/blog-post_508.html
   * Phrase Speller: https://www.irasutoya.com/2013/01/blog-post_2739.html
   * Match Master: https://www.irasutoya.com/2017/07/blog-post_978.html
   * Timed Hero: https://www.irasutoya.com/2012/12/blog-post_271.html
   * Hard Challenger: https://www.irasutoya.com/2020/01/blog-post_69.html
   * Review Slayer: https://www.irasutoya.com/2017/09/blog-post_494.html
   * Unit 1 completer: https://www.irasutoya.com/2014/09/blog-post_58.html
   * Unit 2 completer: https://www.irasutoya.com/2012/11/blog-post_6715.html
   * Unit 3 completer: https://www.irasutoya.com/2013/09/blog-post_3570.html
   * Unit 4 completer: https://www.irasutoya.com/2013/09/blog-post_4255.html
   * Dictation 3 completer: https://www.irasutoya.com/2013/02/blog-post_4647.html
   */
  function catalog() {
    const globals = [
      { id: 'starter', title: '起步新手', english: 'First Steps', image: 'assets/badges/first-steps.png', detail: 'Finish any one practice session.' },
      { id: 'letters-phrase', title: '詞組拼寫手', english: 'Phrase Speller', image: 'assets/badges/phrase-speller.png', detail: 'Finish Missing Letters for one unit.' },
      { id: 'match-pro', title: '配對高手', english: 'Match Master', image: 'assets/badges/match-master.png', detail: 'Finish one Memory Match round of six cards.' },
      { id: 'timed-brave', title: '限時勇者', english: 'Timed Hero', image: 'assets/badges/timed-hero.png', detail: 'Finish one Timed Challenge.' },
      { id: 'hard-challenger', title: 'Hard 挑戰者', english: 'Hard Challenger', image: 'assets/badges/hard-challenger.png', detail: 'Finish Hard Sentence Fill or Hard Missing Letters for one unit.' },
      { id: 'review-clear', title: '錯題殺手', english: 'Review Slayer', image: 'assets/badges/review-slayer.png', detail: 'Clear every 需要重溫 word in one unit.' }
    ];
    const unitArt = {
      unit1: 'assets/badges/unit-completer-unit1.png',
      unit2: 'assets/badges/unit-completer-unit2.png',
      unit3: 'assets/badges/unit-completer-unit3.png',
      unit4: 'assets/badges/unit-completer-unit4.png',
      dictation3: 'assets/badges/unit-completer-dictation3.png'
    };
    const units = ORDER.map(function (u) {
      return {
        id: 'unit-done:' + u.id,
        title: 'Unit 完成者',
        english: 'Unit Completer',
        image: unitArt[u.id],
        unitLabel: u.label,
        detail: u.label + ' · finish Sentence Fill, Missing Letters, and Memory Match.'
      };
    });
    return globals.concat(units);
  }

  function imageSrc(path) {
    if (!path) return '';
    try {
      if (typeof location !== 'undefined' && location.pathname.indexOf('/practice/') !== -1) {
        return '../' + path;
      }
    } catch (e) { /* tests */ }
    return path;
  }

  function award(data, id) {
    if (data.earned[id]) return null;
    const earnedAt = Date.now();
    data.earned[id] = { earnedAt: earnedAt };
    const found = catalog().find(function (b) { return b.id === id; });
    return {
      id: id,
      title: found ? found.title : id,
      english: found ? found.english : '',
      image: found ? found.image : '',
      earnedAt: earnedAt
    };
  }

  function coreCompleteFrom(st) {
    if (!st) return false;
    return !!((st.fillEasy || st.fillHard) && (st.lettersEasy || st.lettersHard) && st.match);
  }

  function recordSession(unitId, activity, difficulty) {
    const data = load();
    const st = unitState(data, unitId);
    const hard = difficulty === 'hard';
    if (activity === 'fill') {
      if (hard) st.fillHard = true;
      else st.fillEasy = true;
    } else if (activity === 'letters') {
      if (hard) st.lettersHard = true;
      else st.lettersEasy = true;
    } else if (activity === 'match') {
      st.match = true;
    } else if (activity === 'timed') {
      st.timed = true;
    }

    const fresh = [];
    function take(badge) {
      if (badge) fresh.push(badge);
    }
    take(award(data, 'starter'));
    if (activity === 'letters') take(award(data, 'letters-phrase'));
    if (activity === 'match') take(award(data, 'match-pro'));
    if (activity === 'timed') take(award(data, 'timed-brave'));
    if (hard && (activity === 'fill' || activity === 'letters')) {
      take(award(data, 'hard-challenger'));
    }
    if (coreCompleteFrom(st)) take(award(data, 'unit-done:' + unitId));
    save(data);
    return { newBadges: fresh };
  }

  function noteReview(unitId, records) {
    const list = records || [];
    const needs = list.filter(function (r) {
      return r && r.state === 'review' && (r.wrong || 0) > 0;
    });
    const data = load();
    if (needs.length > 0) {
      data.hadReview[unitId] = true;
      save(data);
      return { awarded: false, newBadges: [] };
    }
    const cleared = list.some(function (r) {
      return r && (r.wrong || 0) > 0 && r.state !== 'review';
    });
    if (data.hadReview[unitId] && cleared) {
      const badge = award(data, 'review-clear');
      save(data);
      return { awarded: !!badge, newBadges: badge ? [badge] : [] };
    }
    return { awarded: false, newBadges: [] };
  }

  function isEarned(id) {
    return !!load().earned[id];
  }

  function getEarned(id) {
    return load().earned[id] || null;
  }

  function coreComplete(unitId) {
    return coreCompleteFrom(load().units[unitId]);
  }

  function hardUnlocked(unitId) {
    const st = load().units[unitId];
    return !!(st && st.fillEasy && st.lettersEasy);
  }

  function unitIndex(unitId) {
    return ORDER.findIndex(function (u) { return u.id === unitId; });
  }

  function unitUnlocked(unitId) {
    if (unitId === 'unit1' || unitId === 'dictation3') return true;
    const i = unitIndex(unitId);
    if (i <= 0) return false;
    return coreComplete(ORDER[i - 1].id);
  }

  function lockReason(unitId) {
    if (unitId === 'unit1' || unitId === 'dictation3') return '';
    const i = unitIndex(unitId);
    if (i <= 0) return '';
    const prev = ORDER[i - 1];
    const cur = ORDER[i];
    return 'Finish ' + prev.label + ' Sentence Fill, Missing Letters, and Memory Match to unlock ' + cur.label + '.';
  }

  function formatEarned(ts) {
    const d = new Date(ts);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function listWithStatus() {
    const data = load();
    return catalog().map(function (b) {
      const earned = data.earned[b.id];
      return {
        id: b.id,
        title: b.title,
        english: b.english,
        image: b.image,
        unitLabel: b.unitLabel || '',
        detail: b.detail,
        earned: !!earned,
        earnedAt: earned ? earned.earnedAt : null,
        earnedLabel: earned ? formatEarned(earned.earnedAt) : ''
      };
    });
  }

  function writeResult(el, result) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    const fresh = (result && result.newBadges) || [];
    if (!fresh.length) {
      el.textContent = 'Saved. Open Badges to see what you have earned.';
      return;
    }
    fresh.forEach(function (b) {
      const row = document.createElement('div');
      row.className = 'badge-toast';
      const img = document.createElement('img');
      img.className = 'badge-toast-art';
      img.src = imageSrc(b.image);
      img.alt = '';
      const text = document.createElement('div');
      text.className = 'badge-toast-text';
      const kicker = document.createElement('p');
      kicker.className = 'badge-toast-kicker';
      kicker.textContent = 'New badge';
      const name = document.createElement('p');
      name.className = 'badge-toast-name';
      name.textContent = b.title;
      const english = document.createElement('p');
      english.className = 'badge-toast-english';
      english.textContent = b.english || '';
      text.appendChild(kicker);
      text.appendChild(name);
      text.appendChild(english);
      row.appendChild(img);
      row.appendChild(text);
      el.appendChild(row);
    });
  }

  return {
    KEY: KEY,
    ORDER: ORDER,
    catalog: catalog,
    recordSession: recordSession,
    noteReview: noteReview,
    isEarned: isEarned,
    getEarned: getEarned,
    coreComplete: coreComplete,
    hardUnlocked: hardUnlocked,
    unitUnlocked: unitUnlocked,
    lockReason: lockReason,
    formatEarned: formatEarned,
    listWithStatus: listWithStatus,
    imageSrc: imageSrc,
    writeResult: writeResult,
    load: load
  };
})();
