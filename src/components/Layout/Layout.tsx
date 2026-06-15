import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/': '仪表盘',
  '/orders': '订单排产',
  '/material': '原料配色',
  '/machine': '机台调机',
  '/molding': '注塑成型',
  '/quality': '产品质检',
  '/mold': '模具管理',
  '/energy': '能耗统计',
};

export default function Layout() {
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(256);

  useEffect(() => {
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      setSidebarWidth(sidebar.offsetWidth);
    }
  }, [location.pathname]);

  const title = pageTitles[location.pathname] || '注塑管理系统';

  return (
    <div className="min-h-screen bg-industrial-50">
      <Sidebar />
      <div className="transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <Header title={title} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
