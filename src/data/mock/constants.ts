/**
 * Mock Data Generation Constants
 * 
 * Organized by functional domain for maintainability and easy extension.
 * Each section contains related constants grouped logically.
 */

// ============================================================================
// IMAGE & MEDIA CONFIGURATION
// ============================================================================

export type ImageProvider = 'unsplash' | 'picsum' | 'placeholder' | 'static' | 'local';

export const IMAGE_CONFIG = {
  provider: 'local' as ImageProvider, // Use local assets for demo performance
  fallbackProvider: 'local' as ImageProvider, // No external fallbacks
  dimensions: { width: 400, height: 400 }
} as const;

// Local product images from public/products/ (deployed via public directory)
export const PRODUCT_IMAGES = {
  'img-001': 'angle-grinder.jpg',
  'img-002': 'circular-saw.jpg',
  'img-003': 'cable-puller.jpg',
  'img-004': 'composite-toe-safety-boots.jpg',
  'img-005': 'cordless-drill.jpg',
  'img-006': 'heavy-glove.jpg',
  'img-007': 'vinyl-glove.jpg',
  'img-008': 'digital-multimeter.jpg',
  'img-009': 'exit-sign.jpg',
  'img-010': 'conveyor-belt.jpg',
  'img-011': 'first-aid-kit.jpg',
  'img-012': 'forklift.jpg',
  'img-013': 'hammer-drill.jpg',
  'img-014': 'hand-truck.jpg',
  'img-015': 'hard-hat-with-led-light.jpg',
  'img-016': 'safety-vest.jpg',
  'img-017': 'hydraulic-floor-jack.jpg',
  'img-018': 'socket-set.jpg',
  'img-019': 'shelving.jpg',
  'img-020': 'led-work-light.jpg',
  'img-021': 'welder.jpg',
  'img-022': 'oscilloscope.jpg',
  'img-023': 'platform-cart.jpg',
  'img-024': 'portable-generator.jpg',
  'img-025': 'pressure-washer.jpg',
  'img-026': 'goggles.jpg',
  'img-027': 'boot-steel-toe.jpg',
  'img-028': 'wrench.jpg',
  'img-029': 'helmet-welding.jpg'
} as const;

export const IMAGE_GENERATORS = {
  local: (imageId: string) => {
    const filename = PRODUCT_IMAGES[imageId as keyof typeof PRODUCT_IMAGES];
    // Use public directory paths for proper deployment
    return filename ? `/products/${filename}` : '/products/cordless-drill.jpg';
  },

  // Disabled external generators to prevent network requests
  // unsplash: (searchTerms: string) => '',
  // picsum: (productId: string) => '',
  // placeholder: (productName: string) => '',
  // static: (category: string) => ''
} as const;

// ============================================================================
// PRODUCT CATALOG CONFIGURATION
// ============================================================================

export const PRODUCT_GENERATION = {
  useStyledProducts: true,
  pricing: {
    min: 15,
    max: 5000,
    fractionDigits: 2
  },
  stock: {
    probabilityInStock: 0.9,
    maxQuantity: 500
  },
  reviews: {
    maxCount: 15,
    verifiedProbability: 0.85
  },
  volumePricing: {
    maxTiers: 4,
    minQuantityRange: { min: 1, max: 100 },
    maxQuantityBuffer: { min: 10, max: 500 },
    priceRange: { min: 10, max: 1000, fractionDigits: 2 },
    discountRange: { min: 5, max: 30 }
  },
  featuredProbability: 0.15,
  premiumProbability: 0.25,
  bestsellerProbability: 0.2,
  newProductProbability: 0.1,
  seasonalPromoProbability: 0.08
} as const;

/**
 * Comprehensive B2B product catalog for realistic industrial supply demo
 * Organized by category with professional brands and appropriate imagery
 * Over 100+ products across 11+ categories for convincing B2B demonstrations
 */
