import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { LayoutDashboard, Users, FileText, Video, Image, Mic, LogOut, Menu, X } from 'lucide-react';
import './AdminSidebar.css';
import '../../pages/admin/AdminMedia.css';

import logo from '../../assets/logo.png';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header / Hamburger */}
            <div className="admin-mobile-header d-md-none">
                <button className="btn btn-link text-white p-0" onClick={toggleSidebar}>
                    <Menu size={24} color="#d4af37" />
                </button>
                <img src={logo} alt="3% Generation" style={{ height: '40px', objectFit: 'contain' }} />
                <div style={{ width: '24px' }}></div> {/* Spacer for center alignment */}
            </div>

            {/* Mobile Overlay */}
            {isOpen && <div className="admin-sidebar-overlay d-md-none" onClick={() => setIsOpen(false)} />}

            {/* Sidebar */}
            <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header text-center position-relative">
                    {/* Close Button (Mobile Only) */}
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 p-3 d-md-none"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={24} />
                    </button>

                    <img src={logo} alt="3% Generation" className="img-fluid mb-2" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                    <p className="text-white-50 small mb-0 spacing-1">Admin Panel</p>
                </div>

                <Nav className="flex-column sidebar-nav">
                    <NavLink to="/admin/dashboard" className="sidebar-link">
                        <LayoutDashboard className="sidebar-icon" size={20} />
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/candidates" className="sidebar-link">
                        <Users className="sidebar-icon" size={20} />
                        Candidates
                    </NavLink>

                    <NavLink to="/admin/questionnaires" className="sidebar-link">
                        <FileText className="sidebar-icon" size={20} />
                        Questionnaires
                    </NavLink>

                    <NavLink to="/admin/videos" className="sidebar-link">
                        <Video className="sidebar-icon" size={20} />
                        Videos
                    </NavLink>

                    <NavLink to="/admin/photos" className="sidebar-link">
                        <Image className="sidebar-icon" size={20} />
                        Photos
                    </NavLink>

                    <NavLink to="/admin/audio" className="sidebar-link">
                        <Mic className="sidebar-icon" size={20} />
                        Audio
                    </NavLink>
                </Nav>

                <div className="sidebar-footer">
                    <button className="btn btn-outline-gold w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
