import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  BookOpen,
  Music,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Radio,
  Sliders
} from 'lucide-react';

export type PianoInstrument = 'grand' | 'upright' | 'rhodes' | 'celestial';

interface KeyConfig {
  note: string;
  isBlack: boolean;
  octave: number;
  label: string;
  keyboardShortcut?: string;
  freq: number;
}

// 3 Full Octaves: C3 to C6
const GENERATED_KEYS: KeyConfig[] = [
  // Octave 3
  { note: 'C3', isBlack: false, octave: 3, label: 'C3', keyboardShortcut: 'Z', freq: 130.81 },
  { note: 'Db3', isBlack: true, octave: 3, label: 'C#3', keyboardShortcut: 'S', freq: 138.59 },
  { note: 'D3', isBlack: false, octave: 3, label: 'D3', keyboardShortcut: 'X', freq: 146.83 },
  { note: 'Eb3', isBlack: true, octave: 3, label: 'D#3', keyboardShortcut: 'D', freq: 155.56 },
  { note: 'E3', isBlack: false, octave: 3, label: 'E3', keyboardShortcut: 'C', freq: 164.81 },
  { note: 'F3', isBlack: false, octave: 3, label: 'F3', keyboardShortcut: 'V', freq: 174.61 },
  { note: 'F#3', isBlack: true, octave: 3, label: 'F#3', keyboardShortcut: 'G', freq: 185.00 },
  { note: 'G3', isBlack: false, octave: 3, label: 'G3', keyboardShortcut: 'B', freq: 196.00 },
  { note: 'Ab3', isBlack: true, octave: 3, label: 'G#3', keyboardShortcut: 'H', freq: 207.65 },
  { note: 'A3', isBlack: false, octave: 3, label: 'A3', keyboardShortcut: 'N', freq: 220.00 },
  { note: 'Bb3', isBlack: true, octave: 3, label: 'A#3', keyboardShortcut: 'J', freq: 233.08 },
  { note: 'B3', isBlack: false, octave: 3, label: 'B3', keyboardShortcut: 'M', freq: 246.94 },

  // Octave 4 (Home Row)
  { note: 'C4', isBlack: false, octave: 4, label: 'C4', keyboardShortcut: 'Q', freq: 261.63 },
  { note: 'Db4', isBlack: true, octave: 4, label: 'C#4', keyboardShortcut: '2', freq: 277.18 },
  { note: 'D4', isBlack: false, octave: 4, label: 'D4', keyboardShortcut: 'W', freq: 293.66 },
  { note: 'Eb4', isBlack: true, octave: 4, label: 'D#4', keyboardShortcut: '3', freq: 311.13 },
  { note: 'E4', isBlack: false, octave: 4, label: 'E4', keyboardShortcut: 'E', freq: 329.63 },
  { note: 'F4', isBlack: false, octave: 4, label: 'F4', keyboardShortcut: 'R', freq: 349.23 },
  { note: 'F#4', isBlack: true, octave: 4, label: 'F#4', keyboardShortcut: '5', freq: 369.99 },
  { note: 'G4', isBlack: false, octave: 4, label: 'G4', keyboardShortcut: 'T', freq: 392.00 },
  { note: 'Ab4', isBlack: true, octave: 4, label: 'G#4', keyboardShortcut: '6', freq: 415.30 },
  { note: 'A4', isBlack: false, octave: 4, label: 'A4', keyboardShortcut: 'Y', freq: 440.00 },
  { note: 'Bb4', isBlack: true, octave: 4, label: 'A#4', keyboardShortcut: '7', freq: 466.16 },
  { note: 'B4', isBlack: false, octave: 4, label: 'B4', keyboardShortcut: 'U', freq: 493.88 },

  // Octave 5
  { note: 'C5', isBlack: false, octave: 5, label: 'C5', keyboardShortcut: 'I', freq: 523.25 },
  { note: 'Db5', isBlack: true, octave: 5, label: 'C#5', keyboardShortcut: '9', freq: 554.37 },
  { note: 'D5', isBlack: false, octave: 5, label: 'D5', keyboardShortcut: 'O', freq: 587.33 },
  { note: 'Eb5', isBlack: true, octave: 5, label: 'D#5', keyboardShortcut: '0', freq: 622.25 },
  { note: 'E5', isBlack: false, octave: 5, label: 'E5', keyboardShortcut: 'P', freq: 659.25 },
  { note: 'F5', isBlack: false, octave: 5, label: 'F5', keyboardShortcut: '[', freq: 698.46 },
  { note: 'F#5', isBlack: true, octave: 5, label: 'F#5', keyboardShortcut: '=', freq: 739.99 },
  { note: 'G5', isBlack: false, octave: 5, label: 'G5', keyboardShortcut: ']', freq: 783.99 },
  { note: 'Ab5', isBlack: true, octave: 5, label: 'G#5', keyboardShortcut: undefined, freq: 830.61 },
  { note: 'A5', isBlack: false, octave: 5, label: 'A5', keyboardShortcut: undefined, freq: 880.00 },
  { note: 'Bb5', isBlack: true, octave: 5, label: 'A#5', keyboardShortcut: undefined, freq: 932.33 },
  { note: 'B5', isBlack: false, octave: 5, label: 'B5', keyboardShortcut: undefined, freq: 987.77 },

  // Final Top C
  { note: 'C6', isBlack: false, octave: 6, label: 'C6', keyboardShortcut: undefined, freq: 1046.50 }
];

