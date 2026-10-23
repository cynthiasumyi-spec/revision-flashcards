/**
 * Shared practice helpers
 */
window.PracticeCommon = (function () {
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function unitParam() {
    return (window.PracticeRegistry && window.PracticeRegistry.qsUnit()) || 'unit1';
  }

  function loadUnit() {
    const id = unitParam();
    const pack = window.PracticeRegistry.getUnit(id);
    return { id, pack };
  }

  function hubLink(unitId) {
    return 'index.html?unit=' + encodeURIComponent(unitId || unitParam());
  }

  function practiceLink(page, unitId) {
    return page + '?unit=' + encodeURIComponent(unitId || unitParam());
  }

  function playAudio(src) {
    if (!src) return;
    try {
      const a = new Audio(src);
      a.play().catch(function () {});
    } catch (e) {}
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Mask a full phrase. Spaces and punctuation stay visible.
   * Easy hides every 3rd letter (stable). Hard hides about half, shuffled.
   */
  function maskPhrase(phrase, mode, shuffleFn) {
    const word = String(phrase || '');
    const chars = word.split('');
    const letterIdx = [];
    chars.forEach(function (c, i) {
      if (/[a-zA-Z]/.test(c)) letterIdx.push(i);
    });
    if (!letterIdx.length) return word;
    const hide = {};
    if (mode === 'hard') {
      const mix = typeof shuffleFn === 'function' ? shuffleFn(letterIdx.slice()) : shuffle(letterIdx);
      const hideCount = Math.max(2, Math.ceil(letterIdx.length / 2));
      mix.slice(0, hideCount).forEach(function (i) { hide[i] = true; });
    } else {
      letterIdx.forEach(function (idx, n) {
        if (n % 3 === 1) hide[idx] = true;
      });
      if (!Object.keys(hide).length) hide[letterIdx[0]] = true;
    }
    return chars.map(function (c, i) { return hide[i] ? '_' : c; }).join('');
  }

  /** @deprecated use maskPhrase so phrases keep spaces */
  function maskWord(word, mode) {
    return maskPhrase(word, mode);
  }

  function patternToSlots(word, pattern) {
    // If pattern given with _, use it; else treat pattern as mask of same length
    const w = word;
    const p = pattern || w;
    const slots = [];
    // Align by index when same length; else rebuild from _
    if (p.length === w.length) {
      for (let i = 0; i < w.length; i++) {
        if (p[i] === '_') slots.push({ type: 'blank', answer: w[i], index: i });
        else slots.push({ type: 'show', char: w[i], index: i });
      }
    } else {
      // fallback: show all as blanks for letters
      for (let i = 0; i < w.length; i++) {
        if (/[a-zA-Z]/.test(w[i])) slots.push({ type: 'blank', answer: w[i], index: i });
        else slots.push({ type: 'show', char: w[i], index: i });
      }
    }
    return slots;
  }

  function toast(el, msg, kind) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + (kind || '');
    el.hidden = false;
  }

  return {
    shuffle, unitParam, loadUnit, hubLink, practiceLink,
    playAudio, escapeHtml, maskWord, maskPhrase, patternToSlots, toast
  };
})();
