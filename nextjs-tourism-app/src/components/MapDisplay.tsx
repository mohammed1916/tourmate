import React from "react";

const MapDisplay: React.FC<{ lat: number; lng: number; markers?: { lat: number; lng: number; label?: string }[] }>
  = ({ lat, lng, markers = [] }) => {
  // TODO: Replace with Google Maps JS API or @react-google-maps/api
  return (
    <div style={{ width: "100%", height: 400, background: "#eee", borderRadius: 8, margin: "1rem 0" }}>
      <p style={{ textAlign: "center", paddingTop: 180 }}>
        [Map Placeholder: lat {lat}, lng {lng}]
      </p>
    </div>
  );
};

export default MapDisplay;
