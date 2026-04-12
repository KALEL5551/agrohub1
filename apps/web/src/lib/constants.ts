// ─── APP ──────────────────────────────────────────────────────────────────────
export const APP_NAME = 'Agro Hub';
export const APP_DESCRIPTION =
  'The global B2B & B2C agricultural marketplace — cash crops, food crops, livestock, fisheries, and more from verified suppliers worldwide.';

export const PLATFORM_COMMISSION_PERCENT = Number(
  process.env.NEXT_PUBLIC_PLATFORM_COMMISSION_PERCENT || 5
);

// ─── GLOBAL CURRENCIES ────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS$' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COP$' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' },
];

// ─── GLOBAL COUNTRIES ─────────────────────────────────────────────────────────
export const WORLD_COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bangladesh','Belarus','Belgium','Benin','Bolivia',
  'Bosnia and Herzegovina','Botswana','Brazil','Bulgaria','Burkina Faso',
  'Burundi','Cambodia','Cameroon','Canada','Chad','Chile','China','Colombia',
  'Congo (DRC)','Costa Rica',"Cote d'Ivoire",'Croatia','Cuba',
  'Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Ethiopia','Finland','France','Germany','Ghana','Greece',
  'Guatemala','Guinea','Haiti','Honduras','Hungary','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kuwait','Laos','Lebanon','Libya','Madagascar',
  'Malawi','Malaysia','Mali','Mexico','Moldova','Morocco','Mozambique',
  'Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nicaragua',
  'Niger','Nigeria','Norway','Pakistan','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Romania','Russia','Rwanda',
  'Saudi Arabia','Senegal','Sierra Leone','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Sweden',
  'Switzerland','Syria','Taiwan','Tanzania','Thailand','Togo','Tunisia',
  'Turkey','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe',
];

// backward compat alias (replaces AFRICAN_COUNTRIES everywhere)
export const AFRICAN_COUNTRIES = WORLD_COUNTRIES;

// ─── UNITS ────────────────────────────────────────────────────────────────────
export const UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ton', label: 'Metric Tonnes' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'bag', label: 'Bags' },
  { value: 'sack', label: 'Sacks (50 kg)' },
  { value: 'bale', label: 'Bales' },
  { value: 'crate', label: 'Crates' },
  { value: 'box', label: 'Boxes' },
  { value: 'piece', label: 'Pieces' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'lot', label: 'Lots' },
  { value: 'litre', label: 'Litres' },
  { value: 'gallon', label: 'Gallons' },
  { value: 'acre', label: 'Acres' },
  { value: 'hectare', label: 'Hectares' },
  { value: 'roll', label: 'Rolls' },
  { value: 'set', label: 'Sets' },
  { value: 'head', label: 'Head (livestock)' },
  { value: 'pair', label: 'Pairs' },
  { value: 'bundle', label: 'Bundles' },
  { value: 'truckload', label: 'Truckloads' },
];

