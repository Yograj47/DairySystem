import { useState, useEffect } from "react";
import { Box, Typography, MenuItem, Select, Divider, FormControl, InputLabel } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useDarkMode } from "../../components/context/DarkMode";


// ----------------- Dummy Data -----------------
const dummyFinancialData = {
    daily: [
        { date: "2025-08-01", revenue: 1200, expenses: 800, unitsSold: 50 },
        { date: "2025-08-02", revenue: 1500, expenses: 900, unitsSold: 65 },
        { date: "2025-08-03", revenue: 1700, expenses: 1100, unitsSold: 80 },
        { date: "2025-08-04", revenue: 1400, expenses: 950, unitsSold: 70 },
        { date: "2025-08-05", revenue: 1600, expenses: 1000, unitsSold: 75 },
    ],
    weekly: [
        { week: "Week 1", revenue: 6000, expenses: 4000, unitsSold: 300 },
        { week: "Week 2", revenue: 7500, expenses: 5000, unitsSold: 350 },
        { week: "Week 3", revenue: 8000, expenses: 5500, unitsSold: 380 },
        { week: "Week 4", revenue: 7000, expenses: 4800, unitsSold: 320 },
    ],
};

const topProducts = [
    { product: "Milk", unitsSold: 120 },
    { product: "Butter", unitsSold: 90 },
    { product: "Cheese", unitsSold: 70 },
    { product: "Cookies", unitsSold: 50 },
];

const transactions = [
    { date: "2025-08-01", product: "Milk", qty: "2 Ltr", price: 70, total: 140, type: "Sale" },
    { date: "2025-08-01", product: "Butter", qty: "500 g", price: 450, total: 225, type: "Sale" },
    { date: "2025-08-02", product: "Milk", qty: "1 Ltr", price: 70, total: 70, type: "Purchase" },
];

// ----------------- Register ChartJS -----------------
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Report() {
    const { isDark } = useDarkMode();
    const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily");
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        setChartData(dummyFinancialData[timeframe]);
    }, [timeframe]);

    // Summary calculations
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const totalUnits = chartData.reduce((sum, d) => sum + d.unitsSold, 0);

    const labels = timeframe === "daily" ? chartData.map(d => d.date) : chartData.map(d => d.week);

    const lineData = {
        labels,
        datasets: [
            {
                label: "Revenue",
                data: chartData.map(d => d.revenue),
                borderColor: isDark ? "#60a5fa" : "#3b82f6",
                backgroundColor: isDark ? "rgba(96,165,250,0.2)" : "rgba(59,130,246,0.2)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "Expenses",
                data: chartData.map(d => d.expenses),
                borderColor: isDark ? "#f87171" : "#ef4444",
                backgroundColor: isDark ? "rgba(248,113,113,0.2)" : "rgba(239,68,68,0.2)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const profitData = {
        labels,
        datasets: [
            {
                label: "Net Profit",
                data: chartData.map(d => d.revenue - d.expenses),
                backgroundColor: isDark ? "#10b981" : "#10b981",
            },
        ],
    };

    const topProductData = {
        labels: topProducts.map(p => p.product),
        datasets: [
            {
                label: "Units Sold",
                data: topProducts.map(p => p.unitsSold),
                backgroundColor: isDark ? "#fbbf24" : "#f59e0b",
            },
        ],
    };

    return (
        <Box className={`w-full flex flex-col gap-6 h-full overflow-y-scroll p-4 ${isDark ? "bg-[#1e293b] text-gray-200" : "bg-gray-100 text-gray-800"}`}>
            {/* Timeframe Selection */}
            <FormControl sx={{ width: "100px" }} size="small">
                <InputLabel
                    id="timeframe-label"
                    sx={{
                        color: isDark ? "white" : "gray",
                        "&.Mui-focused": { color: isDark ? "white" : "gray" },
                    }}
                >
                    Timeframe
                </InputLabel>
                <Select
                    labelId="timeframe-label"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    label="Timeframe"
                    sx={{
                        color: isDark ? "white" : "black",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: isDark ? "#555" : "#ccc",
                        },
                        "& .MuiSvgIcon-root": {
                            color: isDark ? "white" : "gray",
                        },
                    }}
                >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
            </FormControl>

            {/* Summary Cards */}
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: `Rs ${totalRevenue}` },
                    { label: "Total Expenses", value: `Rs ${totalExpenses}` },
                    { label: "Net Profit", value: `Rs ${totalProfit}`, profit: true },
                    { label: "Total Units Sold", value: totalUnits },
                ].map((card, i) => (
                    <div
                        key={i}
                        className={`ring-1 rounded-xl p-4 flex flex-col gap-2 transition-colors duration-300 ${isDark ? "bg-[#24303f] ring-[#3b4b5c] text-gray-200" : "bg-white ring-[#e2e9f0] text-gray-800"}`}
                    >
                        <p className="text-2xl font-semibold">{card.value}</p>
                        <div className="flex gap-2 items-center">

                            <span className="text-sm font-medium">{card.label}</span>
                            {card.profit && (
                                <span className={`${totalProfit < 0 ? "text-red-500" : "text-green-500"} font-semibold`}>
                                    {totalProfit < 0 ? "-" : "+"}{totalProfit}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </Box>

            {/* Charts */}
            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-5 rounded-2xl ring-1 ${isDark ? "bg-[#24303f] ring-[#334155]" : "bg-white ring-gray-200"}`}>
                    <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
                </div>
                <div className={`p-5 rounded-2xl ring-1 ${isDark ? "bg-[#24303f] ring-[#334155]" : "bg-white ring-gray-200"}`}>
                    <Bar data={profitData} options={{ responsive: true }} />
                </div>
            </Box>

            {/* Top Products & Transactions */}
            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-5 rounded-2xl ring-1 ${isDark ? "bg-[#24303f] ring-[#334155]" : "bg-white ring-gray-200"}`}>
                    <Typography className="font-bold mb-2">Top Selling Products</Typography>
                    <Bar data={topProductData} options={{ responsive: true }} />
                </div>
                <div className={`p-5 rounded-2xl ring-1 flex flex-col ${isDark ? "bg-[#24303f] ring-[#334155]" : "bg-white ring-gray-200"}`}>
                    <Typography className="font-bold mb-2">Transactions</Typography>
                    <Divider className={`mb-2 ${isDark ? "border-gray-700" : "border-gray-300"}`} />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className={`${isDark ? "bg-[#1e293b] text-gray-200" : "bg-gray-100 text-gray-800"}`}>
                                <tr>
                                    <th className="px-3 py-2 text-left">Date</th>
                                    <th className="px-3 py-2 text-left">Product</th>
                                    <th className="px-3 py-2 text-left">Qty</th>
                                    <th className="px-3 py-2 text-left">Price</th>
                                    <th className="px-3 py-2 text-left">Total</th>
                                    <th className="px-3 py-2 text-left">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, i) => (
                                    <tr key={i} className={`${isDark ? "border-gray-700 hover:bg-[#334155]" : "border-gray-300 hover:bg-gray-50"} border-b`}>
                                        <td className="px-3 py-2">{tx.date}</td>
                                        <td className="px-3 py-2">{tx.product}</td>
                                        <td className="px-3 py-2">{tx.qty}</td>
                                        <td className="px-3 py-2">Rs {tx.price}</td>
                                        <td className="px-3 py-2">Rs {tx.total}</td>
                                        <td className="px-3 py-2">{tx.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Box>
        </Box>
    );
}
