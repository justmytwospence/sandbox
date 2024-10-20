import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import Map from "./Map";

export const checkToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/check-token", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return Boolean(data.valid);
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const tokenValid = await checkToken();
      setIsLoggedIn(tokenValid);
      if (tokenValid) {
        fetchRoutes();
      }
    };
    checkLoginStatus();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:8000/routes", {
        method: "GET",
        credentials: "include",
      });
      const routes = await response.json();
      setRoutes(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleLogin = (event) => {
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <>
      <div style={{ minHeight: 800, marginTop: 30 }}>
        <h1>login page</h1>
        <div style={{ marginTop: 30 }}>
          {isLoggedIn ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "20px" }}>
                {routes.map((route) => (
                  <div key={route.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                    <h3>{route.name}</h3>
                    <Map geoData={polyline.toGeoJSON(route.map.summary_polyline)} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <button onClick={handleLogin}>Login with Strava</button>
          )}
        </div>
      </div>
    </>
  );
}
