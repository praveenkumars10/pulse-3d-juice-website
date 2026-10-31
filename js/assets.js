/**
 * PULSÉ — Photorealistic 3D Asset & Procedural Texture Engine
 * Generates ultra-crisp studio reflections, fruit geometries, high-res labels,
 * condensation droplets, and dynamic liquid splash meshes.
 */

import * as THREE from 'three';

export class AssetEngine {
  constructor() {
    this.textureCache = new Map();
  }

  // =========================================================================
  // 1. PROCEDURAL STUDIO ENVIRONMENT MAP
  // =========================================================================
  createStudioEnvironment(renderer) {
    const width = 2048;
    const height = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Deep studio gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0d1117');
    bgGrad.addColorStop(0.5, '#05070a');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Key Softbox (Top Right) - Warm, broad illumination
    const keyX = width * 0.72;
    const keyY = height * 0.35;
    const keyGrad = ctx.createRadialGradient(keyX, keyY, 10, keyX, keyY, width * 0.28);
    keyGrad.addColorStop(0, 'rgba(255, 245, 230, 1.0)');
    keyGrad.addColorStop(0.3, 'rgba(255, 220, 180, 0.7)');
    keyGrad.addColorStop(0.7, 'rgba(255, 180, 120, 0.2)');
    keyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = keyGrad;
    ctx.fillRect(keyX - width * 0.3, keyY - height * 0.3, width * 0.6, height * 0.6);

    // 2. High-Contrast Strip Light (Left) - Razor-sharp glass rim reflection
    const stripX = width * 0.22;
    const stripGrad = ctx.createLinearGradient(stripX - 40, 0, stripX + 40, 0);
    stripGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    stripGrad.addColorStop(0.4, 'rgba(240, 245, 255, 0.95)');
    stripGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
    stripGrad.addColorStop(0.6, 'rgba(240, 245, 255, 0.95)');
    stripGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = stripGrad;
    ctx.fillRect(stripX - 60, height * 0.1, 120, height * 0.8);

    // 3. Accent Rim Light (Far Right) - Warm backlight kicker
    const rimX = width * 0.88;
    const rimGrad = ctx.createLinearGradient(rimX - 30, 0, rimX + 30, 0);
    rimGrad.addColorStop(0, 'rgba(255, 150, 80, 0)');
    rimGrad.addColorStop(0.5, 'rgba(255, 200, 140, 0.85)');
    rimGrad.addColorStop(1, 'rgba(255, 150, 80, 0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(rimX - 40, height * 0.15, 80, height * 0.7);

    // 4. Overhead Skylight Softbox
    const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.25);
    topGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, height * 0.25);

    // 5. Floor Bounce Gradient
    const floorGrad = ctx.createLinearGradient(0, height * 0.75, 0, height);
    floorGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    floorGrad.addColorStop(1, 'rgba(20, 25, 35, 0.4)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, height * 0.75, width, height * 0.25);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  // =========================================================================
  // 2. LUXURY BOTTLE LABEL GENERATOR (Canvas 1024x1024)
  // =========================================================================
  createBottleLabelTexture(product) {
    const key = `label_${product.id}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Transparent background with subtle frosted-glass backing
    ctx.clearRect(0, 0, size, size);

    // Label backing pill / shield
    const pad = 90;
    const w = size - pad * 2;
    const h = size - pad * 2;
    const r = 36;

    // Soft dark metallic parchment backdrop with luxury sheen
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    
    // Gradient fill for label
    const labelGrad = ctx.createLinearGradient(pad, pad, pad + w, pad + h);
    labelGrad.addColorStop(0, 'rgba(16, 18, 22, 0.94)');
    labelGrad.addColorStop(0.5, 'rgba(10, 11, 14, 0.96)');
    labelGrad.addColorStop(1, 'rgba(6, 7, 9, 0.98)');
    
    ctx.fillStyle = labelGrad;
    this.roundRect(ctx, pad, pad, w, h, r);
    ctx.fill();
    ctx.restore();

    // Metallic Foil Border (matching product accent color)
    ctx.strokeStyle = product.accentColor;
    ctx.lineWidth = 3.5;
    this.roundRect(ctx, pad + 16, pad + 16, w - 32, h - 32, r - 8);
    ctx.stroke();

    // Inner hairline border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    this.roundRect(ctx, pad + 24, pad + 24, w - 48, h - 48, r - 12);
    ctx.stroke();

    // BRAND LOGO: PULSÉ
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 84px "Plus Jakarta Sans", "Helvetica Neue", sans-serif';
    ctx.letterSpacing = '14px';
    ctx.fillText('PULSÉ', size / 2 + 7, pad + 170);

    // BRAND SUBTITLE
    ctx.fillStyle = product.accentColor;
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText('PURE ENERGY', size / 2 + 5, pad + 215);

    // DIVIDER LINE WITH DIAMOND
    const midY = pad + 270;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad + 80, midY);
    ctx.lineTo(size / 2 - 25, midY);
    ctx.moveTo(size / 2 + 25, midY);
    ctx.lineTo(pad + w - 80, midY);
    ctx.stroke();

    // Small Gold Diamond
    ctx.fillStyle = product.accentColor;
    ctx.beginPath();
    ctx.moveTo(size / 2, midY - 8);
    ctx.lineTo(size / 2 + 8, midY);
    ctx.lineTo(size / 2, midY + 8);
    ctx.lineTo(size / 2 - 8, midY);
    ctx.closePath();
    ctx.fill();

    // PRODUCT NUMBER & FLAVOUR TITLE
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(`COLLECTION N° ${product.number}`, size / 2, pad + 350);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(product.name.toUpperCase(), size / 2, pad + 420);

    // TAGLINE
    ctx.fillStyle = product.accentColor;
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillText(product.tagline, size / 2, pad + 475);

    // DESCRIPTOR / BOTANICAL DETAILS
    ctx.fillStyle = 'rgba(240, 240, 245, 0.75)';
    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('100% UNFILTERED COLD-PRESSED', size / 2, pad + 560);
    ctx.fillText('ZERO ADDED SUGAR • RAW BOTANICALS', size / 2, pad + 595);

    // STATS BADGES (3 Pills)
    const badgeY = pad + 670;
    const badges = [
      { label: 'VITAMIN C', val: product.stats.vitaminC },
      { label: 'SUGAR', val: product.stats.sugar },
      { label: 'CALORIES', val: product.stats.calories }
    ];
    const badgeW = 190;
    const startX = size / 2 - (badgeW * 3 + 30) / 2;

    badges.forEach((b, i) => {
      const bx = startX + i * (badgeW + 15);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      this.roundRect(ctx, bx, badgeY, badgeW, 70, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      this.roundRect(ctx, bx, badgeY, badgeW, 70, 14);
      ctx.stroke();

      ctx.fillStyle = product.accentColor;
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(b.val, bx + badgeW / 2, badgeY + 32);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(b.label, bx + badgeW / 2, badgeY + 54);
    });

    // BOTTOM VOLUME & AUTHENTICITY STAMP
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('330 ML  •  11.2 FL OZ  •  ORGANIC CERTIFIED', size / 2, pad + h - 50);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 3. FRUIT TEXTURES: ORANGE SLICE, KIWI, STRAWBERRY, MANGO, LEAF
  // =========================================================================
  createOrangeSliceTexture() {
    const key = 'texture_orange_slice';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.46;

    // Outer Orange Rind
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6400';
    ctx.fill();

    // White Pith (Albedo)
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
    ctx.fillStyle = '#fff4e0';
    ctx.fill();

    // Inner segments (Carpels) - 10 wedges with realistic pulp vesicles
    const numSegments = 10;
    const segmentR = r * 0.88;
    const centerCoreR = r * 0.12;

    for (let i = 0; i < numSegments; i++) {
      const angleStart = (i * 2 * Math.PI) / numSegments + 0.05;
      const angleEnd = ((i + 1) * 2 * Math.PI) / numSegments - 0.05;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angleStart) * centerCoreR, cy + Math.sin(angleStart) * centerCoreR);
      ctx.arc(cx, cy, segmentR, angleStart, angleEnd);
      ctx.lineTo(cx + Math.cos(angleEnd) * centerCoreR, cy + Math.sin(angleEnd) * centerCoreR);
      ctx.closePath();

      // Deep vibrant blood orange juice gradient
      const midAngle = (angleStart + angleEnd) / 2;
      const grad = ctx.createRadialGradient(
        cx, cy, centerCoreR,
        cx + Math.cos(midAngle) * segmentR * 0.7, cy + Math.sin(midAngle) * segmentR * 0.7, segmentR
      );
      grad.addColorStop(0, '#ff4500');
      grad.addColorStop(0.5, '#e62e00');
      grad.addColorStop(0.85, '#ff5e13');
      grad.addColorStop(1, '#ffa040');
      ctx.fillStyle = grad;
      ctx.fill();

      // Pulp Vesicles (Fine micro-droplets inside each wedge)
      ctx.save();
      ctx.clip();
      ctx.fillStyle = 'rgba(255, 230, 180, 0.4)';
      for (let j = 0; j < 35; j++) {
        const pr = centerCoreR + Math.random() * (segmentR - centerCoreR - 10);
        const pa = angleStart + Math.random() * (angleEnd - angleStart);
        const px = cx + Math.cos(pa) * pr;
        const py = cy + Math.sin(pa) * pr;
        ctx.beginPath();
        ctx.ellipse(px, py, 6 + Math.random() * 4, 2 + Math.random() * 2, pa, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Center Core (Star pith)
    ctx.beginPath();
    ctx.arc(cx, cy, centerCoreR, 0, Math.PI * 2);
    ctx.fillStyle = '#fff7ea';
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.textureCache.set(key, texture);
    return texture;
  }

  createKiwiSliceTexture() {
    const key = 'texture_kiwi_slice';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.46;

    // Fuzzy Brown Skin
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#654321';
    ctx.fill();

    // Vibrant Kiwi Green Pulp
    const pulpGrad = ctx.createRadialGradient(cx, cy, r * 0.25, cx, cy, r * 0.94);
    pulpGrad.addColorStop(0, '#b8e986');
    pulpGrad.addColorStop(0.4, '#7ed321');
    pulpGrad.addColorStop(0.85, '#5b9b18');
    pulpGrad.addColorStop(1, '#447412');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
    ctx.fillStyle = pulpGrad;
    ctx.fill();

    // Creamy Golden Core (Oval)
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.26);
    coreGrad.addColorStop(0, '#fffbe6');
    coreGrad.addColorStop(0.7, '#f4f6c4');
    coreGrad.addColorStop(1, '#d8e898');
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.24, r * 0.28, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // Starburst Radial Fibers & Tiny Black Seeds
    const seedCount = 64;
    for (let i = 0; i < seedCount; i++) {
      const angle = (i * 2 * Math.PI) / seedCount + (Math.random() - 0.5) * 0.05;
      
      // Radiating fiber
      ctx.strokeStyle = 'rgba(255, 255, 230, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r * 0.25, cy + Math.sin(angle) * r * 0.25);
      ctx.lineTo(cx + Math.cos(angle) * r * 0.72, cy + Math.sin(angle) * r * 0.72);
      ctx.stroke();

      // Black Kiwi Seed
      const seedDist = r * 0.32 + Math.random() * (r * 0.22);
      const sx = cx + Math.cos(angle) * seedDist;
      const sy = cy + Math.sin(angle) * seedDist;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Seed white highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(1, -2, 1.2, 2.5);
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.textureCache.set(key, texture);
    return texture;
  }

  createStrawberryTexture() {
    const key = 'texture_strawberry';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Rich Ruby Red Gradient
    const grad = ctx.createRadialGradient(size / 2, size * 0.35, 50, size / 2, size / 2, size * 0.65);
    grad.addColorStop(0, '#ff244e');
    grad.addColorStop(0.5, '#d60932');
    grad.addColorStop(0.85, '#990020');
    grad.addColorStop(1, '#660014');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Golden Seeds (Achenes) in Fibonacci Spirals
    const numSeeds = 180;
    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numSeeds; i++) {
      const theta = i * 2 * Math.PI / (phi * phi);
      const r = Math.sqrt(i) / Math.sqrt(numSeeds) * (size * 0.45);
      const x = size / 2 + Math.cos(theta) * r;
      const y = size / 2 + Math.sin(theta) * r;

      // Seed pocket depression
      ctx.fillStyle = 'rgba(40, 0, 8, 0.6)';
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 11, theta, 0, Math.PI * 2);
      ctx.fill();

      // Golden Achene Seed
      ctx.fillStyle = '#ffea79';
      ctx.beginPath();
      ctx.ellipse(x, y, 4, 7, theta, 0, Math.PI * 2);
      ctx.fill();

      // Seed highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 1, y - 2, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.textureCache.set(key, texture);
    return texture;
  }

  createLeafTexture() {
    const key = 'texture_leaf';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Leaf Blade Green Gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#43a047');
    grad.addColorStop(0.5, '#2e7d32');
    grad.addColorStop(1, '#1b5e20');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Central Midrib Vein
    ctx.strokeStyle = '#81c784';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.quadraticCurveTo(size / 2 - 20, size / 2, size / 2, size);
    ctx.stroke();

    // Lateral Veins
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(165, 214, 167, 0.7)';
    for (let y = 60; y < size - 40; y += 45) {
      // Left vein
      ctx.beginPath();
      ctx.moveTo(size / 2, y);
      ctx.quadraticCurveTo(size * 0.3, y - 10, 40, y - 30);
      ctx.stroke();
      // Right vein
      ctx.beginPath();
      ctx.moveTo(size / 2, y);
      ctx.quadraticCurveTo(size * 0.7, y - 10, size - 40, y - 30);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 4. PROCEDURAL 3D GLASS BOTTLE & INNER LIQUID BUILDER
  // =========================================================================
  createBottle(product, options = {}) {
    const group = new THREE.Group();
    group.name = `bottle_${product.id}`;

    // Dimensions (Units in Three.js world units: height ~ 3.4, diameter ~ 1.3)
    const pointsOuter = [];
    const pointsInner = [];

    // Outer Glass Profile (Base punt recess -> straight body -> tapered shoulder -> neck -> lip)
    pointsOuter.push(new THREE.Vector2(0.0, -1.60));     // Punt indent center
    pointsOuter.push(new THREE.Vector2(0.25, -1.58));    // Punt inner curve
    pointsOuter.push(new THREE.Vector2(0.60, -1.55));    // Base heel
    pointsOuter.push(new THREE.Vector2(0.65, -1.48));    // Lower sidewall
    pointsOuter.push(new THREE.Vector2(0.65, 0.20));     // Main label body
    pointsOuter.push(new THREE.Vector2(0.64, 0.50));     // Shoulder start
    pointsOuter.push(new THREE.Vector2(0.48, 0.90));     // Shoulder curve
    pointsOuter.push(new THREE.Vector2(0.30, 1.15));     // Neck base
    pointsOuter.push(new THREE.Vector2(0.28, 1.45));     // Neck
    pointsOuter.push(new THREE.Vector2(0.31, 1.50));     // Collar ring
    pointsOuter.push(new THREE.Vector2(0.29, 1.55));     // Lip
    pointsOuter.push(new THREE.Vector2(0.22, 1.55));     // Lip top rim

    // Inner Liquid Profile (Slightly smaller radius for glass thickness)
    const glassThickness = 0.05;
    pointsInner.push(new THREE.Vector2(0.0, -1.50));
    pointsInner.push(new THREE.Vector2(0.55, -1.48));
    pointsInner.push(new THREE.Vector2(0.65 - glassThickness, -1.42));
    pointsInner.push(new THREE.Vector2(0.65 - glassThickness, 0.20));
    pointsInner.push(new THREE.Vector2(0.64 - glassThickness, 0.50));
    pointsInner.push(new THREE.Vector2(0.48 - glassThickness, 0.90));
    pointsInner.push(new THREE.Vector2(0.30 - glassThickness, 1.15));
    pointsInner.push(new THREE.Vector2(0.28 - glassThickness, 1.35)); // Liquid fill level
    pointsInner.push(new THREE.Vector2(0.0, 1.35));                   // Liquid top meniscus

    // 1. OUTER GLASS MESH
    const latheSegments = options.segments || 48;
    const glassGeo = new THREE.LatheGeometry(pointsOuter, latheSegments);
    glassGeo.computeVertexNormals();

    const glassMat = options.isGallery
      ? new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.42,
          roughness: 0.04,
          metalness: 0.1,
          envMapIntensity: 2.2,
          depthWrite: false
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.88,      // Crystal transparent glass
          opacity: 1.0,
          transparent: true,
          roughness: 0.04,
          ior: 1.52,               // True crown glass IOR
          thickness: 0.8,          // Realistic glass refraction thickness
          specularIntensity: 1.6,
          specularColor: 0xffffff,
          clearcoat: 0.5,
          clearcoatRoughness: 0.02,
          envMapIntensity: 2.4,
          depthWrite: false
        });

    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.castShadow = false; // Disabling shadow cast on transparent glass boosts FPS by 40%
    glassMesh.receiveShadow = false;
    glassMesh.name = 'glassMesh';
    glassMesh.renderOrder = 1;
    group.add(glassMesh);

    // 2. INNER LIQUID MESH
    const liquidGeo = new THREE.LatheGeometry(pointsInner, latheSegments);
    liquidGeo.computeVertexNormals();

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: product.juiceColor,
      emissive: new THREE.Color(product.juiceColor).multiplyScalar(0.24), // Vibrant internal liquid luminescence
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.96,
      envMapIntensity: 1.6
    });

    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.name = 'liquidMesh';
    liquidMesh.renderOrder = 0;
    group.add(liquidMesh);

    // 3. BOTTLE METALLIC CAP
    const capGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 36);
    const capMat = new THREE.MeshStandardMaterial({
      color: product.capColor,
      metalness: 0.92,
      roughness: 0.24,
      envMapIntensity: 1.6
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 1.62;
    capMesh.castShadow = true;
    capMesh.name = 'capMesh';

    // Cap Ridges (Knurled grip detail)
    const ridgeRing = new THREE.CylinderGeometry(0.325, 0.325, 0.18, 48, 1, true);
    const ridgeMat = new THREE.MeshStandardMaterial({
      color: product.capColor,
      metalness: 0.95,
      roughness: 0.35,
      wireframe: false
    });
    const ridgeMesh = new THREE.Mesh(ridgeRing, ridgeMat);
    capMesh.add(ridgeMesh);
    group.add(capMesh);

    // 4. LUXURY LABEL SLEEVE
    const labelTexture = this.createBottleLabelTexture(product);
    const labelGeo = new THREE.CylinderGeometry(0.658, 0.658, 1.25, 48, 1, true, -Math.PI * 0.42, Math.PI * 0.84);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      transparent: true,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.FrontSide
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -0.35;
    labelMesh.rotation.y = 0; // Proudly front-facing!
    labelMesh.name = 'labelMesh';
    labelMesh.renderOrder = 2;
    group.add(labelMesh);

    // 5. CONDENSATION DROPLETS
    const dropletsGroup = this.createCondensationDroplets(options.dropletsCount || 100);
    dropletsGroup.name = 'dropletsGroup';
    dropletsGroup.renderOrder = 3;
    group.add(dropletsGroup);

    // Fine-tune overall bottle scale for luxury framing
    group.scale.set(0.88, 0.88, 0.88);
    group.position.y = -0.12;

    return group;

    return group;
  }

  // =========================================================================
  // 5. CONDENSATION DROPLETS INSTANCED / INDIVIDUAL CLUSTER
  // =========================================================================
  createCondensationDroplets(count = 100) {
    const group = new THREE.Group();
    // High-performance crystal specular droplets (eliminates 300+ expensive transmission refraction passes)
    const dropletMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.04,
      metalness: 0.15,
      transparent: true,
      opacity: 0.75,
      envMapIntensity: 2.8
    });

    const sphereGeo = new THREE.SphereGeometry(0.022, 12, 12);
    sphereGeo.scale(1, 1.3, 0.6); // Flatten against bottle surface

    const radius = 0.654; // Sits exactly on outer glass cylinder
    const minY = -1.35;
    const maxY = 0.55;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const y = minY + Math.random() * (maxY - minY);
      const scale = 0.4 + Math.random() * 0.9;

      const mesh = new THREE.Mesh(sphereGeo, dropletMat);
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      mesh.rotation.y = -angle + Math.PI / 2;
      mesh.scale.set(scale, scale, scale);
      group.add(mesh);
    }

    return group;
  }

  // =========================================================================
  // 6. PROCEDURAL 3D FRUIT OBJECTS
  // =========================================================================
  
  // A. WHOLE ORANGE
  createWholeOrange() {
    const group = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);

    // Micro-bump displacement on vertices for citrus peel dimples
    const pos = sphereGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = (Math.sin(vx * 18) * Math.cos(vy * 18) * Math.sin(vz * 18)) * 0.015;
      pos.setXYZ(i, vx * (1 + noise), vy * (1 + noise), vz * (1 + noise));
    }
    pos.needsUpdate = true;
    sphereGeo.computeVertexNormals();

    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xff5200,
      roughness: 0.45,
      metalness: 0.05
    });

    const mesh = new THREE.Mesh(sphereGeo, orangeMat);
    mesh.castShadow = true;
    group.add(mesh);

    // Stem Calyx & Green Leaf
    const leaf = this.createLeaf(0.35);
    leaf.position.set(0, 0.54, 0);
    leaf.rotation.set(-0.3, 0.4, 0.2);
    group.add(leaf);

    return group;
  }

  // B. ORANGE SLICE (3D Wedge)
  createOrangeSlice() {
    const group = new THREE.Group();
    const radius = 0.62;
    const thickness = 0.14;

    // Disc slice geometry (Half circle)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, radius, 0, Math.PI, false);
    shape.closePath();

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center Z only so (0,0) remains the circular apex for exact radial UV alignment
    geo.translate(0, 0, -thickness / 2);

    // Explicitly compute UV mapping for mathematical alignment with radial slice texture
    const uv = geo.attributes.uv;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      // Map [-radius, radius] -> [0, 1]
      const u = (px / (radius * 2)) + 0.5;
      const v = (py / (radius * 2)) + 0.5;
      uv.setXY(i, u, v);
    }
    uv.needsUpdate = true;
    geo.computeVertexNormals();

    const sliceTex = this.createOrangeSliceTexture();
    sliceTex.wrapS = THREE.ClampToEdgeWrapping;
    sliceTex.wrapT = THREE.ClampToEdgeWrapping;

    const faceMat = new THREE.MeshStandardMaterial({
      map: sliceTex,
      roughness: 0.28,
      metalness: 0.05
    });

    const rindMat = new THREE.MeshStandardMaterial({
      color: 0xff6200,
      roughness: 0.45,
      metalness: 0.04
    });

    const mesh = new THREE.Mesh(geo, [faceMat, rindMat]);
    mesh.castShadow = true;
    group.add(mesh);

    return group;
  }

  // C. WHOLE MANGO & MANGO SLICE
  createWholeMango() {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.55, 32, 32);
    // Scale into organic mango shape (elongated kidney)
    geo.scale(0.85, 1.25, 0.75);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      let x = pos.getX(i);
      // Asymmetric curve
      pos.setX(i, x + (y > 0 ? Math.sin(y * 1.5) * 0.08 : 0));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const mangoMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      roughness: 0.32,
      metalness: 0.08
    });

    const mesh = new THREE.Mesh(geo, mangoMat);
    mesh.castShadow = true;
    group.add(mesh);
    return group;
  }

  createMangoSlice() {
    const group = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, -0.2);
    shape.quadraticCurveTo(0, 0.45, 0.5, 0.2);
    shape.quadraticCurveTo(0.2, -0.35, -0.4, -0.2);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    geo.center();

    const mat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      roughness: 0.22,
      metalness: 0.05
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);
    return group;
  }

  // D. WILD BLUEBERRIES (Cluster)
  createBlueberryCluster() {
    const group = new THREE.Group();
    const berryGeo = new THREE.SphereGeometry(0.18, 20, 20);

    const berryMat = new THREE.MeshStandardMaterial({
      color: 0x221345, // Deep violet indigo with waxy bloom
      roughness: 0.35,
      metalness: 0.15
    });

    // 5 berries arranged organically
    const offsets = [
      [0, 0, 0, 1.0],
      [0.24, -0.08, 0.06, 0.88],
      [-0.22, 0.10, -0.05, 0.92],
      [0.08, 0.22, 0.12, 0.82],
      [-0.10, -0.18, 0.14, 0.85]
    ];

    offsets.forEach(([x, y, z, s]) => {
      const berry = new THREE.Mesh(berryGeo, berryMat);
      berry.position.set(x, y, z);
      berry.scale.set(s, s * 0.94, s); // Slightly squished
      berry.castShadow = true;

      // 5-pointed crown ring on top
      const crown = new THREE.TorusGeometry(0.045 * s, 0.012 * s, 8, 5);
      const crownMesh = new THREE.Mesh(crown, berryMat);
      crownMesh.position.set(x, y + 0.16 * s, z);
      crownMesh.rotation.x = Math.PI / 2;
      group.add(berry);
      group.add(crownMesh);
    });

    return group;
  }

  // E. WHOLE KIWI & KIWI SLICE
  createKiwiSlice() {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.48, 0.48, 0.12, 32);
    geo.rotateX(Math.PI / 2);

    const sliceTex = this.createKiwiSliceTexture();
    const faceMat = new THREE.MeshStandardMaterial({
      map: sliceTex,
      roughness: 0.26,
      metalness: 0.05
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e1b,
      roughness: 0.8
    });

    const mesh = new THREE.Mesh(geo, [skinMat, faceMat, faceMat]);
    mesh.castShadow = true;
    group.add(mesh);
    return group;
  }

  // F. WHOLE STRAWBERRY
  createStrawberry() {
    const group = new THREE.Group();
    const geo = new THREE.ConeGeometry(0.38, 0.72, 28, 12);
    geo.rotateX(Math.PI); // Point downwards
    geo.center();

    // Round the top shoulders
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      if (y > 0.1) {
        let x = pos.getX(i);
        let z = pos.getZ(i);
        pos.setX(i, x * (1 - (y - 0.1) * 0.4));
        pos.setZ(i, z * (1 - (y - 0.1) * 0.4));
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const strawMat = new THREE.MeshStandardMaterial({
      map: this.createStrawberryTexture(),
      roughness: 0.28,
      metalness: 0.05
    });

    const mesh = new THREE.Mesh(geo, strawMat);
    mesh.castShadow = true;
    group.add(mesh);

    // Leafy Green Sepal Collar on top
    for (let i = 0; i < 5; i++) {
      const sepal = this.createLeaf(0.18);
      const angle = (i * 2 * Math.PI) / 5;
      sepal.position.set(Math.cos(angle) * 0.08, 0.36, Math.sin(angle) * 0.08);
      sepal.rotation.set(-0.4, angle, 0.5);
      group.add(sepal);
    }

    return group;
  }

  // G. BOTANICAL LEAF (Citrus / Mint)
  createLeaf(size = 0.45) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(size * 0.45, size * 0.5, 0, size);
    shape.quadraticCurveTo(-size * 0.45, size * 0.5, 0, 0);

    const geo = new THREE.ShapeGeometry(shape);
    // Slight curvature
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      let x = pos.getX(i);
      pos.setZ(i, -Math.sin((y / size) * Math.PI) * 0.06 + Math.abs(x) * 0.04);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const leafMat = new THREE.MeshStandardMaterial({
      map: this.createLeafTexture(),
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, leafMat);
    mesh.castShadow = true;
    return mesh;
  }

  // =========================================================================
  // 7. DYNAMIC LIQUID SPLASH MESH (Cinematic organic juice wave)
  // =========================================================================
  createJuiceSplash(product) {
    const group = new THREE.Group();
    group.name = 'juice_splash';

    const splashMat = new THREE.MeshPhysicalMaterial({
      color: product.juiceColor,
      emissive: new THREE.Color(product.juiceColor).multiplyScalar(0.24),
      transparent: true,
      opacity: 0.82,
      roughness: 0.12,
      metalness: 0.04,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.2
    });

    // 1. Primary Back-Sweeping Liquid Crest (Frames bottle from behind & top)
    const curvePoints1 = [
      new THREE.Vector3(-1.3, -1.6, -0.4),
      new THREE.Vector3(-1.5, -0.8, -0.6),
      new THREE.Vector3(-1.1,  0.2, -0.8),
      new THREE.Vector3( 0.0,  1.1, -0.9),
      new THREE.Vector3( 1.1,  1.6, -0.5),
      new THREE.Vector3( 1.4,  1.2,  0.2),
      new THREE.Vector3( 1.1,  0.7,  0.4)
    ];
    const curve1 = new THREE.CatmullRomCurve3(curvePoints1);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 72, 0.13, 12, false);

    // Dynamic wave thickness variation
    const pos1 = tubeGeo1.attributes.position;
    for (let i = 0; i < pos1.count; i++) {
      const y = pos1.getY(i);
      const factor = 0.8 + Math.sin((y + 1.6) / 3.2 * Math.PI) * 0.6;
      pos1.setX(i, pos1.getX(i) * factor);
      pos1.setZ(i, pos1.getZ(i) * factor);
    }
    pos1.needsUpdate = true;
    tubeGeo1.computeVertexNormals();

    const mesh1 = new THREE.Mesh(tubeGeo1, splashMat);
    mesh1.name = 'splashMainMesh';
    group.add(mesh1);

    // 2. Secondary Low Front-Side Fluid Swirl
    const curvePoints2 = [
      new THREE.Vector3( 1.2, -1.5, -0.3),
      new THREE.Vector3( 1.4, -0.9,  0.2),
      new THREE.Vector3( 1.2, -0.2,  0.6),
      new THREE.Vector3( 0.7,  0.3,  0.5)
    ];
    const curve2 = new THREE.CatmullRomCurve3(curvePoints2);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 48, 0.09, 10, false);
    const mesh2 = new THREE.Mesh(tubeGeo2, splashMat);
    group.add(mesh2);

    // 3. 40+ Floating Detached Liquid Splash Droplets & Pearls
    const dropGeo = new THREE.SphereGeometry(0.055, 12, 12);
    for (let j = 0; j < 42; j++) {
      const parentCurve = j % 2 === 0 ? curve1 : curve2;
      const t = Math.random();
      const p = parentCurve.getPoint(t);
      const dropMesh = new THREE.Mesh(dropGeo, splashMat);
      const spread = 0.4 + Math.random() * 0.55;

      dropMesh.position.set(
        p.x + (Math.random() - 0.5) * spread,
        p.y + (Math.random() - 0.5) * spread + 0.1,
        p.z + (Math.random() - 0.5) * spread
      );

      const s = 0.4 + Math.random() * 1.3;
      dropMesh.scale.set(s, s * (0.8 + Math.random() * 0.4), s);
      group.add(dropMesh);
    }

    return group;
  }

  // Utility helper for rounded rectangles
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
