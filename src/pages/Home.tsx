import React from 'react';

export default function Home() {
  return (
    <div className="font-sans antialiased text-gray-800 bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col lg:flex-row bg-[#082a5e]">
        {/* LEFT COMPONENT (Blue Area) */}
        <div className="w-full lg:w-[55%] pt-20 pb-16 px-8 lg:px-16 xl:px-24 flex flex-col justify-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-tight mb-4">
            Votre Célibat a une Mission.<br />
            <span className="bg-gradient-to-r from-[#dca54a] to-[#ebd18b] bg-clip-text text-transparent transform">Votre Couple a un Avenir.</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-normal max-w-[90%] mb-10">
            Le premier écosystème chrétien complet pour se former, se rencontrer et bâtir une alliance bénie en Afrique et dans la Diaspora.
          </p>
          <div className="flex flex-col items-start w-full">
            <button className="w-full max-w-[85%] bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-[#071b36] hover:brightness-110 text-xl font-bold py-4 px-6 rounded shadow-xl transition-all mb-4 text-center">
              CRÉER MON COMPTE GRATUIT
            </button>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-[85%] px-1">
              <div className="flex items-center gap-2 text-white text-sm bg-[#061d42] p-2 rounded-md">
                <span className="text-yellow-400">⚡</span>
                <span>Déjà <strong>+500 membres fondateurs</strong> nous font confiance.</span>
              </div>
              <button className="bg-[#cc2b2b] hover:bg-red-700 text-white text-xs font-bold py-2.5 px-6 flex items-center justify-center gap-2 rounded-full shadow-lg whitespace-nowrap">
                <span>📅</span> DÉCOUVRIR LE SOMMET SICI 2026
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT (Image Area) */}
        <div className="w-full lg:w-[45%] relative min-h-[450px] lg:min-h-full">
           {/* Gradient mask to blend image into the blue background on the left */}
           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#082a5e] to-transparent z-10 hidden lg:block"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full"></div>
           {/* Background Overlay to mimic the building blur */}
           <img 
             src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
             alt="Couple" 
             className="w-full h-full object-cover object-top opacity-90"
           />
        </div>
      </section>

      {/* MIDDLE SECTION - Grid Layout matching the image exactly */}
      <section className="w-full px-4 lg:px-16 xl:px-24 mx-auto pb-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN (Services) */}
          <div className="w-full lg:w-[55%]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
              {/* ITEM 1 */}
              <div className="flex flex-col items-center text-center">
                <img src="https://img.icons8.com/color/96/graduation-cap.png" alt="Former" className="w-16 h-16 mb-2" />
                <h3 className="font-bold text-black text-[15px] mb-0 leading-tight">SE FORMER</h3>
                <h4 className="font-bold text-black text-[15px] mb-2">(Académie)</h4>
                <p className="text-[11px] text-black mb-4 leading-snug px-1">Cours, Masterclass et certifications et formations, Afrique etc du Diaspora.</p>
                <button className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-xs font-bold py-1.5 px-5 rounded hover:brightness-110 shadow">
                  [En savoir plus]
                </button>
              </div>
              {/* ITEM 2 */}
              <div className="flex flex-col items-center text-center">
                <img src="https://img.icons8.com/color/96/wedding-rings.png" alt="Connecter" className="w-16 h-16 mb-2" />
                <h3 className="font-bold text-black text-[15px] mb-0 leading-tight">SE CONNECTER</h3>
                <h4 className="font-bold text-black text-[15px] mb-2">(Mise en Relation)</h4>
                <p className="text-[11px] text-black mb-4 leading-snug px-1">Mise en relation et rencontres relationnelles au coeur des relations durables.</p>
                <button className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-xs font-bold py-1.5 px-5 rounded hover:brightness-110 shadow">
                  [Trouver l'élu(e)]
                </button>
              </div>
              {/* ITEM 3 */}
              <div className="flex flex-col items-center text-center">
                <img src="https://img.icons8.com/color/96/handshake.png" alt="Accompagné" className="w-16 h-16 mb-2" />
                <h3 className="font-bold text-black text-[15px] mb-0 leading-tight">ÊTRE ACCOMPAGNÉ</h3>
                <h4 className="font-bold text-black text-[15px] mb-2">(Coaching)</h4>
                <p className="text-[11px] text-black mb-4 leading-snug px-1">Coaching et mentorat avec connexions avérées et mentorships et le mariage.</p>
                <button className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-xs font-bold py-1.5 px-5 rounded hover:brightness-110 shadow">
                  [Prendre RDV]
                </button>
              </div>
            </div>
            
            {/* Resources & Podcasts Section */}
            <div className="mt-14">
              <h2 className="text-xl font-bold text-black mb-4">Resources & Podcasts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 {/* Card 1 */}
                 <div className="bg-white rounded-lg p-2.5 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-100">
                    <div className="w-[60px] h-[60px] rounded shrink-0 bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80)'}}></div>
                    <div className="ml-3 flex flex-col justify-between h-full">
                      <h4 className="text-[11px] font-bold text-black leading-snug mb-1">e-book: Guérir des blessures du passé</h4>
                      <button className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-[10px] font-bold py-[3px] px-3 rounded w-fit">[Télécharger]</button>
                    </div>
                 </div>
                 {/* Card 2 */}
                 <div className="bg-white rounded-lg p-2.5 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-100">
                    <div className="w-[60px] h-[60px] rounded shrink-0 bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80)'}}></div>
                    <div className="ml-3 flex flex-col justify-between h-full">
                      <h4 className="text-[11px] font-bold text-black leading-snug mb-1">Guide: Comprendre le Crédit Immobilier</h4>
                      <button className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-[10px] font-bold py-[3px] px-3 rounded w-fit">[Télécharger]</button>
                    </div>
                 </div>
                 {/* Card 3 */}
                 <div className="bg-white rounded-lg p-2.5 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-100 relative pr-6">
                    <div className="w-[60px] h-[60px] rounded flex items-center justify-center shrink-0 bg-[#082a5e]">
                       <img src="https://img.icons8.com/color/48/microphone.png" alt="Podcast" className="w-8 h-8" />
                    </div>
                    <div className="ml-3 flex flex-col justify-between h-full w-full">
                      <h4 className="text-[11px] font-bold text-black leading-snug mb-1">Podcast: Bâtir avec un Mentor (Interview)</h4>
                      <button className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-[10px] font-bold py-[3px] px-3 rounded w-fit">[Écouter]</button>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold">&gt;</div>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Cards overlapping image + Partners) */}
          <div className="w-full lg:w-[45%] flex flex-col">
             
             {/* 3 Vertically Aligned Top Cards (overlapping hero slightly) */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:-mt-[5.5rem]">
                {/* Image Card 1 */}
                <div className="bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden items-center text-center p-3">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&q=80" alt="Ebook" className="w-full h-[100px] object-cover rounded-md mb-3" />
                  <h4 className="text-[11px] font-bold text-black mb-3 px-1 leading-snug">E-book: Guérir des blessures du passé</h4>
                  <button className="mt-auto bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-[10px] font-bold py-1.5 px-4 rounded shadow">[Télécharger]</button>
                </div>
                {/* Image Card 2 */}
                <div className="bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden items-center text-center p-3">
                  <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&q=80" alt="Guide" className="w-full h-[100px] object-cover rounded-md mb-3" />
                  <h4 className="text-[11px] font-bold text-black mb-3 px-1 leading-snug">Guide: Préparer son budget de mariage au Cameroun</h4>
                  <button className="mt-auto bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-[10px] font-bold py-1.5 px-4 rounded shadow">[Télécharger]</button>
                </div>
                {/* Finance Card */}
                <div className="bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden items-center text-center p-3">
                  <div className="w-full flex justify-center mb-1 mt-2">
                     <img src="https://img.icons8.com/color/96/handshake.png" alt="Finance" className="w-16 h-16" />
                  </div>
                  <h4 className="text-[11px] font-bold text-black mb-1 w-full uppercase">BÂTIR LE PATRIMOINE<br/>(Finance)</h4>
                  <p className="text-[9px] text-black mb-3 leading-tight px-1">School Pass, Crédits immobilier, Epargne-études</p>
                  <button className="mt-auto bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black text-[10px] font-bold py-1.5 px-4 rounded shadow">Voir les Offres</button>
                </div>
             </div>

             {/* PARTNERS SECTION */}
             <div className="mt-auto pb-4 pt-10 px-2">
                <div className="bg-gradient-to-r from-[#dca54a] to-[#c1913c] py-1.5 px-6 rounded shadow-md mb-5 text-center w-max mx-auto shadow-[0_3px_10px_rgba(220,165,74,0.5)]">
                  <h3 className="text-black font-black tracking-wider text-[13px] uppercase">NOS PARTENAIRES STRATÉGIQUES</h3>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2 lg:gap-4">
                  <div className="flex flex-col items-center w-[18%]">
                    <img src="https://img.icons8.com/color/48/africa.png" alt="Bank" className="h-8 lg:h-10 mb-1 object-contain" />
                    <span className="text-[7px] lg:text-[8px] font-bold text-center leading-[1.1] text-black">BANQUE AFRICAINE D'INVESTISSEMENT</span>
                  </div>
                  <div className="flex flex-col items-center w-[18%]">
                    <img src="https://img.icons8.com/ios-filled/50/228BE6/assurances.png" alt="Assurance" className="h-8 lg:h-10 mb-1 object-contain" />
                    <span className="text-[7px] lg:text-[8px] font-bold text-center leading-[1.1] text-black">ASSURANCE VIE CAMEROUN</span>
                  </div>
                  <div className="flex flex-col items-center w-[18%]">
                    <img src="https://img.icons8.com/color/48/city-buildings.png" alt="Immobilier" className="h-8 lg:h-10 mb-1 object-contain" />
                    <span className="text-[7px] lg:text-[8px] font-bold text-center leading-[1.1] text-black">PROMOTEUR IMMOBILIER LEADER</span>
                  </div>
                  <div className="flex flex-col items-center w-[18%]">
                    <img src="https://img.icons8.com/color/48/cameroon-flag-shape.png" alt="Minjec" className="h-8 lg:h-10 mb-1 object-contain" />
                    <span className="text-[7px] lg:text-[8px] font-bold text-center leading-[1.1] text-black">MINISTÈRE DE LA JEUNESSE (MINJEC)</span>
                  </div>
                  <div className="flex flex-col items-center w-[18%]">
                    <img src="https://img.icons8.com/fluency/48/christian-cross.png" alt="Conseil" className="h-8 lg:h-10 mb-1 object-contain" />
                    <span className="text-[7px] lg:text-[8px] font-bold text-center leading-[1.1] text-black">CONSEIL CHRÉTIEN D'AFRIQUE</span>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
}
