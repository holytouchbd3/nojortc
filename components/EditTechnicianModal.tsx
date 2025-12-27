
import React, { useState } from 'react';
import type { Technician } from '../types';

interface EditTechnicianModalProps {
    onClose: () => void;
    onUpdateTechnician: (technician: Technician) => void;
    technician: Technician;
}

const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({ onClose, onUpdateTechnician, technician }) => {
    const [name, setName] = useState(technician.name);
    const [phone, setPhone] = useState(technician.phone);
    const [location, setLocation] = useState(technician.location);
    const [username, setUsername] = useState(technician.username);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !location || !username) {
            alert('অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন।');
            return;
        }
        if (password && password !== confirmPassword) {
            alert('পাসওয়ার্ড দুটি মেলেনি।');
            return;
        }

        const updatedTechnician: Technician = {
            ...technician,
            name,
            phone,
            location,
            username,
        };

        if (password) {
            updatedTechnician.password = password;
        }

        onUpdateTechnician(updatedTechnician);
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">টেকনিশিয়ান তথ্য সম্পাদনা</h3>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div className="sm:col-span-2">
                                    <label htmlFor="edit-techName" className="block text-sm font-medium text-gray-700">নাম</label>
                                    <input type="text" id="edit-techName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="edit-techPhone" className="block text-sm font-medium text-gray-700">ফোন</label>
                                    <input type="text" id="edit-techPhone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="edit-techLocation" className="block text-sm font-medium text-gray-700">এলাকা</label>
                                    <input type="text" id="edit-techLocation" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                 <div className="sm:col-span-2">
                                    <label htmlFor="edit-techUsername" className="block text-sm font-medium text-gray-700">ইউজারনেম</label>
                                    <input type="text" id="edit-techUsername" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div className="sm:col-span-2 border-t pt-4">
                                     <p className="text-sm text-gray-500">পাসওয়ার্ড পরিবর্তন করতে চাইলে নিচের ঘরগুলো পূরণ করুন।</p>
                                </div>
                                <div>
                                    <label htmlFor="edit-techPassword" className="block text-sm font-medium text-gray-700">নতুন পাসওয়ার্ড</label>
                                    <input type="password" id="edit-techPassword" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                                </div>
                                 <div>
                                    <label htmlFor="edit-techConfirmPassword" className="block text-sm font-medium text-gray-700">পাসওয়ার্ড নিশ্চিত করুন</label>
                                    <input type="password" id="edit-techConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                আপডেট করুন
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

export default EditTechnicianModal;