import { ArrowDownward, ArrowUpward, ShoppingCart, Warehouse, LocalAtm } from "@mui/icons-material";
import { useDarkMode } from "../../context/DarkMode";

function Cards() {
    const { isDark } = useDarkMode();

    // Base card classes
    const cardBase = `ring-1 rounded-xl p-4 flex flex-col gap-2 transition-colors duration-300`;
    const textBase = `text-sm font-medium transition-colors duration-300`;
    const valueBase = `text-2xl font-semibold transition-colors duration-300`;

    return (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">

            {/* Total Orders */}
            <div
                className={`${cardBase} ${isDark ? "bg-[#24303f] ring-[#3b4b5c] text-gray-200" : "bg-white ring-[#e2e9f0] text-gray-800"}`}
            >
                <div className="flex items-center justify-between">
                    <ShoppingCart className={`${isDark ? "text-blue-300" : "text-blue-400"} !w-8 !h-8`} />
                </div>
                <p className={valueBase}>10,000</p>
                <div className="flex items-center justify-between">
                    <span className={textBase}>Total Orders</span>
                    <span className="flex items-center text-green-500 font-semibold">
                        1.3% <ArrowUpward className="!w-4 !h-4 ml-1" />
                    </span>
                </div>
            </div>

            {/* Daily Revenue */}
            <div
                className={`${cardBase} ${isDark ? "bg-[#24303f] ring-[#3b4b5c] text-gray-200" : "bg-white ring-[#e2e9f0] text-gray-800"}`}
            >
                <div className="flex items-center justify-between">
                    <LocalAtm className={`${isDark ? "text-green-300" : "text-green-500"} !w-8 !h-8`} />
                </div>
                <p className={valueBase}>Rs. 3,000</p>
                <div className="flex items-center justify-between">
                    <span className={textBase}>Daily Revenue</span>
                    <span className="flex items-center text-red-500 font-semibold">
                        0.3% <ArrowDownward className="!w-4 !h-4 ml-1" />
                    </span>
                </div>
            </div>

            {/* Stock Info */}
            <div
                className={`${cardBase} ${isDark ? "bg-[#24303f] ring-[#3b4b5c] text-gray-200" : "bg-white ring-[#e2e9f0] text-gray-800"}`}
            >
                <div className="flex items-center justify-between">
                    <Warehouse className={`${isDark ? "text-orange-300" : "text-orange-500"} !w-8 !h-8`} />
                    <span className={`${textBase} ml-2`}>Inventory Status</span>
                </div>
                <div className={`${textBase} mt-2`}>
                    <div className="flex justify-between">
                        <span>Well Stocked</span>
                        <span className="font-semibold text-green-600">60</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Low Stock</span>
                        <span className="font-semibold text-yellow-500">40</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Out of Stock</span>
                        <span className="font-semibold text-red-500">10</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cards;
