// @ts-nocheck
'use strict';

window.PIP = window.PIP || {};

window.PIP.app = (function () {
  var currentTab = 'worlds';
  var activeMood = 'all';
  var activeCat = 'all';
  var searchQuery = '';
  var activeWorldName = 'Your Mix';

  function safeIcon(id) {
    if (window.PIP && window.PIP.icons && window.PIP.icons.get) {
      return window.PIP.icons.get(id);
    }
    return '';
  }

  function initApp() {
    initIcons();
    initRouting();
    initAudioEvents();
    renderWorldsView();
    renderSoundsView();
    initMixerView();
    initSettingsView();
    initMiniPlayer();
    initModalSheet();
    startOrbCanvas();
  }

  function initIcons() {
    var ids = ['worlds', 'sounds', 'mixer', 'settings'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById('tab-icon-' + ids[i]);
      if (el) el.innerHTML = safeIcon(ids[i]);
    }
    var mIcon = document.getElementById('master-btn-icon');
    if (mIcon) mIcon.innerHTML = safeIcon('play');
    var miniIcon = document.getElementById('mini-btn-icon');
    if (miniIcon) miniIcon.innerHTML = safeIcon('play');
  }

  function initRouting() {
    window.addEventListener('hashchange', function () {
      var r = window.location.hash.replace('#/', '');
      switchTab(r || 'worlds');
    });

    document.querySelectorAll('.nav-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        window.location.hash = '#/' + tab.dataset.tab;
      });
    });

    switchTab(window.location.hash.replace('#/', '') || 'worlds');
  }

  function switchTab(tabId) {
    var valid = ['worlds', 'sounds', 'mixer', 'settings'];
    var target = valid.indexOf(tabId) >= 0 ? tabId : 'worlds';

    document.querySelectorAll('.app-view').forEach(function (v) { v.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.tab === target);
    });

    var view = document.getElementById('view-' + target);
    if (view) view.classList.add('active');

    currentTab = target;
    var heading = document.getElementById('screen-heading');
    if (heading) heading.textContent = target.charAt(0).toUpperCase() + target.slice(1);
  }

  function initAudioEvents() {
    if (!window.PIP.engine) return;
    window.PIP.engine.on('statechange', function (st) {
      var iconName = st.isPlaying ? 'pause' : 'play';
      document.getElementById('master-btn-icon').innerHTML = safeIcon(iconName);
      document.getElementById('mini-btn-icon').innerHTML = safeIcon(iconName);

      var badge = document.getElementById('tab-mixer-badge');
      var mini = document.getElementById('mini-player');
      if (st.activeCount > 0) {
        badge.classList.remove('hidden'); badge.textContent = st.activeCount;
        mini.classList.remove('hidden');
        document.getElementById('mini-subtitle').textContent = st.activeCount + ' sounds playing';
        document.getElementById('mixer-active-count').textContent = st.activeCount + ' sounds playing';
      } else {
        badge.classList.add('hidden');
        mini.classList.add('hidden');
        document.getElementById('mixer-active-count').textContent = '0 sounds playing';
      }

      document.querySelectorAll('.sound-tile').forEach(function (tile) {
        var on = !!st.layers[tile.dataset.soundId];
        tile.classList.toggle('active', on);
        var slider = tile.querySelector('.tile-vol-slider');
        if (slider && on) slider.value = Math.round(st.layers[tile.dataset.soundId].volume * 100);
      });

      renderMixerLayers(st);
    });
  }

  function renderWorldsView() {
    var list = (window.PIP.worlds && window.PIP.worlds.BUILT_IN) ? window.PIP.worlds.BUILT_IN : [];
    if (!list.length) return;

    var hero = list[0];
    document.getElementById('featured-hero-container').innerHTML = '<div class="featured-hero-card" data-world-id="' + hero.id + '">' +
      '<img class="featured-hero-art" src="' + hero.cover + '">' +
      '<div class="featured-hero-scrim">' +
        '<span class="hero-tag">Featured Sanctuary</span>' +
        '<h2 class="hero-title">' + hero.name + '</h2>' +
        '<span class="hero-subtitle">' + hero.layers.length + ' sounds &bull; ' + hero.mood + '</span>' +
      '</div>' +
    '</div>';

    var grid = document.getElementById('worlds-grid');
    var filtered = list.filter(function (w) { return activeMood === 'all' || w.mood === activeMood; });
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var w = filtered[i];
      html += '<div class="world-card" data-world-id="' + w.id + '">' +
        '<img class="world-card-art" src="' + w.cover + '">' +
        '<div class="world-card-scrim">' +
          '<span class="world-card-mood">' + w.mood + '</span>' +
          '<h3 class="world-card-title">' + w.name + '</h3>' +
          '<span class="world-card-count">' + w.layers.length + ' sounds</span>' +
        '</div>' +
      '</div>';
    }
    grid.innerHTML = html;

    // Filter Chips
    document.querySelectorAll('.chip-filter').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.chip-filter').forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        activeMood = c.dataset.mood;
        renderWorldsView();
      });
    });

    // Play Card Click
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.world-card') || e.target.closest('.featured-hero-card');
      if (card && card.dataset.worldId && window.PIP.worlds && window.PIP.engine) {
        var w = window.PIP.worlds.getWorldById(card.dataset.worldId);
        if (w) {
          document.querySelectorAll('.world-card').forEach(function(x){ x.classList.remove('playing'); });
          if (card.classList.contains('world-card')) card.classList.add('playing');
          activeWorldName = w.name;
          window.PIP.engine.applyMix(w.layers);
          document.getElementById('mini-title').textContent = w.name;
          showToast('Playing ' + w.name);
        }
      }
    });

    renderUserWorldsCarousel();
  }

  function renderUserWorldsCarousel() {
    var carousel = document.getElementById('my-worlds-carousel');
    if (!carousel || !window.PIP.worlds) return;
    var list = window.PIP.worlds.getUserWorlds();

    var html = '<div class="create-world-card" id="btn-create-placeholder">' +
      safeIcon('plus') + '<span>Create world</span>' +
    '</div>';

    for (var i = 0; i < list.length; i++) {
      var w = list[i];
      html += '<div class="world-card" data-world-id="' + w.id + '">' +
        '<img class="world-card-art" src="' + w.cover + '">' +
        '<div class="world-card-scrim">' +
          '<span class="world-card-mood">' + w.mood + '</span>' +
          '<h3 class="world-card-title">' + w.name + '</h3>' +
          '<span class="world-card-count">' + w.layers.length + ' sounds</span>' +
        '</div>' +
      '</div>';
    }
    carousel.innerHTML = html;

    var ph = document.getElementById('btn-create-placeholder');
    if (ph) ph.addEventListener('click', openCreateSheet);
  }

  function renderSoundsView() {
    var grid = document.getElementById('sounds-grid');
    if (!grid || !window.PIP.sounds) return;

    var filtered = window.PIP.sounds.DEFS.filter(function (s) {
      var mCat = (activeCat === 'all') || s.category === activeCat;
      var mQ = (!searchQuery) || s.name.toLowerCase().indexOf(searchQuery) >= 0;
      return mCat && mQ;
    });

    var st = window.PIP.engine ? window.PIP.engine.getState() : { layers: {} };
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var s = filtered[i];
      var on = !!st.layers[s.id];
      var vol = on ? Math.round(st.layers[s.id].volume * 100) : 70;
      var cat = window.PIP.sounds.CAT_MAP[s.category] || { tint: '#D9B27C', name: s.category };

      html += '<div class="sound-tile ' + (on ? 'active' : '') + '" data-sound-id="' + s.id + '" style="--cat-tint:' + cat.tint + '">' +
        '<div class="sound-tile-top">' +
          '<div class="sound-icon-box">' + safeIcon(s.category) + '</div>' +
          '<div class="breathing-dot"></div>' +
        '</div>' +
        '<div class="sound-tile-middle">' +
          '<div class="sound-name">' + s.name + '</div>' +
          '<div class="sound-cat-label">' + cat.name + '</div>' +
        '</div>' +
        '<div class="sound-tile-bottom">' +
          '<div class="tile-slider-wrap">' +
            '<input type="range" class="pip-slider tile-vol-slider" min="0" max="100" value="' + vol + '" data-sound-id="' + s.id + '">' +
          '</div>' +
        '</div>' +
      '</div>';
    }
    grid.innerHTML = html;

    if (!grid.dataset.bound) {
      grid.dataset.bound = 'true';
      document.querySelectorAll('.category-chip').forEach(function (c) {
        c.addEventListener('click', function () {
          document.querySelectorAll('.category-chip').forEach(function (x) { x.classList.remove('active'); });
          c.classList.add('active');
          activeCat = c.dataset.cat;
          renderSoundsView();
        });
      });

      document.getElementById('sound-search-input').addEventListener('input', function (e) {
        searchQuery = e.target.value.trim().toLowerCase();
        renderSoundsView();
      });

      grid.addEventListener('click', function (e) {
        if (e.target.closest('.tile-slider-wrap') || e.target.classList.contains('pip-slider')) return;
        var tile = e.target.closest('.sound-tile');
        if (!tile || !window.PIP.engine) return;
        activeWorldName = 'Custom Mix';
        window.PIP.engine.toggleSound(tile.dataset.soundId);
      });

      grid.addEventListener('input', function (e) {
        if (e.target.classList.contains('tile-vol-slider') && window.PIP.engine) {
          window.PIP.engine.setVolume(e.target.dataset.soundId, parseFloat(e.target.value) / 100);
        }
      });
    }
  }

  function renderMixerLayers(st) {
    var list = document.getElementById('mixer-layers-list');
    var keys = Object.keys(st.layers);
    if (!keys.length) {
      list.innerHTML = '<div class="empty-state">Your mix is quiet.<br>Select soundscapes to create your sanctuary.</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var s = (window.PIP.sounds && window.PIP.sounds.MAP[id]) || { name: id };
      var vol = Math.round(st.layers[id].volume * 100);

      html += '<div class="mixer-layer-row" data-sound-id="' + id + '">' +
        '<div class="layer-slider-col">' +
          '<div class="layer-header-row"><span class="layer-name">' + s.name + '</span><span class="layer-vol-readout">' + vol + '%</span></div>' +
          '<input type="range" class="pip-slider layer-slider" min="0" max="100" value="' + vol + '" data-sound-id="' + id + '">' +
        '</div>' +
        '<button class="btn-remove-layer" data-sound-id="' + id + '">' + safeIcon('close') + '</button>' +
      '</div>';
    }
    list.innerHTML = html;
  }

  function initMixerView() {
    var toggle = function () {
      if (!window.PIP.engine) return;
      var st = window.PIP.engine.getState();
      if (st.isPlaying) window.PIP.engine.pause(); else window.PIP.engine.play();
    };

    document.getElementById('master-toggle-btn').addEventListener('click', toggle);
    document.getElementById('mini-play-toggle').addEventListener('click', function (e) {
      e.stopPropagation(); toggle();
    });

    document.getElementById('master-volume-slider').addEventListener('input', function (e) {
      var v = parseFloat(e.target.value) / 100;
      if (window.PIP.engine) window.PIP.engine.setMaster(v);
      document.getElementById('master-vol-num').textContent = Math.round(v * 100) + '%';
    });

    document.getElementById('mixer-clear-all').addEventListener('click', function () {
      if (window.PIP.engine) window.PIP.engine.clear();
      showToast('Mix cleared');
    });

    var list = document.getElementById('mixer-layers-list');
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-remove-layer');
      if (btn && window.PIP.engine) window.PIP.engine.removeSound(btn.dataset.soundId);
    });

    list.addEventListener('input', function (e) {
      if (e.target.classList.contains('layer-slider') && window.PIP.engine) {
        window.PIP.engine.setVolume(e.target.dataset.soundId, parseFloat(e.target.value) / 100);
      }
    });
  }

  function initMiniPlayer() {
    document.getElementById('mini-player-open').addEventListener('click', function () {
      window.location.hash = '#/mixer';
    });
  }

  function initSettingsView() {
    document.querySelectorAll('.seg-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.seg-btn').forEach(function (x) { x.classList.remove('active'); });
        btn.classList.add('active');
        var val = btn.dataset.themeVal;
        document.documentElement.setAttribute('data-theme', val);
      });
    });

    document.getElementById('btn-erase-data').addEventListener('click', function () {
      localStorage.clear();
      window.location.reload();
    });
  }

  function initModalSheet() {
    var btn = document.getElementById('btn-create-world-shortcut');
    if (btn) btn.addEventListener('click', openCreateSheet);
    document.getElementById('sheet-close-btn').addEventListener('click', closeSheet);
    document.getElementById('sheet-backdrop').addEventListener('click', function (e) {
      if (e.target === this) closeSheet();
    });
  }

  function openCreateSheet() {
    var st = window.PIP.engine ? window.PIP.engine.getState() : { layers: {} };
    var activeIds = Object.keys(st.layers);
    if (!activeIds.length) {
      showToast('Add at least one sound first');
      return;
    }

    var html = '<form id="form-cw" class="dialog-form" onsubmit="return false;">' +
      '<div class="form-group"><label class="form-label">World Name</label><input type="text" id="cw-name" class="form-input" placeholder="e.g. Rainy Twilight" required></div>' +
      '<div class="dialog-btn-row"><button type="button" id="cw-cancel" class="btn-secondary">Cancel</button><button type="submit" class="btn-primary">Create</button></div>' +
    '</form>';

    document.getElementById('sheet-body').innerHTML = html;
    document.getElementById('sheet-backdrop').classList.remove('hidden');

    document.getElementById('cw-cancel').addEventListener('click', closeSheet);
    document.getElementById('form-cw').addEventListener('submit', function () {
      var name = document.getElementById('cw-name').value.trim();
      if (!name) return;
      var newWorld = {
        id: 'w-user-' + Date.now(),
        name: name,
        mood: 'Relax',
        cover: window.PIP.worlds.generateSvgCover(),
        layers: activeIds.map(function (id) { return { id: id, volume: st.layers[id].volume }; })
      };
      window.PIP.worlds.saveUserWorld(newWorld);
      closeSheet();
      renderUserWorldsCarousel();
      showToast('Created ' + name);
    });
  }

  function closeSheet() {
    document.getElementById('sheet-backdrop').classList.add('hidden');
  }

  function startOrbCanvas() {
    var cvs = document.getElementById('orb-canvas');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var d = new Uint8Array(8);

    function frame() {
      requestAnimationFrame(frame);
      if (currentTab !== 'mixer') return;
      ctx.clearRect(0, 0, 220, 220);

      var energy = 0;
      if (window.PIP.engine) {
        var a = window.PIP.engine.getAnalyser();
        var st = window.PIP.engine.getState();
        if (a && st.isPlaying) {
          a.getByteFrequencyData(d);
          var sum = 0; for (var i = 0; i < 8; i++) sum += d[i];
          energy = (sum / 8) / 255;
        }
      }

      var r = 62 + energy * 36;
      var g = ctx.createRadialGradient(110, 110, r * 0.2, 110, 110, r * 1.3);
      g.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
      g.addColorStop(0.7, 'rgba(245, 158, 11, 0.1)');
      g.addColorStop(1, 'transparent');

      ctx.beginPath(); ctx.arc(110, 110, r * 1.3, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(110, 110, r * 0.75, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'; ctx.stroke();
    }
    frame();
  }

  function showToast(msg) {
    var host = document.getElementById('toast-host');
    if (!host) return;
    var t = document.createElement('div');
    t.className = 'pip-toast';
    t.textContent = msg;
    host.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  return { showToast: showToast };
})();