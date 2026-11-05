(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClueHunt = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ENDING = "The film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe, and the stall can collect the tickets after the film.";

  var HOTSPOTS = [
    {
      id: "stall",
      name: "Charity stall",
      kind: "search",
      art: "../practice/grammar/illust/u1_s4_carnival_stalls.jpg",
      intro: "Look around the charity stall.",
      cardTitle: "Charity stall",
      cardText: "The raffle tickets are gone. The flags and the old books are still there.",
      misleading: false,
      spots: [
        { id: "tickets", label: "Empty raffle spot", useful: true, reply: "The raffle tickets are gone. The flags and the old books are still there." },
        { id: "flags", label: "Flags", useful: false, reply: "The flags are still on the table." },
        { id: "books", label: "Old books", useful: false, reply: "The old books are still there." }
      ]
    },
    {
      id: "hall",
      name: "School hall",
      kind: "talk",
      art: "../practice/grammar/illust/u4_s4_musical_finale.jpg",
      intro: "A show is on in the school hall.",
      cardTitle: "School hall",
      cardText: "A comedy is on in the school hall. A boy came in with the raffle box.",
      misleading: false,
      prompts: [
        { id: "comedy", label: "What is on in the hall?", useful: true, reply: "A comedy is on in the school hall. A boy came in with the raffle box." },
        { id: "when", label: "What time did you see him?", useful: false, reply: "The comedy is in the afternoon. I did not see him at noon." },
        { id: "ken", label: "Was Ken here?", useful: false, reply: "I did not see Ken in the hall." }
      ]
    },
    {
      id: "film",
      name: "Film club",
      kind: "talk",
      art: "../practice/grammar/illust/u4_s5_studio_lights.jpg",
      intro: "Amy left the stall with Leo. She is here with the film club list.",
      cardTitle: "Film club",
      cardText: "The film club asked Amy to bring the tickets for their comedy draw.",
      misleading: false,
      prompts: [
        { id: "asked", label: "Who asked for the tickets?", useful: true, reply: "The film club asked Amy to bring the tickets for their comedy draw." },
        { id: "caretaker", label: "Did the caretaker take the box?", useful: false, reply: "No. The caretaker did not ask for the tickets." },
        { id: "wheel", label: "Is Leo at the prize wheel?", useful: false, reply: "Ken looked beside the prize wheel. Leo was not there." }
      ]
    },
    {
      id: "store",
      name: "Storeroom",
      kind: "talk",
      art: "../practice/grammar/illust/u1_07_books.jpg",
      intro: "Ken is in the storeroom with the books.",
      cardTitle: "Storeroom",
      cardText: "Ken says he saw Leo go into the storeroom at noon.",
      misleading: true,
      prompts: [
        { id: "noon", label: "What time did you see Leo?", useful: true, reply: "Ken says he saw Leo go into the storeroom at noon." },
        { id: "who", label: "Who took the box?", useful: false, reply: "I am not sure. I only remember the storeroom." },
        { id: "hall", label: "Where is the school hall?", useful: false, reply: "The school hall is across the fair, not in here." }
      ]
    }
  ];

  var CASE = {
    who: {
      prompt: "Who took the box?",
      options: ["The film club", "Ken", "Miss Chan", "The caretaker"],
      answer: "The film club"
    },
    where: {
      prompt: "Where is Leo?",
      options: ["In the school hall", "In the storeroom", "Beside the prize wheel", "At the charity stall"],
      answer: "In the school hall"
    }
  };

  function findHotspot(hotspotId) {
    for (var i = 0; i < HOTSPOTS.length; i++) {
      if (HOTSPOTS[i].id === hotspotId) return HOTSPOTS[i];
    }
    return null;
  }

  function findAction(hotspot, actionId) {
    var list = hotspot.kind === "search" ? hotspot.spots : hotspot.prompts;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === actionId) return list[i];
    }
    return null;
  }

  function createHunt() {
    return { found: {}, order: [] };
  }

  function visit(state, hotspotId, actionId) {
    var hotspot = findHotspot(hotspotId);
    if (!hotspot) {
      return { state: state, added: false, duplicate: false, reply: "That place is not on the map.", card: null };
    }
    var action = findAction(hotspot, actionId);
    if (!action) {
      return { state: state, added: false, duplicate: false, reply: "Try another spot.", card: null };
    }
    if (!action.useful) {
      return { state: state, added: false, duplicate: false, reply: action.reply, card: null };
    }
    if (state.found[hotspot.id]) {
      return { state: state, added: false, duplicate: true, reply: hotspot.cardText, card: state.found[hotspot.id] };
    }
    var card = {
      id: hotspot.id,
      title: hotspot.cardTitle,
      text: hotspot.cardText,
      misleading: hotspot.misleading
    };
    var found = Object.assign({}, state.found);
    found[hotspot.id] = card;
    var next = { found: found, order: state.order.concat([hotspot.id]) };
    return { state: next, added: true, duplicate: false, reply: hotspot.cardText, card: card };
  }

  function notebook(state) {
    return state.order.map(function (id) { return state.found[id]; });
  }

  function solveUnlocked(state) {
    return state.order.length === 4;
  }

  function displayCard(card) {
    return { title: card.title, text: card.text };
  }

  function caseHint(picks) {
    var whoOk = picks.who === CASE.who.answer;
    var whereOk = picks.where === CASE.where.answer;
    if (!whoOk && !whereOk) return "Read the film club card and the school hall card again.";
    if (!whoOk) return "Read the film club card again.";
    return "Read the school hall card again.";
  }

  function submitSolve(picks) {
    var chosen = picks || {};
    if (chosen.who !== CASE.who.answer || chosen.where !== CASE.where.answer) {
      return { ok: false, hint: caseHint(chosen), ending: "" };
    }
    return { ok: true, hint: "", ending: ENDING };
  }

  return {
    HOTSPOTS: HOTSPOTS,
    CASE: CASE,
    ENDING: ENDING,
    createHunt: createHunt,
    visit: visit,
    notebook: notebook,
    solveUnlocked: solveUnlocked,
    displayCard: displayCard,
    submitSolve: submitSolve
  };
});
