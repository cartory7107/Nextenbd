export interface Product {
  id: string;
  name: string;
  brand: string;
  brandLogo?: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  currency: string;
  images: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specs?: Record<string, string>;
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  seller: {
    name: string;
    rating: number;
  };
  stock: number;
  isNew?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  flashSaleEnds?: string;
  warranty?: string;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  gradient: string;
  image?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

// Sample Products Data
export const products: Product[] = [
  // GADGETS
  {
    id: "gad-001",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "gadgets",
    subcategory: "smartphones",
    price: 124999,
    originalPrice: 139999,
    discount: 11,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    ],
    colors: [
      { name: "Titanium Black", hex: "#1a1a1a" },
      { name: "Titanium Gray", hex: "#6b6b6b" },
      { name: "Titanium Violet", hex: "#8b5cf6" },
    ],
    specs: {
      RAM: "12GB",
      Storage: "256GB",
      Camera: "200MP",
      Display: "6.8\" Dynamic AMOLED",
      Battery: "5000mAh",
    },
    description: "The ultimate smartphone with AI-powered features, S Pen support, and the most advanced camera system ever.",
    features: ["AI Photo Editing", "S Pen Included", "Titanium Frame", "100x Space Zoom"],
    rating: 4.8,
    reviewCount: 2345,
    seller: { name: "Tech World BD", rating: 4.9 },
    stock: 45,
    isNew: true,
    isTrending: true,
    warranty: "1 Year Official Warranty",
    sku: "GAD-S24U-BLK",
  },
  {
    id: "gad-002",
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    category: "gadgets",
    subcategory: "audio",
    price: 32500,
    originalPrice: 38999,
    discount: 17,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800",
    ],
    colors: [{ name: "White", hex: "#ffffff" }],
    specs: {
      "Noise Cancellation": "Active",
      "Battery Life": "6 hours (30 with case)",
      Connectivity: "Bluetooth 5.3",
      Chip: "H2",
    },
    description: "Rebuilt from the sound up. Spatial Audio with dynamic head tracking places sound all around you.",
    features: ["Active Noise Cancellation", "Spatial Audio", "Adaptive EQ", "MagSafe Charging"],
    rating: 4.9,
    reviewCount: 1876,
    seller: { name: "iStore Bangladesh", rating: 4.8 },
    stock: 120,
    isFlashSale: true,
    flashSaleEnds: "2025-02-05T23:59:59",
    warranty: "1 Year Apple Warranty",
    sku: "GAD-APP-WHT",
  },
  {
    id: "gad-003",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    category: "gadgets",
    subcategory: "audio",
    price: 38999,
    originalPrice: 44999,
    discount: 13,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Silver", hex: "#c0c0c0" },
    ],
    specs: {
      "Driver Size": "30mm",
      "Battery Life": "30 hours",
      "Noise Cancellation": "Industry Leading",
      Weight: "250g",
    },
    description: "Industry-leading noise cancellation with Auto NC Optimizer for the ultimate audio experience.",
    features: ["8 Microphones", "30hr Battery", "Speak-to-Chat", "Multipoint Connection"],
    rating: 4.7,
    reviewCount: 1234,
    seller: { name: "Audio Gallery", rating: 4.7 },
    stock: 67,
    isTrending: true,
    warranty: "2 Year Sony Warranty",
    sku: "GAD-SONY-XM5",
  },
  {
    id: "gad-004",
    name: "Xiaomi Smart Watch 2 Pro",
    brand: "Xiaomi",
    category: "gadgets",
    subcategory: "wearables",
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Silver", hex: "#c0c0c0" },
    ],
    specs: {
      Display: "1.43\" AMOLED",
      Battery: "12 days",
      "Water Resistance": "5ATM",
      GPS: "Built-in",
    },
    description: "Premium smartwatch with AMOLED display and comprehensive health tracking.",
    features: ["100+ Sport Modes", "SpO2 Monitoring", "Sleep Tracking", "Always-On Display"],
    rating: 4.5,
    reviewCount: 876,
    seller: { name: "Gadget Hub", rating: 4.6 },
    stock: 89,
    isNew: true,
    warranty: "1 Year Warranty",
    sku: "GAD-XIU-SW2P",
  },
  {
    id: "gad-005",
    name: "MacBook Air M3",
    brand: "Apple",
    category: "gadgets",
    subcategory: "laptops",
    price: 145000,
    originalPrice: 159999,
    discount: 9,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],
    colors: [
      { name: "Space Gray", hex: "#4a4a4a" },
      { name: "Silver", hex: "#c0c0c0" },
      { name: "Midnight", hex: "#1a1a2e" },
    ],
    specs: {
      Chip: "Apple M3",
      RAM: "8GB Unified",
      Storage: "256GB SSD",
      Display: "13.6\" Liquid Retina",
    },
    description: "Supercharged by M3. The remarkably thin MacBook Air is faster than ever.",
    features: ["18hr Battery", "1080p FaceTime HD", "MagSafe Charging", "Fanless Design"],
    rating: 4.9,
    reviewCount: 567,
    seller: { name: "Apple Authorized Reseller", rating: 5.0 },
    stock: 23,
    isTrending: true,
    warranty: "1 Year Apple Care",
    sku: "GAD-MAC-M3",
  },

  // BEAUTY & COSMETICS
  {
    id: "cos-001",
    name: "Estée Lauder Advanced Night Repair Serum",
    brand: "Estée Lauder",
    category: "cosmetics",
    subcategory: "skincare",
    price: 8500,
    originalPrice: 9999,
    discount: 15,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
    ],
    specs: {
      Size: "50ml",
      "Skin Type": "All",
      Benefits: "Anti-aging, Hydration",
      Texture: "Lightweight serum",
    },
    description: "The #1 serum in the world. Powerful nighttime renewal for radiant, youthful-looking skin.",
    features: ["7 Powerful Patented Technologies", "Reduces Lines", "Even Skin Tone", "Deep Hydration"],
    rating: 4.8,
    reviewCount: 3456,
    seller: { name: "Beauty Boutique BD", rating: 4.9 },
    stock: 156,
    isTrending: true,
    sku: "COS-EL-ANR",
  },
  {
    id: "cos-002",
    name: "MAC Ruby Woo Lipstick",
    brand: "MAC",
    category: "cosmetics",
    subcategory: "makeup",
    price: 2800,
    originalPrice: 3200,
    discount: 13,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
    ],
    colors: [
      { name: "Ruby Woo", hex: "#c41e3a" },
      { name: "Russian Red", hex: "#b22222" },
      { name: "Velvet Teddy", hex: "#bc8f8f" },
    ],
    specs: {
      Finish: "Retro Matte",
      Coverage: "Full",
      Longevity: "8+ hours",
    },
    description: "The iconic red lipstick that looks good on everyone. A vivid blue-red matte.",
    features: ["Long-wearing", "Highly Pigmented", "Non-drying", "Iconic Shade"],
    rating: 4.9,
    reviewCount: 2134,
    seller: { name: "Cosmetic Corner", rating: 4.8 },
    stock: 234,
    isTrending: true,
    isFlashSale: true,
    flashSaleEnds: "2025-02-03T23:59:59",
    sku: "COS-MAC-RW",
  },
  {
    id: "cos-003",
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "cosmetics",
    subcategory: "skincare",
    price: 950,
    originalPrice: 1200,
    discount: 21,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
    ],
    specs: {
      Size: "30ml",
      "Skin Type": "Oily, Combination",
      Benefits: "Blemishes, Congestion",
    },
    description: "High-strength vitamin and mineral blemish formula for oily and congested skin.",
    features: ["Reduces Blemishes", "Controls Oil", "Minimizes Pores", "Vegan"],
    rating: 4.6,
    reviewCount: 5678,
    seller: { name: "Skincare Heaven", rating: 4.7 },
    stock: 478,
    isNew: true,
    sku: "COS-TO-NZ",
  },
  {
    id: "cos-004",
    name: "L'Oréal Paris Revitalift Night Cream",
    brand: "L'Oréal Paris",
    category: "cosmetics",
    subcategory: "skincare",
    price: 1650,
    originalPrice: 1999,
    discount: 17,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
    ],
    specs: {
      Size: "50ml",
      "Skin Type": "All",
      "Key Ingredient": "Hyaluronic Acid",
    },
    description: "Intensive anti-wrinkle night cream with Hyaluronic Acid for deep hydration.",
    features: ["Reduces Wrinkles", "Deep Hydration", "Firms Skin", "Dermatologist Tested"],
    rating: 4.5,
    reviewCount: 1234,
    seller: { name: "Glow & Beauty", rating: 4.6 },
    stock: 345,
    sku: "COS-LOR-RN",
  },
  {
    id: "cos-005",
    name: "Maybelline Fit Me Foundation",
    brand: "Maybelline",
    category: "cosmetics",
    subcategory: "makeup",
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800",
    ],
    colors: [
      { name: "115 Ivory", hex: "#f5deb3" },
      { name: "220 Natural Beige", hex: "#d4a574" },
      { name: "320 Natural Tan", hex: "#b8860b" },
    ],
    specs: {
      Coverage: "Medium to Full",
      Finish: "Matte + Poreless",
      "Skin Type": "Normal to Oily",
    },
    description: "Mattifying foundation that fits skin tone and texture for a natural, poreless-looking finish.",
    features: ["Oil-Free", "Blurs Pores", "SPF 18", "12 Shades"],
    rating: 4.4,
    reviewCount: 3456,
    seller: { name: "Makeup Studio", rating: 4.5 },
    stock: 567,
    sku: "COS-MAY-FM",
  },

  // SPORTS & GYM
  {
    id: "spt-001",
    name: "Nike Air Zoom Pegasus 40",
    brand: "Nike",
    category: "sports",
    subcategory: "footwear",
    price: 12500,
    originalPrice: 15999,
    discount: 22,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    colors: [
      { name: "Black/White", hex: "#1a1a1a" },
      { name: "Navy/Orange", hex: "#1e3a5f" },
      { name: "Gray/Neon", hex: "#6b6b6b" },
    ],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
    specs: {
      Cushioning: "React Foam + Zoom Air",
      Upper: "Engineered mesh",
      Closure: "Lace-up",
    },
    description: "The workhorse running shoe returns with a responsive ride that's reliable every run.",
    features: ["React Foam", "Zoom Air Unit", "Breathable Mesh", "Durable Outsole"],
    rating: 4.7,
    reviewCount: 2345,
    seller: { name: "Sports Arena BD", rating: 4.8 },
    stock: 178,
    isTrending: true,
    isFlashSale: true,
    flashSaleEnds: "2025-02-04T23:59:59",
    warranty: "6 Months",
    sku: "SPT-NIK-P40",
  },
  {
    id: "spt-002",
    name: "Adidas Ultraboost 23",
    brand: "Adidas",
    category: "sports",
    subcategory: "footwear",
    price: 18900,
    originalPrice: 22999,
    discount: 18,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    ],
    colors: [
      { name: "Core Black", hex: "#1a1a1a" },
      { name: "Cloud White", hex: "#ffffff" },
      { name: "Blue/Red", hex: "#1e40af" },
    ],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    specs: {
      Technology: "Boost Cushioning",
      Upper: "Primeknit",
      Outsole: "Continental Rubber",
    },
    description: "Our most responsive running shoe ever. Boost cushioning delivers incredible energy return.",
    features: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Torsion System"],
    rating: 4.8,
    reviewCount: 1876,
    seller: { name: "Fit & Active", rating: 4.7 },
    stock: 134,
    isNew: true,
    isTrending: true,
    sku: "SPT-ADI-UB23",
  },
  {
    id: "spt-003",
    name: "Adjustable Dumbbell Set (2.5kg - 24kg)",
    brand: "ProFitness",
    category: "sports",
    subcategory: "equipment",
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800",
    ],
    specs: {
      "Weight Range": "2.5kg - 24kg per dumbbell",
      Material: "Steel with rubber coating",
      Adjustment: "Quick-lock dial",
    },
    description: "Replace 15 sets of weights with one adjustable dumbbell. Perfect for home gyms.",
    features: ["Quick Adjust", "Space Saving", "Durable Steel", "Anti-Roll Design"],
    rating: 4.6,
    reviewCount: 567,
    seller: { name: "Gym Equipment Pro", rating: 4.7 },
    stock: 67,
    isFlashSale: true,
    flashSaleEnds: "2025-02-03T23:59:59",
    warranty: "2 Years",
    sku: "SPT-PRO-DB",
  },
  {
    id: "spt-004",
    name: "Yoga Mat Premium (6mm)",
    brand: "YogaPro",
    category: "sports",
    subcategory: "accessories",
    price: 1850,
    originalPrice: 2499,
    discount: 26,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    ],
    colors: [
      { name: "Purple", hex: "#8b5cf6" },
      { name: "Blue", hex: "#3b82f6" },
      { name: "Pink", hex: "#ec4899" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    specs: {
      Dimensions: "183cm x 61cm x 6mm",
      Material: "Non-slip TPE",
      Weight: "1.2kg",
    },
    description: "Premium eco-friendly yoga mat with superior grip and comfort for all practice levels.",
    features: ["Non-Slip Surface", "Eco-Friendly TPE", "Includes Carry Strap", "Easy Clean"],
    rating: 4.5,
    reviewCount: 890,
    seller: { name: "Wellness World", rating: 4.6 },
    stock: 456,
    isNew: true,
    sku: "SPT-YP-MAT",
  },
  {
    id: "spt-005",
    name: "Protein Shaker Bottle",
    brand: "BlenderBottle",
    category: "sports",
    subcategory: "accessories",
    price: 450,
    originalPrice: 599,
    discount: 25,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Blue", hex: "#3b82f6" },
      { name: "Red", hex: "#ef4444" },
      { name: "Green", hex: "#22c55e" },
    ],
    specs: {
      Capacity: "600ml",
      Material: "BPA-Free Plastic",
      "Mixer Ball": "Stainless Steel",
    },
    description: "The original shaker bottle with patented BlenderBall wire whisk for smooth shakes.",
    features: ["BlenderBall Included", "Leak-Proof", "Dishwasher Safe", "Secure Screw-On Lid"],
    rating: 4.7,
    reviewCount: 1234,
    seller: { name: "Nutrition Hub", rating: 4.5 },
    stock: 789,
    sku: "SPT-BB-600",
  },
  {
    id: "spt-006",
    name: "Resistance Bands Set (5 Pieces)",
    brand: "FitLoop",
    category: "sports",
    subcategory: "equipment",
    price: 1200,
    originalPrice: 1599,
    discount: 25,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800",
    ],
    specs: {
      Pieces: "5 bands",
      Resistance: "X-Light to X-Heavy",
      Material: "Natural Latex",
    },
    description: "Complete resistance band set for full-body workouts at home or on the go.",
    features: ["5 Resistance Levels", "Door Anchor", "Handles Included", "Carry Bag"],
    rating: 4.4,
    reviewCount: 678,
    seller: { name: "Home Fitness", rating: 4.5 },
    stock: 567,
    sku: "SPT-FL-RB5",
  },
  {
    id: "spt-007",
    name: "Under Armour Compression Shirt",
    brand: "Under Armour",
    category: "sports",
    subcategory: "apparel",
    price: 3200,
    originalPrice: 3999,
    discount: 20,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Gray", hex: "#6b6b6b" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    specs: {
      Technology: "HeatGear",
      Fit: "Compression",
      Material: "87% Polyester, 13% Elastane",
    },
    description: "Ultra-tight, second skin fit. Lightweight HeatGear fabric for superior comfort.",
    features: ["Moisture-Wicking", "4-Way Stretch", "Anti-Odor Technology", "UPF 30"],
    rating: 4.6,
    reviewCount: 456,
    seller: { name: "Athletic Wear BD", rating: 4.7 },
    stock: 234,
    isTrending: true,
    sku: "SPT-UA-COMP",
  },
  {
    id: "spt-008",
    name: "Foam Roller for Muscle Recovery",
    brand: "TriggerPoint",
    category: "sports",
    subcategory: "recovery",
    price: 1650,
    originalPrice: 2199,
    discount: 25,
    currency: "৳",
    images: [
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800",
    ],
    specs: {
      Length: "33cm / 66cm options",
      Density: "Medium/High",
      Material: "EVA Foam",
    },
    description: "GRID pattern foam roller for targeted muscle relief and recovery.",
    features: ["GRID Technology", "Multi-Density", "Durable Core", "Portable Size"],
    rating: 4.7,
    reviewCount: 345,
    seller: { name: "Recovery Tools", rating: 4.8 },
    stock: 345,
    sku: "SPT-TP-FR",
  },
];

