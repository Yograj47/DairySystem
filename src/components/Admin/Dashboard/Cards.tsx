import { ArrowDownward, ArrowUpward, ShoppingCart, Warehouse, LocalAtm } from "@mui/icons-material";

function Cards() {
    return (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {/* Total Orders */}
            <div className="bg-white ring-1 ring-[#e2e9f0] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <ShoppingCart className="text-blue-400 !w-8 !h-8" />
                </div>
                <p className="text-2xl font-medium">10,000</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Total Orders</span>
                    <span className="flex items-center text-green-500 font-semibold">
                        1.3% <ArrowUpward className="!w-4 !h-4 ml-1" />
                    </span>
                </div>
            </div>

            {/* Daily Revenue */}
            <div className="bg-white ring-1 ring-[#e2e9f0] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <LocalAtm className="text-green-500 !w-8 !h-8" />
                </div>
                <p className="text-2xl font-medium">Rs. 3,000</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Daily Revenue</span>
                    <span className="flex items-center text-red-500 font-semibold">
                        0.3% <ArrowDownward className="!w-4 !h-4 ml-1" />
                    </span>
                </div>
            </div>

            {/* Stock Info */}
            <div className="bg-white ring-1 ring-[#e2e9f0] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Warehouse className="text-orange-500 !w-8 !h-8" />
                    <span className="text-lg font-medium">Inventory Status</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
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
    )
}

export default Cards