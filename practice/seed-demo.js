/**
 * Demo seed for screenshots. Does not touch mastery.
 * Open /seed.html or call seedScoreDemo() from the console.
 */
(function (root) {
  function ymd(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }

  function shift(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return ymd(date);
  }

  function seedScoreDemo() {
    const today = shift(0);
    const store = root.localStorage;
    store.setItem('totalScore', '360');
    store.setItem('todayScore', JSON.stringify({ date: today, points: 48 }));
    store.setItem('todayEarnedWords', JSON.stringify({
      [today]: ['unit1:adopt', 'unit1:donate']
    }));
    store.setItem('unitScores', JSON.stringify({ unit1: 280, unit2: 50, unit3: 30 }));
    store.setItem('unlockedUnits', JSON.stringify(['unit1', 'unit2', 'unit3']));
    store.setItem('hardUnlocked', JSON.stringify({ unit1: true }));
    store.setItem('needsReview', JSON.stringify(['unit2:flood', 'unit1:books']));
    store.setItem('badges', JSON.stringify({
      unitFinisher: { earnedAt: today, unitId: 'unit1' },
      streak3: { earnedAt: today }
    }));
    store.setItem('pointDays', JSON.stringify([shift(-2), shift(-1), today]));
    store.setItem('practiceProgress', JSON.stringify({
      unit1: {
        fill: { easy: true, done: true },
        letters: { easy: true, done: true },
        match: { done: true },
        finisherAwarded: true
      }
    }));
    return { today: 48, total: 360, date: today };
  }

  root.seedScoreDemo = seedScoreDemo;
})(typeof window !== 'undefined' ? window : globalThis);
