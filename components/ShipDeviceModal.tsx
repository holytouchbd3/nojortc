
import React, { useState } from 'react';

interface ShipDeviceModalProps {
    onClose: () => void;
    onShipDevice: (details: { imei: string; courierService: string; deviceType: 'Voice' | 'Non-Voice' }) => void;
}

const ShipDeviceModal: React.FC<ShipDeviceModalProps> = ({ onClose, onShipDevice }) => {
    const [imei, setImei] = useState('');
    const [courierService, setCourierService] = useState('');
    const [deviceType, setDeviceType] = useState<'Voice' | 'Non-Voice'>('Non-Voice');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imei || !courierService) {
            alert('অনুগ্রহ করে IMEI এবং কুরিয়ার সার্ভিসের নাম দিন।');
            return;
        }
        onShipDevice({ imei, courierService, deviceType });
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">ডিভাইস পাঠানোর তথ্য</h3>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="imei" className="block text-sm font-medium text-gray-700">ডিভাইস IMEI</label>
                                    <input type="text" id="imei" value={imei} onChange={(e) => setImei(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="courier" className="block text-sm font-medium text-gray-700">কুরিয়ার সার্ভিস</label>
                                    <input type="text" id="courier" value={courierService} onChange={(e) => setCourierService(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ডিভাইসের ধরন</label>
                                    <fieldset className="mt-2">
                                        <div className="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                            <div className="flex items-center">
                                                <input id="non-voice" name="device-type" type="radio" checked={deviceType === 'Non-Voice'} onChange={() => setDeviceType('Non-Voice')} className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300" />
                                                <label htmlFor="non-voice" className="ml-3 block text-sm font-medium text-gray-700">Non-Voice</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input id="voice" name="device-type" type="radio" checked={deviceType === 'Voice'} onChange={() => setDeviceType('Voice')} className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300" />
                                                <label htmlFor="voice" className="ml-3 block text-sm font-medium text-gray-700">Voice</label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                সাবমিট করুন
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

export default ShipDeviceModal;