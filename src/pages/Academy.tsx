import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Academy() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pt-20">
      <div className="bg-gsd-blue-dark py-16 mb-12 shadow-inner text-center text-white border-b border-gsd-gold/20">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 mt-8">Académie GSD</h1>
        <p className="text-gsd-gold italic text-lg">Votre excellence spirituelle et entrepreneuriale.</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card Example */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-t-4 border-t-white hover:border-t-gsd-gold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-48 bg-gray-200 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Cours" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-8">
              <span className="text-xs font-bold text-gsd-red uppercase tracking-wide">Business & Foi</span>
              <h3 className="text-2xl font-serif font-bold text-gsd-blue-dark mt-2 mb-3">Entreprendre avec intégrité</h3>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">Découvrez comment aligner vos valeurs chrétiennes avec vos ambitions d'affaires selon les principes bibliques.</p>
              <button className="w-full bg-white border border-gray-200 text-gsd-blue-dark font-bold hover:bg-gradient-to-r hover:from-gsd-gold hover:to-gsd-gold-light hover:text-white hover:border-transparent rounded-full py-3 transition-all">
                Commencer ce module
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
