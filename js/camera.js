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

    // 360° Free Orbit & Zoom Inspection Mode State
    this.isInspectMode = false;
    this.inspectSpherical = {
      radius: 5.2,
      targetRadius: 5.2,
      theta: 0,
      targetTheta: 0,
      phi: Math.PI / 2,
      targetPhi: Math.PI / 2
    };
    this.isDragging = false;
    this.prevDrag = { x: 0, y: 0 };
    this.savedCameraPos = new THREE.Vector3();

    this.setupListeners();
    this.setupInspectDragListeners();
    this.updateResponsiveFraming();
  }

  setupInspectDragListeners() {
    window.addEventListener('mousedown', (e) => {
      if (!this.isInspectMode) return;
      if (e.target.closest('button') || e.target.closest('nav') || e.target.closest('.drawer')) return;
      this.isDragging = true;
      this.prevDrag.x = e.clientX;
      this.prevDrag.y = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isInspectMode || !this.isDragging) return;
      const dx = e.clientX - this.prevDrag.x;
      const dy = e.clientY - this.prevDrag.y;
      this.prevDrag.x = e.clientX;
      this.prevDrag.y = e.clientY;

      this.inspectSpherical.targetTheta -= dx * 0.008;
      this.inspectSpherical.targetPhi = THREE.MathUtils.clamp(
        this.inspectSpherical.targetPhi + dy * 0.008,
        0.3,
        Math.PI - 0.3
      );
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('wheel', (e) => {
      if (!this.isInspectMode) return;
      this.inspectSpherical.targetRadius = THREE.MathUtils.clamp(
        this.inspectSpherical.targetRadius + e.deltaY * 0.003,
        2.2,
        7.5
      );
    }, { passive: true });

    // Touch support for 360 inspect mode
    window.addEventListener('touchstart', (e) => {
      if (!this.isInspectMode || e.touches.length === 0) return;
      this.isDragging = true;
      this.prevDrag.x = e.touches[0].clientX;
      this.prevDrag.y = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isInspectMode || !this.isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - this.prevDrag.x;
      const dy = e.touches[0].clientY - this.prevDrag.y;
      this.prevDrag.x = e.touches[0].clientX;
      this.prevDrag.y = e.touches[0].clientY;

      this.inspectSpherical.targetTheta -= dx * 0.01;
      this.inspectSpherical.targetPhi = THREE.MathUtils.clamp(
        this.inspectSpherical.targetPhi + dy * 0.01,
        0.3,
        Math.PI - 0.3
      );
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  enableInspectMode() {
    this.isInspectMode = true;
    this.savedCameraPos.copy(this.camera.position);
    this.inspectSpherical.targetRadius = 5.0;
    this.inspectSpherical.targetTheta = 0;
    this.inspectSpherical.targetPhi = Math.PI / 2;
  }

  disableInspectMode() {
    this.isInspectMode = false;
    this.camera.position.copy(this.savedCameraPos);
    this.camera.lookAt(this.lookTarget);
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
    if (this.isInspectMode) {
      // 360 Free Orbit & Zoom Spherical Math
      this.inspectSpherical.radius = THREE.MathUtils.lerp(
        this.inspectSpherical.radius,
        this.inspectSpherical.targetRadius,
        0.08
      );
      this.inspectSpherical.theta = THREE.MathUtils.lerp(
        this.inspectSpherical.theta,
        this.inspectSpherical.targetTheta,
        0.08
      );
      this.inspectSpherical.phi = THREE.MathUtils.lerp(
        this.inspectSpherical.phi,
        this.inspectSpherical.targetPhi,
        0.08
      );

      const r = this.inspectSpherical.radius;
      const sinPhi = Math.sin(this.inspectSpherical.phi);
      const cosPhi = Math.cos(this.inspectSpherical.phi);
      const sinTheta = Math.sin(this.inspectSpherical.theta);
      const cosTheta = Math.cos(this.inspectSpherical.theta);

      this.camera.position.set(
        r * sinPhi * sinTheta,
        r * cosPhi,
        r * sinPhi * cosTheta
      );
      this.camera.lookAt(0, 0, 0);
      return;
    }

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

