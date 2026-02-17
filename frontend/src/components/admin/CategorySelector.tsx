import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { GraduationCap, Briefcase, Award } from 'lucide-react';
import './CategorySelector.css';

interface CategorySelectorProps {
    category: 'entry' | 'managerial' | 'executive' | null | undefined;
    onChange: (category: 'entry' | 'managerial' | 'executive') => void;
    isLoading?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ category, onChange, isLoading = false }) => {

    const categories = [
        {
            id: 'entry',
            label: 'Entry Level',
            icon: GraduationCap,
            description: '0-3 years experience. Recent graduates or junior positions.',
            color: '#0dcaf0',
            bg: 'rgba(13, 202, 240, 0.1)'
        },
        {
            id: 'managerial',
            label: 'Managerial',
            icon: Briefcase,
            description: '3-10 years experience. Team leads, managers, and mid-level roles.',
            color: '#ffc107',
            bg: 'rgba(255, 193, 7, 0.1)'
        },
        {
            id: 'executive',
            label: 'Executive',
            icon: Award,
            description: '10+ years experience. Senior leadership, C-level, and directors.',
            color: '#198754',
            bg: 'rgba(25, 135, 84, 0.1)'
        }
    ];

    return (
        <div className="category-selector-wrapper">
            <div className="category-label-text mb-2 text-muted small">CAREER LEVEL CLASSIFICATION</div>
            <div className="category-options-container">
                {categories.map((cat) => {
                    const isActive = category === cat.id;
                    const Icon = cat.icon;

                    return (
                        <OverlayTrigger
                            key={cat.id}
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${cat.id}`}>{cat.description}</Tooltip>}
                        >
                            <button
                                className={`category-option-btn ${isActive ? 'active' : ''}`}
                                onClick={() => onChange(cat.id as 'entry' | 'managerial' | 'executive')}
                                disabled={isLoading}
                                style={{
                                    borderColor: isActive ? cat.color : '#444',
                                    backgroundColor: isActive ? cat.bg : 'transparent',
                                    color: isActive ? '#fff' : '#aaa'
                                }}
                            >
                                <Icon size={18} className="me-2" style={{ color: isActive ? cat.color : '#666' }} />
                                <span className="option-label">{cat.label}</span>
                                {isActive && <div className="active-indicator" style={{ backgroundColor: cat.color }} />}
                            </button>
                        </OverlayTrigger>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelector;
