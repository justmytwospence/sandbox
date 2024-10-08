import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';
import { point } from 'leaflet';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const computeRunnablePercentage = (data, maxGradient) => {
  let totalMiles = 0;
  let runnableMiles = 0;

  for (let i = 1; i < data.length; i++) {
    const distance = data[i].distance; 
    totalMiles += distance;
    if (data[i].gradient <= maxGradient) {
      runnableMiles += distance;
    }
  }

  return (runnableMiles / totalMiles);
};

const RunnabilityChart = ({ geoData }) => {
  const [runnabilityData, setRunnabilityData] = useState([]);

  const gradientRange = Array.from({ length: 210 }, (_, i) => (i * 0.001)); // 0 to 0.2 by 0.01 increments

  useEffect(() => {
    if (geoData) {
      const runnablePercentages = gradientRange.map(maxGradient => ({
        x: parseFloat(maxGradient),
        y: computeRunnablePercentage(geoData, parseFloat(maxGradient))
      }));
      setRunnabilityData(runnablePercentages);
    }
  }, [geoData]);

  if (!geoData) {
    return null;
  }

  const data = {
    labels: runnabilityData.map(point => point.x),
    datasets: [
      {
        label: 'Runnable Percentage',
        data: runnabilityData.map(point => point.y),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false,
    plugins: {
      title: {
        display: true,
        text: 'Runnable Percentage as a Function of Max Runnable Gradient',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `Max Gradient: ${context.label}%, Runnable: ${context.raw.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        max: geoData.map(point => point.gradient).reduce((a, b) => Math.max(a, b), 0),
        title: {
          display: true,
          text: 'Max Runnable Gradient (%)',
        },
        ticks: {
          callback: function (value) {
            return (value * 100).toFixed(0) + '%'; // Format as percentage with 2 decimal places
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Runnable Percentage (%)',
        },
        min: 0,
        max: 1,
        ticks: {
          callback: function (value) {
            return (value * 100).toFixed(0) + '%'; // Format as percentage with 2 decimal places
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default RunnabilityChart;