import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { searchMovies } from '../../services/tmdb';
import { getUserRatings, addRating, updateRating, deleteRating } from '../../services/ratings';

interface Movie {
  id: number;
  _id?: string;
  movieId: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  userRating?: number;
}

export function Rated() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [editingRating, setEditingRating] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (user) {
      loadRatedMovies();
    }
  }, [user]);

  const loadRatedMovies = async () => {
    try {
      const ratings = await getUserRatings(user?.id || '');
      console.log('Loaded ratings:', ratings);
      setRatedMovies(ratings);
    } catch (error) {
      console.error('Error loading rated movies:', error);
    }
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update handleRating to just store the selected rating
  const handleRatingChange = (movieId: number, rating: number) => {
    setSelectedRating(prev => ({
      ...prev,
      [movieId]: rating
    }));
  };

  // New function to handle submission
  const handleSubmitRating = async (movie: Movie) => {
    if (!user || !selectedRating[movie.id]) return;
    
    try {
      setError(null);
      await addRating(
        user.id,
        movie.id,
        selectedRating[movie.id],
        movie.title,
        movie.poster_path,
        movie.overview
      );
      await loadRatedMovies();
      setSearchResults([]);
      setSearchQuery('');
      setSelectedRating({});
    } catch (error: any) {
      setError(error.message || 'Failed to add rating');
      console.error('Error rating movie:', error);
    }
  };

  const handleUpdateRating = async (movieId: number) => {
    if (!user || !editingRating[movieId]) return;
    
    try {
      setError(null);
      await updateRating(user.id, movieId, editingRating[movieId]);
      await loadRatedMovies();
      setEditingRating(prev => {
        const next = { ...prev };
        delete next[movieId];
        return next;
      });
    } catch (error: any) {
      setError(error.message || 'Failed to update rating');
    }
  };

  const handleDeleteRating = async (movieId: number) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        setError(null);
        console.log('Deleting movie with ID:', movieId);
        await deleteRating(user.id, movieId);
        const updatedRatings = await getUserRatings(user?.id || '');
        console.log('Updated ratings:', updatedRatings);
        setRatedMovies(updatedRatings);
      } catch (error: any) {
        setError(error.message || 'Failed to delete rating');
      }
    }
  };

  return (
    <div className="rated-page">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {/* Search Section */}
      <div className="search-section">
        <h2>Search Movies to Rate</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="search-input"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        <div className="search-results">
          {searchResults.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <div className="rating-controls">
                {ratedMovies.some(m => m.id === movie.id) ? (
                  <div className="already-rated">
                    You've already rated this movie
                  </div>
                ) : (
                  <>
                    <select
                      onChange={(e) => handleRatingChange(movie.id, Number(e.target.value))}
                      value={selectedRating[movie.id] || ''}
                      className="rating-select"
                    >
                      <option value="" disabled>Rate this movie</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Star{num !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSubmitRating(movie)}
                      disabled={!selectedRating[movie.id]}
                      className="submit-rating"
                    >
                      Submit Rating
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rated Movies Section */}
      <div className="rated-movies-section">
        <h2>Your Rated Movies</h2>
        <div className="movies-grid">
          {ratedMovies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <div className="rating-controls">
                <select
                  value={editingRating[movie._id || ''] || movie.userRating || ''}
                  onChange={(e) => setEditingRating(prev => ({
                    ...prev,
                    [movie._id || '']: Number(e.target.value)
                  }))}
                  className="rating-select"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                {editingRating[movie._id || ''] !== undefined && 
                  editingRating[movie._id || ''] !== movie.userRating && (
                  <button
                    onClick={() => handleUpdateRating(movie.id)}
                    className="submit-rating"
                  >
                    Update Rating
                  </button>
                )}
                <button
                  onClick={() => handleDeleteRating(movie.movieId)}
                  className="delete-rating"
                >
                  Delete Rating
                </button>
              </div>
              <p>{movie.overview?.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}