import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moviesData from '../../db/efreiflix-db.json';
import './Catalogue.css';

// Import the ProductDetails component from the fiche-produit MFE
const ProductDetails = React.lazy(() => import('ficheProduit/ProductDetails'));

const Catalogue = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [moviePosters, setMoviePosters] = useState({});

  useEffect(() => {
    const fetchPosters = async () => {
      const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';
      const promises = moviesData.movies.map(async (movie) => {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie.title}`);
        const posterPath = response.data.results[0]?.poster_path;
        return { id: movie.id, posterUrl: `http://image.tmdb.org/t/p/w500/${posterPath}` };
      });

      const posters = await Promise.all(promises);
      const postersMap = posters.reduce((acc, { id, posterUrl }) => {
        acc[id] = posterUrl;
        return acc;
      }, {});

      setMoviePosters(postersMap);
    };

    fetchPosters();
  }, []);

  const handleMovieClick = (movie) => {
    const movieWithPoster = {
      ...movie,
      posterUrl: moviePosters[movie.id] || movie.posterUrl,
    };
    setSelectedMovie(movieWithPoster);
  };

  return (
    <div className="catalogue-container">
      {selectedMovie ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ProductDetails movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
        </React.Suspense>
      ) : (
        <>
          <h1 className="catalogue-title">Films populaires</h1>
          <div className="movies-row">
            {moviesData.movies.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
                <img 
                  src={moviePosters[movie.id] || movie.posterUrl} 
                  alt={movie.title} 
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h2 className="movie-title">{movie.title}</h2>
                  <p className="movie-year">{movie.year}</p>
                  <p className="movie-description">{movie.description}</p>
                  <a 
                    href={movie.trailerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="trailer-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Watch Trailer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Catalogue; 