import React, { useState, useEffect, useMemo } from 'react';
import defaultGamesData from './data/games.json';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { CloakModal } from './components/CloakModal';
import { AddGameModal } from './components/AddGameModal';
import { JsonModal } from './components/JsonModal';
import { PanicDecoy } from './components/PanicDecoy';
import { 
  Gamepad2, 
  Sparkles, 
  History, 
  Heart, 
  ChevronRight, 
  Dices, 
  Code, 
  Eye, 
  Play, 
  ArrowRight
} from 'lucide-react';

export default function App() {
  // State for all games (default JSON + custom localStorage)
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked_custom_games');
      if (saved) {
        const custom = JSON.parse(saved);
        return [...defaultGamesData, ...custom];
      }
    } catch (e) {
      console.error('Failed to parse custom games:', e);
    }
    return defaultGamesData;
  });

  // Selected game to play in iframe
  const [activeGame, setActiveGame] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked_favorites');
      return saved ? JSON.parse(saved) : ['2048', 'tetris-classic', 'flappy-bird'];
    } catch {
      return ['2048', 'tetris-classic', 'flappy-bird'];
    }
  });

  // Recents
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Panic
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('unblocked_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recents
  useEffect(() => {
    localStorage.setItem('unblocked_recents', JSON.stringify(recentIds));
  }, [recentIds]);

  // Global Keyboard Shortcuts (Panic Esc, Focus /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Panic toggle on ESC or ` (backtick)
      if (e.key === 'Escape' || e.key === '`') {
        if (!activeGame && !isCloakOpen && !isAddGameOpen && !isJsonOpen) {
          setIsPanicActive((prev) => !prev);
        }
      }
      // Focus search on '/'
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('game-search-input');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isCloakOpen, isAddGameOpen, isJsonOpen]);

  // Play Game Handler
  const handlePlayGame = (game) => {
    setActiveGame(game);
    // Add to recents
    setRecentIds((prev) => [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 8));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Random Game
  const handleLaunchRandom = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    handlePlayGame(games[randomIndex]);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add Custom Game
  const handleAddCustomGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.id.startsWith('custom-'));
      localStorage.setItem('unblocked_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    handlePlayGame(newGame);
  };

  // Import JSON
  const handleImportGames = (imported) => {
    setGames(imported);
    const customOnly = imported.filter((g) => g.id.startsWith('custom-'));
    localStorage.setItem('unblocked_custom_games', JSON.stringify(customOnly));
  };

  // Reset to default
  const handleResetToDefault = () => {
    localStorage.removeItem('unblocked_custom_games');
    setGames(defaultGamesData);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: games.length };
    games.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [games]);

  // Filtered Games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        game.title.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        (game.tags && game.tags.some((t) => t.toLowerCase().includes(query)));

      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchesFavorite = !showFavoritesOnly || favorites.includes(game.id);

      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [games, searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  // Featured games
  const featuredHeroGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  // Recent games objects
  const recentGames = useMemo(() => {
    return recentIds
      .map((id) => games.find((g) => g.id === id))
      .filter(Boolean);
  }, [recentIds, games]);

  // If panic decoy is triggered
  if (isPanicActive) {
    return <PanicDecoy onDismiss={() => setIsPanicActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        favoritesCount={favorites.length}
        onOpenCloakModal={() => setIsCloakOpen(true)}
        onOpenAddGameModal={() => setIsAddGameOpen(true)}
        onOpenJsonModal={() => setIsJsonOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        onLaunchRandom={handleLaunchRandom}
        totalGamesCount={games.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-8">
        {/* If Active Game Player View */}
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          /* Hub Landing & Bento Grid */
          <>
            {/* Bento Hero Feature Grid (When no active search or favorite filter) */}
            {!searchQuery && selectedCategory === 'All' && !showFavoritesOnly && (
              <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Hero Featured Bento Card (2 cols, 2 rows) */}
                {featuredHeroGame && (
                  <div
                    id={`hero-featured-card-${featuredHeroGame.id}`}
                    onClick={() => handlePlayGame(featuredHeroGame)}
                    className="md:col-span-2 lg:col-span-2 row-span-2 relative bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col justify-between shadow-xl cursor-pointer group transition-all"
                  >
                    {/* Background Artwork Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${featuredHeroGame.gradient || 'from-indigo-900 to-zinc-950'} opacity-60 group-hover:opacity-80 transition-opacity`} />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          Featured Title
                        </span>
                        <span className="px-3 py-1 rounded-full bg-zinc-900/80 text-zinc-300 border border-zinc-700/60 text-xs font-medium">
                          {featuredHeroGame.category}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleFavorite(featuredHeroGame.id, e)}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                          favorites.includes(featuredHeroGame.id)
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-black/40 hover:bg-black/60 text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(featuredHeroGame.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div className="relative z-10 my-6">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 group-hover:text-indigo-200 transition-colors">
                        {featuredHeroGame.title}
                      </h2>
                      <p className="text-sm md:text-base text-zinc-300 line-clamp-2 max-w-xl leading-relaxed">
                        {featuredHeroGame.description}
                      </p>
                    </div>

                    {/* Bottom Action & Tags */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {featuredHeroGame.tags && featuredHeroGame.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-black/40 text-zinc-300 border border-white/10 font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        id="btn-hero-launch"
                        onClick={() => handlePlayGame(featuredHeroGame)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Launch Game</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bento Tile 1: Random Game Launcher */}
                <div
                  id="bento-tile-random"
                  onClick={handleLaunchRandom}
                  className="bg-indigo-600 hover:bg-indigo-500 rounded-3xl p-6 text-white flex flex-col justify-between cursor-pointer transition-all shadow-lg shadow-indigo-500/20 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                      <Dices className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/20 text-indigo-100 font-bold">
                      1-Click Play
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className="font-bold text-lg text-white">Feeling Lucky?</h3>
                    <p className="text-xs text-indigo-100 mt-1">
                      Instantly jump into a randomly selected title from our library.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                    <span>Roll Random Title</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bento Tile 2: Tab Cloak Stealth */}
                <div
                  id="bento-tile-cloak"
                  onClick={() => setIsCloakOpen(true)}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 text-[#FAFAFA] flex flex-col justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Eye className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                      Stealth Mode
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className="font-bold text-base text-[#FAFAFA]">Tab Cloaking</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Disguise this browser tab as Google Classroom, Google Docs, or Canvas LMS.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Configure Disguise</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bento Tile 3: Live JSON Database Engine */}
                <div
                  id="bento-tile-json"
                  onClick={() => setIsJsonOpen(true)}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 text-[#FAFAFA] flex flex-col justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Code className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                      games.json
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className="font-bold text-base text-[#FAFAFA]">JSON & Iframe Manifest</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      All games stored as structured JSON records with standalone engines.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Raw JSON</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bento Tile 4: Server Status & Engine Latency */}
                <div
                  id="bento-tile-status"
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-[#FAFAFA] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                        Global Active
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                      18ms
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className="font-bold text-base text-[#FAFAFA]">Zero Blocking Engine</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Full sandbox execution with iframe fallback & about:blank cloaking.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-2 font-mono">
                    <span>Panic Key: [Esc]</span>
                    <span>Search: [/]</span>
                  </div>
                </div>
              </section>
            )}

            {/* Category Filter Carousel */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Categories & Filters
                </h2>
                {showFavoritesOnly && (
                  <span className="text-xs text-rose-400 font-semibold">
                    Showing {filteredGames.length} favorite titles
                  </span>
                )}
              </div>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setShowFavoritesOnly(false);
                }}
                categoryCounts={categoryCounts}
              />
            </section>

            {/* Recently Played Bento Strip */}
            {recentGames.length > 0 && !searchQuery && !showFavoritesOnly && selectedCategory === 'All' && (
              <section className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Recently Played</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                  {recentGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handlePlayGame(game)}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 hover:text-white font-medium whitespace-nowrap transition-all group"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                      <span>{game.title}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Games Grid Header */}
            <section className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-[#FAFAFA]">
                  {showFavoritesOnly
                    ? 'Your Favorites'
                    : selectedCategory === 'All'
                    ? 'All Games'
                    : `${selectedCategory} Games`}
                </h2>
                <span className="text-xs text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-800 font-mono">
                  {filteredGames.length}
                </span>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </section>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </section>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/60 rounded-3xl border border-zinc-800 text-center gap-3">
                <Gamepad2 className="w-12 h-12 text-zinc-600" />
                <h3 className="text-base font-bold text-zinc-300">No games found</h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  {showFavoritesOnly
                    ? "You haven't added any games to your favorites yet. Click the heart icon on any game to bookmark it!"
                    : "No games matched your current filter or search criteria."}
                </p>
                <div className="flex items-center gap-2.5 mt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setShowFavoritesOnly(false);
                    }}
                    className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsAddGameOpen(true)}
                    className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200"
                  >
                    Add Custom Game
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-[#09090B] px-4 py-6 text-xs text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© PORTAL_ZERO • JSON Iframe Architecture • Unblocked Web Platform</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <button onClick={() => setIsCloakOpen(true)} className="hover:text-indigo-400 transition-colors">
              Tab Cloak
            </button>
            <span>•</span>
            <button onClick={() => setIsJsonOpen(true)} className="hover:text-indigo-400 transition-colors">
              games.json
            </button>
            <span>•</span>
            <button onClick={() => setIsPanicActive(true)} className="hover:text-rose-400 transition-colors">
              Panic Key (Esc)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CloakModal isOpen={isCloakOpen} onClose={() => setIsCloakOpen(false)} />
      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddCustomGame}
      />
      <JsonModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
