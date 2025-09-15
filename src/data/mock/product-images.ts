// Professional B2B Product Image Mapping System
// Uses local images for fast, reliable demo presentation

import { getLocalProductImage, getLocalImageProps } from '../../shared/utils/localImages';

export type ProductImageMapping = {
  [key: string]: string;
};

// Legacy: All external URLs removed - using local images only
export const CURATED_PRODUCT_IMAGES: ProductImageMapping = {
  // Empty - all external URLs removed to prevent network requests
};

// Default category images - no external URLs
export const CATEGORY_IMAGES: ProductImageMapping = {
  // Empty - using local image system exclusively
};

// Smart image selector - uses local images for fast, reliable loading
export function getProductImage(productName: string, category: string, productId: string): string {
  // Use new local image system exclusively
  return getLocalProductImage(productName, category, productId);
}

// Get CSS blur effect - consistent across all product images to focus on B2B functionality
export function getImageVariation(productId: string): { filter?: string; opacity?: number } {
  // Apply consistent blur to all images to focus attention on product details, pricing, and B2B features
  return {
    filter: 'blur(3px) brightness(1.1) saturate(0.8)',
    opacity: 0.9
  };
}

// Generate image component props for consistent styling
export function getImageProps(productName: string, category: string, productId: string) {
  // Use new local image system with built-in blur effects
  return getLocalImageProps(productName, category, productId);
}

// Get category-specific colors for professional appearance (used for local fallbacks)
function getCategoryColor(category: string): string {
  const categoryColors = {
    'Safety Equipment': '27ae60',    // Green for safety
    'Power Tools': 'e74c3c',        // Red for power
    'Hand Tools': '3498db',         // Blue for precision
    'Storage': '95a5a6',           // Gray for storage
    'Storage Solutions': '95a5a6',
    'Testing Equipment': '9b59b6',  // Purple for testing
    'Maintenance Supplies': 'f39c12', // Orange for maintenance
    'Automotive Equipment': '34495e', // Dark blue for automotive
    'Material Handling': '16a085'   // Teal for handling
  };

  return categoryColors[category as keyof typeof categoryColors] || '2c3e50';
}