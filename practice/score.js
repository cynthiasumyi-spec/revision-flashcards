/**
 * Practice score, unit unlocks, and badges.
 * localStorage: totalScore, todayScore, todayEarnedWords, unitScores,
 * unlockedUnits, hardUnlocked, badges, needsReview.
 * practiceProgress and pointDays support once-only bonuses and the streak.
 *
 * todayScore is { date: 'YYYY-MM-DD', points: number } so a new local day
 * resets the visible today total without touching totalScore.
 * todayEarnedWords is { 'YYYY-MM-DD': [wordKey, ...] }.
 */
(function (root) {
  const UNIT_ORDER = ['unit1', 'unit2', 'unit3', 'unit4', 'dictation3'];
  const UNIT_STEP = 150;
  const UNIT_LABELS = {
    unit1: 'Unit 1',
    unit2: 'Unit 2',
    unit3: 'Unit 3',
    unit4: 'Unit 4',
    dictation3: 'Dictation 3'
  };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function createScore(deps) {
    const storage = deps && deps.storage;
    const now = (deps && deps.now) || function () { return new Date(); };

    function readJSON(key, fallback) {
      try {
        const raw = storage.getItem(key);
        if (raw == null || raw === '') return fallback;
        const data = JSON.parse(raw);
        return data == null ? fallback : data;
      } catch (e) {
        return fallback;
      }
    }

    function writeJSON(key, value) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (e) { /* private mode / quota */ }
    }

    function todayKey() {
      const date = now();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return date.getFullYear() + '-' + month + '-' + day;
    }

    function readTotal() {
      const n = Number(storage.getItem('totalScore'));
      return Number.isFinite(n) ? n : 0;
    }

    function ensureDay() {
      const today = todayKey();
      const raw = readJSON('todayScore', null);
      if (!raw || typeof raw !== 'object' || raw.date !== today || !Number.isFinite(Number(raw.points))) {
        writeJSON('todayScore', { date: today, points: 0 });
      }
    }

    function readTodayPoints() {
      const raw = readJSON('todayScore', null);
      if (!raw || raw.date !== todayKey()) return 0;
      const n = Number(raw.points);
      return Number.isFinite(n) ? n : 0;
    }

    function unitOf(wordKey) {
      const text = String(wordKey || '');
      const cut = text.indexOf(':');
      return cut > 0 ? text.slice(0, cut) : '';
    }

    function readReview() {
      const list = readJSON('needsReview', []);
      return Array.isArray(list) ? list.filter(function (key) { return typeof key === 'string' && key; }) : [];
    }

    function earnedToday(wordKey) {
      const map = readJSON('todayEarnedWords', {});
      const list = map && Array.isArray(map[todayKey()]) ? map[todayKey()] : [];
      return list.indexOf(wordKey) !== -1;
    }

    function markEarned(wordKey) {
      if (!wordKey) return;
      const today = todayKey();
      const map = readJSON('todayEarnedWords', {});
      const bag = map && typeof map === 'object' ? map : {};
      const list = Array.isArray(bag[today]) ? bag[today].slice() : [];
      if (list.indexOf(wordKey) === -1) list.push(wordKey);
      bag[today] = list;
      writeJSON('todayEarnedWords', bag);
    }

    function addRaw(amount, unitId) {
      if (!amount) return;
      storage.setItem('totalScore', String(readTotal() + amount));
      writeJSON('todayScore', { date: todayKey(), points: readTodayPoints() + amount });
      if (unitId) {
        const scores = readJSON('unitScores', {});
        const bag = scores && typeof scores === 'object' ? scores : {};
        bag[unitId] = (Number(bag[unitId]) || 0) + amount;
        writeJSON('unitScores', bag);
      }
    }

    function awardBadge(id, meta) {
      const badges = readJSON('badges', {});
      const bag = badges && typeof badges === 'object' ? badges : {};
      if (bag[id]) return false;
      bag[id] = Object.assign({ earnedAt: todayKey() }, meta || {});
      writeJSON('badges', bag);
      return true;
    }

    function addDays(ymd, count) {
      const bits = ymd.split('-').map(Number);
      const date = new Date(bits[0], bits[1] - 1, bits[2]);
      date.setDate(date.getDate() + count);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return date.getFullYear() + '-' + month + '-' + day;
    }

    function hasStreak(days, length) {
      const set = {};
      days.forEach(function (day) { set[day] = true; });
      const sorted = Object.keys(set).sort();
      for (let i = 0; i < sorted.length; i += 1) {
        let ok = true;
        for (let step = 1; step < length; step += 1) {
          if (!set[addDays(sorted[i], step)]) {
            ok = false;
            break;
          }
        }
        if (ok) return true;
      }
      return false;
    }

    function notePointDay(parts) {
      const today = todayKey();
      const saved = readJSON('pointDays', []);
      const days = Array.isArray(saved) ? saved.slice() : [];
      if (days.indexOf(today) === -1) days.push(today);
      writeJSON('pointDays', days);
      if (!hasStreak(days, 3)) return;
      if (!awardBadge('streak3', {})) return;
      addRaw(25, null);
      parts.push({ label: 'Streak 3', points: 25 });
    }

    function syncUnits() {
      const total = readTotal();
      const current = readJSON('unlockedUnits', []);
      const set = {};
      (Array.isArray(current) ? current : []).forEach(function (id) {
        if (id) set[id] = true;
      });
      set.unit1 = true;
      UNIT_ORDER.forEach(function (id, index) {
        if (total >= index * UNIT_STEP) set[id] = true;
      });
      const ordered = [];
      UNIT_ORDER.forEach(function (id) {
        if (set[id]) ordered.push(id);
      });
      Object.keys(set).forEach(function (id) {
        if (ordered.indexOf(id) === -1) ordered.push(id);
      });
      writeJSON('unlockedUnits', ordered);
      return ordered;
    }

    function easyDone(unit) {
      return !!(unit && unit.fill && unit.fill.easy && unit.letters && unit.letters.easy);
    }

    function syncHard(onlyId) {
      const scores = readJSON('unitScores', {});
      const progress = readJSON('practiceProgress', {});
      const hard = readJSON('hardUnlocked', {});
      const bag = hard && typeof hard === 'object' ? hard : {};
      const ids = {};
      if (onlyId) ids[onlyId] = true;
      Object.keys(scores || {}).forEach(function (id) { ids[id] = true; });
      Object.keys(progress || {}).forEach(function (id) { ids[id] = true; });
      Object.keys(ids).forEach(function (id) {
        if (!id || bag[id]) return;
        const score = scores && Number(scores[id]) || 0;
        if (score >= 80 || easyDone(progress && progress[id])) bag[id] = true;
      });
      writeJSON('hardUnlocked', bag);
      return bag;
    }

    function finish(parts, unitId) {
      if (parts.some(function (part) { return part.points > 0; })) notePointDay(parts);
      syncUnits();
      syncHard(unitId);
    }

    function sum(parts) {
      return parts.reduce(function (total, part) { return total + part.points; }, 0);
    }

    function result(points, reason, parts) {
      return {
        points: points,
        awarded: sum(parts),
        reason: reason,
        parts: parts,
        today: readTodayPoints(),
        total: readTotal()
      };
    }

    function clearReviewed(wordKeys) {
      const drop = {};
      (wordKeys || []).forEach(function (key) {
        if (key) drop[key] = true;
      });
      const before = readReview();
      const after = before.filter(function (key) { return !drop[key]; });
      if (after.length === before.length) return [];
      writeJSON('needsReview', after);
      const units = [];
      Object.keys(drop).forEach(function (key) {
        const unitId = unitOf(key);
        if (!unitId || units.indexOf(unitId) !== -1) return;
        const had = before.some(function (item) { return unitOf(item) === unitId; });
        const left = after.some(function (item) { return unitOf(item) === unitId; });
        if (had && !left) units.push(unitId);
      });
      return units;
    }

    function awardReviewSlayer(unitId, parts) {
      if (!awardBadge('reviewSlayer', { unitId: unitId })) return;
      addRaw(20, unitId);
      parts.push({ label: 'Review slayer', points: 20 });
    }

    function awardCorrect(opts) {
      opts = opts || {};
      ensureDay();
      const wordKey = opts.wordKey || '';
      const unitId = opts.unitId || unitOf(wordKey);
      const mode = String(opts.mode || 'easy').toLowerCase();
      const parts = [];
      if (!wordKey) return result(0, 'easy', parts);

      const listed = readReview().indexOf(wordKey) !== -1;
      const isReview = listed || !!opts.review;
      if (earnedToday(wordKey)) {
        clearReviewed([wordKey]).forEach(function (unit) { awardReviewSlayer(unit, parts); });
        finish(parts, unitId);
        return result(0, 'already', parts);
      }

      let points = 2;
      let reason = 'easy';
      if (isReview) {
        points = 15;
        reason = 'review';
        parts.push({ label: 'Review bonus', points: 15 });
      } else if (mode === 'hard') {
        points = 5;
        reason = 'hard';
        parts.push({ label: 'Correct', points: 5 });
      } else {
        parts.push({ label: 'Correct', points: 2 });
      }
      addRaw(points, unitId);
      markEarned(wordKey);
      clearReviewed([wordKey]).forEach(function (unit) { awardReviewSlayer(unit, parts); });
      finish(parts, unitId);
      return result(points, reason, parts);
    }

    function awardWrong(opts) {
      opts = opts || {};
      ensureDay();
      const wordKey = opts.wordKey || '';
      if (wordKey) {
        const list = readReview();
        if (list.indexOf(wordKey) === -1) {
          list.push(wordKey);
          writeJSON('needsReview', list);
        }
      }
      return result(0, 'wrong', []);
    }

    function typeDone(slot) {
      return !!(slot && (slot.done || slot.easy || slot.hard));
    }

    function completePractice(opts) {
      opts = opts || {};
      ensureDay();
      const unitId = opts.unitId;
      const practice = opts.practice;
      const mode = String(opts.mode || 'easy').toLowerCase();
      const parts = [];
      if (!unitId || ['fill', 'letters', 'match'].indexOf(practice) === -1) {
        return result(0, 'practice', parts);
      }

      const progress = readJSON('practiceProgress', {});
      const bag = progress && typeof progress === 'object' ? progress : {};
      const unit = bag[unitId] && typeof bag[unitId] === 'object' ? bag[unitId] : {};
      if (practice === 'match') {
        unit.match = unit.match || {};
        unit.match.done = true;
      } else {
        unit[practice] = unit[practice] || {};
        unit[practice].done = true;
        if (mode === 'hard') unit[practice].hard = true;
        else unit[practice].easy = true;
      }

      addRaw(5, unitId);
      parts.push({ label: 'Practice complete', points: 5 });

      if (typeDone(unit.fill) && typeDone(unit.letters) && typeDone(unit.match) && !unit.finisherAwarded) {
        unit.finisherAwarded = true;
        addRaw(10, unitId);
        parts.push({ label: 'Unit finisher', points: 10 });
        awardBadge('unitFinisher', { unitId: unitId });
      }
      bag[unitId] = unit;
      writeJSON('practiceProgress', bag);

      if (mode === 'hard' && (practice === 'fill' || practice === 'letters')) {
        if (awardBadge('hardChallenger', { unitId: unitId })) {
          addRaw(30, unitId);
          parts.push({ label: 'Hard challenger', points: 30 });
        }
      }

      finish(parts, unitId);
      return result(5, 'practice', parts);
    }

    function eligibleWords(correctWordKeys) {
      const map = readJSON('todayEarnedWords', {});
      const have = {};
      const todayList = map && Array.isArray(map[todayKey()]) ? map[todayKey()] : [];
      todayList.forEach(function (key) { have[key] = true; });
      const seen = {};
      const newly = [];
      (correctWordKeys || []).forEach(function (key) {
        if (!key || seen[key] || have[key]) {
          if (key) seen[key] = true;
          return;
        }
        seen[key] = true;
        have[key] = true;
        newly.push(key);
      });
      return newly;
    }

    function completeTimed(opts) {
      opts = opts || {};
      ensureDay();
      const unitId = opts.unitId || '';
      const keys = Array.isArray(opts.correctWordKeys) ? opts.correctWordKeys : [];
      let remaining = Number(opts.remainingSeconds);
      if (!Number.isFinite(remaining) || remaining < 0) remaining = 0;
      remaining = Math.floor(remaining);
      const parts = [];
      const newly = eligibleWords(keys);
      newly.forEach(markEarned);
      if (newly.length) {
        const wordPoints = newly.length * 10;
        addRaw(wordPoints, unitId);
        parts.push({ label: 'Correct', points: wordPoints });
      }
      if (remaining > 0) {
        const timePoints = remaining * 2;
        addRaw(timePoints, unitId);
        parts.push({ label: 'Time bonus', points: timePoints });
      }
      const runScore = newly.length * 10 + remaining * 2;
      if (runScore >= 100 && awardBadge('timedAce', { unitId: unitId, score: runScore })) {
        addRaw(15, unitId);
        parts.push({ label: 'Timed ace', points: 15 });
      }
      clearReviewed(keys).forEach(function (unit) { awardReviewSlayer(unit, parts); });
      finish(parts, unitId);
      return result(runScore, 'timed', parts);
    }

    function previewTimedCorrect(opts) {
      opts = opts || {};
      ensureDay();
      const wordKey = opts.wordKey;
      const sessionKeys = opts.sessionKeys || [];
      if (!wordKey || earnedToday(wordKey) || sessionKeys.indexOf(wordKey) !== -1) {
        return { points: 0, reason: 'already' };
      }
      return { points: 10, reason: 'timed' };
    }

    function formatDetail(parts) {
      const shown = (parts || []).filter(function (part) { return part && part.points; });
      if (!shown.length) return 'Correct +0';
      return shown.map(function (part) { return part.label + ' +' + part.points; }).join(' · ');
    }

    function formatCorrectToast(award, prefix) {
      award = award || {};
      let msg;
      if (award.points > 0) msg = (prefix ? prefix + ' ' : '') + '+' + award.points;
      else if (award.reason === 'already') msg = 'Already earned today';
      else msg = '+0';
      const extras = (award.parts || []).filter(function (part) {
        return part && part.points && part.label !== 'Correct' && part.label !== 'Review bonus';
      });
      if (extras.length) {
        msg += ' · ' + extras.map(function (part) { return part.label + ' +' + part.points; }).join(' · ');
      }
      return msg;
    }

    function formatEarnedDate(ymd) {
      const bits = String(ymd || '').split('-');
      const month = Number(bits[1]);
      const day = Number(bits[2]);
      if (!bits[0] || !month || !day || !MONTHS[month - 1]) return String(ymd || '');
      return day + ' ' + MONTHS[month - 1] + ' ' + bits[0];
    }

    function catalog() {
      ensureDay();
      const earned = readJSON('badges', {});
      const defs = [
        {
          id: 'unitFinisher',
          name: 'Unit Finisher',
          zh: '單元完成',
          condition: 'Finish sentence fill, missing letters, and memory match for a unit.',
          bonus: '+10 with that finish (this badge does not add it again)'
        },
        {
          id: 'reviewSlayer',
          name: 'Review Slayer',
          zh: '重溫剋星',
          condition: 'Clear every needs-review word in a unit.',
          bonus: '+20 once'
        },
        {
          id: 'timedAce',
          name: 'Timed Ace',
          zh: '限時高手',
          condition: 'Score 100 or more in one timed run.',
          bonus: '+15 once'
        },
        {
          id: 'streak3',
          name: 'Streak 3',
          zh: '連續 3 日',
          condition: 'Earn points on 3 days in a row.',
          bonus: '+25 once'
        },
        {
          id: 'hardChallenger',
          name: 'Hard Challenger',
          zh: '困難挑戰',
          condition: 'Finish a Hard practice for a unit.',
          bonus: '+30 once'
        }
      ];
      return defs.map(function (def) {
        const got = earned && earned[def.id];
        return {
          id: def.id,
          name: def.name,
          zh: def.zh,
          condition: def.condition,
          bonus: def.bonus,
          earnedAt: got ? got.earnedAt : null,
          earnedLabel: got ? formatEarnedDate(got.earnedAt) : '',
          unitId: got && got.unitId ? got.unitId : '',
          unitLabel: got && got.unitId ? (UNIT_LABELS[got.unitId] || got.unitId) : ''
        };
      });
    }

    function ledger() {
      const buckets = [];
      function bump(label, points) {
        if (!points) return;
        const found = buckets.filter(function (bucket) { return bucket.label === label; })[0];
        if (found) found.points += points;
        else buckets.push({ label: label, points: points });
      }
      return {
        add: function (award) {
          ((award && award.parts) || []).forEach(function (part) { bump(part.label, part.points); });
        },
        points: function () {
          return buckets.reduce(function (total, bucket) { return total + bucket.points; }, 0);
        },
        detail: function () { return formatDetail(buckets); }
      };
    }

    return {
      awardCorrect: awardCorrect,
      awardWrong: awardWrong,
      completePractice: completePractice,
      completeTimed: completeTimed,
      previewTimedCorrect: previewTimedCorrect,
      isUnitUnlocked: function (unitId) {
        ensureDay();
        return syncUnits().indexOf(unitId) !== -1;
      },
      isHardUnlocked: function (unitId) {
        ensureDay();
        return !!syncHard(unitId)[unitId];
      },
      pointsToUnlock: function (unitId) {
        const index = UNIT_ORDER.indexOf(unitId);
        return index < 0 ? null : index * UNIT_STEP;
      },
      today: function () {
        ensureDay();
        return readTodayPoints();
      },
      total: readTotal,
      unitScore: function (unitId) {
        const scores = readJSON('unitScores', {});
        return scores && Number(scores[unitId]) || 0;
      },
      unlocked: function () {
        ensureDay();
        return syncUnits();
      },
      badges: function () {
        const bag = readJSON('badges', {});
        return bag && typeof bag === 'object' ? bag : {};
      },
      needsReview: function (unitId) {
        const list = readReview();
        if (!unitId) return list.slice();
        return list.filter(function (key) { return unitOf(key) === unitId; });
      },
      catalog: catalog,
      ledger: ledger,
      formatDetail: formatDetail,
      formatTotals: function (todayPts, totalPts) {
        return 'Today: ' + todayPts + ' · Total: ' + totalPts;
      },
      formatCorrectToast: formatCorrectToast,
      formatEarnedDate: formatEarnedDate,
      todayKey: todayKey,
      unitLabel: function (unitId) { return UNIT_LABELS[unitId] || unitId || ''; },
      UNIT_ORDER: UNIT_ORDER.slice()
    };
  }

  root.createScore = createScore;
  try {
    if (root.localStorage) {
      root.Score = createScore({
        storage: root.localStorage,
        now: function () { return new Date(); }
      });
    }
  } catch (e) { /* localStorage blocked */ }
})(typeof globalThis !== 'undefined' ? globalThis : this);
