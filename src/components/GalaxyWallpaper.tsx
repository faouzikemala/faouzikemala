import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createDotParticleTexture } from '../utils/proceduralTextures';

interface GalaxyWallpaperProps {
  className?: string;
  onSpeedChange?: (speed: number) => void;
}

export const GalaxyWallpaper: React.FC<GalaxyWallpaperProps> = ({
  className = '',
  onSpeedChange
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCameraZ = useRef<number>(18);
  const currentCameraZ = useRef<number>(18);
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.45, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.45, y: 0 });
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010204); // Deep black cosmic void

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 7.5, 18);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const dotTexture = createDotParticleTexture();

    // 4. Galaxy Root Group
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // ==========================================
    // 5. RADIANT SUN IN THE GALAXY CENTER
    // ==========================================
    // Central Sun geometry & material
    const sunGeometry = new THREE.SphereGeometry(0.78, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Brilliant radiant white core
      transparent: true,
      opacity: 0.98
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    galaxyGroup.add(sunMesh);

    // Sun Outer Coronal Atmosphere Sphere (Additive blending glow)
    const coronaGeometry = new THREE.SphereGeometry(1.25, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5f7fb,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
    galaxyGroup.add(coronaMesh);

    // Secondary solar flare glow ring
    const outerCoronaGeometry = new THREE.SphereGeometry(1.85, 32, 32);
    const outerCoronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8e2f0,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const outerCoronaMesh = new THREE.Mesh(outerCoronaGeometry, outerCoronaMaterial);
    galaxyGroup.add(outerCoronaMesh);

    // Central Sun Light Source casting outward
    const sunLight = new THREE.PointLight(0xffffff, 4.0, 45, 1.2);
    sunLight.position.set(0, 0, 0);
    galaxyGroup.add(sunLight);

    // Solar Prominence / Flares (Orbiting fiery particle burst)
    const flareCount = 1200;
    const flareGeometry = new THREE.BufferGeometry();
    const flarePositions = new Float32Array(flareCount * 3);
    const flareColors = new Float32Array(flareCount * 3);

    for (let i = 0; i < flareCount; i++) {
      const idx = i * 3;
      const r = 0.8 + Math.pow(Math.random(), 2) * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      flarePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      flarePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      flarePositions[idx + 2] = r * Math.cos(phi);

      // Bright white-silver solar prominence
      const flareShade = 0.8 + Math.random() * 0.2;
      flareColors[idx] = flareShade;
      flareColors[idx + 1] = flareShade;
      flareColors[idx + 2] = flareShade;
    }

    flareGeometry.setAttribute('position', new THREE.BufferAttribute(flarePositions, 3));
    flareGeometry.setAttribute('color', new THREE.BufferAttribute(flareColors, 3));

    const flareMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const flarePoints = new THREE.Points(flareGeometry, flareMaterial);
    galaxyGroup.add(flarePoints);

    // ==========================================
    // 6. MILKY WAY SPIRAL ARMS
    // ==========================================
    const galaxyParameters = {
      count: 26000,
      size: 0.13,
      radius: 17,
      branches: 4, // 4 primary Milky Way spiral arms
      spin: 1.25,
      randomness: 0.44,
      power: 3.6
    };

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyParameters.count * 3);
    const colors = new Float32Array(galaxyParameters.count * 3);
    const scales = new Float32Array(galaxyParameters.count);

    // Black & White / Silver gradient
    const colorCore = new THREE.Color(0xffffff); // Pure bright white near Sun
    const colorMid = new THREE.Color(0xdce3ed);  // Radiant silver-white
    const colorOuter = new THREE.Color(0x6f778d); // Deep cosmic grey

    for (let i = 0; i < galaxyParameters.count; i++) {
      const idx = i * 3;

      // Distance from center (offset slightly beyond Sun radius)
      const r = 0.9 + Math.random() * (galaxyParameters.radius - 0.9);
      const spinAngle = r * galaxyParameters.spin;
      const branchAngle = ((i % galaxyParameters.branches) / galaxyParameters.branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), galaxyParameters.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * r;
      const randomY = Math.pow(Math.random(), galaxyParameters.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * (r * 0.42);
      const randomZ = Math.pow(Math.random(), galaxyParameters.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * r;

      positions[idx] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[idx + 1] = randomY;
      positions[idx + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color gradation
      const ratio = r / galaxyParameters.radius;
      const mixedColor = ratio < 0.28
        ? colorCore.clone().lerp(colorMid, ratio * 3.5)
        : colorMid.clone().lerp(colorOuter, (ratio - 0.28) * 1.38);

      const brightness = 0.5 + (1 - ratio) * 0.5;
      colors[idx] = mixedColor.r * brightness;
      colors[idx + 1] = mixedColor.g * brightness;
      colors[idx + 2] = mixedColor.b * brightness;

      scales[i] = Math.random() * 0.8 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      size: galaxyParameters.size,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyPoints = new THREE.Points(geometry, material);
    galaxyGroup.add(galaxyPoints);

    // ==========================================
    // 7. BACKGROUND DISTANT DEEP SPACE STARS
    // ==========================================
    const bgCount = 2000;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgCount * 3);
    const bgColors = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
      const idx = i * 3;
      const r = 40 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      bgPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      bgPositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPositions[idx + 2] = r * Math.cos(phi);

      const shade = 0.35 + Math.random() * 0.65;
      bgColors[idx] = shade;
      bgColors[idx + 1] = shade;
      bgColors[idx + 2] = shade;
    }

    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    // ==========================================
    // 8. 3D INTERACTIVE CONTROLS WITH MOUSE & SCROLL
    // ==========================================
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current = { x: normX, y: normY };

      // Tilt the galaxy plane based on cursor position
      targetRotation.current.x = 0.45 + normY * 0.4;
      targetRotation.current.y = normX * 0.6;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Mouse wheel scrolling: Zooms into and travels through the galaxy right to the central Sun!
    const handleWheel = (e: WheelEvent) => {
      const zoomDelta = e.deltaY * 0.015;
      // Allows zooming down to 2.2 right in front of the Sun!
      targetCameraZ.current = Math.min(32, Math.max(2.2, targetCameraZ.current + zoomDelta));

      if (onSpeedChange) {
        onSpeedChange(Math.abs(e.deltaY));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });

    // 9. Animation Loop
    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const elapsedTime = timer.getElapsed();

      // Smooth camera interpolation towards target zoom depth
      currentCameraZ.current = THREE.MathUtils.lerp(currentCameraZ.current, targetCameraZ.current, 0.08);
      const camZ = currentCameraZ.current;

      // Adjust camera altitude proportionally for dynamic 3D angle
      const camY = camZ * 0.42 + mouseRef.current.y * 1.5;
      const camX = mouseRef.current.x * 2.2;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      // Smooth galaxy rotation
      currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 0.05);
      currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 0.05);

      // Autonomous gentle spin of galaxy + mouse orientation
      galaxyGroup.rotation.y = elapsedTime * 0.05 + currentRotation.current.y;
      galaxyGroup.rotation.x = currentRotation.current.x;

      // Breathing pulsation for central Sun corona
      const pulse = 1.0 + Math.sin(elapsedTime * 2.4) * 0.06;
      coronaMesh.scale.set(pulse, pulse, pulse);

      const outerPulse = 1.0 + Math.cos(elapsedTime * 1.8) * 0.08;
      outerCoronaMesh.scale.set(outerPulse, outerPulse, outerPulse);

      // Flare rotation
      flarePoints.rotation.y = -elapsedTime * 0.12;
      flarePoints.rotation.z = elapsedTime * 0.04;

      // Slow drift of background stars
      bgPoints.rotation.y = elapsedTime * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Responsive resize
    const handleResize = () => {
      if (!container || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      timer.dispose();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sunGeometry.dispose();
      sunMaterial.dispose();
      coronaGeometry.dispose();
      coronaMaterial.dispose();
      outerCoronaGeometry.dispose();
      outerCoronaMaterial.dispose();
      flareGeometry.dispose();
      flareMaterial.dispose();
      geometry.dispose();
      material.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
    };
  }, [onSpeedChange]);

  return (
    <div
      ref={mountRef}
      id="milkyway-galaxy-sun-canvas"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};
