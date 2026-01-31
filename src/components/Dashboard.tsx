import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Donor } from '../lib/supabase';
import { Heart, MapPin, Phone, Droplet, Calendar, Edit2, Check, X, Trash2, Plus } from 'lucide-react';
import { deleteUserAccount, createUserProfile } from '../lib/auth';

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    availability: false,
    last_donation_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    blood_group: '',
    location: '',
  });

  useEffect(() => {
    fetchDonorData();
  }, [profile]);

  const fetchDonorData = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) throw error;

      setDonor(data);
      setFormData({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        availability: data?.availability ?? false,
        last_donation_date: data?.last_donation_date || '',
      });
    } catch (err) {
      console.error('Error fetching donor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !donor) return;

    setSaving(true);
    setMessage('');

    try {
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
        })
        .eq('id', profile.id);

      if (userError) throw userError;

      const { error: donorError } = await supabase
        .from('donors')
        .update({
          availability: formData.availability,
          last_donation_date: formData.last_donation_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', donor.id);

      if (donorError) throw donorError;

      await refreshProfile();
      await fetchDonorData();
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    if (!donor) return;

    try {
      const newAvailability = !donor.availability;
      const { error } = await supabase
        .from('donors')
        .update({
          availability: newAvailability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', donor.id);

      if (error) throw error;

      await fetchDonorData();
      setMessage(newAvailability ? 'You are now available for donation!' : 'Availability updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update availability');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setMessage('');

    try {
      await deleteUserAccount();
      setMessage('Account deleted successfully');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProfile(true);
    setMessage('');

    try {
      await createUserProfile(profileFormData);
      await refreshProfile();
      await fetchDonorData();
      setMessage('Profile created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create profile');
    } finally {
      setCreatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center animate-pulse">
          <div className="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  if (!profile || !donor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-slide-up">
          <div className="bg-red-600 text-white px-6 py-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Donor Profile</h1>
            <p className="text-red-100">Fill in your blood donation information to get started</p>
          </div>

          <div className="p-6">
            {message && (
              <div className={`mb-6 px-4 py-3 rounded-lg animate-slide-up ${
                message.includes('success')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleCreateProfile} className="max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileFormData.phone}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={profileFormData.blood_group}
                    onChange={(e) => setProfileFormData({ ...profileFormData, blood_group: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileFormData.location}
                    onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingProfile}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold mt-6 shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  {creatingProfile ? 'Creating Profile...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-slide-up">
        <div className="bg-red-600 text-white px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-red-100">Manage your donor profile</p>
        </div>

        <div className="p-6">
          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg animate-slide-up ${
              message.includes('success') || message.includes('available')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 disabled:bg-gray-400 shadow-md hover:shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile.name,
                      phone: profile.phone,
                      location: profile.location,
                      availability: donor?.availability ?? false,
                      last_donation_date: donor?.last_donation_date || '',
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-600" />
                  <p className="text-gray-900 font-bold text-lg">{profile.blood_group}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                )}
              </div>

              {editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Donation Date</label>
                  <input
                    type="date"
                    value={formData.last_donation_date}
                    onChange={(e) => setFormData({ ...formData, last_donation_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {!editing && donor?.last_donation_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Donation</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{new Date(donor.last_donation_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!editing && (
            <>
              <div className="border-t pt-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Donation Availability</h3>
                    <p className="text-gray-600 text-sm">
                      Let others know if you're currently available to donate blood
                    </p>
                  </div>
                  <button
                    onClick={toggleAvailability}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      donor?.availability
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      {donor?.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Danger Zone</h3>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account and All Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Account?</h2>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your profile data, donor information, and account will be permanently deleted.
            </p>
            <p className="text-gray-700 font-medium mb-4">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Enter DELETE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
