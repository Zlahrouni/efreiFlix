import React from 'react';
import './ProductDetails.css'; // Ensure this line is present

const ProductDetails = ({ movie, onBack }) => {
  console.log('Movie data:', movie);
  return (
    <div className="container">
      <img src={movie.posterUrl || "https://via.placeholder.com/150"} alt={movie.title} />
      <div className="details">
        <h1>Fiche Produit</h1>
        <h2>Titre: {movie.title}</h2>
        <p>Année: {movie.year}</p>
        <p>Genre: {movie.genre}</p>
        <button onClick={onBack}>Back to Catalogue</button>
      </div>
    </div>
  );
};

export default ProductDetails;