
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './features/landing/pages/Home';
import Academy from './features/academy/pages/AcademyLanding';
import Matchmaking from './features/matchmaking/pages/MatchmakingLanding';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import CheckEmail from './features/auth/pages/CheckEmail';
import VerifyEmail from './features/auth/pages/VerifyEmail';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import ProfileEdit from './features/profile/pages/ProfileEdit';
import MatchEngine from './features/matchmaking/pages/MatchEngine';
import ChatSpace from './features/chat/pages/ChatSpace';
import AcademyDashboard from './features/academy/pages/AcademyDashboard';
import { OnboardingPage } from './features/onboarding/pages/OnboardingPage';
import { HomeDashboard } from './features/dashboard/pages/HomeDashboard';
import { KYCWorkspace } from './features/kyc/pages/KYCWorkspace';
import { KYCAdmin } from './features/kyc/pages/KYCAdmin';
import { CoachingPage } from './features/coaching/pages/CoachingPage';
import { EventsPage } from './features/events/pages/EventsPage';
import { SubscriptionsPage } from './features/subscriptions/pages/SubscriptionsPage';
import { AdminDashboard } from './features/administration/pages/AdminDashboard';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/app') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isAuth = location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/check-email' || 
    location.pathname === '/verify-email' || 
    location.pathname === '/auth' ||
    location.pathname === '/password-reset' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';

  if (isDashboard || isOnboarding || isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { ToastContainer } from './components/common/ToastContainer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { OfflineScreen } from './components/common/OfflineScreen';

function App() {
  return (
    <Router>
      <OfflineBanner />
      <OfflineScreen />
      <ToastContainer />
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/matchmaking" element={<Matchmaking />} />
          <Route path="/coaching" element={<CoachingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth" element={<VerifyEmail />} />
          <Route path="/password-reset" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/onboarding" element={<OnboardingPage />} />
             
             <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<HomeDashboard />} />
                <Route path="matches" element={<MatchEngine />} />
                <Route path="profile" element={<ProfileEdit />} />
                <Route path="messages" element={<ChatSpace />} />
                <Route path="academy" element={<AcademyDashboard />} />
                <Route path="coaching" element={<CoachingPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="kyc" element={<KYCWorkspace />} />
             </Route>
             
             {/* Admin routes */}
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
             <Route path="/admin/kyc" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
