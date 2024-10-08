import React, { useState } from 'react';
import { Typography } from '@mui/material';
import GpxSelector from './GpxSelector';
import { Fragment } from 'react';
import Map from './Map';
import { Grid2 } from '@mui/material';
import GradientCard from './GradientCard';
import ElevationChart from './ElevationChart';
import GradientCdfChart from './GradientCdfChart';
import Topbar from './Topbar';
import RunnabilityChart from './RunnabilityChart';

const CourseColumn = ({ title, geoData, onGeoDataChange, onHover, maxGradient }) => {
  return (
    <Fragment>
      <GpxSelector onGeoDataChange={onGeoDataChange} />
      {geoData && (
        <Fragment>
          <Typography variant="h6">{title}</Typography>
          <Map geoData={geoData.raw} onHover={onHover} />
          <ElevationChart geoData={geoData.processed} maxGradient={maxGradient / 100} />
          <GradientCard geoData={geoData.processed} maxGradient={maxGradient / 100} />
          <RunnabilityChart geoData={geoData.processed} />
        </Fragment>
      )}
    </Fragment>
  );
};

const CourseComparison = () => {
  const [geoData1, setGeoData1] = useState(null);
  const [geoData2, setGeoData2] = useState(null);
  const [maxGradient, setMaxGradient] = useState(10);

  const handleGeoDataChange1 = (data) => {
    setGeoData1(data);
  };

  const handleGeoDataChange2 = (data) => {
    setGeoData2(data);
  };

  return (
    <Fragment>
      <Topbar maxGradient={maxGradient} setMaxGradient={setMaxGradient}/>
      <Grid2 container spacing={3} sx={{ mt: 3, px: 2 }}>
        <Grid2 size={6}>
          <CourseColumn
            title="Course 1"
            geoData={geoData1}
            onGeoDataChange={handleGeoDataChange1}
            maxGradient={maxGradient}
          />
        </Grid2>
        <Grid2 size={6}>
          <CourseColumn
            title="Course 2"
            geoData={geoData2}
            onGeoDataChange={handleGeoDataChange2}
            maxGradient={maxGradient}
          />
        </Grid2>
        {(geoData1 && geoData2) && (
          <GradientCdfChart
            geoData1={geoData1.processed}
            geoData2={geoData2.processed}
            maxGradient={maxGradient}>
          </GradientCdfChart>
        )}
      </Grid2>
    </Fragment>
  );
};

export default CourseComparison;