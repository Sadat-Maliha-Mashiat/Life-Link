import { Droplet, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('home');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'find', label: 'Find Blood' },
    ...(user ? [{ id: 'dashboard', label: 'Dashboard' }] : []),
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <Droplet className="w-8 h-8" />
            <span className="text-xl font-bold">Life Link</span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-red-600 border-b-2 border-red-600 pb-1'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-gray-700 text-sm">
                  Hi, <span className="font-semibold">{profile?.name?.split(' ')[0] || 'User'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium ml-4"
              >
                Login
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-red-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-700 hover:bg-red-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <>
                  <div className="px-4 py-2 text-gray-600 text-sm border-t border-gray-200 mt-2 pt-4">
                    Hi, <span className="font-semibold">{profile?.name?.split(' ')[0] || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mx-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="mx-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
