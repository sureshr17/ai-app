import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, Bot, CheckCircle2, AlertCircle } from 'lucide-react';
import { MediaItem, AISearchResponse } from '../types';
import { MediaCard } from './MediaCard';

interface NLSearchViewProps {
  catalog: MediaItem[];
  watchlist: string[];
  favorites: string[];
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectMedia: (item: MediaItem) => void;
}

export const NLSearchView: React.FC<NLSearchViewProps> = ({
  catalog,
  watchlist,
  favorites,
  onToggleWatchlist,
  onToggleFavorite,
  onSelectMedia,
}) => {
  const [nlQuery, setNlQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AISearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const EXAMPLE_PROMPTS = [
    'Find romantic comedies with 4+ star ratings',
    'Show me mind-bending sci-fi movies directed by Christopher Nolan',
    'Top rated Japanese animated fantasy movies',
    'Dystopian sci-fi books about rebellion and tyranny',
    'French or Spanish mysteries with rich atmosphere',
  ];

  const handleSearch = async (queryToRun?: string) => {
    const q = queryToRun || nlQuery;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/nl-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          items: catalog,
        }),
      });

      if (!res.ok) throw new Error('Failed to execute AI search');
      const data: AISearchResponse = await res.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to perform natural language search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const matchedItems = catalog.filter((i) => aiResult?.matchedIds.includes(i.id));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Gemini 3.6 Natural Language Search
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">
          Ask Gemini Anything in Plain English
        </h1>
        <p className="text-xs text-white/60 max-w-xl mx-auto leading-relaxed font-normal">
          Type complex, conversational queries with specific criteria like genres, ratings, languages, director styles, or narrative themes.
        </p>
      </div>

      {/* Natural Language Input Box */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl space-y-4 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder='e.g., "find romantic comedies with 4+ star ratings"'
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              className="w-full bg-black/50 text-white text-xs pl-11 pr-4 py-3 rounded-full border border-white/10 focus:outline-none focus:border-amber-500/50 font-medium placeholder:text-white/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !nlQuery.trim()}
            className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 active:scale-95 shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-black" />
            )}
            Search
          </button>
        </form>

        {/* Example Prompt Chips */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Try an example query:</span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setNlQuery(prompt);
                  handleSearch(prompt);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 hover:bg-white/10 text-amber-200/90 border border-white/10 hover:border-amber-500/40 transition-all text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Search Results & Reasoning Box */}
      {aiResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Reasoning Box */}
          <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/30 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Bot className="w-5 h-5 text-amber-400" />
              <span>Gemini AI Insights & Matching Criteria</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-normal italic">
              {aiResult.aiReasoning}
            </p>

            {aiResult.suggestedFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs text-white/60 font-mono">
                <span className="font-semibold text-amber-300">Inferred Criteria:</span>
                {aiResult.suggestedFilters.genre && (
                  <span className="px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-white/10">
                    Genre: {aiResult.suggestedFilters.genre}
                  </span>
                )}
                {aiResult.suggestedFilters.language && (
                  <span className="px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-white/10">
                    Language: {aiResult.suggestedFilters.language}
                  </span>
                )}
                {aiResult.suggestedFilters.minRating && (
                  <span className="px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-white/10">
                    Min Rating: {aiResult.suggestedFilters.minRating}+ Stars
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Matched Media Items */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
              Matched Titles ({matchedItems.length})
            </h3>

            {matchedItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">No media items in the current catalog matched that specific criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {matchedItems.map((item) => (
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

        </div>
      )}

    </div>
  );
};
