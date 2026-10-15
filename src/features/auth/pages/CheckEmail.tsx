import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../../shared/components/Logo';

export default function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email || "votre adresse e-mail";

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center relative overflow-hidden font-sans">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-8 py-12 flex flex-col items-center text-center"
      >
        <Logo theme="light" className="mb-12 scale-125" />
        
        <div className="w-16 h-16 rounded-full bg-[#fcf9f2] text-[#C9A84C] flex items-center justify-center mb-8">
          <Mail size={32} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl font-serif text-[#1A3A5C] mb-4 tracking-wide font-normal">Vérifiez votre messagerie</h1>
        
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
          Nous vous avons envoyé un lien de confirmation à <br/>
          <span className="font-medium text-[#1A3A5C]">{email}</span>. <br/><br/>
          Veuillez cliquer sur le lien dans l'e-mail pour activer votre compte et commencer votre parcours.
        </p>

        <div className="w-full h-px bg-gray-100 mb-8"></div>

        <p className="text-xs text-gray-400 font-light mb-6">
          Vous n'avez rien reçu ? Vérifiez le dossier spam de votre boîte de réception.
        </p>

        <Link to="/login" className="text-[#1A3A5C] font-semibold hover:text-[#C9A84C] transition-colors uppercase tracking-wider text-xs flex items-center gap-2 group">
          Retour à la connexion
          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}
