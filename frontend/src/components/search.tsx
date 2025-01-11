import { useState } from 'react';
import { searchMovies } from '../services/tmdb';

interface SearchProps {
  onMovieSelect: (movie: any) => void;
}

export function SearchMovies({ onMovieSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const data = await searchMovies(query);
      setResults(data);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="search-input"
        />
        <button type="submit">Search</button>
      </form>
      
      <div className="search-results">
        {results.map((movie: any) => (
          <div key={movie.id} className="search-result-item" onClick={() => onMovieSelect(movie)}>
            <img 
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
              alt={movie.title}
            />
            <div>
              <h4>{movie.title}</h4>
              <p>{new Date(movie.release_date).getFullYear()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 