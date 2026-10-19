// @ts-nocheck
'use strict';

window.PIP = window.PIP || {};

window.PIP.icons = (function () {
  var SPRITES = {
    'worlds': '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z"/>',
    'sounds': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    'mixer': '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    'play': '<polygon points="7 4 19 12 7 20 7 4" fill="currentColor" stroke="none"/>',
    'pause': '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
    'plus': '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    'close': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'search': '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
    'nature': '<path d="M12 2L6 12h12L12 2z"/><line x1="12" y1="12" x2="12" y2="22"/>',
    'rain': '<path d="M16 13v6M8 13v6M12 15v6M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>',
    'water': '<path d="M2 12c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3"/>',
    'wind': '<path d="M3 8h12a3 3 0 1 0-3-3M2 12h16a3 3 0 1 1-3 3"/>',
    'fire': '<path d="M8.5 14.5A4.5 4.5 0 0 0 12 19a4.5 4.5 0 0 0 3.5-4.5C15.5 10 12 7 12 3c0 4-3.5 7-3.5 11.5z"/>',
    'places': '<rect x="4" y="3" width="16" height="15" rx="3"/><circle cx="8" cy="15" r="1.5"/><circle cx="16" cy="15" r="1.5"/>'
  };

  function get(id, className, ariaHidden) {
    var cls = className || 'pip-icon';
    var body = SPRITES[id] || SPRITES['sounds'];
    var aria = (ariaHidden !== false) ? ' aria-hidden="true"' : '';
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' + aria + '>' + body + '</svg>';
  }

  return { get: get, SPRITES: SPRITES };
})();