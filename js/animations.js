/**
 * PULSÉ — GSAP ScrollTrigger Master Timeline Choreography
 * Connects scroll progress to camera motion, bottle physics,
 * fruit explosion, liquid splash, macro close-up, and flavor morphing.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from './products.js';

gsap.registerPlugin(ScrollTrigger);

export class AnimationController {
  constructor(sceneManager, cameraManager, audioManager) {
    this.scene = sceneManager;
    this.cameraCtrl = cameraManager;
    this.audio = audioManager;
    this.camera = cameraManager.camera;

    this.currentFlavourStep = 0;
    this.bgContainer = document.getElementById('bg-gradient');
    this.hudStepEl = document.getElementById('hud-step');
    this.hudFlavourEl = document.getElementById('hud-flavour-name');

    this.initMasterTimeline();
  }

  initMasterTimeline() {
    // Pin container for the entire 3D scroll voyage
    const scrollContainer = document.querySelector('.scroll-container');

    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0,
        onUpdate: (self) => {
          this.handleScrollProgress(self.progress);
        }
      }
    });

    // =======================================================================
    // SCENE 0 -> SCENE 1: THE BOTTLE REVEAL (Progress: 0.00 -> 0.14)
    // =======================================================================
    this.masterTimeline
      // Camera dolly & angle shift
      .to(this.camera.position, {
        x: -0.5,
        y: 0.1,
        z: 5.2,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 0)
      // Bottle slides to right & rotates to proud three-quarter view
      .to(this.scene.bottleGroup.position, {
        x: 0.5,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 0)
      .to(this.scene.bottleGroup.rotation, {
        y: -0.32,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 0)
      // Orange slices rotate & float closer
      .to(this.scene.fruitObjects[1].rotation, {
        x: 1.2,
        y: -1.0,
        z: 0.8,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 0)
      // Background warm studio glow shift
      .to(this.bgContainer, {
        background: 'radial-gradient(circle at 60% 45%, #381206 0%, #150502 60%, #080302 100%)',
        duration: 1.4,
        ease: 'power1.inOut'
      }, 0)
      // Text transitions: Hero fades out, Scene 1 enters
      .to('.hero-text-block', { opacity: 0, y: -40, duration: 0.5, pointerEvents: 'none' }, 0.2)
      .fromTo('.scene-1-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 0.5);

    // =======================================================================
    // SCENE 1 -> SCENE 2: REAL FRUIT EXPLOSION (Progress: 0.14 -> 0.28)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 1 text
      .to('.scene-1-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 1.3)
      // Camera orbits to wide dynamic angle
      .to(this.camera.position, {
        x: 0.7,
        y: -0.15,
        z: 5.4,
        duration: 1.4,
        ease: 'power3.inOut'
      }, 1.4)
      // Bottle shifts left so stats text on right is completely clear
      .to(this.scene.bottleGroup.position, {
        x: -0.45,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 1.4)
      .to(this.scene.bottleGroup.rotation, {
        x: 0.04,
        y: 0.18,
        z: -0.04,
        duration: 1.4,
        ease: 'power2.out'
      }, 1.4);

    // Fruit explosion positions: each fruit blasts to explodePos
    this.scene.fruitObjects.forEach((fruit, idx) => {
      if (fruit.userData?.explodePos) {
        this.masterTimeline.to(fruit.position, {
          x: fruit.userData.explodePos.x,
          y: fruit.userData.explodePos.y,
          z: fruit.userData.explodePos.z,
          duration: 1.4,
          ease: 'power3.out'
        }, 1.4);
      }
    });

    // Juice pearls blast outwards
    if (this.scene.pearlsGroup) {
      this.scene.pearlsGroup.children.forEach(p => {
        if (p.userData?.explodePos) {
          this.masterTimeline.to(p.position, {
            x: p.userData.explodePos.x,
            y: p.userData.explodePos.y,
            z: p.userData.explodePos.z,
            duration: 1.4,
            ease: 'power2.out'
          }, 1.4);
        }
      });
    }

    // Scene 2 text & stats badges reveal
    this.masterTimeline.fromTo('.scene-2-text', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 
      1.7
    );

    // =======================================================================
    // SCENE 2 -> SCENE 3: THE JUICE SPLASH (Progress: 0.28 -> 0.42)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 2 text
      .to('.scene-2-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 2.6)
      // Camera and bottle position: bottle right, text left
      .to(this.camera.position, {
        x: -0.45,
        y: 0.05,
        z: 4.8,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 2.8)
      .to(this.scene.bottleGroup.position, {
        x: 0.5,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 2.8)
      .to(this.scene.bottleGroup.rotation, {
        x: 0,
        y: -0.15,
        z: 0,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 2.8)
      // Liquid Splash Geometry Rises & Spirals Behind/Around Bottle
      .to(this.scene.splash.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 1.4,
        ease: 'back.out(1.2)'
      }, 2.8)
      .to(this.scene.splash.rotation, {
        y: Math.PI * 0.8,
        duration: 1.4,
        ease: 'power2.out'
      }, 2.8)
      // Fruit recedes into background framing
      .to(this.scene.fruitGroup.position, {
        z: -1.5,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 2.8)
      // Scene 3 text enters
      .fromTo('.scene-3-text', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 
        3.1
      );

    // =======================================================================
    // SCENE 3 -> SCENE 4: THE BOTTLE MACRO SHOT (Progress: 0.42 -> 0.56)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 3 text
      .to('.scene-3-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 4.0)
      // Splash contracts/fades
      .to(this.scene.splash.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.8,
        ease: 'power2.in'
      }, 4.1)
      // Camera swoops into extreme MACRO CLOSE-UP on bottle curve & droplets
      .to(this.camera.position, {
        x: 0.25,
        y: -0.22,
        z: 2.8,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 4.2)
      .to(this.scene.bottleGroup.position, {
        x: 0.85,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 4.2)
      // Bottle rotates to showcase condensation droplets & foil label typography
      .to(this.scene.bottleGroup.rotation, {
        x: 0.02,
        y: -0.25,
        z: -0.03,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 4.2)
      // Rim light glides across surface
      .to(this.scene.rimLightWarm.position, {
        x: 2.5,
        y: 0.5,
        z: 2.0,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 4.2)
      // Scene 4 text enters on left
      .fromTo('.scene-4-text', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 
        4.5
      );

    // =======================================================================
    // SCENE 4 -> SCENE 5: THE FLAVOUR TRANSFORMATION (Progress: 0.56 -> 0.72)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 4 text
      .to('.scene-4-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 5.5)
      // Camera pulls back to regal showcase position
      .to(this.camera.position, {
        x: -0.3,
        y: 0,
        z: 5.0,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 5.6)
      .to(this.scene.bottleGroup.position, {
        x: 0.85,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 5.6)
      .to(this.scene.bottleGroup.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 5.6)
      // Reset fruit group
      .to(this.scene.fruitGroup.position, {
        z: 0,
        duration: 1.0,
        ease: 'power2.out'
      }, 5.6)
      // Reveal Scene 5 interactive Flavor Stage
      .fromTo('.scene-5-text', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 
        5.8
      );

    // =======================================================================
    // SCENE 5 -> SCENE 6: THE INGREDIENT WORLD (Progress: 0.72 -> 0.84)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 5 text
      .to('.scene-5-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 7.0)
      // Clean up flavor props
      .to([this.scene.mangoFruit?.scale, this.scene.blueberryGroup?.scale, this.scene.kiwiSlice?.scale, this.scene.strawberryFruit?.scale], {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.5
      }, 7.0)
      // Bring Ingredient World down into view
      .to(this.scene.ingredientWorldGroup.position, {
        y: 0,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 7.1)
      // Bottle slides back slightly
      .to(this.scene.bottleGroup.position, {
        x: 0,
        z: -1.2,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 7.1)
      // Camera glides through the ingredient landscape
      .to(this.camera.position, {
        x: -0.6,
        y: 0.4,
        z: 4.8,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 7.1)
      // Scene 6 text enters
      .fromTo('.scene-6-text', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 
        7.3
      );

    // =======================================================================
    // SCENE 6 -> SCENE 7: FLOATING 3D PRODUCT GALLERY (Progress: 0.84 -> 0.94)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 6 text
      .to('.scene-6-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 8.3)
      // Move Ingredient World away
      .to(this.scene.ingredientWorldGroup.position, {
        y: -15,
        duration: 1.2,
        ease: 'power2.in'
      }, 8.4)
      // Move Hero Bottle aside
      .to(this.scene.bottleGroup.position, {
        y: 10,
        duration: 1.2,
        ease: 'power2.in'
      }, 8.4)
      // Bring 5-BOTTLE 3D ARC GALLERY UP INTO CENTER VIEW
      .to(this.scene.galleryGroup.position, {
        y: 0,
        z: -0.6,
        duration: 1.5,
        ease: 'back.out(1.1)'
      }, 8.5)
      // Camera adjusts to wide showcase angle
      .to(this.camera.position, {
        x: 0,
        y: 0.35,
        z: 7.4,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 8.5)
      // Scene 7 text enters
      .fromTo('.scene-7-text', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, 
        8.6
      );

    // =======================================================================
    // SCENE 7 -> SCENE 8: FINAL HERO & CALL TO ACTION (Progress: 0.94 -> 1.00)
    // =======================================================================
    this.masterTimeline
      // Fade out Scene 7 text cleanly before Scene 8
      .to('.scene-7-text', { opacity: 0, y: -40, duration: 0.4, pointerEvents: 'none' }, 9.5)
      // Move gallery down
      .to(this.scene.galleryGroup.position, {
        y: -12,
        duration: 1.2,
        ease: 'power2.in'
      }, 9.6)
      // Return Hero Bottle to center stage with elegant framing
      .to(this.scene.bottleGroup.position, {
        x: 0,
        y: -0.55,
        z: 0,
        duration: 1.4,
        ease: 'power2.out'
      }, 9.6)
      // Pull camera back into grand majestic product composition
      .to(this.camera.position, {
        x: 0,
        y: 0.25,
        z: 6.2,
        duration: 1.4,
        ease: 'power2.inOut'
      }, 9.6)
      // Fade out bottom HUD dock so luxury footer sits cleanly
      .to('.site-hud', { opacity: 0, duration: 0.4 }, 9.8)
      // Reveal Final Hero Section & CTA
      .fromTo('.scene-8-text', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, pointerEvents: 'auto' }, 
        10.0
      )
      // Reveal Luxury Footer
      .to('.luxury-footer', { opacity: 1, duration: 0.6, pointerEvents: 'auto' }, 10.2);
  }

  // Real-time progress handler for continuous background & flavor morphs
  handleScrollProgress(progress) {
    // 1. Update Scroll Progress HUD Bar
    const progressBar = document.getElementById('scroll-progress-fill');
    if (progressBar) {
      progressBar.style.width = `${Math.round(progress * 100)}%`;
    }

    // 2. Update HUD Scene Indicator (01 - 08)
    let stepNum = '01';
    let stepName = 'THE REVEAL';

    if (progress < 0.14) {
      stepNum = '01';
      stepName = 'THE FIRST IMPRESSION';
    } else if (progress < 0.28) {
      stepNum = '02';
      stepName = 'THE BOTTLE REVEAL';
    } else if (progress < 0.42) {
      stepNum = '03';
      stepName = 'FRUIT EXPLOSION';
    } else if (progress < 0.56) {
      stepNum = '04';
      stepName = 'THE JUICE SPLASH';
    } else if (progress < 0.70) {
      stepNum = '05';
      stepName = 'MACRO REFLECTIONS';
    } else if (progress < 0.84) {
      stepNum = '06';
      stepName = 'FLAVOUR MORPH';
      this.handleFlavourSequence(progress);
    } else if (progress < 0.94) {
      stepNum = '07';
      stepName = 'THE 3D GALLERY';
    } else {
      stepNum = '08';
      stepName = 'THE SIGNATURE FINALE';
    }

    if (this.hudStepEl) this.hudStepEl.textContent = `${stepNum} / 08 • ${stepName}`;
  }

  // Manages continuous flavor morphing during Scene 5
  handleFlavourSequence(progress) {
    // Sub-progress within Scene 5 (0.70 - 0.84)
    const norm = (progress - 0.70) / 0.14;
    const clamped = Math.max(0, Math.min(0.999, norm));
    const step = Math.floor(clamped * PRODUCTS.length);

    if (step !== this.currentFlavourStep) {
      this.currentFlavourStep = step;
      this.scene.setProduct(step);
      
      const prod = PRODUCTS[step];
      if (this.hudFlavourEl) {
        this.hudFlavourEl.textContent = prod.name.toUpperCase();
      }

      // Smooth background gradient transition
      if (this.bgContainer) {
        this.bgContainer.style.background = prod.backgroundGradient;
      }

      // Update active state in UI flavor selector
      document.querySelectorAll('.flavor-pill').forEach((pill, idx) => {
        if (idx === step) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      // Play soft interaction chime
      if (this.audio) this.audio.playTick();
    }
  }

  // Jump smoothly to a specific product flavor
  jumpToFlavour(index) {
    this.scene.setProduct(index);
    this.currentFlavourStep = index;
    const prod = PRODUCTS[index];
    if (this.bgContainer) {
      this.bgContainer.style.background = prod.backgroundGradient;
    }
    if (this.hudFlavourEl) {
      this.hudFlavourEl.textContent = prod.name.toUpperCase();
    }
  }
}
