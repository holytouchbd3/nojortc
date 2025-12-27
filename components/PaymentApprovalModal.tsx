import React, { useState, useMemo } from 'react';
import type { Install } from '../types';

interface PaymentApprovalModalProps {
    onClose: () => void;
    onApprove: (amountReceived: number) => void;
    install: Install;
}

const PaymentApprovalModal: React.FC<PaymentApprovalModalProps> = ({ onClose, onApprove, install }) => {
    const expectedAmount = useMemo(() => {
        const approvedExpense = install.travelExpense?.status === 'approved' ? install.travelExpense.amount : 0;
        return install.productPrice - install.technicianFee - approvedExpense;
    }, [install]);
    
    const [amountReceived, setAmountReceived] = useState<number | ''>(expectedAmount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amountReceived === '' || Number(amountReceived) < 0) {
            alert('অনুগ্রহ করে টাকার সঠিক পরিমাণ লিখুন।');
            return;
        }
        onApprove(Number(amountReceived));
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">পেমেন্ট অনুমোদন</h3>
                            <div className="mt-4 space-y-4">
                                <div className='bg-slate-50 p-3 rounded-md border text-sm'>
                                    <p><strong>গ্রাহক:</strong> {install.customer.name}</p>
                                    <p className='mt-1'>প্রাপ্য টাকার পরিমাণ: <strong>৳ {expectedAmount.toLocaleString('bn-BD')}</strong></p>
                                </div>
                                <div>
                                    <label htmlFor="amountReceived" className="block text-sm font-medium text-gray-700">প্রাপ্ত টাকার পরিমাণ</label>
                                    <input
                                        type="number"
                                        id="amountReceived"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
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

export default PaymentApprovalModal;