import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GeoJSONLayer = ({ geoData, onHover }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData) {
      const geoJsonLayer = L.geoJSON(geoData, {
        onEachFeature: (feature, layer) => {
          layer.on('mousemove', (e) => {
            const latlng = e.latlng;
            const featureIndex = geoData.features.indexOf(feature);
            onHover({ latlng, featureIndex });
          });
        },
      });
      geoJsonLayer.addTo(map);

      // Fit bounds only when geoData changes
      map.fitBounds(geoJsonLayer.getBounds());

      // Clean up the layer when the component unmounts or geoData changes
      return () => {
        map.removeLayer(geoJsonLayer);
      };
    }
  }, [geoData, map, onHover]);

  return null;
};

const Map = ({ geoData, onHover }) => {
  return (
    <MapContainer style={{ height: '400px', width: '100%' }} center={[51.505, -0.09]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {geoData && <GeoJSONLayer geoData={geoData} onHover={onHover} />}
    </MapContainer>
  );
};

export default Map;