export const B2B_PRODUCTS = [
  // SAFETY EQUIPMENT - Personal Protective Equipment
  { name: "Steel Toe Work Boots", brand: "Caterpillar", category: "Safety Equipment", imageId: "img-027", tags: ["PPE", "footwear"], certifications: ["ANSI Z41", "OSHA"] },
  { name: "Composite Toe Safety Boots", brand: "Timberland Pro", category: "Safety Equipment", imageId: "img-004", tags: ["PPE", "lightweight"] },
  { name: "Waterproof Work Boots", brand: "Red Wing", category: "Safety Equipment", imageId: "img-027", tags: ["PPE", "waterproof"] },
  { name: "High-Visibility Safety Vest", brand: "3M", category: "Safety Equipment", imageId: "img-016", tags: ["PPE", "visibility"], certifications: ["ANSI 107"] },
  { name: "Reflective Traffic Vest", brand: "Portwest", category: "Safety Equipment", imageId: "img-016", tags: ["PPE", "traffic"] },
  { name: "Class 3 Safety Vest", brand: "Ergodyne", category: "Safety Equipment", imageId: "img-016", tags: ["PPE", "high-visibility"] },
  { name: "Hard Hat with LED Light", brand: "MSA Safety", category: "Safety Equipment", imageId: "img-015", tags: ["PPE", "headwear"], certifications: ["ANSI Z89.1"] },
  { name: "Electrical Hard Hat", brand: "Klein Tools", category: "Safety Equipment", imageId: "img-015", tags: ["PPE", "electrical"] },
  { name: "Climbing Hard Hat", brand: "Petzl", category: "Safety Equipment", imageId: "img-015", tags: ["PPE", "height"] },
  { name: "Bump Cap", brand: "Ergodyne", category: "Safety Equipment", imageId: "img-015", tags: ["PPE", "comfort"] },
  { name: "Cut-Resistant Work Gloves", brand: "Mechanix", category: "Safety Equipment", imageId: "img-006", tags: ["PPE", "hand-protection"], certifications: ["ANSI/ISEA 105"] },
  { name: "Chemical Resistant Gloves", brand: "Ansell", category: "Safety Equipment", imageId: "img-007", tags: ["PPE", "chemical"] },
  { name: "Welding Gloves", brand: "Lincoln Electric", category: "Safety Equipment", imageId: "img-007", tags: ["PPE", "welding"] },
  { name: "Disposable Nitrile Gloves", brand: "Kimberly-Clark", category: "Safety Equipment", imageId: "img-006", tags: ["PPE", "medical"] },
  { name: "Safety Eyewear", brand: "Uvex", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "eye-protection"], certifications: ["ANSI Z87.1"] },
  { name: "Wraparound Safety Glasses", brand: "Honeywell", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "coverage"] },
  { name: "Safety Goggles", brand: "3M", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "splash-protection"] },
  { name: "Prescription Safety Glasses", brand: "Wiley X", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "prescription"] },
  { name: "Respirator Face Mask", brand: "3M", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "respiratory"], certifications: ["NIOSH N95"] },
  { name: "Half-Face Respirator", brand: "Honeywell", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "filtration"] },
  { name: "Full-Face Respirator", brand: "MSA Safety", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "complete-protection"] },
  { name: "Dust Mask", brand: "Moldex", category: "Safety Equipment", imageId: "img-026", tags: ["PPE", "dust"] },
  { name: "Safety Lockout Kit", brand: "Brady", category: "Safety Equipment", imageId: "img-011", tags: ["LOTO", "maintenance"], certifications: ["OSHA 1910.147"] },
  { name: "Lockout Padlocks", brand: "Master Lock", category: "Safety Equipment", imageId: "img-011", tags: ["LOTO", "security"] },
  { name: "Electrical Lockout Kit", brand: "Panduit", category: "Safety Equipment", imageId: "img-011", tags: ["LOTO", "electrical"] },
  { name: "Fire Extinguisher", brand: "Amerex", category: "Safety Equipment", imageId: "img-011", tags: ["fire-safety", "emergency"], certifications: ["UL Listed"] },
  { name: "Emergency Eyewash Station", brand: "Haws", category: "Safety Equipment", imageId: "img-011", tags: ["emergency", "first-aid"] },
  { name: "Spill Kit", brand: "New Pig", category: "Safety Equipment", imageId: "img-011", tags: ["spill-response", "cleanup"] },

  // POWER TOOLS - Professional Grade Equipment
  { name: "Cordless Drill Kit", brand: "DeWalt", category: "Power Tools", imageId: "img-005", tags: ["cordless", "drilling"], certifications: ["UL Listed"] },
  { name: "Hammer Drill", brand: "Milwaukee", category: "Power Tools", imageId: "img-013", tags: ["masonry", "concrete"] },
  { name: "Impact Driver", brand: "Makita", category: "Power Tools", imageId: "img-005", tags: ["fastening", "high-torque"] },
  { name: "Right Angle Drill", brand: "DeWalt", category: "Power Tools", imageId: "img-005", tags: ["tight-spaces", "plumbing"] },
  { name: "Circular Saw", brand: "Milwaukee", category: "Power Tools", imageId: "img-002", tags: ["cutting", "lumber"] },
  { name: "Miter Saw", brand: "DeWalt", category: "Power Tools", imageId: "img-002", tags: ["precision", "trim"] },
  { name: "Table Saw", brand: "SawStop", category: "Power Tools", imageId: "img-002", tags: ["ripping", "safety"] },
  { name: "Reciprocating Saw", brand: "Milwaukee", category: "Power Tools", imageId: "img-002", tags: ["demolition", "cutting"] },
  { name: "Angle Grinder", brand: "Bosch", category: "Power Tools", imageId: "img-001", tags: ["grinding", "metalwork"] },
  { name: "Orbital Sander", brand: "Festool", category: "Power Tools", imageId: "img-001", tags: ["finishing", "dust-collection"] },
  { name: "Belt Sander", brand: "Porter-Cable", category: "Power Tools", imageId: "img-001", tags: ["surface-prep", "heavy-sanding"] },
  { name: "Router", brand: "Bosch", category: "Power Tools", imageId: "img-001", tags: ["woodworking", "edge-profiling"] },
  { name: "Planer", brand: "DeWalt", category: "Power Tools", imageId: "img-001", tags: ["surface", "dimensioning"] },
  { name: "Nailer", brand: "Paslode", category: "Power Tools", imageId: "img-005", tags: ["framing", "fastening"] },
  { name: "Stapler", brand: "Senco", category: "Power Tools", imageId: "img-005", tags: ["upholstery", "trim"] },

  // HAND TOOLS - Manual Precision Tools
  { name: "Impact Socket Set", brand: "Craftsman", category: "Hand Tools", imageId: "img-018", tags: ["automotive", "mechanics"] },
  { name: "Combination Wrench Set", brand: "Snap-on", category: "Hand Tools", imageId: "img-028", tags: ["mechanic", "maintenance"] },
  { name: "Torque Wrench", brand: "CDI", category: "Hand Tools", imageId: "img-028", tags: ["precision", "calibrated"] },
  { name: "Ratchet Set", brand: "GearWrench", category: "Hand Tools", imageId: "img-018", tags: ["mechanics", "fine-tooth"] },
  { name: "Screwdriver Set", brand: "Klein Tools", category: "Hand Tools", imageId: "img-018", tags: ["electrical", "precision"] },
  { name: "Hex Key Set", brand: "Bondhus", category: "Hand Tools", imageId: "img-018", tags: ["assembly", "machinery"] },
  { name: "Pliers Set", brand: "Knipex", category: "Hand Tools", imageId: "img-018", tags: ["gripping", "cutting"] },
  { name: "Wire Strippers", brand: "Klein Tools", category: "Hand Tools", imageId: "img-018", tags: ["electrical", "wire-prep"] },
  { name: "Utility Knife", brand: "Stanley", category: "Hand Tools", imageId: "img-018", tags: ["cutting", "general-purpose"] },
  { name: "Measuring Tape", brand: "Stanley", category: "Hand Tools", imageId: "img-018", tags: ["measuring", "layout"] },
  { name: "Level Set", brand: "Stabila", category: "Hand Tools", imageId: "img-018", tags: ["leveling", "construction"] },
  { name: "Square", brand: "Starrett", category: "Hand Tools", imageId: "img-018", tags: ["measuring", "marking"] },
  { name: "Caliper", brand: "Mitutoyo", category: "Hand Tools", imageId: "img-018", tags: ["measuring", "machining"] },
  { name: "Micrometer", brand: "Starrett", category: "Hand Tools", imageId: "img-018", tags: ["precision", "machining"] },

  // TEST EQUIPMENT - Electrical & Diagnostic
  { name: "Digital Multimeter", brand: "Fluke", category: "Test Equipment", imageId: "img-008", tags: ["electrical", "testing"], certifications: ["CAT III", "CAT IV"] },
  { name: "Clamp Meter", brand: "Klein Tools", category: "Test Equipment", imageId: "img-008", tags: ["electrical", "current"] },
  { name: "Oscilloscope", brand: "Tektronix", category: "Test Equipment", imageId: "img-022", tags: ["electronics", "waveform"] },
  { name: "Function Generator", brand: "Keysight", category: "Test Equipment", imageId: "img-022", tags: ["signal", "testing"] },
  { name: "Power Supply", brand: "BK Precision", category: "Test Equipment", imageId: "img-022", tags: ["electronics", "bench"] },
  { name: "Insulation Tester", brand: "Megger", category: "Test Equipment", imageId: "img-008", tags: ["electrical", "insulation"] },
  { name: "Earth Ground Tester", brand: "AEMC", category: "Test Equipment", imageId: "img-008", tags: ["grounding", "safety"] },
  { name: "Thermal Imaging Camera", brand: "FLIR", category: "Test Equipment", imageId: "img-008", tags: ["thermal", "diagnostics"] },
  { name: "Sound Level Meter", brand: "Extech", category: "Test Equipment", imageId: "img-008", tags: ["noise", "environmental"] },
  { name: "Vibration Meter", brand: "PCE Instruments", category: "Test Equipment", imageId: "img-008", tags: ["mechanical", "analysis"] },

  // LIGHTING - Industrial & Commercial Solutions
  { name: "LED Work Light", brand: "Milwaukee", category: "Lighting", imageId: "img-020", tags: ["portable", "LED"] },
  { name: "Flood Light", brand: "Cooper Lighting", category: "Lighting", imageId: "img-020", tags: ["outdoor", "area-lighting"] },
  { name: "High Bay LED", brand: "Philips", category: "Lighting", imageId: "img-020", tags: ["warehouse", "industrial"] },
  { name: "Emergency Light", brand: "Dual-Lite", category: "Lighting", imageId: "img-020", tags: ["emergency", "safety"] },
  { name: "Exit Sign", brand: "Hubbell", category: "Lighting", imageId: "img-009", tags: ["exit", "code-compliance"] },
  { name: "Task Light", brand: "Luxo", category: "Lighting", imageId: "img-020", tags: ["precision", "workbench"] },
  { name: "Explosion Proof Light", brand: "Appleton", category: "Lighting", imageId: "img-020", tags: ["hazardous", "certified"] },
  { name: "Solar Light", brand: "Solar Goes Green", category: "Lighting", imageId: "img-020", tags: ["solar", "sustainable"] },

  // WELDING - Metal Fabrication Equipment
  { name: "Welding Helmet", brand: "Lincoln Electric", category: "Welding", imageId: "img-029", tags: ["PPE", "auto-darkening"], certifications: ["ANSI Z87.1"] },
  { name: "MIG Welder", brand: "Miller", category: "Welding", imageId: "img-021", tags: ["wire-feed", "fabrication"] },
  { name: "TIG Welder", brand: "Lincoln Electric", category: "Welding", imageId: "img-021", tags: ["precision", "aluminum"] },
  { name: "Stick Welder", brand: "ESAB", category: "Welding", imageId: "img-021", tags: ["arc-welding", "heavy-duty"] },
  { name: "Cutting Torch Set", brand: "Victor", category: "Welding", imageId: "img-021", tags: ["cutting", "flame"] },
  { name: "Plasma Cutter", brand: "Hypertherm", category: "Welding", imageId: "img-021", tags: ["precision", "automated"] },
  { name: "Welding Table", brand: "Strong Hand Tools", category: "Welding", imageId: "img-021", tags: ["fixture", "fabrication"] },
  { name: "Welding Cart", brand: "Lincoln Electric", category: "Welding", imageId: "img-021", tags: ["mobile", "storage"] },
  { name: "Welding Gloves", brand: "Tillman", category: "Welding", imageId: "img-007", tags: ["PPE", "heat-resistant"] },

  // AUTOMOTIVE - Professional Auto Tools
  { name: "Hydraulic Floor Jack", brand: "Blackhawk", category: "Automotive", imageId: "img-017", tags: ["lifting", "automotive"] },
  { name: "Jack Stands", brand: "Torin", category: "Automotive", imageId: "img-017", tags: ["support", "safety"] },
  { name: "Engine Hoist", brand: "OTC", category: "Automotive", imageId: "img-017", tags: ["engine", "removal"] },
  { name: "Transmission Jack", brand: "Ranger", category: "Automotive", imageId: "img-017", tags: ["transmission", "heavy-duty"] },
  { name: "Creeper", brand: "Whiteside", category: "Automotive", imageId: "img-017", tags: ["mobility", "comfort"] },
  { name: "Scan Tool", brand: "Autel", category: "Automotive", imageId: "img-008", tags: ["diagnostics", "electronic"] },
  { name: "Battery Tester", brand: "Midtronics", category: "Automotive", imageId: "img-008", tags: ["battery", "electrical"] },
  { name: "Tire Pressure Gauge", brand: "JACO", category: "Automotive", imageId: "img-008", tags: ["tire", "maintenance"] },
  { name: "Impact Wrench", brand: "Ingersoll Rand", category: "Automotive", imageId: "img-005", tags: ["lug-nuts", "high-torque"] },

  // STORAGE - Organization & Warehouse Solutions
  { name: "Industrial Wire Shelving", brand: "Metro", category: "Storage", imageId: "img-019", tags: ["warehouse", "adjustable"] },
  { name: "Tool Storage Cabinet", brand: "Snap-on", category: "Storage", imageId: "img-019", tags: ["organization", "mobile"] },
  { name: "Parts Bins", brand: "Akro-Mils", category: "Storage", imageId: "img-019", tags: ["small-parts", "organizing"] },
  { name: "Mobile Cart", brand: "Rubbermaid", category: "Storage", imageId: "img-023", tags: ["transport", "utility"] },
  { name: "Pallet Rack", brand: "Ridg-U-Rak", category: "Storage", imageId: "img-019", tags: ["warehouse", "heavy-duty"] },
  { name: "Locker System", brand: "Penco", category: "Storage", imageId: "img-019", tags: ["security", "personal"] },
  { name: "Storage Bins", brand: "Quantum Storage", category: "Storage", imageId: "img-019", tags: ["organizing", "stackable"] },
  { name: "Workbench", brand: "Global Industrial", category: "Storage", imageId: "img-019", tags: ["work-surface", "heavy-duty"] },

  // POWER EQUIPMENT - Generators & Compressors
  { name: "Portable Generator", brand: "Honda", category: "Power Equipment", imageId: "img-024", tags: ["backup-power", "portable"] },
  { name: "Standby Generator", brand: "Generac", category: "Power Equipment", imageId: "img-024", tags: ["automatic", "whole-house"] },
  { name: "Air Compressor", brand: "Ingersoll Rand", category: "Power Equipment", imageId: "img-024", tags: ["compressed-air", "industrial"] },
  { name: "Pressure Washer", brand: "Simpson", category: "Power Equipment", imageId: "img-025", tags: ["cleaning", "high-pressure"] },
  { name: "Shop Vacuum", brand: "Shop-Vac", category: "Power Equipment", imageId: "img-025", tags: ["cleanup", "debris"] },
  { name: "Dust Collector", brand: "Jet", category: "Power Equipment", imageId: "img-025", tags: ["dust-collection", "woodworking"] },
  { name: "Welder Generator", brand: "Miller", category: "Power Equipment", imageId: "img-024", tags: ["welding", "portable-power"] },

  // MEDICAL - First Aid & Safety
  { name: "First Aid Kit", brand: "Johnson & Johnson", category: "Medical", imageId: "img-011", tags: ["emergency", "workplace"], certifications: ["OSHA Compliant"] },
  { name: "AED Defibrillator", brand: "Philips", category: "Medical", imageId: "img-011", tags: ["cardiac", "emergency"] },
  { name: "Stretcher", brand: "Ferno", category: "Medical", imageId: "img-011", tags: ["transport", "emergency"] },
  { name: "Oxygen Kit", brand: "Allied Healthcare", category: "Medical", imageId: "img-011", tags: ["respiratory", "emergency"] },
  { name: "Burn Kit", brand: "North Safety", category: "Medical", imageId: "img-011", tags: ["burn-care", "treatment"] },

  // RIGGING - Heavy Lifting & Material Handling
  { name: "Lifting Straps", brand: "Crosby", category: "Rigging", imageId: "img-003", tags: ["lifting", "soft-sling"], certifications: ["ASME B30.9"] },
  { name: "Chain Hoist", brand: "CM Columbus McKinnon", category: "Rigging", imageId: "img-003", tags: ["manual", "chain"] },
  { name: "Wire Rope", brand: "WireCo WorldGroup", category: "Rigging", imageId: "img-003", tags: ["cable", "galvanized"] },
  { name: "Shackles", brand: "Crosby", category: "Rigging", imageId: "img-003", tags: ["connecting", "stainless"] },
  { name: "Lifting Magnets", brand: "Walker Magnetics", category: "Rigging", imageId: "img-003", tags: ["magnetic", "steel"] },
  { name: "Come Along", brand: "Maasdam", category: "Rigging", imageId: "img-003", tags: ["pulling", "portable"] },
  { name: "Load Block", brand: "Harrington", category: "Rigging", imageId: "img-003", tags: ["mechanical-advantage", "pulling"] },

  // MATERIAL HANDLING - Forklifts & Conveyors
  { name: "Pallet Jack", brand: "Crown", category: "Material Handling", imageId: "img-012", tags: ["pallet", "manual"] },
  { name: "Electric Pallet Jack", brand: "Raymond", category: "Material Handling", imageId: "img-012", tags: ["electric", "powered"] },
  { name: "Forklift", brand: "Toyota", category: "Material Handling", imageId: "img-012", tags: ["lifting", "propane"] },
  { name: "Hand Truck", brand: "Magliner", category: "Material Handling", imageId: "img-014", tags: ["transport", "convertible"] },
  { name: "Platform Cart", brand: "Rubbermaid", category: "Material Handling", imageId: "img-023", tags: ["platform", "transport"] },
  { name: "Drum Dolly", brand: "Morse", category: "Material Handling", imageId: "img-014", tags: ["drum", "mobility"] },
  { name: "Conveyor Belt", brand: "Dorner", category: "Material Handling", imageId: "img-010", tags: ["automation", "transport"] }
] as const;

