import './StepIndicator.css';
import { User, Camera, Mic, Video, FileCheck, CheckCircle2, Home } from 'lucide-react';

interface Step {
    id: string;
    number: number;
    label: string;
    icon: React.ReactNode;
}

interface StepIndicatorProps {
    currentStep: string;
    completedSteps: string[];
    onStepClick: (stepId: string) => void;
}

const getSteps = (currentStep: string, completedSteps: string[]): Step[] => {
    // Helper to determine icon color based on state
    const getIconColor = (stepId: string) => {
        if (stepId === currentStep) return '#000000'; // Black on active
        if (completedSteps.includes(stepId)) return '#ffffff'; // White on completed
        return '#cccccc'; // Grey on pending
    };

    return [
        { id: 'welcome', number: 1, label: 'Welcome', icon: <Home size={24} /> },
        { id: 'id-assessment', number: 2, label: 'ID Assessment', icon: <FileCheck size={24} /> },
        { id: 'photo-upload', number: 3, label: 'Photo Upload', icon: <Camera size={24} /> },
        { id: 'audio-recording', number: 4, label: 'Audio', icon: <Mic size={24} /> },
        { id: 'video-recording', number: 5, label: 'Video', icon: <Video size={24} /> },
        { id: 'completion', number: 6, label: 'Finish', icon: <CheckCircle2 size={24} /> }
    ];
};

const StepIndicator = ({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) => {
    const steps = getSteps(currentStep, completedSteps);

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
                                {step.icon}
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
