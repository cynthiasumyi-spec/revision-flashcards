/**
 * Memory match rules: 3 pairs (6 cards).
 * A flipped card stays face-up. A miss turns both cards face-down together.
 * A match stays face-up.
 */
window.MatchLogic = (function () {
  const ROUND_PAIRS = 3;

  function pickPairs(matching, shuffleFn) {
    const list = (matching || []).slice();
    const shuffled = typeof shuffleFn === 'function' ? shuffleFn(list) : list;
    return shuffled.slice(0, ROUND_PAIRS);
  }

  function cardCount(pairs) {
    return (pairs || []).length * 2;
  }

  function judge(a, b) {
    if (!b) {
      return {
        firstStaysFaceUp: true,
        matched: false,
        flipBothDown: false,
        matchedStayFaceUp: false
      };
    }
    const matched = !!(a && a.pairId === b.pairId && a.side !== b.side);
    return {
      firstStaysFaceUp: true,
      matched: matched,
      flipBothDown: !matched,
      matchedStayFaceUp: matched
    };
  }

  return {
    ROUND_PAIRS: ROUND_PAIRS,
    pickPairs: pickPairs,
    cardCount: cardCount,
    judge: judge
  };
})();
