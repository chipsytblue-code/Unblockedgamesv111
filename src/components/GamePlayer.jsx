import React, { useState, useRef, useEffect } from 'react';
import { standaloneGameDocs } from '../data/standaloneGames';
import { 
  ArrowLeft, 
  RotateCw, 
  Maximize2, 
  ExternalLink, 
  Heart, 
  Check, 
  Gamepad2, 
  Info, 
  Tv,
  Code
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
}) => {
  const [useStandalone, setUseStandalone] = useState(Boolean(game?.srcDocKey && standaloneGameDocs[game.srcDocKey]));
  const [isTheater, setIsTheater] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const hasStandaloneDoc = Boolean(game?.srcDocKey && standaloneGameDocs[game.srcDocKey]);

  // Reset loading whenever game or mode changes
  useEffect(() => {
    setIsLoading(true);
  }, [game?.id, useStandalone, iframeKey]);

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  };

  // Open in about:blank cloaked tab
  const handleOpenAboutBlank = () => {
    const newWin = window.open('about:blank', '_blank');
    if (!newWin) return;

    const doc = newWin.document;
    doc.title = game?.title || 'Game';
    
    // Inject full viewport iframe
    let content = '';
    if (useStandalone && game?.srcDocKey && standaloneGameDocs[game.srcDocKey]) {
      content = standaloneGameDocs[game.srcDocKey];
      doc.open();
      doc.write(content);
      doc.close();
    } else {
      const targetSrc = game?.iframeSrc || 'https://google.com';
      doc.body.style.margin = '0';
      doc.body.style.height = '100vh';
      doc.body.style.overflow = 'hidden';
      doc.body.style.backgroundColor = '#000';
      const ifr = doc.createElement('iframe');
      ifr.style.border = 'none';
      ifr.style.width = '100%';
      ifr.style.height = '100%';
      ifr.style.margin = '0';
      ifr.src = targetSrc;
      ifr.allow = 'autoplay; fullscreen; gamepad';
      doc.body.appendChild(ifr);
    }
  };

  const handleCopyEmbed = () => {
    const embedStr = game?.embedCode || `<iframe src="${game?.iframeSrc}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedStr);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  if (!game) return null;

  return (
    <div className={`flex flex-col gap-4 mx-auto transition-all ${isTheater ? 'w-full max-w-full px-2' : 'max-w-6xl w-full px-4'}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3.5 rounded-3xl backdrop-blur-md">
        {/* Back and Title */}
        <div className="flex items-center gap-3">
          <button
            id="btn-player-back"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white text-xs font-bold transition-all border border-zinc-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div>
            <h1 className="font-bold text-lg text-[#FAFAFA] flex items-center gap-2">
              <span>{game.title}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-semibold uppercase tracking-wider">
                {game.category}
              </span>
            </h1>
          </div>
        </div>

        {/* Engine Switch & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Standalone vs External URL Toggle */}
          {hasStandaloneDoc && (
            <div className="flex items-center bg-zinc-950 p-1 rounded-full border border-zinc-800">
              <button
                onClick={() => setUseStandalone(true)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  useStandalone
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Built-in zero-lag standalone engine (no external blocks)"
              >
                Built-in Engine
              </button>
              <button
                onClick={() => setUseStandalone(false)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  !useStandalone
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Direct external web iframe source"
              >
                Web Source
              </button>
            </div>
          )}

          {/* Favorite */}
          <button
            id="btn-player-fav"
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-2 rounded-full border transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>

          {/* Reload Iframe */}
          <button
            id="btn-player-reload"
            onClick={handleReload}
            className="p-2 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-all"
            title="Reload Game"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Open in about:blank */}
          <button
            id="btn-player-about-blank"
            onClick={handleOpenAboutBlank}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition-all"
            title="Open in stealth about:blank window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About:Blank</span>
          </button>

          {/* Theater Mode */}
          <button
            id="btn-player-theater"
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2 rounded-full border transition-all ${
              isTheater
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
            title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            id="btn-player-fullscreen"
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen Container */}
      <div
        ref={containerRef}
        id="game-viewport-container"
        className={`relative w-full bg-black rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col justify-center items-center ${
          isTheater ? 'h-[85vh]' : 'h-[640px]'
        }`}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-indigo-400">Loading {game.title}...</p>
          </div>
        )}

        {/* The Iframe Component */}
        {useStandalone && game.srcDocKey && standaloneGameDocs[game.srcDocKey] ? (
          <iframe
            key={`standalone-${iframeKey}`}
            ref={iframeRef}
            srcDoc={standaloneGameDocs[game.srcDocKey]}
            title={game.title}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <iframe
            key={`external-${iframeKey}`}
            ref={iframeRef}
            src={game.iframeSrc}
            title={game.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>

      {/* Game Info, Controls & Embed Drawer - Bento Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* About & Info */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
              <Info className="w-4 h-4" />
              <span>About {game.title}</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
            {game.author && (
              <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700/60 font-mono">
                Creator: <b className="text-zinc-200">{game.author}</b>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700/60 font-mono">
              Engine: <b className="text-indigo-400">{useStandalone ? 'Standalone (srcDoc)' : 'External Iframe'}</b>
            </span>
          </div>
        </div>

        {/* Controls Cheatsheet & Share */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
              <Gamepad2 className="w-4 h-4" />
              <span>Controls</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              {game.controls && game.controls.length > 0 ? (
                game.controls.map((ctrl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-mono mt-0.5">•</span>
                    <span>{ctrl}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-400">Mouse Click / Tap or Arrow Keys</li>
              )}
            </ul>
          </div>

          <div className="pt-3 border-t border-zinc-800">
            <button
              id="btn-copy-embed-code"
              onClick={handleCopyEmbed}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition-all w-full justify-center"
            >
              {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedEmbed ? 'Code Copied!' : 'Copy JSON Iframe Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
