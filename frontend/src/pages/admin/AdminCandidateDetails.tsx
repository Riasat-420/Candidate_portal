import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Image, Mic, Video } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import QuestionnaireView from '../../components/admin/QuestionnaireView';
import api from '../../services/api';
import '../admin/AdminDashboard.css';
import './AdminCandidateDetails.css';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    onboardingStep: string;
    onboardingCompleted: boolean;
    createdAt: string;
    approvalStatus?: string;
    rejectionReason?: string;
    uploads?: any[];
    questionnaire?: any;
}

type TabType = 'profile' | 'media' | 'questionnaire';

const AdminCandidateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    // Modal States
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchCandidateDetails();
    }, [id]);

    const fetchCandidateDetails = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await api.get(`/admin/candidates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCandidate(response.data.candidate);
        } catch (error) {
            console.error('Failed to fetch candidate details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('adminToken');
            await api.put(`/admin/candidates/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchCandidateDetails();
            setShowApproveModal(false);
        } catch (error) {
            console.error('Failed to approve candidate:', error);
            alert('Failed to approve candidate. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) return alert('Please provide a reason for rejection');

        setProcessing(true);
        try {
            const token = localStorage.getItem('adminToken');
            await api.put(`/admin/candidates/${id}/reject`, { reason: rejectionReason }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowRejectModal(false);
            setRejectionReason('');
            await fetchCandidateDetails();
        } catch (error) {
            console.error('Failed to reject candidate:', error);
            alert('Failed to reject candidate. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const calculateProgress = () => {
        if (!candidate) return 0;
        const steps = ['welcome', 'photo', 'audio', 'video', 'questionnaire', 'completion'];
        const currentIndex = steps.indexOf(candidate.onboardingStep);
        return Math.round(((currentIndex + 1) / steps.length) * 100);
    };

    const getStepStatus = (step: string) => {
        if (!candidate) return false;
        const steps = ['welcome', 'photo', 'audio', 'video', 'questionnaire', 'completion'];
        const currentIndex = steps.indexOf(candidate.onboardingStep);
        const stepIndex = steps.indexOf(step);
        return stepIndex <= currentIndex;
    };

    const getMediaUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    if (loading) return <div className="text-center text-white p-5">Loading candidate details...</div>;
    if (!candidate) return <div className="text-center text-white p-5">Candidate not found</div>;

    const photo = candidate.uploads?.find(u => u.type === 'photo');
    const audio = candidate.uploads?.find(u => u.type === 'audio');
    const video = candidate.uploads?.find(u => u.type === 'video');
    const progress = calculateProgress();

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <Container fluid className="candidate-details-container">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Button className="btn-outline-gold" size="sm" onClick={() => navigate('/admin/candidates')}>
                            ← Back to Candidates
                        </Button>
                    </div>

                    {/* Header Section */}
                    <div className="candidate-header">
                        {/* Name and Actions */}
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div className="candidate-name-section">
                                <h1 className="candidate-name">{candidate.firstName} {candidate.lastName}</h1>
                                <p className="candidate-registered">
                                    Registered On {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="d-flex gap-2">
                                {candidate.approvalStatus !== 'approved' && (
                                    <Button
                                        className="btn-gold"
                                        onClick={() => setShowApproveModal(true)}
                                        disabled={processing}
                                    >
                                        ✓ Approve
                                    </Button>
                                )}
                                {candidate.approvalStatus !== 'rejected' && (
                                    <Button
                                        variant="danger"
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={processing}
                                    >
                                        ✗ Reject
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Progress Section Removed as per request */}

                        {/* Tab Navigation */}
                        <div className="tab-navigation">
                            <button
                                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'media' ? 'active' : ''}`}
                                onClick={() => setActiveTab('media')}
                            >
                                Media
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'questionnaire' ? 'active' : ''}`}
                                onClick={() => setActiveTab('questionnaire')}
                            >
                                Questionnaire
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="profile-tab">
                                <div className="profile-avatar-section">
                                    <div className="profile-avatar">
                                        {photo ? (
                                            <img src={getMediaUrl(photo.url)} alt="Profile" />
                                        ) : (
                                            <span>{candidate.firstName[0]}{candidate.lastName[0]}</span>
                                        )}
                                    </div>
                                    <h2 className="profile-name">{candidate.firstName} {candidate.lastName}</h2>
                                </div>

                                <div className="basic-info-section">
                                    <h3 className="section-title">Basic Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <Mail className="info-icon" size={24} />
                                            <div className="info-content">
                                                <div className="info-label">Email Address</div>
                                                <div className="info-value">{candidate.email || <span className="not-provided">Not provided</span>}</div>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Phone className="info-icon" size={24} />
                                            <div className="info-content">
                                                <div className="info-label">Phone Number</div>
                                                <div className="info-value">{candidate.phone || <span className="not-provided">Not provided</span>}</div>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <MapPin className="info-icon" size={24} />
                                            <div className="info-content">
                                                <div className="info-label">Location</div>
                                                <div className="info-value">
                                                    {candidate.questionnaire?.city || <span className="not-provided">Not provided</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Calendar className="info-icon" size={24} />
                                            <div className="info-content">
                                                <div className="info-label">Date of Birth</div>
                                                <div className="info-value">
                                                    {candidate.questionnaire?.dateOfBirth || <span className="not-provided">Not provided</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Media Tab */}
                        {activeTab === 'media' && (
                            <div className="media-grid">
                                {/* Profile Photo */}
                                <div className="media-card">
                                    <div className="media-card-header">
                                        <Image className="media-card-icon" size={24} />
                                        <h3 className="media-card-title">Profile Photo</h3>
                                    </div>
                                    <div className="media-preview">
                                        {photo ? (
                                            <img src={getMediaUrl(photo.url)} alt="Profile" />
                                        ) : (
                                            <div className="empty-media">No photo uploaded</div>
                                        )}
                                    </div>
                                </div>

                                {/* Audio Recording */}
                                <div className="media-card">
                                    <div className="media-card-header">
                                        <Mic className="media-card-icon" size={24} />
                                        <h3 className="media-card-title">Audio Recording</h3>
                                    </div>
                                    <div className="media-preview">
                                        {audio ? (
                                            <audio controls src={getMediaUrl(audio.url)} />
                                        ) : (
                                            <div className="empty-media">No audio recording uploaded</div>
                                        )}
                                    </div>
                                </div>

                                {/* Video Interview */}
                                <div className="media-card">
                                    <div className="media-card-header">
                                        <Video className="media-card-icon" size={24} />
                                        <h3 className="media-card-title">Video Interview</h3>
                                    </div>
                                    <div className="media-preview">
                                        {video ? (
                                            <video controls src={getMediaUrl(video.url)} />
                                        ) : (
                                            <div className="empty-media">No video interview uploaded</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'questionnaire' && (
                            <QuestionnaireView data={candidate.questionnaire} />
                        )}
                    </div>
                </Container>
            </div>

            {/* Approve Modal */}
            <ConfirmationModal
                show={showApproveModal}
                onHide={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                title="Approve Candidate"
                message={`Are you sure you want to approve ${candidate.firstName} ${candidate.lastName}? This will grant them access to the platform.`}
                confirmText="Approve Candidate"
                confirmVariant="success"
            />

            {/* Reject Modal */}
            <ConfirmationModal
                show={showRejectModal}
                onHide={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                title="Reject Candidate"
                message={`Please provide a reason for rejecting ${candidate.firstName} ${candidate.lastName}'s application.`}
                confirmText="Reject Application"
                confirmVariant="danger"
                showReasonInput={true}
                reason={rejectionReason}
                onReasonChange={setRejectionReason}
            />
        </div>
    );
};

export default AdminCandidateDetails;
