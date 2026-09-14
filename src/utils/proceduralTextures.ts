import * as THREE from 'three';
import { PlanetTheme } from '../types';

// Simple procedural noise helper for textures
function pseudoNoise(x: number, y: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, scale: number, seed: number = 42): number {
  const nx = x / scale;
  const ny = y / scale;
  const i = Math.floor(nx);
  const j = Math.floor(ny);
  const fx = nx - i;
  const fy = ny - j;

  // Bilinear interpolation of pseudo noise
  const a = pseudoNoise(i, j, seed);
  const b = pseudoNoise(i + 1, j, seed);
  const c = pseudoNoise(i, j + 1, seed);
  const d = pseudoNoise(i + 1, j + 1, seed);

  // Smoothstep
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
}

function octaveNoise(x: number, y: number, octaves: number = 4, persistence: number = 0.5, scale: number = 80, seed: number = 42): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += smoothNoise(x * frequency, y * frequency, scale, seed + i * 17) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return total / maxValue;
}

/**
 * Creates procedural texture canvas for different planet themes
 */
export function createPlanetTexture(theme: PlanetTheme): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = (y / height) * Math.PI - Math.PI / 2;
    const polarFactor = Math.abs(Math.sin(lat)); // 0 at equator, 1 at poles

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const n = octaveNoise(x, y, 5, 0.5, 90, 101);
      const nDetail = octaveNoise(x, y, 3, 0.6, 25, 233);

      if (theme === 'earth') {
        // Oceans, continents, ice caps, vegetation
        if (polarFactor > 0.85 || (polarFactor > 0.75 && n > 0.45)) {
          // Polar Ice caps
          data[idx] = 240 + Math.floor(nDetail * 15);
          data[idx + 1] = 248 + Math.floor(nDetail * 7);
          data[idx + 2] = 255;
        } else if (n > 0.52) {
          // Landmass
          const elev = (n - 0.52) / 0.48;
          if (elev > 0.6) {
            // High mountain peaks
            data[idx] = 160 + Math.floor(elev * 60);
            data[idx + 1] = 150 + Math.floor(elev * 50);
            data[idx + 2] = 135 + Math.floor(elev * 40);
          } else if (elev > 0.25) {
            // Highlands / Steppe / Deserts
            data[idx] = 180 + Math.floor(nDetail * 30);
            data[idx + 1] = 160 + Math.floor(nDetail * 20);
            data[idx + 2] = 95 + Math.floor(nDetail * 20);
          } else {
            // Forests / Plains
            data[idx] = 34 + Math.floor(nDetail * 25);
            data[idx + 1] = 120 + Math.floor(nDetail * 40);
            data[idx + 2] = 50 + Math.floor(nDetail * 20);
          }
        } else if (n > 0.49) {
          // Shallow coast / beaches
          data[idx] = 35 + Math.floor(nDetail * 20);
          data[idx + 1] = 140 + Math.floor(nDetail * 30);
          data[idx + 2] = 180 + Math.floor(nDetail * 40);
        } else {
          // Deep Ocean
          const depth = (0.49 - n) / 0.49;
          data[idx] = Math.floor(10 * (1 - depth));
          data[idx + 1] = Math.floor(35 + 25 * (1 - depth));
          data[idx + 2] = Math.floor(85 + 65 * (1 - depth));
        }
      } else if (theme === 'cyber') {
        // Neo Cyber Kepler: Obsidian terrain with glowing cybernetic grid veins
        const gridX = (x % 32 < 2 || (x + y) % 64 < 2) ? 1 : 0;
        const gridY = (y % 32 < 2) ? 1 : 0;
        const isGrid = gridX || gridY;

        if (isGrid && n > 0.4) {
          // Glowing cyber circuit lines (cyan & magenta)
          const cyanOrPink = (x + y) % 128 < 64;
          if (cyanOrPink) {
            data[idx] = 10;
            data[idx + 1] = 230;
            data[idx + 2] = 255;
          } else {
            data[idx] = 255;
            data[idx + 1] = 30;
            data[idx + 2] = 200;
          }
        } else if (n > 0.55) {
          // Metallic alloy continent plates
          data[idx] = 24 + Math.floor(nDetail * 30);
          data[idx + 1] = 32 + Math.floor(nDetail * 40);
          data[idx + 2] = 48 + Math.floor(nDetail * 50);
        } else {
          // Dark obsidian liquid basins
          data[idx] = 8;
          data[idx + 1] = 12;
          data[idx + 2] = 24;
        }
      } else if (theme === 'mars') {
        // Red oxidized sands, canyons, volcanic basalt
        if (polarFactor > 0.9) {
          // CO2 polar dry ice
          data[idx] = 230;
          data[idx + 1] = 220;
          data[idx + 2] = 225;
        } else if (n > 0.6) {
          // Dark volcanic ridges
          data[idx] = 130 + Math.floor(nDetail * 20);
          data[idx + 1] = 50 + Math.floor(nDetail * 15);
          data[idx + 2] = 35 + Math.floor(nDetail * 10);
        } else if (n > 0.35) {
          // Rust orange dunes
          data[idx] = 200 + Math.floor(nDetail * 40);
          data[idx + 1] = 85 + Math.floor(nDetail * 25);
          data[idx + 2] = 45 + Math.floor(nDetail * 20);
        } else {
          // Deep ochre lowlands
          data[idx] = 160 + Math.floor(nDetail * 30);
          data[idx + 1] = 60 + Math.floor(nDetail * 20);
          data[idx + 2] = 30 + Math.floor(nDetail * 15);
        }
      } else if (theme === 'gasGiant') {
        // Swirling atmospheric bands with Jupiter-like storm eddies
        const band = Math.sin(y * 0.08 + n * 3.5);
        const storm = Math.sin(x * 0.04 + y * 0.04 + nDetail * 4);
        const blended = (band + storm * 0.4 + 1.4) / 2.8;

        data[idx] = Math.floor(210 * blended + 35);
        data[idx + 1] = Math.floor(140 * blended + 30);
        data[idx + 2] = Math.floor(80 * blended + 40);
      } else if (theme === 'iceWorld') {
        // Frozen oceans, turquoise subsurface water, crystalline glaciers
        if (n > 0.58) {
          // Crystalline elevated ridges
          data[idx] = 225 + Math.floor(nDetail * 30);
          data[idx + 1] = 245 + Math.floor(nDetail * 10);
          data[idx + 2] = 255;
        } else if (n > 0.38) {
          // Glacial ice sheets
          data[idx] = 150 + Math.floor(nDetail * 40);
          data[idx + 1] = 210 + Math.floor(nDetail * 30);
          data[idx + 2] = 240 + Math.floor(nDetail * 15);
        } else {
          // Deep frozen turquoise rift
          data[idx] = 40 + Math.floor(nDetail * 20);
          data[idx + 1] = 130 + Math.floor(nDetail * 40);
          data[idx + 2] = 190 + Math.floor(nDetail * 50);
        }
      }

      data[idx + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates dynamic procedural cloud texture
 */
export function createCloudTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const n = octaveNoise(x, y, 4, 0.55, 60, 555);

      if (n > 0.48) {
        const cloudDensity = (n - 0.48) / 0.52;
        const alpha = Math.min(240, Math.floor(cloudDensity * 220));
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = alpha;
      } else {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates procedural planetary rings texture (radial gradient with Cassini-like gaps)
 */
export function createRingsTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, 'rgba(215, 175, 120, 0)');
  grad.addColorStop(0.12, 'rgba(235, 195, 135, 0.5)');
  grad.addColorStop(0.28, 'rgba(200, 160, 110, 0.7)');
  grad.addColorStop(0.38, 'rgba(40, 30, 20, 0.05)'); // Gap
  grad.addColorStop(0.44, 'rgba(225, 185, 130, 0.65)');
  grad.addColorStop(0.68, 'rgba(190, 150, 100, 0.8)');
  grad.addColorStop(0.72, 'rgba(30, 20, 15, 0.02)'); // Cassini division
  grad.addColorStop(0.78, 'rgba(210, 175, 125, 0.6)');
  grad.addColorStop(0.95, 'rgba(175, 135, 95, 0.3)');
  grad.addColorStop(1, 'rgba(150, 115, 75, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates soft glowing particle dot texture with radial falloff
 */
export function createDotParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(230, 245, 255, 0.85)');
  grad.addColorStop(0.5, 'rgba(100, 200, 255, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
