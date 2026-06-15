import { create } from 'zustand';
import type {
  Order,
  DryingRecord,
  MachineParam,
  Mold,
  MoldRecord,
  QualityCheck,
} from '../types';
import {
  orders as initialOrders,
  dryingRecords as initialDryingRecords,
  machineParams as initialMachineParams,
  molds as initialMolds,
  moldRecords as initialMoldRecords,
  qualityChecks as initialQualityChecks,
  machines,
  materials,
} from '../data/mockData';

interface StoreState {
  orders: Order[];
  dryingRecords: DryingRecord[];
  machineParams: MachineParam[];
  molds: Mold[];
  moldRecords: MoldRecord[];
  qualityChecks: QualityCheck[];

  addOrder: (order: Omit<Order, 'id' | 'orderNo' | 'status' | 'completedQuantity' | 'createTime'>) => void;
  scheduleOrder: (orderId: string, machineId: string, moldId: string) => void;

  startDrying: (record: Omit<DryingRecord, 'id' | 'endTime' | 'status'>) => void;
  endDrying: (recordId: string) => void;

  updateMachineParam: (machineId: string, params: Partial<MachineParam>) => void;

  mountMold: (moldId: string, machineId: string, operator: string, remark?: string) => void;
  dismountMold: (moldId: string, operator: string, remark?: string) => void;

  addQualityCheck: (check: Omit<QualityCheck, 'id'>) => void;
}

const generateOrderNo = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `ORD-${y}${m}${d}-${rand}`;
};

const generateId = () => Math.random().toString(36).substring(2, 10);

const formatDateTime = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const useStore = create<StoreState>((set, get) => ({
  orders: initialOrders,
  dryingRecords: initialDryingRecords,
  machineParams: initialMachineParams,
  molds: initialMolds,
  moldRecords: initialMoldRecords,
  qualityChecks: initialQualityChecks,

  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      orderNo: generateOrderNo(),
      status: 'pending',
      completedQuantity: 0,
      createTime: formatDateTime(),
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
  },

  scheduleOrder: (orderId, machineId, moldId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: 'scheduled' as const, machineId, moldId }
          : o
      ),
    }));
  },

  startDrying: (recordData) => {
    const newRecord: DryingRecord = {
      ...recordData,
      id: generateId(),
      status: 'drying',
    };
    set((state) => ({ dryingRecords: [newRecord, ...state.dryingRecords] }));
  },

  endDrying: (recordId) => {
    set((state) => ({
      dryingRecords: state.dryingRecords.map((r) =>
        r.id === recordId
          ? { ...r, status: 'completed' as const, endTime: formatDateTime() }
          : r
      ),
    }));
  },

  updateMachineParam: (machineId, params) => {
    set((state) => {
      const existing = state.machineParams.find((p) => p.machineId === machineId);
      if (existing) {
        return {
          machineParams: state.machineParams.map((p) =>
            p.machineId === machineId
              ? { ...p, ...params, updateTime: formatDateTime() }
              : p
          ),
        };
      } else {
        const machine = machines.find((m) => m.id === machineId);
        const newParam: MachineParam = {
          id: generateId(),
          machineId,
          machineNo: machine?.machineNo || '',
          injectionPressure: params.injectionPressure || 0,
          holdingPressure: params.holdingPressure || 0,
          holdingTime: params.holdingTime || 0,
          moldTemperature: params.moldTemperature || 0,
          barrelTemperature: params.barrelTemperature || 0,
          cycleTime: params.cycleTime || 0,
          updateTime: formatDateTime(),
          operator: params.operator || '管理员',
        };
        return { machineParams: [...state.machineParams, newParam] };
      }
    });
  },

  mountMold: (moldId, machineId, operator, remark) => {
    const state = get();
    const mold = state.molds.find((m) => m.id === moldId);
    const machine = machines.find((m) => m.id === machineId);

    if (!mold || !machine) return;

    const record: MoldRecord = {
      id: generateId(),
      moldId,
      moldNo: mold.moldNo,
      type: 'mount',
      machineId,
      machineNo: machine.machineNo,
      operator,
      time: formatDateTime(),
      remark,
    };

    set((state) => ({
      molds: state.molds.map((m) =>
        m.id === moldId
          ? { ...m, status: 'on-machine' as const, currentMachine: machine.machineNo }
          : m
      ),
      moldRecords: [record, ...state.moldRecords],
    }));
  },

  dismountMold: (moldId, operator, remark) => {
    const state = get();
    const mold = state.molds.find((m) => m.id === moldId);
    const currentMachine = machines.find((m) => m.machineNo === mold?.currentMachine);

    if (!mold) return;

    const record: MoldRecord = {
      id: generateId(),
      moldId,
      moldNo: mold.moldNo,
      type: 'dismount',
      machineId: currentMachine?.id || '',
      machineNo: mold.currentMachine || '',
      operator,
      time: formatDateTime(),
      remark,
    };

    set((state) => ({
      molds: state.molds.map((m) =>
        m.id === moldId
          ? { ...m, status: 'off-machine' as const, currentMachine: undefined }
          : m
      ),
      moldRecords: [record, ...state.moldRecords],
    }));
  },

  addQualityCheck: (checkData) => {
    const newCheck: QualityCheck = {
      ...checkData,
      id: generateId(),
    };
    set((state) => ({ qualityChecks: [newCheck, ...state.qualityChecks] }));
  },
}));
