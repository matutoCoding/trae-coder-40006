import { Bell, User, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="h-16 bg-white border-b border-industrial-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-industrial-800">{title}</h1>
        <span className="text-sm text-industrial-500">{today}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400"
          />
          <input
            type="text"
            placeholder="搜索..."
            className="pl-9 pr-4 py-2 w-64 bg-industrial-50 border border-industrial-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <button className="relative p-2 hover:bg-industrial-100 rounded-lg transition-colors">
          <Bell size={20} className="text-industrial-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-industrial-200">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-primary-600" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-industrial-800">管理员</div>
            <div className="text-industrial-500 text-xs">admin@factory.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
