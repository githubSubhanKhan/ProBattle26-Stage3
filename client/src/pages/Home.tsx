import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FFE5' }}>
      <div className="max-w-4xl mx-auto text-center px-8">
        <h1 className="text-6xl font-bold mb-6" style={{ color: '#FFA500' }}>
          Welcome to ServiceHub
        </h1>
        <p className="text-xl text-gray-700 mb-12">
          Connect with service providers or offer your services to customers
        </p>
        
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate('/seeker')}
            className="px-8 py-4 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            style={{ backgroundColor: '#FFA500' }}
          >
            Find Services
          </button>
          <button
            onClick={() => navigate('/provider')}
            className="px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg bg-white"
            style={{ color: '#FFA500' }}
          >
            Offer Services
          </button>
        </div>
      </div>
    </div>
  );
};