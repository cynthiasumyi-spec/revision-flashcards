/**
 * Shows badges earned at the end of a Grammar round.
 * Recording stays in practice/badges.js.
 */
window.GrammarProgress = (function () {
  function noteEl() {
    var done = document.getElementById('done');
    if (!done) return null;
    var note = document.getElementById('badge-note');
    if (!note) {
      note = document.createElement('div');
      note.id = 'badge-note';
      done.appendChild(note);
    }
    return note;
  }

  function show(result) {
    if (!window.Badges || typeof Badges.writeResult !== 'function') return;
    Badges.writeResult(noteEl(), result || { newBadges: [] });
  }

  function showMany(results) {
    var fresh = [];
    (results || []).forEach(function (result) {
      ((result && result.newBadges) || []).forEach(function (badge) {
        fresh.push(badge);
      });
    });
    show({ newBadges: fresh });
  }

  return { show: show, showMany: showMany };
})();
