import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Shader Sources ────────────────────────────────────────────────────────────

const GLOW_LINE_VERT = `
  attribute float lineProgress;
  attribute float lineOpacity;
  varying float vProgress;
  varying float vOpacity;
  void main() {
    vProgress = lineProgress;
    vOpacity  = lineOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_LINE_FRAG = `
  precision highp float;
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying float vProgress;
  varying float vOpacity;
  void main() {
    // Pulse wave travelling up the spline
    float wave  = sin(vProgress * 12.0 - uTime * 2.2) * 0.5 + 0.5;
    float pulse = mix(0.35, 1.0, wave) * vOpacity;
    vec3 color  = mix(uColorA, uColorB, vProgress);
    gl_FragColor = vec4(color, pulse);
  }
`;

const PARTICLE_VERT = `
  attribute float aSize;
  attribute float aProgress;
  attribute float aBrightness;
  varying float vBrightness;
  uniform float uTime;
  void main() {
    vBrightness = aBrightness;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.85 + 0.15 * sin(aProgress * 20.0 - uTime * 3.5 + aBrightness * 6.28);
    gl_PointSize  = aSize * pulse * (280.0 / -mvPos.z);
    gl_Position   = projectionMatrix * mvPos;
  }
`;

const PARTICLE_FRAG = `
  precision highp float;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uTime;
  varying float vBrightness;
  void main() {
    // Circular soft disc
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float dist = length(uv);
    if (dist > 1.0) discard;
    float alpha = (1.0 - smoothstep(0.2, 1.0, dist)) * vBrightness;
    vec3  color = mix(uColorA, uColorB, vBrightness);
    gl_FragColor = vec4(color, alpha * 0.9);
  }
`;

const MILESTONE_VERT = `
  attribute float aPulse;
  varying float vPulse;
  uniform float uTime;
  void main() {
    vPulse = aPulse;
    float scale = 1.0 + 0.18 * sin(uTime * 2.0 + aPulse * 3.14);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * scale, 1.0);
  }
`;

const MILESTONE_FRAG = `
  precision highp float;
  uniform float uTime;
  varying float vPulse;
  void main() {
    vec3 colorA = vec3(1.0, 0.64, 0.23);  // Amber
    vec3 colorB = vec3(1.0, 0.90, 0.56);  // Bright Glow
    float pulse  = 0.7 + 0.3 * sin(uTime * 3.0 + vPulse * 5.0);
    vec3  color  = mix(colorA, colorB, pulse);
    gl_FragColor = vec4(color, pulse * 0.92);
  }
