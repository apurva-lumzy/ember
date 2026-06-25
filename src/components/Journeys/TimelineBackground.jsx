import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const TimelineBackground = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);

  const targetCameraZ = 180;
  const initCamaraZ = targetCameraZ / 5;

  useImperativeHandle(ref, () => ({
    updateProgress: (progress) => {
      if (!cameraRef.current) return;
      const z = initCamaraZ + (targetCameraZ - initCamaraZ) * progress;
      gsap.killTweensOf(cameraRef.current.position);
      gsap.to(cameraRef.current.position, { 
        z, 
        duration: 0.1, 
        ease: "none",
        overwrite: "auto"
      });
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    const imgUrl = 'https://dbev9lthwamoubzh.public.blob.vercel-storage.com/journey-path.webp';
    const instanceSize = 0.35; // Reduced from 1 for finer, less chaotic particles
    const randRangeZ = 2 * targetCameraZ * 0.99; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.5, 1000);
    camera.position.set(0, 0, initCamaraZ);
    cameraRef.current = camera;

    let mesh;

    function f(x, y, targetZ) {
      const h = 0.5;
      const d = targetCameraZ;
      const D = -targetZ + d;
      const H = h / d * D;
      const s = H / h;
      return { s, p: new THREE.Vector3(x * s, y * s, targetZ) };
    }

    // CREATE FALLBACK MESH IMMEDIATELY
    const createMesh = (ratio, colorData = null) => {
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
        scene.remove(mesh);
      }
      
      const nRow = 256;
      const nCol = Math.floor(nRow * ratio);
      const sz = instanceSize;

      const geom = new THREE.BoxGeometry(sz, sz, sz).translate(0, 0, -0.5 * sz);
      const mat = new THREE.MeshBasicMaterial();
      mesh = new THREE.InstancedMesh(geom, mat, nCol * nRow);

      const cColor = new THREE.Color();
      for (let i = 0, c = 0; i < nRow; ++i) {
        for (let j = 0; j < nCol; ++j) {
          const { p, s } = f(
            (j - nCol / 2 + 0.5) * sz,
            (nRow / 2 - i + 0.5) * sz,
            THREE.MathUtils.randFloatSpread(randRangeZ) * sz
          );
          const m = new THREE.Matrix4()
            .setPosition(p)
            .multiply(new THREE.Matrix4().makeScale(s, s, s));
          mesh.setMatrixAt(c, m);
          
          if (colorData) {
            mesh.setColorAt(c, cColor.setRGB(colorData[c * 4] / 255, colorData[c * 4 + 1] / 255, colorData[c * 4 + 2] / 255));
          } else {
            // visible fallback (golden/amber random)
            mesh.setColorAt(c, cColor.setHSL(0.1 + Math.random() * 0.1, 1, 0.5));
          }
          ++c;
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true;
      scene.add(mesh);
    };

    // Initialize with fallback
    createMesh(634 / 951);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const { width, height } = img;
      const imgRatio = width / height;
      
      const can = document.createElement('canvas');
      can.height = 256;
      can.width = Math.floor(can.height * imgRatio);
      const ctx = can.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height, 0, 0, can.width, can.height);
      const { data } = ctx.getImageData(0, 0, can.width, can.height);
      
      createMesh(imgRatio, data);
      console.log('TimelineBackground image loaded', width, height);
    };
    img.onerror = (err) => console.error('TimelineBackground image failed to load', err);
    img.src = imgUrl;

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      if (width === 0 || height === 0) return;
      
      renderer.setSize(width, height);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
        scene.remove(mesh);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20 mix-blend-screen"
    />
  );
});

export default TimelineBackground;
