import { LayoutDashboard, Box, Archive, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
}

function Sidebar({ isOpen }: SidebarProps) {
    const iconStyle = "h-6 w-6";
    const location = useLocation();

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleSubMenu = (name: string) => {
        setOpenMenu((prev) => (prev === name ? null : name));
    };

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard className={iconStyle} />, path: "/" },
        {
            name: "Products",
            icon: <Box className={iconStyle} />,
            path: "/products",
            subMenu: [
                { name: "Create", path: "/products/create" },
                { name: "List", path: "/products/list" },
            ],
        },
        {
            name: "Inventory",
            icon: <Archive className={iconStyle} />,
            path: "/inventory",
            subMenu: [
                { name: "Stock", path: "/inventory/stock" },
                { name: "Purchase", path: "/inventory/purchase" },
                { name: "Sale", path: "/inventory/sale" },
            ],
        },
        { name: "Report", icon: <FileText className={iconStyle} />, path: "/reports" },
    ];

    return (
        <nav className="flex-1 mt-4 flex flex-col gap-2">
            {menuItems.map((item) => {
                const isActive =
                    item.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.path);

                if (item.subMenu) {
                    const isOpenSub = openMenu === item.name;

                    return (
                        <div key={item.name} className="relative flex flex-col">
                            {/* Parent Button */}
                            <button
                                onClick={() => toggleSubMenu(item.name)}
                                className={`flex items-center rounded p-2 transition-colors duration-300
                  ${isOpen ? "gap-4 justify-start" : "justify-center"}
                  ${isActive ? "bg-[#636e7e] text-white" : "text-white hover:bg-[#333a48]"}
                `}
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <div
                                    className={`overflow-hidden transition-all duration-300 
                    ${isOpen ? "max-w-[200px] ml-2 opacity-100" : "max-w-0 opacity-0"}
                  `}
                                >
                                    {item.name}
                                </div>
                                {isOpen && (
                                    <ChevronDown
                                        className={`cursor-pointer ml-auto w-4 h-4 transition-transform duration-300 ${isOpenSub ? "rotate-180" : ""
                                            }`}
                                    />
                                )}
                            </button>

                            {/* Submenu */}
                            {isOpenSub && (
                                <div
                                    className={`flex flex-col gap-1 mt-1
                    ${isOpen ? "ml-3 relative" : "absolute left-[115%] -top-1 bg-[#2b303b] p-2 shadow-lg min-w-[150px] z-50"}
                  `}
                                >
                                    {item.subMenu.map((sub) => {
                                        const isSubActive = location.pathname === sub.path;
                                        return (
                                            <Link
                                                key={sub.name}
                                                to={sub.path}
                                                className={`rounded p-2 text-sm transition-colors duration-300 whitespace-nowrap
                          ${isSubActive ? "text-blue-400" : "hover:text-blue-200 text-gray-200"}
                        `}
                                            >
                                                {sub.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center rounded p-2 transition-colors duration-300
              ${isOpen ? "gap-4 justify-start" : "justify-center"}
              ${isActive ? "bg-[#636e7e] text-white" : "text-white hover:bg-[#333a48]"}
            `}
                    >
                        <div className="flex-shrink-0">{item.icon}</div>
                        <div
                            className={`overflow-hidden transition-all duration-300 
                ${isOpen ? "max-w-[200px] ml-2 opacity-100" : "max-w-0 opacity-0"}
              `}
                        >
                            {item.name}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}

export default Sidebar;
