import Navbar from "./components/Admin/Navbar";
import { useState, useEffect } from "react";
import Sidebar from "./components/Admin/Sidebar";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/Products/ProductList";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import CreateProduct from "./pages/Admin/Products/CreateProduct";
import Stock from "./pages/Admin/Inventory/Stock";
import Sale from "./pages/Admin/Inventory/Sale";
import Report from "./pages/Admin/Report";
import AddStock from "./pages/Admin/Inventory/AddStock";
import { useDarkMode } from "./hook/DarkMode";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { isDark } = useDarkMode()
  const [forceCollapse, setForceCollapse] = useState<boolean>(false);

  // Force collapse for md screens
  useEffect(() => {
    const handleResize = () => setForceCollapse(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine final sidebar width
  const sidebarOpen = forceCollapse ? false : isOpen;

  return (
    <div className={`flex h-screen w-screen ${isDark ? "bg-[#1c2434]" : "bg-[#eff3f7]"}`}>

      {/* Sidebar */}
      <aside
        className={` bg-[#24303f] h-full px-2 flex flex-col transition-all duration-500 ${sidebarOpen ? "w-60" : "w-16"}`}
      >
        <div className={`flex ${sidebarOpen ? "justify-between" : "justify-center"} w-full items-center`}>
          <span className={`text-blue-200 font-bold text-2xl p-2 ${sidebarOpen ? "opacity-100 block" : "opacity-0 hidden"}`}>Diary</span>
          {!forceCollapse && (
            <button
              className={`p-4 focus:outline-none`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ?
                <PanelRightOpen className="flex-shrink-0 w-6 h-6 text-white" />
                :
                <PanelLeftOpen className="flex-shrink-0 w-6 h-6 text-white" />
              }
            </button>
          )}
        </div>

        <Sidebar isOpen={sidebarOpen} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Navbar 10% height */}
        <div className="h-[10%] border border-zinc-600">
          <Navbar />
        </div>

        {/* Main dashboard content 90% height, scrollable */}
        <div className="h-[90%] w-full">
          <Routes>

            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Products */}
            <Route path="/products/list" element={<ProductList />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/:id/edit" element={<CreateProduct />} />

            {/* Inventory */}
            <Route path="/inventory/stock" element={<Stock />} />
            <Route path="/inventory/add" element={<AddStock />} />
            <Route path="/inventory/sale" element={<Sale />} />

            {/* Report */}
            <Route path="/reports" element={<Report />} />

            {/* Not Found */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>

        </div>
      </main>
    </div>
  );
}

export default App;