// Song Tutorials (Guided Play-Along)
interface SongTutorial {
  id: string;
  title: string;
  artist: string;
  difficulty: string;
  steps: { note: string; label: string; tip?: string }[];
}

const TUTORIALS: SongTutorial[] = [
  {
    id: 'idea10',
    title: 'Idea 10 (Gibran Alcocer Original)',
    artist: 'Gibran Alcocer',
    difficulty: 'Intermediate',
    steps: [
      { note: 'C5', label: 'C5', tip: 'Cm Arpeggio' },
      { note: 'G4', label: 'G4' },
      { note: 'Eb4', label: 'Eb4' },
      { note: 'C5', label: 'C5' },
      { note: 'G4', label: 'G4' },
      { note: 'Eb4', label: 'Eb4' },
      { note: 'Bb4', label: 'Bb4', tip: 'Gm Arpeggio' },
      { note: 'G4', label: 'G4' },
      { note: 'D4', label: 'D4' },
      { note: 'Bb4', label: 'Bb4' },
      { note: 'G4', label: 'G4' },
      { note: 'D4', label: 'D4' },
      { note: 'A4', label: 'A4', tip: 'Dm/F Arpeggio' },
      { note: 'F4', label: 'F4' },
      { note: 'D4', label: 'D4' },
      { note: 'A4', label: 'A4' },
      { note: 'F4', label: 'F4' },
      { note: 'D4', label: 'D4' },
      { note: 'Bb4', label: 'Bb4', tip: 'Eb Major' },
      { note: 'G4', label: 'G4' },
      { note: 'Eb4', label: 'Eb4' },
      { note: 'D5', label: 'D5', tip: 'Resolution' },
      { note: 'Eb5', label: 'Eb5', tip: 'Singing Theme (Chorus)' },
      { note: 'D5', label: 'D5' },
      { note: 'C5', label: 'C5' },
      { note: 'D5', label: 'D5' },
      { note: 'C5', label: 'C5' },
      { note: 'Bb4', label: 'Bb4' },
      { note: 'C5', label: 'C5' },
      { note: 'Bb4', label: 'Bb4' },
      { note: 'A4', label: 'A4' },
      { note: 'Bb4', label: 'Bb4' }
    ]
  },
  {
    id: 'minecraft_sweden',
    title: 'Sweden (Minecraft Theme)',
    artist: 'C418',
    difficulty: 'Easy',
    steps: [
      { note: 'D4', label: 'D4' },
      { note: 'F#4', label: 'F#4' },
      { note: 'A4', label: 'A4' },
      { note: 'C#5', label: 'C#5' },
      { note: 'F#5', label: 'F#5' },
      { note: 'E5', label: 'E5' },
      { note: 'D5', label: 'D5' },
      { note: 'B4', label: 'B4' },
      { note: 'D5', label: 'D5' }
    ]
  },
  {
    id: 'minecraft_wethands',
    title: 'Wet Hands (Minecraft)',
    artist: 'C418',
    difficulty: 'Easy',
    steps: [
      { note: 'C#5', label: 'C#5' },
      { note: 'E5', label: 'E5' },
      { note: 'F#5', label: 'F#5' },
      { note: 'E5', label: 'E5' },
      { note: 'C#5', label: 'C#5' },
      { note: 'B4', label: 'B4' },
      { note: 'A4', label: 'A4' },
      { note: 'F#4', label: 'F#4' },
      { note: 'A4', label: 'A4' },
      { note: 'D5', label: 'D5' }
    ]
  }
];

