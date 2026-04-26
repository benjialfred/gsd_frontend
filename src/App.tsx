import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Academy from './pages/Academy';
import Matchmaking from './pages/Matchmaking';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './router/ProtectedRoute';
import ProfileEdit from './pages/dashboard/ProfileEdit';
import MatchEngine from './pages/dashboard/MatchEngine';
import ChatSpace from './pages/dashboard/ChatSpace';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
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

          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<MatchEngine />} />
                <Route path="profile" element={<ProfileEdit />} />
                <Route path="chat" element={<ChatSpace />} />
                <Route path="academy" element={<div className="p-10"><h2 className="text-3xl font-serif font-bold text-[#082a5e]">E-Academy</h2><p className="text-gray-500 mt-2">Mon parcours d'apprentissage.</p></div>} />
             </Route>
          </Route>
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
