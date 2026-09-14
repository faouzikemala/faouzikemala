import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Disc3,
  ExternalLink,
  GripHorizontal,
  ListMusic,
  Pin,
  PinOff
} from 'lucide-react';
import {
  IDEA_SIMILAR_TRACKS,
  NOTE_FREQUENCIES,
  SongTrack,
  playSynthesizedNote
} from '../../data/ideaPianoTracks';

interface BackgroundMusicPlayerProps {
  isArabic?: boolean;
  onOpenPianoApp?: () => void;
  isAnyWindowMaximized?: boolean;
}

export const CalmPianoWidget: React.FC<BackgroundMusicPlayerProps> = ({
  isArabic = false,
  onOpenPianoApp,
  isAnyWindowMaximized = false
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPinnedOnTop, setIsPinnedOnTop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [visualPulse, setVisualPulse] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const loopIntervalRef = useRef<number | null>(null);

  const currentTrack = IDEA_SIMILAR_TRACKS[currentTrackIdx];

  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  };

  const playInstrumentVoice = (
    noteName: string,
    duration: number,
    instrument: 'lead' | 'synth' | 'pluck' | 'strings' | 'pad' | 'bass' = 'lead'
  ) => {
    try {
      const ctx = getAudioContext();
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain) return;

      const freq = NOTE_FREQUENCIES[noteName];
      if (!freq) return;

      playSynthesizedNote(ctx, masterGain, freq, duration, instrument);
      setVisualPulse(p => (p + 1) % 100);
    } catch {
      // Audio fallback
    }
  };

  const clearSchedules = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  };

  const stopAllAudio = () => {
    clearSchedules();
  };

  const scheduleTrackLoop = (track: SongTrack) => {
    clearSchedules();

    const scheduleOnce = () => {
      track.events.forEach(ev => {
        const timeoutId = window.setTimeout(() => {
          ev.notes.forEach(note => {
            playInstrumentVoice(note, ev.duration, ev.instrument || 'lead');
          });
        }, ev.time * 1000);
        timeoutsRef.current.push(timeoutId);
      });
    };

    scheduleOnce();
    const intervalId = window.setInterval(scheduleOnce, track.loopLength * 1000);
    loopIntervalRef.current = intervalId;
  };

  const startTrackAudio = (track: SongTrack) => {
    stopAllAudio();
    getAudioContext();
    scheduleTrackLoop(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      startTrackAudio(currentTrack);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIdx(index);
    const track = IDEA_SIMILAR_TRACKS[index];
    if (isPlaying) {
      stopAllAudio();
      getAudioContext();
      scheduleTrackLoop(track);
    }
    setShowPlaylist(false);
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIdx + 1) % IDEA_SIMILAR_TRACKS.length;
    setCurrentTrackIdx(nextIdx);
    const nextTrack = IDEA_SIMILAR_TRACKS[nextIdx];
    if (isPlaying) {
      stopAllAudio();
      getAudioContext();
      scheduleTrackLoop(nextTrack);
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIdx - 1 + IDEA_SIMILAR_TRACKS.length) % IDEA_SIMILAR_TRACKS.length;
    setCurrentTrackIdx(prevIdx);
    const prevTrack = IDEA_SIMILAR_TRACKS[prevIdx];
    if (isPlaying) {
      stopAllAudio();
      getAudioContext();
      scheduleTrackLoop(prevTrack);
    }
  };

  const toggleMute = () => {
    setIsMuted(m => {
      const next = !m;
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          next ? 0 : volume,
          audioCtxRef.current.currentTime
        );
      }
      return next;
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (isMuted) setIsMuted(false);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(v, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      clearSchedules();
    };
  }, []);

  const isBackgrounded = isAnyWindowMaximized && !isPinnedOnTop;
  const containerZIndex = isPinnedOnTop
    ? 'z-40 pointer-events-auto'
    : isBackgrounded
    ? 'z-10 pointer-events-none opacity-25 hover:opacity-100 transition-all duration-300'
    : 'z-20 pointer-events-auto transition-all duration-300';

  return (
    <div
      id="calm-piano-container"
      className={`fixed top-3.5 right-4 rtl:right-auto rtl:left-4 select-none ${containerZIndex} ${
        isArabic ? 'font-[\'Cairo\',\'Tajawal\',sans-serif]' : 'font-sans'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Floating Control Pill */
          <motion.div
            key="minimized"
            id="minimized-piano-pill"
            drag
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.05 }}
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-amber-400/40 shadow-2xl text-amber-300 ring-1 ring-amber-400/20 cursor-grab active:cursor-grabbing pointer-events-auto"
          >
            {/* Clickable Info Area to Expand */}
            <div
              onClick={() => setIsMinimized(false)}
              className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer group"
              title={isArabic ? 'انقر لتكبير المشغل' : 'Click to expand player'}
            >
              <Disc3
                className={`w-4 h-4 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
              />
              <div className="flex flex-col max-w-[120px]">
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {isArabic ? currentTrack.titleArabic : currentTrack.title}
                </span>
                <span className="text-[9px] text-amber-400/80 truncate">
                  {isPlaying ? (isArabic ? 'عزف مستمر' : 'Playing') : (isArabic ? 'متوقف' : 'Paused')}
                </span>
              </div>
            </div>

            {/* Quick Play/Pause on Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer transition-transform active:scale-90"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              )}
            </button>

            {/* Quick Next Track */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-3 h-3" />
            </button>

            {/* Pin Toggle on Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPinnedOnTop(!isPinnedOnTop);
              }}
              className={`p-1 rounded-full transition-colors cursor-pointer ${
                isPinnedOnTop ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
              title={
                isPinnedOnTop
                  ? (isArabic ? 'مثبت فوق النوافذ — انقر للإبقاء في الخلفية' : 'Pinned on top — click to keep in background')
                  : (isArabic ? 'في الخلفية عند تكبير النوافذ — انقر للتثبيت في المقدمة' : 'In background when tabs/windows enlarged — click to pin on top')
              }
            >
              <Pin className={`w-3 h-3 ${isPinnedOnTop ? 'rotate-45 text-amber-400' : ''}`} />
            </button>

            {/* Expand Full Player */}
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-slate-400 hover:text-amber-300 rounded-full transition-colors cursor-pointer"
              title={isArabic ? 'تكبير المشغل' : 'Expand player'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          /* Sleek Desktop Background Music Player - Movable / Draggable Pop-up */
          <motion.div
            key="expanded"
            id="expanded-piano-widget"
            drag
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            className="w-[320px] sm:w-[340px] rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-3.5 text-slate-100 flex flex-col gap-2.5 cursor-auto ring-1 ring-amber-400/20 pointer-events-auto"
          >
            {/* Movable Drag Handle Bar */}
            <div
              className="w-full flex items-center justify-center -mt-1 pb-1 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors select-none group"
              title={isArabic ? 'اسحب لتحريك النافذة المنبثقة' : 'Drag to reposition this pop-up'}
            >
              <GripHorizontal className="w-4 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span className="text-[9px] uppercase tracking-wider text-slate-500 group-hover:text-slate-300 ml-1 font-mono">
                {isArabic ? 'اسحب للتحريك' : 'Drag anywhere to move'}
              </span>
            </div>

            {/* Header: Title & Window Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    {isArabic ? 'موسيقى رهيبة ومختارة' : 'Cool Recommended Tracks'}
                  </h3>
                  <p className="text-[10px] text-amber-400/90 font-mono">
                    {isArabic ? 'سينث ويف، خيال علمي وألحان كونية' : 'Synthwave, Sci-Fi & Cosmic Audio'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {/* Pin on top / background toggle */}
                <button
                  onClick={() => setIsPinnedOnTop(!isPinnedOnTop)}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    isPinnedOnTop ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={
                    isPinnedOnTop
                      ? (isArabic ? 'مثبت فوق النوافذ — انقر للإبقاء في الخلفية' : 'Pinned on top — click to keep in background')
                      : (isArabic ? 'في الخلفية عند تكبير النوافذ — انقر للتثبيت في المقدمة' : 'In background when tabs/windows enlarged — click to pin on top')
                  }
                >
                  <Pin className={`w-3.5 h-3.5 ${isPinnedOnTop ? 'rotate-45 text-amber-400' : ''}`} />
                </button>
                <button
                  onClick={() => setShowPlaylist(p => !p)}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    showPlaylist ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={isArabic ? 'قائمة المقاطع الرهيبة' : 'Cool Playlist'}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={isArabic ? 'تصغير (يبقى شغال في الخلفية)' : 'Minimize (Keeps playing in background)'}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Playlist Drawer (When toggled) */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-900/90 rounded-xl border border-white/10 p-1.5 space-y-1"
                >
                  <p className="text-[10px] font-semibold text-amber-400 px-2 py-0.5">
                    {isArabic ? 'المقطوعات الرهيبة الموصى بها:' : 'Recommended Cool Tracks:'}
                  </p>
                  {IDEA_SIMILAR_TRACKS.map((track, idx) => (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(idx)}
                      className={`w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        currentTrackIdx === idx
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span>{isArabic ? track.titleArabic : track.title}</span>
                          <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-slate-300 font-mono">{track.genre}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{track.composer}</span>
                      </div>
                      {currentTrackIdx === idx && isPlaying && (
                        <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current Track Banner */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600/30 to-purple-600/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '5s' }} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {isArabic ? currentTrack.titleArabic : currentTrack.title}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-300 truncate">
                      {currentTrack.composer}
                    </span>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">
                      {currentTrack.genre}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Soundwave Visualizer */}
              <div className="flex items-end space-x-1 rtl:space-x-reverse h-5 shrink-0 px-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    className={`w-1 rounded-full bg-amber-400 transition-all duration-300 ${
                      isPlaying ? 'animate-pulse' : 'h-1 opacity-40'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(5, ((visualPulse + bar * 6) % 18) + 4)}px` : '4px',
                      animationDelay: `${bar * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Track Description */}
            <div className="px-1">
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                {isArabic ? currentTrack.descriptionArabic : currentTrack.description}
              </p>
            </div>

            {/* Transport Player Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-amber-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
                  title="Volume"
                />
              </div>
            </div>

            {/* Link to Full Virtual Piano Studio Inside Windows 11 */}
            {onOpenPianoApp && (
              <button
                onClick={onOpenPianoApp}
                className="w-full mt-1 flex items-center justify-center space-x-2 rtl:space-x-reverse py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-white/5 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/25 border border-amber-400/30 text-[11px] font-semibold text-amber-300 transition-all shadow-sm cursor-pointer"
              >
                <span>🎹 {isArabic ? 'فتح تطبيق استوديو البيانو التفاعلي' : 'Open Full Virtual Piano App'}</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
