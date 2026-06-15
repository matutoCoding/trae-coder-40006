import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Package, Users, X } from 'lucide-react';
import { machines, molds, materials } from '@/data/mockData';
import { useStore } from '@/store';

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: '待排产', className: 'status-pending' },
  scheduled: { label: '已排产', className: 'status-scheduled' },
  producing: { label: '生产中', className: 'status-producing' },
  completed: { label: '已完成', className: 'status-completed' },
};

export default function Orders() {
  const orders = useStore((s) => s.orders);
  const addOrder = useStore((s) => s.addOrder);
  const scheduleOrder = useStore((s) => s.scheduleOrder);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleOrderId, setScheduleOrderId] = useState<string>('');

  const [form, setForm] = useState({
    productName: '',
    customer: '',
    quantity: 0,
    deliveryDate: '',
    material: '',
    machineId: '',
    moldId: '',
  });

  const [scheduleForm, setScheduleForm] = useState({
    machineId: '',
    moldId: '',
  });

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

  const handleAddSubmit = () => {
    if (!form.productName || !form.customer || !form.quantity || !form.deliveryDate || !form.material) {
      alert('请填写完整的订单信息');
      return;
    }
    addOrder({
      productName: form.productName,
      customer: form.customer,
      quantity: Number(form.quantity),
      deliveryDate: form.deliveryDate,
      material: form.material,
      machineId: form.machineId || '0',
      moldId: form.moldId || '0',
    });
    setShowAddModal(false);
    setForm({
      productName: '',
      customer: '',
      quantity: 0,
      deliveryDate: '',
      material: '',
      machineId: '',
      moldId: '',
    });
  };

  const openScheduleModal = (orderId: string) => {
    setScheduleOrderId(orderId);
    setScheduleForm({ machineId: '', moldId: '' });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = () => {
    if (!scheduleForm.machineId || !scheduleForm.moldId) {
      alert('请选择机台和模具');
      return;
    }
    scheduleOrder(scheduleOrderId, scheduleForm.machineId, scheduleForm.moldId);
    setShowScheduleModal(false);
    setScheduleOrderId('');
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
                          <button
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            onClick={() => openScheduleModal(order.id)}
                          >
                            排产
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-industrial-400">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-industrial-100">
          <p className="text-sm text-industrial-500">
            共 {filteredOrders.length} 条记录
          </p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-industrial-200">
              <h3 className="text-lg font-semibold">新增订单</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-industrial-400 hover:text-industrial-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    产品名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="请输入产品名称"
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    客户名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="请输入客户名称"
                    value={form.customer}
                    onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    订单数量 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="请输入数量"
                    value={form.quantity || ''}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    交付日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.deliveryDate}
                    onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    原料 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="select-field"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                  >
                    <option value="">请选择原料</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.materialName}>
                        {m.materialName} ({m.materialType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    预留机台
                  </label>
                  <select
                    className="select-field"
                    value={form.machineId}
                    onChange={(e) => setForm({ ...form, machineId: e.target.value })}
                  >
                    <option value="">暂不指定</option>
                    {machines
                      .filter((m) => m.status === 'idle' || m.status === 'running')
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.machineNo} ({m.tonnage}T)
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-industrial-200">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handleAddSubmit}>
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-industrial-200">
              <h3 className="text-lg font-semibold">订单排产 - 选择机台与模具</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-industrial-400 hover:text-industrial-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  选择注塑机 <span className="text-red-500">*</span>
                </label>
                <select
                  className="select-field"
                  value={scheduleForm.machineId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, machineId: e.target.value })}
                >
                  <option value="">请选择注塑机</option>
                  {machines
                    .filter((m) => m.status !== 'maintenance' && m.status !== 'offline')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.machineNo} - {m.machineType} ({m.tonnage}T) [{
                          m.status === 'running' ? '运行中' : '空闲'
                        }]
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  选择模具 <span className="text-red-500">*</span>
                </label>
                <select
                  className="select-field"
                  value={scheduleForm.moldId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, moldId: e.target.value })}
                >
                  <option value="">请选择模具</option>
                  {molds
                    .filter((m) => m.status !== 'maintenance')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.moldNo} - {m.moldName} ({m.cavities}腔) [{
                          m.status === 'on-machine' ? `使用中(${m.currentMachine})` : '闲置'
                        }]
                      </option>
                    ))}
                </select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                排产后订单状态将从「待排产」变为「已排产」
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-industrial-200">
              <button className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handleScheduleSubmit}>
                确认排产
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
