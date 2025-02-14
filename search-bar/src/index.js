import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchBar from './SearchBar';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SearchBar />
  </React.StrictMode>
);

export { SearchBar as default }; 