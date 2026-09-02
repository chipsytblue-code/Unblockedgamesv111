import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

const CATEGORIES = ['Action', 'Arcade', 'Puzzle', 'Retro', 'Strategy', 'Sports', 'Classics'];

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeSrc, setIframeSrc] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [controlsInput, setControlsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeSrc.trim()) {
      setError('Please provide a valid iframe URL or embed source.');
      return;
    }

    // Extract src if user pasted a full <iframe src="..." ...> tag
    let cleanSrc = iframeSrc.trim();
    if (cleanSrc.includes('<iframe') && cleanSrc.includes('src=')) {
      const match = cleanSrc.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        cleanSrc = match[1];
      }
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom added web game via iframe source.',
      iframeSrc: cleanSrc,
      embedCode: `<iframe src="${cleanSrc}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`,
      author: author.trim() || 'Community',
      controls: controlsInput.trim() ? controlsInput.split(',').map(s => s.trim()) : ['Mouse Click / Tap', 'Arrow Keys'],
      tags: tagsInput.trim() ? tagsInput.split(',').map(s => s.trim()) : ['Custom', 'Web', 'Iframe'],
      gradient: 'from-violet-600 to-indigo-800',
      plays: 1,
      rating: 5.0
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setIframeSrc('');
    setDescription('');
    setAuthor('');
    setControlsInput('');
    setTagsInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="add-game-modal-container"
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 text-[#FAFAFA] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAFAFA]">Add Custom Iframe Game</h2>
              <p className="text-xs text-zinc-400">Add any playable web game iframe into your hub</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Retro Bowl, Slope, Paper.io"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Creator / Author
              </label>
              <input
                type="text"
                placeholder="e.g. Developer Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Iframe Embed URL or &lt;iframe&gt; Tag *
            </label>
            <textarea
              required
              rows={2}
              placeholder="https://example.com/game or <iframe src='...'></iframe>"
              value={iframeSrc}
              onChange={(e) => setIframeSrc(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the game rules or gameplay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Controls (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Arrow Keys, Space to Jump"
                value={controlsInput}
                onChange={(e) => setControlsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Physics, 3D, Skill"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add to Games Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
