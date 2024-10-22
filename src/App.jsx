import React, { useState, useEffect } from 'react';
import './App.css';
import './components/TrendingShows.css'
import './components/SentimentAnalysis.css'
import './components/EngagementMetrics.css'

// Use environment variable for API key
const API_KEY = import.meta.env.VITE_APPLE_API_KEY;
console.log('API Key:', API_KEY); // Log the API key to verify it's being read correctly

function App() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (API_KEY) {
      fetchShows();
      fetchGenres();
    } else {
      setError('API key is missing. Please check your environment variables.');
      setIsLoading(false);
    }
  }, [API_KEY]);

  const fetchShows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;
      console.log('Fetching shows from URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`API error: ${errorData.status_message}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.results && Array.isArray(data.results)) {
        setShows(data.results);
      } else {
        console.error('API did not return an array of results:', data);
        setShows([]);
      }
    } catch (error) {
      console.error('Error fetching show data:', error.message);
      setError('Failed to fetch shows. Please try again later.');
      setShows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`;
      console.log('Fetching genres from URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`API error: ${errorData.status_message}`);
      }
      
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error.message);
      setError('Failed to fetch genres. Please try again later.');
    }
  };

  const filteredShows = Array.isArray(shows) ? shows.filter(show => 
    show.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (genreFilter === '' || show.genre_ids.includes(parseInt(genreFilter))) &&
    (minRating === '' || show.vote_average >= parseFloat(minRating)) &&
    (maxRating === '' || show.vote_average <= parseFloat(maxRating))
  ) : [];

  const averageRating = Array.isArray(shows) && shows.length > 0
    ? shows.reduce((sum, show) => sum + show.vote_average, 0) / shows.length
    : 0;
  const totalShows = Array.isArray(shows) ? shows.length : 0;
  const uniqueGenres = Array.isArray(shows) && shows.length > 0
    ? [...new Set(shows.flatMap(show => show.genre_ids))].length
    : 0;

  return (
    <div className="App">
      <h1>TV Show Dashboard</h1>

      <div className="statistics">
        <h2>Statistics</h2>
        <p>Total Shows: {totalShows}</p>
        <p>Average Rating: {averageRating.toFixed(2)}</p>
        <p>Unique Genres: {uniqueGenres}</p>
      </div>

      <div className="filters">
        <input 
          type="text" 
          placeholder="Search shows..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={genreFilter} 
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <div>
          <input 
            type="number" 
            placeholder="Min Rating" 
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            min="0" 
            max="10" 
            step="0.1"
          />
          <input 
            type="number" 
            placeholder="Max Rating" 
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            min="0" 
            max="10" 
            step="0.1"
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="show-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredShows.length > 0 ? (
          filteredShows.map(show => (
            <div key={show.id} className="show-card">
              <h3>{show.name}</h3>
              <p>First Air Date: {show.first_air_date}</p>
              <p>Popularity: {show.popularity}</p>
              <p>Vote Average: {show.vote_average}</p>
            </div>
          ))
        ) : (
          <p>No shows available</p>
        )}
      </div>
    </div>
  );
}

export default App;
