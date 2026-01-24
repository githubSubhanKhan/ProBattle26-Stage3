import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SeekerSearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SeekerSearchBar: React.FC<SeekerSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="relative">
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
    </div>
  );
};