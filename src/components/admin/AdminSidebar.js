'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiList, 
  FiPlus, 
  FiLogOut, 
  FiBook, 
  FiSettings, 
  FiHelpCircle, 
  FiPieChart,
  FiShoppingBag,
  FiAward,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Ana Sayfa', icon: FiHome, href: '/admin/panel' },
    { title: 'Kategoriler', icon: FiList, href: '/admin/panel?tab=categories' },
    { title: 'Soru Yönetimi', icon: FiBook, href: '/admin/panel?tab=questions' },
    { title: 'Görev Yönetimi', icon: FiTarget, href: '/admin/panel?tab=tasks' },
    { title: 'Mağaza Yönetimi', icon: FiShoppingBag, href: '/admin/panel?tab=shop' },
    { title: 'XP & Seviye Ayarları', icon: FiTrendingUp, href: '/admin/panel?tab=levels' },
    { title: 'Başarılar', icon: FiAward, href: '/admin/panel?tab=achievements' },
    { title: 'İstatistikler', icon: FiPieChart, href: '/admin/panel?tab=stats' },
    { title: 'Ayarlar', icon: FiSettings, href: '/admin/panel?tab=settings' },
    { title: 'Yardım', icon: FiHelpCircle, href: '/admin/panel?tab=help' }
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Admin</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            {menuItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              sessionStorage.removeItem('adminAuth');
              window.location.href = '/admin';
            }}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
