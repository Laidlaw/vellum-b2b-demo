import { faker } from '@faker-js/faker';
import type {
  Product,
  Company,
  User,
  Quote,
  Salesperson,
  ProductCategory,
  VolumePrice,
  Review,
  Dimensions,
  QuoteItem,
  CartItem,
  Address,
  Order,
  OrderItem
} from '../../shared/types';
import {
  IMAGE_CONFIG,
  IMAGE_GENERATORS,
  PRODUCT_GENERATION,
  B2B_PRODUCTS,
  B2B_CATEGORIES,
  COMPANY_DATA,
  ORGANIZATIONAL_DATA,
  USER_GENERATION,
  DIMENSIONS,
  QUOTE_GENERATION,
  ORDER_GENERATION,
  CART_GENERATION,
  ADDRESS_GENERATION,
  TIME_RANGES,
  SALESPERSON_GENERATION,
  CATEGORY_GENERATION
} from './constants';
import { getProductImage } from './product-images';

// Mock data generators using faker

export function generateDimensions(): Dimensions {
  return {
    length: faker.number.float(DIMENSIONS.ranges.length),
    width: faker.number.float(DIMENSIONS.ranges.width),
    height: faker.number.float(DIMENSIONS.ranges.height),
    weight: faker.number.float(DIMENSIONS.ranges.weight),
    units: faker.helpers.arrayElement(DIMENSIONS.units),
    weightUnit: faker.helpers.arrayElement(DIMENSIONS.weightUnits)
  };
}

export function generateReview(): Review {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentences(2),
    dateCreated: faker.date.past(TIME_RANGES.reviewAge),
    verified: faker.datatype.boolean(PRODUCT_GENERATION.reviews.verifiedProbability)
  };
}

export function generateVolumePrice(): VolumePrice {
  const minQuantity = faker.number.int(PRODUCT_GENERATION.volumePricing.minQuantityRange);
  return {
    minQuantity,
    maxQuantity: faker.number.int({ 
      min: minQuantity + PRODUCT_GENERATION.volumePricing.maxQuantityBuffer.min, 
      max: minQuantity + PRODUCT_GENERATION.volumePricing.maxQuantityBuffer.max 
    }),
    pricePerUnit: faker.number.float(PRODUCT_GENERATION.volumePricing.priceRange),
    discountPercentage: faker.number.int(PRODUCT_GENERATION.volumePricing.discountRange)
  };
}

// ============================================================================
// PRODUCT GENERATOR CONFIGURATION
// ============================================================================

// Generate product image URL with fallback support
// Old function removed - now using curated product image system from product-images.ts


// ============================================================================
// PRODUCT GENERATORS
// ============================================================================

// Original faker-based generator - completely random products (often nonsensical)
export function generateRandomProduct(categoryId?: string): Product {
  const basePrice = faker.number.float(PRODUCT_GENERATION.pricing);
  
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    brand: faker.company.name(),
    model: faker.vehicle.model(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: faker.commerce.productDescription(),
    dimensions: generateDimensions(),
    reviews: Array.from({ length: faker.number.int({ min: 0, max: PRODUCT_GENERATION.reviews.maxCount }) }, generateReview),
    volumePricing: Array.from({ length: faker.number.int({ min: 1, max: PRODUCT_GENERATION.volumePricing.maxTiers }) }, generateVolumePrice),
    category: categoryId || faker.string.uuid(),
    basePrice,
    imageUrl: getProductImage(faker.commerce.productName(), 'General', faker.string.uuid()),
    inStock: faker.datatype.boolean(PRODUCT_GENERATION.stock.probabilityInStock),
    stockQuantity: faker.number.int({ min: 0, max: PRODUCT_GENERATION.stock.maxQuantity })
  };
}

