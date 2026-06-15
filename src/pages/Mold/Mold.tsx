import { useState } from 'react';
import {
  Box,
  ArrowUpDown,
  Wrench,
  Clock,
  Plus,
  Layers,
  Activity,
  History,
} from 'lucide-react';
import { molds, moldRecords, machines } from '@/data/mockData';

const statusMap: Record<string, { label: string; className: string }> = {
  'on-machine': { label: '使用中', className: 'status-running' },
  'off-machine': { label: '闲置', className: 'status-idle' },
  maintenance: { label: '保养中', className: 'status-maintenance' },
};

export default function Mold() {
  const [activeTab, setActiveTab] = useState<'list' | 'records'>('list');

  const onMachineCount = molds.filter((m) => m.status === 'on-machine').length;
  const maintenanceCount = molds.filter((m) => m.status === 'maintenance').length;

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
                        <button className="flex-1 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                          上机
                        </button>
                      )}
                      {mold.status === 'on-machine' && (
                        <button className="flex-1 py-2 text-sm text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
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
    </div>
  );
}
