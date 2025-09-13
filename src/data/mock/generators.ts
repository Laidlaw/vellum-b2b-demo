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

// Mock data generators using faker

export function generateDimensions(): Dimensions {
  return {
    length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
    width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
    height: faker.number.float({ min: 1, max: 50, fractionDigits: 1 }),
    weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 1 }),
    units: faker.helpers.arrayElement(['inches', 'cm'] as const),
    weightUnit: faker.helpers.arrayElement(['lbs', 'kg'] as const)
  };
}

export function generateReview(): Review {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentences(2),
    dateCreated: faker.date.past({ years: 1 }),
    verified: faker.datatype.boolean(0.8)
  };
}

export function generateVolumePrice(): VolumePrice {
  const minQuantity = faker.number.int({ min: 1, max: 100 });
  return {
    minQuantity,
    maxQuantity: faker.number.int({ min: minQuantity + 10, max: minQuantity + 500 }),
    pricePerUnit: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    discountPercentage: faker.number.int({ min: 5, max: 25 })
  };
}

// ============================================================================
// PRODUCT GENERATOR CONFIGURATION
// ============================================================================

// Image provider configuration - easily switch between services
type ImageProvider = 'unsplash' | 'picsum' | 'placeholder' | 'static';

const IMAGE_CONFIG = {
  provider: 'picsum' as ImageProvider, // Switch provider here
  fallbackProvider: 'placeholder' as ImageProvider,
  dimensions: { width: 400, height: 400 }
};

// Image URL generators for different services
const imageGenerators = {
  unsplash: (searchTerms: string) => 
    `https://source.unsplash.com/${IMAGE_CONFIG.dimensions.width}x${IMAGE_CONFIG.dimensions.height}/?${searchTerms}`,
  
  picsum: (productId: string) => 
    `https://picsum.photos/${IMAGE_CONFIG.dimensions.width}/${IMAGE_CONFIG.dimensions.height}?random=${productId}`,
  
  placeholder: (productName: string) => 
    `https://via.placeholder.com/${IMAGE_CONFIG.dimensions.width}x${IMAGE_CONFIG.dimensions.height}/cccccc/666666?text=${encodeURIComponent(productName)}`,
  
  static: (category: string) => 
    `/images/products/${category.toLowerCase().replace(/\s+/g, '-')}.jpg`
};

// Generate product image URL with fallback support
function generateProductImage(productName: string, searchTerms: string, productId: string): string {
  try {
    switch (IMAGE_CONFIG.provider) {
      case 'unsplash':
        return imageGenerators.unsplash(searchTerms);
      case 'picsum':
        return imageGenerators.picsum(productId);
      case 'placeholder':
        return imageGenerators.placeholder(productName);
      case 'static':
        return imageGenerators.static(productName);
      default:
        return imageGenerators[IMAGE_CONFIG.fallbackProvider](productName);
    }
  } catch {
    // Fallback to placeholder if anything goes wrong
    return imageGenerators.placeholder(productName);
  }
}

