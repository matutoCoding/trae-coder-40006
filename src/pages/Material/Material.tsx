import { useState } from 'react';
import { Package, Thermometer, Clock, Droplets, Plus, Palette, X } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { materials, colorFormulas } from '@/data/mockData';
import { useStore } from '@/store';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const formatDateTime = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function Material() {
  const dryingRecords = useStore((s) => s.dryingRecords);
  const startDrying = useStore((s) => s.startDrying);
  const endDrying = useStore((s) => s.endDrying);

  const [activeTab, setActiveTab] = useState<'stock' | 'drying' | 'formula'>('stock');
  const [showAddModal, setShowAddModal] = useState(false);

  const [dryingForm, setDryingForm] = useState({
    materialId: '',
    materialName: '',
    temperature: 0,
    weight: 0,
    operator: '',
  });

  const totalStock = materials.reduce((sum, m) => sum + m.stock, 0);
  const dryingCount = dryingRecords.filter((r) => r.status === 'drying').length;

  const stockChartData = materials.map((m) => ({
    name: m.materialName,
    stock: m.stock,
  }));

  const handleSelectMaterial = (materialId: string) => {
    const mat = materials.find((m) => m.id === materialId);
    setDryingForm({
      ...dryingForm,
      materialId,
      materialName: mat?.materialName || '',
      temperature: mat?.dryingTemperature || 0,
    });
  };

  const handleStartDrying = () => {
    if (!dryingForm.materialId || !dryingForm.weight || !dryingForm.operator) {
      alert('请填写完整的烘干信息');
      return;
    }
    startDrying({
      materialId: dryingForm.materialId,
      materialName: dryingForm.materialName,
      startTime: formatDateTime(),
      temperature: Number(dryingForm.temperature),
      weight: Number(dryingForm.weight),
      operator: dryingForm.operator,
    });
    setShowAddModal(false);
    setDryingForm({ materialId: '', materialName: '', temperature: 0, weight: 0, operator: '' });
  };

  const handleEndDrying = (recordId: string) => {
    endDrying(recordId);
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
              <p className="text-2xl font-bold text-industrial-800">{materials.length}</p>
              <p className="text-sm text-industrial-500">原料种类</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Droplets size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">
                {totalStock.toLocaleString()}
              </p>
              <p className="text-sm text-industrial-500">总库存 (kg)</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Thermometer size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{dryingCount}</p>
              <p className="text-sm text-industrial-500">正在烘干</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Palette size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{colorFormulas.length}</p>
              <p className="text-sm text-industrial-500">配色配方</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-1 mb-6 border-b border-industrial-100 -mx-5 -mt-1 px-5">
          {[
            { key: 'stock', label: '原料库存', icon: Package },
            { key: 'drying', label: '烘干记录', icon: Thermometer },
            { key: 'formula', label: '配色配方', icon: Palette },
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

        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">原料库存</h3>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} />
                入库登记
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                {materials.map((material, index) => (
                  <div
                    key={material.id}
                    className="p-4 bg-industrial-50 rounded-lg hover:bg-industrial-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div>
                          <p className="font-medium text-industrial-800">
                            {material.materialName}
                          </p>
                          <p className="text-xs text-industrial-500">{material.materialType}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-industrial-800">
                        {material.stock.toLocaleString()}{' '}
                        <span className="text-sm font-normal text-industrial-500">
                          {material.unit}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-industrial-500">
                      <span className="flex items-center gap-1">
                        <Thermometer size={14} />
                        烘干: {material.dryingTemperature}°C / {material.dryingTime}h
                      </span>
                      <span>供应商: {material.supplier}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-4 border border-industrial-100">
                <h4 className="text-sm font-semibold text-industrial-700 mb-4">库存分布</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="stock" fill="#3b82f6" radius={[0, 4, 4, 0]} name="库存(kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drying' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">烘干记录</h3>
              <button
                className="btn-primary flex items-center gap-2 text-sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                开始烘干
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>原料名称</th>
                    <th>重量 (kg)</th>
                    <th>烘干温度</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>操作员</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {dryingRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="font-medium">{record.materialName}</td>
                      <td>{record.weight}</td>
                      <td>{record.temperature}°C</td>
                      <td>{record.startTime}</td>
                      <td>{record.endTime || '-'}</td>
                      <td>{record.operator}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            record.status === 'drying' ? 'status-running' : 'status-completed'
                          }`}
                        >
                          {record.status === 'drying' ? '烘干中' : '已完成'}
                        </span>
                      </td>
                      <td>
                        {record.status === 'drying' && (
                          <button
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            onClick={() => handleEndDrying(record.id)}
                          >
                            结束烘干
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {dryingRecords.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-industrial-400">
                        暂无烘干记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">烘干要求</span>
                </div>
                <p className="text-xs text-blue-600">
                  原料使用前必须按规定温度和时间进行烘干，确保含水率达标
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer size={18} className="text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">温度监控</span>
                </div>
                <p className="text-xs text-orange-600">
                  烘干过程中每30分钟记录一次温度，确保温度稳定在设定范围内
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets size={18} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">含水率检测</span>
                </div>
                <p className="text-xs text-emerald-600">
                  烘干完成后需检测含水率，合格后方可用于生产
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formula' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0">色母配色比例</h3>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} />
                新增配方
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorFormulas.map((formula) => (
                <div
                  key={formula.id}
                  className="p-5 bg-white border border-industrial-200 rounded-xl hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                      style={{ backgroundColor: formula.colorCode }}
                    ></div>
                    <div>
                      <p className="font-semibold text-industrial-800">{formula.formulaName}</p>
                      <p className="text-sm text-industrial-500">{formula.colorName}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-industrial-500">基料</span>
                      <span className="font-medium text-industrial-700">
                        {formula.baseMaterial}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-industrial-500">色母比例</span>
                      <span className="font-medium text-primary-600">
                        {formula.colorMasterRatio}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-industrial-500">助剂比例</span>
                      <span className="font-medium text-emerald-600">
                        {formula.additiveRatio}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-industrial-100">
                    <div className="h-2 bg-industrial-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-industrial-300"
                        style={{ width: `${100 - formula.colorMasterRatio - formula.additiveRatio}%` }}
                      ></div>
                      <div
                        className="h-full"
                        style={{
                          width: `${formula.colorMasterRatio}%`,
                          backgroundColor: formula.colorCode,
                        }}
                      ></div>
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${formula.additiveRatio}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-industrial-400 mt-2">
                      <span>基料</span>
                      <span>色母</span>
                      <span>助剂</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                    查看详情
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-industrial-200">
              <h3 className="text-lg font-semibold">开始烘干</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-industrial-400 hover:text-industrial-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  选择原料 <span className="text-red-500">*</span>
                </label>
                <select
                  className="select-field"
                  value={dryingForm.materialId}
                  onChange={(e) => handleSelectMaterial(e.target.value)}
                >
                  <option value="">请选择原料</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.materialName} - 建议{m.dryingTemperature}°C / {m.dryingTime}h (库存:{m.stock}kg)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    烘干温度(°C) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={dryingForm.temperature || ''}
                    onChange={(e) =>
                      setDryingForm({ ...dryingForm, temperature: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    重量(kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={dryingForm.weight || ''}
                    onChange={(e) =>
                      setDryingForm({ ...dryingForm, weight: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  操作员 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="请输入操作员姓名"
                  value={dryingForm.operator}
                  onChange={(e) =>
                    setDryingForm({ ...dryingForm, operator: e.target.value })
                  }
                />
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-sm text-orange-700">
                开始烘干后，状态将显示为「烘干中」，可在表格中手动结束
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-industrial-200">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handleStartDrying}>
                确认开始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
