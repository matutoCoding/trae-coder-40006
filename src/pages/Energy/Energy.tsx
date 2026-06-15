import { useState } from 'react';
import {
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
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
  Legend,
} from 'recharts';
import { energyRecords, weeklyEnergyData, machines } from '@/data/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const monthlyEnergyData = [
  { month: '1月', consumption: 12500, cost: 10625 },
  { month: '2月', consumption: 11800, cost: 10030 },
  { month: '3月', consumption: 13200, cost: 11220 },
  { month: '4月', consumption: 12800, cost: 10880 },
  { month: '5月', consumption: 14100, cost: 11985 },
  { month: '6月', consumption: 9800, cost: 8330 },
];

export default function Energy() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const totalConsumption = energyRecords.reduce((sum, r) => sum + r.powerConsumption, 0);
  const totalCost = energyRecords.reduce((sum, r) => sum + r.totalCost, 0);
  const totalRuntime = energyRecords.reduce((sum, r) => sum + r.runtime, 0);

  const machineEnergyData = energyRecords.map((record) => ({
    name: record.machineNo,
    consumption: record.powerConsumption,
    cost: record.totalCost,
  }));

  const sortedMachines = [...energyRecords].sort(
    (a, b) => b.powerConsumption - a.powerConsumption
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Zap size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">
                {totalConsumption.toFixed(1)}
              </p>
              <p className="text-sm text-industrial-500">今日能耗 (kWh)</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">
                ¥{totalCost.toFixed(2)}
              </p>
              <p className="text-sm text-industrial-500">今日电费</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">
                {totalRuntime.toFixed(1)}h
              </p>
              <p className="text-sm text-industrial-500">总运行时长</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">-5.2%</p>
              <p className="text-sm text-industrial-500">较昨日</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title mb-0 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary-600" />
            能耗趋势
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                period === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-industrial-500 hover:bg-industrial-100'
              }`}
            >
              本周
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                period === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-industrial-500 hover:bg-industrial-100'
              }`}
            >
              本月
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm ml-2">
              <Download size={16} />
              导出
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {period === 'week' ? (
              <LineChart data={weeklyEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="能耗(kWh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cost"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="费用(元)"
                />
              </LineChart>
            ) : (
              <BarChart data={monthlyEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} name="能耗(kWh)" />
                <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} name="费用(元)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <h3 className="section-title flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary-600" />
            各机台能耗分布
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={machineEnergyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="consumption"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {machineEnergyData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value} kWh`, '能耗']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-industrial-700">能耗排名</h4>
              {sortedMachines.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-3 bg-industrial-50 rounded-lg"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-amber-100 text-amber-700'
                        : index === 1
                        ? 'bg-industrial-200 text-industrial-700'
                        : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-industrial-100 text-industrial-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-industrial-800 text-sm">
                        {record.machineNo}
                      </span>
                      <span className="text-sm font-bold text-primary-600">
                        {record.powerConsumption} kWh
                      </span>
                    </div>
                    <div className="h-1.5 bg-industrial-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(record.powerConsumption / sortedMachines[0].powerConsumption) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="section-title">能耗明细</h3>
          <div className="space-y-3">
            {energyRecords.map((record) => {
              const machine = machines.find((m) => m.id === record.machineId);

              return (
                <div
                  key={record.id}
                  className="p-4 bg-industrial-50 rounded-lg hover:bg-industrial-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-industrial-800">
                      {record.machineNo}
                    </span>
                    <span
                      className={`status-badge ${
                        machine?.status === 'running' ? 'status-running' : 'status-idle'
                      }`}
                    >
                      {machine?.status === 'running' ? '运行中' : '空闲'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-industrial-500">能耗: </span>
                      <span className="font-medium text-blue-600">
                        {record.powerConsumption} kWh
                      </span>
                    </div>
                    <div>
                      <span className="text-industrial-500">费用: </span>
                      <span className="font-medium text-emerald-600">
                        ¥{record.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-industrial-500">时长: </span>
                      <span className="font-medium">{record.runtime}h</span>
                    </div>
                    <div>
                      <span className="text-industrial-500">单价: </span>
                      <span className="font-medium">¥{record.unitCost}/kWh</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title mb-0">能耗记录</h3>
          <div className="flex items-center gap-2">
            <input type="date" className="input-field w-40" />
            <select className="select-field w-40">
              <option>全部机台</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.machineNo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>机台</th>
                <th>日期</th>
                <th>运行时长</th>
                <th>耗电量 (kWh)</th>
                <th>单价 (元/kWh)</th>
                <th>电费 (元)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {energyRecords.map((record) => (
                <tr key={record.id}>
                  <td className="font-medium">{record.machineNo}</td>
                  <td>{record.date}</td>
                  <td>{record.runtime}h</td>
                  <td className="font-mono text-blue-600">
                    {record.powerConsumption}
                  </td>
                  <td>{record.unitCost}</td>
                  <td className="font-mono text-emerald-600 font-semibold">
                    ¥{record.totalCost.toFixed(2)}
                  </td>
                  <td>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
