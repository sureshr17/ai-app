import React, { useState } from 'react';
import { User, Film, BookOpen, Star, Save, CheckCircle2, Heart, Bookmark } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  watchlistCount: number;
  favoritesCount: number;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  watchlistCount,
  favoritesCount,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [savedMessage, setSavedMessage] = useState(false);

  const AVAILABLE_AVATARS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name,
      email,
      avatar,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 backdrop-blur-md">
        <img
          src={userProfile.avatar}
          alt={userProfile.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-xl"
        />

        <div className="space-y-2 text-center md:text-left flex-1">
          <h1 className="text-3xl font-serif italic text-white">{userProfile.name}</h1>
          <p className="text-xs text-white/60 font-mono">{userProfile.email}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-amber-400 border border-white/10 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Watchlist: {watchlistCount}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-rose-400 border border-white/10 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> Favorites: {favoritesCount}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-amber-300 border border-white/10 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Reviews: {userProfile.reviewsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Reactive Form Settings */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6 shadow-xl backdrop-blur-md">
        <h2 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">Edit Profile Settings</h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/50 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 font-medium"
            />
          </div>

          <div>
            <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/50 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 font-medium"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-white/60 font-mono text-[10px] uppercase tracking-wider mb-2">Choose Avatar</label>
            <div className="flex gap-4">
              {AVAILABLE_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`p-1 rounded-full border-2 transition-all ${
                    avatar === url ? 'border-amber-500 scale-105 shadow-lg shadow-amber-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Avatar option" className="w-12 h-12 rounded-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {savedMessage && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </span>
          )}

          <button
            type="submit"
            className="ml-auto px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>

      </form>

    </div>
  );
};
