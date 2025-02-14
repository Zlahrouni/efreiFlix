import React from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './SearchBar';

const SearchBarComponent = () => {
  return (
    <div>
      <h1>Recherche</h1>
      <input type="text" placeholder="Tapez votre recherche ici..." />
    </div>
  );
};

ReactDOM.render(<SearchBarComponent />, document.getElementById('root'));

export default SearchBar; 