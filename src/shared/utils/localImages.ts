// Local B2B Product Image System
// Uses local assets stored in src/assets/products/

// Generic B2B product image filenames
export const LOCAL_PRODUCT_IMAGES = {
  // Power Tools
  'drill': 'drill.jpg',
  'saw': 'saw.jpg',
  'sander': 'sander.jpg',
  'grinder': 'grinder.jpg',
  'welder': 'welder.jpg',
  'generator': 'generator.jpg',

  // Hand Tools
  'hammer': 'hammer.jpg',
  'wrench': 'wrench.jpg',
  'screwdriver': 'screwdriver.jpg',
  'pliers': 'pliers.jpg',
  'toolkit': 'toolkit.jpg',

  // Safety Equipment
  'helmet': 'helmet.jpg',
  'gloves': 'gloves.jpg',
  'goggles': 'goggles.jpg',
  'vest': 'vest.jpg',
  'boots': 'boots.jpg',
  'mask': 'mask.jpg',

  // Testing/Measurement
  'meter': 'meter.jpg',
  'gauge': 'gauge.jpg',
  'scale': 'scale.jpg',

  // Storage
  'cabinet': 'cabinet.jpg',
  'toolbox': 'toolbox.jpg',
  'shelf': 'shelf.jpg',

  // Lighting/Signs
  'light': 'light.jpg',
  'sign': 'sign.jpg',
  'flashlight': 'flashlight.jpg'
} as const;

// Category-based image mapping
const CATEGORY_IMAGE_MAP = {
  'Safety Equipment': ['helmet', 'gloves', 'goggles', 'vest', 'boots', 'mask'],
  'Power Tools': ['drill', 'saw', 'sander', 'grinder', 'welder', 'generator'],
  'Hand Tools': ['hammer', 'wrench', 'screwdriver', 'pliers', 'toolkit'],
  'Testing Equipment': ['meter', 'gauge', 'scale'],
  'Test Equipment': ['meter', 'gauge', 'scale'],
  'Storage': ['cabinet', 'toolbox', 'shelf'],
  'Storage Solutions': ['cabinet', 'toolbox', 'shelf'],
  'Lighting': ['light', 'flashlight'],
  'Signage': ['sign']
} as const;

// Fallback generic product image
const FALLBACK_IMAGE = 'generic-product.jpg';

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
      filter: 'blur(2px) brightness(1.1) saturate(0.9)',
      opacity: 0.95
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
 * List of required image files that should be added to src/assets/products/
 */
export const REQUIRED_IMAGE_FILES = [
  ...Object.values(LOCAL_PRODUCT_IMAGES),
  FALLBACK_IMAGE
];