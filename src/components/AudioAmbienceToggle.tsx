import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';

export const AudioAmbienceToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  const startCosmicAmbience = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 3); // Soft ambient volume
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Low frequency cosmic drone (55Hz root note A1)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      // Harmonics & beat frequency (55.4Hz creates gentle meditative pulsing)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.4, ctx.currentTime);

      // Low pass filter for warm deep space tone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;

      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio ambience could not start:', e);
    }
  };

  const stopCosmicAmbience = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.2);
      setTimeout(() => {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 1200);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopCosmicAmbience();
    } else {
      startCosmicAmbience();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      id="btn-toggle-cosmic-ambience"
      onClick={toggleSound}
      title={isPlaying ? "Mute Cosmic Ambience" : "Enable Deep Space Sound"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md border transition shadow-md ${
        isPlaying
          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-500/20'
          : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border-slate-700/80 hover:border-slate-600'
      }`}
    >
      {isPlaying ? (
        <>
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Cosmic Drone</span>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Space Audio</span>
        </>
      )}
    </button>
  );
};
