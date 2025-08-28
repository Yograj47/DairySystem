import { TextField } from "@mui/material";
import { useState } from "react";
import { paginate } from "../../../utils/Pagination";
import { ArrowUpDown, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import type { IOverview, IStock } from "../../../utils/interface/Stock";
import type { IProduct } from "../../../utils/interface/Product";
import { useProduct } from "../../../components/hook/ProductFetch";
import { useStock } from "../../../components/hook/StockFetch";
import { useDarkMode } from "../../../components/hook/DarkMode";

export default function Stock() {
    const [search, setSearch] = useState("");
    const [currPage, setCurrPage] = useState(1);
    const [sortKey, setSortKey] = useState<"name" | "category" | "remaining">("name");
    const [sortState, setSortState] = useState<"default" | "asc" | "desc">("default");
    const { data: products, isLoading } = useProduct();
    const { data: stocks } = useStock();
    const { isDark } = useDarkMode();

    if (!stocks) return;

    const dataPerPage = 10;
    const productData: IProduct[] = products ? products : [];

    const StockData = stocks.map((s) => {
        const product = productData.find((p) => s.productId === p.id);
        return {
            ...s,
            name: product ? product.name : "",
            category: product ? product.category : "",
        };
    });

    const overview: IOverview = {
        totalProducts: StockData.length,
        lowStockCount: StockData.filter((s) => s.remaining > 0 && s.remaining < 20).length,
        outOfStockCount: StockData.filter((s) => s.remaining === 0).length,
        totalStockValue: StockData.reduce((acc, s) => {
            const product = productData.find((p) => p.id === s.productId);
            return acc + (product ? product.purchaseRate * s.total : 0);
        }, 0),
    };

    const computeStatus = (remaining: number) => {
        if (remaining === 0) return "Out of Stock";
        if (remaining < 20) return "Low Stock";
        return "In Stock";
    };

    const filteredProducts = StockData.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
    );

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

    const handleSort = (key: "name" | "category" | "remaining") => {
        if (sortKey === key) {
            const nextState = sortState === "desc" ? "asc" : "desc";
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                Loading stock...
            </div>
        );
    }

    return (
        <div
            className={`h-full w-full p-0 flex flex-col border ${isDark ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-300"
                }`}
        >
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3">
                {/* Total Products → Blue */}
                <div
                    className={`p-4 rounded-lg text-center ${isDark ? "bg-blue-700" : "bg-blue-200"
                        }`}
                >
                    <p className={`${isDark ? "text-white" : "text-gray-600"} text-md`}>
                        Total Products
                    </p>
                    <p
                        className={`${isDark ? "text-white" : "text-gray-800"} text-2xl font-semibold`}
                    >
                        {overview?.totalProducts}
                    </p>
                </div>

                {/* Low Stock → Amber / Yellow */}
                <div
                    className={`p-4 rounded-lg text-center ${isDark ? "bg-yellow-500" : "bg-amber-200"
                        }`}
                >
                    <p className={`${isDark ? "text-white" : "text-gray-600"} text-md`}>
                        Low Stock
                    </p>
                    <p
                        className={`${isDark ? "text-white" : "text-gray-800"} text-2xl font-semibold`}
                    >
                        {overview?.lowStockCount}
                    </p>
                </div>

                {/* Out of Stock → Red */}
                <div
                    className={`p-4 rounded-lg text-center ${isDark ? "bg-red-700" : "bg-red-200"
                        }`}
                >
                    <p className={`${isDark ? "text-white" : "text-gray-600"} text-md`}>
                        Out of Stock
                    </p>
                    <p
                        className={`${isDark ? "text-white" : "text-gray-800"} text-2xl font-semibold`}
                    >
                        {overview?.outOfStockCount}
                    </p>
                </div>

                {/* Total Valuation → Green */}
                <div
                    className={`p-4 rounded-lg text-center ${isDark ? "bg-green-700" : "bg-green-200"
                        }`}
                >
                    <p className={`${isDark ? "text-white" : "text-gray-600"} text-md`}>
                        Total Stock Value
                    </p>
                    <p
                        className={`${isDark ? "text-white" : "text-gray-800"} text-2xl font-semibold`}
                    >
                        Rs {overview?.totalStockValue}
                    </p>
                </div>


            </div>


            {/* Search */}
            <div
                className={`w-full flex justify-between items-center p-3 border-b ${isDark ? "border-gray-700 bg-[#24303f]" : "border-gray-300 bg-gray-50"
                    }`}
            >
                <TextField
                    label="Search"
                    type="text"
                    placeholder="Search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    className="w-full md:w-1/3"
                    InputLabelProps={{
                        style: { color: isDark ? "#cbd5e1" : undefined },
                    }}
                    InputProps={{
                        style: {
                            color: isDark ? "#f1f5f9" : undefined,
                            backgroundColor: isDark ? "#334155" : undefined,
                        },
                    }}
                />
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table
                    className={`w-full table-fixed text-sm ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                >
                    <thead
                        className={`sticky top-0 z-10 ${isDark ? "bg-[#24303f] border-gray-700" : "bg-blue-100 border-gray-300"
                            }`}
                    >
                        <tr>
                            <th
                                className="text-left px-3 py-2 font-bold cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                Name {renderSortIcon("name")}
                            </th>
                            <th
                                className="text-left px-3 py-2 font-bold cursor-pointer"
                                onClick={() => handleSort("category")}
                            >
                                Category {renderSortIcon("category")}
                            </th>
                            <th className="text-left px-3 py-2 font-bold">Total</th>
                            <th className="text-left px-3 py-2 font-bold">Sold</th>
                            <th
                                className="text-left px-3 py-2 font-bold cursor-pointer"
                                onClick={() => handleSort("remaining")}
                            >
                                Remaining {renderSortIcon("remaining")}
                            </th>
                            <th className="text-left px-3 py-2 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currProducts.map((product) => (
                            <tr
                                key={product.id}
                                className={`border-b ${isDark
                                    ? "border-gray-700 hover:bg-gray-800"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <td className="px-3 py-2">{product.name}</td>
                                <td className="px-3 py-2">{product.category}</td>
                                <td className="px-3 py-2">{product.total}</td>
                                <td className="px-3 py-2">{product.sold}</td>
                                <td className="px-3 py-2">{product.remaining}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${computeStatus(product.remaining) === "In Stock"
                                            ? "bg-green-500"
                                            : computeStatus(product.remaining) === "Low Stock"
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {computeStatus(product.remaining)}
                                    </span>

                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div
                className={`flex justify-end items-center gap-3 p-3 border-t text-md ${isDark ? "text-gray-300 border-gray-700" : "text-gray-700 border-gray-300"
                    }`}
            >
                <span>
                    Page <strong>{currPage}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                    onClick={() => setCurrPage((p) => p - 1)}
                    disabled={currPage === 1}
                    className={`px-2 py-1 border disabled:opacity-50 ${isDark
                        ? "border-gray-600 bg-[#24303f] hover:bg-gray-700"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                        }`}
                >
                    &lt;
                </button>
                <button
                    onClick={() => setCurrPage((p) => p + 1)}
                    disabled={currPage === totalPages}
                    className={`px-2 py-1 border disabled:opacity-50 ${isDark
                        ? "border-gray-600 bg-[#24303f] hover:bg-gray-700"
                        : "border-black/70 bg-gray-200 hover:bg-gray-100"
                        }`}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
