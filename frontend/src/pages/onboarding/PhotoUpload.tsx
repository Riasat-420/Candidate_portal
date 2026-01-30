import { useState, useRef, useEffect } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import SuccessModal from '../../components/SuccessModal';
import './OnboardingSteps.css';
import './PhotoUpload.css';

interface PhotoUploadProps {
    onComplete: (nextStep: string) => void;
}

const PhotoUpload = ({ onComplete }: PhotoUploadProps) => {
    const [mode, setMode] = useState<'select' | 'webcam' | 'preview'>('select');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Attach stream to video element when both are available
    useEffect(() => {
        if (stream && videoRef.current && mode === 'webcam') {
            console.log('Attaching camera stream to video element');
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                console.log('Camera metadata loaded, attempting to play');
                videoRef.current?.play().catch(err => {
                    console.error('Error playing camera:', err);
                });
            };
        }
    }, [stream, mode]);

    const startCamera = async () => {
        try {
            console.log('Starting camera for photo...');
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 }
            });
            console.log('Camera stream obtained');
            setStream(mediaStream);
            setMode('webcam');
            setError('');
        } catch (err) {
            console.error('Camera access error:', err);
            setError('Failed to access camera. Please grant permission and try again.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'webcam-photo.jpg', { type: 'image/jpeg' });
                    setSelectedFile(file);
                    setPreview(canvas.toDataURL('image/jpeg'));
                    setMode('preview');
                    stopCamera();
                }
            }, 'image/jpeg', 0.95);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPG, PNG, etc.)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);
        setError('');

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
            setMode('preview');
        };
        reader.readAsDataURL(compressedFile);
    };

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const maxSize = 1920;
                    if (width > height && width > maxSize) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    const compressedFile = new File([blob], file.name, {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    });
                                    resolve(compressedFile);
                                } else {
                                    resolve(file);
                                }
                            },
                            'image/jpeg',
                            0.85
                        );
                    } else {
                        resolve(file);
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a photo first');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const arrayBuffer = await selectedFile.arrayBuffer();

            await api.post('/uploads/direct-photo', arrayBuffer, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': selectedFile.type
                }
            });

            setShowSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
            setUploading(false);
        }
    };

    const handleSuccessContinue = () => {
        setShowSuccess(false);
        onComplete('audio-recording');
    };

    const handleRetake = () => {
        setSelectedFile(null);
        setPreview('');
        setMode('select');
        setError('');
    };

    return (
        <>
            <div className="photo-upload-redesign">
                <h1 className="page-title">Professional Profile Photo</h1>
                <p className="page-subtitle">
                    Upload a professional headshot that clearly shows your face. This will be used for your talent profile.
                </p>

                {error && (
                    <Alert variant="danger" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <div className="photo-upload-grid">
                    {/* Left Column - Photo Preview */}
                    <div className="photo-preview-section">
                        <h3 className="section-title">Your Photo</h3>
                        <div className="photo-box">
                            {mode === 'webcam' ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="webcam-feed"
                                    />
                                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                                </>
                            ) : preview ? (
                                <img src={preview} alt="Selected photo" className="preview-image" />
                            ) : (
                                <div className="empty-state">
                                    <div className="camera-icon">📷</div>
                                    <p>No Photo Selected</p>
                                    <span>Choose an option below</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Upload Options */}
                    <div className="upload-options-section">
                        <h3 className="section-title">Upload Options</h3>

                        {mode === 'select' && (
                            <div className="option-buttons">
                                <Button
                                    className="golden-button"
                                    size="lg"
                                    onClick={startCamera}
                                >
                                    📷 Use Webcam
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="dark-button"
                                >
                                    ⬆️ Upload from Device
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        )}

                        {mode === 'webcam' && (
                            <div className="webcam-actions">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => {
                                        stopCamera();
                                        setMode('select');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="golden-button"
                                    size="lg"
                                    onClick={capturePhoto}
                                >
                                    📸 Capture Photo
                                </Button>
                            </div>
                        )}

                        {mode === 'preview' && preview && (
                            <div className="preview-actions">
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
                                        '✓ Use This Photo & Submit'
                                    )}
                                </Button>
                                <Button
                                    variant="outline-light"
                                    onClick={handleRetake}
                                    disabled={uploading}
                                    className="dark-button"
                                >
                                    🔄 Retake / Re-upload
                                </Button>
                            </div>
                        )}

                        {/* Photo Requirements - Moved here from left column */}
                        <div className="photo-requirements" style={{ marginTop: '30px' }}>
                            <h4>📋 Photo Requirements</h4>
                            <ul>
                                <li>✓ Professional attire and natural background</li>
                                <li>✓ Well-lit, clear image of your face</li>
                                <li>✓ No filters or heavy editing</li>
                                <li>✓ Recent photo (taken within the last 6 months)</li>
                            </ul>
                            <p className="usage-note">
                                💡 This photo will be used for your talent profile and visible to our clients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessModal
                show={showSuccess}
                title="Photo Uploaded Successfully!"
                message="Your profile photo has been saved. You will now proceed to the next step."
                nextStepLabel="Continue to Audio Recording"
                onContinue={handleSuccessContinue}
            />
        </>
    );
};

export default PhotoUpload;
