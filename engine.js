// @ts-nocheck
'use strict';

window.PIP = window.PIP || {};

window.PIP.engine = (function () {
  var audioCtx = null, masterGain = null, compressor = null, analyser = null;
  var activeLayers = {}, activeNodes = {}, bufferCache = {};
  var isPlaying = false, masterVolume = 0.85, listeners = {};

  function on(event, cb) {
    listeners[event] = listeners[event] || [];
    listeners[event].push(cb);
  }

  function emit(event, data) {
    var cbs = listeners[event] || [];
    for (var i = 0; i < cbs.length; i++) {
      try { cbs[i](data); } catch (e) {}
    }
  }

  function unlockAudio() {
    if (!audioCtx) {
      var Cls = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Cls();
      compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(masterVolume * masterVolume, audioCtx.currentTime);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      masterGain.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  // --- LOADS YOUR REAL AUDIO FILE FROM sounds/ ---
  async function loadAudioFile(id) {
    if (bufferCache[id]) return bufferCache[id];

    var soundDef = window.PIP.sounds && window.PIP.sounds.MAP[id];
    var candidates = [];
    if (soundDef && soundDef.file) candidates.push('./sounds/' + soundDef.file);
    if (soundDef && soundDef.alt) candidates.push('./sounds/' + soundDef.alt);
    candidates.push('./sounds/' + id + '.ogg', './sounds/' + id + '.mp3');

    for (var i = 0; i < candidates.length; i++) {
      try {
        var res = await fetch(candidates[i]);
        if (res.ok) {
          var arrayBuf = await res.arrayBuffer();
          var decoded = await audioCtx.decodeAudioData(arrayBuf);
          if (decoded && decoded.duration > 0.5) {
            bufferCache[id] = decoded;
            return decoded;
          }
        }
      } catch (e) {}
    }

    // Safety silence fallback if file is still downloading
    var b = audioCtx.createBuffer(2, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    bufferCache[id] = b;
    return b;
  }

  async function addSound(id, vol) {
    unlockAudio();
    var v = vol !== undefined ? vol : 0.7;
    if (activeNodes[id]) { setVolume(id, v); return; }

    var buf = await loadAudioFile(id);
    var src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    var gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(v * v, audioCtx.currentTime + 0.25);

    src.connect(gain);
    gain.connect(masterGain);
    src.start(0);

    activeNodes[id] = { src: src, gain: gain };
    activeLayers[id] = { volume: v };

    if (!isPlaying) play(); else emit('statechange', getState());
  }

  function removeSound(id) {
    if (!activeNodes[id]) return;
    var n = activeNodes[id];
    try {
      n.gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      setTimeout(function () { try { n.src.stop(); n.src.disconnect(); } catch (e) {} }, 250);
    } catch (e) {}
    delete activeNodes[id];
    delete activeLayers[id];
    if (Object.keys(activeLayers).length === 0) pause(); else emit('statechange', getState());
  }

  function toggleSound(id) {
    if (activeLayers[id]) removeSound(id); else addSound(id, 0.7);
  }

  function setVolume(id, vol) {
    if (!activeLayers[id]) return;
    activeLayers[id].volume = vol;
    if (activeNodes[id] && audioCtx) {
      activeNodes[id].gain.gain.setTargetAtTime(vol * vol, audioCtx.currentTime, 0.05);
    }
    emit('statechange', getState());
  }

  function setMaster(vol) {
    masterVolume = vol;
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(vol * vol, audioCtx.currentTime, 0.05);
    }
    emit('statechange', getState());
  }

  function play() {
    unlockAudio();
    masterGain.gain.linearRampToValueAtTime(masterVolume * masterVolume, audioCtx.currentTime + 0.2);
    isPlaying = true;
    emit('statechange', getState());
  }

  function pause() {
    if (!audioCtx) return;
    masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
    isPlaying = false;
    emit('statechange', getState());
  }

  async function applyMix(layers) {
    unlockAudio();
    var newIds = {};
    for (var i = 0; i < layers.length; i++) newIds[layers[i].id] = layers[i].volume;
    for (var id in activeLayers) { if (!newIds[id]) removeSound(id); }
    for (var nid in newIds) {
      if (activeLayers[nid]) setVolume(nid, newIds[nid]);
      else await addSound(nid, newIds[nid]);
    }
    play();
  }

  function clear() {
    for (var id in activeLayers) removeSound(id);
    pause();
  }

  function getState() {
    return {
      isPlaying: isPlaying,
      masterVolume: masterVolume,
      layers: activeLayers,
      activeCount: Object.keys(activeLayers).length
    };
  }

  return {
    init: unlockAudio,
    play: play,
    pause: pause,
    toggleSound: toggleSound,
    addSound: addSound,
    removeSound: removeSound,
    setVolume: setVolume,
    setMaster: setMaster,
    applyMix: applyMix,
    clear: clear,
    getAnalyser: function () { return analyser; },
    getState: getState,
    on: on
  };
})();