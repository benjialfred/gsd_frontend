import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Calendar, 
  HeartHandshake, 
  FileCheck, 
  Activity, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  QrCode, 
  ExternalLink, 
  Shield, 
  Crown, 
  TrendingUp, 
  UserCheck, 
  UserX, 
  Clock, 
  Sparkles,
  Award,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';
import { Navigate, Link } from 'react-router-dom';

interface Metrics {
  users: {
    total: number;
    new_30d: number;
    active_profiles: number;
    onboarding_completed: number;
  };
  kyc: {
    pending: number;
    approved: number;
    rejected: number;
    more_info: number;
  };
  finances: {
    total_revenue_fcfa: number;
    total_transactions: number;
    successful_transactions: number;
    pending_transactions: number;
    failed_transactions: number;
    breakdown: {
      subscriptions_fcfa: number;
      events_fcfa: number;
      coaching_fcfa: number;
    };
  };
  events: {
    total_events: number;
    published_events: number;
    confirmed_registrations: number;
    checked_in_registrations: number;
  };
  coaching: {
    total_coaches: number;
    total_appointments: number;
    confirmed_appointments: number;
  };
  subscriptions: {
    active_members: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const { user, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'kyc' | 'finances' | 'events' | 'coaching' | 'audit'>('overview');
  
  // États de chargement
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Données 100% réelles
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [kycQueue, setKycQueue] = useState<any[]>([]);
  const [coachesList, setCoachesList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filtres
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('');
  
  // Émargement QR Code
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ status: string; message: string; data?: any } | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Modal traitement KYC
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [kycReason, setKycReason] = useState('');
  const [kycActionLoading, setKycActionLoading] = useState(false);

  // Modal inspection utilisateur
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchAllData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    setErrorMsg(null);

    try {
      const [
        metricsRes,
        usersRes,
        txRes,
        eventsRes,
        regRes,
        kycRes,
        coachesRes,
        auditRes
      ] = await Promise.all([
        api.get('/api/admin/metrics/'),
        api.get('/api/admin/users/'),
        api.get('/api/admin/transactions/'),
        api.get('/api/admin/events/'),
        api.get('/api/admin/registrations/'),
        api.get('/api/admin/kyc/queue/'),
        api.get('/api/admin/coaches/'),
        api.get('/api/admin/audit-logs/')
      ]);

      setMetrics(metricsRes.data);
      setUsersList(usersRes.data);
      setTransactions(txRes.data);
      setEventsList(eventsRes.data);
      setRegistrations(regRes.data);
      setKycQueue(kycRes.data);
      setCoachesList(coachesRes.data);
      setAuditLogs(auditRes.data);
    } catch (err: any) {
      console.error('Erreur chargement console admin:', err);
      setErrorMsg(err.response?.data?.detail || "Erreur de connexion aux services administratifs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Vérifier l'authentification et charger les données
    checkAuth().then(() => {
      fetchAllData();
    });
  }, []);

  // Filtrage réactif des utilisateurs
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = 
        u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.first_name + ' ' + u.last_name).toLowerCase().includes(userSearch.toLowerCase()) ||
        u.profile?.city?.toLowerCase().includes(userSearch.toLowerCase());
      
      const matchRole = !userRoleFilter || u.role === userRoleFilter;
      return matchSearch && matchRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Filtrage réactif des transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = 
        t.reference?.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.customer_name?.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.customer_email?.toLowerCase().includes(txSearch.toLowerCase());
      
      const matchStatus = !txStatusFilter || t.status === txStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, txSearch, txStatusFilter]);

  // Actions de modération utilisateur
  const handleToggleUserStatus = async (targetUser: any, field: 'is_active' | 'is_staff') => {
    try {
      const updatedVal = !targetUser[field];
      await api.patch(`/api/admin/users/${targetUser.id}/`, {
        [field]: updatedVal
      });
      setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, [field]: updatedVal } : u));
    } catch (err: any) {
      alert("Erreur lors de la mise à jour : " + (err.response?.data?.error || err.message));
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.patch(`/api/admin/users/${userId}/`, { role: newRole });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert("Erreur lors du changement de rôle : " + (err.response?.data?.error || err.message));
    }
  };

  // Traitement KYC
  const handleKycReview = async (action: 'APPROVED' | 'REJECTED' | 'MORE_INFORMATION_REQUIRED') => {
    if (!selectedKyc) return;
    setKycActionLoading(true);
    try {
      await api.post(`/api/admin/kyc/review/${selectedKyc.id}/`, {
        action,
        reason: kycReason
      });
      setSelectedKyc(null);
      setKycReason('');
      fetchAllData(true);
    } catch (err: any) {
      alert("Erreur validation KYC : " + (err.response?.data?.error || err.message));
    } finally {
      setKycActionLoading(false);
    }
  };

  // Émargement par QR code
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;
    setCheckInLoading(true);
    setCheckInResult(null);
    try {
      const res = await api.post('/api/admin/registrations/check-in/', {
        qr_code_hash: qrCodeInput.trim()
      });
      setCheckInResult(res.data);
      setQrCodeInput('');
      fetchAllData(true);
    } catch (err: any) {
      setCheckInResult({
        status: 'error',
        message: err.response?.data?.error || "Code invalide ou introuvable."
      });
    } finally {
      setCheckInLoading(false);
    }
  };

  // Garde d'accès Admin
  const isAllowed = user?.role === 'ADMIN' || user?.is_staff || user?.is_superuser;
  if (!loading && user && !isAllowed) {
    return (
      <div className="min-h-screen bg-[#070F1E] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white/5 border border-red-500/30 p-8 rounded-3xl backdrop-blur-xl">
          <AlertTriangle size={56} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-white font-bold mb-2">Accès Restreint</h2>
          <p className="text-gray-300 text-sm mb-6">
            Cette zone est réservée à la Direction et aux Administrateurs accrédités du Grand Salon Divin.
          </p>
          <Link to="/app" className="inline-block px-6 py-2.5 bg-[#C9A84C] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-full shadow-lg">
            Retour au Sanctuaire
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050D1A] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-[#C9A84C] selection:text-[#050D1A]">
      {/* GLOW DE FOND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#C9A84C]/10 via-[#1A3A5C]/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-900/20 via-[#0A192F]/30 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* EN-TÊTE DE DIRECTION & STATUT TEMPS RÉEL */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 shadow-inner">
                <Crown size={12} /> Console Exécutive
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync (Zero Mock)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF9F6] tracking-tight">
              Tableau de Bord Administrateur
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Supervision de l'Alliance Matrimoniale, validation KYC, contrôle financier et émargement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAllData(false)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A84C]/50 text-xs font-semibold tracking-wider uppercase text-gray-300 hover:text-white transition duration-300 shadow-sm"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#C9A84C]' : ''} />
              <span>{refreshing ? 'Synchronisation...' : 'Actualiser'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A84C] to-amber-200 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center text-[#C9A84C] font-bold text-sm">
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-white">{user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}</p>
                <p className="text-[#C9A84C] font-mono text-[10px]">ADMINISTRATEUR</p>
              </div>
            </div>
          </div>
        </header>

        {/* ALERTE D'ERREUR EVENTUELLE */}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 text-xs">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* NAVIGATION PAR ONGLETS */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          {[
            { id: 'overview', label: "Vue d'Ensemble", icon: Activity },
            { id: 'users', label: `Membres (${metrics?.users.total ?? usersList.length})`, icon: Users },
            { id: 'kyc', label: `File KYC (${metrics?.kyc.pending ?? kycQueue.length})`, icon: FileCheck, badge: (metrics?.kyc.pending ?? 0) > 0 },
            { id: 'finances', label: `Trésorerie (${(metrics?.finances.total_revenue_fcfa ?? 0).toLocaleString()} F)`, icon: CreditCard },
            { id: 'events', label: `Événements & Émargement (${metrics?.events.total_events ?? eventsList.length})`, icon: Calendar },
            { id: 'coaching', label: `Conseillers (${metrics?.coaching.total_coaches ?? coachesList.length})`, icon: HeartHandshake },
            { id: 'audit', label: "Journal d'Audit", icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#DFB76C] text-[#0A192F] shadow-lg shadow-[#C9A84C]/20 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENU SELON L'ONGLET ACTIF */}
        <AnimatePresence mode="wait">

          {/* ========================================================= */}
          {/* 1. ONGLET : VUE D'ENSEMBLE                                 */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* CARTES KPIS EXÉCUTIFS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* REVENU GLOBAL */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-[#C9A84C]/30 p-5 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between text-gray-400 mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#C9A84C]">Volume Encaissé NelsiusPay</span>
                    <DollarSign size={20} className="text-[#C9A84C]" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white tracking-tight">
                    {(metrics?.finances.total_revenue_fcfa ?? 0).toLocaleString()} <span className="text-sm font-sans font-normal text-[#C9A84C]">FCFA</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span>{metrics?.finances.successful_transactions ?? 0} transactions réussies</span>
                  </p>
                </div>

                {/* MEMBRES TOTAL */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between text-gray-400 mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold">Membres Enregistrés</span>
                    <Users size={20} className="text-indigo-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white tracking-tight">
                    {metrics?.users.total ?? 0}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-semibold">+{metrics?.users.new_30d ?? 0}</span>
                    <span>derniers 30 jours ({metrics?.users.onboarding_completed ?? 0} profilés)</span>
                  </p>
                </div>

                {/* VERIFICATION KYC */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between text-gray-400 mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold">Certifications KYC</span>
                    <FileCheck size={20} className="text-amber-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white tracking-tight">
                    {metrics?.kyc.approved ?? 0} <span className="text-xs font-sans text-gray-400">/ {((metrics?.kyc.approved ?? 0) + (metrics?.kyc.pending ?? 0))}</span>
                  </div>
                  <p className="text-[11px] text-amber-300 mt-2 flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{metrics?.kyc.pending ?? 0} en attente de validation</span>
                  </p>
                </div>

                {/* BILLETS & PARTICIPANTS */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between text-gray-400 mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold">Inscrits Galas</span>
                    <Calendar size={20} className="text-rose-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white tracking-tight">
                    {metrics?.events.confirmed_registrations ?? 0}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-emerald-400" />
                    <span>{metrics?.events.checked_in_registrations ?? 0} participants émargés</span>
                  </p>
                </div>

              </div>

              {/* GRILLE DÉTAILLÉE : REVENUS PAR SERVICE & FILE URGENTE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* VENTILATION DU CHIFFRE D'AFFAIRES */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                  <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign size={18} className="text-[#C9A84C]" />
                    Répartition des Revenus par Branche
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Abonnements & Pass Membre</span>
                        <span className="font-bold text-white">{(metrics?.finances.breakdown.subscriptions_fcfa ?? 0).toLocaleString()} FCFA</span>
                      </div>
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-[#C9A84C] h-full rounded-full"
                          style={{ width: `${metrics?.finances.total_revenue_fcfa ? Math.min(100, Math.round(((metrics?.finances.breakdown.subscriptions_fcfa ?? 0) / metrics.finances.total_revenue_fcfa) * 100)) : 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Billetterie Galas & Sommets</span>
                        <span className="font-bold text-white">{(metrics?.finances.breakdown.events_fcfa ?? 0).toLocaleString()} FCFA</span>
                      </div>
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full"
                          style={{ width: `${metrics?.finances.total_revenue_fcfa ? Math.min(100, Math.round(((metrics?.finances.breakdown.events_fcfa ?? 0) / metrics.finances.total_revenue_fcfa) * 100)) : 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Séances Pastorales & Coaching</span>
                        <span className="font-bold text-white">{(metrics?.finances.breakdown.coaching_fcfa ?? 0).toLocaleString()} FCFA</span>
                      </div>
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full"
                          style={{ width: `${metrics?.finances.total_revenue_fcfa ? Math.min(100, Math.round(((metrics?.finances.breakdown.coaching_fcfa ?? 0) / metrics.finances.total_revenue_fcfa) * 100)) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 text-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Membres VIP Actifs</p>
                      <p className="text-xl font-bold text-[#C9A84C] mt-1">{metrics?.subscriptions.active_members ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Coachs Actifs</p>
                      <p className="text-xl font-bold text-white mt-1">{metrics?.coaching.total_coaches ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Séances Réservées</p>
                      <p className="text-xl font-bold text-emerald-400 mt-1">{metrics?.coaching.total_appointments ?? 0}</p>
                    </div>
                  </div>
                </div>

                {/* ACCÈS RAPIDE FILE KYC */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-amber-400" />
                      Conformité & Intégrité
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Vérification manuelle des identités afin de garantir la sainteté et la véracité des profils.
                    </p>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center mb-4">
                      <span className="text-3xl font-serif font-bold text-amber-300">
                        {metrics?.kyc.pending ?? 0}
                      </span>
                      <p className="text-xs text-amber-200/80 mt-1">Dossiers en attente d'approbation</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('kyc')}
                    className="w-full py-3 rounded-2xl bg-[#C9A84C] hover:bg-[#DFB76C] text-[#0A192F] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Inspecter la File KYC</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 2. ONGLET : GESTION DES MEMBRES                            */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* BARRE DE RECHERCHE ET FILTRES */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-grow w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Rechercher par nom, email, pseudo, ville..."
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="">Tous les rôles</option>
                    <option value="ADMIN">Administrateurs</option>
                    <option value="USER">Membres Standards</option>
                    <option value="COACH">Coachs & Pasteurs</option>
                    <option value="FORMATEUR">Formateurs Académie</option>
                  </select>
                </div>
              </div>

              {/* TABLEAU DES UTILISATEURS */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Membre</th>
                        <th className="py-3.5 px-4">Rôle</th>
                        <th className="py-3.5 px-4">Statut KYC</th>
                        <th className="py-3.5 px-4">Localisation</th>
                        <th className="py-3.5 px-4">Inscription</th>
                        <th className="py-3.5 px-4">État Compte</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            Aucun utilisateur correspondant trouvé.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A3A5C] text-[#C9A84C] flex items-center justify-center font-bold text-xs">
                                  {u.first_name ? u.first_name.charAt(0) : u.username.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-white">
                                    {u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.username}
                                  </p>
                                  <p className="text-[11px] text-gray-400">{u.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={u.role}
                                onChange={e => handleRoleChange(u.id, e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-300 focus:outline-none focus:border-[#C9A84C]"
                              >
                                <option value="USER">USER</option>
                                <option value="COACH">COACH</option>
                                <option value="FORMATEUR">FORMATEUR</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>

                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                u.kyc_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                u.kyc_status === 'PENDING_REVIEW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                                u.kyc_status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {u.kyc_status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-gray-300">
                              {u.profile?.city || 'Non renseigné'}
                            </td>

                            <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                              {u.date_joined_formatted || new Date(u.date_joined).toLocaleDateString()}
                            </td>

                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {u.is_active ? 'Actif' : 'Suspendu'}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleUserStatus(u, 'is_active')}
                                  title={u.is_active ? "Suspendre l'utilisateur" : "Réactiver l'utilisateur"}
                                  className={`p-1.5 rounded-lg border transition ${
                                    u.is_active 
                                      ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400'
                                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                  }`}
                                >
                                  {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                                </button>
                                <button
                                  onClick={() => setSelectedUser(u)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
                                  title="Détails du profil"
                                >
                                  <Eye size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. ONGLET : FILE DE CONFORMITÉ KYC                         */}
          {/* ========================================================= */}
          {activeTab === 'kyc' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <ShieldCheck size={20} className="text-[#C9A84C]" />
                    Vérification Rigoureuse des Candidats à l'Alliance
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Examinez les pièces d'identité et selfies de discernement pour délivrer le statut vérifié.
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
                  {kycQueue.length} Dossiers
                </span>
              </div>

              {kycQueue.length === 0 ? (
                <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center space-y-3">
                  <CheckCircle size={48} className="text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-serif font-bold text-white">File d'Attente Complètement Traitée</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Toutes les soumissions KYC actuelles ont été validées ou traitées. Aucun dossier en attente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kycQueue.map(sub => (
                    <div key={sub.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">Dossier #{sub.id}</h4>
                          <p className="text-xs text-gray-400">Profil ID: {sub.profile}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {sub.status}
                        </span>
                      </div>

                      {/* LIENS VERS LES DOCUMENTS */}
                      <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                        {sub.id_document_front && (
                          <a
                            href={sub.id_document_front}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C9A84C] transition"
                          >
                            <span>Pièce d'Identité (Recto)</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {sub.id_document_back && (
                          <a
                            href={sub.id_document_back}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C9A84C] transition"
                          >
                            <span>Pièce d'Identité (Verso)</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {sub.selfie_video && (
                          <a
                            href={sub.selfie_video}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 transition"
                          >
                            <span>Vidéo / Selfie d'Authentification</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      {/* BOUTON D'ACTION */}
                      <button
                        onClick={() => setSelectedKyc(sub)}
                        className="w-full py-2.5 bg-gradient-to-r from-[#C9A84C] to-[#DFB76C] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition hover:scale-[1.02]"
                      >
                        Traiter ce Dossier
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 4. ONGLET : TRÉSORERIE & PAIEMENTS NELSIUSPAY               */}
          {/* ========================================================= */}
          {activeTab === 'finances' && (
            <motion.div
              key="finances"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-grow w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={txSearch}
                    onChange={e => setTxSearch(e.target.value)}
                    placeholder="Rechercher par référence (ex: GSD-PAY-...), client, email..."
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={txStatusFilter}
                    onChange={e => setTxStatusFilter(e.target.value)}
                    className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="SUCCESS">Paiement Réussi</option>
                    <option value="PENDING">En attente</option>
                    <option value="FAILED">Échoué</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Référence</th>
                        <th className="py-3.5 px-4">Client</th>
                        <th className="py-3.5 px-4">Motif</th>
                        <th className="py-3.5 px-4">Montant</th>
                        <th className="py-3.5 px-4">Statut</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Lien</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            Aucune transaction trouvée.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map(t => (
                          <tr key={t.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 px-4 font-mono font-bold text-[#C9A84C]">
                              {t.reference}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-white">{t.customer_name}</p>
                              <p className="text-[11px] text-gray-400">{t.customer_email}</p>
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {t.purpose_display || t.purpose}
                            </td>
                            <td className="py-3 px-4 font-bold text-white">
                              {Number(t.amount).toLocaleString()} {t.currency}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                t.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {t.status_display || t.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                              {t.created_at_formatted || new Date(t.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {t.checkout_url && (
                                <a
                                  href={t.checkout_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-[#C9A84C] hover:underline"
                                >
                                  <span>Caisse</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 5. ONGLET : ÉVÉNEMENTS & ÉMARGEMENT QR CODE                */}
          {/* ========================================================= */}
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* SCANNER & SAISIE QR CODE MANUELLE */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 border border-[#C9A84C]/40 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
                <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
                  <QrCode size={20} className="text-[#C9A84C]" />
                  Contrôle d'Accès & Émargement Numérique en Entrée de Gala
                </h3>
                <p className="text-xs text-gray-300 mb-4">
                  Saisissez ou scannez le hash unique du QR Code présent sur le billet officiel du participant.
                </p>

                <form onSubmit={handleCheckIn} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={qrCodeInput}
                    onChange={e => setQrCodeInput(e.target.value)}
                    placeholder="ex: GSD-EVT-1-A1B2C3D4E5F6"
                    className="flex-grow px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                  />
                  <button
                    type="submit"
                    disabled={checkInLoading || !qrCodeInput.trim()}
                    className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#DFB76C] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl transition duration-300 shadow-lg disabled:opacity-50"
                  >
                    {checkInLoading ? 'Validation...' : 'Valider Entrée'}
                  </button>
                </form>

                {/* RÉSULTAT DU CONTRÔLE D'ACCÈS */}
                {checkInResult && (
                  <div className={`mt-4 p-4 rounded-2xl border text-xs flex items-center gap-3 ${
                    checkInResult.status === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : checkInResult.status === 'already_checked_in'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}>
                    {checkInResult.status === 'success' ? <CheckCircle size={20} className="flex-shrink-0" /> : <AlertTriangle size={20} className="flex-shrink-0" />}
                    <div>
                      <p className="font-bold">{checkInResult.message}</p>
                      {checkInResult.data && (
                        <p className="text-[11px] opacity-80 mt-0.5">
                          Invité : {checkInResult.data.guest_name} • Billet : {checkInResult.data.tier_name}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* LISTE DES ÉVÉNEMENTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventsList.map(evt => (
                  <div key={evt.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
                    <div className="h-32 rounded-2xl overflow-hidden relative">
                      {evt.banner_image ? (
                        <img src={evt.banner_image} alt={evt.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1A3A5C] flex items-center justify-center text-[#C9A84C]">
                          <Calendar size={32} />
                        </div>
                      )}
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-[#C9A84C] backdrop-blur-md border border-[#C9A84C]/40">
                        {evt.event_type_display}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-white text-base leading-snug">{evt.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                        <Clock size={12} className="text-[#C9A84C]" />
                        <span>{evt.start_date_formatted}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 grid grid-cols-2 text-center text-xs">
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">Réservations</p>
                        <p className="font-bold text-white mt-0.5">{evt.registrations_count} / {evt.capacity}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">Recettes</p>
                        <p className="font-bold text-[#C9A84C] mt-0.5">{(evt.revenue_generated ?? 0).toLocaleString()} F</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TABLEAU DES BILLETS / REGISTRATIONS RÉELS */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl mt-6">
                <div className="p-4 border-b border-white/10">
                  <h4 className="text-sm font-serif font-bold text-white">Participants Enregistrés aux Galas</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-3 px-4">Participant</th>
                        <th className="py-3 px-4">Événement</th>
                        <th className="py-3 px-4">Billet</th>
                        <th className="py-3 px-4">Hash QR</th>
                        <th className="py-3 px-4">Émargé</th>
                        <th className="py-3 px-4">Date Achat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            Aucun billet acheté pour le moment.
                          </td>
                        </tr>
                      ) : (
                        registrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 px-4 font-semibold text-white">
                              {reg.guest_name}
                              <span className="block text-[11px] text-gray-400 font-normal">{reg.guest_email}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{reg.event_title}</td>
                            <td className="py-3 px-4">
                              <span className="text-[#C9A84C] font-semibold">{reg.tier_name}</span> ({Number(reg.tier_price).toLocaleString()} F)
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-gray-400">{reg.qr_code_hash}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                reg.is_checked_in ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {reg.is_checked_in ? 'OUI' : 'NON'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                              {reg.created_at_formatted || new Date(reg.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 6. ONGLET : CONSEILLERS & COACHING                         */}
          {/* ========================================================= */}
          {activeTab === 'coaching' && (
            <motion.div
              key="coaching"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coachesList.map(coach => (
                  <div key={coach.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C] text-[#C9A84C] flex items-center justify-center font-bold text-lg overflow-hidden border border-[#C9A84C]/30">
                        {coach.avatar_url ? (
                          <img src={coach.avatar_url} alt={coach.coach_name} className="w-full h-full object-cover" />
                        ) : (
                          coach.coach_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">{coach.coach_name}</h4>
                        <p className="text-xs text-[#C9A84C]">{coach.title}</p>
                        <p className="text-[11px] text-gray-400">{coach.email}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 grid grid-cols-3 text-center text-xs">
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">Expérience</p>
                        <p className="font-bold text-white mt-0.5">{coach.years_of_experience} ans</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">Taux Horaire</p>
                        <p className="font-bold text-[#C9A84C] mt-0.5">{Number(coach.hourly_rate).toLocaleString()} F</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">Séances Prises</p>
                        <p className="font-bold text-emerald-400 mt-0.5">{coach.appointments_count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 7. ONGLET : JOURNAL D'AUDIT                                */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#C9A84C]" />
                  Piste d'Audit Immuable des Décisions Administratives
                </h3>

                {auditLogs.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-8">
                    Aucune entrée dans le journal d'audit pour le moment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">
                            Action : <span className="text-[#C9A84C]">{log.action}</span> sur {log.target_user}
                          </p>
                          {log.comments && (
                            <p className="text-[11px] text-gray-400 mt-0.5">Motif : {log.comments}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-[11px] font-mono">{log.created_at_formatted}</span>
                          <span className="block text-[10px] text-gray-500">Par {log.admin_username}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ========================================================= */}
      {/* MODAL : TRAITEMENT DE DOSSIER KYC                         */}
      {/* ========================================================= */}
      {selectedKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0A192F] border border-[#C9A84C]/40 p-6 rounded-3xl max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-serif font-bold text-white text-lg">Décision Conformité KYC #{selectedKyc.id}</h3>
              <button onClick={() => setSelectedKyc(null)} className="text-gray-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Motif ou Note d'Audit (obligatoire pour refus ou complément)
              </label>
              <textarea
                value={kycReason}
                onChange={e => setKycReason(e.target.value)}
                placeholder="Indiquez les détails de la décision..."
                rows={3}
                className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleKycReview('APPROVED')}
                disabled={kycActionLoading}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow"
              >
                Approuver
              </button>
              <button
                onClick={() => handleKycReview('MORE_INFORMATION_REQUIRED')}
                disabled={kycActionLoading}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl transition shadow"
              >
                Complément
              </button>
              <button
                onClick={() => handleKycReview('REJECTED')}
                disabled={kycActionLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow"
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL : FICHE DÉTAILLÉE UTILISATEUR                        */}
      {/* ========================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0A192F] border border-white/20 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-serif font-bold text-white text-base">Fiche Membre #{selectedUser.id}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                <XCircle size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><span className="text-gray-400">Nom Complet :</span> <span className="font-semibold text-white">{selectedUser.first_name} {selectedUser.last_name}</span></p>
              <p><span className="text-gray-400">Email :</span> <span className="font-semibold text-white">{selectedUser.email}</span></p>
              <p><span className="text-gray-400">Rôle Système :</span> <span className="font-semibold text-[#C9A84C]">{selectedUser.role}</span></p>
              <p><span className="text-gray-400">Statut KYC :</span> <span className="font-semibold text-white">{selectedUser.kyc_status}</span></p>
              <p><span className="text-gray-400">Ville / Pays :</span> <span className="font-semibold text-white">{selectedUser.profile?.city || 'Non renseigné'}</span></p>
              <p><span className="text-gray-400">Dénomination :</span> <span className="font-semibold text-white">{selectedUser.profile?.denomination || 'Non renseigné'}</span></p>
              <p><span className="text-gray-400">Date d'adhésion :</span> <span className="font-mono text-gray-300">{selectedUser.date_joined_formatted}</span></p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
