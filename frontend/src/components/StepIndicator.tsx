import './StepIndicator.css';

interface Step {
    id: string;
    number: number;
    label: string;
    icon: string;
}

interface StepIndicatorProps {
    currentStep: string;
    completedSteps: string[];
    onStepClick: (stepId: string) => void;
}

const steps: Step[] = [
    { id: 'welcome', number: 1, label: 'Welcome', icon: '👋' },
    { id: 'id-assessment', number: 2, label: 'ID Assessment', icon: '🆔' },
    { id: 'photo-upload', number: 3, label: 'Photo Upload', icon: '📸' },
    { id: 'audio-recording', number: 4, label: 'Audio Recording', icon: '🎤' },
    { id: 'video-recording', number: 5, label: 'Video', icon: '🎥' },
    { id: 'completion', number: 6, label: 'Final Steps', icon: '📝' }
];

const StepIndicator = ({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) => {
    const getCurrentStepIndex = () => {
        return steps.findIndex(step => step.id === currentStep);
    };

    const isStepAccessible = (stepId: string) => {
        const stepIndex = steps.findIndex(step => step.id === stepId);
        const currentIndex = getCurrentStepIndex();

        // Can access current step, completed steps, or previous steps
        return stepIndex <= currentIndex || completedSteps.includes(stepId);
    };

    const getStepClass = (stepId: string) => {
        if (stepId === currentStep) return 'step-item current';
        if (completedSteps.includes(stepId)) return 'step-item completed';
        return 'step-item';
    };

    return (
        <div className="step-indicator">
            <div className="step-container">
                {steps.map((step, index) => (
                    <div key={step.id} className="step-wrapper">
                        <div
                            className={getStepClass(step.id)}
                            onClick={() => isStepAccessible(step.id) && onStepClick(step.id)}
                            style={{ cursor: isStepAccessible(step.id) ? 'pointer' : 'not-allowed' }}
                        >
                            <div className="step-circle">
                                <span className="step-number">{step.number}</span>
                            </div>
                            <span className="step-label">{step.label}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`step-connector ${completedSteps.includes(step.id) ? 'completed' : ''}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
