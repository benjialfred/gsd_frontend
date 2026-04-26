import React from 'react';
import { ArrowRight, BookOpen, Heart, Users, CheckCircle, Headphones, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gsd-blue pt-32 pb-48 lg:pt-40 lg:pb-64 overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gsd-blue-dark blur-[120px] opacity-70 border-none outline-none"></div>
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] rounded-full bg-[#113a73] blur-[150px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-block bg-gsd-red text-white text-xs font-bold leading-none py-2 px-4 rounded-full mb-6 uppercase tracking-wider animate-pulse shadow-lg shadow-gsd-red/30">
                Découvrir le Sommet SICI 2026
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Votre Célibat a une <span className="text-gsd-gold italic">Mission.</span><br/>
                Votre Couple a un <span className="text-gsd-gold italic">Avenir.</span>
              </h1>
              <p className="text-lg text-blue-100 mb-10 max-w-xl font-light leading-relaxed">
                Le Grand Salon Divin est l'écosystème francophone d'excellence pour grandir spirituellement, 
                vous former et trouver la personne que Dieu a prévue pour vous.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-gsd-gold to-gsd-gold-light text-gsd-blue-dark px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(220,165,74,0.3)] hover:shadow-[0_0_30px_rgba(220,165,74,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  CRÉER MON COMPTE GRATUIT
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-gsd-blue bg-gray-300 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Membre" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-gsd-gold">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-sm text-white/80"><span className="font-bold text-white">1000+</span> croyants inscrits</span>
                </div>
              </div>
            </div>

            {/* Right Image Placeholder */}
            <div className="relative hidden lg:block">
               <div className="absolute inset-0 bg-gradient-to-t from-gsd-blue via-transparent to-transparent z-10 rounded-3xl"></div>
               <img 
                 src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Couple joyeux" 
                 className="w-full h-[600px] object-cover rounded-3xl shadow-2xl skew-y-3 transform transition hover:skew-y-0 duration-700 border-4 border-white/10"
               />
               
               {/* Floating badges */}
               <div className="absolute top-10 -left-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl z-20 shadow-xl flex items-center gap-3 animate-bounce">
                  <div className="w-12 h-12 rounded-full bg-gsd-gold flex items-center justify-center text-gsd-blue-dark">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Profils Vérifiés</p>
                    <p className="text-blue-200 text-xs text-left">Sécurité maximale</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (Overlapping Hero) */}
      <section className="relative z-20 -mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-t-white hover:border-t-gsd-gold hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-gsd-gold group-hover:text-white transition-colors text-gsd-gold">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gsd-blue-dark mb-4">SE FORMER</h3>
            <p className="text-gray-600 mb-6">Accédez à une académie d'excellence : Masterclass, cours vidéo sur la foi, l'entrepreneuriat et le couple.</p>
            <a href="/academy" className="text-gsd-gold font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
              [En savoir plus] <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-t-white hover:border-t-gsd-gold hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gsd-gold/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-gsd-gold group-hover:text-white transition-colors text-gsd-gold">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gsd-blue-dark mb-4">SE CONNECTER</h3>
            <p className="text-gray-600 mb-6">Un algorithme de matching basé sur vos valeurs spirituelles pour trouver l'âme sœur sérieusement.</p>
            <a href="/matchmaking" className="text-gsd-gold font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
              [En savoir plus] <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-t-white hover:border-t-gsd-gold hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-gsd-gold group-hover:text-white transition-colors text-gsd-gold">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gsd-blue-dark mb-4">ÊTRE ACCOMPAGNÉ</h3>
            <p className="text-gray-600 mb-6">Des coachs chrétiens certifiés pour un accompagnement sur mesure (orientation, guérison, mariage).</p>
            <a href="/coaching" className="text-gsd-gold font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
              [En savoir plus] <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
      
      {/* Lower Section (Podcasts / Market) */}
      <section className="bg-white py-24 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-serif font-bold text-gsd-blue-dark mb-6">Ressources & Podcasts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Nourrissez votre foi au quotidien avec des contenus exclusifs créés par nos formateurs internationaux.</p>
            
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gsd-gold/10 text-gsd-gold cursor-pointer hover:bg-gsd-gold hover:text-white hover:scale-110 transition-all duration-300 group shadow-lg">
               <Headphones size={40} className="ml-1 group-hover:animate-pulse" />
            </div>
         </div>
      </section>
    </div>
  );
}
