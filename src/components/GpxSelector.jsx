import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Grid, Button } from '@mui/material';
import gpxManifest from '../data/gpxManifest.json';
import { gpx } from '@tmcw/togeojson';
import processGeoData from '../hooks/processGeoData';

const GpxSelector = ({ onGeoDataChange }) => {
  const [selectedFile, setSelectedFile] = useState('');
  const [rawGeoData, setRawGeoData] = useState(null);
  const [processedGeoData, setProcessedGeoData] = useState(null);

  // Parse GPX into GeoJSON and set the raw geo data
  const readAndParseFile = (fileContent) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileContent, 'application/xml');
    const geojson = gpx(xmlDoc);
    setRawGeoData(geojson);
  };

  // When a file is uploaded, read and parse it
  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        readAndParseFile(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  // When the selected file changes, fetch the GPX file and parse it
  useEffect(() => {
    if (selectedFile) {
      fetch(`/data/gpx/${selectedFile}`)
        .then(response => response.text())
        .then(data => readAndParseFile(data))
        .catch(error => console.error('Error fetching GPX file:', error));
    }
  }, [selectedFile]);

  // Process the raw geo data whenever it changes
  useEffect(() => {
    if (rawGeoData) {
      const processedGeoData = processGeoData(rawGeoData, 3);
      setProcessedGeoData(processedGeoData);
    }
  }, [rawGeoData]);

  // When any geoData changes, pass the data to the parent component
  useEffect(() => {
    if (rawGeoData && processedGeoData) {
      const updatedGeoData = { raw: rawGeoData, processed: processedGeoData };
      onGeoDataChange(updatedGeoData); // Pass the data to the parent component
    }
  }, [rawGeoData, processedGeoData, onGeoDataChange]);

  const handleSelectedChange = (event) => {
    setSelectedFile(event.target.value);
  };

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select GPX File</InputLabel>
            <Select
              value={selectedFile}
              onChange={handleSelectedChange}
              displayEmpty
              fullWidth
            >
              {gpxManifest.map((file, index) => (
                <MenuItem key={index} value={file}>{file}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            component="label"
            fullWidth
          >
            Upload File
            <input
              type="file"
              accept=".gpx"
              hidden
              onChange={handleUploadChange}
            />
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default GpxSelector;