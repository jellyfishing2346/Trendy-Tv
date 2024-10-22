import React from 'react';
import './SentimentAnalysis.css';

function SentimentAnalysis({ shows }) {
  return (
    <div className="sentiment-analysis">
      <h2>Sentiment Analysis</h2>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            {show.name} - Sentiment: {show.sentiment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SentimentAnalysis;

