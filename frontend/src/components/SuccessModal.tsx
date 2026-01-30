import { Modal, Button } from 'react-bootstrap';
import './SuccessModal.css';

interface SuccessModalProps {
    show: boolean;
    title: string;
    message: string;
    nextStepLabel: string;
    onContinue: () => void;
}

const SuccessModal = ({
    show,
    title,
    message,
    nextStepLabel,
    onContinue
}: SuccessModalProps) => {
    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
            className="success-modal"
        >
            <Modal.Body className="success-modal-body">
                <div className="success-icon">
                    <div className="checkmark-circle">
                        <svg className="checkmark" viewBox="0 0 52 52">
                            <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                </div>

                <h3 className="success-title">{title}</h3>
                <p className="success-message">{message}</p>

                <Button
                    className="continue-button"
                    size="lg"
                    onClick={onContinue}
                >
                    {nextStepLabel}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default SuccessModal;
