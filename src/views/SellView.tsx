import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, MapPin, Grid, ShieldAlert, Home, Plus, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Listing, Province, CategoryID, User } from '../types';
import { CATEGORIES } from '../data/categories';
import { compressImage } from '../lib/imageCompressor';
import { uploadListingImage } from '../lib/firebaseService';
import CategoryIcon from '../components/CategoryIcon';
import { AFGHAN_PROVINCES } from '../components/ProvinceSelector';

interface SellViewProps {
  lang: 'en' | 'da' | 'pa';
  onAddListing: (newListing: Partial<Listing>) => void;
  translations: any;
  currentUser: User | null;
  firebaseUser?: any | null;
  onNavChange: (tab: string) => void;
}

const CATEGORY_IMAGES: Record<string, string[]> = {
  market: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', // smart watch
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop', // designer glasses
  ],
  realestate: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop', // premium apartment
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop', // villa
  ],
  cars: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop', // luxury land cruiser suv
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop', // jeep
  ],
  jobs: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', // workplace office skyscraper
  ],
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop', // phone smartphone
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop', // macbook
  ],
  livestock: [
    'https://images.unsplash.com/photo-1484557985045-edd25e08da73?q=80&w=600&auto=format&fit=crop', // sheep
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600&auto=format&fit=crop', // horse
  ],
  services: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop', // electrician technician
  ],
};

