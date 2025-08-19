import { Bell, ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [isOpen, setOpen] = useState(false);

    return (
        <header className="relative bg-white text-black px-6 py-3 flex justify-between items-center shadow-md">
            {/* Search bar */}
            <div className="flex items-center ring-2 ring-gray-100 rounded-md overflow-hidden focus-within:outline-2 focus-within:outline-blue-500">
                <Search className="w-5 h-5 mx-2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-2 py-1 outline-none text-sm w-64"
                />
            </div>
            <div className="flex gap-2">
                {/* Other icons */}
                <div className="flex items-center gap-2">
                    <button className="relative h-8 w-14 px-3 py-1 rounded-xl bg-gray-300 transition-colors text-sm font-medium">
                        <p className="absolute left-1 top-50% -translate-y-1/2 h-6 w-6 shadow-xs shadow-black/50 bg-white rounded-full"></p>
                    </button>
                    <button className="p-2 rounded-full bg-blue-100/75 hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>

                {/* User menu */}
                <div>
                    <button
                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
                        onClick={() => setOpen(!isOpen)}
                    >
                        <User className="w-6 h-6" />
                        <span className="hidden md:inline font-medium text-blue-500">Admin</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown menu */}
                    {isOpen && (
                        <div className="absolute right-0 -bottom-20 w-48 bg-white text-black border border-black/25 rounded-md shadow-lg shadow-blue-200 overflow-hidden z-50">
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                <Settings className="w-5 h-5" /> Account Setting
                            </Link>
                            <Link
                                to="/logout"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
