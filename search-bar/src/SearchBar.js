import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <h1 className="search-bar-title">Recherche</h1>
      <input className="search-bar-input" type="text" placeholder="Tapez votre recherche ici..." />
    </div>
  );
};

export default SearchBar; 