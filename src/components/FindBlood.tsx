import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { DonorWithUser } from '../lib/supabase';
import { Search, MapPin, Phone, Droplet, Heart, User } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function FindBlood() {
  const { user } = useAuth();
  const [donors, setDonors] = useState<DonorWithUser[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<DonorWithUser[]>([]);
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [bloodGroup, location, donors]);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select(`
          *,
          users:user_id (*)
        `);

      if (error) throw error;

      setDonors(data || []);
      setFilteredDonors(data || []);
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    if (bloodGroup) {
      filtered = filtered.filter((d) => d.users.blood_group === bloodGroup);
    }

    if (location) {
      filtered = filtered.filter((d) =>
        d.users.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredDonors(filtered);
  };

  const handleContactClick = (donorId: string) => {
    if (user) {
      setSelectedDonor(selectedDonor === donorId ? null : donorId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center animate-pulse">
          <div className="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Blood Donors</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city or area"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={filterDonors}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Found <span className="font-bold text-red-600">{filteredDonors.length}</span> donors
        </div>
      </div>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 animate-slide-up">
          <p className="font-medium">Please login to view donor contact information</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor, index) => (
          <div
            key={donor.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={`h-2 ${donor.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{donor.users.name}</h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        donor.availability
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {donor.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Droplet className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-lg">{donor.users.blood_group}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{donor.users.location}</span>
                </div>

                {user && selectedDonor === donor.id && (
                  <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg animate-slide-up">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{donor.users.phone}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleContactClick(donor.id)}
                disabled={!user}
                className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  user
                    ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Heart className="w-4 h-4" />
                {selectedDonor === donor.id ? 'Hide Contact' : 'Contact Donor'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No donors found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
}