// Curated B2B product catalog for realistic demo data
// Easy to expand - just add more products with matching image search terms
const B2B_PRODUCTS = [
  { name: "Steel Toe Work Boots", brand: "Caterpillar", category: "Safety Equipment", image: "construction,boots" },
  { name: "High-Visibility Safety Vest", brand: "3M", category: "Safety Equipment", image: "safety,vest" },
  { name: "Hard Hat with LED Light", brand: "MSA Safety", category: "Safety Equipment", image: "hardhat,construction" },
  { name: "Cut-Resistant Work Gloves", brand: "Mechanix", category: "Safety Equipment", image: "work,gloves" },
  { name: "Cordless Drill Kit", brand: "DeWalt", category: "Power Tools", image: "drill,tools" },
  { name: "Impact Socket Set", brand: "Craftsman", category: "Hand Tools", image: "socket,wrench" },
  { name: "Digital Multimeter", brand: "Fluke", category: "Test Equipment", image: "multimeter,electrical" },
  { name: "LED Work Light", brand: "Milwaukee", category: "Lighting", image: "worklight,LED" },
  { name: "Welding Helmet", brand: "Lincoln Electric", category: "Welding", image: "welding,helmet" },
  { name: "Hydraulic Floor Jack", brand: "Blackhawk", category: "Automotive", image: "floor,jack" },
  { name: "Industrial Wire Shelving", brand: "Metro", category: "Storage", image: "shelving,warehouse" },
  { name: "Safety Lockout Kit", brand: "Brady", category: "Safety Equipment", image: "lockout,safety" },
  { name: "Portable Generator", brand: "Honda", category: "Power Equipment", image: "generator,portable" },
  { name: "Fire Extinguisher", brand: "Amerex", category: "Safety Equipment", image: "fire,extinguisher" },
  { name: "First Aid Kit", brand: "Johnson & Johnson", category: "Medical", image: "first,aid" },
  { name: "Respirator Face Mask", brand: "3M", category: "Safety Equipment", image: "respirator,mask" },
  { name: "Cutting Torch Set", brand: "Victor", category: "Welding", image: "torch,cutting" },
  { name: "Tool Storage Cabinet", brand: "Snap-on", category: "Storage", image: "tool,cabinet" },
  { name: "Safety Eyewear", brand: "Uvex", category: "Safety Equipment", image: "safety,glasses" },
  { name: "Lifting Straps", brand: "Crosby", category: "Rigging", image: "lifting,straps" }
];

// Switch between generators here - change this to use styled products
const USE_STYLED_PRODUCTS = true;

// ============================================================================
// PRODUCT GENERATORS
// ============================================================================

// Original faker-based generator - completely random products (often nonsensical)
export function generateRandomProduct(categoryId?: string): Product {
  const basePrice = faker.number.float({ min: 20, max: 2000, fractionDigits: 2 });
  
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    brand: faker.company.name(),
    model: faker.vehicle.model(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: faker.commerce.productDescription(),
    dimensions: generateDimensions(),
    reviews: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, generateReview),
    volumePricing: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, generateVolumePrice),
    category: categoryId || faker.string.uuid(),
    basePrice,
    imageUrl: faker.image.url({ width: 400, height: 400 }),
    inStock: faker.datatype.boolean(0.9),
    stockQuantity: faker.number.int({ min: 0, max: 500 })
  };
}

// Styled generator with realistic B2B products and configurable images
export function generateStyledProduct(categoryId?: string): Product {
  const productTemplate = faker.helpers.arrayElement(B2B_PRODUCTS);
  const basePrice = faker.number.float({ min: 20, max: 2000, fractionDigits: 2 });
  const productId = faker.string.uuid();
  
  return {
    id: productId,
    name: productTemplate.name,
    brand: productTemplate.brand,
    model: faker.string.alphanumeric(6).toUpperCase(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: `Professional grade ${productTemplate.name.toLowerCase()} designed for industrial use. Built to withstand demanding work environments.`,
    dimensions: generateDimensions(),
    reviews: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, generateReview),
    volumePricing: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, generateVolumePrice),
    category: categoryId || productTemplate.category, // Use the product template's category instead of UUID
    basePrice,
    imageUrl: generateProductImage(productTemplate.name, productTemplate.image, productId),
    inStock: faker.datatype.boolean(0.9),
    stockQuantity: faker.number.int({ min: 0, max: 500 })
  };
}

// Main product generator - switches between styled and random based on USE_STYLED_PRODUCTS flag
export function generateProduct(categoryId?: string): Product {
  return USE_STYLED_PRODUCTS 
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
    isActive: faker.datatype.boolean(0.95)
  };
}

// B2B departments and job titles for realistic user generation
const B2B_DEPARTMENTS = [
  'Operations',
  'Procurement', 
  'Finance',
  'Sales',
  'Engineering',
  'Quality Assurance',
  'Warehouse',
  'Customer Service',
  'IT',
  'Human Resources'
];

