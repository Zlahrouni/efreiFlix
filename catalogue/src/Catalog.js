import React, { useEffect, useState } from 'react';
import './styles.css';
import { fetchData } from '../service/catalog';
import MovieCard from './components/MovieCard';
import './styles/index.css';

const Catalog = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        console.log(result);
        setData(result);
      } catch (e) {
        console.error('Failed to fetch data:', e);
      }
    };

    getData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const moviesByGenre = data.reduce((acc, movie) => {
    movie.genres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(movie);
    });
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(moviesByGenre).map(([genre, movies], index) => (
        <div
          key={genre}
          style={{
            zIndex: Object.entries(moviesByGenre).length - index,
          }}
        >
          <h2 className="text-xl font-bold mb-4">{genre}</h2>
          <div className="hide-scrollbar pl-2 -ml-2 pt-2 -mt-2 pb-28 -mb-28 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Catalog;
