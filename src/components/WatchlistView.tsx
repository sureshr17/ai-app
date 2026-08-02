import React, { useState } from 'react';
import { Bookmark, Heart, Film, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';

interface WatchlistViewProps {
  catalog: MediaItem[];
  watchlist: string[];
  favorites: string[];
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectMedia: (item: MediaItem) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  catalog,
  watchlist,
  favorites,
  onToggleWatchlist,
  onToggleFavorite,
  onSelectMedia,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites'>('watchlist');

  const watchlistItems = catalog.filter((item) => watchlist.includes(item.id));
  const favoriteItems = catalog.filter((item) => favorites.includes(item.id));

  const currentList = activeTab === 'watchlist' ? watchlistItems : favoriteItems;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-serif italic text-white tracking-tight">Your Saved Collection</h1>
          <p className="text-xs text-white/60">Manage your personal watchlist and hall-of-fame favorites.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-black/60 p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'watchlist'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            Watchlist ({watchlistItems.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'favorites'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            Favorites ({favoriteItems.length})
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <p className="text-base text-white/80 font-semibold">
            Your {activeTab} is currently empty.
          </p>
          <p className="text-xs text-white/40">
            Browse the catalog and click the bookmark or heart icon on any movie or book to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentList.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              isWatchlist={watchlist.includes(item.id)}
              isFavorite={favorites.includes(item.id)}
              onToggleWatchlist={onToggleWatchlist}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectMedia}
            />
          ))}
        </div>
      )}

    </div>
  );
};
