import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gsd-blue-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-serif font-bold text-gsd-gold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gsd-gold flex items-center justify-center text-gsd-blue-dark font-black text-sm">G</span>
              GSD
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              La première plateforme premium pour la communauté chrétienne francophone. 
              Grandissez dans votre foi, rencontrez l'âme sœur, et formez-vous pour l'excellence.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 font-serif">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-gsd-gold text-sm transition-colors">Accueil</Link></li>
              <li><Link to="/academy" className="text-gray-400 hover:text-gsd-gold text-sm transition-colors">Académie (Cours & Masterclass)</Link></li>
              <li><Link to="/matchmaking" className="text-gray-400 hover:text-gsd-gold text-sm transition-colors">Connexions (Rencontres)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 font-serif">Légal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-gsd-gold text-sm transition-colors">Mentions Légales</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gsd-gold text-sm transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gsd-gold text-sm transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 font-serif">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">contact@grandsalondivin.com</li>
              <li className="text-gray-400 text-sm">Abidjan, Côte d'Ivoire</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 Le Grand Salon Divin. Tous droits réservés.</p>
          <div className="flex gap-4">
             {/* Social links simulation */}
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gsd-gold hover:text-gsd-blue-dark transition-colors cursor-pointer text-xs">FB</div>
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gsd-gold hover:text-gsd-blue-dark transition-colors cursor-pointer text-xs">IG</div>
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gsd-gold hover:text-gsd-blue-dark transition-colors cursor-pointer text-xs">IN</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
