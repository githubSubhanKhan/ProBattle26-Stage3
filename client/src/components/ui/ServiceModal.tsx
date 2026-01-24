import React, { useState } from 'react';
import { X, Calendar, DollarSign, MapPin, User, CheckCircle } from 'lucide-react';
import { Service } from '../../config/types';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  showBookButton: boolean;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  showBookButton,
}) => {
  const [booked, setBooked] = useState(false);

  if (!service) return null;

  const handleBookService = () => {
    setBooked(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-lg mb-4">{service.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <InfoItem icon={<DollarSign size={20} />} label="Price" value={`$${service.price}/hour`} />
            <InfoItem icon={<User size={20} />} label="Provider" value={service.provider} />
            <InfoItem icon={<MapPin size={20} />} label="Location" value={service.location} />
            <InfoItem icon={<Calendar size={20} />} label="Availability" value={service.availability} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg mb-6" style={{ backgroundColor: '#F8FFE5' }}>
            <span className="font-semibold" style={{ color: '#FFA500' }}>
              Category: {service.category}
            </span>
            <span className="text-lg font-bold" style={{ color: '#FFD700' }}>
              ★ {service.rating}
            </span>
          </div>

          {/* SUCCESS MESSAGE */}
          {booked && (
            <div className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="text-green-600" size={28} />
              <div>
                <p className="font-semibold text-green-700">
                  Service Booked Successfully!
                </p>
                <p className="text-sm text-green-600">
                  Your booking request has been confirmed. The provider will contact you soon.
                </p>
              </div>
            </div>
          )}

          {/* BOOK BUTTON */}
          {showBookButton && !booked && (
            <button
              onClick={handleBookService}
              className="w-full py-3 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFA500' }}
            >
              Book Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* Small helper component */
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div style={{ color: '#FFA500' }}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);
