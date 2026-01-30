import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './OnboardingSteps.css';

interface WelcomeProps {
    onComplete: (nextStep: string) => void;
    currentStep?: string;
}

const Welcome = ({ onComplete }: WelcomeProps) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const handleGetStarted = () => {
        if (termsAccepted) {
            onComplete('photo-upload');
        }
    };

    return (
        <div className="onboarding-step welcome-step">
            <div className="welcome-content">
                {/* Yellow Welcome Badge */}
                <div className="welcome-badge">WELCOME</div>

                {/* Main Heading */}
                <h1 className="welcome-heading">
                    Unlock Your Potential: Begin Your Journey with<br />3% Generation
                </h1>

                {/* Subtitle */}
                <p className="welcome-subtitle">
                    This is more than an onboarding process; it's your first step towards a transformative career. Join an elite network of top-tier talent and access exclusive opportunities tailored to your skills.
                </p>

                {/* Get Started Button */}
                <div className="welcome-actions">
                    {/* Terms and Conditions Checkbox */}
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span>
                                I agree to the{' '}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowTerms(true);
                                    }}
                                    style={{ color: '#4a9eff', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    terms and conditions
                                </a>
                                {' '}and privacy policy
                            </span>
                        </label>
                    </div>

                    <Button
                        className="btn-get-started"
                        size="lg"
                        onClick={handleGetStarted}
                        disabled={!termsAccepted}
                        style={{ opacity: termsAccepted ? 1 : 0.5 }}
                    >
                        Start Your Journey
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="welcome-info-box">
                    <h3 className="info-title">What You'll Complete:</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-icon">📷</span>
                            <span className="info-text">Professional Photo</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">🎤</span>
                            <span className="info-text">Audio Introduction</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">🎥</span>
                            <span className="info-text">Video Presentation</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📝</span>
                            <span className="info-text">Profile Questionnaire</span>
                        </div>
                    </div>
                    <p className="info-note">⏱️ Estimated time: 15-20 minutes</p>

                    {/* Recording Tips */}
                    <div style={{ marginTop: '20px', background: 'rgba(218, 165, 32, 0.1)', borderLeft: '3px solid #c9a227', padding: '15px', borderRadius: '5px' }}>
                        <h6 style={{ color: '#c9a227', marginBottom: '10px', fontSize: '0.9rem' }}>📝 Important Recording Tips:</h6>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                            <li><strong>Audio Recording:</strong> Start by stating your name, pause briefly, then share your professional summary</li>
                            <li><strong>Video Recording:</strong> Only mention your name in the video</li>
                            <li>This helps employers identify you while maintaining your privacy</li>
                        </ul>
                    </div>

                    {/* Motivational Footer */}
                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderTop: '2px solid #c9a227' }}>
                        <h5 style={{ color: '#c9a227', marginBottom: '15px', textAlign: 'center', fontSize: '1rem' }}>Why This Matters</h5>
                        <div style={{ display: 'grid', gap: '12px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                <strong style={{ color: '#c9a227' }}>Showing up as your best self</strong> helps you land your dream job <strong>10 times faster</strong>.
                            </p>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                Find a company that matches your <strong style={{ color: '#c9a227' }}>energy, work ethic, and attitude</strong>.
                            </p>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                It's time to express yourself in a <strong style={{ color: '#c9a227' }}>professional way</strong> that gets you the right exposure.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions Modal */}
            <Modal show={showTerms} onHide={() => setShowTerms(false)} centered size="lg">
                <Modal.Header closeButton style={{ background: '#2a2a2a', borderBottom: '1px solid #444' }}>
                    <Modal.Title style={{ color: '#c9a227' }}>Terms and Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#2a2a2a', color: '#fff', maxHeight: '60vh', overflowY: 'auto' }}>
                    <h5 style={{ color: '#c9a227', marginBottom: '15px' }}>1. Acceptance of Terms</h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        By accessing and using 3% Generation platform, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <h5 style={{ color: '#c9a227', marginBottom: '15px' }}>2. Use of Platform</h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform.
                    </p>

                    <h5 style={{ color: '#c9a227', marginBottom: '15px' }}>3. User Content</h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        You retain all rights to the content you upload, including photos, audio, and video recordings. By uploading content, you grant us a license to use, display, and share this content with potential employers.
                    </p>

                    <h5 style={{ color: '#c9a227', marginBottom: '15px' }}>4. Privacy Policy</h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy. We will not share your personal information with third parties without your consent.
                    </p>

                    <h5 style={{ color: '#c9a227', marginBottom: '15px' }}>5. Account Security</h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>

                    <h5 style={{ color: '#c9a227', marginBottom: '15px' }}>6. Modifications</h5>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0' }}>
                        We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
                    </p>
                </Modal.Body>
                <Modal.Footer style={{ background: '#2a2a2a', borderTop: '1px solid #444' }}>
                    <Button variant="secondary" onClick={() => setShowTerms(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Welcome;
