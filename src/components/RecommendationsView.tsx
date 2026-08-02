import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, CheckCircle2, Star, Film, BookOpen } from 'lucide-react';
import { MediaItem, AIRecommendationResponse } from '../types';
import { MediaCard } from './MediaCard';

interface RecommendationsViewProps {
  catalog: MediaItem[];
  watchlist: string[];
  favorites: string[];
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectMedia: (item: MediaItem) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  catalog,
  watchlist,
  favorites,
  onToggleWatchlist,
  onToggleFavorite,
  onSelectMedia,
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendationData, setRecommendationData] = useState<AIRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const favoriteItems = catalog.filter((i) => favorites.includes(i.id));
  const watchlistItems = catalog.filter((i) => watchlist.includes(i.id));

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favorites: favoriteItems,
          watchlist: watchlistItems,
          catalog: catalog,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const data: AIRecommendationResponse = await res.json();
      setRecommendationData(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate AI recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [favorites.length, watchlist.length]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Taste Match Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">
            Personalized AI Recommendations
          </h1>
          <p className="text-xs text-white/60 leading-relaxed font-normal">
            Gemini analyzes your saved favorites and watchlist items to curate tailored movies and books matching your unique taste profile.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-black' : ''}`} />
          Refresh AI Matches
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !recommendationData && (
        <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-4">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-white/70">Analyzing your watchlist and favorite genres with Gemini...</p>
        </div>
      )}

      {recommendationData && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Taste Insight Banner */}
          <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/30 space-y-2 backdrop-blur-md">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Your Taste Insight
            </h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal italic">
              "{recommendationData.overallInsight}"
            </p>
          </div>

          {/* Recommended Items Grid with AI Reason Badges */}
          <div className="space-y-4">
            <h2 className="text-xl font-serif italic text-white">Recommended For You</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationData.recommendations.map((rec) => {
                const catalogItem = catalog.find((i) => i.id === rec.id || i.title.toLowerCase() === rec.title.toLowerCase());
                if (!catalogItem) return null;

                return (
                  <div key={rec.id} className="flex flex-col space-y-2">
                    
                    {/* Match percentage & AI Reason Chip */}
                    <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs space-y-1 shadow-md">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {rec.matchPercentage}% Match
                        </span>
                        <span className="text-[9px] text-white/40 uppercase font-mono tracking-widest">Gemini Pick</span>
                      </div>
                      <p className="text-[11px] text-white/70 font-normal leading-snug italic">
                        {rec.aiReasoning}
                      </p>
                    </div>

                    <MediaCard
                      item={catalogItem}
                      isWatchlist={watchlist.includes(catalogItem.id)}
                      isFavorite={favorites.includes(catalogItem.id)}
                      onToggleWatchlist={onToggleWatchlist}
                      onToggleFavorite={onToggleFavorite}
                      onSelect={onSelectMedia}
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
