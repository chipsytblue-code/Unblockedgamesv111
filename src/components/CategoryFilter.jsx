import React from 'react';
import { 
  Layers, 
  Flame, 
  Joystick, 
  Puzzle, 
  History, 
  Target, 
  Trophy, 
  Crown 
} from 'lucide-react';

const categories = [
  { name: 'All', icon: <Layers className="w-4 h-4" /> },
  { name: 'Action', icon: <Flame className="w-4 h-4" /> },
  { name: 'Arcade', icon: <Joystick className="w-4 h-4" /> },
  { name: 'Puzzle', icon: <Puzzle className="w-4 h-4" /> },
  { name: 'Retro', icon: <History className="w-4 h-4" /> },
  { name: 'Strategy', icon: <Target className="w-4 h-4" /> },
  { name: 'Sports', icon: <Trophy className="w-4 h-4" /> },
  { name: 'Classics', icon: <Crown className="w-4 h-4" /> },
];

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1.5 no-scrollbar scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        const count = cat.name === 'All' ? categoryCounts['All'] || 0 : categoryCounts[cat.name] || 0;
        
        return (
          <button
            key={cat.name}
            id={`category-btn-${cat.name.toLowerCase()}`}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-500/25'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
            }`}
          >
            <span className={isSelected ? 'text-white' : 'text-indigo-400'}>
              {cat.icon}
            </span>
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-black/25 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
