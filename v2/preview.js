(function () {
  var STEP_INDEX = { books: 0, levels: 1, unit: 2, type: 3, method: 4, soon: 5 };
  var STEP_KEYS = {
    books: [],
    levels: ["book"],
    unit: ["book", "level"],
    type: ["book", "level", "unit"],
    method: ["book", "level", "unit", "kind"],
    soon: ["book", "level", "unit", "kind", "method"]
  };
  var LABELS = {
    book: { Longman: "Longman", Oxford: "Oxford" },
    level: { P1: "P1", P2: "P2", P3: "P3", P4: "P4", P5: "P5", P6: "P6" },
    unit: { each: "Each unit", combine: "Combine" },
    kind: { words: "Words", grammar: "Grammar" },
    method: { revision: "Revision卡", game: "Game", practice: "Practice" }
  };
  var SOON = {
    revision: { title: "Revision卡", href: "../index.html#packs", cta: "Open current revision packs" },
    game: { title: "Game", href: "../game/index.html", cta: "Open current games" },
    practice: { title: "Practice", href: "../practice/index.html", cta: "Open current practice" }
  };

  var params = new URLSearchParams(window.location.search);
  var step = document.body.getAttribute("data-step");

  function allowed(key, value) {
    return !!(LABELS[key] && Object.prototype.hasOwnProperty.call(LABELS[key], value));
  }

  function hrefFor(path, stepName, extra) {
    var next = new URLSearchParams();
    var keys = STEP_KEYS[stepName] || [];
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value && allowed(key, value)) next.set(key, value);
    });
    if (extra && extra.key && allowed(extra.key, extra.value)) {
      next.set(extra.key, extra.value);
    }
    var query = next.toString();
    return query ? path + "?" + query : path;
  }

  document.querySelectorAll("[data-key]").forEach(function (link) {
    link.href = hrefFor(link.getAttribute("data-dest"), link.getAttribute("data-dest-step"), {
      key: link.getAttribute("data-key"),
      value: link.getAttribute("data-value")
    });
  });

  document.querySelectorAll("[data-keep]").forEach(function (link) {
    link.href = hrefFor(link.getAttribute("data-keep"), link.getAttribute("data-keep-step"));
  });

  document.querySelectorAll(".step").forEach(function (el) {
    var name = el.getAttribute("data-step");
    var path = el.getAttribute("data-path");
    var here = name === step || (step === "soon" && name === "method");
    if (here) {
      el.classList.add("is-current");
      el.removeAttribute("href");
      el.setAttribute("aria-current", "step");
      return;
    }
    if (STEP_INDEX[name] < STEP_INDEX[step]) {
      el.classList.add("is-done");
      el.href = hrefFor(path, name);
      return;
    }
    el.classList.add("is-later");
    el.removeAttribute("href");
    el.setAttribute("aria-disabled", "true");
  });

  var picked = document.querySelector("[data-picked]");
  if (picked) {
    var bits = [];
    ["book", "level", "unit", "kind", "method"].forEach(function (key) {
      var value = params.get(key);
      if (value && allowed(key, value)) bits.push(LABELS[key][value]);
    });
    if (bits.length) {
      picked.hidden = false;
      bits.forEach(function (label) {
        var crumb = document.createElement("span");
        crumb.className = "crumb";
        crumb.textContent = label;
        picked.appendChild(crumb);
      });
    }
  }

  var missing = document.querySelector("[data-missing]");
  if (missing) {
    var need = STEP_KEYS[step] || [];
    var gap = need.some(function (key) {
      var value = params.get(key);
      return !value || !allowed(key, value);
    });
    if (gap) missing.hidden = false;
  }

  if (step === "soon") {
    var method = params.get("method");
    var dest = method && SOON[method];
    var title = document.querySelector("[data-soon-title]");
    var cta = document.querySelector("[data-soon-cta]");
    if (dest && title && cta) {
      title.textContent = dest.title;
      cta.href = dest.href;
      cta.textContent = dest.cta;
    }
  }
})();
