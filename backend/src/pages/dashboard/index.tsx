import { useState, useEffect } from 'react';
import { getRecommendedMovies } from '../../services/tmdb';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

export function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        // Using a popular movie ID (e.g., The Dark Knight) to get initial recommendations
        const data = await getRecommendedMovies(155);
        setMovies(data);
      } catch (error) {
        console.error('Error fetching recommended movies:', error);
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
        ) : (
          <>
            <h2>Recommended For You</h2>
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
          </>
        )}
      </SignedIn>
      
      <SignedOut>
        <div className="welcome-text">
          <h1>Welcome to MovieWork</h1>
          <p>Please sign in to continue</p>
        </div>
        <div className="auth-container">
          <div className="auth-buttons">
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}