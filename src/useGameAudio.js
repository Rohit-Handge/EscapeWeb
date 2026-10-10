
import { useCallback, useEffect, useRef, useState } from "react";

export function useGameAudio() {
  const audioRef = useRef(null);
  const masterRef = useRef(null);
  const ambientRef = useRef([]);
  const [muted, setMuted] = useState(false);

  function getAudio() {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioRef.current) {
      const ctx = new AudioContextClass();
      const master = ctx.createGain();

      master.gain.value = muted ? 0 : 0.35;
      master.connect(ctx.destination);

      audioRef.current = ctx;
      masterRef.current = master;
    }

    if (audioRef.current.state === "suspended") {
      audioRef.current.resume();
    }

    return audioRef.current;
  }

  const tone = useCallback((frequency, duration, type = "sine", delay = 0) => {
    const ctx = getAudio();
    if (!ctx || !masterRef.current || muted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(masterRef.current);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }, [muted]);

  const play = useCallback((effect) => {
    const sounds = {
      click: [[650, 0.06]],
      pickup: [[440, 0.1], [660, 0.12], [880, 0.18]],
      clue: [[520, 0.12], [780, 0.2]],
      unlock: [[330, 0.13], [440, 0.13], [660, 0.3]],
      wrong: [[220, 0.15], [165, 0.25]],
      win: [[523, 0.15], [659, 0.15], [784, 0.15], [1047, 0.4]],
      door: [[180, 0.25], [130, 0.35]],
      hint: [[600, 0.12], [720, 0.15]]
    };

    (sounds[effect] || sounds.click).forEach(([freq, duration], index) => {
      tone(freq, duration, "sine", index * 0.13);
    });
  }, [tone]);

  const startAmbience = useCallback(() => {
    const ctx = getAudio();
    if (!ctx || !masterRef.current || muted || ambientRef.current.length) return;

    // A quiet, low atmospheric drone.
    [55, 82.4].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.value = 0.035;

      osc.connect(gain);
      gain.connect(masterRef.current);
      osc.start();

      ambientRef.current.push({ osc, gain });
    });
  }, [muted]);

  const stopAmbience = useCallback(() => {
    ambientRef.current.forEach(({ osc }) => {
      try {
        osc.stop();
      } catch {
        // Already stopped.
      }
    });

    ambientRef.current = [];
  }, []);

  function toggleMute() {
    setMuted((current) => {
      const next = !current;

      if (masterRef.current && audioRef.current) {
        masterRef.current.gain.setTargetAtTime(
          next ? 0 : 0.35,
          audioRef.current.currentTime,
          0.04
        );
      }

      return next;
    });
  }

  useEffect(() => {
    return () => {
      ambientRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch {
          // Already stopped.
        }
      });

      if (audioRef.current) {
        audioRef.current.close();
      }
    };
  }, []);

  return { play, startAmbience, stopAmbience, muted, toggleMute };
}