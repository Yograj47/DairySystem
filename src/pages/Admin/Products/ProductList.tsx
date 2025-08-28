import { Delete, Edit } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { paginate } from "../../../utils/Pagination";
import type { IProduct } from "../../../utils/interface/Product";
import { useProduct } from "../../../components/hook/ProductFetch";
import { useDarkMode } from "../../../components/hook/DarkMode";

function ProductList() {
    const [search, setSearch] = useState<string>("");
    const [currPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data: products, isLoading } = useProduct();
    const { isDark } = useDarkMode();

    const dataPerPage = 12;

    const filteredProducts = products
        ? products.filter(
            (product) =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    const { items: currProducts, totalPages } = paginate<IProduct>({
        items: filteredProducts,
        currentPage: currPage,
        itemsPerPage: dataPerPage,
    });

    const allSelected = currProducts.length > 0 && selectedIds.length === currProducts.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currProducts.map((p) => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                Loading products...
            </div>
        );
    }

    return (
        <div
            className={`h-full w-full p-0 flex flex-col border ${isDark ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-300"
                }`}
        >
            {/* Header */}
            <div
                className={`w-full flex justify-between items-center p-3 border-b ${isDark ? "border-gray-700 bg-[#24303f]" : "border-gray-300 bg-gray-50"
                    }`}
            >
                {/* Search */}
                <div className="flex-1 mr-4">
                    <TextField
                        label="Search"
                        type="text"
                        placeholder="Search by name or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        size="small"
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
                <Button
                    variant="contained"
                    color="primary"
                    href="/products/create"
                    className="!shadow-none"
                >
                    + Add Product
                </Button>
            </div>

            {/* Action buttons */}
            {selectedIds.length > 0 && (
                <div
                    className={`flex gap-3 p-3 border-b ${isDark ? "border-gray-700 bg-[#24303f]" : "border-gray-300 bg-gray-50"
                        }`}
                >
                    {selectedIds.length === 1 && (
                        <Link
                            to={`/products/${selectedIds[0]}/edit`}
                            className={`px-3 py-1 border flex items-center gap-2 transition ${isDark
                                ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                                : "border-gray-400 text-black hover:bg-gray-100"
                                }`}
                        >
                            <Edit fontSize="small" /> Edit
                        </Link>
                    )}
                    <button
                        className={`px-3 py-1 border flex items-center gap-2 cursor-pointer transition ${isDark
                            ? "border-gray-600 text-red-400 hover:bg-red-500 hover:text-white"
                            : "border-gray-400 text-red-600 hover:bg-red-100"
                            }`}
                        onClick={() => alert(`Delete products: ${selectedIds.join(", ")}`)}
                    >
                        <Delete fontSize="small" /> Delete
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table
                    className={`w-full text-sm ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                >
                    <colgroup>
                        <col style={{ width: "20px" }} />
                        <col style={{ width: "50px" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                    </colgroup>
                    <thead
                        className={`border-y sticky top-0 z-10 ${isDark ? "bg-[#24303f] border-gray-700" : "bg-gray-100 border-gray-300"
                            }`}
                    >
                        <tr>
                            <th className="px-2 py-2 text-left font-medium">
                                <input
                                    type="checkbox"
                                    className="cursor-pointer"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-2 py-2 text-left font-medium">ID</th>
                            <th className="px-3 py-2 text-left font-medium">Name</th>
                            <th className="px-3 py-2 text-left font-medium">Category</th>
                            <th className="px-3 py-2 text-left font-medium">Purchase</th>
                            <th className="px-3 py-2 text-left font-medium">Sale</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currProducts.map((product) => (
                            <tr
                                key={product.id}
                                className={`border-b ${isDark
                                    ? `border-gray-700 hover:bg-gray-800 ${selectedIds.includes(product.id)
                                        ? "bg-gray-700"
                                        : ""
                                    }`
                                    : `border-gray-300 hover:bg-gray-50 ${selectedIds.includes(product.id)
                                        ? "bg-blue-50"
                                        : ""
                                    }`
                                    }`}
                            >
                                <td className="py-2 px-2">
                                    <input
                                        type="checkbox"
                                        className="cursor-pointer"
                                        checked={selectedIds.includes(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                    />
                                </td>
                                <td className="px-2 py-2">{product.id}</td>
                                <td
                                    className={`px-3 py-2 font-medium ${isDark ? "text-gray-100" : "text-gray-900"
                                        }`}
                                >
                                    {product.name}
                                </td>
                                <td className="px-3 py-2">{product.category}</td>
                                <td className="px-3 py-2">
                                    {product.purchaseRate} / {product.unit}
                                </td>
                                <td className="px-3 py-2">
                                    {product.saleRate} / {product.unit}
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
                className={`flex justify-end items-center gap-3 p-3 border-t text-sm ${isDark ? "text-gray-300 border-gray-700" : "text-gray-700 border-gray-300"
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

export default ProductList;
