import {
  ClipboardList,
  Package,
  Cpu,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '@/components/StatCard/StatCard';
import {
  orders,
  machines,
  productionTrendData,
  qualityTrendData,
  weeklyEnergyData,
  defectDistribution,
} from '@/data/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const statusMap: Record<string, string> = {
  running: '运行中',
  idle: '空闲',
  maintenance: '维护中',
  offline: '离线',
};

export default function Dashboard() {
  const runningMachines = machines.filter((m) => m.status === 'running').length;
  const todayOrders = orders.filter((o) => o.status !== 'completed').length;
  const todayOutput = 7700;
  const passRate = 97.8;
  const todayEnergy = 408.1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="今日订单"
          value={todayOrders}
          subtitle="待处理订单"
          icon={ClipboardList}
          color="blue"
          trend={{ value: 12, isUp: true }}
        />
        <StatCard
          title="今日产量"
          value={todayOutput.toLocaleString()}
          subtitle="件"
          icon={Package}
          color="green"
          trend={{ value: 8.5, isUp: true }}
        />
        <StatCard
          title="运行机台"
          value={`${runningMachines}/${machines.length}`}
          subtitle="台"
          icon={Cpu}
          color="orange"
        />
        <StatCard
          title="质检合格率"
          value={`${passRate}%`}
          subtitle="本周平均"
          icon={ShieldCheck}
          color="green"
          trend={{ value: 1.2, isUp: true }}
        />
        <StatCard
          title="今日能耗"
          value={todayEnergy.toFixed(1)}
          subtitle="kWh"
          icon={Zap}
          color="purple"
          trend={{ value: 3.2, isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">生产趋势</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                产量
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                订单数
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="output"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="产量"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="订单数"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="section-title">设备状态</h3>
          <div className="space-y-3">
            {machines.slice(0, 5).map((machine) => (
              <div
                key={machine.id}
                className="flex items-center justify-between p-3 bg-industrial-50 rounded-lg hover:bg-industrial-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      machine.status === 'running'
                        ? 'bg-emerald-500 animate-pulse'
                        : machine.status === 'idle'
                        ? 'bg-amber-500'
                        : machine.status === 'maintenance'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-industrial-800 text-sm">
                      {machine.machineNo}
                    </p>
                    <p className="text-xs text-industrial-500">{machine.machineType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`status-badge status-${machine.status}`}
                  >
                    {statusMap[machine.status]}
                  </span>
                  <p className="text-xs text-industrial-500 mt-1">
                    {machine.tonnage}T · {machine.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-purple-500" />
            <h3 className="section-title mb-0">本周能耗</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="consumption" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="能耗(kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-500" />
            <h3 className="section-title mb-0">合格率趋势</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[90, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value}%`, '合格率']}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  fill="url(#colorPass)"
                />
                <defs>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-orange-500" />
            <h3 className="section-title mb-0">缺陷分布</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {defectDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {defectDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-industrial-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            <h3 className="section-title mb-0">进行中的订单</h3>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            查看全部
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>产品名称</th>
              <th>客户</th>
              <th>数量</th>
              <th>进度</th>
              <th>状态</th>
              <th>交期</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) => o.status !== 'completed')
              .slice(0, 5)
              .map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-sm">{order.orderNo}</td>
                  <td>{order.productName}</td>
                  <td>{order.customer}</td>
                  <td>{order.quantity.toLocaleString()} 件</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-industrial-100 rounded-full overflow-hidden min-w-[100px]">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{
                            width: `${(order.completedQuantity / order.quantity) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-industrial-500 w-12 text-right">
                        {Math.round((order.completedQuantity / order.quantity) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status === 'producing'
                        ? '生产中'
                        : order.status === 'scheduled'
                        ? '已排产'
                        : '待排产'}
                    </span>
                  </td>
                  <td className="text-industrial-500">{order.deliveryDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
