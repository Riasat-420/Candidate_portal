import { useState, useRef, useEffect } from 'react';
import { Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';
import './OnboardingSteps.css';
import './VideoRecording.css';

interface VideoRecordingProps {
    onComplete: (nextStep: string) => void;
}

const VideoRecording = ({ onComplete }: VideoRecordingProps) => {
    // Tab management
    const [activeTab, setActiveTab] = useState<'summary' | 'recording'>('summary');

    // Summary tab state
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);

    // Recording tab state
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
    const [previewURL, setPreviewURL] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [cameraStarted, setCameraStarted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const wordCount = summary.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minWords = 50;
    const maxWords = 500;

    useEffect(() => {
        return () => {
            stopCamera();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Attach stream to video element when both are available
    useEffect(() => {
        if (stream && videoRef.current && !recordedVideo) {
            console.log('Attaching stream to video element');
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                console.log('Video metadata loaded, attempting to play');
                videoRef.current?.play().catch(err => {
                    console.error('Error playing video:', err);
                });
            };
        }
    }, [stream, recordedVideo]);

    // Handle summary submission
    const handleSubmitSummary = async () => {
        if (wordCount < minWords) {
            setError(`Please write at least ${minWords} words about your professional background.`);
            return;
        }

        if (wordCount > maxWords) {
            setError(`Please keep your summary under ${maxWords} words.`);
            return;
        }

        setSummaryLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/video/generate-questions',
                { summary },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const generatedQuestions = response.data.questions;
            setQuestions(generatedQuestions);
            setActiveTab('recording'); // Switch to recording tab
            setSummaryLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
            setSummaryLoading(false);
        }
    };

    // Camera and recording functions
    const startCamera = async () => {
        try {
            console.log('Starting camera...');
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });
            console.log('Media stream obtained:', mediaStream);
            setStream(mediaStream);
            setCameraStarted(true);
            setError('');
            console.log('Camera started successfully, stream will be attached by useEffect');
        } catch (err) {
            console.error('Camera start error:', err);
            setError('Failed to access camera and microphone. Please grant permission and try again.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startRecording = () => {
        if (!stream) {
            setError('Camera not ready. Please start camera first.');
            return;
        }

        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp8,opus'
        });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecordedVideo(blob);
            setPreviewURL(URL.createObjectURL(blob));
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setRecordingDuration(0);

        timerRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            console.log('Stopping recording...');
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Stop the camera to prevent live stream from showing
            console.log('Stopping camera to show recorded video');
            stopCamera();
            setCameraStarted(false);
        }
    };

    const retakeVideo = () => {
        console.log('Retaking video, clearing recorded video and restarting camera');
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        // Clear the video element srcObject to prevent showing old video
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = '';
        }

        setRecordedVideo(null);
        setPreviewURL('');
        setRecordingDuration(0);

        // Restart camera for new recording
        startCamera();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleUpload = async () => {
        if (!recordedVideo) {
            setError('Please record a video first.');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const arrayBuffer = await recordedVideo.arrayBuffer();

            await api.post(
                `/uploads/direct-video?duration=${recordingDuration}`,
                arrayBuffer,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'video/webm',
                        'X-Video-Duration': recordingDuration.toString()
                    }
                }
            );

            setShowSuccessModal(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload video. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="video-recording-tabbed">
            <h1 className="page-title">Professional Video Introduction</h1>
            <p className="page-subtitle">
                Record a short professional video introduction to showcase your personality and communication skills.
            </p>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                >
                    📄 1. Professional Summary
                </button>
                <button
                    className={`tab-button ${activeTab === 'recording' ? 'active' : ''} ${questions.length === 0 ? 'disabled' : ''}`}
                    onClick={() => questions.length > 0 && setActiveTab('recording')}
                    disabled={questions.length === 0}
                >
                    🎥 2. Video Recording
                </button>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'summary' ? (
                    /* Professional Summary Tab */
                    <div className="summary-tab">
                        <h2 className="section-heading">Craft Your Professional Summary</h2>
                        <p className="section-description">
                            Your summary helps us tailor interview questions. Make it impactful!
                        </p>

                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={8}
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="E.g., A dynamic and results-oriented Project Manager with over 7 years of experience leading cross-functional teams in the tech industry..."
                                className="summary-textarea"
                            />
                            <div className="word-counter">
                                <span className={wordCount < minWords ? 'text-warning' : wordCount > maxWords ? 'text-danger' : 'text-success'}>
                                    {wordCount} words
                                </span>
                                <span className="text-muted"> ({minWords}-{maxWords} recommended)</span>
                            </div>
                        </Form.Group>

                        <Button
                            className="golden-button"
                            size="lg"
                            onClick={handleSubmitSummary}
                            disabled={summaryLoading || wordCount < minWords || wordCount > maxWords}
                        >
                            {summaryLoading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Generating Your Questions...
                                </>
                            ) : (
                                '⚡ Submit Summary & Generate Questions'
                            )}
                        </Button>
                    </div>
                ) : (
                    /* Video Recording Tab */
                    <div className="video-two-column">
                        {/* Left Column - Video Recording */}
                        <div className="video-recording-area">
                            {!cameraStarted && !recordedVideo ? (
                                <div className="camera-placeholder">
                                    <div className="camera-icon">📹</div>
                                    <p>Camera Not Started</p>
                                    <Button className="golden-button" size="lg" onClick={startCamera}>
                                        🎥 Start Camera
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="video-display">
                                        {recordedVideo ? (
                                            <video
                                                src={previewURL}
                                                controls
                                                className="video-preview"
                                            />
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className={`video-feed ${isRecording ? 'recording' : ''}`}
                                                style={{ display: 'block', width: '100%', height: '100%' }}
                                            />
                                        )}
                                        {isRecording && !recordedVideo && (
                                            <div className="recording-overlay">
                                                <span className="rec-dot"></span>
                                                <span className="rec-text">Recording: {formatTime(recordingDuration)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="video-controls">
                                        {!recordedVideo ? (
                                            isRecording ? (
                                                <Button
                                                    variant="danger"
                                                    size="lg"
                                                    onClick={stopRecording}
                                                    className="control-btn"
                                                >
                                                    ⬛ Stop Recording
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="golden-button"
                                                    size="lg"
                                                    onClick={startRecording}
                                                >
                                                    🎥 Start Recording
                                                </Button>
                                            )
                                        ) : (
                                            <div className="recorded-actions">
                                                <Button
                                                    variant="outline-light"
                                                    onClick={retakeVideo}
                                                    className="dark-button"
                                                >
                                                    🔄 Record Again
                                                </Button>
                                                <Button
                                                    className="golden-button"
                                                    onClick={handleUpload}
                                                    disabled={uploading}
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" className="me-2" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        '📤 Upload & Continue'
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Column - Interview Questions */}
                        <div className="questions-sidebar">
                            <div className="questions-header">
                                <h4>📝 Interview Questions</h4>
                                <span className="ai-badge">AI Generated</span>
                            </div>

                            <div className="questions-list">
                                {questions.map((question, index) => (
                                    <div key={index} className="question-card">
                                        <div className="question-number">{index + 1}</div>
                                        <div className="question-text">{question}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="recording-tips">
                                <h5>💡 Recording Guidelines</h5>
                                <ul>
                                    <li>Find a quiet, well-lit space</li>
                                    <li>Speak clearly and at your own pace</li>
                                    <li>Be authentic and show your personality</li>
                                    <li>Answer all questions in one recording</li>
                                    <li>Avoid reading from notes</li>
                                    <li>Maintain natural eye contact with camera</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onHide={() => setShowSuccessModal(false)}
                centered
                size="lg"
                className="upload-success-modal"
            >
                <Modal.Header closeButton style={{ background: '#2a2a2a', borderBottom: '1px solid #444' }}>
                    <Modal.Title style={{ color: '#c9a227', fontSize: '1.5rem' }}>Upload Complete!</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#2a2a2a', color: '#fff', padding: '30px' }}>
                    <div className="success-icon">
                        <div className="checkmark">✓</div>
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Excellent Work!</h3>
                    <p style={{ textAlign: 'center', color: '#999', marginBottom: '30px' }}>
                        Your professional summary and video presentation have been uploaded successfully.
                        You can now proceed to the final step of the onboarding process.
                    </p>

                    <div className="modal-content-preview">
                        <div className="preview-section">
                            <h6 style={{ color: '#c9a227', marginBottom: '10px' }}>📄 Your Professional Summary</h6>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                {summary.substring(0, 200)}...
                            </div>
                        </div>

                        <div className="preview-section" style={{ marginTop: '20px' }}>
                            <h6 style={{ color: '#c9a227', marginBottom: '10px' }}>🎥 Your Video Presentation</h6>
                            <video
                                src={previewURL}
                                controls
                                style={{ width: '100%', borderRadius: '8px', maxHeight: '300px' }}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ background: '#2a2a2a', borderTop: '1px solid #444' }}>
                    <Button
                        className="golden-button"
                        size="lg"
                        onClick={() => {
                            setShowSuccessModal(false);
                            stopCamera();
                            onComplete('completion');
                        }}
                        style={{ width: '100%' }}
                    >
                        Continue to Final Step →
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VideoRecording;
