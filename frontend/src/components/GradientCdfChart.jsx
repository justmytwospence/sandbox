import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const computeCdf = (data, range) => {
  const sorted = [...data].sort((a, b) => a - b);
  const cdf = [];
  let cumulativeCount = 0;
  let dataIndex = 0;

  range.forEach(x => {
    while (dataIndex < sorted.length && sorted[dataIndex] <= x) {
      cumulativeCount++;
      dataIndex++;
    }
    cdf.push({
      x: x,
      y: cumulativeCount / sorted.length
    });
  });

  return cdf;
};

const GradientCdfChart = ({ geoData1, geoData2 }) => {
  const [cdf1, setCdf1] = useState([]);
  const [cdf2, setCdf2] = useState([]);

  const xAxisRange = Array.from({ length: 61 }, (_, i) => parseFloat((-0.2 + i * 0.01).toFixed(2)));

  useEffect(() => {
    if (geoData1 && geoData2) {
      const gradients1 = geoData1.map(point => point.gradient);
      const gradients2 = geoData2.map(point => point.gradient);

      setCdf1(computeCdf(gradients1, xAxisRange));
      setCdf2(computeCdf(gradients2, xAxisRange));
    }
  }, [geoData1, geoData2]);

  if (!geoData1 || !geoData2) {
    return null;
  }

  const data = {
    labels: xAxisRange,
    datasets: [
      {
        label: 'Course 1',
        data: cdf1.map(point => point.y),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Course 2',
        data: cdf2.map(point => point.y),
        borderColor: 'rgba(153,102,255,1)',
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
        text: 'Cumulative Density Function of Gradient',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'linear',
        ticks: {
          stepSize: 0.01,
          min: -0.2,
          max: 0.2,
          callback: function (value) {
            return (value * 100).toFixed(0) + '%'; // Format as percentage with 2 decimal places
          },
        },
        title: {
          display: true,
          text: 'Gradient',
        },
      },
      y: {
        title: {
          display: true,
          text: 'CDF',
        },
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

export default GradientCdfChart;
