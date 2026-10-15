import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../../stores/authStore';
import { getMediaUrl } from '../../../../services/profile';
import { CheckCircle, Camera, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const WelcomeWidget: React.FC = () => {
  const { user } = useAuthStore();
  const profile = user?.profile || {};
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getSubMessage = () => {
    if (!profile.onboarding_completed) {
      return 'Bienvenue ! Complétez votre profil pour commencer vos découvertes.';
    }
    if (profile.kyc_status !== 'APPROVED') {
      return 'Votre espace est prêt. Vérifiez votre profil pour débloquer toutes les fonctionnalités.';
    }
    return 'Belle journée de découvertes et de partage dans la bienveillance.';
  };

  const avatarUrl = profile.avatar ? getMediaUrl(profile.avatar) : null;
  const isKycApproved = profile.kyc_status === 'APPROVED';
  const fullName = user?.first_name ? `${user.first_name} ${user?.last_name || ''}`.trim() : 'Utilisateur';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A3A5C] via-[#152e4a] to-[#0d1e30] p-6 md:p-8 text-white shadow-xl border border-white/10">
      {/* Decorative Gold Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-center gap-5">
          <Link
            to="/app/profile"
            className="group relative shrink-0"
            title="Modifier mon profil"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-[#C9A84C] shadow-lg bg-[#2A3F55] transition-transform duration-300 group-hover:scale-105">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              
              <div
                className={`w-full h-full items-center justify-center text-white text-2xl font-serif font-bold bg-[#102A43] ${
                  avatarUrl ? 'hidden' : 'flex'
                }`}
              >
                {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>

              {/* Hover overlay to change avatar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-wider text-white gap-1 backdrop-blur-[2px]">
                <Camera size={18} />
                <span>Modifier</span>
              </div>
            </div>

            {/* Verification Checkmark Badge */}
            {isKycApproved ? (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md border-2 border-[#1A3A5C]" title="Identité vérifiée">
                <ShieldCheck size={14} />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 bg-[#C9A84C] text-[#1A3A5C] p-1 rounded-full shadow-md border-2 border-[#1A3A5C]" title="Profil actif">
                <Sparkles size={13} />
              </div>
            )}
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold">
                Espace Membre
              </span>
              {isKycApproved && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} /> Vérifié
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              {getGreeting()}, {user?.first_name || 'Bienvenue'} ✨
            </h1>
            <p className="text-blue-100/75 mt-1.5 text-xs md:text-sm max-w-md leading-relaxed">
              {getSubMessage()}
            </p>
          </div>
        </div>

        {/* Right: Quick Profile Link Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/app/profile"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold uppercase tracking-wider text-white transition-all backdrop-blur-sm active:scale-95"
          >
            <span>Mon Profil</span>
            <ArrowRight size={14} />
          </Link>
          
          <Link
            to="/app/matches"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#E5C368] hover:from-[#bd9c42] hover:to-[#dbb95d] text-[#1A3A5C] text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-[#C9A84C]/20 transition-all active:scale-95"
          >
            <Sparkles size={14} />
            <span>Découvertes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
