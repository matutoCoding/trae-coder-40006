import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Palette,
  Settings2,
  Factory,
  ShieldCheck,
  Box,
  Zap,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/orders', icon: ClipboardList, label: '订单排产' },
  { path: '/material', icon: Palette, label: '原料配色' },
  { path: '/machine', icon: Settings2, label: '机台调机' },
  { path: '/molding', icon: Factory, label: '注塑成型' },
  { path: '/quality', icon: ShieldCheck, label: '产品质检' },
  { path: '/mold', icon: Box, label: '模具管理' },
  { path: '/energy', icon: Zap, label: '能耗统计' },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-industrial-800 text-white transition-all duration-300 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-industrial-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Factory size={18} />
            </div>
            <span className="font-bold text-lg">注塑管理</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-industrial-700 rounded-lg transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
