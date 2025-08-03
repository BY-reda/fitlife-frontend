import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ protein, carbs, fats }) {
  const data = {
    labels: ['Protéines', 'Glucides', 'Lipides'],
    datasets: [
      {
        data: [protein, carbs, fats],
        backgroundColor: ['#10b981', '#3b82f6', '#facc15'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
