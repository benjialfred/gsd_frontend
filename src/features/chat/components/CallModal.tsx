import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, 
  Sparkles, ShieldCheck, Heart 
} from 'lucide-react';

interface CallModalProps {
  partnerName: string;
  partnerAvatar?: string | null;
  callType: 'AUDIO' | 'VIDEO';
  callId?: number;
  onEndCall: (durationSeconds: number) => void;
}

export default function CallModal({
  partnerName,
  partnerAvatar,
  callType,
  onEndCall
}: CallModalProps) {
  const [callStatus, setCallStatus] = useState<'RINGING' | 'CONNECTED'>('RINGING');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'VIDEO');
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Transition de "Sonnerie" à "Connecté" après 2.5 secondes si non connecté
  useEffect(() => {
    const ringTimeout = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 2800);

    return () => clearTimeout(ringTimeout);
  }, []);

  // Décompte de la durée de l'appel
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callStatus === 'CONNECTED') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  // Gestion du flux caméra & micro avec getUserMedia
  useEffect(() => {
    let active = true;

    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === 'VIDEO'
        });
        if (active) {
          mediaStreamRef.current = stream;
          if (localVideoRef.current && callType === 'VIDEO') {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Impossible d'accéder aux périphériques média:", err);
      }
    };

    startMedia();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType]);

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleHangUp = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    onEndCall(callDuration);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1d2e]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#13283d] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A84C]/30 flex flex-col items-center justify-between p-8 min-h-[520px]">
        
        {/* Bandeau supérieur */}
        <div className="w-full flex items-center justify-between text-[#C9A84C] text-xs font-semibold tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Salon Sacré • Appel {callType === 'VIDEO' ? 'Vidéo' : 'Audio'}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} />
            <span className="text-[10px]">Chiffré</span>
          </div>
        </div>

        {/* Zone centrale / Vidéo ou Avatar */}
        <div className="flex-1 w-full flex flex-col items-center justify-center my-6 relative">
          {callType === 'VIDEO' && isVideoEnabled ? (
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/60 border border-[#C9A84C]/20 shadow-inner">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full text-white text-[10px] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Votre caméra
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {/* Anneaux d'onde sonore pulsante */}
                {callStatus === 'RINGING' && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/40 animate-ping" />
                    <div className="absolute -inset-4 rounded-full border border-[#C9A84C]/20 animate-pulse" />
                  </>
                )}
                {callStatus === 'CONNECTED' && (
                  <div className="absolute -inset-3 rounded-full border border-[#C9A84C]/30 animate-pulse" />
                )}

                <div className="w-28 h-28 rounded-full overflow-hidden bg-[#1A3A5C] ring-4 ring-[#C9A84C]/60 flex items-center justify-center shadow-2xl relative z-10">
                  {partnerAvatar ? (
                    <img 
                      src={partnerAvatar} 
                      alt={partnerName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#C9A84C] to-[#deb958] flex items-center justify-center text-white font-serif text-3xl font-bold">
                      {partnerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-2xl text-white tracking-wide">
                  {partnerName}
                </h3>
                <p className="text-sm font-medium mt-1 text-[#C9A84C]">
                  {callStatus === 'RINGING' ? (
                    <span className="animate-pulse">Sonnerie en cours...</span>
                  ) : (
                    <span className="font-mono text-emerald-400 font-semibold">
                      {formatDuration(callDuration)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message d'élévation spirituelle */}
        <p className="text-[11px] text-gray-400 text-center max-w-xs mb-6 italic">
          « Que votre parole soit toujours accompagnée de grâce et assaisonnée de sel. »
        </p>

        {/* Barre des boutons de contrôle de l'appel */}
        <div className="flex items-center gap-4">
          {/* Mute micro */}
          <button
            type="button"
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? "Réactiver le micro" : "Couper le micro"}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Toggle Vidéo si appel vidéo */}
          {callType === 'VIDEO' && (
            <button
              type="button"
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                !isVideoEnabled 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={isVideoEnabled ? "Couper la caméra" : "Activer la caméra"}
            >
              {isVideoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
            </button>
          )}

          {/* Bouton Raccrocher ROUGE façon WhatsApp */}
          <button
            type="button"
            onClick={handleHangUp}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transition-all"
            title="Raccrocher"
          >
            <PhoneOff size={28} />
          </button>
        </div>

      </div>
    </div>
  );
}
