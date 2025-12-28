import React, { useMemo, useState } from 'react';
import type { Install, Technician } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Header from '../components/Header';
import { InstallStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { CollectionIcon } from '../components/icons/CollectionIcon';
import { CashIcon } from '../components/icons/CashIcon';
import { sendWhatsappMessage } from '../whatsappApi';
import { generateWhatsappMessage } from '../utils';

interface TechnicianPanelProps {
    loggedInTechnician: Technician;
    onLogout: () => void;
}

const TechnicianPanel: React.FC<TechnicianPanelProps> = ({ loggedInTechnician, onLogout }) => {
    const [installs, setInstalls] = useLocalStorage<Install[]>('installs', []);
    const [selectedInstall, setSelectedInstall] = useState<Install | null>(null);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    
    const assignedInstalls = useMemo(() => {
        return installs
            .filter(install => install.technicianId === loggedInTechnician.id)
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }, [installs, loggedInTechnician.id]);

    const metrics = useMemo(() => {
        const pendingJobs = assignedInstalls.filter(i => ![InstallStatus.Completed, InstallStatus.PaymentReceived, InstallStatus.Cancelled].includes(i.status)).length;
        const pendingExpense = assignedInstalls
            .filter(i => i.travelExpense?.status === 'pending')
            .reduce((acc, i) => acc + (i.travelExpense?.amount ?? 0), 0);
        return { pendingJobs, pendingExpense };
    }, [assignedInstalls]);

    const updateInstallInList = (updatedInstall: Install) => {
        setInstalls(prevInstalls => prevInstalls.map(install => (install.id === updatedInstall.id ? updatedInstall : install)));
    };
    
    const handleOpenUpdateModal = (install: Install) => {
        setSelectedInstall(install);
        setUpdateModalOpen(true);
    };

    const handleUpdateInstall = async (updateData: Partial<Install>) => {
        if (selectedInstall) {
            const updatedInstall = { ...selectedInstall, ...updateData };
            updateInstallInList(updatedInstall);

            if (selectedInstall.status !== updatedInstall.status) {
                const message = generateWhatsappMessage(updatedInstall);
                if (message) {
                    try {
                        await sendWhatsappMessage(updatedInstall.customer.phone, message);
                        alert('স্ট্যাটাস আপডেট হয়েছে এবং গ্রাহককে জানানো হয়েছে।');
                    } catch (error) {
                        console.error(error);
                        alert(`স্ট্যাটাস আপডেট হয়েছে, কিন্তু গ্রাহককে মেসেজ পাঠানো যায়নি। ত্রুটি: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            }
        }
        setUpdateModalOpen(false);
        setSelectedInstall(null);
    };

    const canUpdateStatus = (status: InstallStatus) => {
        return [InstallStatus.DeviceShipped, InstallStatus.InstallationScheduled, InstallStatus.Completed].includes(status);
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

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onLogout={onLogout} techName={loggedInTechnician.name} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
                        <div className="flex-shrink-0 bg-gray-800 rounded-md p-3">
                             <CollectionIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-gray-500 truncate">পেন্ডিং কাজ</dt>
                            <dd className="text-2xl font-semibold text-gray-900">{metrics.pendingJobs}</dd>
                        </div>
                    </div>
                     <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
                        <div className="flex-shrink-0 bg-red-600 rounded-md p-3">
                             <CashIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-gray-500 truncate">খরচ অনুমোদনের অপেক্ষায়</dt>
                            <dd className="text-2xl font-semibold text-gray-900">৳ {metrics.pendingExpense.toLocaleString('bn-BD')}</dd>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-md">
                    <ul role="list" className="divide-y divide-slate-200">
                        {assignedInstalls.length > 0 ? assignedInstalls.map(install => (
                            <li key={install.id} className="p-4 sm:p-6 space-y-4">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-red-600">{install.customer.name}</p>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <a href={`tel:${install.customer.phone}`} className="text-sm text-blue-600 hover:underline">{install.customer.phone}</a>
                                            <a href={`tel:${install.customer.phone}`} title="Call" className="text-gray-400 hover:text-green-600">
                                                <PhoneIcon className="h-5 w-5"/>
                                            </a>
                                            <a href={`https://wa.me/${install.customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-gray-400 hover:text-green-600">
                                                <WhatsAppIcon className="h-5 w-5"/>
                                            </a>
                                        </div>
                                        <a 
                                            href={`https://www.google.com/maps?q=${encodeURIComponent(install.customer.address)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="block text-sm text-slate-500 hover:text-blue-600 mt-1"
                                        >
                                            {install.customer.address}
                                        </a>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="flex justify-end"><StatusBadge status={install.status} /></div>
                                        {install.installationDateTime && <p className="text-xs text-slate-500 mt-1">নির্ধারিত: {formatDateTime(install.installationDateTime)}</p>}
                                        {install.travelExpense && <p className="text-xs text-slate-500">খরচ: ৳{install.travelExpense.amount} ({install.travelExpense.status === 'pending' ? 'পেন্ডিং' : 'অনুমোদিত'})</p>}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-800 bg-gray-100 p-3 rounded-md border border-gray-200 space-y-1">
                                    <p className="flex justify-between"><span><strong>ডিভাইস:</strong></span> <span className="font-mono text-gray-900">{install.deviceType ?? 'N/A'}</span></p>
                                    <p className="flex justify-between"><span><strong>IMEI:</strong></span> <span className="font-mono text-gray-900">{install.imei ?? 'N/A'}</span></p>
                                    <p className="flex justify-between"><span><strong>কুরিয়ার:</strong></span> <span className="font-mono text-gray-900">{install.courierService ?? 'N/A'}</span></p>
                                </div>

                                {install.paymentDetails && (
                                     <div className="text-xs text-green-800 bg-green-50 p-2 rounded-md border border-green-200">
                                         <p><strong>পেমেন্ট গৃহীত:</strong> ৳{install.paymentDetails.amountReceived.toLocaleString('bn-BD')} (অ্যাডমিন দ্বারা অনুমোদিত)</p>
                                     </div>
                                )}

                                {install.notes && install.notes.length > 0 && (
                                    <div className="text-xs text-slate-800 space-y-2">
                                        <p className="font-semibold">নোটের ইতিহাস:</p>
                                        <ul className="space-y-2 pl-2 border-l-2 border-slate-200">
                                            {install.notes.map((note, index) => (
                                                <li key={index} className="bg-slate-100 p-2 rounded-md border border-slate-200">
                                                    <p className="whitespace-pre-wrap">{note.text}</p>
                                                    <p className="text-slate-500 text-right mt-1">- {note.authorName} at {new Date(note.date).toLocaleString('bn-BD')}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="flex gap-2">
                                    {canUpdateStatus(install.status) && (
                                        <button onClick={() => handleOpenUpdateModal(install)} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                                            স্ট্যাটাস আপডেট করুন
                                        </button>
                                    )}
                                </div>
                            </li>
                        )) : (
                            <li className="p-6 text-center text-slate-500">আপনার জন্য কোনো কাজ এসাইন করা হয়নি।</li>
                        )}
                    </ul>
                </div>
            </main>
            {isUpdateModalOpen && selectedInstall && (
                <UpdateStatusModal
                    install={selectedInstall}
                    onClose={() => { setUpdateModalOpen(false); setSelectedInstall(null); }}
                    onUpdate={handleUpdateInstall}
                    technician={loggedInTechnician}
                />
            )}
        </div>
    );
};

export default TechnicianPanel;