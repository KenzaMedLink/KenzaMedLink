// src/admin/components/CompliancePanel.jsx
import React from "react";

const CompliancePanel = ({ alerts }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-semibold mb-4">Compliance Alerts</h2>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-sm ${
              alert.type === "danger"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompliancePanel;