# PULSÉ — PURE ENERGY
### Premium Cinematic 3D Beverage Website

An ultra-realistic, cinematic 3D product commercial website for **PULSÉ — PURE ENERGY**, a luxury cold-pressed botanical juice brand. The experience runs inside an interactive 3D WebGL viewport controlled entirely by user scrolling.

---

## 🌟 Key Features

1. **Photorealistic 3D Glass & Liquid Simulation**:
   - Realistic flint glass bottle with physical crown-glass refraction (`IOR: 1.52`, `transmission: 0.95`, thickness attenuation).
   - Dynamic liquid volume with internal color attenuation matching each flavor.
   - Knurled metallic threaded screw cap with anodized finish.
   - High-resolution luxury embossed foil labels generated dynamically.
   - 100+ glistening water droplets and micro-condensation pearls.
   - Parametric swirling liquid splash geometry with 35+ detached fluid droplets.

2. **Eight Choreographed Cinematic Scroll Sequences**:
   - **Scene 00 — The First Impression**: Hero vertical bottle floating with whole blood oranges, slices, and dewy leaves.
   - **Scene 01 — The Bottle Reveal**: Camera dolly-in and vertical bottle rotation with ambient warm studio lighting transition.
   - **Scene 02 — Real Fruit Explosion**: Slow-motion 3D blast of fruit wedges, citrus slices, and juice pearls across multiplane depth layers with animated nutritional stats.
   - **Scene 03 — The Juice Splash**: High-energy organic liquid splash rising and wrapping around the product.
   - **Scene 04 — The Bottle Macro Shot**: Extreme macro camera swoop showcasing glass curvature, condensation droplets, and foil label typography.
   - **Scene 05 — The Flavour Transformation**: Continuous real-time morph across all 5 flavors (Blood Orange, Alphonso Mango, Wild Blueberry, Golden Kiwi, Alpine Strawberry) with liquid, label, cap, and fruit transitions.
   - **Scene 06 — The Ingredient World**: Fly-through botanical landscape of floating fruits, seeds, and geographic terroir callouts.
   - **Scene 07 — The Floating 3D Product Gallery**: 5-bottle panoramic 3D arc lineup with interactive raycasting hover & click inspection.
   - **Scene 08 — Final Signature Hero & Call To Action**: Grand camera pull-back into master studio composition, interactive tasting vault drawer, and luxury footer.

3. **High-Performance Architecture & Adaptive 60FPS Scaler**:
   - Dynamic real-time FPS monitoring with automatic quality tier adjustment (`HIGH`, `MEDIUM`, `LOW`).
   - Adaptive device pixel ratio (DPR) throttling and particle downscaling for low-power GPUs and mobile screens.
   - Fluid Lenis smooth-scrolling synchronized with GSAP ScrollTrigger.
   - Mobile and portrait-responsive virtual camera with responsive FOV compensation.

4. **Procedural Web Audio API Commercial Soundscape**:
   - Deep warm ambient studio drone (55Hz / 110Hz).
   - Crystalline glass chime on hover and bottle interaction.
   - Crisp bandpass-filtered liquid splash sound effects.
   - Fully toggleable in navigation (`SOUND ON / OFF`).

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher) and npm installed.

### Quick Start
```bash
# Install dependencies (three, gsap, lenis, vite)
npm install

# Start the local development server
npm run dev
```

The site will be live at:
👉 **`http://localhost:3000`**

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
juice-3d-website/
├── index.html              # Semantic HTML5 layout, HUD dock, and drawer
├── package.json            # Node.js dependencies and scripts
├── vite.config.js          # Vite build and dev server configuration
├── README.md               # Project documentation
├── css/
│   └── style.css           # Luxury editorial typography, layout, HUD, drawer
└── js/
    ├── main.js             # Application bootstrapper, Lenis, UI bindings
    ├── scene.js            # Three.js scene, studio lighting, bottle & fruits
    ├── camera.js           # Virtual camera controller & mouse parallax
    ├── animations.js       # GSAP ScrollTrigger 8-scene master timeline
    ├── products.js         # 5 flavor specifications, colors, and nutrition
    ├── assets.js           # Procedural textures, 3D geometries, HDR studio map
    ├── performance.js      # FPS tracker, dynamic downscaling, adaptive DPR
    └── audio.js            # Procedural Web Audio API soundscape
```

---

## 🎨 Five Signature Flavours
1. **Blood Orange**: Cold-pressed Sicilian Tarocco & Sanguinello oranges.
2. **Alphonso Mango**: Velvety sun-ripened Indian mango nectar.
3. **Wild Blueberry**: Arctic Nordic bilberries with tannic depth.
4. **Golden Kiwi**: Crisp New Zealand SunGold kiwi with lime leaf.
5. **Alpine Strawberry**: Sun-warmed Italian woodland strawberries.

