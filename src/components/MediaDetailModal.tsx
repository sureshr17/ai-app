import React, { useState } from 'react';
import { X, Star, Film, BookOpen, Heart, Bookmark, Sparkles, ThumbsUp, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { MediaItem, Review, AISummaryResponse } from '../types';

interface MediaDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  isWatchlist: boolean;
  isFavorite: boolean;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  reviews: Review[];
  onAddReview: (mediaId: string, rating: number, comment: string, name: string) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  onClose,
  isWatchlist,
  isFavorite,
  onToggleWatchlist,
  onToggleFavorite,
  reviews,
  onAddReview,
}) => {
  if (!item) return null;

  const itemReviews = reviews.filter((r) => r.mediaId === item.id);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<AISummaryResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Request AI Review Summary from Server
  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const res = await fetch('/api/gemini/summarize-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          type: item.type,
          synopsis: item.synopsis,
          reviews: itemReviews.length > 0 ? itemReviews : [
            { userName: 'Sample User', rating: item.rating, comment: item.synopsis }
          ],
        }),
      });

      if (!res.ok) throw new Error('Failed to generate review summary');
      const data: AISummaryResponse = await res.json();
      setAiSummary(data);
    } catch (err: any) {
      console.error(err);
      setSummaryError('Unable to generate AI review summary at this moment.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Submit User Review Form
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(item.id, newRating, newComment.trim(), newName.trim() || 'Anonymous Reviewer');
    setNewComment('');
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Poster Thumbnail */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-xl">
              <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow">
                {item.type === 'movie' ? <Film className="w-3.5 h-3.5 text-amber-400" /> : <BookOpen className="w-3.5 h-3.5 text-amber-400" />}
                <span className="capitalize">{item.type}</span>
              </div>
            </div>

            {/* Title & Metadata Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-1">
                  <span>{item.creator}</span>
                  <span>•</span>
                  <span>{item.year}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">{item.language}</span>
                  <span>•</span>
                  <span className="text-white/60">{item.durationOrPages}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight leading-tight">
                  {item.title}
                </h2>
              </div>

              {/* Rating & Actions Bar */}
              <div className="flex flex-wrap items-center gap-4 py-3 border-y border-white/10">
                <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/30 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="text-xs text-white/40 font-normal">({item.voteCount} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleWatchlist(item.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                      isWatchlist
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                        : 'bg-black/60 hover:bg-white/10 text-white/70 border-white/10'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                    {isWatchlist ? 'In Watchlist' : 'Add Watchlist'}
                  </button>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                      isFavorite
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                        : 'bg-black/60 hover:bg-white/10 text-white/70 border-white/10'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1.5">
                {item.genre.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white/70 border border-white/10">
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-1">Synopsis</h4>
                <p className="text-sm text-white/80 leading-relaxed font-normal">{item.synopsis}</p>
              </div>

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2">Key Highlights</h4>
                  <ul className="space-y-1.5">
                    {item.highlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

          {/* AI Review Summarizer Section */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-serif italic text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Gemini AI Review Summarizer
                </h3>
                <p className="text-xs text-white/60">Synthesize audience consensus, pros, cons, and audience fit using Gemini 3.6 Flash.</p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loadingSummary}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 shrink-0"
              >
                {loadingSummary ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-black" />
                )}
                {aiSummary ? 'Refresh AI Summary' : 'Generate AI Summary'}
              </button>
            </div>

            {summaryError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{summaryError}</span>
              </div>
            )}

            {aiSummary && (
              <div className="space-y-4 pt-3 border-t border-white/10 animate-fadeIn">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-amber-300 border border-white/10 font-mono">
                    Sentiment: {aiSummary.overallSentiment}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-amber-400 border border-white/10 font-mono">
                    AI Match Score: {aiSummary.aiScore}/100
                  </span>
                  <span className="text-xs text-white/60 font-medium">
                    Target Audience: <strong className="text-white/90">{aiSummary.targetAudience}</strong>
                  </span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed italic bg-black/50 p-3.5 rounded-xl border border-white/10">
                  "{aiSummary.summary}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 space-y-1.5">
                    <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5" /> Key Pros
                    </h5>
                    <ul className="space-y-1 text-white/80">
                      {aiSummary.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-1.5">
                    <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Considerations
                    </h5>
                    <ul className="space-y-1 text-white/80">
                      {aiSummary.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Reviews & Submission Form */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Community Reviews ({itemReviews.length})
            </h3>

            {/* Reactive Review Form */}
            <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">Submit Your Review</h4>
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Rating Picker */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-white/60 mr-2">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <textarea
                placeholder="Share your thoughts on storyline, direction, acting or writing style..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
                className="w-full bg-black/60 text-white text-xs p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 placeholder:text-white/40"
              />

              <div className="flex items-center justify-between">
                {submittedMessage && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Review submitted successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-2 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Post Review
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {itemReviews.length === 0 ? (
                <p className="text-xs text-white/40 italic p-4 text-center bg-black/40 rounded-xl border border-white/10">
                  No community reviews posted yet. Be the first to share your review!
                </p>
              ) : (
                itemReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover border border-amber-500/40" />
                        <div>
                          <div className="text-xs font-bold text-white">{rev.userName}</div>
                          <div className="text-[10px] text-white/40">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed font-normal">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
