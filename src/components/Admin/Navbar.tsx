import { Bell, Moon, Sun, X } from "lucide-react";
import pp from "../../assets/pp.jpg"
import { useDarkMode } from "../../hook/DarkMode";
import { useState } from "react";

function Navbar() {
    const { isDark, toggleDark } = useDarkMode()
    const [isNotfiyOpen, setNotfiyOpen] = useState<boolean>(false);
    return (
        <header className={`h-full w-full z-50 ${isDark ? "bg-[#24303f] text-white" : "bg-white  text-black"} px-6 py-3 gap-12 flex justify-end items-center `}>

            {/* Other icons */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleDark}
                    className={` relative h-8 w-16 rounded-full flex items-center transition-colors duration-500 ease-in-out
                         ${isDark ? "bg-gradient-to-r from-indigo-800 to-purple-700" : "bg-gradient-to-r from-yellow-300 to-orange-400"}`}
                >
                    <span
                        className={` absolute flex items-center justify-center h-7 w-7 rounded-full shadow-lg top-1/2 -translate-y-1/2
                            transition-all duration-500 ease-in-out cursor-pointer
                            ${isDark ? "translate-x-8 bg-gray-900 text-yellow-300" : "translate-x-1 bg-white text-yellow-500"} `}>
                        {isDark ? <Moon size={16} /> : <Sun size={16} />}
                    </span>
                </button>
                <button className={`p-2 rounded-full text-white ${isDark ? " bg-indigo-600 hover:bg-indigo-400" : "bg-gray-500 hover:bg-gray-700"} cursor-pointer transition-all duration-150`} onClick={() => alert("Generic Button")}>
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* user icon */}
            <div className="flex flex-col items-center">
                <img src={pp} alt="pp" className="h-10 w-10 rounded-full" />
            </div>

            <div className={` ${isNotfiyOpen ? "block" : "hidden"} p-2 absolute z-50 right-0 bottom-0 md:w-[25%] w-[35%] h-full border-l border-black/50 ${isDark ? "bg-[#24303f]" : "bg-white"}`}>
                <div className={`rounded-full hover: bg-gray-300 w-8 h-8 flex justify-center items-center cursor-pointer`} onClick={() => setNotfiyOpen(false)}>
                    <X />
                </div>
                <div className="mt-2">
                    <h2>Notification</h2>
                    <div></div>
                </div>
            </div>
        </header >
    );
}

export default Navbar;
