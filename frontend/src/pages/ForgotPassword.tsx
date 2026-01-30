import { useState, type FormEvent } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Login.css'; // Reuse login styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setStatus('success');
            setMessage(response.data.message || 'If an account exists, a reset link has been sent.');

            // For dev/demo purposes, log the link if provided by backend (will be visible in backend console)
            if (response.data.mockLink) {
                console.log('RESET LINK:', response.data.mockLink);
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to request password reset.');
        }
    };

    return (
        <div className="login-page">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="login-box shadow-lg border-0 p-4" style={{ maxWidth: '450px', width: '100%' }}>
                    <div className="text-center mb-4">
                        <img src="/assets/logo.png" alt="Logo" className="logo mb-3" style={{ height: '60px' }} />
                        <h2 className="text-white mb-2">Forgot Password</h2>
                        <p className="text-muted">Enter your email to receive reset instructions.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="mb-4 text-success" style={{ fontSize: '3rem' }}>
                                <i className="bi bi-check-circle-fill">✓</i>
                            </div>
                            <h4 className="text-white mb-3">Check Your Email</h4>
                            <p className="text-white-50 mb-4">{message}</p>
                            <p className="text-muted small">
                                (Since this is a demo, check the <strong>browser console</strong> or <strong>backend terminal</strong> for the link!)
                            </p>
                            <Button as={Link} to="/login" className="btn-gold w-100">
                                Return to Login
                            </Button>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            {status === 'error' && (
                                <Alert variant="danger" className="mb-4">
                                    {message}
                                </Alert>
                            )}

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="login-button w-100 mb-3"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center">
                                <Link to="/login" className="text-decoration-none text-gold">
                                    ← Back to Login
                                </Link>
                            </div>
                        </Form>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ForgotPassword;