// ─── TOP-LEVEL AGRO SECTORS ───────────────────────────────────────────────────
export const AGRO_SECTORS = [
  { value: 'cash_crops',       label: 'Cash Crops',              icon: '🌿', description: 'Coffee, cocoa, cotton, rubber, vanilla & more' },
  { value: 'food_crops',       label: 'Food Crops',              icon: '🌾', description: 'Maize, wheat, rice, cassava, beans & more' },
  { value: 'vegetables',       label: 'Vegetables',              icon: '🥦', description: 'Tomato, onion, cabbage, kale, pepper & more' },
  { value: 'fruits',           label: 'Fruits',                  icon: '🍎', description: 'Mango, avocado, banana, citrus & more' },
  { value: 'livestock',        label: 'Livestock',               icon: '🐄', description: 'Cattle, goat, sheep, pig — live, meat, hides' },
  { value: 'poultry',          label: 'Poultry',                 icon: '🐓', description: 'Chicken, turkey, duck, eggs & processing' },
  { value: 'fisheries',        label: 'Fisheries & Aquaculture', icon: '🐟', description: 'Fresh, dried, processed fish & aqua supplies' },
  { value: 'coffee_beverages', label: 'Coffee & Beverages',      icon: '☕', description: 'Arabica, robusta, tea, cocoa beverages' },
  { value: 'spices_herbs',     label: 'Spices & Herbs',          icon: '🌶', description: 'Ginger, turmeric, pepper, cardamom & more' },
  { value: 'dairy',            label: 'Dairy Products',          icon: '🥛', description: 'Raw milk, cheese, butter, yoghurt' },
  { value: 'honey',            label: 'Honey & Bee Products',    icon: '🍯', description: 'Raw honey, beeswax, propolis, royal jelly' },
  { value: 'seeds_nursery',    label: 'Seeds & Nursery',         icon: '🌱', description: 'Certified seeds, seedlings, planting material' },
  { value: 'farm_inputs',      label: 'Farm Inputs & Supplies',  icon: '🧪', description: 'Fertilizers, pesticides, herbicides, fungicides' },
  { value: 'farm_equipment',   label: 'Farm Equipment & Tools',  icon: '🚜', description: 'Tractors, irrigation, hand tools, storage' },
  { value: 'agro_processing',  label: 'Agro-Processing',         icon: '🏭', description: 'Milling, drying, packaging, value-added goods' },
];

// ─── PRODUCT SUBTYPES per crop (used for drill-down pages) ────────────────────
export const CROP_PRODUCT_TYPES = [
  { value: 'seeds',          label: 'Seeds & Planting Material',    icon: '🌱' },
  { value: 'pesticide',      label: 'Pesticides & Insecticides',    icon: '🧴' },
  { value: 'fungicide',      label: 'Fungicides',                   icon: '🧪' },
  { value: 'herbicide',      label: 'Herbicides & Weedkillers',     icon: '🧪' },
  { value: 'fertilizer',     label: 'Fertilizers & Soil Nutrition', icon: '💊' },
  { value: 'produce_fresh',  label: 'Fresh Produce / Harvest',      icon: '📦' },
  { value: 'produce_dried',  label: 'Dried / Processed Produce',    icon: '🏭' },
  { value: 'expert_service', label: 'Agronomist / Expert Service',  icon: '👨‍🌾' },
  { value: 'equipment',      label: 'Crop-Specific Equipment',      icon: '🔧' },
];

// ─── CASH CROPS ───────────────────────────────────────────────────────────────
export const CASH_CROPS = [
  { value: 'coffee',      label: 'Coffee',               icon: '☕' },
  { value: 'tea',         label: 'Tea',                  icon: '🍵' },
  { value: 'cocoa',       label: 'Cocoa',                icon: '🍫' },
  { value: 'cotton',      label: 'Cotton',               icon: '🪴' },
  { value: 'tobacco',     label: 'Tobacco',              icon: '🌿' },
  { value: 'sugarcane',   label: 'Sugarcane',            icon: '🎋' },
  { value: 'rubber',      label: 'Rubber',               icon: '🌳' },
  { value: 'vanilla',     label: 'Vanilla',              icon: '🌸' },
  { value: 'sisal',       label: 'Sisal',                icon: '🌿' },
  { value: 'palm_oil',    label: 'Palm Oil',             icon: '🌴' },
  { value: 'groundnuts',  label: 'Groundnuts / Peanuts', icon: '🥜' },
  { value: 'sesame',      label: 'Sesame',               icon: '🌾' },
  { value: 'sunflower',   label: 'Sunflower',            icon: '🌻' },
  { value: 'pyrethrum',   label: 'Pyrethrum',            icon: '🌼' },
  { value: 'jatropha',    label: 'Jatropha',             icon: '🌿' },
];

