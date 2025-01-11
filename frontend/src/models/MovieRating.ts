import mongoose, { Schema } from 'mongoose';

interface IMovieRating {
  userId: string;
  movieId: number;
  rating: number;
  createdAt: Date;
}

const movieRatingSchema = new Schema<IMovieRating>({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

movieRatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const MovieRating = mongoose.model<IMovieRating>('MovieRating', movieRatingSchema); 