// src/admin/components/ActivityFeed.jsx
import React from "react";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <ul className="space-y-3 text-sm">
        {activities.map((activity, index) => (
          <li key={index} className="border-b pb-2">
            <p className="font-medium">{activity.action}</p>
            <p className="text-gray-500 text-xs">{activity.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;