`;

// ─── Geometry Helpers ──────────────────────────────────────────────────────────

function buildSpline() {
  // Generate points for a consistent circular spring (helix)
  const points = [];
  const turns = 4.5;
  const radius = 1.35;
  const height = 6.2;
  const segments = 120;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (t - 0.5) * height;
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}

function buildGlowLine(curve, segments = 260) {
  const pts      = curve.getPoints(segments);
  const positions  = new Float32Array(pts.length * 3);
  const progresses = new Float32Array(pts.length);
  const opacities  = new Float32Array(pts.length);

  for (let i = 0; i < pts.length; i++) {
    positions[i * 3]     = pts[i].x;
    positions[i * 3 + 1] = pts[i].y;
    positions[i * 3 + 2] = pts[i].z;
    progresses[i]         = i / (pts.length - 1);
    // Fade in at the bottom, fade out at the very tip
    const t = progresses[i];
    opacities[i] = t < 0.1 ? t / 0.1 : t > 0.9 ? (1.0 - t) / 0.1 : 1.0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',    new THREE.BufferAttribute(positions,  3));
  geo.setAttribute('lineProgress',new THREE.BufferAttribute(progresses, 1));
  geo.setAttribute('lineOpacity', new THREE.BufferAttribute(opacities,  1));
  return geo;
}

function buildParticles(curve, count = 280) {
  const positions   = new Float32Array(count * 3);
  const sizes       = new Float32Array(count);
  const progresses  = new Float32Array(count);
  const brightnesses= new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Mix of on-curve and off-curve (drifting cloud)
    const onCurve = Math.random() < 0.55;
    const t = Math.random();

    if (onCurve) {
      const pt = curve.getPointAt(t);
      positions[i * 3]     = pt.x + (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.25;
      sizes[i]        = 0.6 + Math.random() * 1.2;
      brightnesses[i] = 0.22 + Math.random() * 0.28;
    } else {
      // Ambient dust cloud around the spline
      positions[i * 3]     = (Math.random() - 0.5) * 6.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      sizes[i]        = 0.8 + Math.random() * 1.4;
      brightnesses[i] = 0.25 + Math.random() * 0.35;
    }
    progresses[i]   = t;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',    new THREE.BufferAttribute(positions,    3));
  geo.setAttribute('aSize',       new THREE.BufferAttribute(sizes,        1));
  geo.setAttribute('aProgress',   new THREE.BufferAttribute(progresses,   1));
  geo.setAttribute('aBrightness', new THREE.BufferAttribute(brightnesses, 1));
  return geo;
}

function buildMilestoneRing(radius = 0.16, segments = 48) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const pulses = new Float32Array(pts.length);
  for (let i = 0; i < pts.length; i++) pulses[i] = i / pts.length;
  geo.setAttribute('aPulse', new THREE.BufferAttribute(pulses, 1));
  return geo;
}

// ─── Travelling Light Probe ────────────────────────────────────────────────────

function buildTrailProbe(trailLength = 22) {
  const positions  = new Float32Array(trailLength * 3);
  const sizes      = new Float32Array(trailLength);
  const brightnesses = new Float32Array(trailLength);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',    new THREE.BufferAttribute(positions,    3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aSize',       new THREE.BufferAttribute(sizes,        1).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aBrightness', new THREE.BufferAttribute(brightnesses, 1).setUsage(THREE.DynamicDrawUsage));
  // dummy progress — shader needs it
  const prog = new Float32Array(trailLength).fill(0.5);
  geo.setAttribute('aProgress', new THREE.BufferAttribute(prog, 1));

  return geo;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function JourneyPath3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ──
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.01, 80);
    camera.position.set(0, 0, 12.2);

    // ── Spline ──
    const curve = buildSpline();

    // ── Materials ──
    const colorA = new THREE.Color(0xc2693a); // Burnt amber
    const colorB = new THREE.Color(0xffc46b); // Glow gold

    const lineMat = new THREE.ShaderMaterial({
      vertexShader:   GLOW_LINE_VERT,
      fragmentShader: GLOW_LINE_FRAG,
      uniforms: {
        uTime:   { value: 0 },
        uColorA: { value: colorA },
        uColorB: { value: colorB },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const particleMat = new THREE.ShaderMaterial({
      vertexShader:   PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      uniforms: {
        uTime:   { value: 0 },
        uColorA: { value: new THREE.Color(0xe9a23b) },
        uColorB: { value: new THREE.Color(0xffffff) },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const milestoneMat = new THREE.ShaderMaterial({
      vertexShader:   MILESTONE_VERT,
      fragmentShader: MILESTONE_FRAG,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const trailMat = particleMat.clone();
    trailMat.uniforms.uColorA = { value: new THREE.Color(0xffc46b) };
    trailMat.uniforms.uColorB = { value: new THREE.Color(0xffffff) };

    // ── Scene Objects ──
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Glow Line
    const lineGeo  = buildGlowLine(curve);
    const glowLine = new THREE.Line(lineGeo, lineMat);
    sceneGroup.add(glowLine);

    // Second thinner back-line for depth
    const lineGeo2 = buildGlowLine(curve, 180);
    const lineMat2 = lineMat.clone();
    lineMat2.uniforms = {
      uTime:   { value: 0 },
      uColorA: { value: new THREE.Color(0x8b3a1a) },
      uColorB: { value: new THREE.Color(0xe9a23b) },
    };
    const glowLine2 = new THREE.Line(lineGeo2, lineMat2);
    glowLine2.scale.setScalar(1.04);
    sceneGroup.add(glowLine2);

    // Particle cloud
    const particleGeo  = buildParticles(curve, 300);
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    sceneGroup.add(particleMesh);

    // Milestone rings at key spline positions
    const milestoneTs  = [0.0, 0.16, 0.33, 0.50, 0.67, 0.83, 1.0];
    const ringGeo      = buildMilestoneRing();
    milestoneTs.forEach((t, i) => {
      const pt = curve.getPointAt(t);
      const ring = new THREE.Line(ringGeo, milestoneMat);
      ring.position.copy(pt);
      // Vary tilt per node for a 3-D sense
      ring.rotation.set(
        Math.random() * 0.6 - 0.3,
        Math.random() * 0.6 - 0.3,
        (i / milestoneTs.length) * Math.PI * 2
      );
      const scale = i === 0 || i === milestoneTs.length - 1 ? 1.6 : 1.0 + Math.random() * 0.6;
      ring.scale.setScalar(scale);
      ring.userData.baseScale = scale;
      ring.userData.t = t;
      sceneGroup.add(ring);
    });

    // Travelling comet trail
    const TRAIL_LEN = 24;
    const trailGeo  = buildTrailProbe(TRAIL_LEN);
    const trailMesh = new THREE.Points(trailGeo, trailMat);
    sceneGroup.add(trailMesh);
    let cometT = 0;

    // ── Mouse Interaction ──
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e) => {
      const rect  = container.getBoundingClientRect();
      const nx    = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ny    = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      targetRotX  = ny * 0.28;
      targetRotY  = nx * 0.38;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ── Clock & RAF ──
    const clock = new THREE.Clock();
    let rafId;

    const posAttr = trailGeo.attributes.position;
    const szAttr  = trailGeo.attributes.aSize;
    const brAttr  = trailGeo.attributes.aBrightness;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update uniforms
      lineMat.uniforms.uTime.value     = elapsed;
      lineMat2.uniforms.uTime.value    = elapsed;
      particleMat.uniforms.uTime.value = elapsed;
      milestoneMat.uniforms.uTime.value = elapsed;
      trailMat.uniforms.uTime.value    = elapsed;

      // Comet travel
      cometT = (elapsed * 0.09) % 1;
      for (let i = 0; i < TRAIL_LEN; i++) {
        const tOffset = cometT - i * 0.005;
        const tClamped = ((tOffset % 1) + 1) % 1;
        const pt = curve.getPointAt(tClamped);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
        const frac = 1 - i / TRAIL_LEN;
        szAttr.setX(i,  3.5 * frac + 0.4);
        brAttr.setX(i,  frac * frac);
      }
      posAttr.needsUpdate = true;
      szAttr.needsUpdate  = true;
      brAttr.needsUpdate  = true;

      // Smooth camera tilt following mouse
      currentRotX += (targetRotX - currentRotX) * 0.04;
      currentRotY += (targetRotY - currentRotY) * 0.04;

      // Slow auto-rotation + mouse tilt
      sceneGroup.rotation.y = elapsed * 0.08 + currentRotY;
      sceneGroup.rotation.x = currentRotX;

      // Breathe scale on the milestone rings
      sceneGroup.children.forEach(child => {
        if (child.userData.baseScale !== undefined) {
          const s = child.userData.baseScale * (1 + 0.07 * Math.sin(elapsed * 1.8 + child.userData.t * 10));
          child.scale.setScalar(s);
          // Also slowly spin each ring on its own axis
          child.rotation.z += 0.004;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ──
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      ro.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose all geometries and materials
      [lineGeo, lineGeo2, particleGeo, ringGeo, trailGeo].forEach(g => g.dispose());
      [lineMat, lineMat2, particleMat, milestoneMat, trailMat].forEach(m => m.dispose());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
    />
  );
}
