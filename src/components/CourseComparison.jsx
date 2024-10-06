import React, { useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import GpxSelector from './GpxSelector';
import Map from './Map';

const CourseColumn = ({ title, geoData, onGeoDataChange, onHover, hoveredFeatureIndex }) => {
  return (
    <Grid item xs={12} md={6}>
      <Paper style={{ padding: 20 }}>
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

  const handleGeoDataChange1 = (data) => {
    setGeoData1(data);
  };

  const handleGeoDataChange2 = (data) => {
    setGeoData2(data);
  };

  const handleHover1 = ({ featureIndex }) => {
    setHoveredFeatureIndex1(featureIndex);
  };

  const handleHover2 = ({ featureIndex }) => {
    setHoveredFeatureIndex2(featureIndex);
  };

  return (
    <Grid container spacing={2} style={{ padding: 20 }} alignItems="flex-start">
      <CourseColumn
        title="Course 1"
        geoData={geoData1}
        onGeoDataChange={handleGeoDataChange1}
        onHover={handleHover1}
        hoveredFeatureIndex={hoveredFeatureIndex1}
      />
      <CourseColumn
        title="Course 2"
        geoData={geoData2}
        onGeoDataChange={handleGeoDataChange2}
        onHover={handleHover2}
        hoveredFeatureIndex={hoveredFeatureIndex2}
      />
    </Grid>
  );
};

export default CourseComparison;