// Styled generator with realistic B2B products and configurable images
export function generateStyledProduct(categoryId?: string): Product {
  const productTemplate = faker.helpers.arrayElement(B2B_PRODUCTS);
  const basePrice = faker.number.float(PRODUCT_GENERATION.pricing);
  const productId = faker.string.uuid();
  
  return {
    id: productId,
    name: productTemplate.name,
    brand: productTemplate.brand,
    model: faker.string.alphanumeric(6).toUpperCase(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: `Professional grade ${productTemplate.name.toLowerCase()} designed for industrial use. Built to withstand demanding work environments.`,
    dimensions: generateDimensions(),
    reviews: Array.from({ length: faker.number.int({ min: 2, max: PRODUCT_GENERATION.reviews.maxCount }) }, generateReview),
    volumePricing: Array.from({ length: faker.number.int({ min: 1, max: PRODUCT_GENERATION.volumePricing.maxTiers }) }, (_, index) => generateVolumePrice(basePrice, index)),
    category: categoryId || productTemplate.category, // Use the product template's category instead of UUID
    basePrice,
    imageUrl: getProductImage(productTemplate.name, productTemplate.category, productId),
    inStock: faker.datatype.boolean(PRODUCT_GENERATION.stock.probabilityInStock),
    stockQuantity: faker.number.int({ min: 0, max: PRODUCT_GENERATION.stock.maxQuantity }),
    
    // Enhanced product features
    isFeatured: faker.datatype.boolean(PRODUCT_GENERATION.featuredProbability),
    isPremium: faker.datatype.boolean(PRODUCT_GENERATION.premiumProbability),
    isBestseller: faker.datatype.boolean(PRODUCT_GENERATION.bestsellerProbability),
    isNewProduct: faker.datatype.boolean(PRODUCT_GENERATION.newProductProbability),
    isSeasonalPromo: faker.datatype.boolean(PRODUCT_GENERATION.seasonalPromoProbability),
    
    // Add certifications and tags from the template
    certifications: 'certifications' in productTemplate ? productTemplate.certifications : undefined,
    tags: 'tags' in productTemplate ? productTemplate.tags : []
  };
}

// Main product generator - switches between styled and random based on configuration flag
export function generateProduct(categoryId?: string): Product {
  return PRODUCT_GENERATION.useStyledProducts 
    ? generateStyledProduct(categoryId)
    : generateRandomProduct(categoryId);
}

export function generateSalesperson(): Salesperson {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    territory: faker.location.state(),
    isActive: faker.datatype.boolean(SALESPERSON_GENERATION.activeProbability)
  };
}


export function generateUser(companyId: string, role: User['role'] = 'purchaser'): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const department = faker.helpers.arrayElement(ORGANIZATIONAL_DATA.departments);
  const jobTitle = faker.helpers.arrayElement(ORGANIZATIONAL_DATA.jobTitlesByRole[role]);
  
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    role,
    department,
    location: faker.datatype.boolean(USER_GENERATION.locationProbability) ? faker.location.city() : undefined,
    companyId,
    status: faker.helpers.weightedArrayElement(USER_GENERATION.statusDistribution),
    permissions: ORGANIZATIONAL_DATA.permissionsByRole[role],
    phone: faker.datatype.boolean(USER_GENERATION.phoneProbability) ? faker.phone.number() : undefined,
    jobTitle,
    dateCreated: faker.date.past({ years: USER_GENERATION.accountAgeYears }),
    lastLogin: faker.date.recent({ days: USER_GENERATION.lastLoginDays })
  };
}

