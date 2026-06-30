import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * EmberCore3D - A highly premium, interactive 3D model representing the themes of the Origin page:
 * 1. The Pulse of Cognition (a morphing biomorphic core that acts as a beating digital heart).
 * 2. The Imagined Sea of Numbers (a waving particle grid at the base, morphing between warm gold and cool teal).
 * 3. Sovereign Pollen / Spore Swarm (a double-helix vortex of particles responding dynamically to the cursor).
 * 4. Chronos Rings (nested gyroscopic rings with orbiting data nodes, digital bits, and periodic micro-glitches).
 */
const EmberCore3D = ({ onConvergeComplete, trackerRef }) => {
  const containerRef = useRef(null);

  const introStateRef = useRef({
    time: 0,
    phase: 0, // 0: scatter, 1: converge, 2: done
    calledComplete: false,
  });

  // Interaction & state refs
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.15, y: 0.4 });
  const rotationCurrentRef = useRef({ x: 0.15, y: 0.4 });
  
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHoveredRef = useRef(false);
  
  // Animation speed multipliers and pulse controls
  const speedMultiplierRef = useRef(1.0);
  const targetSpeedRef = useRef(1.0);
  const autoRotateSpeedRef = useRef(0.006);
  const idleTimerRef = useRef(0);
  
  // Dynamic heartbeat spike factor
  const heartbeatPulseRef = useRef(1.0);
  
  // Glitch event indicators (Chronos Fracture)
  const glitchTimerRef = useRef(0);
  const glitchActiveRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // ==========================================
    // 1. Setup Scene, Camera, & WebGL Renderer
    // ==========================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 2. Setup Curated Lighting Systems
    // ==========================================
    // Key Light: Warm amber light for core illumination
    const keyLight = new THREE.DirectionalLight("#ffe2b3", 3.5);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light: Cool teal-cyan light representing the digital sea
    const fillLight = new THREE.DirectionalLight("#00e5ff", 2.2);
    fillLight.position.set(-3, -2, -3);
    scene.add(fillLight);

    // Ambient Light: Deep background glow
    const ambientLight = new THREE.AmbientLight("#0a0813", 0.6);
    scene.add(ambientLight);

    // ==========================================
    // 3. Parent Group & Interaction Anchors
    // ==========================================
    const engineGroup = new THREE.Group();
    scene.add(engineGroup);

    // ==========================================
    // 4. Central Biomorphic Neural Core (Heartbeat)
    // ==========================================
    const coreGroup = new THREE.Group();
    engineGroup.add(coreGroup);

    // Inner Glowing Core (representing electrical power / heartbeat)
    const coreGeo = new THREE.SphereGeometry(0.28, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffdb75,
      emissive: 0xff4c00,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Dynamic inner light source
    const coreLight = new THREE.PointLight("#ff5500", 4.0, 6.0, 1.5);
    coreMesh.add(coreLight);

    // Outer Geodesic Morphing Shell (The Carbon/Neural Lattice)
    const shellGeometry = new THREE.IcosahedronGeometry(0.55, 3);
    
    // Store original vertices for displacement math
    const shellPosAttr = shellGeometry.attributes.position;
    const originalShellPositions = new Float32Array(shellPosAttr.count * 3);
    for (let i = 0; i < shellPosAttr.count; i++) {
      originalShellPositions[i * 3] = shellPosAttr.getX(i);
      originalShellPositions[i * 3 + 1] = shellPosAttr.getY(i);
      originalShellPositions[i * 3 + 2] = shellPosAttr.getZ(i);
    }

    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xff9000,
      emissive: 0x992200,
      emissiveIntensity: 0.4,
      wireframe: true,
      metalness: 0.95,
      roughness: 0.05,
    });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMat);
    coreGroup.add(shellMesh);

    // ==========================================
    // 5. Imagined Sea of Numbers (Wavy Particle Grid)
    // ==========================================
    const gridRows = 28;
    const gridCols = 28;
    const gridPointCount = gridRows * gridCols;
    const gridPositions = new Float32Array(gridPointCount * 3);
    const gridColors = new Float32Array(gridPointCount * 3);

    const spacingX = 0.13;
    const spacingZ = 0.13;
    const offsetX = -(gridCols - 1) * spacingX / 2;
    const offsetZ = -(gridRows - 1) * spacingZ / 2;

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const idx = r * gridCols + c;
        const x = offsetX + c * spacingX;
        const z = offsetZ + r * spacingZ;
        const y = -1.25;

        gridPositions[idx * 3] = x;
        gridPositions[idx * 3 + 1] = y;
        gridPositions[idx * 3 + 2] = z;

        // Initialize color buffer
        gridColors[idx * 3] = 1.0;
        gridColors[idx * 3 + 1] = 0.85;
        gridColors[idx * 3 + 2] = 0.3;
      }
    }

    const gridScatterPos = new Float32Array(gridPointCount * 3);
    const gridScatterVel = new Float32Array(gridPointCount * 3);
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const idx = r * gridCols + c;
        gridScatterPos[idx * 3] = (Math.random() - 0.5) * 20;
        gridScatterPos[idx * 3 + 1] = (Math.random() - 0.5) * 20;
        gridScatterPos[idx * 3 + 2] = (Math.random() - 0.5) * 20;
        gridScatterVel[idx * 3] = (Math.random() - 0.5) * 2;
        gridScatterVel[idx * 3 + 1] = (Math.random() - 0.5) * 2;
        gridScatterVel[idx * 3 + 2] = (Math.random() - 0.5) * 2;
      }
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.BufferAttribute(gridPositions, 3));
    gridGeometry.setAttribute("color", new THREE.BufferAttribute(gridColors, 3));

    // Glow canvas texture for soft point rendering
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 219, 117, 0.9)");
    gradient.addColorStop(0.7, "rgba(233, 162, 59, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const gridMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTexture,
    });

    const gridSystem = new THREE.Points(gridGeometry, gridMaterial);
    engineGroup.add(gridSystem);

    // ==========================================
    // 6. Spore Swarm / Pollen Helix (Double Helix Swarm)
    // ==========================================
    const swarmCount = 850;
    const swarmPositions = new Float32Array(swarmCount * 3);
    const swarmColors = new Float32Array(swarmCount * 3);
    const swarmData = [];

    for (let i = 0; i < swarmCount; i++) {
      const y = (Math.random() - 0.5) * 2.5; // vertically spans core bounds
      const branch = Math.random() > 0.5 ? 0 : Math.PI; // Helix split
      const theta = Math.random() * Math.PI * 2 + branch;
      const speedFactor = 0.6 + Math.random() * 0.9;
      const baseRadius = 0.42 + (y * y) * 0.35; // hourglass tapering radius

      const x = baseRadius * Math.cos(theta);
      const z = baseRadius * Math.sin(theta);

      swarmPositions[i * 3] = x;
      swarmPositions[i * 3 + 1] = y;
      swarmPositions[i * 3 + 2] = z;

      // Spora colors (Amber/Yellow/Red blend)
      swarmColors[i * 3] = 1.0;
      swarmColors[i * 3 + 1] = 0.45 + Math.random() * 0.45;
      swarmColors[i * 3 + 2] = 0.02 + Math.random() * 0.15;

      swarmData.push({
        theta: theta,
        y: y,
        speedFactor: speedFactor,
        baseRadius: baseRadius,
        randomYOffset: Math.random() * Math.PI,
      });
    }

    const swarmScatterPos = new Float32Array(swarmCount * 3);
    const swarmScatterVel = new Float32Array(swarmCount * 3);
    for (let i = 0; i < swarmCount; i++) {
      swarmScatterPos[i * 3] = (Math.random() - 0.5) * 20;
      swarmScatterPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      swarmScatterPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      swarmScatterVel[i * 3] = (Math.random() - 0.5) * 2;
      swarmScatterVel[i * 3 + 1] = (Math.random() - 0.5) * 2;
      swarmScatterVel[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    const swarmGeometry = new THREE.BufferGeometry();
    swarmGeometry.setAttribute("position", new THREE.BufferAttribute(swarmPositions, 3));
    swarmGeometry.setAttribute("color", new THREE.BufferAttribute(swarmColors, 3));

    const swarmMaterial = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTexture,
    });

    const swarmSystem = new THREE.Points(swarmGeometry, swarmMaterial);
    engineGroup.add(swarmSystem);

    // ==========================================
    // 7. Chronos Rings & Coordinate Nodes (Nested)
    // ==========================================
    const ringsGroup = new THREE.Group();
    engineGroup.add(ringsGroup);

    // Outer ring gold material
    const ringGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.98,
      roughness: 0.08,
    });

    // Inner Ring: Lattice Ring (Carbon nodes + connections)
    const ringInnerGroup = new THREE.Group();
    const ringInnerWireGeo = new THREE.TorusGeometry(0.85, 0.008, 8, 48);
    const ringInnerWire = new THREE.Mesh(ringInnerWireGeo, new THREE.MeshBasicMaterial({ color: 0x00d9ff, wireframe: true }));
    ringInnerGroup.add(ringInnerWire);

    // Add nodes along the inner ring
    const nodeCount = 10;
    const nodeGeo = new THREE.SphereGeometry(0.038, 8, 8);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0077aa,
      emissiveIntensity: 1.8,
      metalness: 0.8,
      roughness: 0.1,
    });
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(0.85 * Math.cos(angle), 0.85 * Math.sin(angle), 0);
      ringInnerGroup.add(nodeMesh);
    }
    ringsGroup.add(ringInnerGroup);

    // Middle Ring: Solid Gold gyroscopic ring
    const ringMiddleGeo = new THREE.TorusGeometry(1.15, 0.02, 12, 60);
    const ringMiddle = new THREE.Mesh(ringMiddleGeo, ringGoldMat);
    ringsGroup.add(ringMiddle);

    // Outer Ring: Ring of Digital Byte Cubes (floating 0s and 1s)
    const ringOuterGroup = new THREE.Group();
    const bitCount = 14;
    const bitGeo = new THREE.BoxGeometry(0.042, 0.042, 0.042);
    const bitMat = new THREE.MeshStandardMaterial({
      color: 0xffdb75,
      emissive: 0xd46a00,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1,
    });
    const bitMeshes = [];

    for (let i = 0; i < bitCount; i++) {
      const angle = (i / bitCount) * Math.PI * 2;
      const bitMesh = new THREE.Mesh(bitGeo, bitMat);
      bitMesh.position.set(1.48 * Math.cos(angle), 1.48 * Math.sin(angle), 0);
      ringOuterGroup.add(bitMesh);
      bitMeshes.push({
        mesh: bitMesh,
        angle: angle,
        wobbleSpeed: 1.5 + Math.random() * 2.0,
        scaleSpeed: 2.0 + Math.random() * 1.5,
      });
    }
    ringsGroup.add(ringOuterGroup);

    // Set initial ring rotations to show 3D depth
    ringInnerGroup.rotation.x = Math.PI / 3.5;
    ringInnerGroup.rotation.y = Math.PI / 6;

    ringMiddle.rotation.y = Math.PI / 4;
    ringMiddle.rotation.x = -Math.PI / 8;

    ringOuterGroup.rotation.z = Math.PI / 5;
    ringOuterGroup.rotation.y = -Math.PI / 5;

    // ==========================================
    // 8. 3D Noise Shader-free Utility
    // ==========================================
    // Simulated noise generated through combinations of sinusoids
    const noise3D = (x, y, z, time) => {
      const v1 = Math.sin(x * 2.2 + time * 1.4) * Math.cos(y * 2.0 + time * 1.1) * Math.sin(z * 2.5 + time * 1.6);
      const v2 = Math.sin(x * 4.8 - time * 2.3) * Math.sin(y * 4.2 + time * 2.6) * Math.cos(z * 3.6 - time * 2.1) * 0.45;
      const v3 = Math.cos(x * 9.0 + time * 3.2) * Math.cos(y * 8.0 - time * 3.8) * Math.sin(z * 9.5 + time * 3.0) * 0.18;
      return v1 + v2 + v3;
    };

    // ==========================================
    // 9. Input & Interaction Event Handlers
    // ==========================================
    const handleMouseMove = (e) => {
      const target = (trackerRef && trackerRef.current) ? trackerRef.current : container;
      const rect = target.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Project mouse into approximated spatial workspace limits
      mouseRef.current.targetX = ndcX * 2.3;
      mouseRef.current.targetY = ndcY * 2.3;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        rotationTargetRef.current.y += deltaX * 0.007;
        rotationTargetRef.current.x += deltaY * 0.007;
        
        // Clamp X to avoid gymbals/flipovers
        rotationTargetRef.current.x = Math.max(
          -Math.PI / 2.8,
          Math.min(Math.PI / 2.8, rotationTargetRef.current.x)
        );
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
        idleTimerRef.current = 0;
      }
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      idleTimerRef.current = 0;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Click triggers cognitive pulse (heartbeat spike)
    const handleCanvasClick = () => {
      heartbeatPulseRef.current = 2.8; // Burst out deformation core
      targetSpeedRef.current = 3.6; // Accelerate swirl speed
      coreMat.emissiveIntensity = 4.0; // Flash brightness
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      targetSpeedRef.current = 2.4;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      targetSpeedRef.current = 1.0;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    // Mobile Support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        idleTimerRef.current = 0;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const target = (trackerRef && trackerRef.current) ? trackerRef.current : container;
        const rect = target.getBoundingClientRect();
        
        mouseRef.current.targetX = (((clientX - rect.left) / rect.width) * 2 - 1) * 2.3;
        mouseRef.current.targetY = (-((clientY - rect.top) / rect.height) * 2 + 1) * 2.3;

        if (isDraggingRef.current) {
          const deltaX = clientX - previousMousePositionRef.current.x;
          const deltaY = clientY - previousMousePositionRef.current.y;
          rotationTargetRef.current.y += deltaX * 0.007;
          rotationTargetRef.current.x += deltaY * 0.007;
          rotationTargetRef.current.x = Math.max(
            -Math.PI / 2.8,
            Math.min(Math.PI / 2.8, rotationTargetRef.current.x)
          );
          previousMousePositionRef.current = { x: clientX, y: clientY };
          idleTimerRef.current = 0;
        }
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Use tracker for mousedown/click/touch so pointer-events work correctly
    const interactionTarget = (trackerRef && trackerRef.current) ? trackerRef.current : container;

    interactionTarget.addEventListener("mousedown", handleMouseDown);
    interactionTarget.addEventListener("click", handleCanvasClick);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    interactionTarget.addEventListener("mouseenter", handleMouseEnter);
    interactionTarget.addEventListener("mouseleave", handleMouseLeave);

    interactionTarget.addEventListener("touchstart", handleTouchStart, { passive: true });
    interactionTarget.addEventListener("touchmove", handleTouchMove, { passive: true });
    interactionTarget.addEventListener("touchend", handleTouchEnd);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 10. Core Animation Loop
    // ==========================================
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Intro Logic
      const intro = introStateRef.current;
      if (intro.phase < 2) {
        intro.time += delta;
        if (intro.time < 2.5) {
          intro.phase = 0; // Scatter
          for(let i=0; i<gridPointCount; i++) {
             gridScatterPos[i*3] += gridScatterVel[i*3] * delta;
             gridScatterPos[i*3+1] += gridScatterVel[i*3+1] * delta;
             gridScatterPos[i*3+2] += gridScatterVel[i*3+2] * delta;
             
             const gx = gridScatterPos[i*3];
             const gz = gridScatterPos[i*3+2];
             gridScatterPos[i*3] = gx * Math.cos(delta * 0.2) - gz * Math.sin(delta * 0.2);
             gridScatterPos[i*3+2] = gx * Math.sin(delta * 0.2) + gz * Math.cos(delta * 0.2);
          }
          for(let i=0; i<swarmCount; i++) {
             swarmScatterPos[i*3] += swarmScatterVel[i*3] * delta;
             swarmScatterPos[i*3+1] += swarmScatterVel[i*3+1] * delta;
             swarmScatterPos[i*3+2] += swarmScatterVel[i*3+2] * delta;
             
             const sx = swarmScatterPos[i*3];
             const sz = swarmScatterPos[i*3+2];
             swarmScatterPos[i*3] = sx * Math.cos(delta * 0.2) - sz * Math.sin(delta * 0.2);
             swarmScatterPos[i*3+2] = sx * Math.sin(delta * 0.2) + sz * Math.cos(delta * 0.2);
          }
        } else if (intro.time < 5.0) {
          intro.phase = 1; // Converge
        } else {
          intro.phase = 2; // Done
          if (!intro.calledComplete && onConvergeComplete) {
            intro.calledComplete = true;
            onConvergeComplete();
          }
        }
      }

      // Decay/Smooth interaction factors
      speedMultiplierRef.current += (targetSpeedRef.current - speedMultiplierRef.current) * 0.06;
      heartbeatPulseRef.current += (1.0 - heartbeatPulseRef.current) * 0.07;
      
      // Gradually settle target speed back to its base state after clicks
      const baseTargetSpeed = isHoveredRef.current ? 2.4 : 1.0;
      if (targetSpeedRef.current > baseTargetSpeed) {
        targetSpeedRef.current -= delta * 3.5;
      } else {
        targetSpeedRef.current = baseTargetSpeed;
      }

      // ------------------------------------------
      // A. Chronos Fracture Glitch System
      // ------------------------------------------
      glitchTimerRef.current += delta;
      let glitchOffsetX = 0;
      let glitchOffsetY = 0;
      let glitchScale = 1.0;

      if (glitchActiveRef.current) {
        if (glitchTimerRef.current > 0.1) {
          glitchActiveRef.current = false;
          glitchTimerRef.current = 0;
        } else {
          // Visual distortion during the glitch phase
          glitchOffsetX = (Math.random() - 0.5) * 0.16;
          glitchOffsetY = (Math.random() - 0.5) * 0.16;
          glitchScale = 0.95 + Math.random() * 0.1;
        }
      } else {
        // Trigger a glitch every 4 to 7 seconds
        if (glitchTimerRef.current > 4.0 + Math.random() * 3.0) {
          glitchActiveRef.current = true;
          glitchTimerRef.current = 0;
        }
      }

      // Apply base heartbeat scale breathing + glitch impact
      const breath = 1.0 + Math.sin(elapsed * 3.5 * speedMultiplierRef.current) * 0.05 * heartbeatPulseRef.current;
      const currentScale = breath * glitchScale;

      let finalScale = currentScale;
      if (intro.phase === 0) {
         finalScale = 0;
      } else if (intro.phase === 1) {
         const progress = (intro.time - 2.5) / 2.5;
         const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
         finalScale = currentScale * ease;
      }
      coreGroup.scale.set(finalScale, finalScale, finalScale);
      ringsGroup.scale.set(finalScale, finalScale, finalScale);

      // Core glow pulsation intensity
      const pulseIntensity = (1.5 + Math.sin(elapsed * 4.5 * speedMultiplierRef.current) * 0.3) * heartbeatPulseRef.current;
      coreMat.emissiveIntensity = glitchActiveRef.current ? 4.0 : pulseIntensity;
      coreLight.intensity = (glitchActiveRef.current ? 7.0 : 4.0) * heartbeatPulseRef.current;

      // ------------------------------------------
      // B. Biomorphic Core Shell Mesh Morphing
      // ------------------------------------------
      const shellTime = elapsed * 1.5 * speedMultiplierRef.current;
      const currentShellPos = shellGeometry.attributes.position;
      
      for (let i = 0; i < currentShellPos.count; i++) {
        const ox = originalShellPositions[i * 3];
        const oy = originalShellPositions[i * 3 + 1];
        const oz = originalShellPositions[i * 3 + 2];

        const len = Math.sqrt(ox*ox + oy*oy + oz*oz);
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        // Perturb the position along normal using 3D noise
        const nValue = noise3D(nx * 1.4, ny * 1.4, nz * 1.4, shellTime);
        const displacement = nValue * 0.13 * heartbeatPulseRef.current;
        const newR = len + displacement;

        currentShellPos.setXYZ(i, nx * newR, ny * newR, nz * newR);
      }
      currentShellPos.needsUpdate = true;
      shellGeometry.computeVertexNormals();

      // ------------------------------------------
      // C. Wavy Sea of Numbers Particle Swell
      // ------------------------------------------
      const gridPos = gridGeometry.attributes.position;
      const gridCol = gridGeometry.attributes.color;
      const waveTime = elapsed * 1.6 * speedMultiplierRef.current;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const idx = r * gridCols + c;
          const x = gridPositions[idx * 3];
          const z = gridPositions[idx * 3 + 2];

          const dist = Math.sqrt(x*x + z*z);
          // Wave height formula (ripples from center)
          const waveHeight = Math.sin(x * 2.2 + waveTime) * Math.cos(z * 2.2 + waveTime) * 0.16 * Math.exp(-dist * 0.2) +
                             Math.sin(dist * 4.0 - waveTime * 1.5) * 0.05;
          const targetY = -1.25 + waveHeight;
          
          let currentX = x;
          let currentY = targetY;
          let currentZ = z;

          if (intro.phase === 0) {
             currentX = gridScatterPos[idx*3];
             currentY = gridScatterPos[idx*3+1];
             currentZ = gridScatterPos[idx*3+2];
          } else if (intro.phase === 1) {
             const progress = (intro.time - 2.5) / 2.5;
             const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
             currentX = THREE.MathUtils.lerp(gridScatterPos[idx*3], x, ease);
             currentY = THREE.MathUtils.lerp(gridScatterPos[idx*3+1], targetY, ease);
             currentZ = THREE.MathUtils.lerp(gridScatterPos[idx*3+2], z, ease);
          }

          gridPos.setXYZ(idx, currentX, currentY, currentZ);

          // Color blending: warm amber-gold (1.0, 0.7, 0.1) -> cool teal-cyan (0.0, 0.9, 0.8)
          const waveFactor = Math.sin(dist * 1.8 - waveTime) * 0.5 + 0.5;
          const blend = THREE.MathUtils.clamp(waveFactor * 0.6 + (waveHeight * 2.5 + 0.4) * 0.4, 0.0, 1.0);
          
          const cr = THREE.MathUtils.lerp(1.0, 0.0, blend);
          const cg = THREE.MathUtils.lerp(0.7, 0.9, blend);
          const cb = THREE.MathUtils.lerp(0.1, 0.8, blend);
          
          gridCol.setXYZ(idx, cr, cg, cb);
        }
      }
      gridPos.needsUpdate = true;
      gridCol.needsUpdate = true;

      // ------------------------------------------
      // D. Helix Swarm Movement & Cursor Force
      // ------------------------------------------
      const swarmPos = swarmGeometry.attributes.position;
      const currentMouseX = mouseRef.current.x;
      const currentMouseY = mouseRef.current.y;

      // Smoothly interpolate cursor target
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      for (let i = 0; i < swarmCount; i++) {
        const data = swarmData[i];

        // Rotation speed increases near core equator
        const localSwirl = 0.016 * (1.3 - Math.min(1.0, Math.abs(data.y)) / 1.3) * data.speedFactor * speedMultiplierRef.current;
        data.theta += localSwirl;

        // Flow particles vertically
        data.y += 0.009 * data.speedFactor * speedMultiplierRef.current;
        if (data.y > 1.35) {
          data.y = -1.35;
        }

        // Add a gentle breathing oscillation to radius
        const rOffset = Math.sin(elapsed * 2.0 + data.randomYOffset) * 0.04;
        const rad = data.baseRadius + rOffset;

        let px = rad * Math.cos(data.theta);
        let py = data.y;
        let pz = rad * Math.sin(data.theta);

        // Repulsive force from hover cursor
        const dx = px - currentMouseX;
        const dy = py - currentMouseY;
        const dSquared = dx*dx + dy*dy;
        const dist = Math.sqrt(dSquared);
        
        if (dist < 0.85) {
          const repulsionStrength = (0.85 - dist) * 0.42;
          px += (dx / (dist + 0.001)) * repulsionStrength;
          py += (dy / (dist + 0.001)) * repulsionStrength;
        }

        let finalX = px;
        let finalY = py;
        let finalZ = pz;

        if (intro.phase === 0) {
           finalX = swarmScatterPos[i*3];
           finalY = swarmScatterPos[i*3+1];
           finalZ = swarmScatterPos[i*3+2];
        } else if (intro.phase === 1) {
           const progress = (intro.time - 2.5) / 2.5;
           const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
           finalX = THREE.MathUtils.lerp(swarmScatterPos[i*3], px, ease);
           finalY = THREE.MathUtils.lerp(swarmScatterPos[i*3+1], py, ease);
           finalZ = THREE.MathUtils.lerp(swarmScatterPos[i*3+2], pz, ease);
        }

        swarmPos.setXYZ(i, finalX, finalY, finalZ);
      }
      swarmPos.needsUpdate = true;

      // Swarm system self-rotation
      swarmSystem.rotation.y = elapsed * 0.08;

      // ------------------------------------------
      // E. Nested Gyroscopic Rings Animations
      // ------------------------------------------
      const ringSpeed = elapsed * 0.6 * speedMultiplierRef.current;

      // Inner ring: orbital ticks
      ringInnerGroup.rotation.y = ringSpeed * 1.5;
      ringInnerGroup.rotation.x = ringSpeed * 0.8;

      // Middle ring: gold
      ringMiddle.rotation.x = -ringSpeed * 1.2;
      ringMiddle.rotation.z = ringSpeed * 1.0;

      // Outer ring: digital bit bytes
      ringOuterGroup.rotation.z = -ringSpeed * 0.7;
      ringOuterGroup.rotation.y = ringSpeed * 0.5;

      // Orbit bits individual spins & scales
      bitMeshes.forEach((bit) => {
        bit.mesh.rotation.y = elapsed * bit.wobbleSpeed;
        bit.mesh.rotation.x = elapsed * (bit.wobbleSpeed * 0.7);
        const bitScale = 1.0 + Math.sin(elapsed * bit.scaleSpeed) * 0.15;
        bit.mesh.scale.set(bitScale, bitScale, bitScale);
      });

      // ------------------------------------------
      // F. System Idle & User Auto-rotation
      // ------------------------------------------
      if (!isDraggingRef.current) {
        idleTimerRef.current += delta;
        if (idleTimerRef.current > 1.2) {
          rotationTargetRef.current.y += autoRotateSpeedRef.current * speedMultiplierRef.current;
          // Slowly settle back to looking slightly down at core
          rotationTargetRef.current.x += (0.15 - rotationTargetRef.current.x) * 0.02;
        }
      }

      // Lerp target orientation to current view rotation
      rotationCurrentRef.current.y += (rotationTargetRef.current.y - rotationCurrentRef.current.y) * 0.07;
      rotationCurrentRef.current.x += (rotationTargetRef.current.x - rotationCurrentRef.current.x) * 0.07;

      // Apply rotation, injection displacement if a Chronos glitch is active
      engineGroup.rotation.y = rotationCurrentRef.current.y + glitchOffsetY;
      engineGroup.rotation.x = rotationCurrentRef.current.x + glitchOffsetX;

      // Animate position and scale to tracker element if intro is done
      if (intro.phase === 2 && trackerRef && trackerRef.current) {
         const rect = trackerRef.current.getBoundingClientRect();
         const cx = rect.left + rect.width / 2;
         const cy = rect.top + rect.height / 2;
         
         const ndcX = (cx / window.innerWidth) * 2 - 1;
         const ndcY = -(cy / window.innerHeight) * 2 + 1;
         
         const vFOV = THREE.MathUtils.degToRad(camera.fov);
         const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
         const visibleWidth = visibleHeight * camera.aspect;
         
         const targetWorldX = (ndcX * visibleWidth) / 2;
         const targetWorldY = (ndcY * visibleHeight) / 2;
         
         engineGroup.position.x += (targetWorldX - engineGroup.position.x) * 0.06;
         
         const levitation = Math.sin(elapsed * 0.8) * 0.06;
         engineGroup.position.y += ((targetWorldY + levitation) - engineGroup.position.y) * 0.06;
         
         // Base scale on how much smaller the tracker is compared to full screen
         const targetScale = Math.min(1.0, (rect.height / window.innerHeight) * 1.5);
         engineGroup.scale.x += (targetScale - engineGroup.scale.x) * 0.06;
         engineGroup.scale.y += (targetScale - engineGroup.scale.y) * 0.06;
         engineGroup.scale.z += (targetScale - engineGroup.scale.z) * 0.06;
      } else {
         // Levitation floating effect for center screen
         engineGroup.position.y = Math.sin(elapsed * 0.8) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 11. Lifecycle Cleanup
    // ==========================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      const target = (trackerRef && trackerRef.current) ? trackerRef.current : container;
      if (target) {
        target.removeEventListener("mousedown", handleMouseDown);
        target.removeEventListener("click", handleCanvasClick);
        target.removeEventListener("mouseenter", handleMouseEnter);
        target.removeEventListener("mouseleave", handleMouseLeave);
        target.removeEventListener("touchstart", handleTouchStart);
        target.removeEventListener("touchmove", handleTouchMove);
        target.removeEventListener("touchend", handleTouchEnd);
      }
      
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries
      coreGeo.dispose();
      shellGeometry.dispose();
      gridGeometry.dispose();
      swarmGeometry.dispose();
      ringInnerWireGeo.dispose();
      nodeGeo.dispose();
      ringMiddleGeo.dispose();
      bitGeo.dispose();

      // Dispose materials
      coreMat.dispose();
      shellMat.dispose();
      gridMaterial.dispose();
      swarmMaterial.dispose();
      nodeMat.dispose();
      ringGoldMat.dispose();
      bitMat.dispose();
      ringInnerWire.material.dispose();

      // Dispose textures
      particleTexture.dispose();

      // Dispose renderer
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center select-none cursor-pointer"
      style={{ minHeight: "350px", touchAction: "none" }}
    />
  );
};

export default EmberCore3D;
