import { useState, useMemo } from 'react';
import {
  Cpu,
  Thermometer,
  Clock,
  Gauge,
  Settings2,
  Edit3,
  Zap,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { machines } from '@/data/mockData';
import { useStore } from '@/store';

const statusMap: Record<string, { label: string; className: string; dot: string }> = {
  running: { label: '运行中', className: 'status-running', dot: 'bg-emerald-500' },
  idle: { label: '空闲', className: 'status-idle', dot: 'bg-amber-500' },
  maintenance: { label: '维护中', className: 'status-maintenance', dot: 'bg-orange-500' },
  offline: { label: '离线', className: 'status-offline', dot: 'bg-red-500' },
};

const tempTrendData = [
  { time: '08:00', temp: 180, target: 215 },
  { time: '08:30', temp: 200, target: 215 },
  { time: '09:00', temp: 212, target: 215 },
  { time: '09:30', temp: 215, target: 215 },
  { time: '10:00', temp: 214, target: 215 },
  { time: '10:30', temp: 216, target: 215 },
  { time: '11:00', temp: 215, target: 215 },
  { time: '11:30', temp: 213, target: 215 },
];

export default function Machine() {
  const machineParams = useStore((s) => s.machineParams);
  const updateMachineParam = useStore((s) => s.updateMachineParam);

  const [selectedMachine, setSelectedMachine] = useState(machines[0]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    injectionPressure: 0,
    holdingPressure: 0,
    holdingTime: 0,
    moldTemperature: 0,
    barrelTemperature: 0,
    cycleTime: 0,
    operator: '',
  });
  const [formError, setFormError] = useState('');

  const selectedParam = useMemo(
    () => machineParams.find((p) => p.machineId === selectedMachine.id),
    [machineParams, selectedMachine.id]
  );

  const runningCount = machines.filter((m) => m.status === 'running').length;
  const idleCount = machines.filter((m) => m.status === 'idle').length;

  const openEditModal = () => {
    setFormData({
      injectionPressure: selectedParam?.injectionPressure || 120,
      holdingPressure: selectedParam?.holdingPressure || 80,
      holdingTime: selectedParam?.holdingTime || 8,
      moldTemperature: selectedParam?.moldTemperature || 60,
      barrelTemperature: selectedParam?.barrelTemperature || 215,
      cycleTime: selectedParam?.cycleTime || 35,
      operator: selectedParam?.operator || '管理员',
    });
    setFormError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (!formData.operator.trim()) {
      setFormError('请输入操作员');
      return;
    }
    if (formData.injectionPressure <= 0) {
      setFormError('注射压力必须大于0');
      return;
    }
    if (formData.holdingPressure <= 0) {
      setFormError('保压压力必须大于0');
      return;
    }
    if (formData.holdingTime <= 0) {
      setFormError('保压时间必须大于0');
      return;
    }
    if (formData.moldTemperature <= 0) {
      setFormError('模温必须大于0');
      return;
    }
    if (formData.barrelTemperature <= 0) {
      setFormError('料筒温度必须大于0');
      return;
    }
    if (formData.cycleTime <= 0) {
      setFormError('成型周期必须大于0');
      return;
    }
    updateMachineParam(selectedMachine.id, {
      injectionPressure: Number(formData.injectionPressure),
      holdingPressure: Number(formData.holdingPressure),
      holdingTime: Number(formData.holdingTime),
      moldTemperature: Number(formData.moldTemperature),
      barrelTemperature: Number(formData.barrelTemperature),
      cycleTime: Number(formData.cycleTime),
      operator: formData.operator,
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Cpu size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{machines.length}</p>
              <p className="text-sm text-industrial-500">总机台数</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Zap size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{runningCount}</p>
              <p className="text-sm text-industrial-500">运行中</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{idleCount}</p>
              <p className="text-sm text-industrial-500">空闲</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Settings2 size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">
                {machines.filter((m) => m.status === 'maintenance').length}
              </p>
              <p className="text-sm text-industrial-500">维护中</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="section-title">机台列表</h3>
          {machines.map((machine) => {
            const status = statusMap[machine.status];
            const isSelected = selectedMachine.id === machine.id;

            return (
              <div
                key={machine.id}
                onClick={() => setSelectedMachine(machine)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary-50 border-2 border-primary-500 shadow-md'
                    : 'bg-white border border-industrial-200 hover:shadow-card'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${status.dot} ${machine.status === 'running' ? 'animate-pulse' : ''}`}></div>
                    <span className="font-semibold text-industrial-800">
                      {machine.machineNo}
                    </span>
                  </div>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-industrial-500">
                  <span>{machine.machineType}</span>
                  <span>{machine.tonnage}T</span>
                </div>
                <div className="flex items-center justify-between text-sm text-industrial-500 mt-1">
                  <span>{machine.location}</span>
                  <span className="flex items-center gap-1">
                    <Thermometer size={14} />
                    {machine.currentTemperature}°C
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {selectedParam ? (
            <>
              <div className="stat-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-100 rounded-xl">
                      <Settings2 size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-industrial-800">
                        {selectedMachine.machineNo} 调机参数
                      </h3>
                      <p className="text-sm text-industrial-500">
                        更新时间: {selectedParam.updateTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openEditModal}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <Edit3 size={16} />
                    调整参数
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge size={18} className="text-blue-600" />
                      <span className="text-sm text-blue-700">注射压力</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">
                      {selectedParam.injectionPressure}
                      <span className="text-sm font-normal ml-1">MPa</span>
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge size={18} className="text-purple-600" />
                      <span className="text-sm text-purple-700">保压压力</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800">
                      {selectedParam.holdingPressure}
                      <span className="text-sm font-normal ml-1">MPa</span>
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-emerald-600" />
                      <span className="text-sm text-emerald-700">保压时间</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-800">
                      {selectedParam.holdingTime}
                      <span className="text-sm font-normal ml-1">s</span>
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={18} className="text-orange-600" />
                      <span className="text-sm text-orange-700">模温</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-800">
                      {selectedParam.moldTemperature}
                      <span className="text-sm font-normal ml-1">°C</span>
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={18} className="text-red-600" />
                      <span className="text-sm text-red-700">料筒温度</span>
                    </div>
                    <p className="text-2xl font-bold text-red-800">
                      {selectedParam.barrelTemperature}
                      <span className="text-sm font-normal ml-1">°C</span>
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-indigo-600" />
                      <span className="text-sm text-indigo-700">成型周期</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-800">
                      {selectedParam.cycleTime}
                      <span className="text-sm font-normal ml-1">s</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-industrial-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={18} className="text-industrial-600" />
                    <span className="text-sm font-medium text-industrial-700">
                      操作员: {selectedParam.operator}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="section-title">料筒温度趋势</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tempTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[150, 250]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 3 }}
                        name="实际温度"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="目标温度"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="section-title">模温机温度控制</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-industrial-700">
                          模温设定
                        </label>
                        <span className="text-sm text-primary-600 font-semibold">
                          {selectedParam.moldTemperature}°C
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        value={selectedParam.moldTemperature}
                        readOnly
                        className="w-full h-2 bg-industrial-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                      <div className="flex justify-between text-xs text-industrial-400 mt-1">
                        <span>30°C</span>
                        <span>120°C</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-industrial-700">
                          保压时间设定
                        </label>
                        <span className="text-sm text-emerald-600 font-semibold">
                          {selectedParam.holdingTime}s
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={selectedParam.holdingTime}
                        readOnly
                        className="w-full h-2 bg-industrial-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex justify-between text-xs text-industrial-400 mt-1">
                        <span>1s</span>
                        <span>30s</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-industrial-50 rounded-xl">
                    <h4 className="font-medium text-industrial-800 mb-3">当前状态</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-industrial-500">模温</span>
                        <span className="text-lg font-bold text-orange-600">
                          {selectedMachine.currentTemperature}°C
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-industrial-500">状态</span>
                        <span className={`status-badge status-${selectedMachine.status}`}>
                          {statusMap[selectedMachine.status].label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-industrial-500">位置</span>
                        <span className="text-sm font-medium">
                          {selectedMachine.location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-industrial-500">吨位</span>
                        <span className="text-sm font-medium">
                          {selectedMachine.tonnage}T
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-industrial-800">
                  {selectedMachine.machineNo} 调机参数
                </h3>
                <button
                  onClick={openEditModal}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Edit3 size={16} />
                  新增参数
                </button>
              </div>
              <p className="text-industrial-500 py-8 text-center">该设备暂无调机参数记录，点击"新增参数"开始配置</p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-industrial-100">
              <h3 className="text-lg font-bold text-industrial-800">
                {selectedParam ? '调整调机参数' : '新增调机参数'} - {selectedMachine.machineNo}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
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
                    注射压力 (MPa)
                  </label>
                  <input
                    type="number"
                    value={formData.injectionPressure}
                    onChange={(e) =>
                      setFormData({ ...formData, injectionPressure: Number(e.target.value) })
                    }
                    className="input-field"
                    placeholder="如 120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    保压压力 (MPa)
                  </label>
                  <input
                    type="number"
                    value={formData.holdingPressure}
                    onChange={(e) =>
                      setFormData({ ...formData, holdingPressure: Number(e.target.value) })
                    }
                    className="input-field"
                    placeholder="如 80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    保压时间 (s)
                  </label>
                  <input
                    type="number"
                    value={formData.holdingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, holdingTime: Number(e.target.value) })
                    }
                    className="input-field"
                    placeholder="如 8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    模温 (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.moldTemperature}
                    onChange={(e) =>
                      setFormData({ ...formData, moldTemperature: Number(e.target.value) })
                    }
                    className="input-field"
                    placeholder="如 60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    料筒温度 (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.barrelTemperature}
                    onChange={(e) =>
                      setFormData({ ...formData, barrelTemperature: Number(e.target.value) })
                    }
                    className="input-field"
                    placeholder="如 215"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-1">
                    成型周期 (s)
                  </label>
                  <input
                    type="number"
                    value={formData.cycleTime}
                    onChange={(e) =>
                      setFormData({ ...formData, cycleTime: Number(e.target.value) })
                    }
                    className="input-field"
                    placeholder="如 35"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  操作员
                </label>
                <input
                  type="text"
                  value={formData.operator}
                  onChange={(e) =>
                    setFormData({ ...formData, operator: e.target.value })
                  }
                  className="input-field"
                  placeholder="请输入操作员姓名"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-industrial-100">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleEditSubmit}
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
