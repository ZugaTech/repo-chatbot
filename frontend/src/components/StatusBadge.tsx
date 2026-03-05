import React from 'react';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'ready': return 'var(--accent-color)';
            case 'failed': return 'var(--error-color)';
            case 'indexing': return 'var(--accent-color)';
            default: return 'var(--dim-color)';
        }
    };

    return (
        <div className="status-badge" style={{ borderColor: getStatusColor(), color: getStatusColor() }}>
            {status}
        </div>
    );
};

export default StatusBadge;
