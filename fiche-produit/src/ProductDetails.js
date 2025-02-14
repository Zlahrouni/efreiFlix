import React from 'react';

const ProductDetails = ({ movie, onBack }) => {
  return (
    <div>
      <h1>Fiche Produit</h1>
      <img src={movie.posterUrl || "https://via.placeholder.com/150"} alt={movie.title} />
      <div>
        <h2>Titre: {movie.title}</h2>
        <p>Année: {movie.year}</p>
        <p>Genre: {movie.genre}</p>
        <button onClick={onBack}>Back to Catalogue</button>
      </div>
    </div>
  );
};

export default ProductDetails; 