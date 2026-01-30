import { NavLink, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { LayoutDashboard, Users, FileText, Video, Image, Mic, LogOut } from 'lucide-react';
import './AdminSidebar.css';
import '../../pages/admin/AdminMedia.css';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3 className="gold-text">3% GENERATION</h3>
                <p className="text-white-50">Admin Panel</p>
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
    );
};

export default AdminSidebar;
