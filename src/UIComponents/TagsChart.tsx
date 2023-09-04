/**
 * A React component that renders a line chart using the Chart.js library.
 * @param {prop} props - The component props.
 * @param {any} props.Data - The data used to populate the chart.
 * @returns A line chart component.
 */
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

type prop = {
  Data: any;
};

type color = { context: string };

const TagsChart = ({ Data }: prop) => {
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
          color: function (context: any) {
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
          color: function (context: any) {
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

  // const labels = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  // ];

  const getLabels = () => {
    if (Data && Data.length !== 0) {
      return Data.map((ele: any) => ele?.hours || 0);
    } else {
      return [];
    }
  };

  const getValues = () => {
    if (Data && Data.length !== 0) {
      return Data.map((ele: any) => ele?.total_nuggets || 0);
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
  return Data && Data?.length !== 0 ? (
    <Line options={options} data={data} />
  ) : null;
};

export default TagsChart;
