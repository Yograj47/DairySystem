import Cards from "../../components/Admin/Dashboard/Cards";
import Chart from "../../components/Admin/Dashboard/Chart";
import Notification from "../../components/Admin/Dashboard/Notification";
import RecentSaleTable from "../../components/Admin/Dashboard/RecentOrder";
import TopSelling from "../../components/Admin/Dashboard/TopSelling";

function AdminDashboard() {

    return (
        <div className="flex flex-col gap-4 h-full overflow-auto scrollbar-thin p-3">
            <Cards />

            {/* Chart + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[400px]">

                {/* Chart */}
                <div className="col-span-12 lg:col-span-7 h-full">
                    <Chart />
                </div>

                {/* Table */}
                <div className="col-span-12 lg:col-span-5 h-full">
                    <RecentSaleTable />
                </div>
            </div>

            {/* Top Selling + Notification */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-5 h-full">
                    <TopSelling />
                </div>
                <div className="col-span-12 lg:col-span-7 h-full">
                    <Notification />
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;
