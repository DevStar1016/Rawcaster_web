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
        border: { dash: [8, 8] },
        ticks: {
          display: false,
        },
        color: "transparent",
        grid: {
          drawOnChartArea: true,
          drawBorder: false,
          color: function (context) {
            if (context.tick.value === 0) {
              return "#D6DADE";
            }

            return "transparent";
          }, // for the grid lines
        },
      },

      y: {
        border: { dash: [8, 8] },
        beginAtZero: true,
        ticks: {
          display: false,
        },
        color: "transparent",
        grid: {
          drawOnChartArea: true,
          drawBorder: false,
          color: function (context) {
            if (context.tick.value === 0) {
              return "#D6DADE";
            }

            return "transparent";
          }, // for the grid lines
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
      },
      labels: {
        display: false,
      },
      chartAreaBorder: {
        borderColor: "red",
        borderWidth: 2,
        borderDash: [5, 5],
        borderDashOffset: 2,
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
    if (Data && Data.length !== 0) {
      return Data.map((ele) => ele?.hours || 0);
    } else {
      return [];
    }
  };

  const getValues = () => {
    if (Data && Data.length !== 0) {
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
  return Data && Data.length !== 0 ? (
    <Line options={options} data={data} />
  ) : null;
};

export default TagsChart;