// ─── FOOD CROPS ───────────────────────────────────────────────────────────────
export const FOOD_CROPS = [
  { value: 'maize',        label: 'Maize / Corn',    icon: '🌽' },
  { value: 'wheat',        label: 'Wheat',           icon: '🌾' },
  { value: 'rice',         label: 'Rice',            icon: '🍚' },
  { value: 'sorghum',      label: 'Sorghum',         icon: '🌾' },
  { value: 'millet',       label: 'Millet',          icon: '🌾' },
  { value: 'cassava',      label: 'Cassava',         icon: '🍠' },
  { value: 'sweet_potato', label: 'Sweet Potato',    icon: '🍠' },
  { value: 'irish_potato', label: 'Irish Potato',    icon: '🥔' },
  { value: 'beans',        label: 'Beans',           icon: '🫘' },
  { value: 'soybeans',     label: 'Soybeans',        icon: '🫘' },
  { value: 'cowpeas',      label: 'Cowpeas',         icon: '🫘' },
  { value: 'lentils',      label: 'Lentils',         icon: '🫘' },
  { value: 'chickpeas',    label: 'Chickpeas',       icon: '🫘' },
  { value: 'barley',       label: 'Barley',          icon: '🌾' },
  { value: 'oats',         label: 'Oats',            icon: '🌾' },
  { value: 'quinoa',       label: 'Quinoa',          icon: '🌾' },
  { value: 'yam',          label: 'Yam',             icon: '🍠' },
  { value: 'plantain',     label: 'Plantain',        icon: '🍌' },
  { value: 'teff',         label: 'Teff',            icon: '🌾' },
  { value: 'amaranth',     label: 'Amaranth',        icon: '🌿' },
];

// ─── VEGETABLES ───────────────────────────────────────────────────────────────
export const VEGETABLES = [
  { value: 'tomato',      label: 'Tomato',                 icon: '🍅' },
  { value: 'onion',       label: 'Onion',                  icon: '🧅' },
  { value: 'garlic',      label: 'Garlic',                 icon: '🧄' },
  { value: 'cabbage',     label: 'Cabbage',                icon: '🥬' },
  { value: 'spinach',     label: 'Spinach',                icon: '🥬' },
  { value: 'kale',        label: 'Kale / Sukuma Wiki',     icon: '🥬' },
  { value: 'carrot',      label: 'Carrot',                 icon: '🥕' },
  { value: 'pepper',      label: 'Pepper (Bell / Chilli)', icon: '🫑' },
  { value: 'eggplant',    label: 'Eggplant / Aubergine',   icon: '🍆' },
  { value: 'cucumber',    label: 'Cucumber',               icon: '🥒' },
  { value: 'pumpkin',     label: 'Pumpkin',                icon: '🎃' },
  { value: 'zucchini',    label: 'Zucchini / Courgette',   icon: '🥒' },
  { value: 'lettuce',     label: 'Lettuce',                icon: '🥬' },
  { value: 'broccoli',    label: 'Broccoli',               icon: '🥦' },
  { value: 'cauliflower', label: 'Cauliflower',            icon: '🥦' },
  { value: 'beetroot',    label: 'Beetroot',               icon: '🫛' },
  { value: 'okra',        label: 'Okra',                   icon: '🫛' },
  { value: 'leek',        label: 'Leek',                   icon: '🌿' },
  { value: 'mushroom',    label: 'Mushroom',               icon: '🍄' },
  { value: 'ginger_veg',  label: 'Ginger (fresh)',         icon: '🫚' },
];

// ─── FRUITS ───────────────────────────────────────────────────────────────────
export const FRUITS = [
  { value: 'mango',         label: 'Mango',                      icon: '🥭' },
  { value: 'banana',        label: 'Banana',                     icon: '🍌' },
  { value: 'avocado',       label: 'Avocado',                    icon: '🥑' },
  { value: 'pineapple',     label: 'Pineapple',                  icon: '🍍' },
  { value: 'passion_fruit', label: 'Passion Fruit',              icon: '🍋' },
  { value: 'papaya',        label: 'Papaya',                     icon: '🍈' },
  { value: 'watermelon',    label: 'Watermelon',                 icon: '🍉' },
  { value: 'citrus',        label: 'Citrus (Orange/Lemon/Lime)', icon: '🍊' },
  { value: 'apple',         label: 'Apple',                      icon: '🍎' },
  { value: 'grape',         label: 'Grape',                      icon: '🍇' },
  { value: 'strawberry',    label: 'Strawberry',                 icon: '🍓' },
  { value: 'blueberry',     label: 'Blueberry',                  icon: '🫐' },
  { value: 'jackfruit',     label: 'Jackfruit',                  icon: '🍈' },
  { value: 'guava',         label: 'Guava',                      icon: '🍈' },
  { value: 'lychee',        label: 'Lychee',                     icon: '🍈' },
  { value: 'dragon_fruit',  label: 'Dragon Fruit',               icon: '🍈' },
  { value: 'durian',        label: 'Durian',                     icon: '🍈' },
];

