import Cards from "../../components/Admin/Dashboard/Cards";
import Chart from "../../components/Admin/Dashboard/Chart";
import RecentPurchasesTable from "../../components/Admin/Dashboard/RecentOrder";


function AdminDashboard() {

    return (
        <div className="flex flex-col h-full gap-4">
            <Cards />

            {/* Chart + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-1/2">
                {/* Chart takes 70% → 8/12 columns */}
                <div className="col-span-12 lg:col-span-7 h-full">
                    <Chart />
                </div>

                {/* Table takes 30% → 4/12 columns */}
                <div className="col-span-12 lg:col-span-5 h-full">
                    <RecentPurchasesTable />
                </div>
            </div>

            {/* Stock + Notification */}
            <div>
                <div></div>
                <div></div>
            </div>

        </div>
    );
}

export default AdminDashboard;
