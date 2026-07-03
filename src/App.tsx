
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './features/landing/pages/Home';
import Academy from './features/academy/pages/AcademyLanding';
import Matchmaking from './features/matchmaking/pages/MatchmakingLanding';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
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

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/app') || location.pathname.startsWith('/dashboard');
  const isOnboarding = location.pathname.startsWith('/onboarding');

  if (isDashboard || isOnboarding) {
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

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/matchmaking" element={<Matchmaking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/onboarding" element={<OnboardingPage />} />
             
             <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<HomeDashboard />} />
                <Route path="matches" element={<MatchEngine />} />
                <Route path="profile" element={<ProfileEdit />} />
                <Route path="messages" element={<ChatSpace />} />
                <Route path="academy" element={<AcademyDashboard />} />
                <Route path="kyc" element={<KYCWorkspace />} />
             </Route>
             
             {/* Admin routes could be guarded by another layout later */}
             <Route path="/admin/kyc" element={<KYCAdmin />} />
          </Route>
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
