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
    const movieWithPoster = {
      ...movie,
      posterUrl: moviePosters[movie.id] || movie.posterUrl,
    };
    setSelectedMovie(movieWithPoster);
  };

  return (
    <div className="bg-black text-white p-4">
      {selectedMovie ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ProductDetails movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
        </React.Suspense>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold mb-6">Catalogue</h1>
          <div className="flex overflow-x-scroll space-x-4">
            {moviesData.movies.map((movie) => (
              <div key={movie.id} className="flex-none w-64 p-2 border rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-300" onClick={() => handleMovieClick(movie)}>
                <img src={moviePosters[movie.id] || movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover mb-2" />
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-gray-400">{movie.year}</p>
                <p className="text-gray-500">{movie.description}</p>
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Watch Trailer</a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Catalogue; 