import { useState, useMemo } from 'react';
import {
  Box,
  ArrowUpDown,
  Wrench,
  Clock,
  Plus,
  Layers,
  Activity,
  History,
  X,
} from 'lucide-react';
import { machines } from '@/data/mockData';
import { useStore } from '@/store';

const statusMap: Record<string, { label: string; className: string }> = {
  'on-machine': { label: '使用中', className: 'status-running' },
  'off-machine': { label: '闲置', className: 'status-idle' },
  maintenance: { label: '保养中', className: 'status-maintenance' },
};

type MountFormData = {
  machineId: string;
  operator: string;
  remark: string;
};

type DismountFormData = {
  operator: string;
  remark: string;
};

export default function Mold() {
  const molds = useStore((s) => s.molds);
  const moldRecords = useStore((s) => s.moldRecords);
  const mountMold = useStore((s) => s.mountMold);
  const dismountMold = useStore((s) => s.dismountMold);

  const [activeTab, setActiveTab] = useState<'list' | 'records'>('list');
  const [showMountModal, setShowMountModal] = useState(false);
  const [showDismountModal, setShowDismountModal] = useState(false);
  const [selectedMoldId, setSelectedMoldId] = useState<string | null>(null);

  const [mountForm, setMountForm] = useState<MountFormData>({
    machineId: '',
    operator: '',
    remark: '',
  });
  const [dismountForm, setDismountForm] = useState<DismountFormData>({
    operator: '',
    remark: '',
  });
  const [formError, setFormError] = useState('');

  const onMachineCount = useMemo(
    () => molds.filter((m) => m.status === 'on-machine').length,
    [molds]
  );
  const maintenanceCount = useMemo(
    () => molds.filter((m) => m.status === 'maintenance').length,
    [molds]
  );

  const availableMachines = useMemo(
    () => machines.filter((m) => m.status === 'running' || m.status === 'idle'),
    []
  );

  const openMountModal = (moldId: string) => {
    setSelectedMoldId(moldId);
    setMountForm({ machineId: '', operator: '', remark: '' });
    setFormError('');
    setShowMountModal(true);
  };

  const openDismountModal = (moldId: string) => {
    setSelectedMoldId(moldId);
    setDismountForm({ operator: '', remark: '' });
    setFormError('');
    setShowDismountModal(true);
  };

  const handleMountSubmit = () => {
    if (!mountForm.machineId) {
      setFormError('请选择注塑机');
      return;
    }
    if (!mountForm.operator.trim()) {
      setFormError('请输入操作员');
      return;
    }
    if (!selectedMoldId) return;
    mountMold(
      selectedMoldId,
      mountForm.machineId,
      mountForm.operator,
      mountForm.remark || undefined
    );
    setShowMountModal(false);
  };

  const handleDismountSubmit = () => {
    if (!dismountForm.operator.trim()) {
      setFormError('请输入操作员');
      return;
    }
    if (!selectedMoldId) return;
    dismountMold(
      selectedMoldId,
      dismountForm.operator,
      dismountForm.remark || undefined
    );
    setShowDismountModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Box size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{molds.length}</p>
              <p className="text-sm text-industrial-500">模具总数</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Activity size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{onMachineCount}</p>
              <p className="text-sm text-industrial-500">使用中</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Layers size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">
                {molds.filter((m) => m.status === 'off-machine').length}
              </p>
              <p className="text-sm text-industrial-500">闲置</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Wrench size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-industrial-800">{maintenanceCount}</p>
              <p className="text-sm text-industrial-500">保养中</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-1 mb-6 border-b border-industrial-100 -mx-5 -mt-1 px-5">
          {[
            { key: 'list', label: '模具台账', icon: Box },
            { key: 'records', label: '上下机记录', icon: ArrowUpDown },
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

        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select className="select-field w-40">
                  <option>全部状态</option>
                  <option>使用中</option>
                  <option>闲置</option>
                  <option>保养中</option>
                </select>
                <input type="text" placeholder="搜索模具编号..." className="input-field w-48" />
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} />
                新增模具
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {molds.map((mold) => {
                const status = statusMap[mold.status];
                const usageRate = Math.round((mold.totalShots / mold.maxShots) * 100);
                const currentMachine = machines.find((m) => m.machineNo === mold.currentMachine);

                return (
                  <div
                    key={mold.id}
                    className="p-5 bg-white border border-industrial-200 rounded-xl hover:shadow-card-hover transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                          <Box size={24} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-industrial-800">{mold.moldNo}</p>
                          <p className="text-sm text-industrial-500">{mold.moldName}</p>
                        </div>
                      </div>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">腔数</span>
                        <span className="font-medium text-industrial-700">{mold.cavities} 腔</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">累计模次</span>
                        <span className="font-medium text-industrial-700">
                          {mold.totalShots.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">当前机台</span>
                        <span className="font-medium text-primary-600">
                          {mold.currentMachine || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-industrial-500">上次保养</span>
                        <span className="text-industrial-600">{mold.lastMaintenance}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-industrial-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-industrial-500">使用寿命</span>
                        <span className="text-xs font-medium text-industrial-700">
                          {usageRate}%
                        </span>
                      </div>
                      <div className="h-2 bg-industrial-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            usageRate > 90
                              ? 'bg-red-500'
                              : usageRate > 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${usageRate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-industrial-400 mt-1">
                        <span>0</span>
                        <span>{mold.maxShots.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {mold.status === 'off-machine' && (
                        <button
                          onClick={() => openMountModal(mold.id)}
                          className="flex-1 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          上机
                        </button>
                      )}
                      {mold.status === 'on-machine' && (
                        <button
                          onClick={() => openDismountModal(mold.id)}
                          className="flex-1 py-2 text-sm text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          下机
                        </button>
                      )}
                      <button className="flex-1 py-2 text-sm text-industrial-600 border border-industrial-200 rounded-lg hover:bg-industrial-50 transition-colors">
                        详情
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title mb-0 flex items-center gap-2">
                <History size={20} className="text-primary-600" />
                模具上下机记录
              </h3>
              <div className="flex items-center gap-3">
                <select className="select-field w-40">
                  <option>全部模具</option>
                  {molds.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.moldNo}
                    </option>
                  ))}
                </select>
                <input type="date" className="input-field w-40" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-industrial-200"></div>
              <div className="space-y-6">
                {moldRecords.map((record, index) => (
                  <div key={record.id} className="relative flex items-start gap-6 pl-4">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        record.type === 'mount' ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}
                    >
                      {record.type === 'mount' ? (
                        <ArrowUpDown size={16} className="text-emerald-600" />
                      ) : (
                        <ArrowUpDown size={16} className="text-amber-600" />
                      )}
                    </div>

                    <div className="flex-1 p-4 bg-white border border-industrial-200 rounded-xl hover:shadow-card transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-industrial-800">
                            {record.moldNo}
                          </span>
                          <span
                            className={`status-badge ${
                              record.type === 'mount' ? 'status-running' : 'status-idle'
                            }`}
                          >
                            {record.type === 'mount' ? '上机' : '下机'}
                          </span>
                        </div>
                        <span className="text-sm text-industrial-500">{record.time}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-industrial-500">机台: </span>
                          <span className="font-medium text-industrial-700">
                            {record.machineNo}
                          </span>
                        </div>
                        <div>
                          <span className="text-industrial-500">操作员: </span>
                          <span className="font-medium text-industrial-700">
                            {record.operator}
                          </span>
                        </div>
                        <div>
                          <span className="text-industrial-500">备注: </span>
                          <span className="text-industrial-600">{record.remark || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showMountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-industrial-100">
              <h3 className="text-lg font-bold text-industrial-800">模具上机</h3>
              <button
                onClick={() => setShowMountModal(false)}
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
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  选择注塑机 <span className="text-red-500">*</span>
                </label>
                <select
                  value={mountForm.machineId}
                  onChange={(e) =>
                    setMountForm({ ...mountForm, machineId: e.target.value })
                  }
                  className="select-field w-full"
                >
                  <option value="">请选择可用注塑机</option>
                  {availableMachines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.machineNo} - {m.machineType} ({m.tonnage}T)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  操作员 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={mountForm.operator}
                  onChange={(e) =>
                    setMountForm({ ...mountForm, operator: e.target.value })
                  }
                  className="input-field w-full"
                  placeholder="请输入操作员姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  备注
                </label>
                <textarea
                  value={mountForm.remark}
                  onChange={(e) =>
                    setMountForm({ ...mountForm, remark: e.target.value })
                  }
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="选填，如生产订单号等信息"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-industrial-100">
              <button
                onClick={() => setShowMountModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleMountSubmit}
                className="btn-primary flex-1"
              >
                确认上机
              </button>
            </div>
          </div>
        </div>
      )}

      {showDismountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-industrial-100">
              <h3 className="text-lg font-bold text-industrial-800">模具下机</h3>
              <button
                onClick={() => setShowDismountModal(false)}
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
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg">
                下机后将清空当前机台信息
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  操作员 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dismountForm.operator}
                  onChange={(e) =>
                    setDismountForm({ ...dismountForm, operator: e.target.value })
                  }
                  className="input-field w-full"
                  placeholder="请输入操作员姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-industrial-700 mb-1">
                  备注
                </label>
                <textarea
                  value={dismountForm.remark}
                  onChange={(e) =>
                    setDismountForm({ ...dismountForm, remark: e.target.value })
                  }
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="选填，如下机原因、模次信息等"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-industrial-100">
              <button
                onClick={() => setShowDismountModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleDismountSubmit}
                className="btn-primary flex-1"
              >
                确认下机
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
