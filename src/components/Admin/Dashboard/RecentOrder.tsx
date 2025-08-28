import { useState } from "react";
import { useDarkMode } from "../../hook/DarkMode";
import { useSales } from "../../hook/SaleFetch";
import { paginate } from "../../../utils/Pagination";

function RecentSaleTable() {
    const { data: sales } = useSales();
    const { isDark } = useDarkMode();

    const [currPage, setCurrentPage] = useState(1);
    const dataPerPage = 7;

    if (!sales) return null;

    const rows = sales.slice(0, 7).flatMap((sale, saleIndex) =>
        sale.products.map((product, productIndex) => ({
            id: `${saleIndex}-${productIndex}`,
            customer: sale.customerName,
            product: product.name,
            qty: product.qty,
            rate: product.rate,
            total: product.total,
        }))
    );

    const { items: currRows, totalPages } = paginate({
        items: rows,
        currentPage: currPage,
        itemsPerPage: dataPerPage,
    });

    return (
        <div
            className={`h-full w-full flex flex-col rounded-2xl shadow-sm border transition-colors ${isDark
                ? "bg-[#1e293b] border-gray-700"
                : "bg-white border-gray-300"
                }`}>
            {/* Header */}
            <div
                className={`w-full flex justify-between items-center p-3 border-b ${isDark
                    ? "border-gray-700"
                    : "border-gray-300"
                    }`}
            >
                <h2 className={`${isDark ? "text-white" : "text-gray-800"} text-lg font-medium`}>
                    Recent Sales
                </h2>
            </div>

            {/* Table */}
            <div className="h-full">
                <table
                    className={`w-full text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                    <thead
                        className={`border-y ${isDark
                            ? "bg-[#24303f] border-gray-700"
                            : "bg-gray-100 border-gray-300"
                            }`}
                    >
                        <tr>
                            <th className="px-3 py-2 text-left font-medium">Customer</th>
                            <th className="px-3 py-2 text-left font-medium">Product</th>
                            <th className="px-3 py-2 text-left font-medium">Qty</th>
                            <th className="px-3 py-2 text-left font-medium">Rate</th>
                            <th className="px-3 py-2 text-left font-medium">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currRows.map((row) => (
                            <tr
                                key={row.id}
                                className={`border-b transition ${isDark
                                    ? "border-gray-700 hover:bg-gray-800"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <td className="px-3 py-2">{row.customer}</td>
                                <td className="px-3 py-2">{row.product}</td>
                                <td className="px-3 py-2">{row.qty}</td>
                                <td className="px-3 py-2">₹{row.rate}</td>
                                <td className="px-3 py-2">₹{row.total}</td>
                            </tr>
                        ))}

                        {rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                >
                                    No sales found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div
                className={`flex justify-end items-center gap-3 p-3 border-t text-sm ${isDark
                    ? "text-gray-300 border-gray-700"
                    : "text-gray-700 border-gray-300"
                    }`}
            >
                <span>
                    Page <strong>{currPage}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currPage === 1}
                    className={`px-2 py-1 border disabled:opacity-50 ${isDark
                        ? "border-gray-600 bg-[#24303f] hover:bg-gray-700"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                        }`}
                >
                    &lt;
                </button>
                <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currPage === totalPages}
                    className={`px-2 py-1 border disabled:opacity-50 ${isDark
                        ? "border-gray-600 bg-[#24303f] hover:bg-gray-700"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                        }`}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default RecentSaleTable;
