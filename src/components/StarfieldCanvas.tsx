import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createDotParticleTexture } from '../utils/proceduralTextures';

interface StarfieldCanvasProps {
  onScrollBoost?: (speed: number) => void;
  className?: string;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({
  onScrollBoost,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References
  const dynamicParticlesRef = useRef<THREE.Points | null>(null);
  const deepStarsRef = useRef<THREE.Points | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const scrollVelocityRef = useRef<number>(1.0);
  const targetVelocityRef = useRef<number>(1.0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const dotTexture = createDotParticleTexture();

    // 4. Fixed Deep Starfield (3,000 twinkling background stars)
    const starCount = 3200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const r = 30 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = r * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.65) {
        starColors[idx] = 0.38;
        starColors[idx + 1] = 0.82;
        starColors[idx + 2] = 1.0; // Cyan tint
      } else if (tint > 0.35) {
        starColors[idx] = 1.0;
        starColors[idx + 1] = 0.88;
        starColors[idx + 2] = 0.65; // Warm gold
      } else {
        starColors[idx] = 0.95;
        starColors[idx + 1] = 0.98;
        starColors[idx + 2] = 1.0; // Pure white
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const deepStars = new THREE.Points(starGeometry, starMaterial);
    scene.add(deepStars);
    deepStarsRef.current = deepStars;

    // 5. Dynamic Streaming Particles & Cosmic Dots ("scromming" stars in space)
    const streamCount = 2200;
    const streamGeometry = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(streamCount * 3);
    const streamVelocities = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);

    for (let i = 0; i < streamCount; i++) {
      const idx = i * 3;
      streamPositions[idx] = (Math.random() - 0.5) * 32;
      streamPositions[idx + 1] = (Math.random() - 0.5) * 22;
      streamPositions[idx + 2] = (Math.random() - 0.5) * 45;

      // Drift velocity towards camera
      streamVelocities[idx] = (Math.random() - 0.5) * 0.015;
      streamVelocities[idx + 1] = (Math.random() - 0.5) * 0.015;
      streamVelocities[idx + 2] = 0.04 + Math.random() * 0.09; // Speed towards viewer

      const colorTint = Math.random();
      if (colorTint > 0.6) {
        streamColors[idx] = 0.2;
        streamColors[idx + 1] = 0.85;
        streamColors[idx + 2] = 1.0; // Cyber Cyan
      } else if (colorTint > 0.3) {
        streamColors[idx] = 0.6;
        streamColors[idx + 1] = 0.45;
        streamColors[idx + 2] = 1.0; // Violet
      } else {
        streamColors[idx] = 1.0;
        streamColors[idx + 1] = 0.95;
        streamColors[idx + 2] = 1.0; // Starlight white
      }
    }
    streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    streamGeometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));

    const streamMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dynamicParticles = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(dynamicParticles);
    dynamicParticlesRef.current = dynamicParticles;

    // 6. Mouse movement parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Dynamic Wheel Scrolling (Streams stars faster as user scrolls!)
    const handleWheel = (e: WheelEvent) => {
      const scrollForce = Math.abs(e.deltaY) * 0.012;
      targetVelocityRef.current = Math.min(8.0, targetVelocityRef.current + scrollForce);
      if (onScrollBoost) {
        onScrollBoost(targetVelocityRef.current);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });

    // 8. Animation Loop
    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const delta = timer.getDelta();
      const elapsedTime = timer.getElapsed();

      // Smooth decay of scroll boost back to baseline speed (1.0)
      targetVelocityRef.current = THREE.MathUtils.lerp(targetVelocityRef.current, 1.0, 0.04);
      scrollVelocityRef.current = THREE.MathUtils.lerp(scrollVelocityRef.current, targetVelocityRef.current, 0.1);

      // Camera subtle parallax tracking
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 0.8, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseRef.current.y * 0.5, 0.05);
      camera.lookAt(0, 0, 0);

      // Rotate deep starfield slowly
      if (deepStarsRef.current) {
        deepStarsRef.current.rotation.y = elapsedTime * 0.005;
        deepStarsRef.current.rotation.x = Math.sin(elapsedTime * 0.003) * 0.02;
      }

      // Stream particles towards the camera ("scromming" stars effect)
      if (dynamicParticlesRef.current) {
        const positions = dynamicParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;
        const currentSpeed = scrollVelocityRef.current;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const vz = streamVelocities[idx + 2] * currentSpeed;
          positions[idx + 2] += vz;

          // Gentle cosmic drift
          positions[idx] += Math.sin(elapsedTime * 0.6 + i) * 0.002;
          positions[idx + 1] += Math.cos(elapsedTime * 0.6 + i) * 0.002;

          // When particle passes beyond the camera, loop it back to deep space
          if (positions[idx + 2] > camera.position.z + 2) {
            positions[idx + 2] = -35;
            positions[idx] = (Math.random() - 0.5) * 32;
            positions[idx + 1] = (Math.random() - 0.5) * 22;
          }
        }
        dynamicParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
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
    };
  }, [onScrollBoost]);

  return (
    <div
      ref={mountRef}
      id="starfield-canvas-container"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};
