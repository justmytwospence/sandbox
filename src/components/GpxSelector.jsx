import React, { useState, useEffect } from 'react';
import { Paper, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import gpxManifest from '../data/gpxManifest.json';
import { gpx } from '@tmcw/togeojson';
import useProcessedGeoData from '../hooks/useProcessedGeoData';

const GpxSelector = ({ onGeoDataChange }) => {
  const [selectedFile, setSelectedFile] = useState('');
  const [rawGeoData, setRawGeoData] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      fetch(`/data/gpx/${selectedFile}`)
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');
          const geojson = gpx(xmlDoc);
          setRawGeoData(geojson);
        })
        .catch(error => console.error('Error fetching GPX file:', error));
    }
  }, [selectedFile]);

  const processedGeoData = useProcessedGeoData(rawGeoData);

  useEffect(() => {
    if (rawGeoData && processedGeoData) {
      const updatedGeoData = { raw: rawGeoData, processed: processedGeoData };
      onGeoDataChange(updatedGeoData); // Pass the data to the parent component
    }
  }, [rawGeoData, processedGeoData, onGeoDataChange]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  return (
    <div style={{ padding: 20 }}>
      <FormControl fullWidth>
        <InputLabel id="gpx-selector-label">Select File</InputLabel>
        <Select
          labelId="gpx-selector-label"
          value={selectedFile}
          onChange={handleFileChange}
          label="Select File"
        >
          {gpxManifest.map((file) => (
            <MenuItem key={file} value={file}>
              {file}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {processedGeoData && (
        <Paper style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h6">Statistics</Typography>
          <Typography variant="body1">
            Processed GeoData: {JSON.stringify(processedGeoData)}
          </Typography>
        </Paper>
      )}
    </div>
  );
};

export default GpxSelector;