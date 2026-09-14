export interface TrackEvent {
  time: number;
  notes: string[];
  duration: number;
  instrument?: 'lead' | 'synth' | 'pluck' | 'strings' | 'pad' | 'bass';
}

export interface SongTrack {
  id: string;
  title: string;
  titleArabic: string;
  composer: string;
  album: string;
  genre: string;
  tempo: number;
  description: string;
  descriptionArabic: string;
  loopLength: number;
  events: TrackEvent[];
}

export const NOTE_FREQUENCIES: Record<string, number> = {
  'C1': 32.70, 'C#1': 34.65, 'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'Eb1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'Gb1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'Ab1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'Bb1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53
};

// RECOMMENDED COOL TRACKS: High-Energy Synthwave, Sci-Fi Mystery, Chillwave & Cosmic Masterpieces
export const RECOMMENDED_COOL_TRACKS: SongTrack[] = [
  {
    id: 'cyber_neon_2099',
    title: 'Cyber Neon 2099',
    titleArabic: 'سايبر نيون 2099 (Cyber Neon)',
    composer: 'Synthwave Odyssey',
    album: 'Neon Grid Anthology',
    genre: 'Synthwave / Cyberpunk',
    tempo: 128,
    description: 'High-octane cyberpunk drive through a rain-drenched neon metropolis. Driving bassline, cutting retro synth riffs, and glowing cyber pads.',
    descriptionArabic: 'رحلة حماسية وسريعة في شوارع المستقبل ونيون السايبربانك، مع خطوط بيس اندفاعية وألحان سينث كهربائية مشوقة.',
    loopLength: 7.50,
    events: [
      // Measure 1: Am (A Minor) - Driving rolling bass & plucks
      { time: 0.00, notes: ['A1', 'A2'], duration: 0.35, instrument: 'bass' },
      { time: 0.00, notes: ['A3', 'C4', 'E4'], duration: 1.80, instrument: 'pad' },
      { time: 0.00, notes: ['E5'], duration: 0.22, instrument: 'pluck' },
      { time: 0.22, notes: ['A4'], duration: 0.20, instrument: 'synth' },
      { time: 0.44, notes: ['C5'], duration: 0.22, instrument: 'pluck' },
      { time: 0.44, notes: ['A2'], duration: 0.30, instrument: 'bass' },
      { time: 0.66, notes: ['E5'], duration: 0.25, instrument: 'synth' },
      { time: 0.88, notes: ['A1', 'A2'], duration: 0.35, instrument: 'bass' },
      { time: 0.88, notes: ['G5'], duration: 0.32, instrument: 'lead' },
      { time: 1.10, notes: ['E5'], duration: 0.22, instrument: 'pluck' },
      { time: 1.32, notes: ['A2'], duration: 0.30, instrument: 'bass' },
      { time: 1.54, notes: ['C5'], duration: 0.25, instrument: 'synth' },
      { time: 1.70, notes: ['D5'], duration: 0.20, instrument: 'lead' },

      // Measure 2: F Major - Soaring Neon Arcs
      { time: 1.90, notes: ['F1', 'F2'], duration: 0.35, instrument: 'bass' },
      { time: 1.90, notes: ['F3', 'A3', 'C4'], duration: 1.80, instrument: 'pad' },
      { time: 1.90, notes: ['E5'], duration: 0.28, instrument: 'lead' },
      { time: 2.12, notes: ['C5'], duration: 0.20, instrument: 'synth' },
      { time: 2.34, notes: ['A4'], duration: 0.22, instrument: 'pluck' },
      { time: 2.34, notes: ['F2'], duration: 0.30, instrument: 'bass' },
      { time: 2.56, notes: ['C5'], duration: 0.25, instrument: 'synth' },
      { time: 2.78, notes: ['F1', 'F2'], duration: 0.35, instrument: 'bass' },
      { time: 2.78, notes: ['F5'], duration: 0.35, instrument: 'lead' },
      { time: 3.00, notes: ['E5'], duration: 0.22, instrument: 'pluck' },
      { time: 3.22, notes: ['F2'], duration: 0.30, instrument: 'bass' },
      { time: 3.44, notes: ['D5'], duration: 0.25, instrument: 'synth' },
      { time: 3.60, notes: ['C5'], duration: 0.22, instrument: 'lead' },

      // Measure 3: C Major - Bright Hook Ascents
      { time: 3.80, notes: ['C2', 'C3'], duration: 0.35, instrument: 'bass' },
      { time: 3.80, notes: ['C3', 'E3', 'G3'], duration: 1.80, instrument: 'pad' },
      { time: 3.80, notes: ['G5'], duration: 0.35, instrument: 'lead' },
      { time: 4.02, notes: ['E5'], duration: 0.20, instrument: 'synth' },
      { time: 4.24, notes: ['C5'], duration: 0.22, instrument: 'pluck' },
      { time: 4.24, notes: ['C3'], duration: 0.30, instrument: 'bass' },
      { time: 4.46, notes: ['G5'], duration: 0.28, instrument: 'synth' },
      { time: 4.68, notes: ['C2', 'C3'], duration: 0.35, instrument: 'bass' },
      { time: 4.68, notes: ['A5'], duration: 0.38, instrument: 'lead' },
      { time: 4.90, notes: ['G5'], duration: 0.22, instrument: 'pluck' },
      { time: 5.12, notes: ['C3'], duration: 0.30, instrument: 'bass' },
      { time: 5.34, notes: ['E5'], duration: 0.25, instrument: 'synth' },

      // Measure 4: G Major - Climax & Resolution
      { time: 5.60, notes: ['G1', 'G2'], duration: 0.35, instrument: 'bass' },
      { time: 5.60, notes: ['G3', 'B3', 'D4'], duration: 1.80, instrument: 'pad' },
      { time: 5.60, notes: ['B5'], duration: 0.35, instrument: 'lead' },
      { time: 5.82, notes: ['G5'], duration: 0.20, instrument: 'synth' },
      { time: 6.04, notes: ['D5'], duration: 0.22, instrument: 'pluck' },
      { time: 6.04, notes: ['G2'], duration: 0.30, instrument: 'bass' },
      { time: 6.26, notes: ['B5'], duration: 0.28, instrument: 'synth' },
      { time: 6.48, notes: ['G1', 'G2'], duration: 0.35, instrument: 'bass' },
      { time: 6.48, notes: ['A5'], duration: 0.30, instrument: 'lead' },
      { time: 6.70, notes: ['G5'], duration: 0.25, instrument: 'pluck' },
      { time: 6.92, notes: ['E5'], duration: 0.30, instrument: 'synth' },
      { time: 7.14, notes: ['D5'], duration: 0.30, instrument: 'lead' },
      { time: 7.32, notes: ['C5'], duration: 0.20, instrument: 'pluck' }
    ]
  },
  {
    id: 'stranger_odyssey',
    title: 'Stranger Odyssey',
    titleArabic: 'سترينجر أوديسي (Stranger Odyssey)',
    composer: '80s Synth Mystery',
    album: 'Hawkins Nightwalk',
    genre: 'Retro Synth / Sci-Fi',
    tempo: 138,
    description: 'The iconic 80s analog synth odyssey. Hypnotic climbing arpeggios with menacing sub-bass, eerie sci-fi choirs, and retro tension.',
    descriptionArabic: 'اللحن الأيقوني الغامض المستوحى من عوالم الخيال العلمي والثمانينات مع الأربيجات الصاعدة والهابطة والبيس التناظري العميق.',
    loopLength: 7.20,
    events: [
      // Measure 1: C Major - Up & Down Climbing Arpeggio
      { time: 0.00, notes: ['C1', 'C2'], duration: 1.70, instrument: 'bass' },
      { time: 0.00, notes: ['C3', 'G3', 'C4'], duration: 1.75, instrument: 'strings' },
      { time: 0.00, notes: ['C3'], duration: 0.22, instrument: 'synth' },
      { time: 0.22, notes: ['E3'], duration: 0.22, instrument: 'synth' },
      { time: 0.44, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 0.66, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 0.88, notes: ['C4'], duration: 0.24, instrument: 'pluck' },
      { time: 1.10, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 1.32, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 1.54, notes: ['E3'], duration: 0.22, instrument: 'synth' },

      // Measure 2: Second climb with high melodic shimmer
      { time: 1.80, notes: ['C1', 'C2'], duration: 1.70, instrument: 'bass' },
      { time: 1.80, notes: ['E3', 'G3', 'B3'], duration: 1.75, instrument: 'pad' },
      { time: 1.80, notes: ['C3'], duration: 0.22, instrument: 'synth' },
      { time: 1.80, notes: ['G4'], duration: 0.45, instrument: 'lead' },
      { time: 2.02, notes: ['E3'], duration: 0.22, instrument: 'synth' },
      { time: 2.24, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 2.24, notes: ['B4'], duration: 0.45, instrument: 'lead' },
      { time: 2.46, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 2.68, notes: ['C4'], duration: 0.24, instrument: 'pluck' },
      { time: 2.68, notes: ['C5'], duration: 0.45, instrument: 'lead' },
      { time: 2.90, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 3.12, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 3.12, notes: ['B4'], duration: 0.45, instrument: 'lead' },
      { time: 3.34, notes: ['E3'], duration: 0.22, instrument: 'synth' },

      // Measure 3: E Minor Transition - Dark Suspense
      { time: 3.60, notes: ['E1', 'E2'], duration: 1.70, instrument: 'bass' },
      { time: 3.60, notes: ['E3', 'B3', 'E4'], duration: 1.75, instrument: 'strings' },
      { time: 3.60, notes: ['E3'], duration: 0.22, instrument: 'synth' },
      { time: 3.82, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 4.04, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 4.26, notes: ['D4'], duration: 0.22, instrument: 'synth' },
      { time: 4.48, notes: ['E4'], duration: 0.24, instrument: 'pluck' },
      { time: 4.70, notes: ['D4'], duration: 0.22, instrument: 'synth' },
      { time: 4.92, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 5.14, notes: ['G3'], duration: 0.22, instrument: 'synth' },

      // Measure 4: High Dramatic Peak & Resolve
      { time: 5.40, notes: ['C1', 'G1'], duration: 1.70, instrument: 'bass' },
      { time: 5.40, notes: ['G3', 'C4', 'E4'], duration: 1.75, instrument: 'pad' },
      { time: 5.40, notes: ['E5'], duration: 0.40, instrument: 'lead' },
      { time: 5.40, notes: ['C3'], duration: 0.22, instrument: 'synth' },
      { time: 5.62, notes: ['E3'], duration: 0.22, instrument: 'synth' },
      { time: 5.80, notes: ['D5'], duration: 0.35, instrument: 'lead' },
      { time: 5.84, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 6.06, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 6.15, notes: ['B4'], duration: 0.40, instrument: 'lead' },
      { time: 6.28, notes: ['C4'], duration: 0.24, instrument: 'pluck' },
      { time: 6.50, notes: ['B3'], duration: 0.22, instrument: 'synth' },
      { time: 6.55, notes: ['G4'], duration: 0.40, instrument: 'lead' },
      { time: 6.72, notes: ['G3'], duration: 0.22, instrument: 'synth' },
      { time: 6.94, notes: ['E3'], duration: 0.22, instrument: 'synth' }
    ]
  },
  {
    id: 'interstellar_caution',
    title: 'Interstellar: No Time For Caution',
    titleArabic: 'إنترستيلر: لا وقت للحذر (No Time For Caution)',
    composer: 'Hans Zimmer',
    album: 'Interstellar',
    genre: 'Cinematic / Epic Space',
    tempo: 154,
    description: 'The spine-chilling cosmic masterpiece. Ticking organ and piano arpeggios that build into triumphant, gravity-defying orchestral power.',
    descriptionArabic: 'الملحمة الكونية الشهيرة لهانز زيمر بأربيجات البيانو والأورغن المتسارعة والوتريات الملحمية المهيبة في قلب الثقب الأسود.',
    loopLength: 8.80,
    events: [
      // Measure 1: Dm (D Minor) - Accelerating Pulse
      { time: 0.00, notes: ['D1', 'D2'], duration: 1.05, instrument: 'bass' },
      { time: 0.00, notes: ['D3', 'A3', 'F4'], duration: 1.10, instrument: 'strings' },
      { time: 0.00, notes: ['A4'], duration: 0.30, instrument: 'lead' },
      { time: 0.18, notes: ['F4'], duration: 0.25, instrument: 'pluck' },
      { time: 0.36, notes: ['D4'], duration: 0.25, instrument: 'pluck' },
      { time: 0.54, notes: ['A4'], duration: 0.30, instrument: 'lead' },
      { time: 0.72, notes: ['F4'], duration: 0.25, instrument: 'pluck' },
      { time: 0.90, notes: ['D5'], duration: 0.32, instrument: 'synth' },

      // Measure 2: Bb Major - Tectonic Swell
      { time: 1.10, notes: ['Bb1', 'Bb2'], duration: 1.05, instrument: 'bass' },
      { time: 1.10, notes: ['Bb2', 'F3', 'D4'], duration: 1.10, instrument: 'strings' },
      { time: 1.10, notes: ['Bb4'], duration: 0.30, instrument: 'lead' },
      { time: 1.28, notes: ['F4'], duration: 0.25, instrument: 'pluck' },
      { time: 1.46, notes: ['D4'], duration: 0.25, instrument: 'pluck' },
      { time: 1.64, notes: ['Bb4'], duration: 0.30, instrument: 'lead' },
      { time: 1.82, notes: ['F4'], duration: 0.25, instrument: 'pluck' },
      { time: 2.00, notes: ['F5'], duration: 0.32, instrument: 'synth' },

      // Measure 3: F Major - Cosmic Perspective
      { time: 2.20, notes: ['F1', 'F2'], duration: 1.05, instrument: 'bass' },
      { time: 2.20, notes: ['F3', 'C4', 'A4'], duration: 1.10, instrument: 'strings' },
      { time: 2.20, notes: ['C5'], duration: 0.30, instrument: 'lead' },
      { time: 2.38, notes: ['A4'], duration: 0.25, instrument: 'pluck' },
      { time: 2.56, notes: ['F4'], duration: 0.25, instrument: 'pluck' },
      { time: 2.74, notes: ['C5'], duration: 0.30, instrument: 'lead' },
      { time: 2.92, notes: ['A4'], duration: 0.25, instrument: 'pluck' },
      { time: 3.10, notes: ['A5'], duration: 0.35, instrument: 'synth' },

      // Measure 4: C Major - Majestic Expansion
      { time: 3.30, notes: ['C2', 'C3'], duration: 1.05, instrument: 'bass' },
      { time: 3.30, notes: ['C3', 'G3', 'E4'], duration: 1.10, instrument: 'strings' },
      { time: 3.30, notes: ['G4'], duration: 0.30, instrument: 'lead' },
      { time: 3.48, notes: ['E4'], duration: 0.25, instrument: 'pluck' },
      { time: 3.66, notes: ['C4'], duration: 0.25, instrument: 'pluck' },
      { time: 3.84, notes: ['G4'], duration: 0.30, instrument: 'lead' },
      { time: 4.02, notes: ['E4'], duration: 0.25, instrument: 'pluck' },
      { time: 4.20, notes: ['G5'], duration: 0.35, instrument: 'synth' },

      // Part 2: Triumphant Docking Crescendo
      // Measure 5: Dm Peak with soaring melody
      { time: 4.40, notes: ['D1', 'A1', 'D2'], duration: 1.05, instrument: 'bass' },
      { time: 4.40, notes: ['D4', 'F4', 'A4'], duration: 1.10, instrument: 'pad' },
      { time: 4.40, notes: ['A5'], duration: 0.40, instrument: 'lead' },
      { time: 4.58, notes: ['F5'], duration: 0.28, instrument: 'pluck' },
      { time: 4.76, notes: ['D5'], duration: 0.28, instrument: 'pluck' },
      { time: 4.94, notes: ['A5'], duration: 0.35, instrument: 'lead' },
      { time: 5.12, notes: ['F5'], duration: 0.28, instrument: 'pluck' },
      { time: 5.30, notes: ['A5'], duration: 0.35, instrument: 'synth' },

      // Measure 6: Bb Peak with G5 -> F5 soaring cry
      { time: 5.50, notes: ['Bb1', 'F2', 'Bb2'], duration: 1.05, instrument: 'bass' },
      { time: 5.50, notes: ['D4', 'F4', 'Bb4'], duration: 1.10, instrument: 'pad' },
      { time: 5.50, notes: ['Bb5'], duration: 0.40, instrument: 'lead' },
      { time: 5.68, notes: ['G5'], duration: 0.28, instrument: 'pluck' },
      { time: 5.86, notes: ['F5'], duration: 0.28, instrument: 'pluck' },
      { time: 6.04, notes: ['G5'], duration: 0.35, instrument: 'lead' },
      { time: 6.22, notes: ['D5'], duration: 0.28, instrument: 'pluck' },
      { time: 6.40, notes: ['Bb5'], duration: 0.35, instrument: 'synth' },

      // Measure 7: A Major Dramatic Dominant
      { time: 6.60, notes: ['A1', 'E2', 'A2'], duration: 1.05, instrument: 'bass' },
      { time: 6.60, notes: ['C#4', 'E4', 'A4'], duration: 1.10, instrument: 'strings' },
      { time: 6.60, notes: ['C#6'], duration: 0.42, instrument: 'lead' },
      { time: 6.78, notes: ['A5'], duration: 0.28, instrument: 'pluck' },
      { time: 6.96, notes: ['E5'], duration: 0.28, instrument: 'pluck' },
      { time: 7.14, notes: ['C#6'], duration: 0.35, instrument: 'lead' },
      { time: 7.32, notes: ['A5'], duration: 0.28, instrument: 'pluck' },
      { time: 7.50, notes: ['E5'], duration: 0.35, instrument: 'synth' },

      // Measure 8: Resolving Dm Finality
      { time: 7.70, notes: ['D1', 'A1', 'D2'], duration: 1.05, instrument: 'bass' },
      { time: 7.70, notes: ['F4', 'A4', 'D5'], duration: 1.10, instrument: 'strings' },
      { time: 7.70, notes: ['D6'], duration: 0.45, instrument: 'lead' },
      { time: 7.88, notes: ['A5'], duration: 0.30, instrument: 'pluck' },
      { time: 8.06, notes: ['F5'], duration: 0.30, instrument: 'pluck' },
      { time: 8.24, notes: ['D5'], duration: 0.35, instrument: 'synth' },
      { time: 8.42, notes: ['A4'], duration: 0.35, instrument: 'lead' },
      { time: 8.60, notes: ['F4'], duration: 0.35, instrument: 'pluck' }
    ]
  },
  {
    id: 'resonance_chillwave',
    title: 'Resonance / Sunset Highway',
    titleArabic: 'ريزونانس / طريق الغروب (Resonance)',
    composer: 'Chillwave Classics',
    album: 'Odyssey Retrowave',
    genre: 'Chillwave / Vaporwave',
    tempo: 112,
    description: 'The definitive nostalgic chillwave anthem. Warm detuned synth chords, wandering dream melody, and sunset cosmic breeze.',
    descriptionArabic: 'أيقونة التشيل ويف والنوستالجيا الدافئة مع كوردات الدريمووف الهادئة وألحان الغروب التأملية على طريق الأحلام.',
    loopLength: 8.40,
    events: [
      // Measure 1: Dmaj7 (D - F# - A - C#)
      { time: 0.00, notes: ['D2', 'A2'], duration: 1.95, instrument: 'bass' },
      { time: 0.00, notes: ['F#3', 'A3', 'C#4'], duration: 2.05, instrument: 'pad' },
      { time: 0.00, notes: ['F#5'], duration: 0.45, instrument: 'lead' },
      { time: 0.35, notes: ['A4'], duration: 0.30, instrument: 'pluck' },
      { time: 0.70, notes: ['C#5'], duration: 0.40, instrument: 'synth' },
      { time: 1.05, notes: ['E5'], duration: 0.35, instrument: 'lead' },
      { time: 1.40, notes: ['D5'], duration: 0.45, instrument: 'synth' },
      { time: 1.75, notes: ['A4'], duration: 0.30, instrument: 'pluck' },

      // Measure 2: C#m7 (C# - E - G# - B)
      { time: 2.10, notes: ['C#2', 'G#2'], duration: 1.95, instrument: 'bass' },
      { time: 2.10, notes: ['E3', 'G#3', 'B3'], duration: 2.05, instrument: 'pad' },
      { time: 2.10, notes: ['E5'], duration: 0.45, instrument: 'lead' },
      { time: 2.45, notes: ['G#4'], duration: 0.30, instrument: 'pluck' },
      { time: 2.80, notes: ['B4'], duration: 0.40, instrument: 'synth' },
      { time: 3.15, notes: ['D#5'], duration: 0.35, instrument: 'lead' },
      { time: 3.50, notes: ['C#5'], duration: 0.45, instrument: 'synth' },
      { time: 3.85, notes: ['G#4'], duration: 0.30, instrument: 'pluck' },

      // Measure 3: Bm7 (B - D - F# - A)
      { time: 4.20, notes: ['B1', 'F#2'], duration: 1.95, instrument: 'bass' },
      { time: 4.20, notes: ['D3', 'F#3', 'A3'], duration: 2.05, instrument: 'pad' },
      { time: 4.20, notes: ['D5'], duration: 0.45, instrument: 'lead' },
      { time: 4.55, notes: ['F#4'], duration: 0.30, instrument: 'pluck' },
      { time: 4.90, notes: ['A4'], duration: 0.40, instrument: 'synth' },
      { time: 5.25, notes: ['C#5'], duration: 0.35, instrument: 'lead' },
      { time: 5.60, notes: ['B4'], duration: 0.45, instrument: 'synth' },
      { time: 5.95, notes: ['F#4'], duration: 0.30, instrument: 'pluck' },

      // Measure 4: A Major (A - C# - E)
      { time: 6.30, notes: ['A1', 'E2'], duration: 1.95, instrument: 'bass' },
      { time: 6.30, notes: ['C#3', 'E3', 'A3'], duration: 2.05, instrument: 'pad' },
      { time: 6.30, notes: ['C#5'], duration: 0.45, instrument: 'lead' },
      { time: 6.65, notes: ['E4'], duration: 0.30, instrument: 'pluck' },
      { time: 7.00, notes: ['A4'], duration: 0.40, instrument: 'synth' },
      { time: 7.35, notes: ['B4'], duration: 0.35, instrument: 'lead' },
      { time: 7.70, notes: ['A4'], duration: 0.45, instrument: 'synth' },
      { time: 8.05, notes: ['F#4'], duration: 0.35, instrument: 'lead' }
    ]
  },
  {
    id: 'midnight_city_drive',
    title: 'Midnight City / Neon Dreams',
    titleArabic: 'ميدنايت سيتي / أحلام النيون (Midnight City)',
    composer: 'Electro Dreamwave',
    album: 'Electric Twilight',
    genre: 'French Touch / Synth-Pop',
    tempo: 125,
    description: 'Iconic electro-dreamwave anthem with driving four-on-the-floor synth bass, soaring neon synth hook, and euphoric nocturnal energy.',
    descriptionArabic: 'الملحمة الموسيقية الليلية المبهجة مع إيقاعات السينث الحيوية والألحان المضيئة وروح التسعينات الساحرة.',
    loopLength: 7.68,
    events: [
      // Measure 1: Bm (B Minor)
      { time: 0.00, notes: ['B1', 'B2'], duration: 0.35, instrument: 'bass' },
      { time: 0.00, notes: ['B3', 'D4', 'F#4'], duration: 1.85, instrument: 'pad' },
      { time: 0.00, notes: ['F#5'], duration: 0.35, instrument: 'synth' },
      { time: 0.24, notes: ['D5'], duration: 0.25, instrument: 'lead' },
      { time: 0.48, notes: ['B4'], duration: 0.25, instrument: 'pluck' },
      { time: 0.48, notes: ['B2'], duration: 0.35, instrument: 'bass' },
      { time: 0.72, notes: ['F#5'], duration: 0.35, instrument: 'synth' },
      { time: 0.96, notes: ['B1', 'B2'], duration: 0.35, instrument: 'bass' },
      { time: 0.96, notes: ['A5'], duration: 0.40, instrument: 'lead' },
      { time: 1.20, notes: ['F#5'], duration: 0.25, instrument: 'pluck' },
      { time: 1.44, notes: ['B2'], duration: 0.35, instrument: 'bass' },
      { time: 1.68, notes: ['D5'], duration: 0.25, instrument: 'lead' },

      // Measure 2: G Major
      { time: 1.92, notes: ['G1', 'G2'], duration: 0.35, instrument: 'bass' },
      { time: 1.92, notes: ['G3', 'B3', 'D4'], duration: 1.85, instrument: 'pad' },
      { time: 1.92, notes: ['G5'], duration: 0.38, instrument: 'synth' },
      { time: 2.16, notes: ['D5'], duration: 0.25, instrument: 'lead' },
      { time: 2.40, notes: ['B4'], duration: 0.25, instrument: 'pluck' },
      { time: 2.40, notes: ['G2'], duration: 0.35, instrument: 'bass' },
      { time: 2.64, notes: ['G5'], duration: 0.35, instrument: 'synth' },
      { time: 2.88, notes: ['G1', 'G2'], duration: 0.35, instrument: 'bass' },
      { time: 2.88, notes: ['B5'], duration: 0.42, instrument: 'lead' },
      { time: 3.12, notes: ['G5'], duration: 0.25, instrument: 'pluck' },
      { time: 3.36, notes: ['G2'], duration: 0.35, instrument: 'bass' },
      { time: 3.60, notes: ['D5'], duration: 0.25, instrument: 'lead' },

      // Measure 3: D Major
      { time: 3.84, notes: ['D2', 'D3'], duration: 0.35, instrument: 'bass' },
      { time: 3.84, notes: ['D3', 'F#3', 'A3'], duration: 1.85, instrument: 'pad' },
      { time: 3.84, notes: ['A5'], duration: 0.38, instrument: 'synth' },
      { time: 4.08, notes: ['F#5'], duration: 0.25, instrument: 'lead' },
      { time: 4.32, notes: ['D5'], duration: 0.25, instrument: 'pluck' },
      { time: 4.32, notes: ['D3'], duration: 0.35, instrument: 'bass' },
      { time: 4.56, notes: ['A5'], duration: 0.35, instrument: 'synth' },
      { time: 4.80, notes: ['D2', 'D3'], duration: 0.35, instrument: 'bass' },
      { time: 4.80, notes: ['F#6'], duration: 0.45, instrument: 'lead' },
      { time: 5.04, notes: ['A5'], duration: 0.25, instrument: 'pluck' },
      { time: 5.28, notes: ['D3'], duration: 0.35, instrument: 'bass' },
      { time: 5.52, notes: ['E5'], duration: 0.25, instrument: 'lead' },

      // Measure 4: A Major
      { time: 5.76, notes: ['A1', 'A2'], duration: 0.35, instrument: 'bass' },
      { time: 5.76, notes: ['C#4', 'E4', 'A4'], duration: 1.85, instrument: 'pad' },
      { time: 5.76, notes: ['E5'], duration: 0.35, instrument: 'synth' },
      { time: 6.00, notes: ['C#5'], duration: 0.25, instrument: 'lead' },
      { time: 6.24, notes: ['A4'], duration: 0.25, instrument: 'pluck' },
      { time: 6.24, notes: ['A2'], duration: 0.35, instrument: 'bass' },
      { time: 6.48, notes: ['E5'], duration: 0.35, instrument: 'synth' },
      { time: 6.72, notes: ['A1', 'A2'], duration: 0.35, instrument: 'bass' },
      { time: 6.72, notes: ['C#6'], duration: 0.42, instrument: 'lead' },
      { time: 6.96, notes: ['B5'], duration: 0.28, instrument: 'pluck' },
      { time: 7.20, notes: ['A2'], duration: 0.35, instrument: 'bass' },
      { time: 7.44, notes: ['F#5'], duration: 0.30, instrument: 'lead' }
    ]
  },
  {
    id: 'tokyo_drift_phonk',
    title: 'Tokyo Drift / Cyber Phonk',
    titleArabic: 'طوكيو دريفت / فونك سايبر (Tokyo Drift)',
    composer: 'Night Drift Wave',
    album: 'Shibuya Midnight Express',
    genre: 'Cyber Phonk / Dark Wave',
    tempo: 130,
    description: 'Moody nocturnal cyber groove with aggressive low-end bass stabs, fast melodic piano flourishes, and dark synth atmosphere.',
    descriptionArabic: 'موسيقى الفونك الليلية الصاخبة مع نغمات البيانو الحادة وضربات البيس القوية للمدن الليلية وسباقات المستقبل.',
    loopLength: 7.38,
    events: [
      // Measure 1: Em (E Minor)
      { time: 0.00, notes: ['E1'], duration: 0.40, instrument: 'bass' },
      { time: 0.00, notes: ['E3', 'G3', 'B3'], duration: 1.75, instrument: 'strings' },
      { time: 0.00, notes: ['B4', 'E5'], duration: 0.35, instrument: 'lead' },
      { time: 0.23, notes: ['G4'], duration: 0.20, instrument: 'pluck' },
      { time: 0.46, notes: ['E4'], duration: 0.20, instrument: 'pluck' },
      { time: 0.46, notes: ['E1', 'E2'], duration: 0.35, instrument: 'bass' },
      { time: 0.69, notes: ['B4'], duration: 0.35, instrument: 'synth' },
      { time: 0.92, notes: ['E1'], duration: 0.40, instrument: 'bass' },
      { time: 0.92, notes: ['D5'], duration: 0.35, instrument: 'lead' },
      { time: 1.15, notes: ['B4'], duration: 0.20, instrument: 'pluck' },
      { time: 1.38, notes: ['E2'], duration: 0.35, instrument: 'bass' },
      { time: 1.61, notes: ['G4'], duration: 0.25, instrument: 'synth' },

      // Measure 2: C Major Phonk Stabs
      { time: 1.84, notes: ['C1'], duration: 0.40, instrument: 'bass' },
      { time: 1.84, notes: ['C3', 'E3', 'G3'], duration: 1.75, instrument: 'strings' },
      { time: 1.84, notes: ['G4', 'C5'], duration: 0.35, instrument: 'lead' },
      { time: 2.07, notes: ['E4'], duration: 0.20, instrument: 'pluck' },
      { time: 2.30, notes: ['C4'], duration: 0.20, instrument: 'pluck' },
      { time: 2.30, notes: ['C1', 'C2'], duration: 0.35, instrument: 'bass' },
      { time: 2.53, notes: ['E5'], duration: 0.38, instrument: 'synth' },
      { time: 2.76, notes: ['C1'], duration: 0.40, instrument: 'bass' },
      { time: 2.76, notes: ['D5'], duration: 0.32, instrument: 'lead' },
      { time: 2.99, notes: ['C5'], duration: 0.25, instrument: 'pluck' },
      { time: 3.22, notes: ['C2'], duration: 0.35, instrument: 'bass' },
      { time: 3.45, notes: ['G4'], duration: 0.25, instrument: 'synth' },

      // Measure 3: Am (A Minor) Rapid Descent
      { time: 3.68, notes: ['A1'], duration: 0.40, instrument: 'bass' },
      { time: 3.68, notes: ['A3', 'C4', 'E4'], duration: 1.75, instrument: 'strings' },
      { time: 3.68, notes: ['C5', 'E5'], duration: 0.35, instrument: 'lead' },
      { time: 3.91, notes: ['A4'], duration: 0.20, instrument: 'pluck' },
      { time: 4.14, notes: ['E4'], duration: 0.20, instrument: 'pluck' },
      { time: 4.14, notes: ['A1', 'A2'], duration: 0.35, instrument: 'bass' },
      { time: 4.37, notes: ['F#5'], duration: 0.35, instrument: 'synth' },
      { time: 4.60, notes: ['A1'], duration: 0.40, instrument: 'bass' },
      { time: 4.60, notes: ['E5'], duration: 0.32, instrument: 'lead' },
      { time: 4.83, notes: ['D#5'], duration: 0.25, instrument: 'pluck' },
      { time: 5.06, notes: ['A2'], duration: 0.35, instrument: 'bass' },
      { time: 5.29, notes: ['C5'], duration: 0.25, instrument: 'synth' },

      // Measure 4: B Dominant Cyber Climax
      { time: 5.52, notes: ['B1'], duration: 0.40, instrument: 'bass' },
      { time: 5.52, notes: ['B3', 'D#4', 'F#4'], duration: 1.75, instrument: 'strings' },
      { time: 5.52, notes: ['D#5', 'F#5'], duration: 0.38, instrument: 'lead' },
      { time: 5.75, notes: ['B4'], duration: 0.22, instrument: 'pluck' },
      { time: 5.98, notes: ['F#4'], duration: 0.22, instrument: 'pluck' },
      { time: 5.98, notes: ['B1', 'B2'], duration: 0.35, instrument: 'bass' },
      { time: 6.21, notes: ['A5'], duration: 0.38, instrument: 'synth' },
      { time: 6.44, notes: ['B1'], duration: 0.40, instrument: 'bass' },
      { time: 6.44, notes: ['G5'], duration: 0.32, instrument: 'lead' },
      { time: 6.67, notes: ['F#5'], duration: 0.25, instrument: 'pluck' },
      { time: 6.90, notes: ['B2'], duration: 0.35, instrument: 'bass' },
      { time: 7.13, notes: ['E5'], duration: 0.25, instrument: 'synth' }
    ]
  }
];

