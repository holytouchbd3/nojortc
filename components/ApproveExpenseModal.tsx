import React, { useState, useMemo } from 'react';
import type { Install } from '../types';

interface ApproveExpenseModalProps {
    onClose: () => void;
    onApprove: (approvedAmount: number) => void;
    install: Install;
}

const ApproveExpenseModal: React.FC<ApproveExpenseModalProps> = ({ onClose, onApprove, install }) => {
    const proposedAmount = useMemo(() => install.travelExpense?.amount ?? 0, [install]);
    const [approvedAmount, setApprovedAmount] = useState<number | ''>(proposedAmount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (approvedAmount === '' || Number(approvedAmount) < 0) {
            alert('অনুগ্রহ করে টাকার সঠিক পরিমাণ লিখুন।');
            return;
        }
        onApprove(Number(approvedAmount));
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">খরচ অনুমোদন</h3>
                            <div className="mt-4 space-y-4">
                                <div className='bg-slate-50 p-3 rounded-md border text-sm'>
                                    <p><strong>টেকনিশিয়ান প্রস্তাবিত:</strong> ৳ {proposedAmount.toLocaleString('bn-BD')}</p>
                                </div>
                                <div>
                                    <label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700">অনুমোদিত পরিমাণ</label>
                                    <input
                                        type="number"
                                        id="approvedAmount"
                                        value={approvedAmount}
                                        onChange={(e) => setApprovedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                এপ্রুভ করুন
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

export default ApproveExpenseModal;
