import { Delete, Edit } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { paginate } from "../../../utils/Pagination";
import type { IProduct } from "../../../interface/Product";
import { useProduct } from "../../../hook/ProductFetch";
import { useDarkMode } from "../../../hook/DarkMode";
import CreateProduct from "./CreateProductModal";
import { Ellipsis } from "lucide-react";

function ProductList() {
  const [search, setSearch] = useState<string>("");
  const [currPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(
    undefined
  );
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const { data: products, isLoading } = useProduct();
  const { isDark } = useDarkMode();

  const handleOpenModal = () => setProductModalOpen(true);

  const handleCloseModal = () => {
    setProductModalOpen(false);
    setSelectedProductId(undefined);
  };

  const toggleOpenMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEditClick = (id: string) => {
    setSelectedProductId(id);
    setProductModalOpen(true);
    setOpenMenuId(null);
  };

  const dataPerPage = 10;

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

  const allSelected =
    currProducts.length > 0 && selectedIds.length === currProducts.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(currProducts.map((p) => p.id));
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
    <>
      <div
        className={`h-full w-full flex flex-col border ${
          isDark
            ? "bg-[#1e293b] border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-3 border-b ${
            isDark
              ? "border-gray-700 bg-[#24303f]"
              : "border-gray-300 bg-gray-50"
          }`}
        >
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
            className="!shadow-none"
            onClick={handleOpenModal}
          >
            + Add Product
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto relative">
          <table
            className={`w-full text-sm ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <thead
              className={`border-y sticky top-0 z-10 ${
                isDark
                  ? "bg-[#24303f] border-gray-700"
                  : "bg-gray-100 border-gray-300"
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
                <th className="px-3 py-2 text-left font-medium">Cost</th>
                <th className="px-3 py-2 text-left font-medium">Base</th>
                <th className="px-3 py-2 text-center font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {currProducts.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b ${
                    isDark
                      ? `border-gray-700 hover:bg-gray-800 ${
                          selectedIds.includes(p.id) ? "bg-gray-700" : ""
                        }`
                      : `border-gray-300 hover:bg-gray-50 ${
                          selectedIds.includes(p.id) ? "bg-blue-50" : ""
                        }`
                  }`}
                >
                  <td className="py-2 px-2">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td className="px-2 py-2">{p.id}</td>
                  <td
                    className={`px-3 py-2 font-medium ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {p.name}
                  </td>
                  <td className="px-3 py-2">{p.category}</td>
                  <td className="px-3 py-2">
                    {p.purchaseRate} / {p.unit}
                  </td>
                  <td className="px-3 py-2">
                    {p.saleRate} / {p.unit}
                  </td>

                  {/* Action Menu */}
                  <td className="px-3 py-2 relative text-center">
                    <Button
                      onClick={() => toggleOpenMenu(p.id)}
                      className="!min-w-0 !p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Ellipsis className="w-5 h-5" />
                    </Button>

                    {/* Dropdown Menu */}
                    {openMenuId === p.id && (
                      <div
                        className={`absolute right-10 top-8 w-36 rounded-md shadow-lg z-20 overflow-hidden border ${
                          isDark
                            ? "bg-[#1e293b] border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <button
                          className={`flex items-center w-full px-3 py-2 text-sm gap-2 ${
                            isDark
                              ? "hover:bg-gray-700 text-gray-200"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={() => handleEditClick(p.id)}
                        >
                          <Edit fontSize="small" /> Edit
                        </button>
                        <button
                          className={`flex items-center w-full px-3 py-2 text-sm gap-2 ${
                            isDark
                              ? "hover:bg-gray-700 text-red-400"
                              : "hover:bg-gray-100 text-red-600"
                          }`}
                          onClick={() => {
                            // Handle delete here
                            setOpenMenuId(null);
                          }}
                        >
                          <Delete fontSize="small" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Click outside handler */}
          {openMenuId && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenMenuId(null)}
            ></div>
          )}
        </div>

        {/* Pagination */}
        <div
          className={`flex justify-end items-center gap-3 p-3 border-t text-sm ${
            isDark
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
            className={`px-2 py-1 border rounded disabled:opacity-50 ${
              isDark
                ? "border-gray-600 bg-[#24303f] hover:bg-gray-700"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            &lt;
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currPage === totalPages}
            className={`px-2 py-1 border rounded disabled:opacity-50 ${
              isDark
                ? "border-gray-600 bg-[#24303f] hover:bg-gray-700"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>

      <CreateProduct
        open={productModalOpen}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
    </>
  );
}

export default ProductList;
