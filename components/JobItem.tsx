import React from 'react';
import type { Install, Technician } from '../types';
import { InstallStatus } from '../types';
import StatusBadge from './StatusBadge';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface InstallItemProps {
    install: Install;
    technician: Technician | null;
    onUpdateInstall: (install: Install) => void;
    onOpenShipModal: (installId: string) => void;
    onOpenPaymentModal: (installId: string) => void;
    onOpenApproveExpenseModal: (installId: string) => void;
}

const InstallItem: React.FC<InstallItemProps> = ({ install, technician, onUpdateInstall, onOpenShipModal, onOpenPaymentModal, onOpenApproveExpenseModal }) => {
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as InstallStatus;
        if (newStatus === InstallStatus.DeviceShipped && !install.imei) {
            onOpenShipModal(install.id);
        } else {
            onUpdateInstall({ ...install, status: newStatus });
        }
    };
    
    const formatDateTime = (isoString?: string) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString('bn-BD', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const amountDue = install.productPrice - install.technicianFee - (install.travelExpense?.status === 'approved' ? install.travelExpense.amount : 0);

    return (
        <li className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200">
            <div className="flex items-start flex-wrap gap-x-6 gap-y-4">
                <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center space-x-3">
                        <p className="text-sm font-semibold text-red-600 truncate">{install.customer.name}</p>
                        <StatusBadge status={install.status} />
                    </div>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                       <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"/>
                        {install.customer.phone}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 truncate">{install.customer.address}</p>
                    {install.installationDateTime && <p className="mt-1 text-xs text-gray-500"><strong>সময়:</strong> {formatDateTime(install.installationDateTime)}</p>}
                </div>
                <div className="flex-shrink-0">
                    <p className="text-sm text-gray-500">টেকনিশিয়ান:</p>
                     <p className="mt-1 flex items-center text-sm font-medium text-gray-800">
                        <UserCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"/>
                        {technician ? `${technician.name} (${technician.location})` : 'নেই'}
                    </p>
                </div>
                 <div className="flex-shrink-0">
                    <p className="text-sm text-gray-500">পাওনা:</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">৳ {amountDue.toLocaleString('bn-BD')}</p>
                </div>
                <div className="flex-shrink-0">
                     {install.status === InstallStatus.PaymentPendingApproval ? (
                        <button onClick={() => onOpenPaymentModal(install.id)} className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                            পেমেন্ট এপ্রুভ করুন
                        </button>
                    ) : (
                        <>
                        <label htmlFor={`status-${install.id}`} className="sr-only">স্ট্যাটাস</label>
                        <select
                            id={`status-${install.id}`}
                            value={install.status}
                            onChange={handleStatusChange}
                            className="block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        >
                            {Object.values(InstallStatus).map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-dashed space-y-3">
                <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-2 items-center">
                    {install.imei && <span><strong>IMEI:</strong> {install.imei}</span>}
                    {install.courierService && <span><strong>কুরিয়ার:</strong> {install.courierService}</span>}
                    {install.deviceType && <span><strong>ডিভাইস:</strong> {install.deviceType}</span>}
                    {install.travelExpense && (
                        <div className="flex items-center gap-2">
                             <span><strong>খরচ:</strong> ৳{install.travelExpense.amount} ({install.travelExpense.status === 'pending' ? 'পেন্ডিং' : 'অনুমোদিত'})</span>
                             {install.travelExpense.status === 'pending' && (
                                <button onClick={() => onOpenApproveExpenseModal(install.id)} className="px-2 py-0.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                    এপ্রুভ করুন
                                </button>
                             )}
                        </div>
                    )}
                </div>

                {install.paymentDetails && (
                     <div className="text-xs text-green-800 bg-green-50 p-2 rounded-md border border-green-200">
                         <p><strong>পেমেন্ট গৃহীত:</strong> ৳{install.paymentDetails.amountReceived.toLocaleString('bn-BD')} on {new Date(install.paymentDetails.receivedDate).toLocaleDateString('bn-BD')}</p>
                     </div>
                )}
                
                {install.notes && install.notes.length > 0 && (
                    <div className="text-xs text-gray-800 space-y-2">
                        <p className="font-semibold">নোটের ইতিহাস:</p>
                        <ul className="space-y-2 pl-2 border-l-2 border-slate-200">
                            {install.notes.map((note, index) => (
                                <li key={index} className="bg-slate-50 p-2 rounded-md">
                                    <p className="whitespace-pre-wrap">{note.text}</p>
                                    <p className="text-slate-500 text-right mt-1">- {note.authorName} at {new Date(note.date).toLocaleString('bn-BD')}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </li>
    );
};

export default InstallItem;