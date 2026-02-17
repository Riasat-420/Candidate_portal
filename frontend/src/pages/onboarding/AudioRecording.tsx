import { useState, useRef, useEffect } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import SuccessModal from '../../components/SuccessModal';
import './OnboardingSteps.css';
import './AudioRecording.css';

interface AudioRecordingProps {
    onComplete: (nextStep: string) => void;
    currentStep?: string;
}

const AudioRecording = ({ onComplete }: AudioRecordingProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioURL, setAudioURL] = useState('');
    const [duration, setDuration] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioURL(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            startTimeRef.current = Date.now();

            // Update duration every second
            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setDuration(elapsed);
            }, 1000);

        } catch (err) {
            setError('Failed to access microphone. Please grant permission and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setAudioURL('');
        setDuration(0);
        setError('');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleUpload = async () => {
        if (!audioBlob) {
            setError('Please record audio first');
            return;
        }

        // Validate minimum duration of 15 seconds
        if (duration < 15) {
            setError('Audio recording must be at least 15 seconds. Please record again.');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const arrayBuffer = await audioBlob.arrayBuffer();

            await api.post(`/uploads/direct-audio?duration=${duration}`, arrayBuffer, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'audio/webm'
                }
            });

            setShowSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload audio. Please try again.');
            setUploading(false);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="audio-recording-redesign">
            <h1 className="page-title">Audio Introduction</h1>
            <p className="page-subtitle">
                Record a brief audio introduction to showcase your personality and communication skills.
            </p>

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            <div className="audio-grid">
                {/* Left Column - Recording Interface */}
                <div className="recording-interface">
                    {!isRecording && !audioBlob && (
                        <div className="mic-button-container">
                            <button
                                className="mic-button"
                                onClick={startRecording}
                                aria-label="Start recording"
                            >
                                <div className="mic-icon">🎙️</div>
                            </button>
                            <p className="mic-instruction">Click the mic to start recording</p>
                        </div>
                    )}

                    {isRecording && (
                        <div className="recording-active">
                            <div className="recording-pulse">
                                <div className="pulse-circle"></div>
                                <div className="mic-icon">🎙️</div>
                            </div>
                            <p className="recording-text">Recording...</p>
                            <p className="recording-duration">{formatTime(duration)}</p>
                            <Button
                                variant="danger"
                                size="lg"
                                onClick={stopRecording}
                                className="stop-button"
                            >
                                ⬛ Stop Recording
                            </Button>
                        </div>
                    )}

                    {audioBlob && !isRecording && (
                        <div className="playback-section">
                            <div className="audio-player-card">
                                <p className="audio-label">Your Recording</p>
                                <audio src={audioURL} controls className="audio-control" />
                                <p className="audio-duration">Duration: {formatTime(duration)}</p>
                            </div>

                            <div className="audio-actions">
                                <Button
                                    className="golden-button"
                                    size="lg"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Uploading...
                                        </>
                                    ) : (
                                        '✓ Submit Recording'
                                    )}
                                </Button>
                                <Button
                                    variant="outline-light"
                                    onClick={resetRecording}
                                    disabled={uploading}
                                    className="dark-button"
                                >
                                    🔄 Record Again
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Guidelines and Sample */}
                <div className="recording-guidelines">
                    {/* Recording Guidelines */}
                    <div className="guidelines-card">
                        <h4>Recording Guidelines</h4>
                        <ul className="guidelines-list">
                            <li>
                                <span className="check-icon">✓</span>
                                Ensure clear audio with no background noise
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                Speak clearly and confidently
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                Your audio should be at least 45 seconds long
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                Introduce yourself and your professional background
                            </li>
                        </ul>
                    </div>

                    {/* Sample Audio */}
                    <div className="sample-audio-card">
                        <h4>Sample Audio</h4>
                        <p className="sample-description">
                            Listen to a sample audio to guide your recording.
                        </p>
                        <audio
                            controls
                            className="sample-audio-player"
                            src="/src/assets/Website 3pg advert audio.mp3.mpeg"
                        >
                            Your browser does not support the audio element.
                        </audio>
                        <p className="sample-note">
                            Note: This is a sample to demonstrate tone and clarity.
                        </p>
                    </div>
                </div>
            </div>

            <SuccessModal
                show={showSuccess}
                title="Audio Uploaded Successfully!"
                message="Your audio introduction has been saved. You will now proceed to the next step."
                nextStepLabel="Continue to Video Recording"
                onContinue={() => {
                    setShowSuccess(false);
                    onComplete('video-recording');
                }}
            />
        </div>
    );
};

export default AudioRecording;
