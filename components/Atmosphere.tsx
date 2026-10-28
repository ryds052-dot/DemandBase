"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Atmosphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.set(1.6, 0.1, 0);
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(2.15, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x2f8b61,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const form = new THREE.Mesh(geometry, material);
    form.rotation.set(0.3, -0.4, 0.15);
    group.add(form);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshBasicMaterial({ color: 0x00f576, wireframe: true, transparent: true, opacity: 0.1 }),
    );
    group.add(inner);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.008, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0x8c9b94, transparent: true, opacity: 0.25 }),
    );
    ring.rotation.set(1.15, 0.25, 0.2);
    group.add(ring);

    const count = 650;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = radius * Math.cos(phi) - 2;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({ color: 0x86bda2, size: 0.014, transparent: true, opacity: 0.5 }),
    );
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      group.position.x = width < 800 ? 0.8 : 1.6;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const time = clock.getElapsedTime();
      if (!reducedMotion) {
        form.rotation.y = time * 0.055 + pointer.x * 0.09;
        form.rotation.x = 0.3 + pointer.y * 0.06;
        inner.rotation.y = -time * 0.08;
        inner.rotation.z = time * 0.04;
        ring.rotation.z = 0.2 + time * 0.025;
        particles.rotation.y = time * 0.008;
        group.position.y = Math.sin(time * 0.4) * 0.12;
        camera.position.x += (pointer.x * 0.12 - camera.position.x) * 0.025;
        camera.position.y += (-pointer.y * 0.1 - camera.position.y) * 0.025;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((entry) => entry.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="atmosphere" aria-hidden="true" />;
}
