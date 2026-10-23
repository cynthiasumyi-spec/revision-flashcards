/**
 * Timed challenge clock. Wrong answers do not remove seconds.
 */
window.TimedLogic = (function () {
  const TIME_PENALTY_SECONDS = 0;

  function nextRemaining(remaining) {
    return remaining;
  }

  return {
    TIME_PENALTY_SECONDS: TIME_PENALTY_SECONDS,
    nextRemaining: nextRemaining
  };
})();
