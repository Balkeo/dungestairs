// Tiny Web Audio SFX synthesiser - no asset files. Each sound is a short
// oscillator envelope. The AudioContext is created lazily on first use (which
// happens inside a user click, satisfying autoplay policies) and all calls are
// wrapped so a missing/blocked AudioContext never breaks the game.

let ctx = null
let muted = false

const context = () => {
  if (ctx) {
    return ctx
  }
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) {
      return null
    }
    ctx = new AudioCtx()
  } catch (err) {
    ctx = null
  }
  return ctx
}

export const setMuted = (value) => {
  muted = value
}

export const isMuted = () => muted

const tone = ({ freq = 440, type = 'square', duration = 0.12, gain = 0.05, slideTo = null, delay = 0 }) => {
  const audio = context()
  if (!audio || muted) {
    return
  }
  try {
    const start = audio.currentTime + delay
    const osc = audio.createOscillator()
    const amp = audio.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration)
    }
    amp.gain.setValueAtTime(gain, start)
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(amp).connect(audio.destination)
    osc.start(start)
    osc.stop(start + duration + 0.02)
  } catch (err) {
    /* ignore audio failures */
  }
}

export const sfx = {
  hit: () => tone({ freq: 180, type: 'square', duration: 0.09, gain: 0.05, slideTo: 90 }),
  crit: () => { tone({ freq: 300, type: 'sawtooth', duration: 0.12, gain: 0.06, slideTo: 120 }); tone({ freq: 460, type: 'square', duration: 0.1, gain: 0.04, delay: 0.04 }) },
  ko: () => { tone({ freq: 160, type: 'sawtooth', duration: 0.22, gain: 0.06, slideTo: 60 }) },
  coin: () => { tone({ freq: 880, type: 'square', duration: 0.07, gain: 0.05 }); tone({ freq: 1320, type: 'square', duration: 0.09, gain: 0.05, delay: 0.06 }) },
  loot: () => { tone({ freq: 660, type: 'triangle', duration: 0.1, gain: 0.06 }); tone({ freq: 990, type: 'triangle', duration: 0.12, gain: 0.05, delay: 0.08 }) },
  heal: () => { tone({ freq: 520, type: 'sine', duration: 0.16, gain: 0.06, slideTo: 780 }) },
  trap: () => { tone({ freq: 220, type: 'sawtooth', duration: 0.18, gain: 0.06, slideTo: 70 }) },
  key: () => { tone({ freq: 700, type: 'triangle', duration: 0.12, gain: 0.06 }); tone({ freq: 1050, type: 'triangle', duration: 0.14, gain: 0.05, delay: 0.1 }); tone({ freq: 1400, type: 'sine', duration: 0.18, gain: 0.05, delay: 0.22 }) },
  death: () => { tone({ freq: 300, type: 'sawtooth', duration: 0.5, gain: 0.07, slideTo: 50 }) }
}
