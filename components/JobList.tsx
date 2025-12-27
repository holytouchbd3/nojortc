import React from 'react';
import type { Install, Technician } from '../types';
import InstallItem from './JobItem'; // Filename kept for simplicity

interface InstallListProps {
    installs: Install[];
    technicians: Technician[];
    onUpdateInstall: (install: Install) => void;
    onOpenShipModal: (installId: string) => void;
    onOpenPaymentModal: (installId: string) => void;
    onOpenApproveExpenseModal: (installId: string) => void;
}

// Note: Component is now `InstallList`, but file is `JobList.tsx` to maintain structure.
const InstallList: React.FC<InstallListProps> = ({ installs, technicians, onUpdateInstall, onOpenShipModal, onOpenPaymentModal, onOpenApproveExpenseModal }) => {
    if (installs.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">কোনো ইন্সটল পাওয়া যায়নি</h3>
                <p className="mt-1 text-sm text-gray-500">আপনার ফিল্টার বা সার্চের সাথে মিলে এমন কোনো ফলাফল নেই।</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
                {installs.map(install => (
                    <InstallItem
                        key={install.id}
                        install={install}
                        technician={technicians.find(t => t.id === install.technicianId) || null}
                        onUpdateInstall={onUpdateInstall}
                        onOpenShipModal={onOpenShipModal}
                        onOpenPaymentModal={onOpenPaymentModal}
                        onOpenApproveExpenseModal={onOpenApproveExpenseModal}
                    />
                ))}
            </ul>
        </div>
    );
};

export default InstallList;