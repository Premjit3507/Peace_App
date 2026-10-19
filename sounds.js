// @ts-nocheck
'use strict';

window.PIP = window.PIP || {};

window.PIP.sounds = (function () {
  var CATEGORIES = [
    { id: 'rain', name: 'Rain & Storm', tint: '#86A9C6' },
    { id: 'water', name: 'Water', tint: '#6FB8B0' },
    { id: 'wind', name: 'Wind', tint: '#A4B4C4' },
    { id: 'fire', name: 'Fire', tint: '#E49A6A' },
    { id: 'nature', name: 'Nature', tint: '#9DB87E' },
    { id: 'places', name: 'Places', tint: '#C9A184' }
  ];

  var CAT_MAP = {};
  for (var i = 0; i < CATEGORIES.length; i++) {
    CAT_MAP[CATEGORIES[i].id] = CATEGORIES[i];
  }

  // Exactly the files in your sounds folder
  var DEFS = [
    // Nature
    { id: 'forest_birds', name: 'Forest Birds', category: 'nature', file: 'forest_birds.ogg' },
    { id: 'birds_frogs_nature', name: 'Birds & Frogs', category: 'nature', file: 'birds_frogs_nature.mp3' },
    { id: 'crickets', name: 'Night Crickets', category: 'nature', file: 'crickets_night.ogg', alt: 'crickets.mp3' },

    // Rain & Storm
    { id: 'thunder', name: 'Rolling Thunder', category: 'rain', file: 'thunder.mp3' },
    { id: 'thunderstorm', name: 'Thunderstorm', category: 'rain', file: 'thunderstorm.ogg' },
    { id: 'rain_gentle', name: 'Gentle Rain', category: 'rain', file: 'rain_gentle.ogg' },
    { id: 'heavy_rain_window', name: 'Rain on Window', category: 'rain', file: 'heavy_rain_window.mp3', alt: 'rain_on_windows.mp3' },
    { id: 'rain_tent', name: 'Rain on Tent', category: 'rain', file: 'rain_tent.ogg' },
    { id: 'rain_in_night', name: 'Night Rain', category: 'rain', file: 'rain_in_night.mp3' },
    { id: 'monsoon', name: 'Monsoon Downpour', category: 'rain', file: 'monsoon.ogg' },
    { id: 'rain_forest_birds', name: 'Rainforest Birds', category: 'rain', file: 'rain_forest_birds.mp3' },

    // Water
    { id: 'stream', name: 'Mountain Stream', category: 'water', file: 'stream.ogg' },
    { id: 'river', name: 'River Rapids', category: 'water', file: 'river.ogg' },

    // Wind
    { id: 'wind_soft', name: 'Soft Wind', category: 'wind', file: 'wind_soft.ogg' },
    { id: 'wind_trees', name: 'Wind in Trees', category: 'wind', file: 'wind_trees.mp3' },
    { id: 'harsh_wind', name: 'Harsh Wind', category: 'wind', file: 'harsh_wind.mp3' },
    { id: 'wind_chimes', name: 'Wind Chimes', category: 'wind', file: 'wind_chimes.ogg' },

    // Fire
    { id: 'campfire', name: 'Campfire', category: 'fire', file: 'campfire.mp3', alt: 'campfire.ogg' },

    // Places
    { id: 'cafe', name: 'Cozy Cafe', category: 'places', file: 'cafe.ogg' },
    { id: 'library', name: 'Quiet Library', category: 'places', file: 'library.ogg' },
    { id: 'train_inside', name: 'Train Interior', category: 'places', file: 'train_inside.mp3' },
    { id: 'train_horn', name: 'Train Horn', category: 'places', file: 'train_horn.mp3' },
    { id: 'clock_ambiance', name: 'Ticking Clock', category: 'places', file: 'clock_ambiance.mp3' },
    { id: 'ceiling_fan', name: 'Ceiling Fan', category: 'places', file: 'ceiling_fan.mp3' },
    { id: 'airplane', name: 'Airplane Cabin', category: 'places', file: 'airplane.ogg' }
  ];

  var MAP = {};
  for (var j = 0; j < DEFS.length; j++) {
    MAP[DEFS[j].id] = DEFS[j];
  }

  return {
    CATEGORIES: CATEGORIES,
    CAT_MAP: CAT_MAP,
    DEFS: DEFS,
    MAP: MAP
  };
})();