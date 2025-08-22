import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { paginate } from "../../../utils/Pagination";
import { ArrowUpDown, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import axios from "axios";
import type { IOverview, IStock } from "../../../utils/interface/Stock";
import type { IProduct } from "../../../utils/interface/Product";


export default function Stock() {
    const [stocks, setStocks] = useState<IStock[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [search, setSearch] = useState("");
    const [currPage, setCurrPage] = useState(1);
    const [sortKey, setSortKey] = useState<"name" | "category" | "remaining">("name");
    const [sortState, setSortState] = useState<"default" | "asc" | "desc">("default");

    const dataPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("http://localhost:5000/stock");
                const res1 = await axios.get("http://localhost:5000/products");
                setStocks(res.data);
                setProducts(res1.data)
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        fetchData();
    }, []);

    const StockData = stocks.map((s) => {
        const product = products.find(p => s.productId === p.id);
        return {
            ...s,
            name: product ? product.name : "",
            category: product ? product.category : ""
        }
    })

    const overview: IOverview = {
        totalProducts: StockData.length,
        lowStockCount: StockData.filter(s => s.remaining > 0 && s.remaining < 20).length,
        outOfStockCount: StockData.filter(s => s.remaining === 0).length,
        totalStockValue: StockData.reduce((acc, s) => {
            const product = products.find(p => p.id === s.productId);
            return acc + (product ? product.purchaseRate * s.total : 0);
        }, 0)
    }

    // Compute status dynamically
    const computeStatus = (remaining: number) => {
        if (remaining === 0) return "Out of Stock";
        if (remaining < 20) return "Low Stock";
        return "In Stock";
    };

    // Search filter
    const filteredProducts = StockData.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
    );

    // Sorting logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        if (sortKey === "remaining") {
            valA = a.remaining;
            valB = b.remaining;
        } else {
            valA = a[sortKey];
            valB = b[sortKey];
        }

        if (typeof valA === "string" && typeof valB === "string") {
            return sortState === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === "number" && typeof valB === "number") {
            return sortState === "asc" ? valA - valB : valB - valA;
        }
        return 0;
    });

    const { items: currProducts, totalPages } = paginate<IStock>({
        items: sortedProducts,
        currentPage: currPage,
        itemsPerPage: dataPerPage,
    });

    // Handle header click for sorting
    const handleSort = (key: "name" | "category" | "remaining") => {
        if (sortKey === key) {
            const nextState = sortState === "desc" ? "asc" : "desc"; // toggle desc ↔ asc
            setSortState(nextState);
        } else {
            setSortKey(key);
            setSortState("desc");
        }
    };

    const renderSortIcon = (key: "name" | "category" | "remaining") => {
        if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        if (sortState === "desc") return <ArrowDownWideNarrow className="w-4 h-4" />;
        return <ArrowUpWideNarrow className="w-4 h-4" />;
    };

    return (
        <div className="h-full w-full bg-white p-4 shadow-md flex flex-col">
            {/* Overview / Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-100 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-xl font-semibold">{overview?.totalProducts}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-xl font-semibold">{overview?.lowStockCount}</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-xl font-semibold">{overview?.outOfStockCount}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Stock Value</p>
                    <p className="text-xl font-semibold">Rs {overview?.totalStockValue}</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between items-center my-4">
                <TextField
                    label="Search"
                    type="text"
                    placeholder="Search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3"
                    size="small"
                />
            </div>

            {/* Inventory Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full table-fixed border-collapse">
                    <thead className="bg-blue-100 sticky top-0 z-10">
                        <tr>
                            <th
                                className="text-left px-2 py-2 text-sm font-bold text-gray-700 cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                Name {renderSortIcon("name")}
                            </th>
                            <th
                                className="text-left px-3 py-2 text-sm font-bold text-gray-700 cursor-pointer"
                                onClick={() => handleSort("category")}
                            >
                                Category {renderSortIcon("category")}
                            </th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">
                                Total
                            </th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">
                                Sold
                            </th>
                            <th
                                className="text-left px-3 py-2 text-sm font-bold text-gray-700 cursor-pointer"
                                onClick={() => handleSort("remaining")}
                            >
                                Remaining {renderSortIcon("remaining")}
                            </th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {currProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm text-gray-700">{product.name}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{product.category}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{product.total}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{product.sold}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{product.remaining}</td>
                                <td className="px-3 py-2 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${computeStatus(product.remaining) === "In Stock"
                                            ? "bg-green-100 text-green-700"
                                            : computeStatus(product.remaining) === "Low Stock"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {computeStatus(product.remaining)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-6">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    onClick={() => setCurrPage((p) => p - 1)}
                    disabled={currPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrPage(i + 1)}
                        className={`px-3 py-1 border rounded ${currPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrPage((p) => p + 1)}
                    disabled={currPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
