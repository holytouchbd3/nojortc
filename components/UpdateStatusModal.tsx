import React, { useState, useMemo } from 'react';
import type { Install, Technician, Note } from '../types';
import { InstallStatus } from '../types';

interface UpdateStatusModalProps {
    onClose: () => void;
    onUpdate: (updateData: Partial<Install>) => Promise<void>;
    install: Install;
    technician: Technician;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ onClose, onUpdate, install, technician }) => {
    const [status, setStatus] = useState<InstallStatus>(install.status);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [expense, setExpense] = useState<number | ''>('');
    const [noteText, setNoteText] = useState('');

    const availableStatuses = useMemo(() => {
        if (install.status === InstallStatus.DeviceShipped) {
            return [InstallStatus.InstallationScheduled, InstallStatus.Cancelled];
        }
        if (install.status === InstallStatus.InstallationScheduled) {
            return [InstallStatus.Completed, InstallStatus.Cancelled];
        }
        if (install.status === InstallStatus.Completed) {
            return [InstallStatus.PaymentPendingApproval];
        }
        return [];
    }, [install.status]);
    
    // Set initial status to the first available option if current status has no options
    if (availableStatuses.length > 0 && status === install.status) {
       setStatus(availableStatuses[0]);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const updateData: Partial<Install> = { status };

        if (noteText.trim()) {
            const newNote: Note = {
                text: noteText.trim(),
                date: new Date().toISOString(),
                authorId: technician.id,
                authorName: technician.name
            };
            updateData.notes = [...install.notes, newNote];
        }

        if (status === InstallStatus.InstallationScheduled) {
            if (!date || !time) {
                alert('অনুগ্রহ করে তারিখ এবং সময় দুটোই দিন।');
                return;
            }
            updateData.installationDateTime = new Date(`${date}T${time}`).toISOString();
        }
        
        if (status === InstallStatus.Completed) {
             if (expense === '' || Number(expense) < 0) {
                alert('অনুগ্রহ করে খরচের সঠিক পরিমাণ লিখুন।');
                return;
            }
            updateData.travelExpense = { amount: Number(expense), status: 'pending' };
        }

        await onUpdate(updateData);
    };

    return (
        <div className="fixed z-20 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">স্ট্যাটাস আপডেট করুন</h3>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">নতুন স্ট্যাটাস</label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as InstallStatus)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                        required
                                    >
                                        {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {status === InstallStatus.InstallationScheduled && (
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="install-date" className="block text-sm font-medium text-gray-700">তারিখ</label>
                                            <input
                                                type="date" id="install-date" value={date} onChange={(e) => setDate(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="install-time" className="block text-sm font-medium text-gray-700">সময়</label>
                                            <input
                                                type="time" id="install-time" value={time} onChange={(e) => setTime(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {status === InstallStatus.Completed && (
                                    <div>
                                        <label htmlFor="expense" className="block text-sm font-medium text-gray-700">যাতায়াত খরচ</label>
                                        <input
                                            type="number" id="expense" value={expense} onChange={(e) => setExpense(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                            required min="0" placeholder="0"
                                        />
                                    </div>
                                )}
                                
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">নতুন নোট যোগ করুন</label>
                                    <textarea
                                        id="notes" rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        placeholder="কোনো বিশেষ তথ্য থাকলে এখানে লিখুন..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                সেভ করুন
                            </button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                বাতিল
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusModal;