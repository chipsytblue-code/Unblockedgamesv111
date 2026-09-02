import React from 'react';
import { Play, Heart, Star, Sparkles } from 'lucide-react';

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'Action':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'Puzzle':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Arcade':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Retro':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'Strategy':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'Sports':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    case 'Classics':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }
};

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlay(game)}
      className="group relative flex flex-col justify-between bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer"
    >
      {/* Top Banner / Graphic Preview */}
      <div className={`relative w-full h-36 bg-gradient-to-br ${game.gradient || 'from-indigo-600 to-zinc-900'} p-4 flex flex-col justify-between overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        
        {/* Top Badges & Favorite */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeClass(game.category)}`}>
              {game.category}
            </span>
            {game.featured && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <button
            id={`fav-btn-${game.id}`}
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Big Game Title in Banner */}
        <div className="relative z-10 flex items-end justify-between">
          <h3 className="font-bold text-lg text-white tracking-tight drop-shadow-md group-hover:translate-x-0.5 transition-transform">
            {game.title}
          </h3>
          <div className="w-8 h-8 rounded-full bg-white text-black group-hover:bg-indigo-400 group-hover:text-black flex items-center justify-center transition-all duration-200 shadow-md">
            <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
          </div>
        </div>
      </div>

      {/* Body / Description & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {game.tags && game.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating || 4.8}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            {game.plays && (
              <span>{(game.plays).toLocaleString()} plays</span>
            )}
            {game.author && (
              <span className="truncate max-w-[90px] text-zinc-400" title={game.author}>
                by {game.author}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
