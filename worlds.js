// @ts-nocheck
'use strict';

window.PIP = window.PIP || {};

window.PIP.worlds = (function () {
  function makeCover(bg, orb) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 133" width="100%" height="100%">' +
        '<rect width="100" height="133" fill="' + bg + '"/>' +
        '<circle cx="50" cy="40" r="18" fill="' + orb + '" opacity="0.6"/>' +
        '<path d="M-10 133 L-10 82 Q 30 62, 60 86 T 110 76 L 110 133 Z" fill="#121C18"/>' +
        '<path d="M-10 133 L-10 96 Q 40 84, 75 98 T 110 92 L 110 133 Z" fill="#0B120F"/>' +
      '</svg>'
    );
  }

  var BUILT_IN = [
    { id: 'w1', name: 'Forest Rain', mood: 'Relax', cover: makeCover('#1B2421', '#9DB87E'), layers: [{ id: 'rain_forest_birds', volume: 0.7 }, { id: 'wind_trees', volume: 0.35 }, { id: 'stream', volume: 0.25 }] },
    { id: 'w2', name: 'Cabin Night', mood: 'Sleep', cover: makeCover('#0B131E', '#E49A6A'), layers: [{ id: 'campfire', volume: 0.6 }, { id: 'rain_tent', volume: 0.45 }, { id: 'wind_soft', volume: 0.3 }, { id: 'thunder', volume: 0.35 }] },
    { id: 'w3', name: 'Thunderstorm', mood: 'Relax', cover: makeCover('#101518', '#86A9C6'), layers: [{ id: 'monsoon', volume: 0.75 }, { id: 'thunder', volume: 0.70 }, { id: 'harsh_wind', volume: 0.4 }] },
    { id: 'w4', name: 'Midnight Camp', mood: 'Sleep', cover: makeCover('#0B131E', '#E49A6A'), layers: [{ id: 'campfire', volume: 0.6 }, { id: 'crickets', volume: 0.45 }, { id: 'wind_trees', volume: 0.3 }] },
    { id: 'w5', name: 'Rainy Cafe', mood: 'Focus', cover: makeCover('#1A1829', '#C9A184'), layers: [{ id: 'cafe', volume: 0.65 }, { id: 'heavy_rain_window', volume: 0.5 }] },
    { id: 'w6', name: 'Sleeper Train', mood: 'Sleep', cover: makeCover('#121820', '#A4B4C4'), layers: [{ id: 'train_inside', volume: 0.7 }, { id: 'rain_in_night', volume: 0.4 }, { id: 'train_horn', volume: 0.25 }] },
    { id: 'w7', name: 'Quiet Study', mood: 'Focus', cover: makeCover('#1A1829', '#D9B27C'), layers: [{ id: 'library', volume: 0.55 }, { id: 'clock_ambiance', volume: 0.35 }, { id: 'rain_gentle', volume: 0.3 }] },
    { id: 'w8', name: 'Mountain Morning', mood: 'Relax', cover: makeCover('#1B2421', '#6FB8B0'), layers: [{ id: 'forest_birds', volume: 0.55 }, { id: 'stream', volume: 0.5 }, { id: 'wind_soft', volume: 0.3 }] },
    { id: 'w9', name: 'Summer Night', mood: 'Sleep', cover: makeCover('#0B131E', '#9DB87E'), layers: [{ id: 'birds_frogs_nature', volume: 0.6 }, { id: 'crickets', volume: 0.45 }, { id: 'wind_soft', volume: 0.25 }] },
    { id: 'w10', name: 'Wind & Chimes', mood: 'Meditate', cover: makeCover('#241D17', '#D9B27C'), layers: [{ id: 'wind_chimes', volume: 0.65 }, { id: 'wind_trees', volume: 0.35 }, { id: 'stream', volume: 0.25 }] },
    { id: 'w11', name: 'Deep Sleep Fan', mood: 'Sleep', cover: makeCover('#1A1829', '#B4A8D4'), layers: [{ id: 'ceiling_fan', volume: 0.6 }, { id: 'rain_in_night', volume: 0.4 }, { id: 'wind_soft', volume: 0.25 }] },
    { id: 'w12', name: 'Airplane Journey', mood: 'Focus', cover: makeCover('#121820', '#A4B4C4'), layers: [{ id: 'airplane', volume: 0.65 }, { id: 'rain_gentle', volume: 0.35 }] }
  ];

  function getUserWorlds() {
    try {
      var r = localStorage.getItem('pip_user_worlds_v1');
      return r ? JSON.parse(r) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUserWorld(w) {
    var l = getUserWorlds();
    l.unshift(w);
    try { localStorage.setItem('pip_user_worlds_v1', JSON.stringify(l)); } catch (e) {}
  }

  function getWorldById(id) {
    var all = BUILT_IN.concat(getUserWorlds());
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  return {
    BUILT_IN: BUILT_IN,
    getUserWorlds: getUserWorlds,
    saveUserWorld: saveUserWorld,
    getWorldById: getWorldById,
    generateSvgCover: function () { return makeCover('#1B2421', '#D9B27C'); }
  };
})();