export function generateCompany(predefinedId?: string): Company {
  const companyId = predefinedId || faker.string.uuid();
  const salespersonId = faker.string.uuid();
  
  return {
    id: companyId,
    name: predefinedId ? COMPANY_DATA.defaultCompany.name : faker.company.name(),
    logoUrl: faker.image.url({ width: 200, height: 100 }),
    industry: faker.helpers.arrayElement(COMPANY_DATA.industries),
    addresses: [
      {
        id: faker.string.uuid(),
        type: 'billing' as const,
        company: faker.company.name(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: ADDRESS_GENERATION.defaultCountry,
        phone: faker.phone.number()
      }
    ],
    users: Array.from({ length: faker.number.int(COMPANY_DATA.teamSizeRange) }, () => generateUser(companyId)),
    salespersonId,
    integrationChannel: faker.helpers.arrayElement(COMPANY_DATA.integrationChannels),
    isActive: faker.datatype.boolean(COMPANY_DATA.activeProbability),
    dateCreated: faker.date.past(TIME_RANGES.companyAge)
  };
}

export function generateQuoteItem(product: Product): QuoteItem {
  const quantity = faker.number.int({ min: 1, max: 100 });
  const unitPrice = product.basePrice;
  const discount = faker.datatype.boolean(QUOTE_GENERATION.discountProbability) ? faker.number.float(QUOTE_GENERATION.discountRange) : 0;
  
  return {
    productId: product.id,
    product,
    quantity,
    unitPrice,
    discount,
    totalPrice: quantity * unitPrice * (1 - discount)
  };
}

function generateAddress(type: 'billing' | 'shipping'): Address {
  return {
    id: faker.string.uuid(),
    type,
    company: faker.company.name(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address1: faker.location.streetAddress(),
    address2: faker.datatype.boolean(ADDRESS_GENERATION.secondaryAddressProbability) ? faker.location.secondaryAddress() : undefined,
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: ADDRESS_GENERATION.defaultCountry,
    phone: faker.phone.number()
  };
}

function calculateTimeUntilExpiration(expiredDate: Date): string {
  const now = new Date();
  const diffMs = expiredDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Expires today';
  if (diffDays === 1) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month';
  return `${diffMonths} months`;
}

export function generateQuote(companyId: string, products: Product[]): Quote {
  const items = Array.from({ 
    length: faker.number.int(QUOTE_GENERATION.itemCount) 
  }, () => generateQuoteItem(faker.helpers.arrayElement(products)));
  
  const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const dateCreated = faker.date.past(TIME_RANGES.quoteHistory);
  
  // Generate expiration date from creation
  const expirationDays = faker.number.int(QUOTE_GENERATION.expirationDays);
  const dateExpired = new Date(dateCreated);
  dateExpired.setDate(dateExpired.getDate() + expirationDays);
  
  const shippingAddress = generateAddress('shipping');
  const billingAddress = generateAddress('billing');
  
  return {
    id: faker.string.uuid(),
    name: `Quote for ${faker.company.name()}`,
    dateCreated,
    dateExpired,
    amount,
    purchaseOrderNumber: faker.datatype.boolean(QUOTE_GENERATION.purchaseOrderProbability) ? faker.string.alphanumeric(10).toUpperCase() : undefined,
    status: faker.helpers.arrayElement(QUOTE_GENERATION.statuses),
    items,
    companyId,
    salespersonId: faker.string.uuid(),
    integrationChannel: faker.helpers.arrayElement(COMPANY_DATA.integrationChannels),
    approxDeliveryDate: faker.date.future({ refDate: dateExpired }),
    shippingAddress,
    billingAddress,
    orderRef: faker.string.alphanumeric(8).toUpperCase(),
    timeUntilExpiration: calculateTimeUntilExpiration(dateExpired)
  };
}

// Counter to cycle through predefined categories
let categoryCounter = 0;

export function generateProductCategory(): ProductCategory {
  const categoryTemplate = B2B_CATEGORIES[categoryCounter % B2B_CATEGORIES.length];
  categoryCounter++;
  
  return {
    id: faker.string.uuid(),
    name: categoryTemplate.name,
    description: categoryTemplate.description,
    imageUrl: faker.image.url(CATEGORY_GENERATION.imageSize),
    isActive: faker.datatype.boolean(CATEGORY_GENERATION.activeProbability)
  };
}

export function generateCartItem(product: Product): CartItem {
  return {
    productId: product.id,
    product,
    quantity: faker.number.int(CART_GENERATION.quantityRange),
    discount: faker.datatype.boolean(CART_GENERATION.discountProbability) ? faker.number.float(CART_GENERATION.discountRange) : undefined
  };
}

export function generateOrderItem(product: Product): OrderItem {
  const quantity = faker.number.int({ min: 1, max: 10 });
  const unitPrice = faker.number.float({ 
    min: product.basePrice * ORDER_GENERATION.priceVariance.min, 
    max: product.basePrice * ORDER_GENERATION.priceVariance.max, 
    fractionDigits: 2 
  });
  
  return {
    productId: product.id,
    product,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice
  };
}

export function generateOrder(products: Product[], companyId: string, userId: string): Order {
  const dateCreated = faker.date.past(TIME_RANGES.orderHistory);
  const dateConfirmed = faker.datatype.boolean(ORDER_GENERATION.confirmedProbability) ? faker.date.between({ from: dateCreated, to: new Date() }) : undefined;
  
  const itemCount = faker.number.int(ORDER_GENERATION.itemCount);
  const selectedProducts = faker.helpers.arrayElements(products, itemCount);
  const items = selectedProducts.map(product => generateOrderItem(product));
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const shippingAddress = generateAddress('shipping');
  const billingAddress = generateAddress('billing');
  
  const status = faker.helpers.arrayElement(ORDER_GENERATION.statuses);
  const paymentStatus = faker.helpers.arrayElement(ORDER_GENERATION.paymentStatuses);
  
  return {
    id: faker.string.uuid(),
    orderNumber: `#${faker.number.int({ min: 1000, max: 9999 })}`,
    status,
    dateCreated,
    dateConfirmed,
    items,
    totalAmount,
    shippingAddress,
    billingAddress,
    paymentStatus,
    paymentDueDate: paymentStatus === 'due' || paymentStatus === 'overdue' 
      ? faker.date.future({ days: ORDER_GENERATION.paymentDueDays }) 
      : undefined,
    companyId,
    userId,
    notes: faker.datatype.boolean(ORDER_GENERATION.notesProbability) ? faker.lorem.sentence() : undefined
  };
}