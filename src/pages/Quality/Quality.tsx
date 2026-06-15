import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Ruler,
  AlertTriangle,
  Plus,
  FileCheck,
  Eye,
  X,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import { qualityTrendData, defectDistribution } from '@/data/mockData';
import { useStore } from '@/store';
import type { QualityCheck as QualityCheckType } from '@/types';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

type QualityFormData = {
  orderNo: string;
  productName: string;
  shrinkage: boolean;
  flash: boolean;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  result: 'pass' | 'fail';
  inspector: string;
  remark: string;
};

const emptyForm: QualityFormData = {
  orderNo: '',
  productName: '',
  shrinkage: false,
  flash: false,
  dimensionLength: 0,
  dimensionWidth: 0,
  dimensionHeight: 0,
  result: 'pass',
  inspector: '',
  remark: '',
};

const formatDateTime = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function Quality() {
  const qualityChecks = useStore((s) => s.qualityChecks);
  const addQualityCheck = useStore((s) => s.addQualityCheck);
  const orders = useStore((s) => s.orders);

  const [activeTab, setActiveTab] = useState<'check' | 'records'>('check');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'check' | 'inspect'>('check');
  const [formData, setFormData] = useState<QualityFormData>(emptyForm);
  const [formError, setFormError] = useState('');

  const passCount = useMemo(
    () => qualityChecks.filter((q) => q.result === 'pass').length,
    [qualityChecks]
  );
  const failCount = useMemo(
    () => qualityChecks.filter((q) => q.result === 'fail').length,
    [qualityChecks]
  );
  const passRate = useMemo(
    () =>
      qualityChecks.length > 0
        ? ((passCount / qualityChecks.length) * 100).toFixed(1)
        : '0.0',
    [qualityChecks.length, passCount]
  );

  const qualityPieData = useMemo(
    () => [
      { name: '合格', value: passCount },
      { name: '不合格', value: failCount },
    ],
    [passCount, failCount]
  );

  const sizeTrendData = [
    { time: '08:00', length: 100.2, width: 60.1, height: 25.3 },
    { time: '10:00', length: 100.0, width: 59.9, height: 25.1 },
    { time: '12:00', length: 99.8, width: 59.7, height: 24.9 },
    { time: '14:00', length: 100.1, width: 60.0, height: 25.2 },
    { time: '16:00', length: 100.3, width: 60.2, height: 25.4 },
  ];

  const openAddModal = (type: 'check' | 'inspect') => {
    setAddModalType(type);
    setFormData(emptyForm);
    setFormError('');
    setShowAddModal(true);
  };

  const handleSelectOrder = (orderNo: string) => {
    const order = orders.find((o) => o.orderNo === orderNo);
    setFormData({
      ...formData,
      orderNo,
      productName: order?.productName || '',
    });
  };

  const handleAddSubmit = () => {
    if (!formData.orderNo) {
      setFormError('请选择订单');
      return;
    }
    if (!formData.dimensionLength || !formData.dimensionWidth || !formData.dimensionHeight) {
      setFormError('请填写完整的尺寸数据');
      return;
    }
    if (!formData.inspector.trim()) {
      setFormError('请输入质检员姓名');
      return;
    }

    const order = orders.find((o) => o.orderNo === formData.orderNo);

    const check: Omit<QualityCheckType, 'id'> = {
      cycleId: '',
      orderNo: formData.orderNo,
      productName: formData.productName || order?.productName || '',
      shrinkage: formData.shrinkage,
      flash: formData.flash,
      dimensionLength: Number(formData.dimensionLength),
      dimensionWidth: Number(formData.dimensionWidth),
      dimensionHeight: Number(formData.dimensionHeight),
      result: formData.result,
      inspector: formData.inspector,
      checkTime: formatDateTime(),
      remark: formData.remark || undefined,
    };

    addQualityCheck(check);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileCheck size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{qualityChecks.length}</p>
              <p className="text-sm text-industrial-500">质检次数</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{passCount}</p>
              <p className="text-sm text-industrial-500">合格数</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{failCount}</p>
              <p className="text-sm text-industrial-500">不合格数</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <ShieldCheck size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{passRate}%</p>
              <p className="text-sm text-industrial-500">合格率</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-1 mb-6 border-b border-industrial-100 -mx-5 -mt-1 px-5">
          {[
            { key: 'check', label: '质检记录', icon: ShieldCheck },
            { key: 'records', label: '尺寸抽检', icon: Ruler },
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

        {activeTab === 'check' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">外观检查记录</h3>
              <button
                onClick={() => openAddModal('check')}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                新增质检
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-white border border-industrial-200 rounded-xl">
                <h4 className="font-semibold text-industrial-800 mb-4">质量分布</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {qualityPieData.map((_, index) => (
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
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-sm text-industrial-600">合格</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm text-industrial-600">不合格</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white border border-industrial-200 rounded-xl">
                <h4 className="font-semibold text-industrial-800 mb-4">缺陷类型分布</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={defectDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#94a3b8"
                        fontSize={12}
                        width={70}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} name="数量" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-5 bg-white border border-industrial-200 rounded-xl">
                <h4 className="font-semibold text-industrial-800 mb-4">合格率趋势</h4>
                <div className="h-48">
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
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>订单号</th>
                    <th>产品名称</th>
                    <th>缩水检查</th>
                    <th>飞边检查</th>
                    <th>尺寸</th>
                    <th>检测结果</th>
                    <th>质检员</th>
                    <th>检测时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityChecks.map((check) => (
                    <tr key={check.id}>
                      <td className="font-mono text-primary-600">{check.orderNo}</td>
                      <td className="font-medium">{check.productName}</td>
                      <td>
                        {check.shrinkage ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertTriangle size={16} />
                            有缩水
                          </span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            正常
                          </span>
                        )}
                      </td>
                      <td>
                        {check.flash ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertTriangle size={16} />
                            有飞边
                          </span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            正常
                          </span>
                        )}
                      </td>
                      <td className="text-sm text-industrial-500">
                        {check.dimensionLength}×{check.dimensionWidth}×
                        {check.dimensionHeight}mm
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            check.result === 'pass' ? 'status-pass' : 'status-fail'
                          }`}
                        >
                          {check.result === 'pass' ? '合格' : '不合格'}
                        </span>
                      </td>
                      <td>{check.inspector}</td>
                      <td className="text-industrial-500">{check.checkTime}</td>
                      <td>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                          <Eye size={14} />
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">尺寸抽检记录</h3>
              <button
                onClick={() => openAddModal('inspect')}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                新增抽检
              </button>
            </div>

            <div className="p-5 bg-white border border-industrial-200 rounded-xl">
              <h4 className="font-semibold text-industrial-800 mb-4">尺寸变化趋势</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sizeTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
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
                      dataKey="length"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="长度(mm)"
                    />
                    <Line
                      type="monotone"
                      dataKey="width"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="宽度(mm)"
                    />
                    <Line
                      type="monotone"
                      dataKey="height"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4 }}
                      name="高度(mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-industrial-600">长度</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-industrial-600">宽度</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-sm text-industrial-600">高度</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>订单号</th>
                    <th>产品名称</th>
                    <th>长度 (mm)</th>
                    <th>宽度 (mm)</th>
                    <th>高度 (mm)</th>
                    <th>偏差</th>
                    <th>判定</th>
                    <th>质检员</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityChecks.map((check) => (
                    <tr key={check.id}>
                      <td className="font-mono text-primary-600">{check.orderNo}</td>
                      <td>{check.productName}</td>
                      <td>{check.dimensionLength}</td>
                      <td>{check.dimensionWidth}</td>
                      <td>{check.dimensionHeight}</td>
                      <td>
                        <span
                          className={
                            check.result === 'pass'
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }
                        >
                          {check.result === 'pass' ? '±0.2mm' : '超出公差'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            check.result === 'pass' ? 'status-pass' : 'status-fail'
                          }`}
                        >
                          {check.result === 'pass' ? '合格' : '不合格'}
                        </span>
                      </td>
                      <td>{check.inspector}</td>
                      <td className="text-industrial-500">{check.checkTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-industrial-100">
              <h3 className="text-lg font-bold text-industrial-800">
                {addModalType === 'check' ? '新增外观质检' : '新增尺寸抽检'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-industrial-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-industrial-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    选择订单 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.orderNo}
                    onChange={(e) => handleSelectOrder(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="">请选择订单</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.orderNo}>
                        {o.orderNo} - {o.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    产品名称
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="选订单后自动带出，可修改"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-6 p-3 bg-industrial-50 rounded-lg">
                  <span className="text-sm font-medium text-industrial-700">缩水检查:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.shrinkage}
                      onChange={() => setFormData({ ...formData, shrinkage: false })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span className="text-sm text-emerald-600">正常</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.shrinkage}
                      onChange={() => setFormData({ ...formData, shrinkage: true })}
                      className="w-4 h-4 accent-red-500"
                    />
                    <span className="text-sm text-red-600">有缩水</span>
                  </label>
                </div>
                <div className="flex items-center gap-6 p-3 bg-industrial-50 rounded-lg">
                  <span className="text-sm font-medium text-industrial-700">飞边检查:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.flash}
                      onChange={() => setFormData({ ...formData, flash: false })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span className="text-sm text-emerald-600">正常</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.flash}
                      onChange={() => setFormData({ ...formData, flash: true })}
                      className="w-4 h-4 accent-red-500"
                    />
                    <span className="text-sm text-red-600">有飞边</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    长度 (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dimensionLength}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensionLength: Number(e.target.value),
                      })
                    }
                    className="input-field w-full"
                    placeholder="如 100.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    宽度 (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dimensionWidth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensionWidth: Number(e.target.value),
                      })
                    }
                    className="input-field w-full"
                    placeholder="如 60.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    高度 (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dimensionHeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensionHeight: Number(e.target.value),
                      })
                    }
                    className="input-field w-full"
                    placeholder="如 25.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    判定结果 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 p-3 bg-industrial-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.result === 'pass'}
                        onChange={() => setFormData({ ...formData, result: 'pass' })}
                        className="w-4 h-4 accent-emerald-500"
                      />
                      <span className="text-sm text-emerald-600 font-medium">合格</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.result === 'fail'}
                        onChange={() => setFormData({ ...formData, result: 'fail' })}
                        className="w-4 h-4 accent-red-500"
                      />
                      <span className="text-sm text-red-600 font-medium">不合格</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    质检员 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.inspector}
                    onChange={(e) =>
                      setFormData({ ...formData, inspector: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="请输入质检员姓名"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="选填"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-industrial-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleAddSubmit}
                className="btn-primary flex-1"
              >
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