// ─── LIVESTOCK ────────────────────────────────────────────────────────────────
export const LIVESTOCK_TYPES = [
  { value: 'cattle',       label: 'Cattle / Beef',       icon: '🐄' },
  { value: 'dairy_cattle', label: 'Dairy Cattle',        icon: '🐄' },
  { value: 'goat',         label: 'Goat (Meat / Dairy)', icon: '🐐' },
  { value: 'sheep',        label: 'Sheep / Mutton',      icon: '🐑' },
  { value: 'wool',         label: 'Wool',                icon: '🧶' },
  { value: 'pig',          label: 'Pig / Pork',          icon: '🐷' },
  { value: 'horse',        label: 'Horse',               icon: '🐴' },
  { value: 'donkey',       label: 'Donkey',              icon: '🫏' },
  { value: 'camel',        label: 'Camel',               icon: '🐪' },
  { value: 'rabbit',       label: 'Rabbit',              icon: '🐇' },
  { value: 'chicken',      label: 'Chicken',             icon: '🐓' },
  { value: 'turkey',       label: 'Turkey',              icon: '🦃' },
  { value: 'duck',         label: 'Duck',                icon: '🦆' },
  { value: 'guinea_fowl',  label: 'Guinea Fowl',         icon: '🐦' },
  { value: 'ostrich',      label: 'Ostrich',             icon: '🦤' },
];

export const LIVESTOCK_PRODUCT_TYPES = [
  { value: 'live_animals',   label: 'Live Animals',               icon: '🐄' },
  { value: 'meat_cuts',      label: 'Meat Cuts & Carcass',        icon: '🥩' },
  { value: 'hides_skins',    label: 'Hides, Skins & Leather',     icon: '🪣' },
  { value: 'wool_fiber',     label: 'Wool & Natural Fiber',       icon: '🧶' },
  { value: 'eggs',           label: 'Eggs',                       icon: '🥚' },
  { value: 'raw_milk',       label: 'Raw Milk',                   icon: '🥛' },
  { value: 'animal_feed',    label: 'Animal Feed',                icon: '🌾' },
  { value: 'veterinary',     label: 'Veterinary Medicines',       icon: '💊' },
  { value: 'breeding_stock', label: 'Breeding Stock & Genetics',  icon: '🧬' },
  { value: 'dairy_products', label: 'Dairy Products',             icon: '🧈' },
];

// ─── FISHERIES ────────────────────────────────────────────────────────────────
export const FISH_TYPES = [
  { value: 'tilapia',           label: 'Tilapia',              icon: '🐟' },
  { value: 'catfish',           label: 'Catfish',              icon: '🐟' },
  { value: 'salmon',            label: 'Salmon',               icon: '🐟' },
  { value: 'tuna',              label: 'Tuna',                 icon: '🐟' },
  { value: 'sardines',          label: 'Sardines / Dagaa',     icon: '🐟' },
  { value: 'mackerel',          label: 'Mackerel',             icon: '🐟' },
  { value: 'cod',               label: 'Cod',                  icon: '🐟' },
  { value: 'nile_perch',        label: 'Nile Perch',           icon: '🐟' },
  { value: 'shrimp',            label: 'Shrimp / Prawns',      icon: '🦐' },
  { value: 'lobster',           label: 'Lobster',              icon: '🦞' },
  { value: 'crab',              label: 'Crab',                 icon: '🦀' },
  { value: 'oyster',            label: 'Oyster',               icon: '🦪' },
  { value: 'squid',             label: 'Squid / Octopus',      icon: '🦑' },
  { value: 'dried_fish',        label: 'Dried / Smoked Fish',  icon: '🐟' },
  { value: 'fish_meal',         label: 'Fish Meal & Fish Oil', icon: '🐟' },
  { value: 'aquaculture_equip', label: 'Aquaculture Supplies', icon: '🌊' },
];

