/**
 * PULSÉ — Application Entry Point & Interactive Coordinator
 * Initializes Lenis smooth scrolling, Three.js engine,
 * GSAP ScrollTrigger timeline, UI events, and luxury drawer.
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { PRODUCTS } from './products.js';
import { PerformanceManager } from './performance.js';
import { SceneManager } from './scene.js';
import { CameraManager } from './camera.js';
import { AudioManager } from './audio.js';
import { AnimationController } from './animations.js';

class App {
  constructor() {
    this.canvasContainer = document.getElementById('webgl-canvas-container');
    this.init();
  }

  init() {
    // 1. Performance & Hardware Manager
    this.perf = new PerformanceManager(null);

    // 2. Camera Manager
    this.cameraCtrl = new CameraManager();

    // 3. 3D Scene Manager
    this.sceneMgr = new SceneManager(this.canvasContainer, this.perf);
    this.perf.renderer = this.sceneMgr.renderer; // Connect renderer to auto-scaler

    // 4. Audio Synthesizer
    this.audio = new AudioManager();

    // 5. Initialize Lenis Smooth Scrolling
    this.initLenis();
    window.__lenis = this.lenis;
    window.__app = this;
    window.ScrollTrigger = ScrollTrigger;

    // 6. Master GSAP ScrollTrigger Animation Controller
    this.animCtrl = new AnimationController(this.sceneMgr, this.cameraCtrl, this.audio);

    // 7. Setup UI Events & Drawer
    this.setupUI();
    this.setupGalleryClick();

    // 8. Handle Window Resizing
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // 9. Start Main RAF Render Loop
    this.clock = new THREE.Clock();
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);

    // 10. Hide Loading Screen
    this.dismissLoader();
  }

  // =========================================================================
  // LENIS SMOOTH SCROLLING ENGINE
  // =========================================================================
  initLenis() {
    this.lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // =========================================================================
  // MAIN RAF RENDER LOOP
  // =========================================================================
  render() {
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update dynamic FPS monitor & adaptive downscaling
    this.perf.update();

    // 2. Update camera mouse parallax
    this.cameraCtrl.update();

    // 3. Update 3D scene objects, idle floating, and render frame
    this.sceneMgr.update(elapsedTime, this.cameraCtrl.camera);

    requestAnimationFrame(this.render);
  }

  // =========================================================================
  // UI EVENT BINDINGS & INTERACTIONS
  // =========================================================================
  setupUI() {
    // 1. Sound Toggle Button
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const active = this.audio.toggle();
        soundBtn.classList.toggle('active', active);
        const label = soundBtn.querySelector('.sound-label');
        if (label) label.textContent = active ? 'SOUND ON' : 'SOUND OFF';
      });
    }

    // 2. Flavor Pills in Navigation HUD
    const pills = document.querySelectorAll('.flavor-pill');
    pills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.animCtrl.jumpToFlavour(idx);
        this.audio.playTick();
      });
    });

    // 3. Navigation Links (Smooth scroll to appropriate scroll progress)
    const navFlavours = document.getElementById('nav-flavours');
    if (navFlavours) {
      navFlavours.addEventListener('click', (e) => {
        e.preventDefault();
        this.lenis.scrollTo(document.body.scrollHeight * 0.72, { duration: 1.8 });
      });
    }

    const navIngredients = document.getElementById('nav-ingredients');
    if (navIngredients) {
      navIngredients.addEventListener('click', (e) => {
        e.preventDefault();
        this.lenis.scrollTo(document.body.scrollHeight * 0.84, { duration: 1.8 });
      });
    }

    const navStory = document.getElementById('nav-story');
    if (navStory) {
      navStory.addEventListener('click', (e) => {
        e.preventDefault();
        this.lenis.scrollTo(document.body.scrollHeight * 0.28, { duration: 1.8 });
      });
    }

    const heroCta = document.getElementById('hero-cta-btn');
    if (heroCta) {
      heroCta.addEventListener('click', () => {
        this.lenis.scrollTo(document.body.scrollHeight * 0.16, { duration: 1.5 });
      });
    }

    // 4. Modal Drawer (Taste / Order Box)
    const exploreBtn = document.getElementById('nav-explore-btn');
    const finalCtaBtn = document.getElementById('final-cta-btn');
    const drawer = document.getElementById('product-drawer');
    const drawerClose = document.getElementById('drawer-close');

    const openDrawer = (productIndex = 0) => {
      this.populateDrawer(productIndex);
      drawer.classList.add('open');
      this.audio.playChime(660);
    };

    if (exploreBtn) exploreBtn.addEventListener('click', () => openDrawer(0));
    if (finalCtaBtn) finalCtaBtn.addEventListener('click', () => openDrawer(0));
    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    // Drawer Flavor Selector Tabs
    const drawerTabs = document.querySelectorAll('.drawer-flavor-tab');
    drawerTabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        drawerTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.populateDrawer(i);
        this.sceneMgr.setProduct(i);
        this.audio.playTick();
      });
    });

    // 5. Build Your Own 6-Pack Crate System
    this.crate = [0, 0, 1, 2, 3, 4]; // Pre-filled default discovery pack
    this.setupCrateBuilder();

    // 6. 360° Free Orbit & Zoom Inspect Mode
    this.setupInspectMode();

    // 7. Studio Lighting Mode Switcher (Noir, Sunset, Daylight)
    this.setupLightingSwitcher();

    // 8. "Find Your Flavour" Mood Quiz Modal
    this.setupMoodQuiz();

    // 9. Interactive Bottle Uncap & Fruit Click Listeners
    this.setupInteractiveCanvasClicks();
  }

  // =========================================================================
  // 360° FREE ORBIT & ZOOM INSPECT MODE
  // =========================================================================
  setupInspectMode() {
    const inspectBtn = document.getElementById('inspect-toggle-btn');
    const exitBtn = document.getElementById('exit-inspect-btn');
    const banner = document.getElementById('inspect-banner');

    const toggleInspect = (enable) => {
      if (enable) {
        this.cameraCtrl.enableInspectMode();
        document.body.classList.add('inspect-mode-active');
        if (banner) banner.classList.add('visible');
        if (inspectBtn) inspectBtn.classList.add('active');
        this.lenis.stop(); // Pause scroll while inspecting 360
        this.audio.playChime(770);
      } else {
        this.cameraCtrl.disableInspectMode();
        document.body.classList.remove('inspect-mode-active');
        if (banner) banner.classList.remove('visible');
        if (inspectBtn) inspectBtn.classList.remove('active');
        this.lenis.start(); // Resume scroll
        this.audio.playCapClick();
      }
    };

    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        toggleInspect(!this.cameraCtrl.isInspectMode);
      });
    }

    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        toggleInspect(false);
      });
    }
  }

  // =========================================================================
  // STUDIO LIGHTING THEME SWITCHER
  // =========================================================================
  setupLightingSwitcher() {
    const lightBtn = document.getElementById('nav-light-btn');
    const modes = ['noir', 'sunset', 'daylight'];
    let currentIdx = 0;

    if (lightBtn) {
      lightBtn.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % modes.length;
        const mode = modes[currentIdx];
        this.sceneMgr.setLightingMode(mode);

        const label = lightBtn.querySelector('.light-label');
        if (label) {
          label.textContent = mode.toUpperCase();
        }
        this.audio.playTick();
      });
    }
  }

  // =========================================================================
  // 6-PACK TASTING CRATE BUILDER
  // =========================================================================
  setupCrateBuilder() {
    const addBtn = document.getElementById('drawer-add-crate-btn');
    const resetBtn = document.getElementById('crate-reset-btn');

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (this.crate.length < 6) {
          this.crate.push(this.sceneMgr.activeProductIndex);
          this.updateCrateUI();
          this.audio.playSplash();
        } else {
          addBtn.textContent = 'CRATE FULL (6/6)';
          setTimeout(() => addBtn.textContent = '+ ADD TO CRATE', 1500);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.crate = [];
        this.updateCrateUI();
        this.audio.playTick();
      });
    }

    const orderActionBtn = document.getElementById('drawer-order-action');
    if (orderActionBtn) {
      orderActionBtn.addEventListener('click', () => {
        orderActionBtn.innerHTML = '✓ CRATE ORDERED • REFRESHING SOON';
        orderActionBtn.style.background = '#4CAF50';
        this.audio.playSplash();
        setTimeout(() => {
          orderActionBtn.innerHTML = 'PROCEED TO CHECKOUT • $38.00';
          orderActionBtn.style.background = '';
        }, 2500);
      });
    }

    this.updateCrateUI();
  }

  updateCrateUI() {
    const slots = document.querySelectorAll('.crate-slot');
    const countEl = document.getElementById('crate-count');
    if (countEl) countEl.textContent = `${this.crate.length} / 6`;

    slots.forEach((slot, i) => {
      slot.className = 'crate-slot';
      slot.innerHTML = '';
      if (i < this.crate.length) {
        const prodIndex = this.crate[i];
        const prod = PRODUCTS[prodIndex];
        slot.classList.add('filled');
        slot.style.borderColor = prod.accentColor;
        slot.innerHTML = `<span class="slot-dot" style="background:${prod.accentColor}"></span><span class="slot-label">${prod.name.split(' ')[0]}</span>`;
      } else {
        slot.style.borderColor = 'rgba(255,255,255,0.12)';
        slot.innerHTML = `<span class="slot-empty">+</span>`;
      }
    });
  }

  // =========================================================================
  // "FIND YOUR FLAVOUR" MOOD QUIZ MODAL
  // =========================================================================
  setupMoodQuiz() {
    const quizModal = document.getElementById('quiz-modal');
    const quizBtnNav = document.getElementById('nav-quiz-btn');
    const quizClose = document.getElementById('quiz-close-btn');

    if (quizBtnNav) {
      quizBtnNav.addEventListener('click', (e) => {
        e.preventDefault();
        if (quizModal) quizModal.classList.add('open');
        this.audio.playChime(660);
      });
    }

    if (quizClose) {
      quizClose.addEventListener('click', () => {
        if (quizModal) quizModal.classList.remove('open');
      });
    }

    // Quiz Options Click
    const quizOptions = document.querySelectorAll('.quiz-option-card');
    quizOptions.forEach(card => {
      card.addEventListener('click', () => {
        const targetIndex = parseInt(card.dataset.flavorIndex || '0', 10);
        if (quizModal) quizModal.classList.remove('open');
        
        // Scroll to Scene 5 (Flavour Transformation) and set recommended flavor!
        this.lenis.scrollTo(document.body.scrollHeight * 0.72, { duration: 1.8 });
        setTimeout(() => {
          this.animCtrl.jumpToFlavour(targetIndex);
          this.audio.playPop();
        }, 1200);
      });
    });
  }

  // =========================================================================
  // INTERACTIVE BOTTLE UNCAP & FRUIT BURST CLICKS
  // =========================================================================
  setupInteractiveCanvasClicks() {
    window.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('nav') || e.target.closest('.drawer') || e.target.closest('.quiz-modal')) return;

      // Check if Cap is clicked
      const isCap = this.sceneMgr.checkHeroCapRaycast(this.cameraCtrl.camera);
      if (isCap) {
        this.sceneMgr.toggleCap(this.audio);
        return;
      }

      // Check if Floating Fruit is clicked
      const fruit = this.sceneMgr.checkFruitRaycast(this.cameraCtrl.camera);
      if (fruit) {
        fruit.userData.rotSpeed.x += 0.35;
        fruit.userData.rotSpeed.y += 0.45;
        this.audio.playSplash();
      }
    });
  }

  // Populate drawer content with selected flavor details
  populateDrawer(index) {
    const prod = PRODUCTS[index] || PRODUCTS[0];
    const nameEl = document.getElementById('drawer-prod-name');
    const tagEl = document.getElementById('drawer-prod-tagline');
    const subEl = document.getElementById('drawer-prod-desc');
    const originEl = document.getElementById('drawer-prod-origin');
    const notesEl = document.getElementById('drawer-tasting-notes');

    if (nameEl) nameEl.textContent = prod.name.toUpperCase();
    if (tagEl) tagEl.textContent = prod.tagline;
    if (subEl) subEl.textContent = prod.subtitle;
    if (originEl) originEl.textContent = prod.origin;

    if (notesEl) {
      notesEl.innerHTML = '';
      prod.tastingNotes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = `• ${note}`;
        notesEl.appendChild(li);
      });
    }

    // Nutrition values
    document.getElementById('drawer-val-energy').textContent = prod.nutrition.energy;
    document.getElementById('drawer-val-sugar').textContent = prod.nutrition.sugars;
    document.getElementById('drawer-val-carbs').textContent = prod.nutrition.carbs;
    document.getElementById('drawer-val-vitc').textContent = prod.stats.vitaminC;
  }

  // 3D Gallery Interactive Click
  setupGalleryClick() {
    window.addEventListener('click', (e) => {
      // Ignore clicks on buttons/inputs
      if (e.target.closest('button') || e.target.closest('nav') || e.target.closest('.drawer')) return;

      const hovered = this.sceneMgr.checkRaycast(this.cameraCtrl.camera);
      if (hovered && hovered.userData?.product) {
        const idx = hovered.userData.index;
        this.populateDrawer(idx);
        document.getElementById('product-drawer').classList.add('open');
        this.audio.playChime(550);
      }
    });
  }

  // Dismiss loader with luxurious fade
  dismissLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 800);
      }, 700);
    }
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.cameraCtrl.handleResize(w, h);
    this.sceneMgr.handleResize(w, h);
    ScrollTrigger.refresh();
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