// Categories
export const categories: Category[] = [
  {
    id: "gadgets",
    name: "Gadgets & Electronics",
    icon: "📱",
    productCount: 1256,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: "cosmetics",
    name: "Beauty & Cosmetics",
    icon: "💄",
    productCount: 2345,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "sports",
    name: "Sports & Gym",
    icon: "🏋️",
    productCount: 987,
    gradient: "from-green-500 to-teal-600",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "🎯",
    productCount: 678,
    gradient: "from-orange-500 to-yellow-500",
  },
];

// Brands
export const brands: Brand[] = [
  { id: "samsung", name: "Samsung", logo: "Samsung", productCount: 234 },
  { id: "apple", name: "Apple", logo: "Apple", productCount: 156 },
  { id: "sony", name: "Sony", logo: "Sony", productCount: 89 },
  { id: "xiaomi", name: "Xiaomi", logo: "Xiaomi", productCount: 167 },
  { id: "mac", name: "MAC", logo: "MAC", productCount: 78 },
  { id: "loreal", name: "L'Oréal", logo: "L'Oréal", productCount: 123 },
  { id: "nike", name: "Nike", logo: "Nike", productCount: 234 },
  { id: "adidas", name: "Adidas", logo: "Adidas", productCount: 198 },
  { id: "underarmour", name: "Under Armour", logo: "Under Armour", productCount: 87 },
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getTrendingProducts = (): Product[] => {
  return products.filter((p) => p.isTrending);
};

export const getNewArrivals = (): Product[] => {
  return products.filter((p) => p.isNew);
};

export const getFlashSaleProducts = (): Product[] => {
  return products.filter((p) => p.isFlashSale);
};

export const formatPrice = (price: number, currency: string = "৳"): string => {
  return `${currency}${price.toLocaleString()}`;
};
