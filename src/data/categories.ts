import { CategoryID } from '../types';

export interface Subcategory {
  id: string;
  label: string;      // English
  labelDari: string;  // Dari / Persian
  labelPashto: string;// Pashto
}

export interface Category {
  id: CategoryID;
  label: string;
  labelDari: string;
  labelPashto: string;
  icon: string;
  subcategories: Subcategory[];
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'vehicles',
    label: 'Vehicles',
    labelDari: 'وسایط نقلیه',
    labelPashto: 'وسایط',
    icon: '🚗',
    subcategories: [
      { id: 'cars', label: 'Cars', labelDari: 'موترها', labelPashto: 'موټرونه' },
      { id: 'motorcycles', label: 'Motorcycles & Rickshaws', labelDari: 'موترسایکل و زرنج', labelPashto: 'موټر سایکل او زرنج' },
      { id: 'trucks', label: 'Trucks & Heavy Machinery', labelDari: 'موترهای باربری و ماشین‌آلات', labelPashto: 'لاري او درانه وسایل' },
      { id: 'parts', label: 'Auto Parts & Accessories', labelDari: 'پرچه‌جات و لوازم موتر', labelPashto: 'د پرزو او موټر لوازم' },
    ],
    keywords: [
      'car', 'toyota', 'corolla', 'fielder', 'prado', 'suzuki', 'passo', 'hilux', 'truck', 'tractor', 'zaranj', 
      'parts', 'tire', 'engine', 'rickshaw', 'motorcycle', 'bycycle', 'موتر', 'موترها', 'موټر', 'عراده', 
      'زرنج', 'ریکشا', 'ماشین‌آلات', 'تراکتور', 'باربری', 'پرزه', 'پرزه‌جات', 'پرچه‌جات', 'پرچه', 'تایر', 
      'بطری', 'موترسایکل', 'سایکل', 'اسنپ', 'اشتاری', 'ashtari', 'دست راست', 'پریمیم', 'corola'
    ],
  },
  {
    id: 'electronics',
    label: 'Mobiles & Electronics',
    labelDari: 'موبایل و الکترونیک',
    labelPashto: 'موبایل او الکترونیک',
    icon: '📱',
    subcategories: [
      { id: 'mobiles', label: 'Mobile Phones', labelDari: 'موبایل', labelPashto: 'مبایلونه' },
      { id: 'laptops', label: 'Laptops & Computers', labelDari: 'کمپیوتر و لپ‌تاپ', labelPashto: 'کمپیوټر او لپ ټاپ' },
      { id: 'tablets', label: 'Tablets & Smartwatches', labelDari: 'تبلت و ساعت‌های هوشمند', labelPashto: 'ټابلیټونه او ځیرک ساعتونه' },
      { id: 'tv_audio', label: 'TV, Audio & Cameras', labelDari: 'تلویزیون و وسایل صوتی', labelPashto: 'تلویزیون، غږیز وسایل او کمرې' },
    ],
    keywords: [
      'phone', 'mobile', 'iphone', 'samsung', 'xiaomi', 'redmi', 'pixel', 'laptop', 'computer', 'desktop', 
      'monitor', 'keyboard', 'charger', 'watch', 'smartwatch', 'tablet', 'ipad', 'tv', 'television', 'audio', 
      'speaker', 'camera', 'canon', 'nikon', 'موبایل', 'مبایل', 'ایفون', 'آیفون', 'تیلفون', 'تلفن', 'سامسونگ', 
      'کمپیوتر', 'کامپیوتر', 'لپ‌تاپ', 'لپتاپ', 'تبلت', 'ساعت', 'کمره', 'دوربین', 'تلویزیون', 'بلندگو', 'اسپیکر', 
      'الکترونیک', 'مک بوک', 'macbook', 'loptop'
    ],
  },
  {
    id: 'solar',
    label: 'Solar & Power Solutions',
    labelDari: 'برق آفتابی و انرژی',
    labelPashto: 'لمریزه برښنا او انرژي',
    icon: '☀️',
    subcategories: [
      { id: 'panels', label: 'Solar Panels', labelDari: 'صفحات آفتابی', labelPashto: 'سولرونه / صفحات آفتابی' },
      { id: 'batteries', label: 'Batteries & Inverters', labelDari: 'باطری و انورترها / یو پی اس', labelPashto: 'بطرۍ او انورترونه' },
      { id: 'generators', label: 'Generators', labelDari: 'جنراتورها', labelPashto: 'جنراتورونه' },
    ],
    keywords: [
      'solar', 'panel', 'battery', 'inverter', 'ups', 'generator', 'diesel', 'petrol', 'power', 'off-grid', 
      'سولر', 'آفتابی', 'صفحات آفتابی', 'پنل', 'باطری', 'بطری', 'یو پی اس', 'انورتر', 'جنراتور', 'برق', 'انرژی', 'جنراتورها'
    ],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    labelDari: 'املاک و جایداد',
    labelPashto: 'املاک او جایدادونه',
    icon: '🏠',
    subcategories: [
      { id: 'houses', label: 'Houses for Sale', labelDari: 'حویلی فروشی', labelPashto: 'کورونه د پلور لپاره' },
      { id: 'apartments', label: 'Apartments for Sale/Rent', labelDari: 'اپارتمان فروشی و کرایی', labelPashto: 'د پلور یا کرایې اپارتمانونه' },
      { id: 'commercial', label: 'Commercial Properties', labelDari: 'دوکان و گدام', labelPashto: 'دکانونه او ګودامونه' },
      { id: 'land', label: 'Land & Plots', labelDari: 'زمین و نمرې', labelPashto: 'ځمکه او نمرې' },
    ],
    keywords: [
      'house', 'villa', 'apartment', 'flat', 'rent', 'rental', 'sale', 'shop', 'office', 'land', 'plot', 
      'town', 'property', 'shahr-e naw', 'estate', 'حویلی', 'خانه', 'حویلی فروشی', 'آپارتمان', 'اپارتمان', 
      'کرایی', 'فروشی', 'دوکان', 'دفتر', 'گدام', 'زمین', 'نمره', 'نمرات', 'املاک', 'جایداد', 'کور', 'رقم'
    ],
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Livestock',
    labelDari: 'زراعت و مالداری',
    labelPashto: 'کرنه او مالداري',
    icon: '🐑',
    subcategories: [
      { id: 'livestock', label: 'Livestock', labelDari: 'مواشی / مال', labelPashto: 'مواشي / مالونه' },
      { id: 'produce', label: 'Agricultural Produce', labelDari: 'محصولات زراعتی', labelPashto: 'زراعتي حاصلات' },
      { id: 'tools', label: 'Farming Tools & Machinery', labelDari: 'لوازم و ابزار زراعتی', labelPashto: 'د کرنې وسایل' },
    ],
    keywords: [
      'sheep', 'goat', 'cow', 'cattle', 'bull', 'livestock', 'farm', 'saffron', 'dry fruit', 'nuts', 
      'almond', 'raisin', 'seed', 'wheat', 'tractor', 'pump', 'plow', 'گوسفند', 'گاو', 'بز', 'قره‌قل', 
      'مواشی', 'مالداری', 'زراعت', 'مال', 'گوسفندان', 'زعفران', 'پسته', 'بادام', 'کشمش', 'زردآلو', 
      'میوه خشک', 'تراکتور', 'زراعتی', 'ابزار زراعتی', 'شفتالو'
    ],
  },
  {
    id: 'home',
    label: 'Home & Living',
    labelDari: 'لوازم خانه و دکوراسیون',
    labelPashto: 'د کور سامان او ژوند',
    icon: '🛋️',
    subcategories: [
      { id: 'carpets', label: 'Afghan Carpets & Rugs', labelDari: 'قالین و گلیم', labelPashto: 'قالینې او ټغرونه' },
      { id: 'furniture', label: 'Furniture', labelDari: 'کوچ و فرنیچر', labelPashto: 'مبل او فرنیچر' },
      { id: 'appliances', label: 'Home Appliances', labelDari: 'لوازم برقی خانه', labelPashto: 'د کور بریښنايي وسایل' },
      { id: 'kitchen', label: 'Kitchenware', labelDari: 'لوازم آشپزخانه', labelPashto: 'د پخلنځي وسایل' },
    ],
    keywords: [
      'carpet', 'rug', 'kilim', 'afghan carpet', 'herati', 'turkmen', 'mazar', 'sofa', 'couch', 'chair', 
      'table', 'bed', 'wardrobe', 'furniture', 'fridge', 'refrigerator', 'washing machine', 'gas stove', 
      'heater', 'oven', 'kitchen', 'plate', 'قالین', 'گلیم', 'فرش', 'قالین دستبافت', 'کوچ', 'فرنیچر', 
      'مبل', 'تخت', 'الماری', 'یخچال', 'ماشین لباسشویی', 'بخاری', 'اجاق', 'گاز', 'آشپزخانه'
    ],
  },
  {
    id: 'traditional',
    label: 'Traditional & Gemstones',
    labelDari: 'صنایع دستی و جواهیر',
    labelPashto: 'لاسي صنایع او قیمتي ډبرې',
    icon: '💎',
    subcategories: [
      { id: 'gemstones', label: 'Precious Stones', labelDari: 'سنگ‌های قیمتی', labelPashto: 'قیمتي ډبرې' },
      { id: 'clothing', label: 'Traditional Clothing', labelDari: 'لباس‌های وطنی', labelPashto: 'وطني جامې' },
      { id: 'antiques', label: 'Antiques & Handcrafts', labelDari: 'آثار عتیقه و دستدوز', labelPashto: 'لاسي عتیقه اثار' },
    ],
    keywords: [
      'stone', 'gem', 'gemstone', 'emerald', 'lapis', 'lazuli', 'ruby', 'tourmaline', 'necklece', 'ring', 
      'perahan', 'tunban', 'kuchi', 'embroidered', 'handcrafted', 'handmade', 'antique', 'heritage', 'سنگ', 
      'نگین', 'زمرد', 'لاجورد', 'یاقوت', 'فیروزه', 'عتیقه', 'دستدوز', 'صنایع دستی', 'لباس وطنی', 'پیرهن', 
      'تنبان', 'کوچی', 'لباس غند', 'پنجشیر'
    ],
  },
  {
    id: 'fashion',
    label: 'Fashion & Beauty',
    labelDari: 'فشن و زیبایی',
    labelPashto: 'فېشن او ښکلا',
    icon: '👔',
    subcategories: [
      { id: 'mens_fashion', label: "Men's Fashion", labelDari: 'فشن مردانه', labelPashto: 'د نارینه وو فېشن' },
      { id: 'womens_fashion', label: "Women's Fashion", labelDari: 'فشن زنانه', labelPashto: 'د ښځو فېشن' },
      { id: 'kids', label: "Kids' Clothes & Toys", labelDari: 'لباس و بازیچه اطفال', labelPashto: 'د ماشومانو جامې او لوبې' },
    ],
    keywords: [
      'shirt', 'pant', 'shoes', 'boot', 'suit', 'watch', 'dress', 'hijab', 'makeup', 'lipstick', 'bag', 
      'perfume', 'toy', 'baby', 'clothes', 'لباس', 'پوشاک', 'فیشن', 'بوت', 'کفش', 'ساعت', 'چادر', 
      'آرایش', 'آرایشی', 'کیف', 'عطر', 'اسباب بازی', 'بازیچه', 'اطفال', 'کودک'
    ],
  },
  {
    id: 'jobs_services',
    label: 'Jobs & Services',
    labelDari: 'وظایف و خدمات',
    labelPashto: 'دندې او خدمات',
    icon: '🛠️',
    subcategories: [
      { id: 'services_offered', label: 'Services Offered', labelDari: 'خدمات', labelPashto: 'خدمات' },
      { id: 'tuition_classes', label: 'Tuition & Classes', labelDari: 'کلاس‌های آموزشی و کورس‌ها', labelPashto: 'تعليمي ټولګي' },
      { id: 'job_listings', label: 'Job Listings', labelDari: 'وظایف و کار', labelPashto: 'دندې' },
    ],
    keywords: [
      'repair', 'installation', 'construction', 'wiring', 'plumbing', 'class', 'tuition', 'kankor', 
      'english', 'computer class', 'job', 'driver', 'security', 'guard', 'delivery', 'construction', 
      'خدمات', 'ترمیم', 'نصب', 'کورس', 'کلاس', 'آموزش', 'تدریس', 'کنکور', 'انگلیسی', 'وظیفه', 'کار', 
      'کارهای روزمره', 'دریور', 'راننده', 'گارد'
    ],
  },
];

