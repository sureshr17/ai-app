import React, { useState, useMemo } from 'react';
import { Film, BookOpen, Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';

interface CatalogViewProps {
  catalog: MediaItem[];
  watchlist: string[];
  favorites: string[];
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectMedia: (item: MediaItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenNLSearch: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  catalog,
  watchlist,
  favorites,
  onToggleWatchlist,
  onToggleFavorite,
  onSelectMedia,
  searchQuery,
  setSearchQuery,
  onOpenNLSearch,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'book'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  // Extract all unique genres & languages for dropdowns
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => item.genre.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [catalog]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => set.add(item.language));
    return Array.from(set).sort();
  }, [catalog]);

  // Filtered and Sorted catalog items
  const filteredItems = useMemo(() => {
    return catalog
      .filter((item) => {
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) return false;
        // Genre filter
        if (selectedGenre !== 'all' && !item.genre.includes(selectedGenre)) return false;
        // Language filter
        if (selectedLanguage !== 'all' && item.language !== selectedLanguage) return false;
        // Min Rating filter
        if (item.rating < minRating) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesCreator = item.creator.toLowerCase().includes(q);
          const matchesGenre = item.genre.some((g) => g.toLowerCase().includes(q));
          const matchesSynopsis = item.synopsis.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCreator && !matchesGenre && !matchesSynopsis) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.year - a.year;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [catalog, selectedType, selectedGenre, selectedLanguage, minRating, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedGenre('all');
    setSelectedLanguage('all');
    setMinRating(0);
    setSearchQuery('');
    setSortBy('rating');
  };

  return (
    <div className="space-y-6">
      
      {/* Featured Banner / Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-tighter rounded shadow-sm">
              AI Featured Masterpiece
            </span>
            <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
              Science Fiction & Literature
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif italic text-white tracking-tight leading-tight">
            Interstellar & Epic Sci-Fi Literature
          </h1>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl max-w-xl">
            <p className="text-xs leading-relaxed text-white/80 italic">
              <span className="text-amber-400 font-bold mr-1">Gemini Analysis:</span> 
              A profound exploration of temporal relativity and human connection. Our models suggest pairing movie classics like Interstellar with Cixin Liu's 'The Three-Body Problem' for readers who enjoy high stakes and deep philosophical questions.
            </p>
          </div>

          <div className="pt-1 flex flex-wrap gap-3">
            <button
              onClick={onOpenNLSearch}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-black" />
              Search With Gemini AI
            </button>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block w-72 h-44 rounded-xl border border-white/10 bg-zinc-900/80 overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" 
            alt="Cinematic abstract" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Curated AI Collection</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl space-y-4 backdrop-blur-md">
        
        {/* Top Controls: Type Tabs & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Media Type Tabs */}
          <div className="flex items-center bg-black/50 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === 'all' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              All ({catalog.length})
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                selectedType === 'movie' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Movies ({catalog.filter((i) => i.type === 'movie').length})
            </button>
            <button
              onClick={() => setSelectedType('book')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                selectedType === 'book' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Books ({catalog.filter((i) => i.type === 'book').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Filter title, director, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 text-white text-xs pl-9 pr-3 py-2 rounded-full border border-white/10 focus:outline-none focus:border-amber-500/50 placeholder:text-white/40"
            />
          </div>

        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs">
          
          {/* Genre Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white/60 font-medium uppercase tracking-wider text-[10px]">Genre:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-black/60 text-white px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">All Genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/60 font-medium uppercase tracking-wider text-[10px]">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-black/60 text-white px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">All Languages</option>
              {allLanguages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/60 font-medium uppercase tracking-wider text-[10px]">Min Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-black/60 text-white px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value={0}>Any Rating</option>
              <option value={4.0}>4.0+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-white/60 font-medium uppercase tracking-wider text-[10px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/60 text-amber-400 px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500 font-bold"
            >
              <option value="rating">Highest Rated</option>
              <option value="year">Release Year</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* Grid of Catalog Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
          <p className="text-base text-slate-300 font-semibold">No movies or books match your active filters.</p>
          <p className="text-xs text-slate-500">Try clearing your search query or selecting "All Media".</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
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
