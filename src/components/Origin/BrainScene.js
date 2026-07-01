import * as THREE from 'three';
import gsap from 'gsap';

export default class BrainScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050403, 0.01);

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.3, 14.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.PARTICLE_COUNT = 22000;

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPulseState: { value: 0 },
      uDissolve: { value: 0 },
    };

    this.initParticles();
    this.initGlow();

    this.clock = new THREE.Clock();
    this.isPlaying = true;
    
    this.state = 'IDLE';
    this.activeTimeline = null;
    this.loopTimeline = null;

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    this.render();
  }

  initParticles() {
    const positions = new Float32Array(this.PARTICLE_COUNT * 3);
    const brainPositions = new Float32Array(this.PARTICLE_COUNT * 3);
    const randoms = new Float32Array(this.PARTICLE_COUNT);
    const colors = new Float32Array(this.PARTICLE_COUNT * 3);

    const deepColor = new THREE.Color(0x7a3d05);
    const midColor  = new THREE.Color(0xf59e0b);
    const hiColor   = new THREE.Color(0xffe8b8);

    const lightDir = new THREE.Vector3(0.45, 0.55, 0.85).normalize();

    function wrinkleNoise(theta, phi) {
      let n = 0;
      n += Math.sin(theta * 8.0 + phi * 3.1) * 0.5;
      n += Math.sin(theta * 13.0 - phi * 7.4 + 1.7) * 0.3;
      n += Math.sin(theta * 5.0 + phi * 17.0 - 0.6) * 0.35;
      n += Math.cos(theta * 21.0 - phi * 4.2 + 2.4) * 0.18;
      n += Math.cos(theta * 3.0 + phi * 9.5) * 0.25;
      return n / (0.5 + 0.3 + 0.35 + 0.18 + 0.25);
    }

    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      positions[i3]     = (Math.random() - 0.5) * 26;
      positions[i3 + 1] = (Math.random() - 0.5) * 26;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);

      const wrinkle = wrinkleNoise(theta, phi);

      let rx = 3.9, ry = 3.35, rz = 4.35;

      const frontalBulge = Math.max(0, -nz) * 0.35 * Math.max(0, -ny + 0.3);
      const stemTaper = ny < -0.55 ? Math.max(0.35, 1 + (ny + 0.55) * 1.6) : 1.0;

      const ridgeAmp = 0.085;
      const radiusScale = (1 + wrinkle * ridgeAmp + frontalBulge) * stemTaper;

      let bx = nx * rx * radiusScale;
      let by = ny * ry * radiusScale;
      let bz = nz * rz * radiusScale;

      const shell = 0.9 + Math.random() * 0.1;
      bx *= shell; by *= shell; bz *= shell;

      const seam = Math.exp(-Math.pow(bx / 0.22, 2));
      by -= seam * 0.55 * Math.max(0, ny + 0.2);
      bx += (bx > 0 ? 1 : -1) * seam * 0.28;

      brainPositions[i3]     = bx;
      brainPositions[i3 + 1] = by;
      brainPositions[i3 + 2] = bz;

      randoms[i] = Math.random();

      const normal = new THREE.Vector3(nx, ny, nz);
      const lit = THREE.MathUtils.clamp(normal.dot(lightDir), 0.0, 1.0);
      const foldBrightness = (wrinkle + 1) / 2;
      let brightness = lit * 0.65 + foldBrightness * 0.55 - seam * 0.5;
      brightness = THREE.MathUtils.clamp(brightness, 0.0, 1.0);

      const c = new THREE.Color();
      if (brightness < 0.5) {
        c.copy(deepColor).lerp(midColor, brightness / 0.5);
      } else {
        c.copy(midColor).lerp(hiColor, (brightness - 0.5) / 0.5);
      }
      c.multiplyScalar(0.9 + Math.random() * 0.2);

      colors[i3]     = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aBrainPosition', new THREE.BufferAttribute(brainPositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform float uPulseState;
        uniform float uDissolve;

        attribute vec3 aBrainPosition;
        attribute float aRandom;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying float vAlpha;

        vec3 hash3(vec3 p) {
          p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                    dot(p, vec3(269.5, 183.3, 246.1)),
                    dot(p, vec3(113.5, 271.9, 124.6)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        void main() {
          vec3 idlePos = position;
          vec3 brainPos = aBrainPosition;

          idlePos.x += sin(uTime * 0.4 + aRandom * 10.0) * 1.2;
          idlePos.y += cos(uTime * 0.3 + aRandom * 10.0) * 1.2;
          idlePos.z += sin(uTime * 0.35 + aRandom * 10.0) * 1.2;

          brainPos.x += sin(uTime * 2.0 + aRandom * 10.0) * 0.08;
          brainPos.y += cos(uTime * 1.5 + aRandom * 10.0) * 0.08;
          brainPos.z += sin(uTime * 1.8 + aRandom * 10.0) * 0.08;

          float dist = length(brainPos);
          float delay = dist * 0.09;
          float p = clamp((uProgress - delay) / 0.8, 0.0, 1.0);
          p = smoothstep(0.0, 1.0, p);

          vec3 finalPos = mix(idlePos, brainPos, p);

          if (uDissolve > 0.0) {
            vec3 explodeDir = normalize(brainPos + hash3(brainPos) * 2.0);
            finalPos += explodeDir * (uDissolve * (4.0 + aRandom * 9.0));
            finalPos = mix(finalPos, idlePos, smoothstep(0.5, 1.0, uDissolve));
          }

          float pulse = 0.0;
          if (uPulseState > 0.0) {
            float ripple = sin(dist * 2.0 - uTime * 6.0) * 0.5 + 0.5;
            pulse = ripple * uPulseState;
            finalPos += normalize(brainPos) * pulse * 0.28;
          }

          vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float sizeBoost = mix(0.85, 1.15, p);
          gl_PointSize = (2.3 + aRandom * 2.0 + pulse * 3.5) * sizeBoost * (16.0 / -mvPosition.z);

          vColor = aColor;

          float baseAlpha = mix(0.35, 0.92, p);
          if (uDissolve > 0.0) {
            baseAlpha = mix(baseAlpha, 0.2, uDissolve);
          }
          vAlpha = clamp(baseAlpha + pulse * 0.35, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.08, dist) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: true,
    });

    this.points = new THREE.Points(geometry, material);
    this.points.rotation.y = -0.55;
    this.points.rotation.x = 0.08;
    this.scene.add(this.points);
  }

  initGlow() {
    const glowTex = (function () {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(245,158,11,0.16)');
      g.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    glowSprite.scale.set(16, 16, 1);
    glowSprite.position.set(0, 0, -3);
    this.scene.add(glowSprite);
  }

  setState(nextState, onStateChange) {
    this.state = nextState;
    if (onStateChange) onStateChange(nextState);
  }

  startSequence(onStateChange) {
    if (this.state !== 'IDLE') return;
    this.setState('GATHERING', onStateChange);

    this.activeTimeline = gsap.timeline({
      onComplete: () => this.runDissolveLoop(onStateChange),
    });

    this.activeTimeline.to(this.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: 'power3.inOut',
      onComplete: () => this.setState('FORMING', onStateChange),
    });

    this.activeTimeline.to(this.uniforms.uPulseState, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => this.setState('PULSING', onStateChange),
    }, '+=0.4');

    this.activeTimeline.to({}, { duration: 2 });
  }

  runDissolveLoop(onStateChange) {
    this.setState('DISSOLVING', onStateChange);

    this.loopTimeline = gsap.timeline({
      onComplete: () => {
        this.setState('REFORMING', onStateChange);
        this.uniforms.uProgress.value = 0;
        this.uniforms.uDissolve.value = 0;
        this.setState('IDLE', onStateChange);
        this.startSequence(onStateChange);
      },
    });

    this.loopTimeline.to(this.uniforms.uPulseState, {
      value: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    this.loopTimeline.to(this.uniforms.uDissolve, {
      value: 1,
      duration: 2.5,
      ease: 'power2.inOut',
    }, '-=0.3');
  }

  resetAll(onStateChange) {
    gsap.killTweensOf(this.uniforms.uProgress);
    gsap.killTweensOf(this.uniforms.uPulseState);
    gsap.killTweensOf(this.uniforms.uDissolve);
    
    if (this.activeTimeline) this.activeTimeline.kill();
    if (this.loopTimeline) this.loopTimeline.kill();
    this.activeTimeline = null;
    this.loopTimeline = null;

    this.uniforms.uProgress.value = 0;
    this.uniforms.uPulseState.value = 0;
    this.uniforms.uDissolve.value = 0;

    this.setState('IDLE', onStateChange);
  }

  onWindowResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  render() {
    if (!this.isPlaying) return;

    requestAnimationFrame(this.render.bind(this));
    
    const delta = this.clock.getDelta();
    this.uniforms.uTime.value += delta;
    if (this.points) {
      this.points.rotation.y += delta * 0.09;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isPlaying = false;
    window.removeEventListener('resize', this.onWindowResize);
    this.points?.geometry?.dispose();
    this.points?.material?.dispose();
    this.renderer.dispose();
    if(this.container.contains(this.renderer.domElement)) {
       this.container.removeChild(this.renderer.domElement);
    }
  }
}
