import React from 'react';
import { Badge } from 'react-bootstrap';

interface CategoryBadgeProps {
    category: 'entry' | 'managerial' | 'executive' | null | undefined;
    size?: 'sm' | 'md' | 'lg';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
    if (!category) {
        return <Badge bg="secondary" className={`category-badge category-badge-${size}`}>Uncategorized</Badge>;
    }

    const categoryConfig = {
        entry: {
            bg: 'info',
            label: 'Entry Level',
            className: 'category-entry'
        },
        managerial: {
            bg: 'warning',
            label: 'Managerial',
            className: 'category-managerial'
        },
        executive: {
            bg: 'success',
            label: 'Executive',
            className: 'category-executive'
        }
    };

    const config = categoryConfig[category];

    return (
        <Badge
            bg={config.bg}
            className={`category-badge category-badge-${size} ${config.className}`}
        >
            {config.label}
        </Badge>
    );
};

export default CategoryBadge;
