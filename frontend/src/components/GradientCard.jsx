import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const calculateGradientPercentage = (data, maxGradient) => {
  if (!data || data.length === 0) return 0;

  const totalDistance = data.reduce((acc, point) => acc + point.distance, 0);
  const runnableDistance = data
    .filter(point => point.gradient <= maxGradient)
    .reduce((acc, point) => acc + point.distance, 0);

  return runnableDistance / totalDistance;
};

const GradientCard = ({ geoData, maxGradient }) => {
  const runnablePercentage = geoData ? calculateGradientPercentage(geoData, maxGradient) : 0;

  return (
    <Card style={{ marginTop: 20 }}>
      <CardHeader title="Statistics" />
      <CardContent>
        <Typography variant="body1">
          Course is {runnablePercentage.toFixed(2) * 100}% runnable with a max gradient of {maxGradient * 100}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GradientCard;