// Compatibility alias so existing components can reference seamlessly
export const IDEA_SIMILAR_TRACKS: SongTrack[] = RECOMMENDED_COOL_TRACKS;

// High-Fidelity Multi-Timbral Audio Synthesizer
export function playSynthesizedNote(
  ctx: AudioContext,
  destination: AudioNode,
  freq: number,
  duration: number,
  instrument: 'lead' | 'synth' | 'pluck' | 'strings' | 'pad' | 'bass' = 'lead'
) {
  try {
    const now = ctx.currentTime;

    // 1. Synthwave / Cyber Lead (Dual detuned sawtooth with 24dB low-pass filter envelope)
    if (instrument === 'synth') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const synthFilter = ctx.createBiquadFilter();
      const synthGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq * 0.996, now);
      osc2.frequency.setValueAtTime(freq * 1.004, now);

      synthFilter.type = 'lowpass';
      synthFilter.Q.setValueAtTime(3.5, now);
      synthFilter.frequency.setValueAtTime(450, now);
      synthFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.04);
      synthFilter.frequency.exponentialRampToValueAtTime(700, now + duration);

      synthGain.gain.setValueAtTime(0.0001, now);
      synthGain.gain.linearRampToValueAtTime(0.24, now + 0.015);
      synthGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(synthFilter);
      osc2.connect(synthFilter);
      synthFilter.connect(synthGain);
      synthGain.connect(destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      return;
    }

    // 2. Crystalline Pluck / Arpeggio Chime
    if (instrument === 'pluck') {
      const osc = ctx.createOscillator();
      const pluckFilter = ctx.createBiquadFilter();
      const pluckGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      pluckFilter.type = 'bandpass';
      pluckFilter.frequency.setValueAtTime(freq * 1.8, now);
      pluckFilter.Q.setValueAtTime(2.0, now);

      pluckGain.gain.setValueAtTime(0.0001, now);
      pluckGain.gain.linearRampToValueAtTime(0.28, now + 0.005);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration, 0.45));

      osc.connect(pluckFilter);
      pluckFilter.connect(pluckGain);
      pluckGain.connect(destination);

      osc.start(now);
      osc.stop(now + Math.min(duration, 0.5));
      return;
    }

    // 3. Deep Analog Sub-Bass (Punchy 808/Moog-style sub-bass)
    if (instrument === 'bass') {
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const bassFilter = ctx.createBiquadFilter();
      const bassGain = ctx.createGain();

      osc.type = 'sawtooth';
      subOsc.type = 'sine';

      // Pitch-envelope click for punch
      osc.frequency.setValueAtTime(freq * 1.2, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.025);
      subOsc.frequency.setValueAtTime(freq * 0.5, now);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(320, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.40, now + 0.015);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(bassFilter);
      subOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + duration);
      subOsc.stop(now + duration);
      return;
    }

    // 4. Lush Cinematic Ambient Strings / Pad
    if (instrument === 'strings' || instrument === 'pad') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const padGain = ctx.createGain();
      const padFilter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq * 0.997, now);
      osc2.frequency.setValueAtTime(freq * 1.003, now);

      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(650, now);
      padFilter.frequency.linearRampToValueAtTime(1400, now + duration * 0.4);
      padFilter.frequency.linearRampToValueAtTime(500, now + duration);

      const attack = 0.22;
      const release = 0.40;
      padGain.gain.setValueAtTime(0.0001, now);
      padGain.gain.linearRampToValueAtTime(0.18, now + attack);
      padGain.gain.setValueAtTime(0.18, now + Math.max(attack, duration - release));
      padGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(padFilter);
      osc2.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      return;
    }

    // 5. Default: Grand Concert Piano with Dynamic Hammer Attack
    const oscFundamental = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const pianoGain = ctx.createGain();
    const harmGain = ctx.createGain();
    const pianoFilter = ctx.createBiquadFilter();

    oscFundamental.type = 'sine';
    oscFundamental.frequency.setValueAtTime(freq, now);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);
    harmGain.gain.setValueAtTime(0.25, now);

    pianoFilter.type = 'lowpass';
    pianoFilter.frequency.setValueAtTime(3200, now);
    pianoFilter.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Fast acoustic hammer attack (6ms) + natural exponential piano decay
    pianoGain.gain.setValueAtTime(0.0001, now);
    pianoGain.gain.exponentialRampToValueAtTime(0.38, now + 0.006);
    pianoGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscFundamental.connect(pianoFilter);
    oscHarmonic.connect(harmGain);
    harmGain.connect(pianoFilter);

    pianoFilter.connect(pianoGain);
    pianoGain.connect(destination);

    oscFundamental.start(now);
    oscHarmonic.start(now);
    oscFundamental.stop(now + duration);
    oscHarmonic.stop(now + duration);
  } catch {
    // Graceful catch
  }
}
