import React from 'react';
import { 
  Search,
  Bell,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Users
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TagIcon } from '@heroicons/react/outline';

const HomePage = () => {
  const stats = [
    { title: "Job Owner", value: "PT Angkasapura", icon: <Briefcase className="h-6 w-6 text-gray-500" /> },
    { title: "Contract Duration", value: "2 Years", change: "15-04-2024 to 19-07-2026", icon: <Calendar className="h-6 w-6 text-gray-500" /> },
    { title: "Contract Value", value: "Rp. 210.529.000.000,-", change: "Source: APBN", icon: <DollarSign className="h-6 w-6 text-gray-500" /> },
    { title: "Project Leader", value: "Mahfud Wibowo,S.Tr.I", icon: <User className="h-6 w-6 text-gray-500" /> },
    { title: "Project Member", value: "5 Members", icon: <Users className="h-6 w-6 text-gray-500" /> },
    { title: "Line of Business", value: "Infrasturktur", icon: <TagIcon className="h-6 w-6 text-gray-500" /> },
  ];

  // Data dummy untuk chart
  const revenueData = [
    { name: 'Jan', revenue: 4000, users: 2400 },
    { name: 'Feb', revenue: 3000, users: 1398 },
    { name: 'Mar', revenue: 2000, users: 9800 },
    { name: 'Apr', revenue: 2780, users: 3908 },
    { name: 'May', revenue: 1890, users: 4800 },
    { name: 'Jun', revenue: 2390, users: 3800 },
    { name: 'Jul', revenue: 3490, users: 4300 },
  ];

  const monthlyStats = [
    { name: 'Jan', sales: 65, profit: 45, cost: 20 },
    { name: 'Feb', sales: 75, profit: 55, cost: 20 },
    { name: 'Mar', sales: 85, profit: 60, cost: 25 },
    { name: 'Apr', sales: 95, profit: 65, cost: 30 },
    { name: 'May', sales: 105, profit: 70, cost: 35 },
    { name: 'Jun', sales: 115, profit: 75, cost: 40 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="text-xl font-semibold">Pengembangan Bandar Udara Internasional Lombok Praya</div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button className="relative p-2">
                <Bell className="h-6 w-6 text-gray-500" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
            </div>
          </div>
        </header>

        {/* Main Content Area */}
          <main className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
              {stats.map((stat, index) => (
                <div 
            key={index} 
            className="bg-white rounded-lg p-6 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg"
                >
            <div className="flex items-center">
              {stat.icon}
              <h3 className="text-gray-500 text-sm font-medium ml-2">{stat.title}</h3>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <span className="text-green-500 text-sm font-medium">
                {stat.change}
              </span>
            </div>
                </div>
              ))}
            </div>

            {/* Chart Sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue & Users Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Revenue & Users Overview</h2>
                <select className="border rounded-lg px-4 py-2">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Stats Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Monthly Statistics</h2>
                <select className="border rounded-lg px-4 py-2">
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" />
                    <Bar dataKey="profit" fill="#82ca9d" />
                    <Bar dataKey="cost" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="mt-6 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map((item) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Payment #{item}
                            </div>
                            <div className="text-sm text-gray-500">
                              transaction_{item}@example.com
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(Math.random() * 1000).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        2024-12-{item}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;