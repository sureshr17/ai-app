import React from 'react';
import { Star, Film, BookOpen, Heart, Bookmark, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCardProps {
  item: MediaItem;
  isWatchlist: boolean;
  isFavorite: boolean;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelect: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isWatchlist,
  isFavorite,
  onToggleWatchlist,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <div className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 hover:bg-white/10 shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Poster Image & Overlay Controls */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/60">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

        {/* Type Badge (Movie / Book) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-md">
          {item.type === 'movie' ? (
            <>
              <Film className="w-3 h-3 text-amber-400" />
              <span>Movie</span>
            </>
          ) : (
            <>
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Book</span>
            </>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500 text-black shadow-md backdrop-blur-md">
          <Star className="w-3 h-3 fill-black text-black" />
          <span>{item.rating.toFixed(1)}</span>
        </div>

        {/* Quick Save / Favorite Floating Action Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(item.id);
            }}
            title={isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isWatchlist
                ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-105'
                : 'bg-black/70 text-white/70 border-white/10 hover:bg-black/90 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-rose-600 text-white border-rose-500 shadow-md scale-105'
                : 'bg-black/70 text-white/70 border-white/10 hover:bg-black/90 hover:text-rose-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Duration / Pages & Year Label */}
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/70 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          {item.year} • {item.durationOrPages}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-amber-500 mb-1">
            <span className="truncate">{item.creator}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/60 text-[10px] border border-white/10">
              {item.language}
            </span>
          </div>

          <h3 
            onClick={() => onSelect(item)}
            className="font-bold text-base text-white hover:text-amber-400 line-clamp-1 cursor-pointer transition-colors"
          >
            {item.title}
          </h3>

          <p className="text-xs text-white/60 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {item.synopsis}
          </p>
        </div>

        {/* Genre Tags & View Details */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 overflow-hidden h-6">
            {item.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white/70 border border-white/10 whitespace-nowrap"
              >
                {g}
              </span>
            ))}
            {item.genre.length > 2 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white/40">
                +{item.genre.length - 2}
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(item)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn shrink-0 transition-colors uppercase tracking-wider"
          >
            Details
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
