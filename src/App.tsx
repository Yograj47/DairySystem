import Navbar from "./components/Admin/Navbar";
import { useState } from "react";
import Sidebar from "./components/Admin/Sidebar";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/Products/ProductList";
import Invoice from "./pages/Admin/Report";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import CreateProduct from "./pages/Admin/Products/CreateProduct";
import Stock from "./pages/Admin/Inventory/Stock";
import Purchase from "./pages/Admin/Inventory/AddStock";
import Sale from "./pages/Admin/Inventory/Sale";
import Report from "./pages/Admin/Report";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen w-screen bg-[#eff3f7]">

      {/* Sidebar */}
      <aside
        className={`bg-[#1c2434] h-full px-2 flex flex-col transition-all duration-500 ${isOpen ? "w-60" : "w-16"}`}
      >
        <div className={`flex ${isOpen ? "justify-between" : "justify-center"} w-full items-center`}>
          <span className={`text-blue-200 font-bold text-2xl p-2 ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}>Diary</span>
          <button
            className={`p-4 focus:outline-none`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ?
              <PanelRightOpen className="flex-shrink-0 w-6 h-6 text-white" />
              :
              <PanelLeftOpen className="flex-shrink-0 w-6 h-6 text-white" />
            }
          </button>
        </div>

        <Sidebar isOpen={isOpen} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Navbar 10% height */}
        <div className="h-[10%]">
          <Navbar />
        </div>

        {/* Main dashboard content 90% height, scrollable */}
        <div className="h-[90%] overflow-y-auto p-4 w-full">
          <Routes>

            {/* Main root / Dashboard Route */}
            <Route path="/" element={<Dashboard />} />

            {/* Products Route */}
            <Route path="/products/list" element={<ProductList />} />
            <Route path="/products/create" element={<CreateProduct />} />

            {/* Inventory Route */}
            <Route path="/inventory/stock" element={<Stock />} />
            <Route path="/inventory/purchase" element={<Purchase />} />
            <Route path="/inventory/sale" element={<Sale />} />

            {/* Report Route */}
            <Route path="/reports" element={<Report />} />

            {/* Not found route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
