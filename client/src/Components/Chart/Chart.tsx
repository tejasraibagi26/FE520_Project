import Chart from "chart.js/auto";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import AnimatedCost from "./AnimatedCost";
import "./index.css";

const LineChart = ({
  ticker,
  cost,
  high,
  low,
  chartData,
  diffPercent,
  diff,
}: any) => {
  useEffect(() => {
    Chart.register();
  }, []);

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
      grid: {
        display: false,
      },
    },
    scales: {
      y: {
        display: false,
        beginFromZero: false,
        grid: {
          display: false,
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
        min: 0,
        max: 1000,
        beginFromZero: false,
      },
    },
  };
  return (
    <div className="chart">
      <span>
        <span className="dollar">$</span>
        <AnimatedCost cost={cost} />
      </span>
      <div>
        <span className={`${Number(diff.toFixed(2)) < 0.0 ? "red" : "green"}`}>
          {" "}
          ${diff.toFixed(2)} ({Number(diffPercent.toFixed(2))}%)
        </span>
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChart;