/**
 * Professional B2B categories that align with the expanded product catalog
 * Comprehensive industrial supply categories for realistic B2B demonstrations
 */
export const B2B_CATEGORIES = [
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
  { name: 'Rigging', description: 'Lifting and rigging equipment for heavy-duty applications' },
  { name: 'Material Handling', description: 'Forklifts, conveyors, and equipment for moving materials efficiently' }
] as const;

// ============================================================================
// COMPANY & ORGANIZATIONAL DATA
// ============================================================================

export const COMPANY_DATA = {
  industries: [
    'Manufacturing',
    'Construction',
    'Healthcare',
    'Technology',
    'Automotive',
    'Aerospace',
    'Oil & Gas',
    'Mining',
    'Marine',
    'Transportation',
    'Utilities',
    'Food Processing',
    'Chemical',
    'Retail',
    'Education',
    'Government'
  ] as const,
  integrationChannels: ['salesforce', 'hubspot', 'manual'] as const,
  activeProbability: 0.95,
  teamSizeRange: { min: 2, max: 12 },
  defaultCompany: {
    id: 'default-company-id',
    name: 'Acme Industrial Solutions'
  }
} as const;

/**
 * B2B departments and organizational structure
 */
export const ORGANIZATIONAL_DATA = {
  departments: [
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
  ] as const,
  
  jobTitlesByRole: {
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
  } as const,
  
  permissionsByRole: {
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
  } as const
} as const;