export const FISH_PRODUCT_TYPES = [
  { value: 'live_fish',     label: 'Live Fish',                icon: '🐟' },
  { value: 'fresh_chilled', label: 'Fresh / Chilled',          icon: '❄️' },
  { value: 'frozen',        label: 'Frozen',                   icon: '🧊' },
  { value: 'dried_smoked',  label: 'Dried / Smoked',           icon: '🔥' },
  { value: 'canned',        label: 'Canned / Processed',       icon: '🥫' },
  { value: 'fish_feed',     label: 'Fish Feed',                icon: '🌾' },
  { value: 'fish_medicine', label: 'Fish Disease Treatment',   icon: '💊' },
  { value: 'equipment',     label: 'Fishing / Farm Equipment', icon: '🎣' },
  { value: 'fingerlings',   label: 'Fingerlings & Fry',        icon: '🐠' },
];

// ─── COFFEE & BEVERAGES ───────────────────────────────────────────────────────
export const COFFEE_TYPES = [
  { value: 'arabica_green',  label: 'Arabica Green Bean',         icon: '☕' },
  { value: 'robusta_green',  label: 'Robusta Green Bean',         icon: '☕' },
  { value: 'roasted_coffee', label: 'Roasted Coffee',             icon: '☕' },
  { value: 'instant_coffee', label: 'Instant Coffee',             icon: '☕' },
  { value: 'specialty',      label: 'Specialty / Single Origin',  icon: '☕' },
  { value: 'black_tea',      label: 'Black Tea',                  icon: '🍵' },
  { value: 'green_tea',      label: 'Green Tea',                  icon: '🍵' },
  { value: 'herbal_tea',     label: 'Herbal Tea',                 icon: '🍵' },
  { value: 'cocoa_powder',   label: 'Cocoa Powder',               icon: '🍫' },
  { value: 'cocoa_butter',   label: 'Cocoa Butter',               icon: '🍫' },
  { value: 'cacao_nibs',     label: 'Cacao Nibs',                 icon: '🍫' },
  { value: 'chicory',        label: 'Chicory',                    icon: '🌿' },
];

// ─── SPICES & HERBS ───────────────────────────────────────────────────────────
export const SPICES = [
  { value: 'black_pepper', label: 'Black Pepper',        icon: '🌶' },
  { value: 'chilli',       label: 'Chilli / Red Pepper', icon: '🌶' },
  { value: 'ginger',       label: 'Ginger',              icon: '🫚' },
  { value: 'turmeric',     label: 'Turmeric',            icon: '🟡' },
  { value: 'cardamom',     label: 'Cardamom',            icon: '🌿' },
  { value: 'cinnamon',     label: 'Cinnamon',            icon: '🪵' },
  { value: 'cloves',       label: 'Cloves',              icon: '🌿' },
  { value: 'nutmeg',       label: 'Nutmeg',              icon: '🌿' },
  { value: 'cumin',        label: 'Cumin',               icon: '🌿' },
  { value: 'coriander',    label: 'Coriander / Dhania',  icon: '🌿' },
  { value: 'fenugreek',    label: 'Fenugreek',           icon: '🌿' },
  { value: 'moringa',      label: 'Moringa',             icon: '🌿' },
  { value: 'saffron',      label: 'Saffron',             icon: '🌸' },
];

