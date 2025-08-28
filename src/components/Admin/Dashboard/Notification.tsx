import { useDarkMode } from "../../hook/DarkMode"

function Notification() {
    const { isDark } = useDarkMode()
    return (
        <div className={`h-full w-full flex flex-col rounded-2xl shadow-sm border transition-colors ${isDark ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
            }`}>
            <div
                className={`w-full flex justify-between items-center px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"
                    }`}
            >
                <h2
                    className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"
                        }`}
                >
                    Notification
                </h2>
            </div>
            <div className="p-2">

                <p className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"
                    }`}>Working On!!</p>
            </div>
        </div>
    )
}

export default Notification