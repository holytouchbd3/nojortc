
import React, { useState } from 'react';
import type { Install, Technician } from '../types';

interface AddInstallModalProps {
    onClose: () => void;
    // FIX: The `notes` property is initialized in the parent component, so it should be omitted here.
    onAddInstall: (install: Omit<Install, 'id' | 'orderDate' | 'status' | 'notes'>) => void;
    technicians: Technician[];
}

// Note: Component is now `AddInstallModal`, but file is `AddJobModal.tsx` to maintain structure.
const AddInstallModal: React.FC<AddInstallModalProps> = ({ onClose, onAddInstall, technicians }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [productPrice, setProductPrice] = useState<number | ''>('');
    const [technicianId, setTechnicianId] = useState<string | null>(null);
    const [technicianFee, setTechnicianFee] = useState(500);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Operator '<=' cannot be applied to types 'string | number'. Converted productPrice to a number before the comparison.
        if (!customerName || !customerPhone || !customerAddress || Number(productPrice) <= 0 || !technicianId) {
            alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
            return;
        }
        onAddInstall({
            customer: {
                name: customerName,
                phone: customerPhone,
                address: customerAddress,
            },
            productPrice: Number(productPrice),
            technicianId,
            technicianFee,
        });
        onClose();
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">নতুন ইন্সটল যোগ করুন</h3>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">কাস্টমারের নাম</label>
                                    <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">কাস্টমারের ফোন</label>
                                    <input type="text" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700">কাস্টমারের ঠিকানা</label>
                                    <textarea id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required></textarea>
                                </div>
                                <div>
                                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">পণ্যের মূল্য</label>
                                    <input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="technician" className="block text-sm font-medium text-gray-700">টেকনিশিয়ান</label>
                                    <select id="technician" onChange={(e) => setTechnicianId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md" required defaultValue="">
                                        <option value="" disabled>নির্বাচন করুন</option>
                                        {technicians.map(tech => (
                                            <option key={tech.id} value={tech.id}>{tech.name} - {tech.location}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="technicianFee" className="block text-sm font-medium text-gray-700">টেকনিশিয়ান ফি</label>
                                    <input type="number" id="technicianFee" value={technicianFee} onChange={(e) => setTechnicianFee(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
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

export default AddInstallModal;