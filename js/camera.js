/**
 * PULSÉ — Virtual Camera & Responsive Framing Controller
 * Cinematic lens physics, portrait/mobile adaptive framing,
 * and butter-smooth mouse parallax.
 */

import * as THREE from 'three';

export class CameraManager {
  constructor() {
    this.fov = 40;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 60;

    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    
    // Initial Hero Shot Position
    this.defaultPos = new THREE.Vector3(0, 0, 5.8);
    this.camera.position.copy(this.defaultPos);
    this.lookTarget = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(this.lookTarget);

    // Mouse Parallax & Inertia
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.parallaxStrength = 0.22;
    this.isMobile = window.innerWidth < 768;

    this.setupListeners();
    this.updateResponsiveFraming();
  }

  setupListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Gyroscope tilt on mobile
    if (window.DeviceOrientationEvent && this.isMobile) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.mouse.targetX = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
          this.mouse.targetY = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
        }
      }, { passive: true });
    }
  }

  updateResponsiveFraming() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.aspect = w / h;
    this.camera.aspect = this.aspect;

    // Portrait / Mobile Framing: Pull back camera to keep the tall bottle well-framed
    if (this.aspect < 1.0) {
      // Mobile / Portrait: increase distance or FOV smoothly
      this.camera.fov = 44 + (1.0 - this.aspect) * 12;
      this.defaultPos.z = 6.8 + (1.0 - this.aspect) * 1.5;
    } else if (this.aspect < 1.5) {
      // Tablet / Square
      this.camera.fov = 41;
      this.defaultPos.z = 6.0;
    } else {
      // Desktop Cinematic
      this.camera.fov = 38;
      this.defaultPos.z = 5.8;
    }

    this.camera.updateProjectionMatrix();
  }

  update() {
    // Smooth damp mouse parallax
    this.mouse.x = THREE.MathUtils.lerp(this.mouse.x, this.mouse.targetX, 0.05);
    this.mouse.y = THREE.MathUtils.lerp(this.mouse.y, this.mouse.targetY, 0.05);

    // Parallax offset applied without disturbing GSAP ScrollTrigger timeline coordinates
    this.camera.position.x += (this.mouse.x * this.parallaxStrength - this.camera.position.x * 0.02);
    this.camera.position.y += (-this.mouse.y * this.parallaxStrength * 0.7 - this.camera.position.y * 0.02);
  }

  handleResize(width, height) {
    this.updateResponsiveFraming();
  }
}

