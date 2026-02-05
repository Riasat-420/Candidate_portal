import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './OnboardingSteps.css';
import './Welcome.css';
import introVideo from '../../assets/intro_video.mp4';

interface WelcomeProps {
    onComplete: (nextStep: string) => void;
    currentStep?: string;
}

const Welcome = ({ onComplete }: WelcomeProps) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const handleGetStarted = () => {
        if (termsAccepted) {
            onComplete('id-assessment');
        }
    };

    return (
        <div className="welcome-redesign">
            {/* Hero Section */}
            <section className="welcome-hero">
                <div className="welcome-badge">BECOME UNEMPLOYABLE</div>
                <h1>
                    Unlock Your Potential: Begin Your Journey with<br />3% Generation
                </h1>
                <p className="welcome-hero-subtitle">
                    This is more than an onboarding process; it's your first step towards a transformative career.
                    Join an elite network of top-tier talent and access exclusive opportunities tailored to your skills.
                </p>
            </section>

            {/* Video Section */}
            <section className="welcome-video-section">
                <h2>See What Awaits You</h2>
                <p>Watch how thousands like you transformed their careers in just 15 Minutes!</p>
                <div className="video-container">
                    <video
                        controls
                        preload="metadata"
                        src={introVideo}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </section>

            {/* Steps Section */}
            <section className="welcome-steps">
                <h2>
                    Complete <strong>4 Steps</strong> to Construct your <strong>RECRUITER-READY CV</strong> in <strong>15 MINUTES</strong>
                </h2>
                <div className="steps-grid">
                    {/* Step 1: Professional Photo */}
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <div className="step-number">1</div>
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                    <circle cx="12" cy="13" r="3" />
                                </svg>
                            </div>
                        </div>
                        <h3>Professional Photo</h3>
                        <p>
                            Upload or capture a clear, professional headshot that represents you at your best.
                        </p>
                    </div>

                    {/* Step 2: Audio Introduction */}
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <div className="step-number">2</div>
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" x2="12" y1="19" y2="22" />
                                </svg>
                            </div>
                        </div>
                        <h3>Audio Introduction</h3>
                        <p>
                            Record a brief audio intro to showcase your communication skills and personality.
                        </p>
                    </div>

                    {/* Step 3: Video Presentation */}
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <div className="step-number">3</div>
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7" />
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                </svg>
                            </div>
                        </div>
                        <h3>Video Presentation</h3>
                        <p>
                            Create a professional video introduction answering key questions about your career.
                        </p>
                    </div>

                    {/* Step 4: Questionnaire */}
                    <div className="step-card">
                        <div className="step-icon-wrapper">
                            <div className="step-number">4</div>
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" x2="8" y1="13" y2="13" />
                                    <line x1="16" x2="8" y1="17" y2="17" />
                                    <line x1="10" x2="8" y1="9" y2="9" />
                                </svg>
                            </div>
                        </div>
                        <h3>Questionnaire</h3>
                        <p>
                            Complete a comprehensive profile with work experience, skills, and career goals.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="welcome-cta">
                <h2>Ready to BEGIN Your Career?</h2>

                <div className="privacy-checkbox-wrapper">
                    <label className="privacy-checkbox-label">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <span>
                            I agree to the
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowTerms(true);
                                }}
                            >
                                terms and conditions
                            </a>
                            and privacy policy
                        </span>
                    </label>
                </div>

                <Button
                    className="btn-get-started-new"
                    size="lg"
                    onClick={handleGetStarted}
                    disabled={!termsAccepted}
                >
                    GET STARTED NOW
                </Button>
            </section>

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
