export type Province =
  | 'Kabul'
  | 'Herat'
  | 'Balkh'
  | 'Nangarhar'
  | 'Kandahar'
  | 'Kunduz'
  | 'Ghazni'
  | 'Kapisa'
  | 'Logar'
  | 'Baghlan'
  | 'Bamyan'
  | 'Paktia';

export type CategoryID =
  | 'all'
  | 'vehicles'
  | 'electronics'
  | 'solar'
  | 'realestate'
  | 'agriculture'
  | 'home'
  | 'traditional'
  | 'fashion'
  | 'jobs_services'
  | 'market'
  | 'phones'
  | 'livestock'
  | 'services'
  | 'cars'
  | 'jobs';

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  joinDate: string;
  isVerified: boolean;
  rating: number;
  listingsCount: number;
  responseTime: string; // e.g. "98% in < 1h"
  phone: string;
}

export interface Listing {
  id: string;
  title: string;
  titleDari: string;
  titlePashto: string;
  price: number;
  currency: 'AFN' | 'USD';
  priceType?: 'fixed' | 'negotiable' | 'per_month';
  category: CategoryID;
  images: string[];
  description: string;
  descriptionDari: string;
  descriptionPashto: string;
  location: string; // e.g., "Kabul, Share-e-Naw"
  locationDari: string;
  locationPashto: string;
  province: Province;
  postedTime: string;
  seller: User;
  isVerified: boolean;
  views: number;
  condition: 'new' | 'like_new' | 'used' | 'refurbished';
  subcategory?: string;
  handDrive?: 'left' | 'right' | 'ashtari' | '';
  carpetStyle?: 'turkmen' | 'herati' | 'mazar' | 'other' | '';
  specs?: { [key: string]: string };
}

export interface Job {
  id: string;
  title: string;
  titleDari: string;
  titlePashto: string;
  companyName: string;
  logoUrl: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location: string;
  province: Province;
  salary?: string;
  postedTime: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  listingContext?: {
    title: string;
    price: string;
    image: string;
  };
  messages: ChatMessage[];
}

export interface Translation {
  welcome: string;
  subExpiry: string;
  all: string;
  marketplace: string;
  realestate: string;
  cars: string;
  jobs: string;
  phones: string;
  livestock: string;
  services: string;
  foryou: string;
  jobRecommendations: string;
  browseNow: string;
  seeAll: string;
  searchPlaceholder: string;
  recentSearches: string;
  resultsFor: string;
  noResults: string;
  postAd: string;
  freeToList: string;
  photoDropTitle: string;
  photoDropSub: string;
  adTitle: string;
  selectCategory: string;
  pricePlaceholder: string;
  selectProvince: string;
  descriptionPlaceholder: string;
  phoneNumber: string;
  postAdButton: string;
  adSuccessTitle: string;
  adSuccessSub: string;
  postAnotherAd: string;
  messages: string;
  typing: string;
  online: string;
  offline: string;
  myListings: string;
  savedAds: string;
  settings: string;
  notifications: string;
  safetyTips: string;
  helpSupport: string;
  signOut: string;
  home: string;
  search: string;
  sell: string;
  profile: string;
  verifiedSeller: string;
  userStats: string;
  response: string;
  ratingValue: string;
  safetyTitle: string;
  safetyTip1: string;
  safetyTip2: string;
  safetyTip3: string;
  whatsappChat: string;
  callSeller: string;
  revealNumber: string;
  sellerProfile: string;
  locationLabel: string;
  postedTimeLabel: string;
  reportListing: string;
  shareListing: string;
  relatedListings: string;
  savingSuccess: string;
  favoriteAds: string;
  emptyFavSub: string;
  favorites: string;
  priceRange: string;
  categoriesLabel: string;
  provincesLabel: string;
  sortBy: string;
  sortRelevance: string;
  sortNewest: string;
  sortPriceLowHigh: string;
  sortPriceHighLow: string;
  categoryMultiSelectHint: string;
  resetFilters: string;
  anyProvince: string;
  relevanceScore: string;
}
