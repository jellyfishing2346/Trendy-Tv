import React from 'react';
import './TrendingShows.css';

function TrendingShows({ shows }) {
  return (
    <div className="trending-shows">
      <h2>Trending Shows</h2>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            {show.name} - Popularity: {show.popularity.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrendingShows;
