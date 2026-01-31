import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 text-white px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-red-100">We're here to help you save lives</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about blood donation or need assistance? Our team is
                ready to help you make a difference.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">01533061141</p>
                    <p className="text-gray-500 text-sm">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@lifelink.org</p>
                    <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">123 Healthcare Avenue</p>
                    <p className="text-gray-600">Chittagong</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <div className="text-center">
                <Heart className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Emergency Blood Need?
                </h3>
                <p className="text-gray-700 mb-4">
                  If you need blood urgently, please call our 24/7 emergency hotline
                </p>
                <a
                  href="tel:01533061141"
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Call Emergency Line
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Who can donate blood?
                </h3>
                <p className="text-gray-600">
                  Most healthy adults aged 18-65 who weigh at least 110 pounds can donate
                  blood. Some restrictions may apply based on medical history.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How often can I donate?
                </h3>
                <p className="text-gray-600">
                  You can donate whole blood every 56 days (8 weeks). Other types of
                  donations may have different intervals.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is blood donation safe?
                </h3>
                <p className="text-gray-600">
                  Yes, blood donation is very safe. We use sterile, single-use equipment
                  for every donor. You cannot get an infection from donating blood.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
