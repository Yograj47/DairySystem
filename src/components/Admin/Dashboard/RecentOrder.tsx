import { useState, useEffect } from "react";

export interface IRecentPurchase {
    id: number;
    customerName: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

function RecentPurchasesTable() {
    const [purchases, setPurchases] = useState<IRecentPurchase[]>([]);

    useEffect(() => {
        const data: IRecentPurchase[] = [
            { id: 1, customerName: "John Doe", productName: "Whole Milk 1L", quantity: 2, price: 60, total: 120 },
            { id: 2, customerName: "Jane Smith", productName: "Paneer 200g", quantity: 1, price: 90, total: 90 },
            { id: 3, customerName: "Alice Brown", productName: "Butter 100g", quantity: 3, price: 85, total: 255 },
            { id: 4, customerName: "Bob Johnson", productName: "Ghee 500ml", quantity: 1, price: 450, total: 450 },
            { id: 5, customerName: "Bob Johnson", productName: "Ghee 500ml", quantity: 1, price: 450, total: 450 },
            { id: 6, customerName: "Mary Lee", productName: "Skimmed Milk 1L", quantity: 2, price: 55, total: 110 },
        ];
        setPurchases(data);
    }, []);

    const heads = ['Customer', 'Product', 'Quantity', 'Price', 'Total'];
    const dataStyle = "px-4 py-2 text-sm text-gray-700";

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col h-full">
            <h2 className="text-lg font-normal mb-4">Recent Sale</h2>

            {/* Table wrapper with scroll */}
            <div className="overflow-y-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-100 sticky top-0">
                        <tr>
                            {heads.map((head, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2 text-left text-sm font-bold text-gray-700"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200">
                        {purchases.map((purchase, index) => (
                            <tr key={index}>
                                <td className={dataStyle}>{purchase.customerName}</td>
                                <td className={dataStyle}>{purchase.productName}</td>
                                <td className={dataStyle}>{purchase.quantity}</td>
                                <td className={dataStyle}>₹{purchase.price}</td>
                                <td className={dataStyle}>₹{purchase.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentPurchasesTable;
