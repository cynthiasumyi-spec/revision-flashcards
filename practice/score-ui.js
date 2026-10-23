/**
 * Small DOM helpers for the score system. Scoring rules live in score.js.
 */
window.ScoreUi = (function () {
  function score() {
    return window.Score || null;
  }

  function paintSummary(ledger) {
    const api = score();
    if (!api || !ledger) return;
    const scoreEl = document.getElementById('session-score');
    const detailEl = document.getElementById('session-detail');
    const totalsEl = document.getElementById('session-totals');
    if (scoreEl) scoreEl.textContent = 'Session score: +' + ledger.points();
    if (detailEl) detailEl.textContent = '(' + ledger.detail() + ')';
    if (totalsEl) totalsEl.textContent = api.formatTotals(api.today(), api.total());
  }

  function correctToast(award, prefix) {
    const api = score();
    if (!api) return prefix || '';
    return api.formatCorrectToast(award, prefix);
  }

  function reviewFlag(wordKey) {
    try {
      if (!wordKey || !window.Mastery) return false;
      return window.Mastery.get(wordKey).state === 'review';
    } catch (e) {
      return false;
    }
  }

  function awardCorrect(wordKey, unitId, mode) {
    const api = score();
    if (!api || !wordKey) return null;
    return api.awardCorrect({
      wordKey: wordKey,
      unitId: unitId,
      mode: mode,
      review: reviewFlag(wordKey)
    });
  }

  function awardWrong(wordKey) {
    const api = score();
    if (!api || !wordKey) return null;
    return api.awardWrong({ wordKey: wordKey });
  }

  function enforceUnit(unitId) {
    const api = score();
    if (!api || api.isUnitUnlocked(unitId)) return true;
    const main = document.querySelector('main');
    if (!main) return false;
    Array.prototype.forEach.call(main.children, function (el) {
      if (el.id !== 'unit-lock') el.hidden = true;
    });
    let box = document.getElementById('unit-lock');
    if (!box) {
      box = document.createElement('div');
      box.id = 'unit-lock';
      box.className = 'panel empty-state';
      main.appendChild(box);
    }
    const need = api.pointsToUnlock(unitId);
    box.hidden = false;
    box.innerHTML =
      '<p><strong>' + api.unitLabel(unitId) + '</strong> is locked.</p>' +
      '<p>It unlocks at ' + need + ' total points.</p>' +
      '<p>' + api.formatTotals(api.today(), api.total()) + '</p>' +
      '<p><a href="index.html">Back to the practice hub</a></p>';
    return false;
  }

  function bindHardToggle(unitId) {
    const hard = document.getElementById('diff-hard');
    const api = score();
    if (!hard || !api) return function () {};
    function sync() {
      const open = api.isHardUnlocked(unitId);
      hard.disabled = !open;
      hard.classList.toggle('is-locked', !open);
      hard.setAttribute('aria-disabled', open ? 'false' : 'true');
      hard.title = open
        ? 'Hard mode'
        : 'Unlock Hard with 80 points in this unit, or finish Easy sentence fill and Easy missing letters';
      let badge = hard.querySelector('.badge');
      if (!open) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = 'locked';
          hard.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
      }
    }
    sync();
    return sync;
  }

  return {
    paintSummary: paintSummary,
    correctToast: correctToast,
    reviewFlag: reviewFlag,
    awardCorrect: awardCorrect,
    awardWrong: awardWrong,
    enforceUnit: enforceUnit,
    bindHardToggle: bindHardToggle
  };
})();
