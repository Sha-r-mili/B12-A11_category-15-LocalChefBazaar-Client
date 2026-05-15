import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Helmet } from "react-helmet-async";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7"];

const PlatformStats = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosSecure.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="text-center py-10">Loading stats...</div>;

  const barData = [
    { name: "Total Users", value: stats.totalUsers },
    { name: "Pending Orders", value: stats.ordersPending },
    { name: "Delivered Orders", value: stats.ordersDelivered },
    { name: "Total Payment ($)", value: stats.totalPayment },
  ];

  const pieData = [
    { name: "Pending", value: stats.ordersPending },
    { name: "Delivered", value: stats.ordersDelivered },
  ];

  return (
    <div>
      <Helmet><title>Platform Statistics | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Statistics</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Users", value: stats.totalUsers, color: "bg-orange-500" },
          { label: "Pending Orders", value: stats.ordersPending, color: "bg-blue-500" },
          { label: "Delivered Orders", value: stats.ordersDelivered, color: "bg-green-500" },
          { label: "Total Revenue", value: `$${stats.totalPayment}`, color: "bg-purple-500" },
        ].map((card, i) => (
          <div key={i} className={`${card.color} text-white rounded-2xl p-6 text-center shadow`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm mt-1 opacity-90">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview Bar Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders Pie Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100}
                dataKey="value" label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;