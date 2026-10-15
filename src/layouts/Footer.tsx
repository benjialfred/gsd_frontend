import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../shared/components/Logo';
import { 
  Heart, ShieldCheck, Church, Sparkles, MessageCircle, 
  Compass, GraduationCap, Users, Calendar, Crown, ExternalLink,
  Lock, CheckCircle2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#071324] text-white border-t border-[#C9A84C]/25 relative overflow-hidden">
      {/* Halo lumineux d'ambiance en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#C9A84C]/10 blur-[100px] pointer-events-none rounded-full" />

      {/* BANDEAU DU VERSET SACRÉ */}
      <div className="border-b border-white/5 bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent py-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif italic text-xs sm:text-sm text-[#DFB76C] tracking-wide">
            « Une corde à trois fils ne se rompt pas facilement. » — <span className="font-semibold not-italic text-white">Ecclésiaste 4:12</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Colonne 1 & 2 : Marque & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <Logo theme="dark" className="h-14 w-auto object-contain transform-origin-left group-hover:scale-105 transition-transform" />
            </Link>
            
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm font-light">
              Le premier sanctuaire d'exception dédié aux célibataires chrétiens exigeants d'Afrique et de la Diaspora. Bâtir des alliances durables, fondées sur la crainte de Dieu, l'intégrité et l'excellence.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#C9A84C]">
              <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <ShieldCheck size={13} className="text-[#C9A84C]" />
                Audité & Recommandé Pastoralement
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Lock size={12} className="text-emerald-400" />
                Vérification d'Identité KYC
              </span>
            </div>
          </div>

          {/* Colonne 3 : Le Sanctuaire */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C] flex items-center gap-1.5">
              <Compass size={14} />
              <span>Le Sanctuaire</span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/matchmaking" className="hover:text-[#C9A84C] transition-colors">
                  Connexions & Radar Leaflet
                </Link>
              </li>
              <li>
                <Link to="/matchmaking" className="hover:text-[#C9A84C] transition-colors">
                  Scoring de Foi & Doctrine
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-[#C9A84C] transition-colors">
                  Pass Alliance & Ambassadeur
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#C9A84C] transition-colors">
                  Processus de Vérification KYC
                </Link>
              </li>
              <li>
                <a href="#charte" className="hover:text-[#C9A84C] transition-colors">
                  Charte Sacrée de Pureté
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Académie & Galas */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C] flex items-center gap-1.5">
              <GraduationCap size={14} />
              <span>Élévation & Galas</span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/academy" className="hover:text-[#C9A84C] transition-colors">
                  L'Académie du Mariage
                </Link>
              </li>
              <li>
                <Link to="/coaching" className="hover:text-[#C9A84C] transition-colors">
                  Conseillers & Thérapeutes
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                  <span>Grand Sommet 2026</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#C9A84C] transition-colors">
                  Billetterie & Pass QR Code
                </Link>
              </li>
              <li>
                <Link to="/academy" className="hover:text-[#C9A84C] transition-colors">
                  Podcasts & E-Books Spirituels
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 5 : Conciergerie & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C] flex items-center gap-1.5">
              <Church size={14} />
              <span>Conciergerie Royale</span>
            </h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Une équipe d'écoute pastorale et d'assistance confidentielle à votre disposition.
            </p>
            <div className="pt-1">
              <a 
                href="https://wa.me/237699000000" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
              >
                <MessageCircle size={14} className="text-emerald-400" />
                <span>Conciergerie WhatsApp</span>
              </a>
            </div>
            <p className="text-[11px] text-gray-400 pt-1">
              Douala • Yaoundé • Paris • Abidjan
            </p>
          </div>

        </div>

        {/* LIGNE DE SÉPARATION ET COPYRIGHT */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Le Grand Salon Divin. Tous droits sacrés réservés.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Protection des Données & Vie Privée
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Conditions Générales d'Alliance
            </Link>
            <Link to="/charter" className="hover:text-white transition-colors">
              Code Moral & Éthique
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

