/**
 * PULSÉ — 3D Scene, Studio Lighting & Object Management
 * Assembles the master Three.js world, physical materials,
 * bottle assemblies, fruit groups, splash geometry, and 5-bottle gallery.
 */

import * as THREE from 'three';
import { AssetEngine } from './assets.js';
import { PRODUCTS, INGREDIENTS_SHOWCASE } from './products.js';

export class SceneManager {
  constructor(canvasContainer, performanceManager) {
    this.container = canvasContainer;
    this.perf = performanceManager;
    this.assets = new AssetEngine();
    
    this.activeProductIndex = 0;
    this.currentProduct = PRODUCTS[0];
    
    this.initScene();
    this.initLights();
    this.buildHeroBottle();
    this.buildSurroundingFruits();
    this.buildSplash();
    this.buildGallery();
    this.buildIngredientWorld();
    this.setupFloor();
    this.setupRaycaster();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent to let rich CSS studio gradients shine through

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.perf.dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = this.perf.shadowsEnabled;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio Environment Map
    this.envMap = this.assets.createStudioEnvironment(this.renderer);
    this.scene.environment = this.envMap;

    // Master Pivot for Scroll & Camera Choreography
    this.worldGroup = new THREE.Group();
    this.worldGroup.name = 'worldGroup';
    this.scene.add(this.worldGroup);
  }