const JOB_TITLES_BY_ROLE = {
  admin: [
    'Account Administrator',
    'System Administrator', 
    'Operations Manager',
    'General Manager'
  ],
  manager: [
    'Procurement Manager',
    'Department Manager',
    'Operations Supervisor',
    'Finance Manager',
    'Warehouse Manager'
  ],
  purchaser: [
    'Procurement Specialist',
    'Purchasing Agent', 
    'Buyer',
    'Supply Chain Coordinator'
  ],
  'sub-contractor': [
    'External Consultant',
    'Contract Worker',
    'Temporary Staff',
    'Freelance Specialist'
  ]
};

const PERMISSIONS_BY_ROLE = {
  admin: [
    'full_access',
    'manage_team',
    'approve_orders',
    'manage_quotes',
    'view_reports',
    'system_settings'
  ],
  manager: [
    'approve_orders',
    'manage_quotes',
    'view_reports',
    'manage_department',
    'approve_quotes'
  ],
  purchaser: [
    'create_orders',
    'view_quotes',
    'request_quotes',
    'view_products'
  ],
  'sub-contractor': [
    'view_orders',
    'view_products',
    'limited_access'
  ]
};

export function generateUser(companyId: string, role: User['role'] = 'purchaser'): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const department = faker.helpers.arrayElement(B2B_DEPARTMENTS);
  const jobTitle = faker.helpers.arrayElement(JOB_TITLES_BY_ROLE[role]);
  
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    role,
    department,
    location: faker.datatype.boolean(0.3) ? faker.location.city() : undefined,
    companyId,
    status: faker.helpers.weightedArrayElement([
      { weight: 0.8, value: 'active' as const },
      { weight: 0.15, value: 'inactive' as const },
      { weight: 0.05, value: 'pending' as const }
    ]),
    permissions: PERMISSIONS_BY_ROLE[role],
    phone: faker.datatype.boolean(0.7) ? faker.phone.number() : undefined,
    jobTitle,
    dateCreated: faker.date.past({ years: 2 }),
    lastLogin: faker.date.recent({ days: 30 })
  };
}

export function generateCompany(predefinedId?: string): Company {
  const companyId = predefinedId || faker.string.uuid();
  const salespersonId = faker.string.uuid();
  
  return {
    id: companyId,
    name: predefinedId ? 'Acme Industrial Solutions' : faker.company.name(),
    logoUrl: faker.image.url({ width: 200, height: 100 }),
    industry: faker.helpers.arrayElement([
      'Manufacturing',
      'Healthcare',
      'Technology',
      'Retail',
      'Construction',
      'Education'
    ]),
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
        country: 'US',
        phone: faker.phone.number()
      }
    ],
    users: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => generateUser(companyId)),
    salespersonId,
    integrationChannel: faker.helpers.arrayElement(['salesforce', 'hubspot', 'manual']),
    isActive: faker.datatype.boolean(0.95),
    dateCreated: faker.date.past({ years: 3 })
  };
}

export function generateQuoteItem(product: Product): QuoteItem {
  const quantity = faker.number.int({ min: 1, max: 100 });
  const unitPrice = product.basePrice;
  const discount = faker.datatype.boolean(0.3) ? faker.number.float({ min: 0.05, max: 0.2, fractionDigits: 2 }) : 0;
  
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
    address2: faker.datatype.boolean(0.3) ? faker.location.secondaryAddress() : undefined,
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: 'US',
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
    length: faker.number.int({ min: 1, max: 5 }) 
  }, () => generateQuoteItem(faker.helpers.arrayElement(products)));
  
  const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const dateCreated = faker.date.past({ years: 1 });
  
  // Generate expiration date 7-90 days from creation
  const expirationDays = faker.number.int({ min: 7, max: 90 });
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
    purchaseOrderNumber: faker.datatype.boolean(0.4) ? faker.string.alphanumeric(10).toUpperCase() : undefined,
    status: faker.helpers.arrayElement(['draft', 'pending', 'approved', 'expired', 'rejected'] as const),
    items,
    companyId,
    salespersonId: faker.string.uuid(),
    integrationChannel: faker.helpers.arrayElement(['salesforce', 'hubspot', 'manual']),
    approxDeliveryDate: faker.date.future({ refDate: dateExpired }),
    shippingAddress,
    billingAddress,
    orderRef: faker.string.alphanumeric(8).toUpperCase(),
    timeUntilExpiration: calculateTimeUntilExpiration(dateExpired)
  };
}

