'use client';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';

export default function AdminNav({ title, children }) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  return (
    <nav className="bg-white border-b border-slate-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {children}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiLogOut className="mr-2" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
