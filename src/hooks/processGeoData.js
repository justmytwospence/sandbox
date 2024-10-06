import { distance as turfDistance, point as turfPoint } from '@turf/turf';

const processGeoData = (geoData, windowSize = 3) => {
  if (!geoData || !geoData.features || geoData.features.length === 0) {
    return null;
  }

  const enrichedData = geoData.features.flatMap((feature) => {
    const coordinates = feature.geometry.coordinates;
    const enrichedCoordinates = [];
    let cumulativeDistance = 0;

    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1, ele1] = coordinates[i - 1];
      const [lon2, lat2, ele2] = coordinates[i];

      const from = turfPoint([lon1, lat1]);
      const to = turfPoint([lon2, lat2]);
      const distance = turfDistance(from, to, { units: 'meters' });
      const elevationChangeFeet = ele2 - ele1;
      const elevationChangeMeters = elevationChangeFeet * 0.3048; // Convert feet to meters
      const gradient = elevationChangeMeters / distance;

      cumulativeDistance += distance;
      enrichedCoordinates.push({
        lon: lon2,
        lat: lat2,
        ele: ele2,
        distance,
        cumulativeDistance,
        elevationChange: elevationChangeFeet,
        gradient,
      });
    }

    return enrichedCoordinates;
  });

  // Apply smoothing
  const smooth = (data, key) => {
    return data.map((point, index, array) => {
      const start = Math.max(0, index - windowSize + 1);
      const end = index + 1;
      const subset = array.slice(start, end);
      const sum = subset.reduce((acc, item) => acc + item[key], 0);
      return {
        ...point,
        [key]: sum / subset.length,
      };
    });
  };

  return smooth(enrichedData, 'gradient');
};

export default processGeoData;