export const VirtualPianoWindow: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [instrument, setInstrument] = useState<PianoInstrument>('grand');
  const [sustain, setSustain] = useState(true);
  const [showKeyLabels, setShowKeyLabels] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // Tutorial / Guided Mode
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isMouseDownRef = useRef(false);

  // Initialize Web Audio API
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, [isMuted, volume]);

  // Update volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  // Synthesize realistic acoustic or synth piano note
  const triggerNote = useCallback((noteKey: KeyConfig) => {
    try {
      const ctx = getAudioContext();
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain) return;

      const now = ctx.currentTime;
      const decayTime = sustain ? 3.5 : 1.2;

      // Note Gain Envelope
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.45, now + 0.012); // Fast wooden hammer attack
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      // Lowpass Acoustic Wooden Filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';

      if (instrument === 'grand') {
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.exponentialRampToValueAtTime(320, now + decayTime);

        // Grand Piano Harmonics (Sine fundamental + triangle 2nd + sine 3rd & 4th)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(noteKey.freq, now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(noteKey.freq * 2, now);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.28, now);
        osc2.connect(g2);
        g2.connect(noteGain);

        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(noteKey.freq * 3, now);
        const g3 = ctx.createGain();
        g3.gain.setValueAtTime(0.12, now);
        osc3.connect(g3);
        g3.connect(noteGain);

        osc1.connect(noteGain);
        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + decayTime);
        osc2.stop(now + decayTime);
        osc3.stop(now + decayTime);
      } else if (instrument === 'upright') {
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(280, now + decayTime);

        // Felt-damped mellow tone
        const osc1 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(noteKey.freq, now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(noteKey.freq, now);

        osc1.connect(noteGain);
        osc2.connect(noteGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + decayTime);
        osc2.stop(now + decayTime);
      } else if (instrument === 'rhodes') {
        filter.frequency.setValueAtTime(1800, now);

        // Electric bell chime
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(noteKey.freq, now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(noteKey.freq * 4.02, now);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.18, now);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc2.connect(g2);
        g2.connect(noteGain);

        osc1.connect(noteGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + decayTime);
        osc2.stop(now + decayTime);
      } else {
        // Celestial Synth
        filter.frequency.setValueAtTime(3200, now);
        filter.Q.setValueAtTime(4, now);

        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteKey.freq, now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(noteKey.freq * 0.5, now);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + decayTime);
        osc2.stop(now + decayTime);
      }

      noteGain.connect(filter);
      filter.connect(masterGain);

      // UI Visual State
      setActiveNotes(prev => new Set(prev).add(noteKey.note));
      setTimeout(() => {
        setActiveNotes(prev => {
          const next = new Set(prev);
          next.delete(noteKey.note);
          return next;
        });
      }, 350);

      // Advance tutorial if note matches current target
      if (activeTutorialId) {
        const tutorial = TUTORIALS.find(t => t.id === activeTutorialId);
        if (tutorial) {
          const currentStep = tutorial.steps[tutorialStepIndex];
          if (currentStep && currentStep.note === noteKey.note) {
            setTutorialStepIndex(idx => (idx + 1) % tutorial.steps.length);
          }
        }
      }
    } catch {
      // Audio fallback
    }
  }, [instrument, sustain, getAudioContext, activeTutorialId, tutorialStepIndex]);

  // Physical Computer Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const keyChar = e.key.toUpperCase();

      // Spacebar for Sustain Pedal Toggle
      if (e.code === 'Space') {
        e.preventDefault();
        setSustain(s => !s);
        return;
      }

      const match = GENERATED_KEYS.find(k => k.keyboardShortcut === keyChar);
      if (match && !e.repeat) {
        triggerNote(match);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerNote]);

  const currentTutorial = TUTORIALS.find(t => t.id === activeTutorialId);
  const targetTutorialNote = currentTutorial ? currentTutorial.steps[tutorialStepIndex]?.note : null;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none font-sans overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-white/10 backdrop-blur-md">
        {/* Left: Title & Instrument selector */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Virtual Piano Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                Interactive
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Play with mouse, touch, or computer keyboard (QWERTY)
            </p>
          </div>
        </div>

        {/* Middle: Sound Engine Profiles */}
        <div className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          {(['grand', 'upright', 'rhodes', 'celestial'] as PianoInstrument[]).map((inst) => (
            <button
              key={inst}
              onClick={() => setInstrument(inst)}
              className={`px-3 py-1 rounded-lg capitalize transition-all font-medium ${
                instrument === inst
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {inst === 'grand' ? 'Grand Piano' : inst === 'upright' ? 'Upright Felt' : inst === 'rhodes' ? 'Rhodes' : 'Celestial'}
            </button>
          ))}
        </div>

        {/* Right: Controls (Sustain, Labels, Volume) */}
        <div className="flex items-center space-x-2">
          {/* Sustain Pedal Toggle */}
          <button
            onClick={() => setSustain(s => !s)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              sustain
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-500/10'
                : 'bg-slate-800/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Press Spacebar to toggle sustain"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Sustain Pedal: {sustain ? 'ON' : 'OFF'}</span>
          </button>

          {/* Key labels */}
          <button
            onClick={() => setShowShortcuts(s => !s)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
              showShortcuts
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle computer keyboard shortcuts on piano keys"
          >
            Keyboard Keys
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
            <button
              onClick={() => setIsMuted(m => !m)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 accent-amber-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Song Tutorial Banner (Learn to Play) */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-300">Guided Song Tutorial:</span>
          <div className="flex items-center space-x-1.5">
            {TUTORIALS.map((tut) => (
              <button
                key={tut.id}
                onClick={() => {
                  if (activeTutorialId === tut.id) {
                    setActiveTutorialId(null);
                    setTutorialStepIndex(0);
                  } else {
                    setActiveTutorialId(tut.id);
                    setTutorialStepIndex(0);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                  activeTutorialId === tut.id
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                {tut.title}
              </button>
            ))}
          </div>
        </div>

        {currentTutorial ? (
          <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/30 text-amber-300">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>
              Next Key to Press: <strong className="text-white text-xs underline decoration-amber-400">{currentTutorial.steps[tutorialStepIndex]?.note}</strong>
            </span>
            <span className="text-[10px] text-amber-400/70 font-mono">
              ({tutorialStepIndex + 1}/{currentTutorial.steps.length})
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">
            Tip: Press any key to play freely, or pick a tutorial above!
          </span>
        )}
      </div>

      {/* 3. The Grand Piano Keyboard Surface */}
      <div
        className="flex-1 relative flex items-stretch justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-x-auto overflow-y-hidden"
        onMouseDown={() => (isMouseDownRef.current = true)}
        onMouseUp={() => (isMouseDownRef.current = false)}
        onMouseLeave={() => (isMouseDownRef.current = false)}
      >
        <div className="relative flex items-stretch h-full max-h-[320px] shadow-2xl rounded-2xl p-3 bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-stone-800/90 select-none">
          {/* Top Wooden Piano Rim / Fallboard */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 rounded-t-xl border-b border-amber-900/40 flex items-center justify-center">
            <span className="text-[8px] tracking-[0.4em] uppercase text-amber-400/60 font-serif font-bold">
              Faouzi Kemala • Grand Studio
            </span>
          </div>

          {/* Render All White & Black Keys in musical order */}
          <div className="relative flex pt-3 h-full">
            {GENERATED_KEYS.map((key) => {
              const isActive = activeNotes.has(key.note);
              const isTutorialTarget = targetTutorialNote === key.note;

              if (key.isBlack) {
                // Black Key rendered absolutely above adjacent white keys
                return (
                  <button
                    key={key.note}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      triggerNote(key);
                    }}
                    onMouseEnter={() => {
                      if (isMouseDownRef.current) triggerNote(key);
                    }}
                    className={`absolute z-20 w-8 md:w-9 h-[62%] -ml-4 md:-ml-4.5 rounded-b-md transition-all duration-75 flex flex-col justify-end items-center pb-2 cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] translate-y-1'
                        : isTutorialTarget
                        ? 'bg-gradient-to-b from-amber-600 to-amber-500 animate-pulse border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                        : 'bg-gradient-to-b from-stone-800 via-stone-900 to-black border border-stone-700/60 shadow-lg hover:from-stone-700'
                    }`}
                    style={{
                      // Position black key relative to its index among white keys
                      left: `${getBlackKeyOffset(key.note)}px`
                    }}
                  >
                    {showShortcuts && key.keyboardShortcut && (
                      <span className={`text-[9px] font-bold font-mono px-1 rounded ${
                        isActive ? 'text-slate-950 bg-white/80' : 'text-amber-300/90 bg-black/60'
                      }`}>
                        {key.keyboardShortcut}
                      </span>
                    )}
                    {showKeyLabels && (
                      <span className={`text-[8px] font-medium mt-0.5 ${isActive ? 'text-slate-950 font-bold' : 'text-stone-400'}`}>
                        {key.label}
                      </span>
                    )}
                  </button>
                );
              }

              // White Key
              return (
                <button
                  key={key.note}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    triggerNote(key);
                  }}
                  onMouseEnter={() => {
                    if (isMouseDownRef.current) triggerNote(key);
                  }}
                  className={`relative z-10 w-10 sm:w-11 md:w-12 h-full rounded-b-xl border-x border-b border-stone-300/40 transition-all duration-75 flex flex-col justify-end items-center pb-3 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] translate-y-1'
                      : isTutorialTarget
                      ? 'bg-gradient-to-b from-amber-50 via-amber-100 to-amber-300 animate-pulse border-2 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.5)]'
                      : 'bg-gradient-to-b from-stone-100 via-white to-stone-200 hover:from-stone-50 hover:to-stone-100 shadow-md'
                  }`}
                >
                  {showShortcuts && key.keyboardShortcut && (
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shadow-xs mb-1 ${
                      isActive ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-amber-300'
                    }`}>
                      {key.keyboardShortcut}
                    </span>
                  )}
                  {showKeyLabels && (
                    <span className={`text-[9px] font-semibold tracking-tight ${
                      isActive ? 'text-stone-900 font-bold' : 'text-stone-600'
                    }`}>
                      {key.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Footer Help & Active Note readout */}
      <div className="px-4 py-2 bg-slate-950 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {activeNotes.size > 0
              ? `Active: ${Array.from(activeNotes).join(', ')}`
              : 'Tip: Hold keys down for sustained acoustic ring.'}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span>Full 3-Octave Polyphonic Acoustic Model</span>
          <span>•</span>
          <span className="text-slate-300">Spacebar = Sustain Pedal</span>
        </div>
      </div>
    </div>
  );
};

// Calculate accurate X pixel offset for black keys based on standard piano geometry
function getBlackKeyOffset(note: string): number {
  // White key width is approx 44px
  const W = 44;
  const offsets: Record<string, number> = {
    // Octave 3
    'Db3': W * 1,
    'Eb3': W * 2,
    'F#3': W * 4,
    'Ab3': W * 5,
    'Bb3': W * 6,
    // Octave 4
    'Db4': W * 8,
    'Eb4': W * 9,
    'F#4': W * 11,
    'Ab4': W * 12,
    'Bb4': W * 13,
    // Octave 5
    'Db5': W * 15,
    'Eb5': W * 16,
    'F#5': W * 18,
    'Ab5': W * 19,
    'Bb5': W * 20
  };
  return offsets[note] || 0;
}
