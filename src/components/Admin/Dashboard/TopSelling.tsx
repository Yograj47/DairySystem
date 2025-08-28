import { generateRandomColor } from "../../../utils/RandomColor";
import { useDarkMode } from "../../hook/DarkMode";
import { useSales } from "../../hook/SaleFetch";

interface SaleData {
    product: string;
    qty: number;
}

function TopSelling() {
    const { isDark } = useDarkMode();
    const { data: sales } = useSales();

    if (!sales) return null;

    const saleData: SaleData[] = sales.flatMap((sale) =>
        sale.products.map((product) => ({
            product: product.name,
            qty: product.qty,
        }))
    );

    const mergedSaleData = saleData.reduce((acc, curr) => {
        const existing = acc.find((p) => p.product === curr.product);
        if (existing) {
            existing.qty += curr.qty;
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, [] as SaleData[]);

    const totalSale = mergedSaleData.reduce((acc, curr) => acc + curr.qty, 0);

    const calculateSalePercent = (qty: number) => {
        return ((qty / totalSale) * 100).toFixed(1); // %
    };

    return (
        <div
            className={`h-full w-full flex flex-col rounded-2xl shadow-sm border transition-colors ${isDark ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
                }`}
        >
            {/* Header */}
            <div
                className={`w-full flex justify-between items-center px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"
                    }`}
            >
                <h2
                    className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"
                        }`}
                >
                    Top Selling Products
                </h2>
            </div>

            {/* List */}
            <div className="p-4">
                <ul className="flex flex-col gap-4">
                    {mergedSaleData.map((p, i) => {
                        const percent = calculateSalePercent(p.qty);
                        return (
                            <li key={i} className="flex flex-col gap-1">
                                {/* Product name and quantity */}
                                <div className="flex justify-between items-center">
                                    <span
                                        className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"
                                            }`}
                                    >
                                        {p.product}
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"
                                            }`}
                                    >
                                        {percent}%
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div
                                    className={`h-3 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"
                                        }`}
                                >
                                    <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{
                                            width: `${percent}%`,
                                            background: `${generateRandomColor()}`
                                        }}
                                    ></div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default TopSelling;
