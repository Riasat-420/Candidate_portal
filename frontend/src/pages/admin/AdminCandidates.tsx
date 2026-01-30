import { useState, useEffect } from 'react';
import { Container, Button, Form, Badge, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, SortDesc, Eye, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import '../admin/AdminDashboard.css';
import './AdminMedia.css';

interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    onboardingStep: string;
    onboardingCompleted: boolean;
    createdAt: string;
    approvalStatus?: string;
    questionnaire?: {
        status: string;
    };
}

const AdminCandidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name-asc', 'name-desc', 'progress-high', 'progress-low'
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin/login');
            return;
        }

        fetchCandidates();
    }, [navigate]);

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/candidates', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCandidates(response.data.candidates || []);
        } catch (error: any) {
            console.error('Failed to fetch candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStepBadge = (step: string) => {
        const badges: { [key: string]: { variant: string; text: string } } = {
            'welcome': { variant: 'info', text: 'Welcome' },
            'photo-upload': { variant: 'primary', text: 'Photo' },
            'audio-recording': { variant: 'warning', text: 'Audio' },
            'video-recording': { variant: 'warning', text: 'Video' },
            'questionnaire': { variant: 'secondary', text: 'Questionnaire' },
            'completion': { variant: 'success', text: 'Completed' }
        };

        const badge = badges[step] || { variant: 'secondary', text: step };
        return <Badge bg={badge.variant}>{badge.text}</Badge>;
    };

    const getApprovalBadge = (status: string) => {
        const badges: { [key: string]: { variant: string; text: string } } = {
            'pending': { variant: 'warning', text: 'Pending' },
            'approved': { variant: 'success', text: 'Approved' },
            'rejected': { variant: 'danger', text: 'Rejected' },
            'archived': { variant: 'secondary', text: 'Archived' }
        };

        const badge = badges[status] || { variant: 'secondary', text: status || 'Pending' };
        return <Badge bg={badge.variant}>{badge.text}</Badge>;
    };

    // Calculate progress percentage helper
    const getProgressValue = (step: string) => {
        const steps = ['welcome', 'photo-upload', 'audio-recording', 'video-recording', 'questionnaire', 'completion'];
        const index = steps.indexOf(step);
        return index >= 0 ? index : -1;
    };

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = `${candidate.firstName} ${candidate.lastName} ${candidate.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'pending' && (!candidate.approvalStatus || candidate.approvalStatus === 'pending')) ||
            candidate.approvalStatus === statusFilter;

        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'name-asc':
                return a.firstName.localeCompare(b.firstName);
            case 'name-desc':
                return b.firstName.localeCompare(a.firstName);
            case 'progress-high':
                return getProgressValue(b.onboardingStep) - getProgressValue(a.onboardingStep);
            case 'progress-low':
                return getProgressValue(a.onboardingStep) - getProgressValue(b.onboardingStep);
            default:
                return 0;
        }
    });

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm('Are you sure you want to delete this candidate? This action cannot be undone and will delete all their data.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await api.delete(`/admin/candidates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCandidates();
        } catch (error) {
            console.error('Failed to delete candidate:', error);
            alert('Failed to delete candidate');
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <Container fluid>
                    {/* Standardized Header */}
                    <div className="page-header">
                        <div className="page-header-content">
                            <h2 className="page-title">
                                Candidates
                            </h2>
                            <p className="page-subtitle">Manage all candidate registrations and onboarding status</p>
                        </div>
                        <div className="total-badge">
                            {filteredCandidates.length} Found
                        </div>
                    </div>

                    <Card className="bg-dark border-secondary mb-4 p-3 filter-card">
                        <div className="d-flex flex-wrap gap-3 align-items-center">
                            {/* Search */}
                            <div className="flex-grow-1 position-relative" style={{ minWidth: '250px' }}>
                                <Search className="position-absolute text-muted" size={18} style={{ left: '12px', top: '10px' }} />
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-black text-white border-secondary ps-5"
                                    style={{ color: '#fff' }}
                                />
                            </div>

                            {/* Status Filter */}
                            <div style={{ minWidth: '180px' }}>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-black text-white border-secondary"
                                    style={{ color: '#fff' }}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </Form.Select>
                            </div>

                            {/* Sort By */}
                            <div style={{ minWidth: '180px' }}>
                                <Form.Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-black text-white border-secondary"
                                    style={{ color: '#fff' }}
                                >
                                    <option value="newest">📅 Newest First</option>
                                    <option value="oldest">📅 Oldest First</option>
                                    <option value="name-asc">🔤 Name (A-Z)</option>
                                    <option value="name-desc">🔤 Name (Z-A)</option>
                                    <option value="progress-high">📈 High Progress</option>
                                    <option value="progress-low">📉 Low Progress</option>
                                </Form.Select>
                            </div>
                        </div>
                    </Card>

                    {loading ? (
                        <div className="text-center text-white py-5">
                            <div className="spinner-border text-gold" role="status"></div>
                        </div>
                    ) : (
                        <Row>
                            {filteredCandidates.length === 0 ? (
                                <Col xs={12}>
                                    <div className="text-center text-muted py-5 border border-secondary rounded bg-dark">
                                        No candidates found matching your criteria.
                                    </div>
                                </Col>
                            ) : (
                                filteredCandidates.map((candidate) => (
                                    <Col key={candidate.id} lg={6} xl={4} className="mb-4">
                                        <Card
                                            className="h-100 bg-dark border-secondary candidate-card"
                                            onClick={() => navigate(`/admin/candidates/${candidate.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card.Body className="d-flex flex-column">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-3" style={{ width: '48px', height: '48px', fontSize: '1.2rem', flexShrink: 0 }}>
                                                            {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                                        </div>
                                                        <div style={{ overflow: 'hidden' }}>
                                                            <h5 className="card-title text-white mb-0 text-truncate">{candidate.firstName} {candidate.lastName}</h5>
                                                            <div className="card-subtitle text-muted small text-truncate">{candidate.email}</div>
                                                        </div>
                                                    </div>
                                                    {getApprovalBadge(candidate.approvalStatus || 'pending')}
                                                </div>

                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-white-50 small">Onboarding</span>
                                                        <span className="text-white small">{getStepBadge(candidate.onboardingStep)}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-white-50 small">Questionnaire</span>
                                                        <span className="text-white small">
                                                            {candidate.questionnaire ? (
                                                                <Badge bg={candidate.questionnaire.status === 'approved' ? 'success' : candidate.questionnaire.status === 'rejected' ? 'danger' : 'warning'}>
                                                                    {candidate.questionnaire.status}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted">Not started</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-white-50 small">Joined</span>
                                                        <span className="text-white small">{new Date(candidate.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-3 border-top border-secondary d-flex gap-2">
                                                    <Button
                                                        className="btn-outline-gold flex-grow-1"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/candidates/${candidate.id}`);
                                                        }}
                                                    >
                                                        <Eye size={16} /> View Details
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={(e) => handleDelete(candidate.id, e)}
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            )}
                        </Row>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default AdminCandidates;
