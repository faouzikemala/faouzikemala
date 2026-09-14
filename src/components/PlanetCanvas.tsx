import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PlanetConfig, LightConfig, ParticleConfig } from '../types';
import {
  createPlanetTexture,
  createCloudTexture,
  createRingsTexture,
  createDotParticleTexture
} from '../utils/proceduralTextures';

interface PlanetCanvasProps {
  planetConfig: PlanetConfig;
  lightConfig: LightConfig;
  particleConfig: ParticleConfig;
  zoomLevel: number; // 0 (closest) to 100 (furthest)
  onZoomChange: (newZoom: number) => void;
  isControlsOpen?: boolean;
}

export const PlanetCanvas: React.FC<PlanetCanvasProps> = ({
  planetConfig,
  lightConfig,
  particleConfig,
  zoomLevel,
  onZoomChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep Three.js entities updated without recreating scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const ringsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunGizmoRef = useRef<THREE.Group | null>(null);
  const dynamicParticlesRef = useRef<THREE.Points | null>(null);
  const starFieldRef = useRef<THREE.Points | null>(null);

  // Interaction refs
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0.002 });
  const targetCameraDistanceRef = useRef<number>(5.5);
  const currentCameraDistanceRef = useRef<number>(5.5);
  const scrollSpeedBoostRef = useRef<number>(1.0);
  const scrollDecayTimerRef = useRef<number | null>(null);

  // Sync zoomLevel (0 to 100) with camera distance (2.2 to 14.0)
  useEffect(() => {
    // 0 -> 2.4 (orbit close-up), 100 -> 13.5 (deep space)
    const minDistance = 2.4;
    const maxDistance = 13.5;
    targetCameraDistanceRef.current = minDistance + (zoomLevel / 100) * (maxDistance - minDistance);
  }, [zoomLevel]);

  // Handle Wheel Zooming directly on canvas
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom sensitivity
    const delta = e.deltaY * 0.05;
    const currentZoom = zoomLevel;
    const nextZoom = Math.max(0, Math.min(100, currentZoom + delta));
    onZoomChange(nextZoom);

    // Dynamic particle streaming speed reaction to scrolling!
    scrollSpeedBoostRef.current = Math.min(3.8, scrollSpeedBoostRef.current + Math.abs(e.deltaY) * 0.005);
    if (scrollDecayTimerRef.current) {
      window.clearTimeout(scrollDecayTimerRef.current);
    }
    scrollDecayTimerRef.current = window.setTimeout(() => {
      scrollSpeedBoostRef.current = 1.0;
    }, 450);
  };

  // Pointer drag for manual planet rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !planetMeshRef.current) return;

    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;

    prevPointerRef.current = { x: e.clientX, y: e.clientY };

    // Apply manual rotation to planet and clouds
    const sensitivity = 0.006;
    planetMeshRef.current.rotation.y += deltaX * sensitivity;
    planetMeshRef.current.rotation.x += deltaY * sensitivity;

    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += deltaX * sensitivity;
      cloudsMeshRef.current.rotation.x += deltaY * sensitivity;
    }
    if (ringsMeshRef.current) {
      ringsMeshRef.current.rotation.z += deltaX * sensitivity * 0.5;
    }

    rotationVelocityRef.current = {
      x: deltaY * sensitivity * 0.2,
      y: deltaX * sensitivity * 0.2
    };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Main Three.js setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 5.5);
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
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Planet Object
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Planet Sphere Geometry
    const planetRadius = 1.6;
    const planetGeometry = new THREE.SphereGeometry(planetRadius, 64, 64);
    const planetTexture = createPlanetTexture(planetConfig.theme);

    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.72,
      metalness: 0.15,
      bumpScale: 0.04
    });

    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(planetMesh);
    planetMeshRef.current = planetMesh;

    // Cloud Sphere Geometry (slightly larger than planet)
    const cloudGeometry = new THREE.SphereGeometry(planetRadius * 1.018, 48, 48);
    const cloudTexture = createCloudTexture();
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      roughness: 0.9,
      depthWrite: false
    });
    const cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    planetGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // Atmosphere Rayleigh Glow Shader Sphere
    const atmosphereGeometry = new THREE.SphereGeometry(planetRadius * 1.15, 48, 48);
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      uniform vec3 color;
      uniform float intensity;
      void main() {
        float fresnel = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
        gl_FragColor = vec4(color, fresnel * intensity);
      }
    `;
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        color: { value: new THREE.Color(planetConfig.atmosphereColor) },
        intensity: { value: 1.1 }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planetGroup.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // Rings (for gas giant or toggle)
    const ringsGeometry = new THREE.RingGeometry(planetRadius * 1.45, planetRadius * 2.5, 64);
    // Rotate ring so it sits on equatorial plane
    ringsGeometry.rotateX(Math.PI / 2);
    const ringsTexture = createRingsTexture();
    const ringsMaterial = new THREE.MeshStandardMaterial({
      map: ringsTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: planetConfig.hasRings ? 0.92 : 0.0,
      roughness: 0.8
    });
    const ringsMesh = new THREE.Mesh(ringsGeometry, ringsMaterial);
    ringsMesh.rotation.x = 0.35; // Ring tilt
    ringsMesh.rotation.y = 0.15;
    planetGroup.add(ringsMesh);
    ringsMeshRef.current = ringsMesh;

    // 5. Lights
    // Directional Sun Light
    const sunLight = new THREE.DirectionalLight(lightConfig.sunColor, lightConfig.sunIntensity);
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Ambient Space Light
    const ambientLight = new THREE.AmbientLight(lightConfig.ambientColor, lightConfig.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Distant Visual Sun Corona Gizmo (shows where sunlight is coming from in space)
    const sunGizmo = new THREE.Group();
    const sunCoreGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: lightConfig.sunColor });
    const sunCoreMesh = new THREE.Mesh(sunCoreGeom, sunCoreMat);
    sunGizmo.add(sunCoreMesh);

    // Glowing Sun Flare
    const flareGeom = new THREE.PlaneGeometry(2.4, 2.4);
    const dotTexture = createDotParticleTexture();
    const flareMat = new THREE.MeshBasicMaterial({
      map: dotTexture,
      color: lightConfig.sunColor,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const flareMesh = new THREE.Mesh(flareGeom, flareMat);
    sunGizmo.add(flareMesh);
    scene.add(sunGizmo);
    sunGizmoRef.current = sunGizmo;

    // 6. Multi-tier Particle & Starfield System
    // Tier 1: Fixed twinkling deep background stars
    const starCount = 2400;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      // Distribute evenly in wide spherical shell
      const r = 25 + Math.random() * 65;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = r * Math.cos(phi);

      // Star temperature tint (cyan-blue, white, warm yellow)
      const tintChoice = Math.random();
      if (tintChoice > 0.7) {
        starColors[idx] = 0.75;
        starColors[idx + 1] = 0.88;
        starColors[idx + 2] = 1.0; // Blue-white
      } else if (tintChoice > 0.4) {
        starColors[idx] = 1.0;
        starColors[idx + 1] = 0.94;
        starColors[idx + 2] = 0.82; // Warm yellow
      } else {
        starColors[idx] = 0.95;
        starColors[idx + 1] = 0.97;
        starColors[idx + 2] = 1.0; // Crisp White
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.14,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    starFieldRef.current = starField;

    // Tier 2: Dynamic Streaming Particles & Cosmic Dots ("scromming" dots in space)
    const streamCount = particleConfig.particleCount || 1600;
    const streamGeometry = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(streamCount * 3);
    const streamVelocities = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);

    for (let i = 0; i < streamCount; i++) {
      const idx = i * 3;
      // Spread in a cylindrical / conical volume surrounding the camera path
      streamPositions[idx] = (Math.random() - 0.5) * 24;
      streamPositions[idx + 1] = (Math.random() - 0.5) * 16;
      streamPositions[idx + 2] = (Math.random() - 0.5) * 35;

      // Dynamic stream velocity (drifting past towards camera or circulating)
      streamVelocities[idx] = (Math.random() - 0.5) * 0.01;
      streamVelocities[idx + 1] = (Math.random() - 0.5) * 0.01;
      streamVelocities[idx + 2] = 0.025 + Math.random() * 0.06; // Towards camera

      // Dot color (cyan/violet/emerald cosmic palette)
      const colorRandom = Math.random();
      if (colorRandom > 0.5) {
        streamColors[idx] = 0.2;
        streamColors[idx + 1] = 0.85;
        streamColors[idx + 2] = 1.0; // Bright cyan
      } else if (colorRandom > 0.25) {
        streamColors[idx] = 0.65;
        streamColors[idx + 1] = 0.4;
        streamColors[idx + 2] = 1.0; // Violet
      } else {
        streamColors[idx] = 1.0;
        streamColors[idx + 1] = 0.7;
        streamColors[idx + 2] = 0.3; // Amber gold
      }
    }
    streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    streamGeometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));

    const streamMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dynamicParticles = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(dynamicParticles);
    dynamicParticlesRef.current = dynamicParticles;

    // 7. Animation Loop
    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const delta = timer.getDelta();
      const elapsedTime = timer.getElapsed();

      // Smooth Camera Zoom Interpolation (lerp)
      currentCameraDistanceRef.current = THREE.MathUtils.lerp(
        currentCameraDistanceRef.current,
        targetCameraDistanceRef.current,
        0.08
      );
      camera.position.z = currentCameraDistanceRef.current;

      // Rotate planet with auto-rotate & manual drag inertia
      if (planetMeshRef.current) {
        if (!isDraggingRef.current) {
          if (planetConfig.autoRotate) {
            planetMeshRef.current.rotation.y += planetConfig.rotationSpeed * delta * 0.5;
          }
          // Apply residual inertia decay
          planetMeshRef.current.rotation.y += rotationVelocityRef.current.y;
          planetMeshRef.current.rotation.x += rotationVelocityRef.current.x;
          rotationVelocityRef.current.x *= 0.95;
          rotationVelocityRef.current.y *= 0.95;
        }
      }

      // Clouds rotate at slightly faster or independent speed
      if (cloudsMeshRef.current) {
        if (planetConfig.autoRotate) {
          cloudsMeshRef.current.rotation.y += (planetConfig.rotationSpeed + planetConfig.cloudSpeed) * delta * 0.5;
        }
      }

      // Starfield subtle slow cosmic rotation
      if (starFieldRef.current) {
        starFieldRef.current.rotation.y = elapsedTime * 0.003;
        starFieldRef.current.rotation.x = Math.sin(elapsedTime * 0.002) * 0.02;
      }

      // Sun flare always faces camera
      if (sunGizmoRef.current && cameraRef.current) {
        sunGizmoRef.current.children[1]?.lookAt(cameraRef.current.position);
      }

      // Dynamic Particle Streaming update ("scromming" flow effect)
      if (dynamicParticlesRef.current) {
        const positions = dynamicParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;
        const speedMultiplier = particleConfig.particleSpeed * scrollSpeedBoostRef.current * (particleConfig.streamWarp ? 2.8 : 1.0);

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const vz = streamVelocities[idx + 2] * speedMultiplier;
          positions[idx + 2] += vz;

          // Subtle sideways oscillation
          positions[idx] += Math.sin(elapsedTime * 0.5 + i) * 0.003;
          positions[idx + 1] += Math.cos(elapsedTime * 0.5 + i) * 0.003;

          // Recycle particle when it passes behind camera
          if (positions[idx + 2] > camera.position.z + 2) {
            positions[idx + 2] = -22;
            positions[idx] = (Math.random() - 0.5) * 22;
            positions[idx + 1] = (Math.random() - 0.5) * 15;
          }
        }
        dynamicParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Observer for fluid responsiveness
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      timer.dispose();
      resizeObserver.disconnect();
      if (scrollDecayTimerRef.current) {
        window.clearTimeout(scrollDecayTimerRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Planet Texture and Materials when theme changes
  useEffect(() => {
    if (!planetMeshRef.current || !cloudsMeshRef.current || !ringsMeshRef.current || !atmosphereMeshRef.current) return;

    // Update planet texture
    const newPlanetTexture = createPlanetTexture(planetConfig.theme);
    const material = planetMeshRef.current.material as THREE.MeshStandardMaterial;
    if (material.map) material.map.dispose();
    material.map = newPlanetTexture;
    material.needsUpdate = true;

    // Atmosphere color
    const atmoMat = atmosphereMeshRef.current.material as THREE.ShaderMaterial;
    atmoMat.uniforms.color.value = new THREE.Color(planetConfig.atmosphereColor);
    atmosphereMeshRef.current.visible = planetConfig.showAtmosphere;

    // Rings visibility
    const ringsMat = ringsMeshRef.current.material as THREE.MeshStandardMaterial;
    ringsMat.opacity = planetConfig.hasRings ? 0.92 : 0.0;
    ringsMeshRef.current.visible = planetConfig.hasRings;

    // For Gas Giant, clouds might be subdued or integrated into texture
    cloudsMeshRef.current.visible = planetConfig.theme !== 'gasGiant';
  }, [planetConfig.theme, planetConfig.atmosphereColor, planetConfig.showAtmosphere, planetConfig.hasRings]);

  // Update Lights and Sun Position when lightConfig changes
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !sunGizmoRef.current) return;

    // Calculate 3D position from spherical coordinates (sunAngle, sunElevation)
    const radius = 18; // Distance of sun in space
    const radAngle = (lightConfig.sunAngle * Math.PI) / 180;
    const radElevation = (lightConfig.sunElevation * Math.PI) / 180;

    const x = radius * Math.cos(radElevation) * Math.sin(radAngle);
    const y = radius * Math.sin(radElevation);
    const z = radius * Math.cos(radElevation) * Math.cos(radAngle);

    // Directional Sun Light
    sunLightRef.current.position.set(x, y, z);
    sunLightRef.current.intensity = lightConfig.sunIntensity;
    sunLightRef.current.color.set(lightConfig.sunColor);

    // Sun Gizmo in space
    sunGizmoRef.current.position.set(x, y, z);
    const coreMat = (sunGizmoRef.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
    coreMat.color.set(lightConfig.sunColor);
    const flareMat = (sunGizmoRef.current.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;
    flareMat.color.set(lightConfig.sunColor);

    // Ambient Space Light
    ambientLightRef.current.intensity = lightConfig.ambientIntensity;
    ambientLightRef.current.color.set(lightConfig.ambientColor);
  }, [lightConfig]);

  // Update Particle settings
  useEffect(() => {
    if (!dynamicParticlesRef.current) return;
    const mat = dynamicParticlesRef.current.material as THREE.PointsMaterial;
    mat.size = particleConfig.streamWarp ? 0.28 : 0.18;
  }, [particleConfig.streamWarp]);

  return (
    <div
      ref={mountRef}
      id="canvas-3d-container"
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
};
