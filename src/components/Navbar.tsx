import React from 'react';
import { Film, BookOpen, Search, Sparkles, Heart, Bookmark, User, ShieldCheck, Terminal } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  watchlistCount: number;
  favoritesCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  watchlistCount,
  favoritesCount,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/10">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-lg leading-none tracking-tighter bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent flex items-center gap-1.5">
                CINELIB <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40 tracking-normal">AI</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Cinema & Literature</p>
            </div>
          </div>

          {/* Quick Search input in Header */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search with AI..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="w-full bg-white/5 hover:bg-white/10 text-white text-xs pl-9 pr-4 py-1.5 rounded-full border border-white/10 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-white/40"
            />
          </div>

          {/* Main Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-white/60">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeTab === 'catalog'
                  ? 'text-white border-b-2 border-amber-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Catalog
            </button>

            <button
              onClick={() => setActiveTab('nl-search')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeTab === 'nl-search'
                  ? 'text-white border-b-2 border-amber-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI Search
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeTab === 'recommendations'
                  ? 'text-white border-b-2 border-amber-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Recommendations
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-1.5 transition-colors py-1 relative ${
                activeTab === 'watchlist'
                  ? 'text-white border-b-2 border-amber-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved
              {(watchlistCount > 0 || favoritesCount > 0) && (
                <span className="ml-1 px-1.5 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded-full font-bold border border-amber-500/40">
                  {watchlistCount + favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeTab === 'admin'
                  ? 'text-white border-b-2 border-amber-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Admin
            </button>

            <button
              onClick={() => setActiveTab('devops')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeTab === 'devops'
                  ? 'text-white border-b-2 border-amber-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              DevOps
            </button>
          </nav>

          {/* Profile User Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full transition-all border ${
              activeTab === 'profile'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
            }`}
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
            />
            <span className="text-xs font-semibold hidden sm:inline">{userProfile.name}</span>
          </button>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-white/10 scrollbar-none text-xs uppercase tracking-wider font-medium text-white/70">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'catalog' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border border-white/10'
            }`}
          >
            <BookOpen className="w-3 h-3" /> Catalog
          </button>
          <button
            onClick={() => setActiveTab('nl-search')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'nl-search' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border border-white/10'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" /> AI Search
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'recommendations' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border border-white/10'
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'watchlist' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border border-white/10'
            }`}
          >
            Saved ({watchlistCount + favoritesCount})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border border-white/10'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('devops')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'devops' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border border-white/10'
            }`}
          >
            DevOps
          </button>
        </div>
      </div>
    </header>
  );
};
