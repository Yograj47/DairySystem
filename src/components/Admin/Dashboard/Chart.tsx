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
    Legend,
    type ChartOptions,
} from "chart.js";
import { useDarkMode } from "../../hook/DarkMode";
import { useSales } from "../../hook/SaleFetch";

Chartjs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { useMemo } from "react";

function Chart() {

    const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("weekly");
    const { isDark } = useDarkMode();
    const { data: sales } = useSales(); // sales: ISale[]

    // compute labels + dataPoints from sales
    const { labels, dataPoints } = useMemo(() => {
        if (!sales) return { labels: [], dataPoints: [] };

        const now = new Date();
        let labels: string[] = [];
        let dataPoints: number[] = [];

        if (timeframe === "weekly") {
            // last 7 days
            labels = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(now.getDate() - (6 - i));
                return d.toLocaleDateString("en-US", { weekday: "short" });
            });

            dataPoints = labels.map((_, i) => {
                const day = new Date();
                day.setDate(now.getDate() - (6 - i));
                const dayString = day.toDateString();

                return sales.reduce((sum, sale) => {
                    if (new Date(sale.date).toDateString() === dayString) {
                        return sum + sale.products.reduce((s, p) => s + p.qty, 0);
                    }
                    return sum;
                }, 0);
            });
        }

        else if (timeframe === "monthly") {
            // last 30 days
            labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
            dataPoints = Array(30).fill(0);

            sales.forEach((sale) => {
                const d = new Date(sale.date).getDate() - 1;
                if (d >= 0 && d < 30) {
                    dataPoints[d] += sale.products.reduce((s, p) => s + p.qty, 0);
                }
            });
        }

        else if (timeframe === "yearly") {
            labels = Array.from({ length: 12 }, (_, i) =>
                new Date(0, i).toLocaleString("en-US", { month: "short" })
            );
            dataPoints = Array(12).fill(0);

            sales.forEach((sale) => {
                const month = new Date(sale.date).getMonth();
                dataPoints[month] += sale.products.reduce((s, p) => s + p.qty, 0);
            });
        }

        return { labels, dataPoints };
    }, [sales, timeframe]);


    const data = {
        labels,
        datasets: [
            {
                label: "Total Units Sold",
                data: dataPoints,
                borderColor: isDark ? "#60a5fa" : "rgba(14, 113, 158, 0.9)",
                backgroundColor: isDark
                    ? "rgba(96, 165, 250, 0.2)"
                    : "rgba(14, 113, 158, 0.2)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: isDark ? "#93c5fd" : "#0e719e"
            }
        ]
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800,
            easing: "easeInOutCubic",
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `Total Units Sold - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)
                    }`,
                color: isDark ? "#f1f5f9" : "#0f172a",
                font: {
                    size: 16,
                    weight: "bold",
                },
            },
        },
        // scales: {
        //     x: {
        //         ticks: {
        //             color: isDark ? "#cbd5e1" : "#334155",
        //         },
        //         grid: {
        //             color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        //         },
        //     },
        //     y: {
        //         beginAtZero: true,
        //         ticks: {
        //             color: isDark ? "#cbd5e1" : "#334155",
        //         },
        //         grid: {
        //             color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        //         },
        //     },
        // },
    };
    return (
        <div
            className={`${isDark ? "bg-[#1e293b] ring-[#334155]" : "bg-white ring-gray-200"
                } ring-1 p-5 h-full flex flex-col rounded-2xl shadow-sm transition-colors`}
        >
            {/* Toggle buttons */}
            <div className="flex justify-end mb-4 space-x-2">
                {["weekly", "monthly", "yearly"].map((tf) => (
                    <button
                        key={tf}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${timeframe === tf
                            ? "bg-blue-500 text-white shadow-sm scale-105"
                            : isDark
                                ? "bg-[#334155] text-gray-300 hover:bg-[#475569]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setTimeframe(tf as "weekly" | "monthly" | "yearly")}
                    >
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[250px]">
                <Line
                    data={data}
                    options={{ ...options, maintainAspectRatio: false }}
                />
            </div>
        </div>
    );
}

export default Chart;
