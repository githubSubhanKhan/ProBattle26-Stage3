import React from 'react';
import { User, MapPin } from 'lucide-react';
import { Service } from '../../config/types';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow"
      style={{ borderTop: '4px solid #FFA500' }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
        <span className="text-lg font-bold" style={{ color: '#FFA500' }}>
          ${service.price}/hr
        </span>
      </div>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <div className="flex items-center gap-2 mb-2">
        <User size={16} className="text-gray-500" />
        <span className="text-sm text-gray-700">{service.provider}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={16} className="text-gray-500" />
        <span className="text-sm text-gray-700">{service.location}</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#F8FFE5', color: '#FFA500' }}>
          {service.category}
        </span>
        <span className="text-sm font-semibold" style={{ color: '#FFD700' }}>
          ★ {service.rating}
        </span>
      </div>
    </div>
  );
};