import React from 'react';
import './EngagementMetrics.css';

function EngagementMetrics({ shows }) {
  return (
    <div className="engagement-metrics">
      <h2>Engagement Metrics</h2>
      <table>
        <thead>
          <tr>
            <th>Show</th>
            <th>Likes</th>
            <th>Shares</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {shows.map(show => (
            <tr key={show.id}>
              <td>{show.name}</td>
              <td>{show.likes.toLocaleString()}</td>
              <td>{show.shares.toLocaleString()}</td>
              <td>{show.comments.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EngagementMetrics;
