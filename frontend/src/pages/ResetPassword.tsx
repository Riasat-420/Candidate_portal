import { useState, type FormEvent, useEffect } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setStatus('success');
            setMessage('Password reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to reset password.');
        }
    };

    if (!token) {
        return (
            <div className="login-page">
                <Container className="d-flex justify-content-center align-items-center min-vh-100">
                    <Card className="login-box p-4 text-center">
                        <h3 className="text-danger mb-3">Invalid Link</h3>
                        <p className="text-white-50 mb-4">This password reset link is invalid or missing a token.</p>
                        <Button as={Link} to="/forgot-password" className="btn-gold">
                            Request New Link
                        </Button>
                    </Card>
                </Container>
            </div>
        );
    }

    return (
        <div className="login-page">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="login-box shadow-lg border-0 p-4" style={{ maxWidth: '450px', width: '100%' }}>
                    <div className="text-center mb-4">
                        <img src="/assets/logo.png" alt="Logo" className="logo mb-3" style={{ height: '60px' }} />
                        <h2 className="text-white mb-2">Reset Password</h2>
                        <p className="text-muted">Enter your new password below.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="mb-4 text-success" style={{ fontSize: '3rem' }}>
                                <i className="bi bi-check-circle-fill">✓</i>
                            </div>
                            <h4 className="text-white mb-3">Success!</h4>
                            <p className="text-white-50 mb-4">Your password has been updated.</p>
                            <p className="text-muted small">Redirecting to login...</p>
                            <Button as={Link} to="/login" className="btn-gold w-100">
                                Login Now
                            </Button>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            {status === 'error' && (
                                <Alert variant="danger" className="mb-4">
                                    {message}
                                </Alert>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="login-input"
                                    minLength={6}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="login-button w-100 mb-3"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Resetting...' : 'Set New Password'}
                            </Button>
                        </Form>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ResetPassword;
