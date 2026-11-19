/* =========================================================
   58Client – interactions (no dependencies)
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Background: falling petals ---------- */
  var petals = document.getElementById('petals');
  if (petals && !reduceMotion) {
    var petalCount = window.innerWidth < 700 ? 10 : 18;
    for (var i = 0; i < petalCount; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = (Math.random() * 100).toFixed(2) + '%';
      petal.style.setProperty('--size', (8 + Math.random() * 10).toFixed(1) + 'px');
      petal.style.setProperty('--duration', (11 + Math.random() * 14).toFixed(1) + 's');
      petal.style.setProperty('--delay', (-Math.random() * 25).toFixed(1) + 's');
      petal.style.setProperty('--drift', ((Math.random() * 2 - 1) * 170).toFixed(0) + 'px');
      petal.style.setProperty('--opacity', (0.25 + Math.random() * 0.5).toFixed(2));
      petals.appendChild(petal);
    }
  }

  /* ---------- Hotbar in the hero image ---------- */
  var hotbar = document.getElementById('heroHotbar');
  if (hotbar) {
    for (var s = 0; s < 9; s++) {
      var slot = document.createElement('i');
      if (s === 3) slot.className = 'is-selected';
      hotbar.appendChild(slot);
    }
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Toast for placeholders ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3600);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-toast]'), function (button) {
    button.addEventListener('click', function () {
      showToast(button.getAttribute('data-toast'));
    });
  });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var willOpen = !navMenu.classList.contains('is-open');
      navMenu.classList.toggle('is-open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
    });
    navMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', function (event) {
      if (navMenu.classList.contains('is-open') && !event.target.closest('.nav')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Scroll: header + active nav item ---------- */
  var header = document.querySelector('.site-header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var watchIds = ['home', 'features', 'preview', 'download', 'discord'];
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 12);

    var marker = y + window.innerHeight * 0.35;
    var current = 'home';
    watchIds.forEach(function (id) {
      var element = document.getElementById(id);
      if (!element) return;
      var top = element.getBoundingClientRect().top + y;
      if (top <= marker) current = id;
    });
    if (current === 'preview') current = 'features';

    navLinks.forEach(function (link) {
      var target = link.getAttribute('href') || '';
      link.classList.toggle('is-active', target === '#' + current);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(revealElements, function (element) {
      revealObserver.observe(element);
    });
  } else {
    Array.prototype.forEach.call(revealElements, function (element) {
      element.classList.add('in-view');
    });
  }

  /* ---------- Interactive ClickGUI ---------- */
  function mod(name, tag, on, desc) {
    return {
      name: name, tag: tag, on: on, desc: desc,
      range: 4.2, delay: 120, color: '#ff9ec4', keybind: 'R-CONTROL'
    };
  }

  var categories = [
    { name: 'Combat', color: '#ff8fb8', modules: [
      mod('Kill Aura', 'TARGET', true, 'Helps you lock onto targets within range.'),
      mod('Crystal Aura', 'AUTO', false, 'Places and detonates crystals with an adjustable delay.'),
      mod('Auto Totem', 'SURVIVAL', true, 'Keeps a totem ready in your off-hand when you need it.'),
      mod('Velocity', 'DEFENSE', false, 'Reduces knockback so you stay in control.'),
      mod('Surround', 'BUILD', false, 'Builds a protective shell around you on demand.')
    ]},
    { name: 'Movement', color: '#ffd0a8', modules: [
      mod('Speed', 'MOVE', true, 'A smooth, controlled speed boost.'),
      mod('Fly', 'CREATIVE', false, 'Enables flight where the server allows it.'),
      mod('Jesus', 'MOVE', false, 'Lets you walk across water surfaces without sinking.'),
      mod('Sprint', 'AUTO', true, 'Sprints automatically while moving forward.'),
      mod('Anti Void', 'SAFETY', false, "Catches you if you fall into the void.")
    ]},
    { name: 'Render', color: '#b9a4ff', modules: [
      mod('ESP', 'VISUAL', true, 'Highlights players and entities through blocks.'),
      mod('Fullbright', 'LIGHT', false, 'Keeps the world evenly lit in any environment.'),
      mod('Name Tags', 'HUD', true, 'Shows clear name tags above other players.'),
      mod('No Hurt Cam', 'VISUAL', false, 'Removes camera shake when you take damage.'),
      mod('Storage ESP', 'VISUAL', false, 'Highlights chests and containers nearby.')
    ]},
    { name: 'HUD', color: '#8fd9ff', modules: [
      mod('Coordinates', 'INFO', true, 'Shows your coordinates directly on screen.'),
      mod('FPS Counter', 'INFO', true, 'Shows your frame rate in real time.'),
      mod('Armor HUD', 'INFO', false, 'Displays armor durability as a simple list.'),
      mod('Keystrokes', 'INFO', false, "Shows which keys you're pressing."),
      mod('Clock', 'INFO', false, "Shows play time and the world's current time.")
    ]},
    { name: 'Misc', color: '#a9e8c6', modules: [
      mod('Auto Fish', 'AUTO', false, 'Reels in fish for you when you get a bite.'),
      mod('No Fall', 'SAFETY', true, 'Reduces damage from high falls.'),
      mod('Timer', 'TICK', false, "Adjusts the game's tick rate within safe limits."),
      mod('Auto Respawn', 'AUTO', false, 'Respawns immediately after you die.'),
      mod('Chat Filter', 'CHAT', false, 'Hides unwanted messages from chat.')
    ]}
  ];

  var categoryList = document.getElementById('categoryList');
  var moduleList = document.getElementById('moduleList');
  var currentCategory = document.getElementById('currentCategory');
  var moduleCount = document.getElementById('moduleCount');
  var settingsName = document.getElementById('settingsName');
  var settingsDesc = document.getElementById('settingsDesc');
  var settingsToggle = document.getElementById('settingsToggle');
  var rangeSlider = document.getElementById('rangeSlider');
  var rangeValue = document.getElementById('rangeValue');
  var delaySlider = document.getElementById('delaySlider');
  var delayValue = document.getElementById('delayValue');
  var swatches = Array.prototype.slice.call(document.querySelectorAll('.swatch'));
  var keybind = document.getElementById('keybind');
  var keybindValue = document.getElementById('keybindValue');

  if (categoryList && moduleList && settingsToggle) {
    var activeCategory = 0;
    var activeModule = 0;
    var listeningForKey = false;

    function activeMod() {
      return categories[activeCategory].modules[activeModule];
    }

    function paintSlider(input) {
      if (!input) return;
      var min = Number(input.min) || 0;
      var max = Number(input.max) || 100;
      var percent = ((Number(input.value) - min) / (max - min)) * 100;
      input.style.setProperty('--fill', percent.toFixed(1) + '%');
    }

    function renderCategories() {
      categoryList.innerHTML = categories.map(function (category, index) {
        return '<button class="category-btn' + (index === activeCategory ? ' is-active' : '') +
          '" type="button" aria-pressed="' + (index === activeCategory) +
          '" data-category="' + index + '">' +
          '<i class="dot" style="color:' + category.color + '"></i>' + category.name +
          '<span>' + String(category.modules.length).padStart(2, '0') + '</span></button>';
      }).join('');
    }

    function renderModules() {
      var category = categories[activeCategory];
      var count = category.modules.length;
      currentCategory.textContent = category.name;
      moduleCount.textContent = count + (count === 1 ? ' module' : ' modules');

      moduleList.innerHTML = category.modules.map(function (module, index) {
        return '<div class="module-row' + (index === activeModule ? ' is-selected' : '') +
          (module.on ? ' is-on' : '') + '" data-module="' + index +
          '" role="listitem" style="animation-delay:' + (index * 45) + 'ms" tabindex="0">' +
          '<span class="module-name">' + module.name + '</span>' +
          '<span class="module-tag">' + (module.on ? 'ON' : 'OFF') + '</span>' +
          '<button class="switch" type="button" role="switch" aria-checked="' + module.on +
          '" aria-label="' + (module.on ? 'Disable ' : 'Enable ') + module.name +
          '" data-toggle="' + index + '"><i></i></button></div>';
      }).join('');
    }

    function renderSettings() {
      var module = activeMod();
      settingsName.textContent = module.name;
      settingsDesc.textContent = module.desc;
      settingsToggle.setAttribute('aria-checked', String(module.on));
      settingsToggle.setAttribute('aria-label', (module.on ? 'Disable ' : 'Enable ') + module.name);

      if (rangeSlider) { rangeSlider.value = module.range; paintSlider(rangeSlider); }
      if (rangeValue) rangeValue.textContent = Number(module.range).toFixed(1);
      if (delaySlider) { delaySlider.value = module.delay; paintSlider(delaySlider); }
      if (delayValue) delayValue.textContent = module.delay + ' ms';
      if (keybindValue) keybindValue.textContent = module.keybind;

      swatches.forEach(function (swatch) {
        var selected = swatch.getAttribute('data-color') === module.color;
        swatch.classList.toggle('is-active', selected);
        swatch.setAttribute('aria-pressed', String(selected));
      });
    }

    function selectModule(index) {
      activeModule = index;
      renderModules();
      renderSettings();
    }

    function toggleModule(index) {
      var module = categories[activeCategory].modules[index];
      module.on = !module.on;
      renderModules();
      if (index === activeModule) renderSettings();
    }

    categoryList.addEventListener('click', function (event) {
      var button = event.target.closest('[data-category]');
      if (!button) return;
      activeCategory = Number(button.getAttribute('data-category'));
      activeModule = 0;
      renderCategories();
      renderModules();
      renderSettings();
    });

    moduleList.addEventListener('click', function (event) {
      var toggleButton = event.target.closest('[data-toggle]');
      if (toggleButton) {
        event.stopPropagation();
        toggleModule(Number(toggleButton.getAttribute('data-toggle')));
        return;
      }
      var row = event.target.closest('[data-module]');
      if (row) selectModule(Number(row.getAttribute('data-module')));
    });

    moduleList.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var row = event.target.closest('[data-module]');
      if (!row || event.target.closest('button')) return;
      event.preventDefault();
      selectModule(Number(row.getAttribute('data-module')));
    });

    settingsToggle.addEventListener('click', function () {
      activeMod().on = !activeMod().on;
      renderModules();
      renderSettings();
    });

    if (rangeSlider) {
      rangeSlider.addEventListener('input', function () {
        activeMod().range = Number(rangeSlider.value);
        rangeValue.textContent = Number(rangeSlider.value).toFixed(1);
        paintSlider(rangeSlider);
      });
    }
    if (delaySlider) {
      delaySlider.addEventListener('input', function () {
        activeMod().delay = Number(delaySlider.value);
        delayValue.textContent = delaySlider.value + ' ms';
        paintSlider(delaySlider);
      });
    }

    swatches.forEach(function (swatch) {
      swatch.style.setProperty('--color', swatch.getAttribute('data-color'));
      swatch.addEventListener('click', function () {
        activeMod().color = swatch.getAttribute('data-color');
        renderSettings();
      });
    });

    if (keybind && keybindValue) {
      keybind.addEventListener('click', function () {
        listeningForKey = true;
        keybind.classList.add('is-listening');
        keybindValue.textContent = 'Press a key…';
      });

      document.addEventListener('keydown', function (event) {
        if (!listeningForKey) return;
        event.preventDefault();
        listeningForKey = false;
        keybind.classList.remove('is-listening');

        if (event.key === 'Escape') {
          keybindValue.textContent = activeMod().keybind;
          keybind.focus();
          return;
        }
        var names = {
          ' ': 'SPACE', Control: 'CTRL', Shift: 'SHIFT', Alt: 'ALT',
          Meta: 'WIN', ArrowUp: 'UP', ArrowDown: 'DOWN',
          ArrowLeft: 'LEFT', ArrowRight: 'RIGHT'
        };
        var label = names[event.key] || event.key.toUpperCase();
        activeMod().keybind = label;
        keybindValue.textContent = label;
        keybind.focus();
      });
    }

    renderCategories();
    renderModules();
    renderSettings();
  }
})();
