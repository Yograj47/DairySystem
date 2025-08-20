import { Delete, Edit } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { paginate } from "../../../utils/Pagination";
import axios from 'axios'

export interface IProduct {
    id: string;
    name: string;
    category: string;
    saleRate: number;
    purchaseRate: number;
    unit: string;
}

function ProductList() {
    const [search, setSearch] = useState<string>("");
    const [currPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);

    const dataPerPage = 12;

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get("http://localhost:5000/products");
                setProducts(response.data);

            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchProduct();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
    );

    const { items: currProducts, totalPages } = paginate<IProduct>({
        items: filteredProducts,
        currentPage: currPage,
        itemsPerPage: dataPerPage,
    });

    return (
        <div className="h-full w-full bg-white p-4 shadow-md flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Products</h2>
                <Button variant="outlined" href="/products/create">
                    Add Product
                </Button>
            </div>

            {/* Search */}
            <div className="flex justify-between items-center mb-2">
                <TextField
                    label="Search"
                    type="text"
                    placeholder="Search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3"
                    size="small"
                />
                {selectedId && (
                    <div className="flex gap-2 ml-4">
                        <Link
                            to={`/products/${selectedId}/edit`}
                            className="px-3 py-1 border bg-blue-500 text-white flex items-center gap-1 hover:bg-blue-600"
                        >
                            <Edit fontSize="small" /> Edit
                        </Link>
                        <button
                            className="cursor-not-allowed px-3 py-1 border bg-gray-600 text-white flex items-center gap-1 hover:bg-gray-800"
                            onClick={() => alert(`Delete product ${selectedId}`)}
                        >
                            <Delete fontSize="small" /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col style={{ width: "40px" }} />
                        <col style={{ width: "50px" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                    </colgroup>
                    <thead className="bg-blue-100 sticky top-0 z-10">
                        <tr>
                            <th></th>
                            <th className="text-left px-2 py-2 text-sm font-bold text-gray-700">ID</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Name</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Category</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Purchase</th>
                            <th className="text-left px-3 py-2 text-sm font-bold text-gray-700">Sale</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currProducts.map((product) => (
                            <tr
                                key={product.id}
                                className={`hover:bg-gray-50 ${selectedId === product.id ? "bg-blue-50" : ""}`}
                            >
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        className="cursor-pointer"
                                        checked={selectedId === product.id}
                                        onChange={() =>
                                            setSelectedId(selectedId === product.id ? null : product.id)
                                        }
                                    />
                                </td>
                                <td className="px-2 py-2 text-sm text-gray-700">{product.id}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{product.name}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{product.category}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">
                                    {product.purchaseRate} / {product.unit}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-700">
                                    {product.saleRate} / {product.unit}
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 py-6">
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

export default ProductList;
