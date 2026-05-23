import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, Job, Conversation, CategoryID, User } from './types';
import { MOCK_LISTINGS, MOCK_JOBS, MOCK_CONVERSATIONS, MOCK_USERS } from './data/mockData';
import { TRANSLATIONS, LanguageCode, getDir } from './lib/i18n';

// Import Modular Views
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import ListingDetailView from './views/ListingDetailView';
import SellView from './views/SellView';
import MessagesView from './views/MessagesView';
import ProfileView from './views/ProfileView';
import FavoritesView from './views/FavoritesView';

// Import Reusable Bottom Navigation elements
import BottomNavbar from './components/BottomNavbar';

export default function App() {
  const [lang, setLang] = useState<LanguageCode>('da');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Dynamic user session and core product state persisted via localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('lelami_user_session');
      return saved ? JSON.parse(saved) : MOCK_USERS.seller1;
    } catch {
      return MOCK_USERS.seller1;
    }
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('lelami_classified_listings');
      return saved ? JSON.parse(saved) : MOCK_LISTINGS;
    } catch {
      return MOCK_LISTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lelami_starred_favorites');
      return saved ? JSON.parse(saved) : ['macbook', 'afghan-carpet'];
    } catch {
      return ['macbook', 'afghan-carpet'];
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [homeCategory, setHomeCategory] = useState<CategoryID>('all');

  // Sync state modifications to localized client's Storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lelami_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lelami_user_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lelami_classified_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('lelami_starred_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync RTL attributes to HTML tag on state shift
  useEffect(() => {
    const dir = getDir(lang);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  // Handle addition of listings via "Sell An Ad" form
  const handleAddListing = (ad: Partial<Listing>) => {
    const sellerObj = currentUser || MOCK_USERS.seller1;
    const fullAd: Listing = {
      id: `ad_${Date.now()}`,
      title: ad.title || 'Untitled Ad',
      titleDari: ad.titleDari || ad.title || 'Untitled Ad',
      titlePashto: ad.titlePashto || ad.title || 'Untitled Ad',
      price: ad.price || 0,
      currency: 'AFN',
      priceType: 'negotiable',
      category: ad.category || 'market',
      images: ad.images && ad.images.length > 0 ? ad.images : [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop', // default nice image
      ],
      description: ad.description || '',
      descriptionDari: ad.descriptionDari || ad.description || '',
      descriptionPashto: ad.descriptionPashto || ad.description || '',
      location: ad.location || (sellerObj.location || 'Kabul'),
      locationDari: ad.locationDari || (sellerObj.location || 'کابل'),
      locationPashto: ad.locationPashto || (sellerObj.location || 'کابل'),
      province: ad.province || 'Kabul',
      postedTime: lang === 'da' ? 'هم‌اکنون' : lang === 'pa' ? 'همدا اوس' : 'Just now',
      seller: sellerObj, // authored by logged-in user
      isVerified: sellerObj.isVerified || false,
      views: 1,
      condition: 'new',
    };

    setListings((prev) => [fullAd, ...prev]);
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const currentTranslations = TRANSLATIONS[lang];

  // Helper labels passed to bottom Navigation elements
  const bottomNavLabels = {
    home: currentTranslations.home,
    search: currentTranslations.search,
    sell: currentTranslations.sell,
    messages: currentTranslations.messages,
    profile: currentTranslations.profile,
  };

  const unreadMessagesCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  // Simple state machine selector for core VIEWS
  const renderActiveView = () => {
    if (selectedListingId !== null) {
      const selectedListing = listings.find((l) => l.id === selectedListingId);
      if (selectedListing) {
        // Grab related items under same categorization
        const related = listings.filter(
          (l) => l.category === selectedListing.category && l.id !== selectedListing.id
        );

        return (
          <ListingDetailView
            listing={selectedListing}
            lang={lang}
            isFavorite={favorites.includes(selectedListing.id)}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
            onBack={() => {
              setSelectedListingId(null);
            }}
            onListingSelect={(id) => setSelectedListingId(id)}
            relatedListings={related}
            translations={currentTranslations}
          />
        );
      }
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            lang={lang}
            onLanguageChange={setLang}
            selectedCategory={homeCategory}
            onCategorySelect={(cat) => {
              setHomeCategory(cat);
            }}
            listings={listings}
            jobs={MOCK_JOBS}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onListingSelect={(id) => setSelectedListingId(id)}
            onNavChange={setActiveTab}
            translations={currentTranslations}
          />
        );
      case 'search':
        return (
          <SearchView
            lang={lang}
            listings={listings}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onListingSelect={(id) => setSelectedListingId(id)}
            translations={currentTranslations}
          />
        );
      case 'sell':
        return (
          <SellView
            lang={lang}
            onAddListing={handleAddListing}
            translations={currentTranslations}
            currentUser={currentUser}
            onNavChange={setActiveTab}
          />
        );
      case 'messages':
        return (
          <MessagesView
            lang={lang}
            initialConversations={conversations}
            translations={currentTranslations}
          />
        );
      case 'profile':
        return (
          <ProfileView
            lang={lang}
            onNavChange={setActiveTab}
            translations={currentTranslations}
            listings={listings}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onListingSelect={(id) => setSelectedListingId(id)}
            currentUser={currentUser}
            onLogout={() => setCurrentUser(null)}
            onLogin={(userObj: User) => setCurrentUser(userObj)}
          />
        );
      default:
        return (
          <HomeView
            lang={lang}
            onLanguageChange={setLang}
            selectedCategory="all"
            onCategorySelect={() => {}}
            listings={listings}
            jobs={MOCK_JOBS}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onListingSelect={(id) => setSelectedListingId(id)}
            onNavChange={setActiveTab}
            translations={currentTranslations}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] flex justify-center text-zinc-100 font-sans antialiased overflow-x-hidden p-0 m-0">
      {/* Container simulating a refined, premium edge-to-edge mobile container width */}
      <div className="w-full max-w-[480px] bg-[#050505]/95 flex flex-col shadow-2xl relative min-h-screen border-x border-white/5 overflow-x-hidden overflow-y-auto">
        {/* Frosted Glass ambient glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 -left-10 w-72 h-72 bg-orange-600/5 rounded-full blur-[90px]"></div>
        </div>

        {/* Ensure views render above the ambient elements overlay */}
        <div className="relative z-10 flex flex-col flex-grow">
        {/* Active main screen components */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedListingId ? `listing-${selectedListingId}` : `tab-${activeTab}-${lang}`}
            initial={{ opacity: 0, scale: 0.98, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col flex-grow"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>

        {/* Global Floating Glass bottom navbar */}
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedListingId(null); // Clear selected item scope on nav switches
            setActiveTab(tab);
          }}
          unreadMessagesCount={unreadMessagesCount}
          labels={bottomNavLabels}
        />
        </div>
      </div>
    </div>
  );
}
