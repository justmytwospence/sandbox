import React from 'react';
import { Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { Fragment } from 'react';
import Grid2 from '@mui/material/Grid';

const ControlPanel = ({ maxGradient, setMaxGradient }) => {

  const handleSliderChange = (event, newValue) => {
    setMaxGradient(newValue);
  };

  return (
    <Grid2 container>
      <Typography variant="h6">
        Max Runnable Gradient
      </Typography>
      <Slider
        value={maxGradient}
        onChange={handleSliderChange}
        aria-labelledby="max-gradient-slider"
        valueLabelDisplay="auto"
        step={0.1}
        marks={
          [
            {
              value: 0,
              label: '0%'
            },
            {
              value: 10,
              label: '10%'
            },
            {
              value: 20,
              label: '20%'
            }
          ]
        }
        min={0}
        max={20}
        style={{ width: '100%' }}
      />
    </Grid2>
  );
};

export default ControlPanel;