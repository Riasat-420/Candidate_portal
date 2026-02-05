import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes (mobile behavior)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <div className="admin-mobile-header">
                <div className="mobile-logo">3% GENERATION</div>
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`admin-layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <main className="admin-layout-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
