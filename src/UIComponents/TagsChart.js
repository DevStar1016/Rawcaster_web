import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

const TagsChart = ({ Data }) => {
  ChartJS.register(
    CategoryScale,
    PointElement,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
          border: " 1px dashed #D6DADE",
        },
      },

      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
          border: " 1px dashed #D6DADE",
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
      labels: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const getLabels = () => {
    if (Data.length !== 0) {
      return Data.map((ele) => ele?.hours || 0);
    } else {
      return [];
    }
  };

  const getValues = () => {
    if (Data.length !== 0) {
      return Data.map((ele) => ele?.total_nuggets || 0);
    } else {
      return [];
    }
  };

  const data = {
    labels: getLabels(),
    datasets: [
      {
        label: "Nugget Count",
        data: getValues(),
        borderColor: "#F2718D",
        backgroundColor: "#F2718D",
      },
    ],
  };
  return Data.length !== 0 ? <Line options={options} data={data} /> : null;
};

export default TagsChart;
