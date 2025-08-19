import { useState } from "react";
import SaleForm from "../../../components/Admin/SaleForm";
import { paginate } from "../../../utils/Pagination";

interface ISale {
    id: number;
    customer: string;
    product: string;
    qty: string;
    price: number;
    total: number;
}

function Sale() {
    const [currPage, setCurrentPage] = useState(1);

    // Dummy sale data
    const sales: ISale[] = [
        { id: 1, customer: "Ram Shrestha", product: "Milk", qty: "2 Ltr", price: 70, total: 140 },
        { id: 2, customer: "Sita Lama", product: "Butter", qty: "500 g", price: 450, total: 225 },
        { id: 3, customer: "Hari KC", product: "Cookies", qty: "2 Packet", price: 50, total: 100 },
        { id: 4, customer: "Gita Rana", product: "Curd", qty: "400 ml", price: 60, total: 24 },
        { id: 5, customer: "Mohan Basnet", product: "Cheese", qty: "1 Piece", price: 120, total: 120 },
        // add more dummy data for testing pagination
    ];

    const dataPerPage = 5;
    const { items: currSales, totalPages } = paginate<ISale>({
        items: sales,
        currentPage: currPage,
        itemsPerPage: dataPerPage,
    });

    return (
        <div className="w-full h-full overflow-y-auto flex flex-col bg-white shadow-md">
            {/* Sale Form */}
            <div className="p-4">
                <SaleForm />
            </div>

            {/* Sale Table */}
            <div className="flex-1 p-4">
                <h2 className="text-lg font-semibold mb-4">Sales Records</h2>
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col style={{ width: "50px" }} /> {/* ID */}
                        <col style={{ width: "25%" }} /> {/* Customer */}
                        <col style={{ width: "20%" }} /> {/* Product */}
                        <col style={{ width: "15%" }} /> {/* Qty */}
                        <col style={{ width: "15%" }} /> {/* Price */}
                        <col style={{ width: "15%" }} /> {/* Total */}
                    </colgroup>
                    <thead className="bg-blue-100 sticky top-0 z-10">
                        <tr>
                            <th className="text-left px-2 py-2 text-sm font-bold text-gray-700">ID</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Customer</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Product</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Quantity</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Price (Rs)</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Total (Rs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-sm text-gray-700">{sale.id}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{sale.customer}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{sale.product}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{sale.qty}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{sale.price}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{sale.total}</td>
                            </tr>
                        ))}
                        {sales.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-6">
                                    No sales found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 p-4">
                <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currPage === 1}
                    className="px-3 py-1 border disabled:opacity-50"
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border ${currPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currPage === totalPages}
                    className="px-3 py-1 border disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Sale;
