import { useState } from 'react';
import {
  Factory,
  Play,
  Square,
  Clock,
  Package,
  Cpu,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { moldingCycles, machines, orders } from '@/data/mockData';

const cycleTimeData = [
  { time: '08:00', cycle: 35, target: 35 },
  { time: '09:00', cycle: 34.5, target: 35 },
  { time: '10:00', cycle: 35.2, target: 35 },
  { time: '11:00', cycle: 34.8, target: 35 },
  { time: '12:00', cycle: 36.1, target: 35 },
  { time: '13:00', cycle: 35.5, target: 35 },
  { time: '14:00', cycle: 34.9, target: 35 },
  { time: '15:00', cycle: 35.0, target: 35 },
];

const hourlyOutput = [
  { hour: '8点', output: 680 },
  { hour: '9点', output: 720 },
  { hour: '10点', output: 695 },
  { hour: '11点', output: 710 },
  { hour: '12点', output: 450 },
  { hour: '13点', output: 685 },
  { hour: '14点', output: 700 },
  { hour: '15点', output: 715 },
];

export default function Molding() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'records'>('monitor');

  const runningCycles = moldingCycles.filter((c) => c.status === 'running');
  const todayShots = moldingCycles.reduce((sum, c) => sum + c.shotCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Factory size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{runningCycles.length}</p>
              <p className="text-sm text-industrial-500">生产中</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <BarChart3 size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{todayShots.toLocaleString()}</p>
              <p className="text-sm text-industrial-500">今日模次</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Package size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">5,420</p>
              <p className="text-sm text-industrial-500">今日产量(件)</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">34.8s</p>
              <p className="text-sm text-industrial-500">平均周期</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-1 mb-6 border-b border-industrial-100 -mx-5 -mt-1 px-5">
          {[
            { key: 'monitor', label: '实时监控', icon: Cpu },
            { key: 'records', label: '成型记录', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary-600 border-primary-600'
                    : 'text-industrial-500 border-transparent hover:text-industrial-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {runningCycles.map((cycle) => {
                const machine = machines.find((m) => m.id === cycle.machineId);
                const order = orders.find((o) => o.id === cycle.orderId);

                return (
                  <div
                    key={cycle.id}
                    className="p-5 bg-industrial-50 rounded-xl border border-industrial-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Factory size={24} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-industrial-800">
                            {cycle.machineNo}
                          </p>
                          <p className="text-sm text-industrial-500">{machine?.machineType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="status-badge status-running">运行中</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">产品</span>
                        <span className="font-medium text-industrial-700">
                          {cycle.productName}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">订单号</span>
                        <span className="font-mono text-industrial-700">
                          {cycle.orderNo}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">开始时间</span>
                        <span className="text-industrial-700">{cycle.startTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">成型周期</span>
                        <span className="font-bold text-primary-600">{cycle.cycleTime}s</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-industrial-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-industrial-500">累计模次</span>
                        <span className="font-bold text-emerald-600">
                          {cycle.shotCount.toLocaleString()} 模
                        </span>
                      </div>
                      <div className="h-2 bg-industrial-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
                          style={{ width: `${Math.min((cycle.shotCount / 2000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 text-sm bg-white border border-industrial-200 rounded-lg hover:bg-industrial-100 transition-colors flex items-center justify-center gap-1">
                        <RefreshCw size={16} />
                        刷新
                      </button>
                      <button className="flex-1 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                        <Square size={16} />
                        停机
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 bg-white border border-industrial-200 rounded-xl">
                <h4 className="font-semibold text-industrial-800 mb-4">周期时间趋势</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cycleTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[30, 40]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cycle"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 3 }}
                        name="周期(s)"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="目标(s)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-5 bg-white border border-industrial-200 rounded-xl">
                <h4 className="font-semibold text-industrial-800 mb-4">小时产量</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyOutput}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="output" fill="#10b981" radius={[4, 4, 0, 0]} name="产量(件)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select className="select-field w-40">
                  <option>全部机台</option>
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>{m.machineNo}</option>
                  ))}
                </select>
                <input type="date" className="input-field w-40" />
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Play size={16} />
                开始生产
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>机台</th>
                    <th>订单号</th>
                    <th>产品名称</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>模次</th>
                    <th>周期</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {moldingCycles.map((cycle) => (
                    <tr key={cycle.id}>
                      <td className="font-medium">{cycle.machineNo}</td>
                      <td className="font-mono text-primary-600">{cycle.orderNo}</td>
                      <td>{cycle.productName}</td>
                      <td>{cycle.startTime}</td>
                      <td>{cycle.endTime || '-'}</td>
                      <td>{cycle.shotCount.toLocaleString()}</td>
                      <td>{cycle.cycleTime}s</td>
                      <td>
                        <span
                          className={`status-badge ${
                            cycle.status === 'running'
                              ? 'status-running'
                              : 'status-completed'
                          }`}
                        >
                          {cycle.status === 'running' ? '生产中' : '已完成'}
                        </span>
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

            <div className="flex items-center justify-between pt-4 border-t border-industrial-100">
              <p className="text-sm text-industrial-500">
                共 {moldingCycles.length} 条记录
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border border-industrial-200 rounded-md hover:bg-industrial-50">
                  上一页
                </button>
                <button className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm border border-industrial-200 rounded-md hover:bg-industrial-50">
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