export default function SellView({
  lang,
  onAddListing,
  translations,
  currentUser,
  firebaseUser,
  onNavChange,
}: SellViewProps) {
  // 4 steps state management
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Listing fields states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryID | ''>('');
  const [subcategory, setSubcategory] = useState('');
  const [handDrive, setHandDrive] = useState<'left' | 'right' | 'ashtari' | ''>('');
  const [carpetStyle, setCarpetStyle] = useState<'turkmen' | 'herati' | 'mazar' | 'other' | ''>('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'AFN' | 'USD'>('AFN');
  const [province, setProvince] = useState<Province | ''>('');
  const [district, setDistrict] = useState('');
  const [town, setTown] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [condition, setCondition] = useState<'new' | 'used' | 'like_new'>('used');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Image Upload structures
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Specs inputs based on category
  const [specOneLabel, setSpecOneLabel] = useState('');
  const [specOneVal, setSpecOneVal] = useState('');
  const [specTwoLabel, setSpecTwoLabel] = useState('');
  const [specTwoVal, setSpecTwoVal] = useState('');

  // Auto-fill phone of logged-in user if available to prevent re-typing
  React.useEffect(() => {
    if (currentUser?.phone) {
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Adjust specs fields automatically upon category shifts
  React.useEffect(() => {
    setSpecOneVal('');
    setSpecTwoVal('');
    
    if (category === 'vehicles') {
      if (subcategory === 'cars') {
        setSpecOneLabel(lang === 'en' ? 'Year' : 'سال تولید');
        setSpecTwoLabel(lang === 'en' ? 'Mileage (km)' : 'کارکرد کیلومتر');
      } else {
        setSpecOneLabel(lang === 'en' ? 'Brand / Make' : 'برند / کمپنی سازنده');
        setSpecTwoLabel(lang === 'en' ? 'Model / Capacity' : 'مدل / ظرفیت');
      }
    } else if (category === 'electronics') {
      if (subcategory === 'mobiles' || subcategory === 'tablets') {
        setSpecOneLabel(lang === 'en' ? 'Brand' : 'برند موبایل');
        setSpecTwoLabel(lang === 'en' ? 'Storage' : 'حافظه داخلی');
      } else if (subcategory === 'laptops') {
        setSpecOneLabel(lang === 'en' ? 'Processor' : 'پروسیسر');
        setSpecTwoLabel(lang === 'en' ? 'Memory / Storage' : 'حافظه و رم');
      } else {
        setSpecOneLabel(lang === 'en' ? 'Device Brand' : 'برند دستگاه');
        setSpecTwoLabel(lang === 'en' ? 'Model Year' : 'مدل تولید');
      }
    } else if (category === 'solar') {
      setSpecOneLabel(lang === 'en' ? 'Capacity / Wattage' : 'ظرفیت خروجی (وات)');
      setSpecTwoLabel(lang === 'en' ? 'Brand / Tech' : 'تکنالوژی و برند');
    } else if (category === 'realestate') {
      setSpecOneLabel(lang === 'en' ? 'Rooms' : 'تعداد اتاق');
      setSpecTwoLabel(lang === 'en' ? 'Area Size' : 'مساحت (متر مربع)');
    } else if (category === 'agriculture') {
      setSpecOneLabel(lang === 'en' ? 'Breed / Type' : 'نوعیت / نژاد');
      setSpecTwoLabel(lang === 'en' ? 'Weight / Quantity' : 'وزن / تعداد');
    } else if (category === 'home') {
      setSpecOneLabel(lang === 'en' ? 'Material / Fabric' : 'جنس / الیاف');
      setSpecTwoLabel(lang === 'en' ? 'Dimensions' : 'ابعاد قالین یا کوچ');
    } else if (category === 'traditional') {
      setSpecOneLabel(lang === 'en' ? 'Stone / Craft Type' : 'نوعیت سنگ یا صنعت');
      setSpecTwoLabel(lang === 'en' ? 'Historical / Region' : 'قدمت تاریخی یا منطقه');
    } else {
      setSpecOneLabel('');
      setSpecTwoLabel('');
    }
  }, [category, subcategory, lang]);

  const [isUploading, setIsUploading] = useState(false);
  const [tempListingId] = useState<string>(() => `ad_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);

  // Read images, convert to base64 with downscaling, and upload to Firebase Storage
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const fileArray = Array.from(files) as File[];

    try {
      for (const file of fileArray) {
        // Create an optimistic local preview URL so the user sees the photo INSTANTLY
        const tempLocalUrl = URL.createObjectURL(file);
        setUploadedImages((prev) => [...prev, tempLocalUrl]);

        // Compress and upload/fallback in the background
        const compressedBase64 = await compressImage(file, 800, 800, 0.7);
        let finalUrl = compressedBase64;

        if (compressedBase64) {
          // Upload under /listings/{listingId}/{filename} when possible
          try {
            finalUrl = await uploadListingImage(compressedBase64, tempListingId, file.name || undefined);
          } catch (err) {
            console.warn('Upload failed, keeping compressed data URL as fallback', err);
            finalUrl = compressedBase64;
          }
        }

        // Swap out the local temp URL with the persistent one (Firebase Storage URL or base64)
        setUploadedImages((prev) => {
          const index = prev.indexOf(tempLocalUrl);
          if (index !== -1) {
            const list = [...prev];
            list[index] = finalUrl || tempLocalUrl;
            return list;
          }
          return [...prev, finalUrl];
        });
      }
    } catch (err) {
      console.error('Image compression or upload error:', err);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePostAd = () => {
    // Prevent unauthenticated users (no firebase session) from posting
    if (!firebaseUser) {
      setValidationError('Please sign in to post a listing');
      // redirect to profile tab after showing message
      onNavChange('profile');
      return;
    }
    if (!title || !category || !subcategory || !price || !province || !district || !phone) {
      setValidationError(
        lang === 'en'
          ? 'Please enter all required fields marked with (*) including District & Sub-category'
          : lang === 'da'
            ? 'لطفاً تمامی خانه‌های ستاره‌دار (*) شامل ولسوالی/ناحیه و کتگوری فرعی را پر کنید'
            : 'مهرباني وکړئ ټول ستوري لرونکي خانې په شمول د ولسوالۍ/ناحیې او فرعي کټګورۍ ډکې کړئ'
      );
      return;
    }

    if (category === 'vehicles' && subcategory === 'cars' && !handDrive) {
      setValidationError(
        lang === 'en'
          ? 'Please select Steer side / Ashtari location'
          : lang === 'da'
            ? 'لطفاً موقعیت فرمان/اشترنگ موتر را انتخاب کنید'
            : 'مهرباني وکړئ د فرمان یا اشترنګ اړخ وټاکئ'
      );
      return;
    }

    if (category === 'home' && subcategory === 'carpets' && !carpetStyle) {
      setValidationError(
        lang === 'en'
          ? 'Please select Carpet regional style'
          : lang === 'da'
            ? 'لطفاً طرح یا نوعیت قالین را انتخاب کنید'
            : 'مهرباني وکړئ د غالۍ طرحه کټګوري وټاکئ'
      );
      return;
    }

    setValidationError('');

    // Pre-fill categories illustrations as backup if user didn't select photos
    let resultImages = [...uploadedImages];
    if (resultImages.length === 0) {
      const categoryPics = CATEGORY_IMAGES[category as CategoryID] || [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop',
      ];
      resultImages = [categoryPics[Math.floor(Math.random() * categoryPics.length)]];
    }

    // Capture Specs details
    const finalSpecs: Record<string, string> = {};
    if (specOneLabel && specOneVal) finalSpecs[specOneLabel] = specOneVal;
    if (specTwoLabel && specTwoVal) finalSpecs[specTwoLabel] = specTwoVal;

    const finalLocation = district && town ? `${province}, ${district}, ${town}` : district ? `${province}, ${district}` : `${province}, Center`;
    const finalLocationDari = district && town ? `${province}، ${district}، ${town}` : district ? `${province}، ${district}` : `${province}، مرکز`;
    const finalLocationPashto = district && town ? `${province}، ${district}، ${town}` : district ? `${province}، ${district}` : `${province}، مرکز`;

    const newAd: Partial<Listing> = {
      id: tempListingId,
      title,
      titleDari: title,
      titlePashto: title,
      price: Number(price),
      currency: currency,
      category: category as CategoryID,
      subcategory: subcategory,
      handDrive: handDrive || undefined,
      carpetStyle: carpetStyle || undefined,
      province: province as Province,
      description: desc,
      descriptionDari: desc,
      descriptionPashto: desc,
      location: finalLocation,
      locationDari: finalLocationDari,
      locationPashto: finalLocationPashto,
      images: resultImages,
      postedTime: lang === 'da' ? 'هم‌اکنون' : lang === 'pa' ? 'همدا اوس' : 'Just now',
      isVerified: false,
      condition,
      specs: finalSpecs,
    };

    onAddListing(newAd);
    setSuccess(true);
  };

  const handleReset = () => {
    setTitle('');
    setCategory('');
    setSubcategory('');
    setHandDrive('');
    setCarpetStyle('');
    setPrice('');
    setCurrency('AFN');
    setProvince('');
    setDistrict('');
    setTown('');
    setDesc('');
    setPhone(currentUser?.phone || '');
    setCondition('used');
    setUploadedImages([]);
    setValidationError('');
    setSuccess(false);
    setStep(1); // Back to Step 1
  };

  const isRTL = lang === 'da' || lang === 'pa';

  // 1. Auth check
  if (!currentUser) {
    return (
      <div className="flex flex-col flex-grow pb-20 text-zinc-800 select-none px-4 pt-6 animate-fade-in justify-center items-center text-center mt-6">
        <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-zinc-900">
          {lang === 'en'
            ? 'Sign In Required'
            : lang === 'da'
              ? 'ورود به حساب لازمی است'
              : 'اکاونټ ته ننوتل لازمي دي'}
        </h3>
        <p className="text-zinc-500 text-xs mt-2 max-w-[300px] leading-relaxed font-semibold">
          {lang === 'en'
            ? 'Please create a profile or sign in first from the Profile tab to publish your classified ads securely'
            : lang === 'da'
              ? 'لطفاً ابتدا از بخش پروفایل وارد حساب کاربری خود شوید تا بتوانید آگهی تان را به نشر بسپارید.'
              : 'مهرباني وکړئ لومړی د پروفایل پاڼې څخه خپل اکاونټ ته ننوزئ ترڅو خپل اعلانونه په خوندي او ارام ډول نشر کړئ.'}
        </p>
        <button
          onClick={() => onNavChange('profile')}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-blue-600/20 active:scale-95"
        >
          {lang === 'en' ? 'Go to Profile' : lang === 'da' ? 'ورود به حساب کاربری' : 'پروفایل پاڼه'}
        </button>
      </div>
    );
  }

  // 2. Step Progress Header Bar
  const renderProgressBar = () => {
    const stepsInfo = [
      { num: 1, label: lang === 'en' ? 'Category' : lang === 'da' ? 'دسته‌بندی' : 'کټګوري' },
      { num: 2, label: lang === 'en' ? 'Photos' : lang === 'da' ? 'آپلود عکس' : 'عکس اپلوډ' },
      { num: 3, label: lang === 'en' ? 'Details' : lang === 'da' ? 'مشخصات' : 'تفصیلات' },
      { num: 4, label: lang === 'en' ? 'Preview' : lang === 'da' ? 'پیش‌نمایش' : 'کتنه' },
    ];

    const currentPercentage = (step / 4) * 100;

    return (
      <div className="w-full flex flex-col gap-3 mb-5 select-none bg-zinc-50 border border-zinc-200/70 rounded-2xl p-4 shadow-sm text-left animate-fade-in">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-blue-600 tracking-tight">
            {lang === 'en' ? 'Post a Listing' : lang === 'da' ? 'ثبت و نشر آگهی جدید' : 'اعلان پورته کړئ'}
          </span>
          <span className="text-[10px] font-mono font-extrabold text-zinc-400">
            {lang === 'en' ? `STEP ${step} OF 4` : lang === 'da' ? `مرحله ${step} از ۴` : `مرحله ${step} له ۴ څخه`}
          </span>
        </div>

        {/* Gray Track & Blue Progress */}
        <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${currentPercentage}%` }}
          />
        </div>

        {/* Step label text indicators */}
        <div className="flex justify-between items-center text-[9px] font-extrabold text-zinc-400">
          {stepsInfo.map((s) => {
            const isActive = step >= s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex items-center gap-1">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono transition-all border ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white font-bold ring-2 ring-blue-500/10'
                      : isActive
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-white border-zinc-200 text-zinc-400'
                  }`}
                >
                  {s.num}
                </div>
                <span className={isActive ? 'text-zinc-800' : 'text-zinc-400'}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Step 1: Selecting Category & Sub Category
  const renderStep1 = () => {
    return (
      <div className="flex flex-col gap-4 animate-fade-in text-left">
        <div className="flex flex-col">
          <h3 className="text-base font-black text-zinc-900">
            {lang === 'en' ? '1. Select Category' : lang === 'da' ? '۱. بخش کتگوری آگهی' : '۱. د کټګورۍ انتخاب'}
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5 font-semibold leading-relaxed">
            {lang === 'en'
              ? 'Choose category and sub-category that best matches your product.'
              : 'دسته‌بندی عمومی و فرعی که بیشترین هماهنگی را با کالای شما دارد برگزینید.'}
          </p>
        </div>

        {/* Scrollable / Grid Category options */}
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSel = category === cat.id;
            const label = lang === 'da' ? cat.labelDari : lang === 'pa' ? cat.labelPashto : cat.label;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategory(cat.id);
                  setSubcategory('');
                  setHandDrive('');
                  setCarpetStyle('');
                }}
                className={`flex flex-col gap-1 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSel
                    ? 'bg-blue-50/60 border-blue-600 text-blue-600 font-extrabold shadow-xs ring-2 ring-blue-600/15'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                }`}
              >
                <CategoryIcon id={cat.id} className={`w-5 h-5 mb-1 ${isSel ? 'text-blue-600' : 'text-zinc-500'}`} />
                <span className="text-xs font-black leading-tight truncate">{label}</span>
                {cat.subcategories.length > 0 && (
                  <span className="text-[9px] text-zinc-400 font-medium">
                    {cat.subcategories.length} {lang === 'en' ? 'sub-types' : lang === 'da' ? 'نوع فرعی' : 'فرعي'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected subcategories pills section */}
        {category && (
          <div className="flex flex-col gap-3 mt-2 p-4 bg-zinc-50 border border-zinc-200/85 rounded-2xl animate-fade-in">
            <div>
              <span className="text-xs font-black text-zinc-900">
                {lang === 'en' ? 'Select Sub-category' : 'انتخاب کتگوری فرعی'} *
              </span>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                {lang === 'en' ? 'Finetune listings filtering' : 'محصول تان دقیق در این گروه منتشر می‌شود'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(CATEGORIES.find((cat) => cat.id === category)?.subcategories || []).map((sub) => {
                const isSubSel = subcategory === sub.id;
                const subLabel = lang === 'da' ? sub.labelDari : lang === 'pa' ? sub.labelPashto : sub.label;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSubcategory(sub.id);
                      setHandDrive('');
                      setCarpetStyle('');
                    }}
                    className={`px-3.5 py-2 rounded-lg border text-xs font-extrabold transition-all cursor-pointer ${
                      isSubSel
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    {subLabel}
                  </button>
                );
              })}
            </div>

            {/* Special Steering Side Selection for Cars inside Step 1 */}
            {category === 'vehicles' && subcategory === 'cars' && (
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-zinc-200">
                <span className="text-xs font-black text-zinc-850">
                  {lang === 'en' ? 'Steering Hand side' : 'موقعیت فرمان (دست)*'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'left', lbl: lang === 'en' ? 'Left' : 'چپ دست' },
                    { val: 'right', lbl: lang === 'en' ? 'Right' : 'راست دست' },
                    { val: 'ashtari', lbl: lang === 'en' ? 'Ashtari' : 'اشترنگ' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setHandDrive(item.val as any)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center ${
                        handDrive === item.val
                          ? 'bg-blue-600/10 border-blue-600 text-blue-600 font-black'
                          : 'bg-white border-zinc-200 text-zinc-600'
                      }`}
                    >
                      {item.lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Carpet Style selection inside Step 1 */}
            {category === 'home' && subcategory === 'carpets' && (
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-zinc-200">
                <span className="text-xs font-black text-zinc-850">
                  {lang === 'en' ? 'Carpet Regional Style' : 'طرح یا نوعیت بافت قالین *'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'turkmen', lbl: lang === 'en' ? 'Turkmen Traditional' : 'طرح ترکمنی (سرخ)' },
                    { val: 'herati', lbl: lang === 'en' ? 'Herati Style / Mauri' : 'طرح هراتی / موری' },
                    { val: 'mazar', lbl: lang === 'en' ? 'Mazar Style' : 'طرح مزار شریف' },
                    { val: 'other', lbl: lang === 'en' ? 'Other Afghan Art' : 'دیگر صنایع دستی کشور' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setCarpetStyle(item.val as any)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center ${
                        carpetStyle === item.val
                          ? 'bg-blue-600/10 border-blue-600 text-blue-600 font-black'
                          : 'bg-white border-zinc-200 text-zinc-600'
                      }`}
                    >
                      {item.lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (category && subcategory) {
              setValidationError('');
              setStep(2);
            }
          }}
          disabled={!category || !subcategory}
          className={`w-full py-4 rounded-xl text-xs font-black tracking-wider shadow-lg transition-all text-center mt-3 flex items-center justify-center gap-1 cursor-pointer ${
            category && subcategory
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10 active:scale-98'
              : 'bg-zinc-100 border border-zinc-200 text-zinc-400 shadow-none cursor-not-allowed'
          }`}
        >
          <span>{lang === 'en' ? 'CONTINUE TO PHOTOS' : 'ادامه به آپلود عکس‌ها'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Step 2: Upload Files
  const renderStep2 = () => {
    return (
      <div className="flex flex-col gap-4 animate-fade-in text-left">
        <div className="flex flex-col">
          <h3 className="text-base font-black text-zinc-900">
            {lang === 'en' ? '2. Upload Photos' : '۲. آپلود گالری تصاویر'}
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5 font-semibold">
            {lang === 'en'
              ? 'Photos increase engagement up to 5x. Add up to 10 photos.'
              : 'آپلود تصاویر باکیفیت و زوایای مختلف به فروش سریع کمک شایانی می‌کند.'}
          </p>
        </div>

        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-blue-500/50 rounded-2xl py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-250 active:scale-98 shadow-xs ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-3"></div>
              <p className="text-sm font-bold text-blue-600 animate-pulse">
                {lang === 'en' ? 'Compressing & uploading...' : 'در حال بهینه‌سازی و آپلود...'}
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 mb-2.5 border border-blue-600/20">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="text-zinc-700 font-extrabold text-xs">{translations.photoDropTitle}</h4>
              <p className="text-zinc-400 text-[10px] mt-1 leading-relaxed font-semibold">
                {lang === 'en'
                  ? 'Files auto-compressed to preserve bandwidth. First photo is the cover.'
                  : 'حجم تصاویر به طور خودکار بهینه می‌شود. عکس اول پیش‌نمایش یا کاور است.'}
              </p>
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Uploaded thumbnails list */}
        {uploadedImages.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1.5 bg-zinc-50 border border-zinc-200/50 rounded-xl p-4">
            <span className="text-[10px] text-zinc-500 font-black uppercase">
              {lang === 'en' ? `Images Uploaded (${uploadedImages.length}/10)` : `آلبوم عکس (${uploadedImages.length}/۱۰)`}
            </span>
            <div className="flex flex-wrap gap-2.5 mt-1">
              {uploadedImages.map((src, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-zinc-200 flex-shrink-0">
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(index)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 hover:bg-red-650 rounded-full flex items-center justify-center text-white text-[10px] cursor-pointer transition-colors"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-[8px] text-white font-extrabold py-0.5 text-center uppercase tracking-wide">
                      {lang === 'en' ? 'Cover' : 'رویه'}
                    </div>
                  )}
                </div>
              ))}

              {uploadedImages.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border border-dashed border-zinc-300 text-zinc-400 hover:text-blue-500 hover:border-blue-500/30 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors"
                >
                  <Plus className="w-5 h-5 text-zinc-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back and Continue buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center active:scale-95"
          >
            {lang === 'en' ? 'BACK' : 'قبلی'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-blue-600/15 cursor-pointer text-center active:scale-95"
          >
            {lang === 'en' ? 'CONTINUE TO DETAILS' : 'ادامه به مشخصات'}
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Input details (title, price, condition, whatsapp contact & location)
  const renderStep3 = () => {
    return (
      <div className="flex flex-col gap-4 animate-fade-in text-left">
        <div className="flex flex-col">
          <h3 className="text-base font-black text-zinc-900">
            {lang === 'en' ? '3. Enter Details' : '۳. درج قیمت و موقعیت کالای آگهی'}
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5 font-semibold">
            {lang === 'en' ? 'Submit correct details, contact number & region.' : 'مشخصات مادی، مبلغ، ولایت، ناحیه و شماره واتساپ خود را با دقت ثبت نمایید.'}
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Ad Title */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              {lang === 'en' ? 'Ad Title' : 'عنوان نمایش آگهی'} *
            </span>
            <input
              type="text"
              placeholder={`${translations.adTitle} *`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors text-left"
              style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}
            />
          </div>

          {/* Condition selector pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              {lang === 'en' ? 'Product Condition' : 'وضعیت محصول'} *
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: 'new', label: lang === 'en' ? 'New' : 'نو' },
                { value: 'like_new', label: lang === 'en' ? 'Like New' : 'در حد نو' },
                { value: 'used', label: lang === 'en' ? 'Used' : 'کارکرده' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCondition(item.value as any)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                    condition === item.value
                      ? 'bg-blue-600/10 border-blue-600 text-blue-600 font-black shadow-xs'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price with toggling currency */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              {lang === 'en' ? 'Price & Currency' : 'قیمت و ارز'} *
            </span>
            <div className="flex gap-2 items-center">
              <div className="relative flex-grow">
                <input
                  type="number"
                  placeholder={
                    currency === 'AFN'
                      ? (lang === 'en' ? 'Price (AFN) *' : 'قیمت (افغانی) *')
                      : (lang === 'en' ? 'Price (USD) *' : 'قیمت (دالر) *')
                  }
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors text-left"
                />
              </div>

              {/* AFN / USD Currency selectors */}
              <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrency('AFN')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                    currency === 'AFN'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-850'
                  }`}
                >
                  AFN
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-850'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic specific category properties inside Step 3 */}
          {specOneLabel !== '' && (
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 flex flex-col gap-2.5 shadow-xs text-left animate-fade-in">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                {lang === 'en' ? 'Additional Spec Attributes' : 'جزئیات تکمیلی این دسته‌بندی'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold">{specOneLabel}</label>
                  <input
                    type="text"
                    value={specOneVal}
                    onChange={(e) => setSpecOneVal(e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold">{specTwoLabel}</label>
                  <input
                    type="text"
                    value={specTwoVal}
                    onChange={(e) => setSpecTwoVal(e.target.value)}
                    placeholder="e.g. 128GB"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-blue-600 placeholder-zinc-400 outline-none font-mono focus:border-blue-500/70"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Province / Location */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              {lang === 'en' ? 'Select Province' : 'انتخاب ولایت'} *
            </span>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value as Province);
                setDistrict('');
                setTown('');
              }}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-bold text-zinc-805 outline-none focus:border-blue-500/70 transition-colors cursor-pointer text-left"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <option value="" className="text-zinc-400 font-bold">
                {translations.selectProvince} *
              </option>
              {AFGHAN_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {lang === 'da' ? prov.da : lang === 'pa' ? prov.pa : prov.en}
                </option>
              ))}
            </select>
          </div>

          {/* District & Town displayed when Province is selected */}
          {province && (
            <div className="grid grid-cols-2 gap-3 text-left animate-fade-in">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 font-bold">
                  {lang === 'en' ? 'District / Nahiya *' : 'ولسوالی / ناحیه *'}
                </label>
                <input
                  type="text"
                  placeholder={
                    province === 'Kabul'
                      ? (lang === 'en' ? 'e.g. Shahr-e Naw' : 'مثلاً ناحیه ۱۰ یا شهر نو')
                      : (lang === 'en' ? 'e.g. Center' : 'مثلاً مرکز')
                  }
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-3 text-xs font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 font-bold">
                  {lang === 'en' ? 'Town / Street' : 'قریه / کوچه‌'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Street 4"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-3 text-xs font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              {lang === 'en' ? 'Ad Description' : 'شرح و جزئیات مشخصات'}
            </span>
            <textarea
              placeholder={translations.descriptionPlaceholder}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors h-16 resize-none text-left"
              style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}
            />
          </div>

          {/* WhatsApp / Phone verified info */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              {lang === 'en' ? 'WhatsApp Contact Number' : 'شماره تماس واتساپ'} *
            </span>
            <input
              type="tel"
              placeholder={translations.phoneNumber}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-zinc-850 placeholder-zinc-400 outline-none focus:border-blue-500/70 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Buttons for Step 3 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center active:scale-95"
          >
            {lang === 'en' ? 'BACK' : 'قبلی'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (!title || !price || !province || !district || !phone) {
                setValidationError(
                  lang === 'en'
                    ? 'Please fill all required (*) fields: title, price, province, district & whatsapp contact'
                    : 'لطفاً تمامی خانه‌های ستاره‌دار (*) شامل عنوان، قیمت، ولایت، ناحیه و شماره واتساپ را کامل کنید'
                );
                return;
              }
              setValidationError('');
              setStep(4);
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-blue-600/15 cursor-pointer text-center active:scale-95"
          >
            {lang === 'en' ? 'LIVE PREVIEW AD' : 'ادامه به پیش‌نمایش'}
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Preview and Post
  const renderStep4 = () => {
    let previewCoverImg = uploadedImages[0];
    if (!previewCoverImg) {
      const categoryPics = CATEGORY_IMAGES[category as CategoryID] || [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop',
      ];
      previewCoverImg = categoryPics[0];
    }

    const catLabel = CATEGORIES.find((c) => c.id === category)?.label || 'General category';

    return (
      <div className="flex flex-col gap-4 animate-fade-in text-left">
        <div className="flex flex-col">
          <h3 className="text-base font-black text-zinc-900">
            {lang === 'en' ? '4. Live Preview' : '۴. بررسی و تایید نهایی قبل از نشر'}
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5 font-semibold">
            {lang === 'en' ? 'Confirm and review details exactly as buyers will see it.' : 'این پیش‌نمایش واقعی از آگهی شماست. خریداران جنس را به این شیوه مشاهده می‌کنند.'}
          </p>
        </div>

        {/* Elegant Mockup of the live Lelami listing detail */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-xs flex flex-col p-1.5 mb-2">
          {/* Cover image mockup */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-white">
            <img src={previewCoverImg} className="w-full h-full object-cover" />
            <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              LIVE PREVIEW Mockup
            </div>
            {condition && (
              <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white font-bold text-[9px] px-2.5 py-1 rounded-md uppercase">
                {condition === 'new' ? 'NEW' : condition === 'like_new' ? 'LIKE NEW' : 'USED'}
              </div>
            )}
          </div>

          <div className="p-3 bg-white rounded-b-xl mt-1 flex flex-col gap-2">
            <div className="flex justify-between items-start gap-2.5">
              <h4 className="text-sm font-black text-zinc-900 tracking-tight leading-snug">
                {title || 'Untitled item'}
              </h4>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md shrink-0 font-mono">
                {currency === 'AFN' ? `${Number(price || 0).toLocaleString()} AFN` : `$${Number(price || 0).toLocaleString()}`}
              </span>
            </div>

            {/* Location & Tags row */}
            <div className="flex flex-col gap-1 mt-1 text-[10px] text-zinc-500 font-bold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600 shadow-xs" />
                <span>{province} {district ? ` › ${district}` : ''} {town ? ` › ${town}` : ''}</span>
              </span>
              <span className="flex items-center gap-1 text-zinc-400 mt-0.5">
                <Grid className="w-3 h-3" />
                <span>{catLabel} › {subcategory}</span>
              </span>
            </div>

            {/* Description Mockup */}
            {desc && (
              <p className="text-xs text-zinc-600 font-semibold bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/50 mt-1 leading-relaxed break-words whitespace-pre-wrap">
                {desc}
              </p>
            )}

            {/* Specs tables */}
            {(specOneVal || specTwoVal) && (
              <div className="grid grid-cols-2 gap-2 mt-1 py-1.5 border-t border-b border-dashed border-zinc-200">
                {specOneLabel && specOneVal && (
                  <div className="flex items-center justify-between text-[10px] bg-zinc-50/70 p-2 rounded-md">
                    <span className="text-zinc-500 font-semibold">{specOneLabel}:</span>
                    <span className="text-zinc-900 font-black">{specOneVal}</span>
                  </div>
                )}
                {specTwoLabel && specTwoVal && (
                  <div className="flex items-center justify-between text-[10px] bg-zinc-50/70 p-2 rounded-md">
                    <span className="text-zinc-500 font-semibold">{specTwoLabel}:</span>
                    <span className="text-blue-600 font-black font-mono">{specTwoVal}</span>
                  </div>
                )}
              </div>
            )}

            {/* Contact info card summary */}
            <div className="p-2.5 bg-blue-50/30 border border-blue-600/15 rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-blue-600 uppercase tracking-widest font-extrabold">CONTACT ON WHATSAPP</span>
                <span className="text-xs font-bold font-mono text-zinc-800">{phone}</span>
              </div>
              <div className="bg-emerald-500 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg">
                WhatsApp Chat
              </div>
            </div>
          </div>
        </div>

        {/* Back and Publish Ad Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center active:scale-95"
          >
            {lang === 'en' ? 'BACK & EDIT' : 'برگشت و ویرایش'}
          </button>
          
          <button
            type="button"
            onClick={handlePostAd}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-650/15 cursor-pointer text-center active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>{translations.postAdButton}</span>
            <CheckCircle2 className="w-4 h-4 animate-pulse" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-grow pb-20 text-zinc-800 select-none px-4 pt-6 animate-fade-in">
      {!success ? (
        <div className="flex flex-col gap-1">
          {/* Progress bar indicator */}
          {renderProgressBar()}

          {/* Validation Error Alert */}
          {validationError && (
            <div className="bg-red-500/10 border border-red-550/25 text-red-600 text-xs font-bold p-3 rounded-xl text-left shadow-xs mb-3">
              {validationError}
            </div>
          )}

          {/* Conditional Steps Rendering */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-12 py-10 animate-scale-up select-none">
          <div className="w-20 h-20 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 mb-5">
            <CheckCircle2 className="w-10 h-10 animate-bounce text-blue-600" />
          </div>

          <h3 className="text-xl font-black text-zinc-900">{translations.adSuccessTitle}</h3>
          <p className="text-zinc-500 text-xs mt-2 leading-relaxed max-w-[280px] font-semibold">
            {translations.adSuccessSub}
          </p>

          <div className="flex flex-col gap-3 w-full max-w-[260px] mt-8">
            <button
              onClick={() => {
                handleReset();
                onNavChange('home');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>
                {lang === 'en' ? 'Go to Home Feed' : lang === 'da' ? 'بازگشت به خانه' : 'کور پاڼه'}
              </span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-800 text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-xs"
            >
              {translations.postAnotherAd}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
