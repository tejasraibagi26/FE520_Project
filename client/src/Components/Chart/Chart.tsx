import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { tickers } from "../../Data/Tickers";
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
  // const [cost, setCost] = useState(0.0);
  // const [high, setHigh] = useState<number>(0);
  // const [low, setLow] = useState<number>(0);
  // const [diff, setDiff] = useState<number>(0.0);
  // const [diffPercent, setDiffPercent] = useState<number>(0.0);
  const companyName = tickers.filter((t: any) => t.symbol === ticker)[0]
    .companyName;
  const [prevClose, setPrevClose] = useState<number>(0);
  const costIndicatorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [chartData, setChartData] = useState({
  //   labels: [""],
  //   datasets: [
  //     {
  //       data: [],
  //       fill: false,
  //       borderColor: "rgb(25, 230, 140)",
  //       tension: 0.1,
  //     },
  //   ],
  // });

  // useEffect(() => {
  //   const API_URL = "http://127.0.0.1:5000";

  //   setLoading(true);
  //   axios
  //     .get(`${API_URL}/stock/yf?stock_name=${ticker}`)
  //     .then((res) => {
  //       const addToHigh = (res.data.data.high - res.data.data.low) * 2;
  //       setCost(res.data.data.current_price);
  //       setHigh(res.data.data.high + addToHigh);
  //       setLow(res.data.data.low);
  //       setPrevClose(res.data.data.previous_close);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (loading) return;
  //   const interval = setInterval(() => {
  //     const newCost = (Math.random() * (high - low) + low).toFixed(2);
  //     setDiff((prev) => Number(newCost) - cost);
  //     setDiffPercent((prev) => {
  //       const diff = Number(newCost) - cost;
  //       return (diff / cost) * 100;
  //     });
  //     setCost(Number(newCost));

  //     if (costIndicatorRef.current) {
  //       costIndicatorRef.current.classList.add("animate-cost");
  //       setTimeout(() => {
  //         costIndicatorRef.current?.classList.remove("animate-cost");
  //       }, 500);
  //     }
  //     // Add the new cost to the chart data
  //     setChartData((prevState: any) => {
  //       const newData = prevState.datasets[0].data.slice();

  //       newData.push(newCost);
  //       const newLabels = prevState.labels.slice();
  //       newLabels.push("");

  //       return {
  //         ...prevState,
  //         datasets: [
  //           {
  //             ...prevState.datasets[0],
  //             data: newData,
  //           },
  //         ],
  //         labels: newLabels,
  //       };
  //     });
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [loading]);

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