// Predefined B2B categories that align with the product catalog
const B2B_CATEGORIES = [
  { name: 'Safety Equipment', description: 'Personal protective equipment and safety gear for industrial environments' },
  { name: 'Power Tools', description: 'Professional-grade power tools for construction and manufacturing' },
  { name: 'Hand Tools', description: 'Manual tools and precision instruments for skilled trades' },
  { name: 'Test Equipment', description: 'Measurement and diagnostic equipment for electrical and electronic work' },
  { name: 'Lighting', description: 'Industrial and commercial lighting solutions' },
  { name: 'Welding', description: 'Welding equipment and accessories for metal fabrication' },
  { name: 'Automotive', description: 'Professional automotive tools and equipment' },
  { name: 'Storage', description: 'Industrial storage solutions and organizational systems' },
  { name: 'Power Equipment', description: 'Generators, compressors, and other power equipment' },
  { name: 'Medical', description: 'Medical supplies and first aid equipment for workplace safety' },
  { name: 'Rigging', description: 'Lifting and rigging equipment for heavy-duty applications' }
];

// Counter to cycle through predefined categories
let categoryCounter = 0;

export function generateProductCategory(): ProductCategory {
  const categoryTemplate = B2B_CATEGORIES[categoryCounter % B2B_CATEGORIES.length];
  categoryCounter++;
  
  return {
    id: faker.string.uuid(),
    name: categoryTemplate.name,
    description: categoryTemplate.description,
    imageUrl: faker.image.url({ width: 300, height: 200 }),
    isActive: faker.datatype.boolean(0.95) // Higher chance of being active for demo
  };
}

export function generateCartItem(product: Product): CartItem {
  return {
    productId: product.id,
    product,
    quantity: faker.number.int({ min: 1, max: 20 }),
    discount: faker.datatype.boolean(0.2) ? faker.number.float({ min: 0.05, max: 0.15, fractionDigits: 2 }) : undefined
  };
}

export function generateOrderItem(product: Product): OrderItem {
  const quantity = faker.number.int({ min: 1, max: 10 });
  const unitPrice = faker.number.float({ min: product.basePrice * 0.8, max: product.basePrice * 1.2, fractionDigits: 2 });
  
  return {
    productId: product.id,
    product,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice
  };
}

export function generateOrder(products: Product[], companyId: string, userId: string): Order {
  const dateCreated = faker.date.past({ years: 1 });
  const dateConfirmed = faker.datatype.boolean(0.8) ? faker.date.between({ from: dateCreated, to: new Date() }) : undefined;
  
  // Generate 1-5 order items
  const itemCount = faker.number.int({ min: 1, max: 5 });
  const selectedProducts = faker.helpers.arrayElements(products, itemCount);
  const items = selectedProducts.map(product => generateOrderItem(product));
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const shippingAddress = generateAddress('shipping');
  const billingAddress = generateAddress('billing');
  
  const status = faker.helpers.arrayElement(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const);
  const paymentStatus = faker.helpers.arrayElement(['paid', 'partial', 'due', 'overdue'] as const);
  
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
      ? faker.date.future({ days: 30 }) 
      : undefined,
    companyId,
    userId,
    notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined
  };
}