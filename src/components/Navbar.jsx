import React from 'react';
import { 
  Gamepad2, 
  Search, 
  Heart, 
  ShieldAlert, 
  Eye, 
  PlusCircle, 
  Sparkles, 
  X,
  Code,
  Dices
} from 'lucide-react';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount,
  onOpenCloakModal,
  onOpenAddGameModal,
  onOpenJsonModal,
  onTriggerPanic,
  onLaunchRandom,
  totalGamesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Brand & Stats */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <a 
            href="#" 
            className="flex items-center gap-3 group text-[#FAFAFA] font-bold text-lg tracking-tight"
            id="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              setSearchQuery('');
              setShowFavoritesOnly(false);
            }}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              Ω
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[#FAFAFA]">
                  PORTAL_ZERO
                </h1>
                <span className="text-[10px] text-zinc-400 font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                Unblocked Gaming Interface • {totalGamesCount} Titles
              </p>
            </div>
          </a>

          {/* Mobile Panic Button */}
          <button
            onClick={onTriggerPanic}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold"
            title="Panic Button (Esc)"
            id="btn-panic-mobile"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panic</span>
          </button>
        </div>

        {/* Search Bar - Bento Pill */}
        <div className="relative w-full md:max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 flex items-center gap-3 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              id="game-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 400+ titles... (Press '/' to focus)"
              className="bg-transparent border-none outline-none text-sm text-[#FAFAFA] placeholder-zinc-500 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-zinc-500 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls - Bento Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Favorites Filter */}
          <button
            id="btn-favorites-toggle"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showFavoritesOnly
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/25'
                : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border-zinc-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white' : 'text-rose-400'}`} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                showFavoritesOnly ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Random Launcher */}
          {onLaunchRandom && (
            <button
              id="btn-random-game"
              onClick={onLaunchRandom}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all"
              title="Launch a random game"
            >
              <Dices className="w-3.5 h-3.5 text-indigo-400" />
              <span>Random</span>
            </button>
          )}

          {/* Tab Cloak / Disguise */}
          <button
            id="btn-cloak-modal"
            onClick={onOpenCloakModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all"
            title="Disguise browser tab (Classroom, Docs, Wikipedia)"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cloak</span>
          </button>

          {/* Add Custom Game */}
          <button
            id="btn-add-custom-game"
            onClick={onOpenAddGameModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all"
            title="Add custom iframe game"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add</span>
          </button>

          {/* JSON Manifest modal */}
          <button
            id="btn-json-modal"
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all"
            title="Open games.json manifest database"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON</span>
          </button>

          {/* Panic Emergency Key */}
          <button
            id="btn-panic-nav"
            onClick={onTriggerPanic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all shadow-xs"
            title="Emergency Panic Shortcut (Esc / `)"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panic (Esc)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
