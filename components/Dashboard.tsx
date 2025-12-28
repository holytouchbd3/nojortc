import React from 'react';
import type { Install, Technician } from '../types';
import DashboardMetric from './DashboardMetric';
import InstallList from './JobList'; // Filename kept for simplicity
import Filters from './Filters';
import { CollectionIcon } from './icons/CollectionIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CashIcon } from './icons/CashIcon';

interface DashboardProps {
    installs: Install[];
    technicians: Technician[];
    metrics: {
        totalInstalls: number;
        completedInstalls: number;
        pendingAmount: number;
    };
    onUpdateInstall: (install: Install) => Promise<void>;
    onOpenShipModal: (installId: string) => void;
    onOpenPaymentModal: (installId: string) => void;
    onOpenApproveExpenseModal: (installId: string) => void;
    filters: {
        searchTerm: string;
        status: string;
        technician: string;
        sort: string;
    };
    onFiltersChange: (filters: DashboardProps['filters']) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const { 
        installs, technicians, metrics, onUpdateInstall, onOpenShipModal, onOpenPaymentModal,
        onOpenApproveExpenseModal, filters, onFiltersChange 
    } = props;
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">একনজরে</h2>
                <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <DashboardMetric
                        title="মোট ইন্সটল"
                        value={metrics.totalInstalls.toString()}
                        icon={<CollectionIcon className="h-6 w-6 text-white" />}
                        color="bg-gray-800"
                    />
                    <DashboardMetric
                        title="সম্পন্ন ইন্সটল"
                        value={metrics.completedInstalls.toString()}
                        icon={<CheckCircleIcon className="h-6 w-6 text-white" />}
                        color="bg-green-500"
                    />
                    <DashboardMetric
                        title="পাওনা টাকা"
                        value={`৳ ${metrics.pendingAmount.toLocaleString('bn-BD')}`}
                        icon={<CashIcon className="h-6 w-6 text-white" />}
                        color="bg-red-600"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Filters technicians={technicians} value={filters} onChange={onFiltersChange} />
                <InstallList 
                    installs={installs} 
                    technicians={technicians} 
                    onUpdateInstall={onUpdateInstall} 
                    onOpenShipModal={onOpenShipModal}
                    onOpenPaymentModal={onOpenPaymentModal}
                    onOpenApproveExpenseModal={onOpenApproveExpenseModal}
                />
            </div>
        </div>
    );
};

export default Dashboard;