// ============================================================================
// USER & ACCOUNT MANAGEMENT
// ============================================================================

export const USER_GENERATION = {
  statusDistribution: [
    { weight: 0.8, value: 'active' as const },
    { weight: 0.15, value: 'inactive' as const },
    { weight: 0.05, value: 'pending' as const }
  ],
  locationProbability: 0.3,
  phoneProbability: 0.7,
  lastLoginDays: 30,
  accountAgeYears: 2
} as const;

// ============================================================================
// BUSINESS LOGIC & CALCULATIONS
// ============================================================================

export const DIMENSIONS = {
  ranges: {
    length: { min: 1, max: 100, fractionDigits: 1 },
    width: { min: 1, max: 100, fractionDigits: 1 },
    height: { min: 1, max: 50, fractionDigits: 1 },
    weight: { min: 0.1, max: 50, fractionDigits: 1 }
  },
  units: ['inches', 'cm'] as const,
  weightUnits: ['lbs', 'kg'] as const
} as const;

export const QUOTE_GENERATION = {
  itemCount: { min: 1, max: 5 },
  discountProbability: 0.3,
  discountRange: { min: 0.05, max: 0.2, fractionDigits: 2 },
  expirationDays: { min: 7, max: 90 },
  purchaseOrderProbability: 0.4,
  statuses: ['draft', 'pending', 'approved', 'expired', 'rejected'] as const
} as const;

