import React from 'react';
import { InstallStatus } from '../types';

interface StatusBadgeProps {
    status: InstallStatus;
}

const statusColors: Record<InstallStatus, string> = {
    [InstallStatus.NewOrder]: 'bg-blue-100 text-blue-800',
    [InstallStatus.DeviceShipped]: 'bg-purple-100 text-purple-800',
    [InstallStatus.InstallationScheduled]: 'bg-yellow-100 text-yellow-800',
    [InstallStatus.Completed]: 'bg-indigo-100 text-indigo-800',
    [InstallStatus.PaymentPendingApproval]: 'bg-orange-100 text-orange-800',
    [InstallStatus.PaymentReceived]: 'bg-green-100 text-green-800',
    [InstallStatus.Cancelled]: 'bg-red-100 text-red-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;