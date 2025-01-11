import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Add better error handling for MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit if cannot connect to database
  });

// Create a more detailed Rating schema
const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true },
  movieTitle: { type: String, required: true },
  poster_path: { type: String, required: true },
  overview: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create a compound index for unique ratings per user and movie
ratingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

// Enhanced error handling for routes
app.post('/api/ratings', async (req, res) => {
  try {
    const { userId, movieId, rating, movieTitle, poster_path, overview } = req.body;
    console.log('Received movie data:', { poster_path });
    
    // Check if rating already exists
    const existingRating = await Rating.findOne({ userId, movieId });
    if (existingRating) {
      return res.status(400).json({
        error: 'Duplicate rating',
        details: 'You have already rated this movie'
      });
    }
    
    const newRating = await Rating.create({
      userId,
      movieId,
      rating,
      movieTitle,
      poster_path,
      overview
    });
    
    res.status(200).json(newRating);
  } catch (error: any) {
    console.error('Error saving rating:', error);
    res.status(500).json({ 
      error: 'Error saving rating',
      details: error.message 
    });
  }
});

app.get('/api/ratings/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(ratings);
  } catch (error: any) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ 
      error: 'Error fetching ratings',
      details: error.message 
    });
  }
});

app.put('/api/ratings/:userId/:movieId', async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    const { rating } = req.body;
    
    const updatedRating = await Rating.findOneAndUpdate(
      { userId, movieId: Number(movieId) },
      { rating },
      { new: true }
    );
    
    if (!updatedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    res.status(200).json(updatedRating);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Error updating rating',
      details: error.message 
    });
  }
});

app.delete('/api/ratings/:userId/:movieId', async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    console.log('Deleting rating:', { userId, movieId });
    
    const deletedRating = await Rating.findOneAndDelete({
      userId,
      movieId: parseInt(movieId, 10)
    });
    
    if (!deletedRating) {
      console.log('Rating not found');
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    console.log('Rating deleted:', deletedRating);
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Error deleting rating',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 