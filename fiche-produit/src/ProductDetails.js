import React from 'react';
import './ProductDetails.css';

const ProductDetails = ({ movie, onBack }) => {
  console.log('Movie data:', movie);
  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <img src={movie.posterUrl || "https://via.placeholder.com/300x450"} alt={movie.title} />
        <div className="product-details-content">
          <h1>Fiche Produit</h1>
          <h2>{movie.title}</h2>
          <p>Année: {movie.year}</p>
          <p>Genre: {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre}</p>
          <p>Note: {movie.rating} / 5</p>
          <p>Description: {movie.description}</p>
          {movie.trailerUrl && (
            <div className="product-details-trailer">
              <h3>Bande Annonce</h3>
              <iframe
                width="100%"
                height="315"
                src={movie.trailerUrl}
                title={`${movie.title} trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <button className="product-details-button" onClick={onBack}>
            Retour au Catalogue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;