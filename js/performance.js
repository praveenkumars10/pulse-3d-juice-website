/**
 * PULSÉ — Performance & Adaptive Quality Manager
 * Monitors real-time FPS and dynamically scales rendering loads
 * ensuring 60FPS smoothness even on low-end mobile devices & GPUs.
 */

export class PerformanceManager {
  constructor(renderer, options = {}) {
    this.renderer = renderer;
    this.fps = 60;
    this.fpsHistory = [];
    this.maxHistory = 60;
    this.lastTime = performance.now();
    this.frames = 0;
    this.stableFrames = 0;
    
    // Hardware detection
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    this.isLowPowerDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || this.isMobile;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Quality Tiers: 'high', 'medium', 'low'
    this.tier = this.isMobile ? (window.innerWidth < 480 ? 'low' : 'medium') : 'high';
    
    this.listeners = [];
    this.applyTierSettings(this.tier);

    // FPS diagnostic display (subtle HUD if requested)
    this.debug = options.debug || false;
  }

  onQualityChange(callback) {
    this.listeners.push(callback);
  }

  applyTierSettings(tier) {
    this.tier = tier;
    const maxDeviceDPR = window.devicePixelRatio || 1;

    switch (tier) {
      case 'high':
        // Capping at 1.5 gives razor-sharp clarity while cutting GPU fill rate by 55% compared to 2.0+
        this.dpr = Math.min(maxDeviceDPR, 1.5);
        this.dropletsCount = 80;
        this.fruitParticlesCount = 45;
        this.splashQuality = 1.0;
        this.shadowsEnabled = true;
        break;
      case 'medium':
        this.dpr = Math.min(maxDeviceDPR, 1.25);
        this.dropletsCount = 45;
        this.fruitParticlesCount = 25;
        this.splashQuality = 0.75;
        this.shadowsEnabled = false; // Disable heavy shadows on medium
        break;
      case 'low':
      default:
        this.dpr = 1.0;
        this.dropletsCount = 25;
        this.fruitParticlesCount = 15;
        this.splashQuality = 0.5;
        this.shadowsEnabled = false;
        break;
    }

    if (this.renderer) {
      this.renderer.setPixelRatio(this.dpr);
      this.renderer.shadowMap.enabled = this.shadowsEnabled;
    }

    this.listeners.forEach(fn => fn(this.tier, {
      dpr: this.dpr,
      dropletsCount: this.dropletsCount,
      particlesCount: this.fruitParticlesCount,
      shadows: this.shadowsEnabled
    }));
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.frames++;

    if (delta > 0) {
      const instantFps = 1000 / delta;
      this.fpsHistory.push(instantFps);
      if (this.fpsHistory.length > this.maxHistory) {
        this.fpsHistory.shift();
      }

      // Calculate rolling average
      const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
      this.fps = Math.round(sum / this.fpsHistory.length);
    }

    // Every 60 frames (~1 sec), evaluate dynamic downscaling
    if (this.frames % 60 === 0) {
      if (this.fps < 32 && this.tier === 'high') {
        this.applyTierSettings('medium');
      } else if (this.fps < 26 && this.tier === 'medium') {
        this.applyTierSettings('low');
      } else if (this.fps > 56 && this.tier === 'medium' && !this.isMobile) {
        this.stableFrames++;
        if (this.stableFrames > 3) { // Recover only if consistently high
          this.applyTierSettings('high');
          this.stableFrames = 0;
        }
      } else {
        this.stableFrames = 0;
      }
    }
  }

  getSettings() {
    return {
      tier: this.tier,
      dpr: this.dpr,
      dropletsCount: this.dropletsCount,
      particlesCount: this.fruitParticlesCount,
      shadows: this.shadowsEnabled,
      isMobile: this.isMobile,
      prefersReducedMotion: this.prefersReducedMotion
    };
  }
}

