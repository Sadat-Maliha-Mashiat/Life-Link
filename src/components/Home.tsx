import { Heart, Droplet, Users, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Droplet className="w-20 h-20 mx-auto mb-6 animate-scale-in" />
          <h1 className="text-5xl font-bold mb-4 animate-slide-up">Life Link</h1>
          <p className="text-2xl text-red-100 mb-8 animate-slide-up">Connecting Lives Through Blood</p>
          <p className="text-lg text-red-50 max-w-2xl mx-auto mb-8 animate-slide-up">
            Every donation can save up to three lives. Join our community of blood donors
            and make a difference today.
          </p>
          <div className="flex gap-4 justify-center animate-slide-up">
            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Become a Donor
                </button>
                <button
                  onClick={() => onNavigate('find')}
                  className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-800 hover:scale-105 transition-all duration-200 border-2 border-white shadow-lg hover:shadow-xl"
                >
                  Find Blood
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('find')}
                className="px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Find Blood Donors
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center animate-slide-up hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-200 transition-colors">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join Community</h3>
            <p className="text-gray-600">
              Register as a donor and become part of a life-saving network
            </p>
          </div>

          <div className="text-center animate-slide-up hover:transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-200 transition-colors">
              <Search className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Donors</h3>
            <p className="text-gray-600">
              Search for blood donors by blood group and location
            </p>
          </div>

          <div className="text-center animate-slide-up hover:transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-200 transition-colors">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Save Lives</h3>
            <p className="text-gray-600">
              Connect with those in need and make a life-saving difference
            </p>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-8 animate-slide-up hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Why Donate Blood?</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>One donation can save up to three lives</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>Blood cannot be manufactured and can only come from donors</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>Someone needs blood every two seconds</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">•</span>
              <span>Donation takes only 10-15 minutes and is safe and easy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
