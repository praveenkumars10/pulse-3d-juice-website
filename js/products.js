/**
 * PULSÉ — PURE ENERGY
 * Product & Flavour Specifications
 */

export const PRODUCTS = [
  {
    id: 'blood-orange',
    number: '01',
    name: 'Blood Orange',
    tagline: 'VIBRANT RUBY CITRUS',
    subtitle: 'Cold-pressed Sicilian Tarocco & Sanguinello oranges with a zesty, bittersweet crimson finish.',
    juiceColor: 0xff3800,        // Vibrant blood orange red-orange
    liquidTransmission: 0.82,
    liquidRoughness: 0.12,
    capColor: 0xd83a15,          // Satin metallic red-orange
    accentColor: '#ff5722',
    ambientColor: 0xff6d00,
    backgroundGradient: 'radial-gradient(circle at 65% 45%, #2a0c04 0%, #120401 55%, #050201 100%)',
    stats: {
      vitaminC: '220% DV',
      sugar: '0g Added',
      calories: '95 kcal',
      antioxidants: 'High'
    },
    tastingNotes: ['Sun-Drenched Citrus', 'Ruby Grapefruit Zest', 'Subtle Raspberry Undertone'],
    origin: 'Mount Etna Volcanic Orchards, Sicily',
    nutrition: {
      servingSize: '330 ml',
      energy: '398 kJ / 95 kcal',
      fat: '0.1g',
      carbs: '22.4g',
      sugars: '19.8g (Naturally Occurring)',
      protein: '1.2g',
      salt: '< 0.01g'
    }
  },
  {
    id: 'mango-nectar',
    number: '02',
    name: 'Alphonso Mango',
    tagline: 'GOLDEN TROPICAL NECTAR',
    subtitle: 'Luscious Alphonso mango pulp balanced with passionfruit mist. Rich, velvety, and deeply aromatic.',
    juiceColor: 0xffaa00,        // Rich golden yellow-orange
    liquidTransmission: 0.78,
    liquidRoughness: 0.16,
    capColor: 0xef8f00,          // Golden brass metallic
    accentColor: '#ffb900',
    ambientColor: 0xffab00,
    backgroundGradient: 'radial-gradient(circle at 65% 45%, #291802 0%, #120900 55%, #050300 100%)',
    stats: {
      vitaminC: '160% DV',
      sugar: '0g Added',
      calories: '110 kcal',
      antioxidants: 'Beta-Carotene'
    },
    tastingNotes: ['Velvety Honey Nectar', 'Ripe Peach', 'Citrus Blossom Floral Finish'],
    origin: 'Ratnagiri Heritage Groves, India',
    nutrition: {
      servingSize: '330 ml',
      energy: '460 kJ / 110 kcal',
      fat: '0.2g',
      carbs: '26.8g',
      sugars: '23.4g (Naturally Occurring)',
      protein: '0.9g',
      salt: '< 0.01g'
    }
  },
  {
    id: 'wild-blueberry',
    number: '03',
    name: 'Wild Blueberry',
    tagline: 'NOCTURNAL ANTIOXIDANT ELIXIR',
    subtitle: 'Hand-foraged Arctic bilberries and wild blueberries. Intensely deep violet with a tart tannin profile.',
    juiceColor: 0x4a157a,        // Deep berry purple
    liquidTransmission: 0.85,
    liquidRoughness: 0.10,
    capColor: 0x3d1066,          // Deep anodized violet
    accentColor: '#8a3ffc',
    ambientColor: 0x7027c9,
    backgroundGradient: 'radial-gradient(circle at 65% 45%, #1a082c 0%, #0c0215 55%, #040108 100%)',
    stats: {
      vitaminC: '110% DV',
      sugar: '0g Added',
      calories: '85 kcal',
      antioxidants: '450mg Anthocyanins'
    },
    tastingNotes: ['Wild Forest Bilberry', 'Pomegranate Crunch', 'Dark Plum Tannins'],
    origin: 'Taiga Boreal Forests, Kainuu, Finland',
    nutrition: {
      servingSize: '330 ml',
      energy: '355 kJ / 85 kcal',
      fat: '0.1g',
      carbs: '19.5g',
      sugars: '16.2g (Naturally Occurring)',
      protein: '0.8g',
      salt: '< 0.01g'
    }
  },
  {
    id: 'golden-kiwi',
    number: '04',
    name: 'Golden Kiwi',
    tagline: 'LUMINOUS BOTANICAL REFRESH',
    subtitle: 'Cold-pressed SunGold kiwifruit with pressed green apple and lime leaf. Crisp, zesty, and electric.',
    juiceColor: 0x5aa824,        // Fresh luminous green
    liquidTransmission: 0.80,
    liquidRoughness: 0.14,
    capColor: 0x3d7e17,          // Emerald anodized
    accentColor: '#72c94a',
    ambientColor: 0x43a047,
    backgroundGradient: 'radial-gradient(circle at 65% 45%, #0d2208 0%, #051103 55%, #010501 100%)',
    stats: {
      vitaminC: '290% DV',
      sugar: '0g Added',
      calories: '90 kcal',
      antioxidants: 'Actinidin Active'
    },
    tastingNotes: ['Golden Kiwi Sweetness', 'Crisp Granny Smith', 'Crushed Lime Leaf'],
    origin: 'Te Puke Volcanic Valleys, New Zealand',
    nutrition: {
      servingSize: '330 ml',
      energy: '376 kJ / 90 kcal',
      fat: '0.1g',
      carbs: '21.0g',
      sugars: '17.5g (Naturally Occurring)',
      protein: '1.4g',
      salt: '< 0.01g'
    }
  },
  {
    id: 'alpine-strawberry',
    number: '05',
    name: 'Alpine Strawberry',
    tagline: 'RUBY CRUSHED HARVEST',
    subtitle: 'Sun-warmed woodland strawberries blended with ripe raspberries and white peach essence.',
    juiceColor: 0xdf1d45,        // Ruby red
    liquidTransmission: 0.83,
    liquidRoughness: 0.11,
    capColor: 0xb50e30,          // Crimson metallic
    accentColor: '#e82945',
    ambientColor: 0xc2185b,
    backgroundGradient: 'radial-gradient(circle at 65% 45%, #2a050f 0%, #130106 55%, #060002 100%)',
    stats: {
      vitaminC: '190% DV',
      sugar: '0g Added',
      calories: '80 kcal',
      antioxidants: '320mg Polyphenols'
    },
    tastingNotes: ['Wild Alpine Berry', 'Raspberry Blossom', 'Crisp White Peach Cleanse'],
    origin: 'Dolomite Sun Terroirs, Trentino, Italy',
    nutrition: {
      servingSize: '330 ml',
      energy: '334 kJ / 80 kcal',
      fat: '0.1g',
      carbs: '18.2g',
      sugars: '15.1g (Naturally Occurring)',
      protein: '0.7g',
      salt: '< 0.01g'
    }
  }
];

export const INGREDIENTS_SHOWCASE = [
  {
    name: 'Tarocco Blood Oranges',
    region: 'Mount Etna, Sicily',
    feature: 'Highest Anthocyanin Vitamin-C concentration of all citrus',
    position: [-2.2, 1.2, 0.5]
  },
  {
    name: 'Alphonso Mango Nectar',
    region: 'Ratnagiri, India',
    feature: 'Velvety unpasteurised sun-ripened tree pulp',
    position: [2.3, 0.8, -0.6]
  },
  {
    name: 'Wild Arctic Bilberries',
    region: 'Kainuu, Finland',
    feature: 'Foraged under 24hr midnight sun for intense bio-nutrients',
    position: [-1.8, -1.1, 0.9]
  },
  {
    name: 'SunGold Kiwi',
    region: 'Te Puke, NZ',
    feature: 'Twice the Vitamin C of oranges with natural prebiotic enzyme',
    position: [1.9, -1.3, 0.4]
  },
  {
    name: 'High-Altitude Alpine Strawberry',
    region: 'Trentino, Italy',
    feature: 'Intense aromatic woodland esters picked before dawn',
    position: [0.0, 2.1, -1.0]
  }
];

