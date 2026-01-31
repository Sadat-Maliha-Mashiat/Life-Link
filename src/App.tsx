import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import FindBlood from './components/FindBlood';
import Contact from './components/Contact';
import ForgotPassword from './components/ForgotPassword';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'login':
        return (
          <Login
            onSuccess={() => setCurrentPage('dashboard')}
            onSwitchToSignUp={() => setCurrentPage('signup')}
            onSwitchToForgotPassword={() => setCurrentPage('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignUp
            onSuccess={() => setCurrentPage('dashboard')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        );
      case 'forgot-password':
        return <ForgotPassword onBack={() => setCurrentPage('login')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'find':
        return <FindBlood />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;
