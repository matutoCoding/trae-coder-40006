export interface Order {
  id: string;
  orderNo: string;
  productName: string;
  quantity: number;
  completedQuantity: number;
  status: 'pending' | 'scheduled' | 'producing' | 'completed';
  deliveryDate: string;
  machineId: string;
  moldId: string;
  material: string;
  customer: string;
  createTime: string;
}

export interface Material {
  id: string;
  materialName: string;
  materialType: string;
  stock: number;
  unit: string;
  dryingTime: number;
  dryingTemperature: number;
  supplier: string;
}

export interface ColorFormula {
  id: string;
  formulaName: string;
  baseMaterial: string;
  colorMasterRatio: number;
  additiveRatio: number;
  colorCode: string;
  colorName: string;
}

export interface DryingRecord {
  id: string;
  materialId: string;
  materialName: string;
  startTime: string;
  endTime?: string;
  temperature: number;
  weight: number;
  operator: string;
  status: 'drying' | 'completed';
}

export interface Machine {
  id: string;
  machineNo: string;
  machineType: string;
  tonnage: number;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  currentTemperature: number;
  location: string;
}

export interface MachineParam {
  id: string;
  machineId: string;
  machineNo: string;
  injectionPressure: number;
  holdingPressure: number;
  holdingTime: number;
  moldTemperature: number;
  barrelTemperature: number;
  cycleTime: number;
  updateTime: string;
  operator: string;
}

export interface Mold {
  id: string;
  moldNo: string;
  moldName: string;
  cavities: number;
  totalShots: number;
  maxShots: number;
  status: 'on-machine' | 'off-machine' | 'maintenance';
  currentMachine?: string;
  lastMaintenance: string;
}

export interface MoldRecord {
  id: string;
  moldId: string;
  moldNo: string;
  type: 'mount' | 'dismount';
  machineId: string;
  machineNo: string;
  operator: string;
  time: string;
  remark?: string;
}

export interface MoldingCycle {
  id: string;
  orderId: string;
  orderNo: string;
  machineId: string;
  machineNo: string;
  startTime: string;
  endTime?: string;
  shotCount: number;
  cycleTime: number;
  status: 'running' | 'completed';
  productName: string;
}

export interface QualityCheck {
  id: string;
  cycleId: string;
  orderNo: string;
  productName: string;
  shrinkage: boolean;
  flash: boolean;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  result: 'pass' | 'fail';
  inspector: string;
  checkTime: string;
  remark?: string;
}

export interface EnergyRecord {
  id: string;
  machineId: string;
  machineNo: string;
  date: string;
  powerConsumption: number;
  runtime: number;
  unitCost: number;
  totalCost: number;
}

export interface DashboardStats {
  todayOrders: number;
  todayOutput: number;
  runningMachines: number;
  totalMachines: number;
  passRate: number;
  todayEnergy: number;
}
