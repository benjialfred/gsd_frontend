import React from 'react';
import { Award, Download, Printer, Share2, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from '../../../stores/useToastStore';
import { useAuthStore } from '../../../stores/authStore';

interface CertificateModalProps {
  course: any;
  onClose: () => void;
}

export default function CertificateModal({ course, onClose }: CertificateModalProps) {
  const { user } = useAuthStore();

  const learnerName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : (user?.username || 'Fidèle Apprenant GSD');

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certNumber = `GSD-CERT-${course.id}-${user?.id || '77'}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Attestation Officielle GSD : ${learnerName} a complété avec succès la formation « ${course.title} » sur Le Grand Salon Divin. Réf : ${certNumber}`
      );
      toast.success("Attestation copiée dans le presse-papier !");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Styles d'impression dédiés A4 Paysage */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #gsd-certificate-print-area, #gsd-certificate-print-area * {
            visibility: visible !important;
          }
          #gsd-certificate-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 2.5cm !important;
            box-shadow: none !important;
            border-width: 4px !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <div className="bg-[#1A3A5C]/95 rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-[#C9A84C]/40 flex flex-col gap-6 my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Barre d'outils supérieure (Fermer, Imprimer, Partager) */}
        <div className="flex items-center justify-between no-print pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-[#ebd18b]">
            <Sparkles size={18} />
            <span className="text-xs uppercase tracking-widest font-serif font-bold">
              Attestation d'Excellence & Sanctification GSD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-[#C9A84C] text-[#1A3A5C] text-xs font-bold hover:bg-[#ebd18b] transition-all flex items-center gap-1.5 shadow-md"
            >
              <Printer size={15} />
              <span>Imprimer / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all flex items-center gap-1.5"
            >
              <Share2 size={15} />
              <span className="hidden sm:inline">Partager</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ZONE DU DIPLÔME OFFICIEL (ISOLÉE POUR L'IMPRESSION A4) */}
        <div 
          id="gsd-certificate-print-area"
          className="bg-[#FCFBF7] text-[#1A3A5C] p-6 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden border-[10px] border-double border-[#C9A84C] flex flex-col justify-between aspect-[1.414/1] min-h-[500px]"
        >
          {/* Filigrane d'arrière-plan */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
            <Award size={600} className="text-[#1A3A5C]" />
          </div>

          {/* Ornements des 4 coins */}
          <div className="absolute top-3 left-3 text-[#C9A84C] text-lg select-none">⚜</div>
          <div className="absolute top-3 right-3 text-[#C9A84C] text-lg select-none">⚜</div>
          <div className="absolute bottom-3 left-3 text-[#C9A84C] text-lg select-none">⚜</div>
          <div className="absolute bottom-3 right-3 text-[#C9A84C] text-lg select-none">⚜</div>

          {/* En-tête du Certificat */}
          <div className="text-center relative z-10 space-y-1">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A84C] font-bold font-serif">
              Le Grand Salon Divin • Institut d'Alliance & Préparation au Foyer
            </p>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1A3A5C] tracking-wide uppercase pt-1">
              Certificat d'Alliance
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 italic">
              Attestation Officielle d'Édification et de Sanctification Conjugale
            </p>
          </div>

          {/* Corps du Certificat */}
          <div className="text-center my-6 space-y-4 relative z-10">
            <p className="text-xs sm:text-sm text-gray-600 font-sans">
              Le Conseil Pédagogique et Pastoral certifie avec honneur que
            </p>

            <div className="inline-block px-8 py-2 border-b-2 border-[#C9A84C] font-serif text-xl sm:text-3xl font-bold text-[#1A3A5C] tracking-tight">
              {learnerName}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              a validé avec assiduité et ferveur l'ensemble des modules d'enseignement spirituel de la formation certifiante :
            </p>

            <div className="bg-[#FAF9F6] border border-[#EFECE6] p-4 rounded-xl max-w-lg mx-auto shadow-2xs">
              <h3 className="font-serif font-bold text-base sm:text-xl text-[#1A3A5C]">
                « {course.title} »
              </h3>
              <p className="text-[11px] text-[#C9A84C] font-semibold mt-1">
                Catégorie : {course.category || "Préparation au Mariage"} • Niveau : {course.level || "Tous Niveaux"}
              </p>
            </div>

            <p className="text-[11px] sm:text-xs text-gray-400 italic max-w-md mx-auto">
              « Que le Seigneur bâtisse votre maison et affermisse vos pas dans la fidélité et la grâce divine. »
            </p>
          </div>

          {/* Bas du Certificat (Signatures, Sceau doré, Date & Réf) */}
          <div className="pt-6 border-t border-[#C9A84C]/30 flex items-end justify-between relative z-10 text-xs">
            
            {/* Signature Formateur */}
            <div className="text-center w-40">
              <div className="h-10 flex items-center justify-center font-serif italic text-sm text-[#1A3A5C]/70">
                {course.instructor_name || 'Dr. Samuel Adzessa'}
              </div>
              <div className="w-full border-t border-gray-400 mt-1 pt-1">
                <p className="font-bold text-[10px] text-gray-800 uppercase tracking-wider">Le Formateur Agréé</p>
                <p className="text-[9px] text-gray-400">Instructeur Principal GSD</p>
              </div>
            </div>

            {/* Sceau Doré Gaufré Central */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#C9A84C] bg-gradient-to-tr from-[#deb958] via-[#F4E3B2] to-[#C9A84C] text-[#1A3A5C] flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Award size={26} className="text-[#1A3A5C]" />
                <span className="text-[7px] font-black uppercase tracking-tighter text-[#1A3A5C] mt-0.5">SCEAU GSD</span>
              </div>
              <span className="text-[8px] text-gray-400 font-serif tracking-widest mt-1">CERTIFIÉ CONFORME</span>
            </div>

            {/* Signature Direction & Date */}
            <div className="text-center w-40">
              <div className="h-10 flex items-center justify-center font-serif italic text-sm text-[#C9A84C]">
                Conseil Pastoral GSD
              </div>
              <div className="w-full border-t border-gray-400 mt-1 pt-1">
                <p className="font-bold text-[10px] text-gray-800 uppercase tracking-wider">Direction Académie</p>
                <p className="text-[9px] text-gray-400">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Numéro de vérification unique en pied de page */}
          <div className="text-center pt-2">
            <span className="text-[9px] font-mono tracking-widest text-gray-400">
              Numéro d'attestation : {certNumber}
            </span>
          </div>

        </div>

        {/* Pied de modal avec félicitations */}
        <div className="flex items-center justify-between no-print text-white text-xs pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            <span className="font-semibold">Félicitations pour cette étape décisive dans votre vie d'alliance !</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
