(function () {
  var root = document.querySelector("[data-demo]");
  if (!root) return;

  var scenarioTabs = Array.prototype.slice.call(
    root.querySelectorAll(".scenario-tab")
  );
  var scenarios = Array.prototype.slice.call(root.querySelectorAll(".scenario"));

  function selectScenario(index) {
    scenarioTabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    scenarios.forEach(function (panel, i) {
      panel.hidden = i !== index;
    });
  }

  function selectStep(scenario, index) {
    var tabs = Array.prototype.slice.call(
      scenario.querySelectorAll(".step-bar [role='tab']")
    );
    var panels = Array.prototype.slice.call(scenario.querySelectorAll(".step"));
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (panel, i) {
      panel.hidden = i !== index;
    });
  }

  scenarioTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectScenario(index);
    });
    tab.addEventListener("keydown", function (event) {
      var next = index;
      if (event.key === "ArrowRight") next = (index + 1) % scenarioTabs.length;
      else if (event.key === "ArrowLeft")
        next = (index - 1 + scenarioTabs.length) % scenarioTabs.length;
      else return;
      event.preventDefault();
      selectScenario(next);
      scenarioTabs[next].focus();
    });
  });

  scenarios.forEach(function (scenario) {
    var tabs = Array.prototype.slice.call(
      scenario.querySelectorAll(".step-bar [role='tab']")
    );
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectStep(scenario, index);
      });
      tab.addEventListener("keydown", function (event) {
        var next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft")
          next = (index - 1 + tabs.length) % tabs.length;
        else return;
        event.preventDefault();
        selectStep(scenario, next);
        tabs[next].focus();
      });
    });
  });

  function copyWithCommand(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.width = "2em";
    area.style.height = "2em";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function mark(button, message) {
    button.textContent = message;
    window.setTimeout(function () {
      button.textContent = "Скопировать шаблон";
    }, 2200);
  }

  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    function distance() {
      var card = track.querySelector(".task-card");
      if (!card) return track.clientWidth;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return card.getBoundingClientRect().width + gap;
    }
    function move(direction) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollBy({
        left: direction * distance(),
        behavior: reduce ? "auto" : "smooth",
      });
    }
    prev.addEventListener("click", function () {
      move(-1);
    });
    next.addEventListener("click", function () {
      move(1);
    });
  }

  root.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy]");
    if (!button) return;
    var node = document.getElementById(button.getAttribute("data-copy"));
    if (!node) return;
    var text = node.innerText;
    if (copyWithCommand(text)) {
      mark(button, "Шаблон скопирован");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      button.textContent = "Копируем…";
      navigator.clipboard.writeText(text).then(function () {
        mark(button, "Шаблон скопирован");
      }).catch(function () {
        mark(button, "Скопируйте текст вручную");
      });
      return;
    }
    mark(button, "Скопируйте текст вручную");
  });
})();
