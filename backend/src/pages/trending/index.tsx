import { useState, useEffect } from 'react';
import { getTrendingMovies } from '../../services/tmdb';

export function Trending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="movies-grid">
      {movies.map((movie: any) => (
        <div key={movie.id} className="movie-card">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
          />
          <h3>{movie.title}</h3>
          <p>{movie.overview.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
} 