export function getCategoryAndSubLabel(categoryId: CategoryID, subcategoryId?: string, lang: 'en' | 'da' | 'pa' = 'en'): string {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return categoryId;

  const catLabel = lang === 'da' ? cat.labelDari : lang === 'pa' ? cat.labelPashto : cat.label;

  if (subcategoryId) {
    const sub = cat.subcategories.find(s => s.id === subcategoryId);
    if (sub) {
      const subLabel = lang === 'da' ? sub.labelDari : lang === 'pa' ? sub.labelPashto : sub.label;
      return `${catLabel} › ${subLabel}`;
    }
  }

  return catLabel;
}

/**
 * Searches and scores a query string against multilingual categories & subcategories keywords.
 * Returns a list of CategoryIDs that match or are relevant to the terms.
 */
export function getMatchedCategoriesByQuery(query: string): CategoryID[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const matched: CategoryID[] = [];
  CATEGORIES.forEach(cat => {
    // 1. Exact or partial match on label
    if (
      cat.label.toLowerCase().includes(q) ||
      cat.labelDari.toLowerCase().includes(q) ||
      cat.labelPashto.toLowerCase().includes(q)
    ) {
      matched.push(cat.id);
      return;
    }

    // 2. Check subcategory names
    const subMatch = cat.subcategories.some(sub => 
      sub.label.toLowerCase().includes(q) ||
      sub.labelDari.toLowerCase().includes(q) ||
      sub.labelPashto.toLowerCase().includes(q)
    );
    if (subMatch) {
      matched.push(cat.id);
      return;
    }

    // 3. Check explicit keywords
    const keywordMatch = cat.keywords.some(keyword => q.includes(keyword) || keyword.includes(q));
    if (keywordMatch) {
      matched.push(cat.id);
    }
  });

  return matched;
}