  initLights() {
    // 1. Soft Ambient Fill
    this.ambientLight = new THREE.AmbientLight(0xfff8f0, 0.45);
    this.scene.add(this.ambientLight);

    // 2. Main Key Light (Top-Right Front Softbox)
    this.keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    this.keyLight.position.set(4, 5, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 15;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // 3. Cool Rim Light (Left) - Glass edge specular highlights
    this.rimLightCool = new THREE.DirectionalLight(0xd0e8ff, 2.8);
    this.rimLightCool.position.set(-5, 2, -3);
    this.scene.add(this.rimLightCool);

    // 4. Warm Dynamic Rim Light (Right Back) - Tints liquid interior
    this.rimLightWarm = new THREE.DirectionalLight(this.currentProduct.ambientColor, 3.2);
    this.rimLightWarm.position.set(4, 1.5, -4);
    this.scene.add(this.rimLightWarm);

    // 5. Backlight Kicker (Directly behind bottle)
    this.backlight = new THREE.DirectionalLight(0xffffff, 1.4);
    this.backlight.position.set(0, 0, -6);
    this.scene.add(this.backlight);
  }

  setupFloor() {
    // Ground Shadow & Subtle Specular Floor
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.35
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -2.2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
  }

  // =========================================================================
  // HERO BOTTLE ASSEMBLY
  // =========================================================================
  buildHeroBottle() {
    this.bottleGroup = new THREE.Group();
    this.bottleGroup.name = 'heroBottleGroup';

    // Create Main Glass Bottle
    this.heroBottle = this.assets.createBottle(this.currentProduct, {
      segments: 56,
      dropletsCount: this.perf.dropletsCount
    });

    this.bottleGroup.add(this.heroBottle);
    this.bottleGroup.position.set(0, 0, 0);
    this.worldGroup.add(this.bottleGroup);

    // Cache internal meshes for rapid shader/color updates
    this.liquidMesh = this.heroBottle.getObjectByName('liquidMesh');
    this.glassMesh = this.heroBottle.getObjectByName('glassMesh');
    this.capMesh = this.heroBottle.getObjectByName('capMesh');
    this.labelMesh = this.heroBottle.getObjectByName('labelMesh');
    this.dropletsGroup = this.heroBottle.getObjectByName('dropletsGroup');
  }

  // =========================================================================
  // SURROUNDING FRUITS & EXPLOSION SYSTEM
  // =========================================================================
  buildSurroundingFruits() {
    this.fruitGroup = new THREE.Group();
    this.fruitGroup.name = 'fruitGroup';
    this.worldGroup.add(this.fruitGroup);

    // Individual fruit objects for hero and explosion sequence
    this.fruitObjects = [];

    // 1. Whole Blood Orange (Midground Left)
    const orange1 = this.assets.createWholeOrange();
    orange1.position.set(-1.6, 0.4, 0.5);
    orange1.scale.set(0.95, 0.95, 0.95);
    orange1.userData = {
      basePos: new THREE.Vector3(-1.6, 0.4, 0.5),
      explodePos: new THREE.Vector3(-3.8, 1.8, 1.2),
      rotSpeed: new THREE.Vector3(0.008, 0.012, 0.005)
    };
    this.fruitGroup.add(orange1);
    this.fruitObjects.push(orange1);

    // 2. Orange Slice 1 (Foreground Right - dramatic close-up bokeh layer)
    const slice1 = this.assets.createOrangeSlice();
    slice1.position.set(1.4, -0.6, 0.9);
    slice1.rotation.set(0.4, -0.5, 0.3);
    slice1.scale.set(1.05, 1.05, 1.05);
    slice1.userData = {
      basePos: new THREE.Vector3(1.4, -0.6, 0.9),
      explodePos: new THREE.Vector3(3.6, -1.8, 2.5),
      rotSpeed: new THREE.Vector3(0.015, -0.01, 0.012)
    };
    this.fruitGroup.add(slice1);
    this.fruitObjects.push(slice1);

    // 3. Orange Slice 2 (Upper Left Orbit)
    const slice2 = this.assets.createOrangeSlice();
    slice2.position.set(-1.1, 1.5, -0.4);
    slice2.rotation.set(-0.6, 0.8, -0.2);
    slice2.scale.set(0.85, 0.85, 0.85);
    slice2.userData = {
      basePos: new THREE.Vector3(-1.1, 1.5, -0.4),
      explodePos: new THREE.Vector3(-2.8, 3.4, -1.5),
      rotSpeed: new THREE.Vector3(-0.01, 0.014, -0.008)
    };
    this.fruitGroup.add(slice2);
    this.fruitObjects.push(slice2);

    // 4. Lush Leaves (3 dewy leaves orbiting)
    for (let i = 0; i < 3; i++) {
      const leaf = this.assets.createLeaf(0.55);
      const angle = (i * 2 * Math.PI) / 3;
      const r = 1.35;
      const lx = Math.cos(angle) * r;
      const lz = Math.sin(angle) * r;
      const ly = (i - 1) * 0.7;
      leaf.position.set(lx, ly, lz);
      leaf.rotation.set(0.5, angle, 0.4);
      leaf.userData = {
        basePos: new THREE.Vector3(lx, ly, lz),
        explodePos: new THREE.Vector3(lx * 2.8, ly * 2.4 + 1.2, lz * 2.8),
        rotSpeed: new THREE.Vector3(0.02, 0.015, -0.02)
      };
      this.fruitGroup.add(leaf);
      this.fruitObjects.push(leaf);
    }

    // 5. Flavor-specific fruits (initially hidden or tucked, revealed in scenes)
    // Mango
    this.mangoFruit = this.assets.createWholeMango();
    this.mangoFruit.position.set(1.8, 0.2, -0.5);
    this.mangoFruit.scale.set(0.001, 0.001, 0.001); // Revealed during mango state
    this.fruitGroup.add(this.mangoFruit);

    // Blueberry Cluster
    this.blueberryGroup = this.assets.createBlueberryCluster();
    this.blueberryGroup.position.set(-1.4, -0.8, 0.6);
    this.blueberryGroup.scale.set(0.001, 0.001, 0.001);
    this.fruitGroup.add(this.blueberryGroup);

    // Kiwi Slice
    this.kiwiSlice = this.assets.createKiwiSlice();
    this.kiwiSlice.position.set(1.3, 1.1, 0.3);
    this.kiwiSlice.scale.set(0.001, 0.001, 0.001);
    this.fruitGroup.add(this.kiwiSlice);

    // Strawberry
    this.strawberryFruit = this.assets.createStrawberry();
    this.strawberryFruit.position.set(-1.2, 0.9, 0.4);
    this.strawberryFruit.scale.set(0.001, 0.001, 0.001);
    this.fruitGroup.add(this.strawberryFruit);

    // 6. Suspended Juice Pearls & Floating Droplets (30 instanced or scattered pearls)
    this.pearlsGroup = new THREE.Group();
    const pearlGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: this.currentProduct.juiceColor,
      transmission: 0.9,
      roughness: 0.05,
      ior: 1.34,
      transparent: true
    });

