import { useState, useEffect } from "react";
import Map from "./Map";
import polyline from "@mapbox/polyline";

const API_HOST = process.env.REACT_APP_API_HOST;

export const checkToken = async () => {
  try {
    const response = await fetch(`${API_HOST}/check-token`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return Boolean(data.is_valid);
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};

export const fetchRoutes = async () => {
  try {
    const response = await fetch(`${API_HOST}/routes`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
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
        const routesData = await fetchRoutes();
        setRoutes(routesData);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = (event) => {
    console.log(API_HOST)
    // window.location.href = `${API_HOST}/login`;
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchRoutesData = async () => {
        const routesData = await fetchRoutes();
        setRoutes(routesData);
      };
      fetchRoutesData();
    }
  }, [isLoggedIn]);

  return (
    <>
      <div style={{ minHeight: 800, marginTop: 30 }}>
        <h1>login page</h1>
        <div style={{ marginTop: 30 }}>
          {isLoggedIn ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "20px" }}>
              {routes.map((route) => (
                <div key={route.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                  <h3>{route.name}</h3>
                  <Map geoData={polyline.toGeoJSON(route.map.summary_polyline)} />
                </div>
              ))}
            </div>
          ) : (
            <button onClick={handleLogin}>Login with Strava</button>
          )}
        </div>
      </div>
    </>
  );
}
