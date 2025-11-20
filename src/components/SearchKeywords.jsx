// src/components/SearchKeywords.jsx
import React from 'react';
import { keywordsData } from '../Data/keywordsData';

const SearchKeywords = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Popular Search Keywords</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keywordsData.map((keyword, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow-sm border">
            <span className="text-gray-700">{keyword}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchKeywords;