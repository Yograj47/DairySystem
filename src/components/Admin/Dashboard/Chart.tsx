import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as Chartjs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

Chartjs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Chart() {
    const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("weekly");

    // Function to generate dummy total sales data
    const generateTotalSales = (points: number) => {
        return Array.from({ length: points }, () => Math.floor(Math.random() * 500) + 50);
    };

    let labels: string[] = [];
    let dataPoints: number[] = [];

    if (timeframe === "weekly") {
        labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
        dataPoints = generateTotalSales(7);
    } else if (timeframe === "monthly") {
        labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        dataPoints = generateTotalSales(30);
    } else if (timeframe === "yearly") {
        labels = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
        dataPoints = generateTotalSales(12);
    }

    const data = {
        labels,
        datasets: [
            {
                label: "Total Units Sold",
                data: dataPoints,
                borderColor: "rgba(14, 113, 158, 0.8)",
                backgroundColor: "rgba(14, 113, 158, 0.2)",
                fill: true,
                tension: 0.3,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: `Total Units Sold - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}` }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-4 h-full flex flex-col">
            <div className="flex justify-end mb-2 space-x-2">
                <button
                    className={`px-3 py-1 rounded ${timeframe === "weekly" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
                    onClick={() => setTimeframe("weekly")}
                >
                    Weekly
                </button>
                <button
                    className={`px-3 py-1 rounded ${timeframe === "monthly" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
                    onClick={() => setTimeframe("monthly")}
                >
                    Monthly
                </button>
                <button
                    className={`px-3 py-1 rounded ${timeframe === "yearly" ? "bg-blue-400 text-white" : "bg-gray-200"}`}
                    onClick={() => setTimeframe("yearly")}
                >
                    Yearly
                </button>
            </div>
            <div className="flex-1">
                <Line data={data} options={{ ...options, maintainAspectRatio: false }} className="h-full" />
            </div>
        </div>
    );
}

export default Chart;
