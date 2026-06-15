import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Package, Users } from 'lucide-react';
import { orders, machines, molds } from '@/data/mockData';
import type { Order } from '@/types';

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: '待排产', className: 'status-pending' },
  scheduled: { label: '已排产', className: 'status-scheduled' },
  producing: { label: '生产中', className: 'status-producing' },
  completed: { label: '已完成', className: 'status-completed' },
};

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchSearch =
      order.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    producing: orders.filter((o) => o.status === 'producing').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{stats.total}</p>
              <p className="text-sm text-industrial-500">全部订单</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-industrial-100 rounded-xl">
              <Calendar size={24} className="text-industrial-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{stats.pending}</p>
              <p className="text-sm text-industrial-500">待排产</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{stats.producing}</p>
              <p className="text-sm text-industrial-500">生产中</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Package size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{stats.completed}</p>
              <p className="text-sm text-industrial-500">已完成</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400"
              />
              <input
                type="text"
                placeholder="搜索订单号、产品、客户..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 w-72 input-field"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-industrial-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select-field w-36"
              >
                <option value="all">全部状态</option>
                <option value="pending">待排产</option>
                <option value="scheduled">已排产</option>
                <option value="producing">生产中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            新增订单
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>产品名称</th>
                <th>客户</th>
                <th>原料</th>
                <th>数量</th>
                <th>完成数量</th>
                <th>进度</th>
                <th>机台</th>
                <th>模具</th>
                <th>交期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const machine = machines.find((m) => m.id === order.machineId);
                const mold = molds.find((m) => m.id === order.moldId);
                const progress = Math.round((order.completedQuantity / order.quantity) * 100);
                const status = statusMap[order.status];

                return (
                  <tr key={order.id}>
                    <td className="font-mono font-medium text-primary-600">
                      {order.orderNo}
                    </td>
                    <td className="font-medium">{order.productName}</td>
                    <td>{order.customer}</td>
                    <td>{order.material}</td>
                    <td>{order.quantity.toLocaleString()}</td>
                    <td>{order.completedQuantity.toLocaleString()}</td>
                    <td className="min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-industrial-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progress === 100
                                ? 'bg-emerald-500'
                                : progress > 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-industrial-500 w-10 text-right">
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td>{machine?.machineNo || '-'}</td>
                    <td>{mold?.moldNo || '-'}</td>
                    <td className="text-industrial-500">{order.deliveryDate}</td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          详情
                        </button>
                        {order.status === 'pending' && (
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            排产
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-industrial-100">
          <p className="text-sm text-industrial-500">
            共 {filteredOrders.length} 条记录
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-industrial-200 rounded-md hover:bg-industrial-50">
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-industrial-200 rounded-md hover:bg-industrial-50">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-industrial-200 rounded-md hover:bg-industrial-50">
              下一页
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-industrial-200">
              <h3 className="text-lg font-semibold">新增订单</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-industrial-400 hover:text-industrial-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    产品名称
                  </label>
                  <input type="text" className="input-field" placeholder="请输入产品名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    客户名称
                  </label>
                  <input type="text" className="input-field" placeholder="请输入客户名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    订单数量
                  </label>
                  <input type="number" className="input-field" placeholder="请输入数量" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    交付日期
                  </label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    原料
                  </label>
                  <select className="select-field">
                    <option>请选择原料</option>
                    <option>PP-5090</option>
                    <option>PC-2805</option>
                    <option>PA66-GF30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    模具
                  </label>
                  <select className="select-field">
                    <option>请选择模具</option>
                    <option>MOLD-001</option>
                    <option>MOLD-002</option>
                    <option>MOLD-003</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  备注
                </label>
                <textarea
                  className="input-field h-24 resize-none"
                  placeholder="请输入备注信息"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-industrial-200">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={() => setShowAddModal(false)}>
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
