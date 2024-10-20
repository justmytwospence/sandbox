import { useState, useEffect } from "react";
import Map from "./Map";
import polyline from "@mapbox/polyline";

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:8000/activities", {
        method: "GET",
        credentials: "include",
      });
      const activities = await response.json();
      setActivities(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  return (
    <>
      <div style={{ minHeight: 800, marginTop: 30 }}>
        <h1>Activities</h1>
        <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "20px" }}>
          {activities.filter(activity => activity.map.summary_polyline != "").map((activity) => (
            <div key={activity.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <h3>{activity.name}</h3>
              <Map geoData={polyline.toGeoJSON(activity.map.summary_polyline)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Activities;