// ─── FLAT LIST (for product filters, DB category column) ─────────────────────
export const AGRICULTURE_SUBCATEGORIES = [
  ...CASH_CROPS.map(c => ({ ...c, sector: 'cash_crops' as const })),
  ...FOOD_CROPS.map(c => ({ ...c, sector: 'food_crops' as const })),
  ...VEGETABLES.map(c => ({ ...c, sector: 'vegetables' as const })),
  ...FRUITS.map(c => ({ ...c, sector: 'fruits' as const })),
  ...LIVESTOCK_TYPES.map(c => ({ ...c, sector: 'livestock' as const })),
  ...FISH_TYPES.map(c => ({ ...c, sector: 'fisheries' as const })),
  ...COFFEE_TYPES.map(c => ({ ...c, sector: 'coffee_beverages' as const })),
  ...SPICES.map(c => ({ ...c, sector: 'spices_herbs' as const })),
];

// No electronics — Agro Hub is agriculture-only
export const ELECTRONICS_SUBCATEGORIES: never[] = [];

// ─── ORDER STATUS ─────────────────────────────────────────────────────────────
export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  confirmed:  { label: 'Confirmed',  color: 'text-blue-700',   bgColor: 'bg-blue-100' },
  processing: { label: 'Processing', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  shipped:    { label: 'Shipped',    color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered:  { label: 'Delivered',  color: 'text-green-700',  bgColor: 'bg-green-100' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bgColor: 'bg-red-100' },
  disputed:   { label: 'Disputed',   color: 'text-orange-700', bgColor: 'bg-orange-100' },
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: '/products',   label: 'Marketplace' },
  { href: '/cash-crops', label: 'Cash Crops' },
  { href: '/food-crops', label: 'Food Crops' },
  { href: '/livestock',  label: 'Livestock' },
  { href: '/fisheries',  label: 'Fisheries' },
  { href: '/coffee',     label: 'Coffee & More' },
];

export const DASHBOARD_NAV = [
  { href: '/dashboard', label: 'Overview',    icon: 'LayoutDashboard' },
  { href: '/orders',    label: 'Orders',      icon: 'ShoppingCart' },
  { href: '/listings',  label: 'My Listings', icon: 'Package' },
  { href: '/chat',      label: 'Messages',    icon: 'MessageCircle' },
  { href: '/profile',   label: 'Profile',     icon: 'User' },
];

export const ADMIN_NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: 'LayoutDashboard' },
  { href: '/admin/suppliers', label: 'Suppliers',  icon: 'Users' },
  { href: '/admin/orders',    label: 'Orders',     icon: 'ShoppingCart' },
  { href: '/admin/escrow',    label: 'Escrow',     icon: 'Shield' },
  { href: '/admin/disputes',  label: 'Disputes',   icon: 'AlertTriangle' },
  { href: '/admin/shipping',  label: 'Shipping',   icon: 'Truck' },
  { href: '/admin/kyc',       label: 'KYC Review', icon: 'FileCheck' },
  { href: '/admin/analytics', label: 'Analytics',  icon: 'BarChart3' },
];

// ─── PAYMENT METHODS (global) ─────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { value: 'card',          label: 'Credit / Debit Card',   icon: '💳', provider: 'Stripe / Flutterwave' },
  { value: 'paypal',        label: 'PayPal',                icon: '🅿', provider: 'PayPal' },
  { value: 'mobilemoney',   label: 'Mobile Money',          icon: '📱', provider: 'MTN MoMo / Airtel' },
  { value: 'bank_transfer', label: 'Bank Transfer / SWIFT', icon: '🏦', provider: 'Bank' },
  { value: 'crypto',        label: 'Crypto (USDT / BTC)',   icon: '🪙', provider: 'Binance Pay' },
];

// ─── SHIPPING TYPES ───────────────────────────────────────────────────────────
export const SHIPPING_TYPES = [
  { value: 'b2b_bulk',    label: 'B2B Bulk Freight',         icon: '🚢', description: 'Container / LCL for large orders' },
  { value: 'b2c_courier', label: 'B2C Express Courier',      icon: '📦', description: 'DHL, FedEx, UPS for retail' },
  { value: 'local',       label: 'Local / Domestic',         icon: '🚚', description: 'Within-country delivery' },
  { value: 'pickup',      label: 'Pickup at Farm/Warehouse', icon: '🏭', description: 'Buyer collects directly' },
];
