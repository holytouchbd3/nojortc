import React from 'react';
import { InstallStatus } from '../types';
import type { Technician } from '../types';

interface FiltersProps {
    technicians: Technician[];
    value: {
        searchTerm: string;
        status: string;
        technician: string;
        sort: string;
    };
    onChange: (value: FiltersProps['value']) => void;
}

const Filters: React.FC<FiltersProps> = ({ technicians, value, onChange }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value: val } = e.target;
        onChange({
            ...value,
            [name]: val,
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div>
                    <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">সার্চ করুন</label>
                    <input
                        type="text"
                        name="searchTerm"
                        id="searchTerm"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="গ্রাহকের নাম, ফোন, IMEI..."
                        value={value.searchTerm}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Status Filter */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">স্ট্যাটাস</label>
                    <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        value={value.status}
                        onChange={handleInputChange}
                    >
                        <option value="">সকল স্ট্যাটাস</option>
                        {Object.values(InstallStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {/* Technician Filter */}
                <div>
                    <label htmlFor="technician" className="block text-sm font-medium text-gray-700">টেকনিশিয়ান</label>
                    <select
                        id="technician"
                        name="technician"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        value={value.technician}
                        onChange={handleInputChange}
                    >
                        <option value="">সকল টেকনিশিয়ান</option>
                        {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                 {/* Sort Order */}
                <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700">সাজান</label>
                    <select
                        id="sort"
                        name="sort"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        value={value.sort}
                        onChange={handleInputChange}
                    >
                        <option value="newest">নতুন থেকে পুরাতন</option>
                        <option value="oldest">পুরাতন থেকে নতুন</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Filters;