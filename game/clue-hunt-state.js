(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClueHunt = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ENDING = "Amy opened the raffle box backstage to draw a ticket for the new bike. Leo was waiting there the whole time. He is safe. Amy brings the tickets back and says sorry. The stall can use the tickets again.";

  var HOTSPOTS = [
    {
      id: "stall",
      name: "Charity stall",
      kind: "search",
      marker: "../practice/grammar/illust/u1_s4_carnival_stalls.jpg",
      art: "illust/scene-stall-memo.png",
      intro: "Look at the charity stall table.",
      cardTitle: "Charity stall",
      cardText: "An unsigned note with an apple pattern says: Please move the raffle box to the hall. Thanks!",
      misleading: false,
      spots: [
        { id: "memo", label: "Apple-pattern note", useful: true, reply: "An unsigned note with an apple pattern says: Please move the raffle box to the hall. Thanks!" },
        { id: "flags", label: "Flags", useful: false, reply: "The flags are still on the table." },
        { id: "books", label: "Old books", useful: false, reply: "The old books are still there." }
      ]
    },
    {
      id: "wheel",
      name: "Prize wheel",
      kind: "talk",
      marker: "../practice/grammar/illust/u1_s4_lucky_draw.jpg",
      art: "illust/scene-prize-wheel.png",
      intro: "A student is watching the prize wheel.",
      cardTitle: "Prize wheel",
      cardText: "About 1:15, someone in a blue jacket left the stall with Leo. The big prize is a new bike. People keep guessing the lucky ticket.",
      misleading: false,
      prompts: [
        { id: "jacket", label: "Who left with Leo?", useful: true, reply: "About 1:15, someone in a blue jacket left the stall with Leo. The big prize is a new bike. People keep guessing the lucky ticket." },
        { id: "lucky", label: "What are people guessing?", useful: false, reply: "People keep guessing which ticket is the lucky one." },
        { id: "noon", label: "Was this at noon?", useful: false, reply: "I saw them after lunch, not at noon." }
      ]
    },
    {
      id: "film",
      name: "Film club",
      kind: "talk",
      marker: "../practice/grammar/illust/u4_s5_studio_lights.jpg",
      art: "illust/scene-film-amy.png",
      intro: "Amy is here with the film club.",
      cardTitle: "Film club",
      cardText: "Amy's lunch box has a red apple every day. She once stuck an apple sticker on a wish list. She said if she won the bike, she would not wait for the bus.",
      misleading: false,
      prompts: [
        { id: "lunch", label: "What is in Amy's lunch?", useful: true, reply: "Amy's lunch box has a red apple every day. She once stuck an apple sticker on a wish list. She said if she won the bike, she would not wait for the bus." },
        { id: "note", label: "Did Amy write a note?", useful: false, reply: "I only know about her lunch and her wish list." },
        { id: "box", label: "Did you see the box?", useful: false, reply: "I did not see the box leave." }
      ]
    },
    {
      id: "hall",
      name: "School hall",
      kind: "search",
      marker: "../practice/grammar/illust/u4_s4_musical_finale.jpg",
      art: "illust/scene-hall-backstage.png",
      intro: "Look backstage.",
      cardTitle: "School hall",
      cardText: "About 1:20 someone brought the raffle box backstage. Leo is still waiting. A half-eaten apple core is by the side door. A wish slip says Win bike, with a tiny apple sticker.",
      misleading: false,
      spots: [
        { id: "core", label: "Apple core and wish slip", useful: true, reply: "About 1:20 someone brought the raffle box backstage. Leo is still waiting. A half-eaten apple core is by the side door. A wish slip says Win bike, with a tiny apple sticker." },
        { id: "curtain", label: "Stage curtain", useful: false, reply: "The stage curtain is still closed." },
        { id: "seats", label: "Empty seats", useful: false, reply: "The seats are empty." }
      ]
    },
    {
      id: "desk",
      name: "Miss Chan's desk",
      kind: "talk",
      marker: "illust/miss-chan-desk.png",
      art: "illust/miss-chan-desk.png",
      intro: "Miss Chan is at her desk.",
      cardTitle: "Miss Chan's desk",
      cardText: "Miss Chan did not ask anyone to move the raffle box.",
      misleading: false,
      prompts: [
        { id: "move", label: "Did you ask anyone to move the box?", useful: true, reply: "Miss Chan did not ask anyone to move the raffle box." },
        { id: "leo", label: "Where is Leo?", useful: false, reply: "I have not seen Leo since this morning." },
        { id: "note", label: "Who wrote the note?", useful: false, reply: "I do not know who wrote a note." }
      ]
    },
    {
      id: "store",
      name: "Storeroom",
      kind: "talk",
      marker: "../practice/grammar/illust/u1_07_books.jpg",
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
      options: ["Amy", "Ken", "Miss Chan", "The caretaker"],
      answer: "Amy"
    },
    why: {
      prompt: "Why?",
      options: [
        "To draw a ticket in secret and win the big prize",
        "To help Miss Chan move the box",
        "To hide the box in the storeroom",
        "To give the tickets to the film club"
      ],
      answer: "To draw a ticket in secret and win the big prize"
    },
    time: {
      prompt: "About what time did the box leave the stall?",
      options: ["About 1:20", "At noon", "At 11:30", "About 2:00"],
      answer: "About 1:20"
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
    return state.order.length === 6;
  }

  function displayCard(card) {
    return { title: card.title, text: card.text };
  }

  function timeHint(time) {
    if (time === "At noon") return "Read the storeroom card again.";
    return "Read the school hall card again.";
  }

  function caseHint(picks) {
    var whoOk = picks.who === CASE.who.answer;
    var whyOk = picks.why === CASE.why.answer;
    if (!whoOk && !whyOk) return "Read the film club card and the prize wheel card again.";
    if (!whoOk) return "Read the film club card again.";
    return "Read the prize wheel card again.";
  }

  function submitSolve(picks) {
    var chosen = picks || {};
    if (chosen.time !== CASE.time.answer) {
      return { ok: false, hint: timeHint(chosen.time), ending: "" };
    }
    if (chosen.who !== CASE.who.answer || chosen.why !== CASE.why.answer) {
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
