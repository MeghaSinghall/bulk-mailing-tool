import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Users, Inbox, Archive, Clock, Info, RefreshCw, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const sidebarItems = [
    { name: 'Agents', path: '/dashboard/agents', icon: <Users className="w-5 h-5" /> },
    { name: 'MailNow', path: '/dashboard/mailnow', icon: <Inbox className="w-5 h-5" /> },
    { name: 'Batch Mail', path: '/dashboard/batch-mail', icon: <Archive className="w-5 h-5" /> },
    { name: 'Mail History', path: '/dashboard/mail-history', icon: <Clock className="w-5 h-5" /> }
    // { name: 'Generate Mail', path: '/dashboard/generate-mail', icon: <Info className="w-5 h-5" /> }
  ];
  
  const bottomItems = [
    // { name: 'Update', path: '/update', icon: <RefreshCw className="w-5 h-5" /> },
    { name: 'logout', path: '/logout', icon: <LogOut className="w-5 h-5" /> }
  ];

  return (
    <div className="h-screen w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-800">Mail Karo</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">{item.icon}</div>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-2 border-t border-gray-200">
        <nav className="px-2 space-y-1 w-full cursor-pointer">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="flex w-full items-center px-4 py-3 text-sm rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <div className="mr-3"><LogOut className="w-5 h-5" /></div>
              Logout
            </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;