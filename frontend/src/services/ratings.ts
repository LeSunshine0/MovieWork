const API_URL = 'http://localhost:5001/api';

export const addRating = async (
  userId: string, 
  movieId: number, 
  rating: number,
  movieTitle: string,
  poster_path: string,
  overview: string
) => {
  try {
    const response = await fetch(`${API_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        movieId,
        rating,
        movieTitle,
        poster_path,
        overview
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to add rating');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

export const getUserRatings = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/ratings/${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch ratings');
    }

    const ratings = await response.json();
    return ratings.map((rating: any) => ({
      ...rating,
      userRating: rating.rating // Map the rating field to userRating
    }));
  } catch (error: any) {
    console.error('Error getting user ratings:', error);
    throw error;
  }
};

export const updateRating = async (userId: string, movieId: number, rating: number) => {
  try {
    const response = await fetch(`${API_URL}/ratings/${userId}/${movieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to update rating');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

export const deleteRating = async (userId: string, movieId: number) => {
  try {
    const response = await fetch(`${API_URL}/ratings/${userId}/${movieId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to delete rating');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error deleting rating:', error);
    throw error;
  }
}; 