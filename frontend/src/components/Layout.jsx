import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-fixed relative">
            <div className="absolute inset-0 bg-gray-50/95 backdrop-blur-sm z-0"></div>

            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel border-b-0 mb-8 rounded-b-2xl mx-4 mt-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-primary p-2 rounded-lg shadow-lg">
                            <span className="text-white font-bold text-xl tracking-tighter">ET</span>
                        </div>
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">EduTest</div>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-200/50">
                                <User size={18} className="text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {user.username} <span className="text-xs text-indigo-500 uppercase tracking-wide ml-1 font-bold">{user.role}</span>
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors bg-white rounded-full shadow-sm hover:shadow-md"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 z-10 relative">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="mt-12 bg-white/80 backdrop-blur-md border-t border-gray-200 py-6 z-10 relative">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p className="font-medium">Designed & Built by <a href="https://github.com/lgomez15" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold">@lgomez15</a></p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
