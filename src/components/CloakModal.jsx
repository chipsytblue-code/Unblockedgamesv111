import React, { useState } from 'react';
import { X, Eye, Check, RefreshCw } from 'lucide-react';

const presets = [
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes | Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'kahoot',
    name: 'Kahoot!',
    title: 'Play Kahoot! - Enter game PIN here!',
    icon: 'https://kahoot.it/favicon.ico'
  }
];

export const CloakModal = ({ isOpen, onClose }) => {
  const [activePreset, setActivePreset] = useState('default');
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('');
  const [appliedNotice, setAppliedNotice] = useState('');

  if (!isOpen) return null;

  const applyCloak = (title, iconUrl, presetId) => {
    document.title = title;
    
    // Change favicon
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = iconUrl;

    setActivePreset(presetId);
    setAppliedNotice(`Cloak active: "${title}"`);
    setTimeout(() => setAppliedNotice(''), 3000);
  };

  const resetCloak = () => {
    document.title = 'Unblocked Games Hub';
    let link = document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='6' width='20' height='12' rx='2'/><path d='M6 12h4'/><path d='M8 10v4'/><circle cx='15' cy='12' r='1'/><circle cx='18' cy='10' r='1'/></svg>";
    }
    setActivePreset('default');
    setAppliedNotice('Restored original title & icon');
    setTimeout(() => setAppliedNotice(''), 3000);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customTitle) return;
    const icon = customIcon || 'https://www.google.com/favicon.ico';
    applyCloak(customTitle, icon, 'custom');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="cloak-modal-container"
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 text-[#FAFAFA]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAFAFA]">Tab Cloaking & Stealth</h2>
              <p className="text-xs text-zinc-400">Disguise browser tab title and favicon instantly</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notice */}
        {appliedNotice && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 block">
            Popular Disguise Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  id={`preset-${p.id}`}
                  onClick={() => applyCloak(p.title, p.icon, p.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/10 border-indigo-500/60 text-indigo-300'
                      : 'bg-zinc-950/60 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <img src={p.icon} alt={p.name} className="w-5 h-5 rounded object-contain" />
                  <div className="truncate flex-1">
                    <div className="text-xs font-bold text-zinc-200">{p.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{p.title}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Cloak Inputs */}
        <form onSubmit={handleApplyCustom} className="space-y-3 pt-3 border-t border-zinc-800">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Custom Disguise
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Tab Title (e.g. Calculus HW)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              placeholder="Favicon URL (optional)"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold transition-all"
          >
            Apply Custom Disguise
          </button>
        </form>

        {/* Footer reset & close */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={resetCloak}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Original</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
