import { useState, useEffect } from 'react';
import { getTrendingMovies } from '../../services/tmdb';

export function Rated() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // For now, we'll use trending movies as a placeholder
        // Later, you can implement actual rated movies functionality
        const data = await getTrendingMovies();
        setMovies(data.slice(0, 10)); // Show only first 10 movies
      } catch (error) {
        console.error('Error fetching rated movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Rated Movies</h2>
      <div className="movies-grid">
        {movies.map((movie: any) => (
          <div key={movie.id} className="movie-card">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
            />
            <h3>{movie.title}</h3>
            <div className="rating">★ {movie.vote_average.toFixed(1)}</div>
            <p>{movie.overview.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}