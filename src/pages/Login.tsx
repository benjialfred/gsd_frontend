import React from 'react';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/common/Logo';

export default function Login() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 pt-20 pb-20">
       <div className="max-w-md w-full px-6">
         <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
           <div className="flex flex-col items-center text-center mb-10">
              <Logo theme="light" className="mb-8 scale-110" />
              <h2 className="text-3xl font-serif font-bold text-gsd-blue-dark">Bon retour !</h2>
              <p className="text-gray-500 mt-2">Connectez-vous pour accéder à votre espace.</p>
           </div>
           
           <form className="space-y-6">
             <div>
               <label className="block text-sm font-bold text-gsd-blue-dark mb-2 uppercase tracking-wide">Adresse Email</label>
               <input type="email" className="w-full p-4 rounded-xl border border-gray-200 focus:border-gsd-gold focus:ring-2 focus:ring-gsd-gold/20 outline-none transition-all placeholder:text-gray-400" placeholder="benjialfred@exemple.com" />
             </div>
             <div>
               <label className="block text-sm font-bold text-gsd-blue-dark mb-2 uppercase tracking-wide">Mot de passe</label>
               <input type="password" className="w-full p-4 rounded-xl border border-gray-200 focus:border-gsd-gold focus:ring-2 focus:ring-gsd-gold/20 outline-none transition-all placeholder:text-gray-400" placeholder="••••••••" />
             </div>
             
             <div className="flex justify-between items-center text-sm">
               <label className="flex items-center gap-2 text-gray-600 font-medium">
                 <input type="checkbox" className="rounded border-gray-300 text-gsd-gold focus:ring-gsd-gold/50" />
                 Se souvenir de moi
               </label>
               <a href="#" className="text-gsd-gold font-bold hover:text-gsd-blue-dark transition-colors">Oublié ?</a>
             </div>
             
             <button className="w-full bg-gsd-blue hover:bg-gsd-blue-dark text-white rounded-xl py-4 font-bold tracking-widest uppercase shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group mt-8">
               Se Connecter
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
             
             <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
                </div>
             </div>

             <div className="text-center mt-6">
               <button type="button" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl py-4 font-bold flex items-center justify-center gap-3 transition-all shadow-sm">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                 Google
               </button>
             </div>
           </form>
         </div>
       </div>
    </div>
  );
}
