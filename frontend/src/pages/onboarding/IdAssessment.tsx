import { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import api from '../../services/api';
import './OnboardingSteps.css';

interface IdAssessmentProps {
    onComplete: (nextStep: string) => void;
}

const IdAssessment = ({ onComplete }: IdAssessmentProps) => {
    const [formData, setFormData] = useState({
        employmentStatus: '',
        roleAppliedFor: '',
        yearsExperience: '',
        education: '',
        tools: '',
        currentSalary: '',
        expectedSalary: '',
        age: '',
        availability: '',
        whyChooseYou: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await api.post('/questionnaire/id-assessment', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Advance to next step (Photo Upload)
            onComplete('photo-upload');
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit assessment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-step-container">
            <h2 className="step-title">ID Assessment</h2>
            <p className="step-subtitle">Please complete these initial questions to begin your profile.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="questionnaire-form">
                <Form.Group className="mb-3">
                    <Form.Label>1. What is your current employment status? *</Form.Label>
                    <Form.Select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Employed full-time">Employed full-time</option>
                        <option value="Employed part-time">Employed part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Student">Student</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>2. What role are you primarily applying for? *</Form.Label>
                    <Form.Control type="text" name="roleAppliedFor" value={formData.roleAppliedFor} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>3. How many years of relevant experience do you have in this role? *</Form.Label>
                    <Form.Select name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="0–1">0–1</option>
                        <option value="2–4">2–4</option>
                        <option value="5–7">5–7</option>
                        <option value="8+">8+</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>4. What is your highest level of education or professional certification? *</Form.Label>
                    <Form.Select name="education" value={formData.education} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Degree">Degree</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Professional Body">Professional Body</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>5. Which tools, systems, or technologies do you actively use in this role? *</Form.Label>
                    <Form.Control as="textarea" rows={3} name="tools" value={formData.tools} onChange={handleChange} required />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>6. Current monthly salary range? *</Form.Label>
                            <Form.Control type="text" name="currentSalary" value={formData.currentSalary} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>7. Expected salary range? *</Form.Label>
                            <Form.Control type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>8. How old are you? *</Form.Label>
                            <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>9. How soon can you realistically start? *</Form.Label>
                            <Form.Select name="availability" value={formData.availability} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="Immediately">Immediately</option>
                                <option value="2 weeks">2 weeks</option>
                                <option value="1 month">1 month</option>
                                <option value="2+ months">2+ months</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-4">
                    <Form.Label>10. Why should an employer choose you over other candidates? * (Max 3-4 lines)</Form.Label>
                    <Form.Control as="textarea" rows={4} name="whyChooseYou" value={formData.whyChooseYou} onChange={handleChange} required />
                </Form.Group>

                <div className="d-flex justify-content-end">
                    <Button type="submit" className="golden-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Next Step'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default IdAssessment;
