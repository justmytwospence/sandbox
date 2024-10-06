import React, { useState } from 'react';
import { Grid, Paper, Typography, Slider } from '@mui/material';
import GpxSelector from './GpxSelector';
import Map from './Map';
import GradientCard from './GradientCard';
import ElevationChart from './ElevationChart';

const CourseColumn = ({ title, geoData, onGeoDataChange, onHover, hoveredFeatureIndex, maxGradient }) => {
  return (
    <Grid item xs={12} md={6}>
      <Paper style={{ padding: 20, width: '100%' }}>
        <Typography variant="h6">{title}</Typography>
        <GpxSelector onGeoDataChange={onGeoDataChange} />
        {geoData && (
          <div>
            <Map geoData={geoData.raw} onHover={onHover} />
            {hoveredFeatureIndex !== null && (
              <Typography variant="body2">
                Hovered Feature Index: {hoveredFeatureIndex}
              </Typography>
            )}
            <GradientCard geoData={geoData.processed} maxGradient={maxGradient / 100} />
            <ElevationChart geoData={geoData.processed} maxGradient={maxGradient / 100}/>
          </div>
        )}
      </Paper>
    </Grid>
  );
};

const CourseComparison = () => {
  const [geoData1, setGeoData1] = useState(null);
  const [geoData2, setGeoData2] = useState(null);
  const [hoveredFeatureIndex1, setHoveredFeatureIndex1] = useState(null);
  const [hoveredFeatureIndex2, setHoveredFeatureIndex2] = useState(null);
  const [maxGradient, setMaxGradient] = useState(10);

  const handleGeoDataChange1 = (data) => {
    setGeoData1(data);
  };

  const handleGeoDataChange2 = (data) => {
    setGeoData2(data);
  };

  const handleMaxGradientChange = (event, newValue) => {
    setMaxGradient(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper style={{ padding: 20, width: '100%' }}>
          <Typography variant="h6">Control Panel</Typography>
          <Typography gutterBottom>Max Runnable Gradient</Typography>
          <Slider
            value={maxGradient}
            onChange={handleMaxGradientChange}
            aria-labelledby="max-gradient-slider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0}
            max={20}
            style={{ width: '100%' }}
          />
        </Paper>
      </Grid>
      <CourseColumn
        title="Course 1"
        geoData={geoData1}
        onGeoDataChange={handleGeoDataChange1}
        onHover={setHoveredFeatureIndex1}
        hoveredFeatureIndex={hoveredFeatureIndex1}
        maxGradient={maxGradient}
      />
      <CourseColumn
        title="Course 2"
        geoData={geoData2}
        onGeoDataChange={handleGeoDataChange2}
        onHover={setHoveredFeatureIndex2}
        hoveredFeatureIndex={hoveredFeatureIndex2}
        maxGradient={maxGradient}
      />
    </Grid>
  );
};

export default CourseComparison;