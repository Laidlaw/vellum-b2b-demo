// Local B2B Product Image System
// Uses local assets stored in public/products/ for deployment compatibility

// Generic B2B product image filenames - mapped to actual files in public/products/
export const LOCAL_PRODUCT_IMAGES = {
  // Power Tools
  'drill': 'cordless-drill.jpg',
  'cordless': 'cordless-drill.jpg',
  'hammer': 'hammer-drill.jpg',
  'saw': 'circular-saw.jpg',
  'circular': 'circular-saw.jpg',
  'grinder': 'angle-grinder.jpg',
  'angle': 'angle-grinder.jpg',
  'welder': 'welder.jpg',
  'welding': 'helmet-welding.jpg',
  'generator': 'portable-generator.jpg',
  'portable': 'portable-generator.jpg',

  // Power Equipment
  'pressure': 'pressure-washer.jpg',
  'washer': 'pressure-washer.jpg',

  // Hand Tools
  'wrench': 'wrench.jpg',
  'socket': 'socket-set.jpg',
  'jack': 'hydraulic-floor-jack.jpg',
  'hydraulic': 'hydraulic-floor-jack.jpg',

  // Safety Equipment
  'helmet': 'helmet-welding.jpg',
  'hat': 'hard-hat-with-led-light.jpg',
  'hard-hat': 'hard-hat-with-led-light.jpg',
  'gloves': 'heavy-glove.jpg',
  'heavy': 'heavy-glove.jpg',
  'vinyl': 'vinyl-glove.jpg',
  'goggles': 'goggles.jpg',
  'safety': 'safety-vest.jpg',
  'vest': 'safety-vest.jpg',
  'boots': 'boot-steel-toe.jpg',
  'steel-toe': 'boot-steel-toe.jpg',
  'composite-toe': 'composite-toe-safety-boots.jpg',

  // Testing/Measurement
  'meter': 'digital-multimeter.jpg',
  'multimeter': 'digital-multimeter.jpg',
  'digital': 'digital-multimeter.jpg',
  'oscilloscope': 'oscilloscope.jpg',

  // Storage & Transport
  'shelf': 'shelving.jpg',
  'shelving': 'shelving.jpg',
  'cart': 'platform-cart.jpg',
  'platform': 'platform-cart.jpg',
  'truck': 'hand-truck.jpg',
  'hand-truck': 'hand-truck.jpg',
  'forklift': 'forklift.jpg',
  'conveyor': 'conveyor-belt.jpg',
  'belt': 'conveyor-belt.jpg',

  // Lighting/Signs
  'light': 'led-work-light.jpg',
  'led': 'led-work-light.jpg',
  'work': 'led-work-light.jpg',
  'sign': 'exit-sign.jpg',
  'exit': 'exit-sign.jpg',

  // Safety & First Aid
  'first-aid': 'first-aid-kit.jpg',
  'puller': 'cable-puller.jpg',
  'cable': 'cable-puller.jpg'
} as const;

// Category-based image mapping
const CATEGORY_IMAGE_MAP = {
  'Safety Equipment': ['helmet', 'gloves', 'goggles', 'vest', 'boots', 'mask'],
  'Power Tools': ['drill', 'saw', 'sander', 'grinder', 'welder', 'generator'],
  'Power Equipment': ['generator', 'welder', 'drill', 'grinder', 'saw'],
  'Hand Tools': ['hammer', 'wrench', 'screwdriver', 'pliers', 'toolkit'],
  'Testing Equipment': ['meter', 'gauge', 'scale'],
  'Test Equipment': ['meter', 'gauge', 'scale'],
  'Storage': ['cabinet', 'toolbox', 'shelf'],
  'Storage Solutions': ['cabinet', 'toolbox', 'shelf'],
  'Lighting': ['light', 'flashlight'],
  'Signage': ['sign']
} as const;

// Fallback generic product image
const FALLBACK_IMAGE = 'cordless-drill.jpg';

/**
 * Get appropriate local image for a product
 * Uses smart matching based on product name and category
 */
export function getLocalProductImage(productName: string, category: string, productId: string): string {
  const basePath = '/products/';

  // 1. Try exact keyword match in product name
  const nameWords = productName.toLowerCase().split(/[\s\-_]+/);
  for (const word of nameWords) {
    for (const [key, filename] of Object.entries(LOCAL_PRODUCT_IMAGES)) {
      if (word.includes(key) || key.includes(word)) {
        return basePath + filename;
      }
    }
  }

  // 2. Try category-based selection
  const categoryImages = CATEGORY_IMAGE_MAP[category as keyof typeof CATEGORY_IMAGE_MAP];
  if (categoryImages && categoryImages.length > 0) {
    // Use product ID to consistently select same image for same product
    const imageIndex = hashString(productId) % categoryImages.length;
    const selectedKey = categoryImages[imageIndex];
    return basePath + LOCAL_PRODUCT_IMAGES[selectedKey];
  }

  // 3. Fall back to generic product image
  return basePath + FALLBACK_IMAGE;
}

/**
 * Get image props with consistent blur effect for demo
 */
export function getLocalImageProps(productName: string, category: string, productId: string) {
  return {
    src: getLocalProductImage(productName, category, productId),
    alt: productName,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      //filter: 'blur(2px) brightness(1.1) saturate(0.9)',
      //opacity: 0.95
    },
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Fallback to generic product image if specific image fails
      const target = e.target as HTMLImageElement;
      if (!target.src.includes(FALLBACK_IMAGE)) {
        target.src = '/products/' + FALLBACK_IMAGE;
      }
    }
  };
}

/**
 * Simple hash function for consistent image selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * List of required image files that should be in public/products/
 */
export const REQUIRED_IMAGE_FILES = [
  ...new Set([...Object.values(LOCAL_PRODUCT_IMAGES), FALLBACK_IMAGE])
];