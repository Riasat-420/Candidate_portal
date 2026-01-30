import { useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import './OnboardingSteps.css';
import './ProfessionalSummary.css';

interface ProfessionalSummaryProps {
    onComplete: (summary: string, questions: string[]) => void;
    currentStep?: string;
}

const ProfessionalSummary = ({ onComplete }: ProfessionalSummaryProps) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const wordCount = summary.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minWords = 50;
    const maxWords = 500;

    const handleSubmit = async () => {
        if (wordCount < minWords) {
            setError(`Please write at least ${minWords} words about your professional background.`);
            return;
        }

        if (wordCount > maxWords) {
            setError(`Please keep your summary under ${maxWords} words.`);
            return;
        }

        setLoading(true);
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

            const questions = response.data.questions;
            onComplete(summary, questions);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="professional-summary-step">
            <h1 className="page-title">Professional Summary</h1>
            <p className="page-subtitle">
                Share your professional background, skills, and experience. We'll use this to generate personalized interview questions.
            </p>

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            <div className="summary-container">
                <div className="summary-card">
                    <h4>About You</h4>
                    <p className="summary-instruction">
                        Write a brief professional summary including your experience, key skills, notable achievements, and career goals.
                    </p>

                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Example: I am a Full Stack Developer with 5 years of experience building scalable web applications using React, Node.js, and MongoDB. I've led multiple projects from conception to deployment, specializing in e-commerce platforms. My biggest achievement was developing a payment system that processed over $2M in transactions. I'm passionate about clean code, user experience, and mentoring junior developers. I'm looking for opportunities where I can contribute to innovative products while growing my leadership skills..."
                            className="summary-textarea"
                        />
                        <div className="word-counter">
                            <span className={wordCount < minWords ? 'text-warning' : wordCount > maxWords ? 'text-danger' : 'text-success'}>
                                {wordCount} words
                            </span>
                            <span className="text-muted"> ({minWords}-{maxWords} recommended)</span>
                        </div>
                    </Form.Group>

                    <div className="tips-box">
                        <h6>💡 Tips for a Great Summary:</h6>
                        <ul>
                            <li>Include your job title and years of experience</li>
                            <li>Mention specific technologies, tools, or skills</li>
                            <li>Highlight 1-2 major achievements</li>
                            <li>Share your career goals or what you're looking for</li>
                            <li>Be authentic and let your personality shine</li>
                        </ul>
                    </div>

                    <Button
                        className="golden-button"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={loading || wordCount < minWords || wordCount > maxWords}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Generating Your Questions...
                            </>
                        ) : (
                            '✨ Generate Questions & Continue'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalSummary;