export const ORDER_GENERATION = {
  itemCount: { min: 1, max: 5 },
  confirmedProbability: 0.8,
  priceVariance: { min: 0.8, max: 1.2 },
  notesProbability: 0.3,
  statuses: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const,
  paymentStatuses: ['paid', 'partial', 'due', 'overdue'] as const,
  paymentDueDays: 30
} as const;

export const CART_GENERATION = {
  quantityRange: { min: 1, max: 20 },
  discountProbability: 0.2,
  discountRange: { min: 0.05, max: 0.15, fractionDigits: 2 }
} as const;

// ============================================================================
// ADDRESS & LOCATION DATA
// ============================================================================

export const ADDRESS_GENERATION = {
  secondaryAddressProbability: 0.3,
  defaultCountry: 'US'
} as const;

// ============================================================================
// TIME & DATE CALCULATIONS
// ============================================================================

export const TIME_RANGES = {
  reviewAge: { years: 1 },
  companyAge: { years: 3 },
  orderHistory: { years: 1 },
  quoteHistory: { years: 1 }
} as const;

export const SALESPERSON_GENERATION = {
  activeProbability: 0.95
} as const;

export const CATEGORY_GENERATION = {
  activeProbability: 0.95,
  imageSize: { width: 300, height: 200 }
} as const;