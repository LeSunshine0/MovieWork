import { useState, useEffect } from 'react';
import { getTrendingMovies, getRecommendedMovies } from '../../services/tmdb';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

export function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const trendingMovies = await getTrendingMovies();
        const randomMovie = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
        const recommendations = await getRecommendedMovies(randomMovie.id);
        const selected = recommendations.slice(0, 3);
        setMovies(selected);
      } catch (error) {
        console.error('Error fetching recommended movies:', error);
        setError('Unable to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <div className="dashboard">
      <SignedIn>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="recommended-header">
              <h2>🎬 Recommended For You</h2>
              <p className="recommended-subtext">Movies we think you'll love</p>
            </div>
            <div className="movies-grid">
              {movies.map((movie: any) => (
                <div key={movie.id} className="movie-card">
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                  <h3>{movie.title}</h3>
                  <p>{movie.overview?.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </>
        )}
      </SignedIn>
      
      <SignedOut>
        <div className="welcome-container">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Welcome to MovieWork</h1>
              <p>Rate, track, and discover your next favorite movies</p>
            </div>
            <div className="auth-container">
              <div className="auth-buttons">
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}