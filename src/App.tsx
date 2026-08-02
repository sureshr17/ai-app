import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { NLSearchView } from './components/NLSearchView';
import { RecommendationsView } from './components/RecommendationsView';
import { WatchlistView } from './components/WatchlistView';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { DevOpsView } from './components/DevOpsView';
import { MediaDetailModal } from './components/MediaDetailModal';
import { INITIAL_CATALOG, INITIAL_REVIEWS, INITIAL_USER_PROFILE } from './data/catalog';
import { MediaItem, Review, UserProfile } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catalog State (with localStorage persistence fallback)
  const [catalog, setCatalog] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinelib_catalog');
      return saved ? JSON.parse(saved) : INITIAL_CATALOG;
    } catch (e) {
      return INITIAL_CATALOG;
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('cinelib_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('cinelib_user');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch (e) {
      return INITIAL_USER_PROFILE;
    }
  });

  // Saved Lists
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinelib_watchlist');
      return saved ? JSON.parse(saved) : ['m3', 'b2', 'b4'];
    } catch (e) {
      return ['m3', 'b2', 'b4'];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinelib_favorites');
      return saved ? JSON.parse(saved) : ['m1', 'm2', 'b1'];
    } catch (e) {
      return ['m1', 'm2', 'b1'];
    }
  });

  // Selected Detail Modal
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cinelib_catalog', JSON.stringify(catalog));
    } catch (e) {}
  }, [catalog]);

  useEffect(() => {
    try {
      localStorage.setItem('cinelib_reviews', JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('cinelib_watchlist', JSON.stringify(watchlist));
    } catch (e) {}
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('cinelib_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('cinelib_user', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  // Handlers for Watchlist & Favorites
  const handleToggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Handler for adding new user review
  const handleAddReview = (mediaId: string, rating: number, comment: string, name: string) => {
    const newRev: Review = {
      id: `r_${Date.now()}`,
      mediaId,
      userName: name || userProfile.name,
      userAvatar: userProfile.avatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update user profile review count
    setUserProfile((prev) => ({
      ...prev,
      reviewsCount: prev.reviewsCount + 1,
    }));
  };

  // Admin Handlers
  const handleAddMedia = (newItem: MediaItem) => {
    setCatalog((prev) => [newItem, ...prev]);
  };

  const handleUpdateMedia = (updatedItem: MediaItem) => {
    setCatalog((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteMedia = (id: string) => {
    setCatalog((prev) => prev.filter((item) => item.id !== id));
    setWatchlist((prev) => prev.filter((i) => i !== id));
    setFavorites((prev) => prev.filter((i) => i !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans antialiased selection:bg-amber-500 selection:text-black flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        watchlistCount={watchlist.length}
        favoritesCount={favorites.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalog' && (
          <CatalogView
            catalog={catalog}
            watchlist={watchlist}
            favorites={favorites}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleFavorite={handleToggleFavorite}
            onSelectMedia={setSelectedMedia}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenNLSearch={() => setActiveTab('nl-search')}
          />
        )}

        {activeTab === 'nl-search' && (
          <NLSearchView
            catalog={catalog}
            watchlist={watchlist}
            favorites={favorites}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleFavorite={handleToggleFavorite}
            onSelectMedia={setSelectedMedia}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            catalog={catalog}
            watchlist={watchlist}
            favorites={favorites}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleFavorite={handleToggleFavorite}
            onSelectMedia={setSelectedMedia}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            catalog={catalog}
            watchlist={watchlist}
            favorites={favorites}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleFavorite={handleToggleFavorite}
            onSelectMedia={setSelectedMedia}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            watchlistCount={watchlist.length}
            favoritesCount={favorites.length}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView
            catalog={catalog}
            onAddMedia={handleAddMedia}
            onUpdateMedia={handleUpdateMedia}
            onDeleteMedia={handleDeleteMedia}
          />
        )}

        {activeTab === 'devops' && <DevOpsView />}
      </main>

      {/* Media Detail Modal */}
      <MediaDetailModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        isWatchlist={selectedMedia ? watchlist.includes(selectedMedia.id) : false}
        isFavorite={selectedMedia ? favorites.includes(selectedMedia.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onToggleFavorite={handleToggleFavorite}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Footer */}
      <footer className="h-12 border-t border-white/5 bg-black/60 flex items-center justify-between px-4 sm:px-8 text-[9px] uppercase tracking-[0.2em] text-white/40">
        <div>Engineered with React & Gemini 3.6 Flash</div>
        <div className="flex space-x-6">
          <span>V 2.4.0-Stable</span>
          <span className="hidden sm:inline">Cloud Infrastructure: Docker/Actions</span>
          <span className="text-amber-500/80 font-bold">AI Status: Online</span>
        </div>
      </footer>

    </div>
  );
}
