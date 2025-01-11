import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrendingMovies = async () => {
  const response = await tmdbApi.get('/trending/movie/week');
  return response.data.results;
};

export const getRecommendedMovies = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}/recommendations`);
  return response.data.results;
};

export const searchMovies = async (query: string) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query },
  });
  return response.data.results;
}; 