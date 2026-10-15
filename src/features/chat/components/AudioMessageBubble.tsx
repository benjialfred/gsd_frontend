import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, Volume2 } from 'lucide-react';

interface AudioMessageBubbleProps {
  audioUrl: string;
  duration?: number;
  isMine: boolean;
}

export default function AudioMessageBubble({ audioUrl, duration = 0, isMine }: AudioMessageBubbleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setAudioDuration(Math.round(audio.duration));
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Erreur lecture audio:", err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const speeds = [1, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    audio.playbackRate = nextSpeed;
    setPlaybackRate(nextSpeed);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Barres visuelles de forme d'onde simulées (20 barres)
  const WAVE_HEIGHTS = [40, 65, 30, 85, 55, 95, 70, 45, 80, 60, 90, 75, 50, 85, 40, 65, 30, 70, 50, 35];

  const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5 min-w-[220px] sm:min-w-[270px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-3">
        {/* Bouton Play/Pause façon WhatsApp */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
            isMine
              ? 'bg-[#C9A84C] text-[#1A3A5C] hover:bg-[#ebd18b]'
              : 'bg-[#1A3A5C] text-white hover:bg-[#234d7a]'
          }`}
        >
          {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
        </button>

        {/* Waveform & Scrubber */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          {/* Visualisation Waveform interactive */}
          <div className="relative h-6 flex items-center gap-[3px] overflow-hidden">
            {WAVE_HEIGHTS.map((height, i) => {
              const barPercent = (i / WAVE_HEIGHTS.length) * 100;
              const isPassed = progressPercent >= barPercent;
              
              return (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPassed
                      ? (isMine ? 'bg-[#ebd18b]' : 'bg-[#C9A84C]')
                      : (isMine ? 'bg-white/30' : 'bg-gray-300')
                  }`}
                />
              );
            })}

            {/* Slider transparent invisible pour chercher dans la piste */}
            <input
              type="range"
              min={0}
              max={audioDuration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          {/* Chrono & Indicateur de vitesse */}
          <div className="flex items-center justify-between text-[11px] font-mono leading-none">
            <span className={isMine ? 'text-white/80' : 'text-gray-500'}>
              {isPlaying ? formatTime(currentTime) : formatTime(audioDuration)}
            </span>

            <button
              type="button"
              onClick={toggleSpeed}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                isMine 
                  ? 'bg-white/20 text-[#ebd18b] hover:bg-white/30' 
                  : 'bg-gray-100 text-[#1A3A5C] hover:bg-gray-200'
              }`}
              title="Vitesse de lecture"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        {/* Icône Micro discret */}
        <div className={`p-1.5 rounded-full ${isMine ? 'text-[#ebd18b]' : 'text-[#C9A84C]'}`}>
          <Mic size={16} />
        </div>
      </div>
    </div>
  );
}
