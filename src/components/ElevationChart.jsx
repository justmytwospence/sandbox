import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ElevationChart = ({ geoData, maxGradient }) => {
  if (!geoData) {
    return <div>No data available</div>;
  }

  const labels = geoData.map(point => point.cumulativeDistance.toFixed(2));
  const elevationData = geoData.map(point => point.ele);
  const gradientData = geoData.map(point => point.gradient);

  const data = {
    labels,
    datasets: [
      {
        label: 'Elevation (m)',
        data: elevationData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
        pointRadius: 0, // Remove dots
      },
      {
        label: 'Gradient (%)',
        data: gradientData,
        borderColor: context => {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value > maxGradient ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
        },
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y2',
        pointRadius: 0, // Remove dots
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Elevation and Gradient Profile',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          },
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Cumulative Distance (km)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Elevation (m)',
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Gradient (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ElevationChart;