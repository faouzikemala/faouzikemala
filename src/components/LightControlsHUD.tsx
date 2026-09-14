import React, { useState } from 'react';
import {
  Sun,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Sliders,
  Compass,
  CircleDot,
  Globe,
  X,
  Palette,
  Layers,
  Wind
} from 'lucide-react';
import { PlanetConfig, LightConfig, ParticleConfig, PlanetTheme } from '../types';

interface LightControlsHUDProps {
  isOpen: boolean;
  onClose: () => void;
  planetConfig: PlanetConfig;
  onUpdatePlanetConfig: (partial: Partial<PlanetConfig>) => void;
  lightConfig: LightConfig;
  onUpdateLightConfig: (partial: Partial<LightConfig>) => void;
  particleConfig: ParticleConfig;
  onUpdateParticleConfig: (partial: Partial<ParticleConfig>) => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

const planetThemes: { id: PlanetTheme; name: string; color: string; desc: string }[] = [
  { id: 'earth', name: 'Terran Earth', color: 'bg-blue-600', desc: 'Oceans, continents & atmosphere' },
  { id: 'cyber', name: 'Neo-Kepler', color: 'bg-purple-600', desc: 'Obsidian crust with cybernetic grid' },
  { id: 'mars', name: 'Ares Prime', color: 'bg-amber-700', desc: 'Oxidized deserts & canyon rifts' },
  { id: 'gasGiant', name: 'Astraea Giant', color: 'bg-yellow-600', desc: 'Atmospheric storm bands & rings' },
  { id: 'iceWorld', name: 'Chronos Frost', color: 'bg-cyan-500', desc: 'Glacial fractures & turquoise rifts' }
];

const sunColorPresets = [
  { label: 'Sol White', color: '#ffffff' },
  { label: 'Golden Sun', color: '#ffd59e' },
  { label: 'Cyan Star', color: '#68e2ff' },
  { label: 'Red Giant', color: '#ff6644' },
  { label: 'Cosmic Violet', color: '#c77dff' }
];

export const LightControlsHUD: React.FC<LightControlsHUDProps> = ({
  isOpen,
  onClose,
  planetConfig,
  onUpdatePlanetConfig,
  lightConfig,
  onUpdateLightConfig,
  particleConfig,
  onUpdateParticleConfig,
  zoomLevel,
  onZoomChange
}) => {
  const [activeTab, setActiveTab] = useState<'lights' | 'zoom' | 'planet' | 'particles'>('lights');

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-20">
        <button
          id="btn-quick-open-controls"
          onClick={() => onClose()} // triggers toggle in parent
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white shadow-2xl backdrop-blur-xl transition group"
        >
          <Sliders className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-mono font-medium">3D Light & Zoom Studio</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="hud-3d-studio-panel"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 w-[calc(100vw-2rem)] sm:w-96 max-h-[85vh] overflow-y-auto bg-slate-950/92 backdrop-blur-2xl border border-slate-800/90 rounded-2xl shadow-2xl p-4 flex flex-col text-slate-100 selection:bg-cyan-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white">3D Lighting & Planet Studio</h2>
        </div>
        <button
          id="btn-close-hud"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          aria-label="Close Studio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-xl my-3 text-xs font-medium">
        <button
          id="tab-lights"
          onClick={() => setActiveTab('lights')}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition ${
            activeTab === 'lights' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          id="tab-zoom"
          onClick={() => setActiveTab('zoom')}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition ${
            activeTab === 'zoom' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Zoom</span>
        </button>
        <button
          id="tab-planet"
          onClick={() => setActiveTab('planet')}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition ${
            activeTab === 'planet' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Planet</span>
        </button>
        <button
          id="tab-particles"
          onClick={() => setActiveTab('particles')}
          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition ${
            activeTab === 'particles' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stream</span>
        </button>
      </div>

      {/* Tab 1: Light Controls */}
      {activeTab === 'lights' && (
        <div className="space-y-4 text-xs">
          {/* Sun Orbital Angle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Sun Orbit Angle
              </span>
              <span className="text-cyan-400 font-bold">{Math.round(lightConfig.sunAngle)}°</span>
            </div>
            <input
              id="slider-sun-angle"
              type="range"
              min="0"
              max="360"
              value={lightConfig.sunAngle}
              onChange={(e) => onUpdateLightConfig({ sunAngle: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0° Dawn</span>
              <span>90° Noon</span>
              <span>180° Dusk</span>
              <span>270° Eclipse</span>
            </div>
          </div>

          {/* Sun Elevation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300 font-mono">
              <span>Sun Elevation (Latitude)</span>
              <span className="text-cyan-400 font-bold">{Math.round(lightConfig.sunElevation)}°</span>
            </div>
            <input
              id="slider-sun-elevation"
              type="range"
              min="-60"
              max="60"
              value={lightConfig.sunElevation}
              onChange={(e) => onUpdateLightConfig({ sunElevation: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Sun Intensity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Direct Sunlight Intensity
              </span>
              <span className="text-cyan-400 font-bold">{lightConfig.sunIntensity.toFixed(1)}x</span>
            </div>
            <input
              id="slider-sun-intensity"
              type="range"
              min="0.4"
              max="3.5"
              step="0.1"
              value={lightConfig.sunIntensity}
              onChange={(e) => onUpdateLightConfig({ sunIntensity: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Sun Color Presets */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-mono flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              Sunlight Color Spectrum
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {sunColorPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => onUpdateLightConfig({ sunColor: preset.color })}
                  title={preset.label}
                  className={`h-7 rounded-lg flex items-center justify-center border transition ${
                    lightConfig.sunColor.toLowerCase() === preset.color.toLowerCase()
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
            </div>
          </div>

          {/* Ambient Lighting */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-slate-300 font-mono">
              <span>Deep Space Ambient Glow</span>
              <span className="text-cyan-400 font-bold">{lightConfig.ambientIntensity.toFixed(2)}</span>
            </div>
            <input
              id="slider-ambient-intensity"
              type="range"
              min="0.05"
              max="0.9"
              step="0.05"
              value={lightConfig.ambientIntensity}
              onChange={(e) => onUpdateLightConfig({ ambientIntensity: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Zoom Controls */}
      {activeTab === 'zoom' && (
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                Interactive Camera Distance
              </span>
              <span className="text-cyan-400 font-bold">{Math.round(zoomLevel)}%</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-zoom-in-step"
                onClick={() => onZoomChange(Math.max(0, zoomLevel - 15))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
                title="Zoom In (Closer Orbit)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <input
                id="slider-interactive-zoom"
                type="range"
                min="0"
                max="100"
                value={zoomLevel}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />

              <button
                id="btn-zoom-out-step"
                onClick={() => onZoomChange(Math.min(100, zoomLevel + 15))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
                title="Zoom Out (Deep Space)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Close Orbit (Surface)</span>
              <span>Deep Galaxy</span>
            </div>
          </div>

          {/* Quick Zoom Presets */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-mono">Preset Camera Views</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-preset-close"
                onClick={() => onZoomChange(10)}
                className={`py-2 px-2.5 rounded-lg border text-center transition font-mono ${
                  zoomLevel <= 25 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                Atmosphere (10%)
              </button>
              <button
                id="btn-preset-standard"
                onClick={() => onZoomChange(38)}
                className={`py-2 px-2.5 rounded-lg border text-center transition font-mono ${
                  zoomLevel > 25 && zoomLevel < 65 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                Standard (38%)
              </button>
              <button
                id="btn-preset-far"
                onClick={() => onZoomChange(85)}
                className={`py-2 px-2.5 rounded-lg border text-center transition font-mono ${
                  zoomLevel >= 65 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                Cosmos (85%)
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
            💡 Tip: You can also use your <strong className="text-slate-200">mouse wheel</strong> or trackpad pinch anywhere on screen to smoothly zoom in and out.
          </div>
        </div>
      )}

      {/* Tab 3: Planet Switcher & Rotation */}
      {activeTab === 'planet' && (
        <div className="space-y-4 text-xs">
          {/* Planet Theme Picker */}
          <div className="space-y-2">
            <label className="text-slate-300 font-mono flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Select Planetary Body
            </label>
            <div className="space-y-1.5">
              {planetThemes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onUpdatePlanetConfig({
                      theme: item.id,
                      hasRings: item.id === 'gasGiant',
                      atmosphereColor:
                        item.id === 'earth' ? '#4fc3f7' :
                        item.id === 'cyber' ? '#d946ef' :
                        item.id === 'mars' ? '#f97316' :
                        item.id === 'iceWorld' ? '#22d3ee' : '#fbbf24'
                    });
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition ${
                    planetConfig.theme === item.id
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-lg'
                      : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${item.color} shadow-sm`} />
                    <div>
                      <div className="font-semibold text-xs text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
                    </div>
                  </div>
                  {planetConfig.theme === item.id && (
                    <CircleDot className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation Toggle & Speed */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-mono flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                Axial Rotation
              </span>
              <button
                id="btn-toggle-autorotate"
                onClick={() => onUpdatePlanetConfig({ autoRotate: !planetConfig.autoRotate })}
                className={`px-3 py-1 rounded-full font-mono text-[11px] transition ${
                  planetConfig.autoRotate ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {planetConfig.autoRotate ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                <span>Rotation Velocity</span>
                <span>{planetConfig.rotationSpeed.toFixed(2)}x</span>
              </div>
              <input
                id="slider-rotation-speed"
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={planetConfig.rotationSpeed}
                onChange={(e) => onUpdatePlanetConfig({ rotationSpeed: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            {/* Atmosphere & Rings Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="btn-toggle-atmosphere"
                onClick={() => onUpdatePlanetConfig({ showAtmosphere: !planetConfig.showAtmosphere })}
                className={`py-1.5 px-2 rounded-lg border text-xs font-mono transition ${
                  planetConfig.showAtmosphere ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Atmosphere: {planetConfig.showAtmosphere ? 'ON' : 'OFF'}
              </button>
              <button
                id="btn-toggle-rings"
                onClick={() => onUpdatePlanetConfig({ hasRings: !planetConfig.hasRings })}
                className={`py-1.5 px-2 rounded-lg border text-xs font-mono transition ${
                  planetConfig.hasRings ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Rings: {planetConfig.hasRings ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Particles & Dynamic Dots Streaming */}
      {activeTab === 'particles' && (
        <div className="space-y-4 text-xs">
          {/* Warp Stream Toggle */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Hyperdrive Warp Stream
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Accelerates dots & particle streaming in 3D depth
              </div>
            </div>
            <button
              id="btn-toggle-warp"
              onClick={() => onUpdateParticleConfig({ streamWarp: !particleConfig.streamWarp })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shadow ${
                particleConfig.streamWarp
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {particleConfig.streamWarp ? 'WARP ON' : 'NORMAL'}
            </button>
          </div>

          {/* Particle Stream Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Dynamic Dot Stream Velocity
              </span>
              <span className="text-cyan-400 font-bold">{particleConfig.particleSpeed.toFixed(1)}x</span>
            </div>
            <input
              id="slider-particle-speed"
              type="range"
              min="0.2"
              max="3.5"
              step="0.1"
              value={particleConfig.particleSpeed}
              onChange={(e) => onUpdateParticleConfig({ particleSpeed: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
            ✨ Dots and cosmic dust dynamically stream through deep space. Scrolling the page or spinning the planet boosts particle flow speed in real-time.
          </div>
        </div>
      )}
    </div>
  );
};
