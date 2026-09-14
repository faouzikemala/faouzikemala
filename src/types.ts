export type PlanetTheme = 'earth' | 'cyber' | 'mars' | 'gasGiant' | 'iceWorld';

export type DynamicFontChoice = 'orbitron' | 'syne' | 'cinzel' | 'space' | 'glitch';

export interface PlanetConfig {
  theme: PlanetTheme;
  rotationSpeed: number;
  autoRotate: boolean;
  cloudSpeed: number;
  showAtmosphere: boolean;
  atmosphereColor: string;
  hasRings: boolean;
  ringsColor: string;
}

export interface LightConfig {
  sunAngle: number; // 0 - 360 in degrees
  sunElevation: number; // -60 to 60 in degrees
  sunIntensity: number; // 0.2 to 3.5
  sunColor: string; // hex
  ambientIntensity: number; // 0.05 to 1.0
  ambientColor: string; // hex
  pointLightBoost: boolean;
}

export interface ParticleConfig {
  particleSpeed: number; // 0.1 to 5.0
  particleCount: number; // 500 to 4000
  streamWarp: boolean;
  streamDirection: 'towards' | 'away' | 'orbit';
  particleColorMode: 'cosmic' | 'cyan' | 'golden' | 'neon';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  stars?: number;
  featured?: boolean;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  github: string;
  githubUsername: string;
  linkedin?: string;
  location: string;
  status: string;
  bio: string[];
  stats: {
    label: string;
    value: string;
    subtext: string;
  }[];
  skills: {
    category: string;
    items: { name: string; level: number; highlight?: boolean }[];
  }[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  education: {
    degree: string;
    institution: string;
    year: string;
    details: string;
  }[];
}
