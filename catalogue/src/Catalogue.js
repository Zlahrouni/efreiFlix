import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moviesData from '../../db/efreiflix-db.json';
import './Catalogue.css';

// Import the ProductDetails component from the fiche-produit MFE
const ProductDetails = React.lazy(() => import('ficheProduit/ProductDetails'));

const Catalogue = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [moviePosters, setMoviePosters] = useState({});
  const rowRef = useRef(null);

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

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  );

  const ChevronRight = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  );

  return (
    <div className="catalogue-container">
      {selectedMovie ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ProductDetails movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
        </React.Suspense>
      ) : (
        <>
          <h1 className="catalogue-title">Films populaires</h1>
          <div className="movies-section">
            <button className="scroll-button left" onClick={() => scroll('left')} aria-label="Scroll left">
              <ChevronLeft />
            </button>
            <div className="movies-row" ref={rowRef}>
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
            <button className="scroll-button right" onClick={() => scroll('right')} aria-label="Scroll right">
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Catalogue; 