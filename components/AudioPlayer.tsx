'use client';
import { useState, useRef, useEffect } from 'react';

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

interface Props {
  audioUrl: string;
  title: string;
}

export default function AudioPlayer({ audioUrl, title }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    const onMeta = () => { setDuration(audio.duration); setReady(true); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = ref.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
    setSpin(true);
  }

  function skip(delta: number) {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
  }

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div id="audio" className="bg-brand-blue rounded-2xl p-6 sm:p-8" role="region" aria-label={`Audio player: ${title}`}>
      <audio ref={ref} src={audioUrl} preload="metadata" />

      <div className="flex items-center justify-between mb-1">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Audio Message</p>
        {playing && (
          <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
            <span className="eq-bar-1 w-1 h-3 bg-brand-gold rounded-sm" />
            <span className="eq-bar-2 w-1 h-3 bg-brand-gold rounded-sm" />
            <span className="eq-bar-3 w-1 h-3 bg-brand-gold rounded-sm" />
          </div>
        )}
      </div>
      <p className="text-white font-display text-lg font-semibold mb-6 leading-snug">{title}</p>

      {/* Seek track */}
      <div className="relative mb-2">
        {/* Visual track */}
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-brand-gold rounded-full transition-[width] duration-150 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Accessible range input overlaid on track */}
        <input
          type="range"
          min={0}
          max={Math.floor(duration) || 0}
          step={1}
          value={Math.floor(currentTime)}
          onChange={seek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Audio position"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-white/40 text-xs mb-6" aria-hidden="true">
        <span>{formatTime(currentTime)}</span>
        <span>{duration ? formatTime(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Skip back 15s */}
        <button
          type="button"
          onClick={() => skip(-15)}
          aria-label="Skip back 15 seconds"
          className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
          <span className="text-[10px] font-semibold leading-none">15s</span>
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          onAnimationEnd={() => setSpin(false)}
          disabled={!ready}
          aria-label={playing ? 'Pause' : 'Play'}
          className={`w-14 h-14 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-lg hover:bg-brand-gold hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue disabled:opacity-50 disabled:cursor-not-allowed ${
            spin ? 'animate-spin-once' : ''
          }`}
        >
          {playing ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: '2px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Skip forward 15s */}
        <button
          type="button"
          onClick={() => skip(15)}
          aria-label="Skip forward 15 seconds"
          className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
          <span className="text-[10px] font-semibold leading-none">15s</span>
        </button>
      </div>
    </div>
  );
}
