"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    MenuItem,
    Select,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Divider,
} from "@mui/material";

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
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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
    monthly: [
        { month: "Jan", revenue: 25000, expenses: 18000, unitsSold: 1200 },
        { month: "Feb", revenue: 28000, expenses: 20000, unitsSold: 1300 },
        { month: "Mar", revenue: 30000, expenses: 22000, unitsSold: 1400 },
        { month: "Apr", revenue: 27000, expenses: 21000, unitsSold: 1350 },
    ],
    yearly: [
        { year: "2022", revenue: 300000, expenses: 200000, unitsSold: 15000 },
        { year: "2023", revenue: 350000, expenses: 250000, unitsSold: 17000 },
        { year: "2024", revenue: 400000, expenses: 300000, unitsSold: 20000 },
    ],
};

// Dummy top-selling products
const topProducts = [
    { product: "Milk", unitsSold: 120 },
    { product: "Butter", unitsSold: 90 },
    { product: "Cheese", unitsSold: 70 },
    { product: "Cookies", unitsSold: 50 },
];

// Dummy transactions
const transactions = [
    { date: "2025-08-01", product: "Milk", qty: "2 Ltr", price: 70, total: 140, type: "Sale" },
    { date: "2025-08-01", product: "Butter", qty: "500 g", price: 450, total: 225, type: "Sale" },
    { date: "2025-08-02", product: "Milk", qty: "1 Ltr", price: 70, total: 70, type: "Purchase" },
    { date: "2025-08-03", product: "Cookies", qty: "2 Packet", price: 50, total: 100, type: "Sale" },
];

// ----------------- Component -----------------
export default function Report() {
    const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        setChartData(dummyFinancialData[timeframe]);
    }, [timeframe]);

    // ---------- Summary calculations ----------
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const totalUnits = chartData.reduce((sum, d) => sum + d.unitsSold, 0);

    const labels =
        timeframe === "daily"
            ? chartData.map((d) => d.date)
            : timeframe === "weekly"
                ? chartData.map((d) => d.week)
                : timeframe === "monthly"
                    ? chartData.map((d) => d.month)
                    : chartData.map((d) => d.year);

    // ---------- Revenue vs Expenses ----------
    const lineData = {
        labels,
        datasets: [
            {
                label: "Revenue",
                data: chartData.map((d) => d.revenue),
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                tension: 0.3,
            },
            {
                label: "Expenses",
                data: chartData.map((d) => d.expenses),
                borderColor: "#ef4444",
                backgroundColor: "#ef4444",
                tension: 0.3,
            },
        ],
    };

    // ---------- Net Profit Bar Chart ----------
    const profitData = {
        labels,
        datasets: [
            {
                label: "Net Profit",
                data: chartData.map((d) => d.revenue - d.expenses),
                backgroundColor: "#10b981",
            },
        ],
    };

    // ---------- Top Selling Products Bar Chart ----------
    const topProductData = {
        labels: topProducts.map((p) => p.product),
        datasets: [
            {
                label: "Units Sold",
                data: topProducts.map((p) => p.unitsSold),
                backgroundColor: "#f59e0b",
            },
        ],
    };

    return (
        <Box className="w-full flex flex-col gap-6 bg-gray-100 h-full overflow-auto">
            {/* Timeframe Selection */}
            <Box className="flex">
                <Select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    size="small"
                >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
            </Box>

            {/* Summary Cards */}
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card >
                    <CardContent>
                        <Typography variant="subtitle2">Total Revenue</Typography>
                        <Typography variant="h6" className="font-bold">
                            Rs {totalRevenue.toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent>
                        <Typography variant="subtitle2">Total Expenses</Typography>
                        <Typography variant="h6" className="font-bold">
                            Rs {totalExpenses.toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent>
                        <Typography variant="subtitle2">Net Profit</Typography>
                        <Typography
                            variant="h6"
                            className={`font-bold ${totalProfit < 0 ? "text-red-500" : "text-green-600"}`}
                        >
                            Rs {totalProfit.toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent>
                        <Typography variant="subtitle2">Total Units Sold</Typography>
                        <Typography variant="h6" className="font-bold">
                            {totalUnits}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Charts */}
            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Paper className="p-4 bg-white rounded-lg shadow-md">
                    <Line data={lineData} />
                </Paper>

                <Paper className="p-4 bg-white rounded-lg shadow-md">
                    <Bar data={profitData} />
                </Paper>
            </Box>
            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Paper className="p-4  bg-white rounded-lg shadow-md">
                    <Typography variant="h6" className="font-bold mb-2">
                        Top Selling Products
                    </Typography>
                    <Bar data={topProductData} />
                </Paper>

                {/* Transactions Table */}
                <Paper className="p-4 bg-white rounded-lg shadow-md">
                    <Typography variant="h6" className="font-bold mb-2">
                        Transactions
                    </Typography>
                    <Divider className="mb-2" />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price (Rs)</TableCell>
                                <TableCell>Total (Rs)</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((tx, i) => (
                                <TableRow key={i}>
                                    <TableCell>{tx.date}</TableCell>
                                    <TableCell>{tx.product}</TableCell>
                                    <TableCell>{tx.qty}</TableCell>
                                    <TableCell>{tx.price}</TableCell>
                                    <TableCell>{tx.total}</TableCell>
                                    <TableCell>{tx.type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
}
