import { useState, useEffect } from 'react';
import { Container, Button, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Trash2, Check, X } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import '../admin/AdminDashboard.css';
import './AdminQuestionnaires.css';

interface Questionnaire {
    id: string;
    title: string;
    candidateName: string;
    candidate_name: string;
    status: string;
    created_at: string;
    createdAt: string;
    submittedAt: string;
    userId: string;
    workExperience?: string;
    details?: any; // For full details in modal
}

const AdminQuestionnaires = () => {
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin/login');
            return;
        }

        fetchQuestionnaires();
    }, [navigate]);

    const fetchQuestionnaires = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/questionnaires', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Transform data if needed to match interface
            const data = response.data.questionnaires.map((q: any) => ({
                ...q,
                title: q.title || `Questionnaire #${q.id.substring(0, 8)}...`
            }));

            setQuestionnaires(data || []);
        } catch (error) {
            console.error('Failed to fetch questionnaires:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (q: Questionnaire) => {
        // Use candidate_id/userId to fetch the questionnaire context
        navigate(`/admin/questionnaires/${q.userId || q.candidate_id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await api.delete(`/admin/questionnaires/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQuestionnaires();
        } catch (error) {
            console.error('Failed to delete questionnaire:', error);
            alert('Failed to delete questionnaire');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB'); // DD/MM/YYYY format as in screenshot
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <Container fluid className="admin-questionnaires-container">
                    {/* Header */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">
                                <FileText size={32} color="#c9a227" />
                                Questionnaires
                            </h1>
                            <p className="page-subtitle">View and manage all candidate questionnaires in the system</p>
                        </div>
                        <div className="total-badge">
                            {questionnaires.length} TOTAL
                        </div>
                    </div>

                    {/* Table View */}
                    {loading ? (
                        <div className="text-center text-white py-5">
                            <div className="spinner-border text-gold" role="status"></div>
                        </div>
                    ) : (
                        <div className="table-card">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Candidate</th>
                                        <th>Status</th>
                                        <th>Created Date</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questionnaires.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                No questionnaires found
                                            </td>
                                        </tr>
                                    ) : (
                                        questionnaires.map((q) => (
                                            <tr key={q.id}>
                                                <td data-label="Title" className="col-title">
                                                    {q.title}
                                                </td>
                                                <td data-label="Candidate" className="col-candidate">
                                                    {q.candidateName || q.candidate_name}
                                                </td>
                                                <td data-label="Status">
                                                    <span className={`status-badge ${q.status.toLowerCase()}`}>
                                                        {q.status}
                                                    </span>
                                                </td>
                                                <td data-label="Created Date" className="col-date">
                                                    {formatDate(q.submittedAt || q.created_at || q.createdAt)}
                                                </td>
                                                <td data-label="Actions" className="col-actions">
                                                    <div className="action-btn-group">
                                                        <button
                                                            className="action-btn view"
                                                            onClick={() => handleView(q)}
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} /> View
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => handleDelete(q.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default AdminQuestionnaires;
