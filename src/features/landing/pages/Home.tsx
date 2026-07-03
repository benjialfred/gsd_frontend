import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Star, Calendar, Download, Filter, ShoppingBag, Headphones, BookOpen } from 'lucide-react';

export default function Home() {
  const [filter, setFilter] = useState('all'); // 'all', 'ebook', 'podcast'

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any }
  };

  // Mock Data for Resources
  const resources = [
    {
      id: 1,
      type: 'ebook',
      title: 'Guérir des blessures du passé',
      description: 'Lalchimie du mariage heureux commence par vous.',
      cost: 'Gratuit',
      isFree: true,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 2,
      type: 'ebook',
      title: 'Préparer son budget de mariage',
      description: 'Le guide complet pour l\'Afrique & Diaspora.',
      cost: '14.99€',
      isFree: false,
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 3,
      type: 'podcast',
      title: 'Bâtir avec un Mentor, Saison 1',
      description: 'Comment trouver le bon mentor pour son couple.',
      cost: 'Gratuit',
      isFree: true,
      image: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80',
      icon: <Headphones className="w-5 h-5" />
    },
    {
      id: 4,
      type: 'podcast',
      title: 'Masterclass: Finances en Couple',
      description: 'Épargne, School Pass et immobilier.',
      cost: 'Premium',
      isFree: false,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      icon: <PlayCircle className="w-5 h-5" />
    }
  ];

  const filteredResources = filter === 'all' ? resources : resources.filter(r => r.type === filter);

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50 flex flex-col min-h-screen pb-16 overflow-x-hidden">
      
      {/* 1. HERO MAIN SECTION - "Diagonales de partout" */}
      <section className="relative w-full h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-white">
        
        {/* Layer 1: Background Image with Diagonal Cut */}
        <div className="absolute inset-0 z-0 w-full h-[110%] -top-[5%] [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)] bg-black">
          <img 
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2500&q=80" 
            alt="Couple Noir Marié" 
            className="w-full h-full object-cover object-top opacity-60 animate-[slowPan_30s_ease-in-out_infinite]"
          />
          {/* Subtle gradient overlay to merge with dark theme */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#082a5e]/90 via-[#082a5e]/50 to-transparent"></div>
        </div>

        {/* Layer 2: Decorative Diagonal Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-[120%] bg-[#dca54a]/20 [clip-path:polygon(100%_0,100%_100%,30%_100%)] z-0 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-r from-[#e5b75a] to-[#c1913c] [clip-path:polygon(0_60%,100%_0,100%_100%,0_100%)] z-0 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-full h-[45%] bg-[#082a5e] [clip-path:polygon(0_100%,100%_20%,100%_100%,0_100%)] z-10"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[15%] bg-white/10 [clip-path:polygon(0_100%,100%_0,0_0)] z-20 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-[-10%] w-[30%] h-[100%] bg-white/5 [clip-path:polygon(50%_0,100%_0,50%_100%,0_100%)] z-10 backdrop-blur-md"></div>

        {/* Hero Content positioned diagonally and strikingly */}
        <div className="relative z-30 max-w-7xl w-full px-6 lg:px-16 xl:px-24 flex flex-col items-start text-left mt-[-5%]">
          <motion.div
            initial={{ opacity: 0, x: -50, skewX: 10 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#dca54a] text-[#071b36] text-sm md:text-base font-extrabold tracking-widest uppercase mb-6 shadow-xl transform -skew-x-12"
          >
            <div className="transform skew-x-12 flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#071b36]" />
              <span>Le Sommet de l'Alliance Chrétienne</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, skewY: 2 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[85px] font-black text-white leading-[1.05] mb-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] uppercase tracking-tight"
          >
            Bâtir un <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffe399] to-[#dca54a]">Héritage</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-[#c82a2a] -z-10 transform -skew-x-12"></div>
            </span> <br />
            Éternel.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mb-10 drop-shadow-lg border-l-4 border-[#dca54a] pl-6"
          >
            Plus qu'une rencontre, une alliance à long terme. Rejoignez des célibataires et bâtisseurs en Afrique et dans la Diaspora.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <button className="relative w-full sm:w-auto bg-gradient-to-r from-[#e5b75a] to-[#c1913c] hover:from-white hover:to-white hover:text-[#082a5e] text-[#071b36] text-[16px] font-black tracking-widest py-5 px-12 uppercase transition-all duration-300 shadow-[0_20px_40px_rgba(229,183,90,0.4)] transform -skew-x-12 group">
                <div className="transform skew-x-12 flex items-center justify-center gap-3">
                  CRÉER MON ALLIANCE
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            </Link>
            
            <button className="relative w-full sm:w-auto border-2 border-white/30 hover:bg-white text-white hover:text-[#082a5e] text-[15px] font-bold py-4 px-8 uppercase tracking-widest transition-all duration-300 transform -skew-x-12 group backdrop-blur-sm">
              <div className="transform skew-x-12 flex items-center justify-center gap-3">
                <Calendar className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                <span>DÉCOUVRIR LE SOMMET 2026</span>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Decorative Floating Diagonal Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-32 h-32 bg-gradient-to-br from-[#c82a2a]/40 to-transparent [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] z-20 backdrop-blur-md border border-white/10"
        ></motion.div>
        
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute bottom-[30%] right-[5%] w-48 h-48 bg-[#dca54a]/20 [clip-path:polygon(0_0,100%_20%,80%_100%,20%_80%)] z-20 backdrop-blur-lg border border-white/20"
        ></motion.div>

      </section>

      {/* 2. OVERLAPPING CARDS SECTION (Services) */}
      <section className="w-full px-4 lg:px-12 xl:px-20 mx-auto relative z-20 -mt-24 lg:-mt-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col items-center text-center p-8 lg:p-10 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_70px_-15px_rgba(229,183,90,0.2)] border border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-[#082a5e]/5 flex items-center justify-center mb-6">
              <img src="https://img.icons8.com/color/96/graduation-cap.png" alt="Former" className="w-12 h-12 hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-[#082a5e] text-2xl mb-1">SE FORMER</h3>
            <h4 className="font-bold text-gray-400 text-xs mb-5 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">L'Académie</h4>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-[250px]">
              Cours, Masterclass, certifications et formations dédiés à la Diaspora et l'Afrique.
            </p>
            <button className="mt-auto w-full text-[#c1913c] font-bold py-3.5 px-6 rounded-xl bg-[#f8f5ee] hover:bg-[#e5b75a] hover:text-white transition-all flex items-center justify-center gap-2 group">
              Découvrir
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2 - Main MVP Highlight */}
          <motion.div variants={cardVariants} className="bg-[#082a5e] text-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(8,42,94,0.5)] flex flex-col items-center text-center p-8 lg:p-10 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_70px_-15px_rgba(8,42,94,0.7)] relative overflow-hidden ring-4 ring-[#082a5e] ring-offset-4 ring-offset-gray-50 scale-105 z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e5b75a]/20 to-transparent blur-[50px] pointer-events-none"></div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e5b75a] to-[#c1913c] flex items-center justify-center mb-6 shadow-lg shadow-[#dca54a]/30">
              <img src="https://img.icons8.com/color/96/wedding-rings.png" alt="Connecter" className="w-12 h-12 hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-white text-2xl mb-1 drop-shadow-md">SE CONNECTER</h3>
            <h4 className="font-bold text-[#e5b75a] text-xs mb-5 uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">Rencontres Premium</h4>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-[250px]">
              Mise en relation et rencontres exceptionnelles au cœur des relations durables.
            </p>
            <button className="mt-auto w-full bg-gradient-to-r from-[#e5b75a] to-[#c1913c] hover:brightness-110 text-[#071b36] font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group">
              Trouver l'élu(e)
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col items-center text-center p-8 lg:p-10 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_70px_-15px_rgba(229,183,90,0.2)] border border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-[#082a5e]/5 flex items-center justify-center mb-6">
              <img src="https://img.icons8.com/color/96/handshake.png" alt="Accompagné" className="w-12 h-12 hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-extrabold text-[#082a5e] text-2xl mb-1">S'ACCOMPAGNER</h3>
            <h4 className="font-bold text-gray-400 text-xs mb-5 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Mentorat & Coaching</h4>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-[250px]">
              Coaching et mentorat premium avec des experts pour réussir votre union et votre mariage.
            </p>
            <button className="mt-auto w-full text-[#c1913c] font-bold py-3.5 px-6 rounded-xl bg-[#f8f5ee] hover:bg-[#e5b75a] hover:text-white transition-all flex items-center justify-center gap-2 group">
              Prendre RDV
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. DYNAMIC DIGITAL MEDIA LIBRARY (E-Books & Podcasts) */}
      <section className="w-full px-4 lg:px-12 xl:px-20 mx-auto mt-28 mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-r from-blue-50 to-[#faf5eb] blur-[120px] pointer-events-none -z-10 rounded-full opacity-60"></div>
        
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm"
          >
            <Filter className="w-4 h-4 text-[#c1913c]" />
            <span className="text-[#082a5e] text-xs font-bold uppercase tracking-widest">Kiosque Digital</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[#082a5e] mb-6 tracking-tight"
          >
            Boîte à Outils du <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dca54a] to-[#c1913c]">Succès</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 max-w-2xl text-center text-sm md:text-base leading-relaxed"
          >
            Achetez, profitez de gratuités, écoutez et lisez tout ce qu'il vous faut pour bâtir des bases solides pour votre mariage.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['all', 'ebook', 'podcast'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                 filter === f 
                 ? 'bg-[#082a5e] text-white shadow-[0_4px_15px_rgba(8,42,94,0.4)]' 
                 : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-[#082a5e] border border-gray-200'
               }`}
             >
               {f === 'all' ? 'TOUT VOIR' : f === 'ebook' ? 'E-BOOKS & GUIDES' : 'PODCASTS AUDIO'}
             </button>
          ))}
        </div>

        {/* Dynamic Grid Layout */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredResources.map((item) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.06)] border border-gray-100 group flex flex-col h-full hover:shadow-[0_20px_40px_rgba(229,183,90,0.2)] hover:-translate-y-2 transition-all"
              >
                {/* Visual Area */}
                <div className="relative h-[200px] w-full overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-lg p-2 border border-white/20 text-white">
                    {item.icon}
                  </div>

                  <div className="absolute top-4 right-4">
                    {item.isFree ? (
                      <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur flex items-center gap-1"><Download className="w-3 h-3"/> GRATUIT</span>
                    ) : (
                      <span className="bg-[#e5b75a]/90 text-[#082a5e] px-3 py-1 rounded-full text-xs font-extrabold shadow-lg backdrop-blur flex items-center gap-1"><ShoppingBag className="w-3 h-3"/> {item.cost}</span>
                    )}
                  </div>

                  {/* Title mapped slightly on image */}
                  <h4 className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white leading-tight drop-shadow-lg">
                    {item.title}
                  </h4>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1 bg-white relative">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${item.type === 'ebook' ? 'text-[#c1913c]' : 'text-blue-500'}`}>
                    {item.type === 'ebook' ? 'LIVRE DIGITAL' : 'ÉCOUTE AUDIO'}
                  </span>
                  
                  <p className="text-gray-500 text-sm mb-6 flex-1 bg-white">
                    {item.description}
                  </p>

                  <button className="mt-auto w-full py-3 rounded-xl font-bold bg-gray-50 text-[#082a5e] group-hover:bg-[#082a5e] group-hover:text-white border border-gray-100 transition-colors duration-300 flex items-center justify-center gap-2">
                    {item.isFree ? 'Télécharger' : 'Acheter maintenant'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 4. PARTNERS SECTION */}
      <section className="w-full px-4 lg:px-12 xl:px-20 mx-auto mt-16 mt-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="bg-white rounded-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-gray-100 p-8 lg:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#082a5e] via-[#e5b75a] to-[#082a5e]"></div>
          
          <div className="flex flex-col items-center mb-10">
            <span className="bg-[#fcf8f0] text-[#c1913c] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">La Force du Réseau</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#082a5e] text-center">Nos Partenaires Stratégiques</h3>
            <div className="w-16 h-1.5 bg-[#e5b75a] mt-5 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 items-center justify-center pt-4">
            {/* Partner 1 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center group cursor-default p-4 rounded-xl hover:bg-gray-50 transition-colors text-center w-full">
              <img src="https://img.icons8.com/color/48/africa.png" alt="Bank" className="h-10 lg:h-12 mb-3 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              <span className="text-[10px] lg:text-xs font-bold text-gray-400 group-hover:text-[#082a5e] leading-snug">BANQUE AFRICAINE<br/>D'INVESTISSEMENT</span>
            </motion.div>
            
            {/* Partner 2 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center group cursor-default p-4 rounded-xl hover:bg-gray-50 transition-colors text-center w-full">
              <img src="https://img.icons8.com/ios-filled/50/228BE6/assurances.png" alt="Assurance" className="h-10 lg:h-12 mb-3 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              <span className="text-[10px] lg:text-xs font-bold text-gray-400 group-hover:text-[#082a5e] leading-snug">ASSURANCE VIE<br/>CAMEROUN</span>
            </motion.div>
            
            {/* Partner 3 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center group cursor-default p-4 rounded-xl hover:bg-gray-50 transition-colors text-center w-full">
              <img src="https://img.icons8.com/color/48/city-buildings.png" alt="Immobilier" className="h-10 lg:h-12 mb-3 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              <span className="text-[10px] lg:text-xs font-bold text-gray-400 group-hover:text-[#082a5e] leading-snug">PROMOTEUR<br/>IMMOBILIER LEADER</span>
            </motion.div>
            
            {/* Partner 4 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center group cursor-default p-4 rounded-xl hover:bg-gray-50 transition-colors text-center w-full">
              <img src="https://img.icons8.com/color/48/cameroon-flag-shape.png" alt="Minjec" className="h-10 lg:h-12 mb-3 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              <span className="text-[10px] lg:text-xs font-bold text-gray-400 group-hover:text-[#082a5e] leading-snug">MINISTÈRE DE LA<br/>JEUNESSE (MINJEC)</span>
            </motion.div>
            
            {/* Partner 5 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center group cursor-default p-4 rounded-xl hover:bg-gray-50 transition-colors text-center w-full col-span-2 lg:col-span-1">
              <img src="https://img.icons8.com/fluency/48/christian-cross.png" alt="Conseil" className="h-10 lg:h-12 mb-3 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
              <span className="text-[10px] lg:text-xs font-bold text-gray-400 group-hover:text-[#082a5e] leading-snug">CONSEIL CHRÉTIEN<br/>D'AFRIQUE</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Add basic tailwind custom animation in index.css for the hero if needed. */}
      {/* We apply a slowPan manually or depend on standard tailwind if defined. Framer-motion layout takes care of the dynamic grid smoothly! */}

    </div>
  );
}

