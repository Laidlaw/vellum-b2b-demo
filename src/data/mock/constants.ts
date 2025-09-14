/**
 * Mock Data Generation Constants
 * 
 * Organized by functional domain for maintainability and easy extension.
 * Each section contains related constants grouped logically.
 */

// ============================================================================
// IMAGE & MEDIA CONFIGURATION
// ============================================================================

export type ImageProvider = 'unsplash' | 'picsum' | 'placeholder' | 'static';

export const IMAGE_CONFIG = {
  provider: 'unsplash' as ImageProvider, // Use Unsplash for better product-specific images
  fallbackProvider: 'picsum' as ImageProvider,
  dimensions: { width: 400, height: 400 }
} as const;

export const IMAGE_GENERATORS = {
  unsplash: (searchTerms: string) => 
    `https://source.unsplash.com/${IMAGE_CONFIG.dimensions.width}x${IMAGE_CONFIG.dimensions.height}/?${searchTerms}`,
  
  picsum: (productId: string) => 
    `https://picsum.photos/${IMAGE_CONFIG.dimensions.width}/${IMAGE_CONFIG.dimensions.height}?random=${productId}`,
  
  placeholder: (productName: string) => 
    `https://via.placeholder.com/${IMAGE_CONFIG.dimensions.width}x${IMAGE_CONFIG.dimensions.height}/cccccc/666666?text=${encodeURIComponent(productName)}`,
  
  static: (category: string) => 
    `/images/products/${category.toLowerCase().replace(/\s+/g, '-')}.jpg`
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
  { name: "Steel Toe Work Boots", brand: "Caterpillar", category: "Safety Equipment", image: "steel-toe-boots,construction", tags: ["PPE", "footwear"], certifications: ["ANSI Z41", "OSHA"] },
  { name: "Composite Toe Safety Boots", brand: "Timberland Pro", category: "Safety Equipment", image: "safety-boots,composite", tags: ["PPE", "lightweight"] },
  { name: "Waterproof Work Boots", brand: "Red Wing", category: "Safety Equipment", image: "waterproof-boots,industrial", tags: ["PPE", "waterproof"] },
  { name: "High-Visibility Safety Vest", brand: "3M", category: "Safety Equipment", image: "hi-vis-vest,safety", tags: ["PPE", "visibility"], certifications: ["ANSI 107"] },
  { name: "Reflective Traffic Vest", brand: "Portwest", category: "Safety Equipment", image: "traffic-vest,reflective", tags: ["PPE", "traffic"] },
  { name: "Class 3 Safety Vest", brand: "Ergodyne", category: "Safety Equipment", image: "class3-vest,construction", tags: ["PPE", "high-visibility"] },
  { name: "Hard Hat with LED Light", brand: "MSA Safety", category: "Safety Equipment", image: "hard-hat-led,construction", tags: ["PPE", "headwear"], certifications: ["ANSI Z89.1"] },
  { name: "Electrical Hard Hat", brand: "Klein Tools", category: "Safety Equipment", image: "electrical-hardhat,safety", tags: ["PPE", "electrical"] },
  { name: "Climbing Hard Hat", brand: "Petzl", category: "Safety Equipment", image: "climbing-helmet,industrial", tags: ["PPE", "height"] },
  { name: "Bump Cap", brand: "Ergodyne", category: "Safety Equipment", image: "bump-cap,lightweight", tags: ["PPE", "comfort"] },
  { name: "Cut-Resistant Work Gloves", brand: "Mechanix", category: "Safety Equipment", image: "cut-resistant-gloves,industrial", tags: ["PPE", "hand-protection"], certifications: ["ANSI/ISEA 105"] },
  { name: "Chemical Resistant Gloves", brand: "Ansell", category: "Safety Equipment", image: "chemical-gloves,protection", tags: ["PPE", "chemical"] },
  { name: "Welding Gloves", brand: "Lincoln Electric", category: "Safety Equipment", image: "welding-gloves,leather", tags: ["PPE", "welding"] },
  { name: "Disposable Nitrile Gloves", brand: "Kimberly-Clark", category: "Safety Equipment", image: "nitrile-gloves,disposable", tags: ["PPE", "medical"] },
  { name: "Safety Eyewear", brand: "Uvex", category: "Safety Equipment", image: "safety-glasses,clear", tags: ["PPE", "eye-protection"], certifications: ["ANSI Z87.1"] },
  { name: "Wraparound Safety Glasses", brand: "Honeywell", category: "Safety Equipment", image: "wraparound-glasses,safety", tags: ["PPE", "coverage"] },
  { name: "Safety Goggles", brand: "3M", category: "Safety Equipment", image: "safety-goggles,chemical", tags: ["PPE", "splash-protection"] },
  { name: "Prescription Safety Glasses", brand: "Wiley X", category: "Safety Equipment", image: "prescription-safety,glasses", tags: ["PPE", "prescription"] },
  { name: "Respirator Face Mask", brand: "3M", category: "Safety Equipment", image: "n95-respirator,face-mask", tags: ["PPE", "respiratory"], certifications: ["NIOSH N95"] },
  { name: "Half-Face Respirator", brand: "Honeywell", category: "Safety Equipment", image: "half-face-respirator,industrial", tags: ["PPE", "filtration"] },
  { name: "Full-Face Respirator", brand: "MSA Safety", category: "Safety Equipment", image: "full-face-respirator,chemical", tags: ["PPE", "complete-protection"] },
  { name: "Dust Mask", brand: "Moldex", category: "Safety Equipment", image: "dust-mask,disposable", tags: ["PPE", "dust"] },
  { name: "Safety Lockout Kit", brand: "Brady", category: "Safety Equipment", image: "lockout-tagout,safety", tags: ["LOTO", "maintenance"], certifications: ["OSHA 1910.147"] },
  { name: "Lockout Padlocks", brand: "Master Lock", category: "Safety Equipment", image: "lockout-padlocks,safety", tags: ["LOTO", "security"] },
  { name: "Electrical Lockout Kit", brand: "Panduit", category: "Safety Equipment", image: "electrical-lockout,kit", tags: ["LOTO", "electrical"] },
  { name: "Fire Extinguisher", brand: "Amerex", category: "Safety Equipment", image: "fire-extinguisher,abc", tags: ["fire-safety", "emergency"], certifications: ["UL Listed"] },
  { name: "Emergency Eyewash Station", brand: "Haws", category: "Safety Equipment", image: "eyewash-station,emergency", tags: ["emergency", "first-aid"] },
  { name: "Spill Kit", brand: "New Pig", category: "Safety Equipment", image: "spill-kit,absorbent", tags: ["spill-response", "cleanup"] },

  // POWER TOOLS - Professional Grade Equipment
  { name: "Cordless Drill Kit", brand: "DeWalt", category: "Power Tools", image: "cordless-drill,dewalt", tags: ["cordless", "drilling"], certifications: ["UL Listed"] },
  { name: "Hammer Drill", brand: "Milwaukee", category: "Power Tools", image: "hammer-drill,milwaukee", tags: ["masonry", "concrete"] },
  { name: "Impact Driver", brand: "Makita", category: "Power Tools", image: "impact-driver,makita", tags: ["fastening", "high-torque"] },
  { name: "Right Angle Drill", brand: "DeWalt", category: "Power Tools", image: "right-angle-drill,compact", tags: ["tight-spaces", "plumbing"] },
  { name: "Circular Saw", brand: "Milwaukee", category: "Power Tools", image: "circular-saw,milwaukee", tags: ["cutting", "lumber"] },
  { name: "Miter Saw", brand: "DeWalt", category: "Power Tools", image: "miter-saw,compound", tags: ["precision", "trim"] },
  { name: "Table Saw", brand: "SawStop", category: "Power Tools", image: "table-saw,cabinet", tags: ["ripping", "safety"] },
  { name: "Reciprocating Saw", brand: "Milwaukee", category: "Power Tools", image: "reciprocating-saw,sawzall", tags: ["demolition", "cutting"] },
  { name: "Angle Grinder", brand: "Bosch", category: "Power Tools", image: "angle-grinder,bosch", tags: ["grinding", "metalwork"] },
  { name: "Orbital Sander", brand: "Festool", category: "Power Tools", image: "orbital-sander,festool", tags: ["finishing", "dust-collection"] },
  { name: "Belt Sander", brand: "Porter-Cable", category: "Power Tools", image: "belt-sander,portable", tags: ["surface-prep", "heavy-sanding"] },
  { name: "Router", brand: "Bosch", category: "Power Tools", image: "router,wood", tags: ["woodworking", "edge-profiling"] },
  { name: "Planer", brand: "DeWalt", category: "Power Tools", image: "electric-planer,dewalt", tags: ["surface", "dimensioning"] },
  { name: "Nailer", brand: "Paslode", category: "Power Tools", image: "framing-nailer,pneumatic", tags: ["framing", "fastening"] },
  { name: "Stapler", brand: "Senco", category: "Power Tools", image: "pneumatic-stapler,upholstery", tags: ["upholstery", "trim"] },

  // HAND TOOLS - Manual Precision Tools
  { name: "Impact Socket Set", brand: "Craftsman", category: "Hand Tools", image: "impact-socket-set,chrome", tags: ["automotive", "mechanics"] },
  { name: "Combination Wrench Set", brand: "Snap-on", category: "Hand Tools", image: "combination-wrench,set", tags: ["mechanic", "maintenance"] },
  { name: "Torque Wrench", brand: "CDI", category: "Hand Tools", image: "torque-wrench,calibrated", tags: ["precision", "calibrated"] },
  { name: "Ratchet Set", brand: "GearWrench", category: "Hand Tools", image: "ratchet-set,120-tooth", tags: ["mechanics", "fine-tooth"] },
  { name: "Screwdriver Set", brand: "Klein Tools", category: "Hand Tools", image: "screwdriver-set,insulated", tags: ["electrical", "precision"] },
  { name: "Hex Key Set", brand: "Bondhus", category: "Hand Tools", image: "hex-key-set,ball-end", tags: ["assembly", "machinery"] },
  { name: "Pliers Set", brand: "Knipex", category: "Hand Tools", image: "pliers-set,german", tags: ["gripping", "cutting"] },
  { name: "Wire Strippers", brand: "Klein Tools", category: "Hand Tools", image: "wire-strippers,electrical", tags: ["electrical", "wire-prep"] },
  { name: "Utility Knife", brand: "Stanley", category: "Hand Tools", image: "utility-knife,retractable", tags: ["cutting", "general-purpose"] },
  { name: "Measuring Tape", brand: "Stanley", category: "Hand Tools", image: "measuring-tape,25ft", tags: ["measuring", "layout"] },
  { name: "Level Set", brand: "Stabila", category: "Hand Tools", image: "spirit-level,aluminum", tags: ["leveling", "construction"] },
  { name: "Square", brand: "Starrett", category: "Hand Tools", image: "combination-square,precision", tags: ["measuring", "marking"] },
  { name: "Caliper", brand: "Mitutoyo", category: "Hand Tools", image: "digital-caliper,precision", tags: ["measuring", "machining"] },
  { name: "Micrometer", brand: "Starrett", category: "Hand Tools", image: "outside-micrometer,precision", tags: ["precision", "machining"] },

  // TEST EQUIPMENT - Electrical & Diagnostic
  { name: "Digital Multimeter", brand: "Fluke", category: "Test Equipment", image: "digital-multimeter,fluke", tags: ["electrical", "testing"], certifications: ["CAT III", "CAT IV"] },
  { name: "Clamp Meter", brand: "Klein Tools", category: "Test Equipment", image: "clamp-meter,current", tags: ["electrical", "current"] },
  { name: "Oscilloscope", brand: "Tektronix", category: "Test Equipment", image: "oscilloscope,digital", tags: ["electronics", "waveform"] },
  { name: "Function Generator", brand: "Keysight", category: "Test Equipment", image: "function-generator,benchtop", tags: ["signal", "testing"] },
  { name: "Power Supply", brand: "BK Precision", category: "Test Equipment", image: "power-supply,variable", tags: ["electronics", "bench"] },
  { name: "Insulation Tester", brand: "Megger", category: "Test Equipment", image: "insulation-tester,megger", tags: ["electrical", "insulation"] },
  { name: "Earth Ground Tester", brand: "AEMC", category: "Test Equipment", image: "ground-tester,electrical", tags: ["grounding", "safety"] },
  { name: "Thermal Imaging Camera", brand: "FLIR", category: "Test Equipment", image: "thermal-camera,infrared", tags: ["thermal", "diagnostics"] },
  { name: "Sound Level Meter", brand: "Extech", category: "Test Equipment", image: "sound-meter,decibel", tags: ["noise", "environmental"] },
  { name: "Vibration Meter", brand: "PCE Instruments", category: "Test Equipment", image: "vibration-meter,analysis", tags: ["mechanical", "analysis"] },

  // LIGHTING - Industrial & Commercial Solutions
  { name: "LED Work Light", brand: "Milwaukee", category: "Lighting", image: "led-work-light,portable", tags: ["portable", "LED"] },
  { name: "Flood Light", brand: "Cooper Lighting", category: "Lighting", image: "led-flood-light,industrial", tags: ["outdoor", "area-lighting"] },
  { name: "High Bay LED", brand: "Philips", category: "Lighting", image: "high-bay-led,warehouse", tags: ["warehouse", "industrial"] },
  { name: "Emergency Light", brand: "Dual-Lite", category: "Lighting", image: "emergency-light,backup", tags: ["emergency", "safety"] },
  { name: "Exit Sign", brand: "Hubbell", category: "Lighting", image: "exit-sign-led,emergency", tags: ["exit", "code-compliance"] },
  { name: "Task Light", brand: "Luxo", category: "Lighting", image: "task-light,adjustable", tags: ["precision", "workbench"] },
  { name: "Explosion Proof Light", brand: "Appleton", category: "Lighting", image: "explosion-proof-light,hazardous", tags: ["hazardous", "certified"] },
  { name: "Solar Light", brand: "Solar Goes Green", category: "Lighting", image: "solar-light,outdoor", tags: ["solar", "sustainable"] },

  // WELDING - Metal Fabrication Equipment
  { name: "Welding Helmet", brand: "Lincoln Electric", category: "Welding", image: "welding-helmet,auto-darkening", tags: ["PPE", "auto-darkening"], certifications: ["ANSI Z87.1"] },
  { name: "MIG Welder", brand: "Miller", category: "Welding", image: "mig-welder,miller", tags: ["wire-feed", "fabrication"] },
  { name: "TIG Welder", brand: "Lincoln Electric", category: "Welding", image: "tig-welder,precision", tags: ["precision", "aluminum"] },
  { name: "Stick Welder", brand: "ESAB", category: "Welding", image: "stick-welder,arc", tags: ["arc-welding", "heavy-duty"] },
  { name: "Cutting Torch Set", brand: "Victor", category: "Welding", image: "cutting-torch,oxy-acetylene", tags: ["cutting", "flame"] },
  { name: "Plasma Cutter", brand: "Hypertherm", category: "Welding", image: "plasma-cutter,cnc", tags: ["precision", "automated"] },
  { name: "Welding Table", brand: "Strong Hand Tools", category: "Welding", image: "welding-table,modular", tags: ["fixture", "fabrication"] },
  { name: "Welding Cart", brand: "Lincoln Electric", category: "Welding", image: "welding-cart,mobile", tags: ["mobile", "storage"] },
  { name: "Welding Gloves", brand: "Tillman", category: "Welding", image: "welding-gloves,leather", tags: ["PPE", "heat-resistant"] },

  // AUTOMOTIVE - Professional Auto Tools
  { name: "Hydraulic Floor Jack", brand: "Blackhawk", category: "Automotive", image: "floor-jack-hydraulic,automotive", tags: ["lifting", "automotive"] },
  { name: "Jack Stands", brand: "Torin", category: "Automotive", image: "jack-stands,safety", tags: ["support", "safety"] },
  { name: "Engine Hoist", brand: "OTC", category: "Automotive", image: "engine-hoist,hydraulic", tags: ["engine", "removal"] },
  { name: "Transmission Jack", brand: "Ranger", category: "Automotive", image: "transmission-jack,hydraulic", tags: ["transmission", "heavy-duty"] },
  { name: "Creeper", brand: "Whiteside", category: "Automotive", image: "mechanic-creeper,rolling", tags: ["mobility", "comfort"] },
  { name: "Scan Tool", brand: "Autel", category: "Automotive", image: "obd2-scanner,diagnostic", tags: ["diagnostics", "electronic"] },
  { name: "Battery Tester", brand: "Midtronics", category: "Automotive", image: "battery-tester,automotive", tags: ["battery", "electrical"] },
  { name: "Tire Pressure Gauge", brand: "JACO", category: "Automotive", image: "tire-pressure-gauge,digital", tags: ["tire", "maintenance"] },
  { name: "Impact Wrench", brand: "Ingersoll Rand", category: "Automotive", image: "impact-wrench,pneumatic", tags: ["lug-nuts", "high-torque"] },

  // STORAGE - Organization & Warehouse Solutions
  { name: "Industrial Wire Shelving", brand: "Metro", category: "Storage", image: "wire-shelving,stainless", tags: ["warehouse", "adjustable"] },
  { name: "Tool Storage Cabinet", brand: "Snap-on", category: "Storage", image: "tool-cabinet,mobile", tags: ["organization", "mobile"] },
  { name: "Parts Bins", brand: "Akro-Mils", category: "Storage", image: "parts-bins,plastic", tags: ["small-parts", "organizing"] },
  { name: "Mobile Cart", brand: "Rubbermaid", category: "Storage", image: "utility-cart,mobile", tags: ["transport", "utility"] },
  { name: "Pallet Rack", brand: "Ridg-U-Rak", category: "Storage", image: "pallet-rack,warehouse", tags: ["warehouse", "heavy-duty"] },
  { name: "Locker System", brand: "Penco", category: "Storage", image: "metal-lockers,industrial", tags: ["security", "personal"] },
  { name: "Storage Bins", brand: "Quantum Storage", category: "Storage", image: "storage-bins,stackable", tags: ["organizing", "stackable"] },
  { name: "Workbench", brand: "Global Industrial", category: "Storage", image: "workbench-steel,industrial", tags: ["work-surface", "heavy-duty"] },

  // POWER EQUIPMENT - Generators & Compressors
  { name: "Portable Generator", brand: "Honda", category: "Power Equipment", image: "portable-generator,honda", tags: ["backup-power", "portable"] },
  { name: "Standby Generator", brand: "Generac", category: "Power Equipment", image: "standby-generator,natural-gas", tags: ["automatic", "whole-house"] },
  { name: "Air Compressor", brand: "Ingersoll Rand", category: "Power Equipment", image: "air-compressor,rotary-screw", tags: ["compressed-air", "industrial"] },
  { name: "Pressure Washer", brand: "Simpson", category: "Power Equipment", image: "pressure-washer,commercial", tags: ["cleaning", "high-pressure"] },
  { name: "Shop Vacuum", brand: "Shop-Vac", category: "Power Equipment", image: "shop-vacuum,wet-dry", tags: ["cleanup", "debris"] },
  { name: "Dust Collector", brand: "Jet", category: "Power Equipment", image: "dust-collector,cyclone", tags: ["dust-collection", "woodworking"] },
  { name: "Welder Generator", brand: "Miller", category: "Power Equipment", image: "welder-generator,engine-driven", tags: ["welding", "portable-power"] },

  // MEDICAL - First Aid & Safety
  { name: "First Aid Kit", brand: "Johnson & Johnson", category: "Medical", image: "first-aid-kit,industrial", tags: ["emergency", "workplace"], certifications: ["OSHA Compliant"] },
  { name: "AED Defibrillator", brand: "Philips", category: "Medical", image: "aed-defibrillator,automated", tags: ["cardiac", "emergency"] },
  { name: "Stretcher", brand: "Ferno", category: "Medical", image: "emergency-stretcher,collapsible", tags: ["transport", "emergency"] },
  { name: "Oxygen Kit", brand: "Allied Healthcare", category: "Medical", image: "oxygen-kit-portable,emergency", tags: ["respiratory", "emergency"] },
  { name: "Burn Kit", brand: "North Safety", category: "Medical", image: "burn-treatment-kit,emergency", tags: ["burn-care", "treatment"] },

  // RIGGING - Heavy Lifting & Material Handling
  { name: "Lifting Straps", brand: "Crosby", category: "Rigging", image: "lifting-slings,polyester", tags: ["lifting", "soft-sling"], certifications: ["ASME B30.9"] },
  { name: "Chain Hoist", brand: "CM Columbus McKinnon", category: "Rigging", image: "chain-hoist,manual", tags: ["manual", "chain"] },
  { name: "Wire Rope", brand: "WireCo WorldGroup", category: "Rigging", image: "wire-rope-galvanized,cable", tags: ["cable", "galvanized"] },
  { name: "Shackles", brand: "Crosby", category: "Rigging", image: "shackles-stainless,marine", tags: ["connecting", "stainless"] },
  { name: "Lifting Magnets", brand: "Walker Magnetics", category: "Rigging", image: "lifting-magnet,permanent", tags: ["magnetic", "steel"] },
  { name: "Come Along", brand: "Maasdam", category: "Rigging", image: "come-along,cable-puller", tags: ["pulling", "portable"] },
  { name: "Load Block", brand: "Harrington", category: "Rigging", image: "load-block,snatch", tags: ["mechanical-advantage", "pulling"] },

  // MATERIAL HANDLING - Forklifts & Conveyors
  { name: "Pallet Jack", brand: "Crown", category: "Material Handling", image: "pallet-jack,manual", tags: ["pallet", "manual"] },
  { name: "Electric Pallet Jack", brand: "Raymond", category: "Material Handling", image: "electric-pallet-jack,powered", tags: ["electric", "powered"] },
  { name: "Forklift", brand: "Toyota", category: "Material Handling", image: "forklift-propane,industrial", tags: ["lifting", "propane"] },
  { name: "Hand Truck", brand: "Magliner", category: "Material Handling", image: "hand-truck-aluminum,convertible", tags: ["transport", "convertible"] },
  { name: "Platform Cart", brand: "Rubbermaid", category: "Material Handling", image: "platform-cart,heavy-duty", tags: ["platform", "transport"] },
  { name: "Drum Dolly", brand: "Morse", category: "Material Handling", image: "drum-dolly,55-gallon", tags: ["drum", "mobility"] },
  { name: "Conveyor Belt", brand: "Dorner", category: "Material Handling", image: "belt-conveyor,modular", tags: ["automation", "transport"] }
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