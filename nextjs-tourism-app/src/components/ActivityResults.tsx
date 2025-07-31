import React from "react";

export interface Activity {
  id: string;
  name: string;
  description?: string;
  location?: string;
}

const ActivityResults: React.FC<{ activities: Activity[] }> = ({ activities }) => (
  <div>
    <h2>Activities</h2>
    <ul>
      {activities.map(activity => (
        <li key={activity.id}>
          <strong>{activity.name}</strong> <br />
          {activity.location && <span>{activity.location}</span>} <br />
          {activity.description && <span>{activity.description}</span>}
        </li>
      ))}
    </ul>
  </div>
);

export default ActivityResults;
