import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface ProviderSearchBarProps {
  onSearch: (searchTerm: string) => void;
  onAddService: () => void;
}

export const ProviderSearchBar: React.FC<ProviderSearchBarProps> = ({ onSearch, onAddService }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for services..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
          style={{ borderColor: '#FFA500' }}
        />
      </div>
      <button
        onClick={onAddService}
        className="px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#FFA500' }}
      >
        <Plus size={20} />
        Add Service
      </button>
    </div>
  );
};