import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moviesData from '../../db/efreiflix-db.json';

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
    setSelectedMovie(movie);
  };

  return (
    <div className="p-4">
      {selectedMovie ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ProductDetails movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
        </React.Suspense>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Catalogue</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moviesData.movies.map((movie) => (
              <div key={movie.id} className="p-4 border rounded-lg bg-gray-100" onClick={() => handleMovieClick(movie)}>
                <img src={moviePosters[movie.id] || movie.posterUrl} alt={movie.title} className="w-full h-48 object-cover mb-2" />
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-700">{movie.year}</p>
                <p className="text-gray-500">{movie.description}</p>
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Watch Trailer</a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Catalogue; 