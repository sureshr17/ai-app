import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, Sparkles, CheckCircle2, AlertCircle, Film, BookOpen, Search } from 'lucide-react';
import { MediaItem, MediaType, AIGeneratedMediaInfo } from '../types';

interface AdminPanelViewProps {
  catalog: MediaItem[];
  onAddMedia: (newItem: MediaItem) => void;
  onUpdateMedia: (updatedItem: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  catalog,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  const [creator, setCreator] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [genreInput, setGenreInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [rating, setRating] = useState<number>(4.5);
  const [posterUrl, setPosterUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [durationOrPages, setDurationOrPages] = useState('2h 00m');

  // AI Generation State
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Auto Fill using Gemini API
  const handleAutoFillAI = async () => {
    if (!title.trim()) {
      setAiMessage('Please enter a Title first before generating AI metadata.');
      return;
    }

    setGeneratingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          creator,
        }),
      });

      if (!res.ok) throw new Error('AI metadata generation failed');
      const data: AIGeneratedMediaInfo = await res.json();

      setSynopsis(data.synopsis);
      if (data.highlights && data.highlights.length > 0) {
        setHighlightsInput(data.highlights.join('\n'));
      }
      if (data.suggestedGenres && data.suggestedGenres.length > 0) {
        setGenreInput(data.suggestedGenres.join(', '));
      }
      if (data.durationOrPages) {
        setDurationOrPages(data.durationOrPages);
      }
      if (!posterUrl) {
        setPosterUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80');
      }

      setAiMessage('✨ Successfully auto-generated synopsis, highlights, and genres using Gemini!');
    } catch (err: any) {
      console.error(err);
      setAiMessage('Failed to generate AI metadata. Please fill manually.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creator.trim()) return;

    const genres = genreInput.split(',').map((g) => g.trim()).filter(Boolean);
    const highlights = highlightsInput.split('\n').map((h) => h.trim()).filter(Boolean);

    const itemData: MediaItem = {
      id: editingId || `m_${Date.now()}`,
      type,
      title: title.trim(),
      creator: creator.trim(),
      year: Number(year),
      genre: genres.length > 0 ? genres : ['General'],
      language: language.trim() || 'English',
      rating: Number(rating),
      voteCount: editingId ? (catalog.find((c) => c.id === editingId)?.voteCount || 1) : 1,
      posterUrl: posterUrl.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      synopsis: synopsis.trim(),
      highlights: highlights,
      durationOrPages: durationOrPages.trim() || (type === 'movie' ? '2h 00m' : '300 pages'),
      releaseDate: `${year}-01-01`,
    };

    if (editingId) {
      onUpdateMedia(itemData);
    } else {
      onAddMedia(itemData);
    }

    resetForm();
  };

  const startEdit = (item: MediaItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setCreator(item.creator);
    setYear(item.year);
    setGenreInput(item.genre.join(', '));
    setLanguage(item.language);
    setRating(item.rating);
    setPosterUrl(item.posterUrl);
    setSynopsis(item.synopsis);
    setHighlightsInput(item.highlights.join('\n'));
    setDurationOrPages(item.durationOrPages);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setType('movie');
    setCreator('');
    setYear(new Date().getFullYear());
    setGenreInput('');
    setLanguage('English');
    setRating(4.5);
    setPosterUrl('');
    setSynopsis('');
    setHighlightsInput('');
    setDurationOrPages('2h 00m');
    setAiMessage(null);
  };

  const filteredCatalog = catalog.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Admin Title */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl flex items-center justify-between backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-serif italic text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            Catalog Management Studio
          </h1>
          <p className="text-xs text-white/60">Add, edit, or remove movies and books with Gemini AI auto-completion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl space-y-5 h-fit backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              {editingId ? 'Edit Media Entry' : 'Add New Movie/Book'}
            </h2>
            
            {/* Auto Fill AI Button */}
            <button
              type="button"
              onClick={handleAutoFillAI}
              disabled={generatingAI}
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 shadow transition-all active:scale-95 disabled:opacity-50"
              title="Auto-generate synopsis and highlights using Gemini"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              {generatingAI ? 'Generating...' : 'Auto-Fill AI'}
            </button>
          </div>

          {aiMessage && (
            <p className="text-[11px] p-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 italic">
              {aiMessage}
            </p>
          )}

          <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
            <div>
              <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Dune Messiah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as MediaType;
                    setType(newType);
                    setDurationOrPages(newType === 'movie' ? '2h 00m' : '320 pages');
                  }}
                  className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 font-medium"
                >
                  <option value="movie">Movie</option>
                  <option value="book">Book</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Director / Author *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Frank Herbert"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Duration / Pages</label>
                <input
                  type="text"
                  placeholder="e.g., 2h 15m or 350 pages"
                  value={durationOrPages}
                  onChange={(e) => setDurationOrPages(e.target.value)}
                  className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Initial Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Genres (comma separated)</label>
              <input
                type="text"
                placeholder="Sci-Fi, Adventure, Drama"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Poster Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Synopsis</label>
              <textarea
                rows={3}
                placeholder="Enter storyline or description..."
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Highlights (one per line)</label>
              <textarea
                rows={2}
                placeholder="Key feature 1&#10;Key feature 2"
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                className="w-full bg-black/50 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" /> {editingId ? 'Update Item' : 'Add Item'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2.5 rounded-full bg-black/60 text-white/70 hover:text-white text-xs font-bold border border-white/10"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Catalog Table Column */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Catalog Items ({filteredCatalog.length})
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search catalog table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 text-white text-xs pl-9 pr-3 py-1.5 rounded-full border border-white/10 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-black/80 text-amber-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Media</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Creator</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/40">
                {filteredCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img src={item.posterUrl} alt={item.title} className="w-8 h-12 object-cover rounded border border-white/10" />
                      <div>
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-[10px] text-white/40">{item.language}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${item.type === 'movie' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-white/80">{item.creator}</td>
                    <td className="p-3 text-white/50">{item.year}</td>
                    <td className="p-3 font-bold text-amber-400">★ {item.rating.toFixed(1)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded bg-black/60 hover:bg-white/10 text-amber-300 border border-white/10"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMedia(item.id)}
                        className="p-1.5 rounded bg-black/60 hover:bg-rose-900/50 text-rose-400 border border-white/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