    for (let k = 0; k < 28; k++) {
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1.0 + Math.random() * 1.6;

      const px = radius * Math.sin(phi) * Math.cos(theta);
      const py = radius * Math.sin(phi) * Math.sin(theta);
      const pz = radius * Math.cos(phi);

      pearl.position.set(px, py, pz);
      pearl.userData = {
        basePos: new THREE.Vector3(px, py, pz),
        explodePos: new THREE.Vector3(px * 2.8, py * 2.8, pz * 2.8),
        floatSpeed: 0.001 + Math.random() * 0.002
      };
      this.pearlsGroup.add(pearl);
    }
    this.fruitGroup.add(this.pearlsGroup);
  }

  // =========================================================================
  // DYNAMIC LIQUID SPLASH (SCENE 03)
  // =========================================================================
  buildSplash() {
    this.splash = this.assets.createJuiceSplash(this.currentProduct);
    this.splash.position.set(0, -0.2, -0.1);
    this.splash.scale.set(0.001, 0.001, 0.001); // Hidden until Scene 03
    this.splash.rotation.y = 0;
    this.worldGroup.add(this.splash);
  }

  // =========================================================================
  // 5-BOTTLE 3D PRODUCT GALLERY (SCENE 07)
  // =========================================================================
  buildGallery() {
    this.galleryGroup = new THREE.Group();
    this.galleryGroup.name = 'galleryGroup';
    this.galleryGroup.position.set(0, -10, 0); // Offscreen until Scene 07
    this.worldGroup.add(this.galleryGroup);

    this.galleryBottles = [];
    const arcRadius = 5.2;
    const totalBottles = PRODUCTS.length;

    PRODUCTS.forEach((prod, i) => {
      const bottle = this.assets.createBottle(prod, {
        segments: 36,
        dropletsCount: Math.floor(this.perf.dropletsCount * 0.6)
      });

      // Position in an elegant curved 3D panoramic arc
      const angle = ((i - (totalBottles - 1) / 2) * 0.38); // Centered arc
      const gx = Math.sin(angle) * arcRadius;
      const gz = (Math.cos(angle) * arcRadius) - arcRadius;

      bottle.position.set(gx, 0, gz);
      bottle.rotation.y = -angle; // Face inward toward camera
      bottle.userData = {
        product: prod,
        index: i,
        homePos: new THREE.Vector3(gx, 0, gz),
        homeRotY: -angle,
        hoverOffset: 0
      };

      this.galleryGroup.add(bottle);
      this.galleryBottles.push(bottle);
    });
  }

  // =========================================================================
  // BOTANICAL INGREDIENT SHOWCASE WORLD (SCENE 06)
  // =========================================================================
  buildIngredientWorld() {
    this.ingredientWorldGroup = new THREE.Group();
    this.ingredientWorldGroup.name = 'ingredientWorldGroup';
    this.ingredientWorldGroup.position.set(0, 15, 0); // Active during Scene 06
    this.worldGroup.add(this.ingredientWorldGroup);

    INGREDIENTS_SHOWCASE.forEach((ing, i) => {
      const node = new THREE.Group();
      node.position.set(ing.position[0], ing.position[1], ing.position[2]);

      // Matching fruit prop
      let prop;
      if (i === 0) prop = this.assets.createOrangeSlice();
      else if (i === 1) prop = this.assets.createMangoSlice();
      else if (i === 2) prop = this.assets.createBlueberryCluster();
      else if (i === 3) prop = this.assets.createKiwiSlice();
      else prop = this.assets.createStrawberry();

      prop.scale.set(0.9, 0.9, 0.9);
      node.add(prop);

      // Glowing anchor halo ring
      const haloGeo = new THREE.RingGeometry(0.55, 0.58, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: PRODUCTS[i].accentColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      node.add(halo);

      this.ingredientWorldGroup.add(node);
    });
  }

  // =========================================================================
  // FLAVOUR MORPHING & REALTIME SHADER/MATERIAL TRANSITION
  // =========================================================================
  setProduct(productIndex) {
    if (productIndex < 0 || productIndex >= PRODUCTS.length) return;
    this.activeProductIndex = productIndex;
    this.currentProduct = PRODUCTS[productIndex];

    const prod = this.currentProduct;
    const targetColor = new THREE.Color(prod.juiceColor);

    // 1. Morph liquid color & attenuation
    if (this.liquidMesh) {
      this.liquidMesh.material.color.set(targetColor);
      this.liquidMesh.material.attenuationColor.set(targetColor);
      this.liquidMesh.material.transmission = prod.liquidTransmission;
      this.liquidMesh.material.roughness = prod.liquidRoughness;
    }

    // 2. Morph metallic cap
    if (this.capMesh) {
      this.capMesh.material.color.set(new THREE.Color(prod.capColor));
    }

    // 3. Swap label texture
    if (this.labelMesh) {
      this.labelMesh.material.map = this.assets.createBottleLabelTexture(prod);
      this.labelMesh.material.needsUpdate = true;
    }

    // 4. Morph splash color
    if (this.splash) {
      const splashMat = this.splash.getObjectByName('splashMainMesh')?.material;
      if (splashMat) {
        splashMat.color.set(targetColor);
        splashMat.attenuationColor.set(targetColor);
      }
    }

    // 5. Morph Rim Lights & Pearls
    this.rimLightWarm.color.set(prod.ambientColor);
    if (this.pearlsGroup) {
      this.pearlsGroup.children.forEach(p => {
        p.material.color.set(targetColor);
      });
    }

    // 6. Reveal corresponding fruit in the transformation sequence
    if (this.mangoFruit) this.mangoFruit.scale.setScalar(productIndex === 1 ? 0.95 : 0.001);
    if (this.blueberryGroup) this.blueberryGroup.scale.setScalar(productIndex === 2 ? 1.1 : 0.001);
    if (this.kiwiSlice) this.kiwiSlice.scale.setScalar(productIndex === 3 ? 1.0 : 0.001);
    if (this.strawberryFruit) this.strawberryFruit.scale.setScalar(productIndex === 4 ? 1.0 : 0.001);
  }

  // =========================================================================
  // 3D RAYCASTER & INTERACTIVE HOVER
  // =========================================================================
  setupRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredBottle = null;

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  checkRaycast(camera) {
    if (!this.galleryGroup || this.galleryGroup.position.y > 5 || this.galleryGroup.position.y < -5) {
      return null;
    }

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(this.galleryBottles, true);

    if (intersects.length > 0) {
      // Find top-level bottle
      let obj = intersects[0].object;
      while (obj && !obj.userData?.product && obj.parent) {
        obj = obj.parent;
      }
      return obj;
    }
    return null;
  }

  // =========================================================================
  // MAIN ANIMATION LOOP
  // =========================================================================
  update(time, camera) {
    // 1. Idle Floating Micro-Motion for Hero Bottle
    const floatY = Math.sin(time * 1.5) * 0.04;
    const floatRotZ = Math.cos(time * 1.2) * 0.015;
    this.bottleGroup.position.y = floatY;
    this.bottleGroup.rotation.z = floatRotZ;

    // 2. Continuous Fruit Micro-Rotation
    this.fruitObjects.forEach(f => {
      if (f.userData?.rotSpeed) {
        f.rotation.x += f.userData.rotSpeed.x;
        f.rotation.y += f.userData.rotSpeed.y;
        f.rotation.z += f.userData.rotSpeed.z;
      }
    });

    // 3. Splash subtle pulse
    if (this.splash && this.splash.scale.x > 0.05) {
      this.splash.rotation.y += 0.008;
    }

    // 4. Gallery Hover check
    const hovered = this.checkRaycast(camera);
    this.galleryBottles.forEach(bottle => {
      if (bottle === hovered) {
        bottle.position.y = THREE.MathUtils.lerp(bottle.position.y, 0.35, 0.1);
        bottle.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
        document.body.style.cursor = 'pointer';
      } else {
        bottle.position.y = THREE.MathUtils.lerp(bottle.position.y, 0, 0.1);
        bottle.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
      }
    });
    if (!hovered && document.body.style.cursor === 'pointer') {
      document.body.style.cursor = 'default';
    }

    // Render
    this.renderer.render(this.scene, camera);
  }

  handleResize(width, height) {
    this.renderer.setSize(width, height);
  }
}

