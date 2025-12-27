
import React from 'react';
import type { Technician } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';


interface TechnicianManagerProps {
    technicians: Technician[];
    onAddTechnician: () => void;
    onEdit: (technician: Technician) => void;
    onDelete: (technicianId: string) => void;
}

const TechnicianManager: React.FC<TechnicianManagerProps> = ({ technicians, onAddTechnician, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow overflow-hidden rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">টেকনিশিয়ান তালিকা</h3>
                <button
                    onClick={onAddTechnician}
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    নতুন টেকনিশিয়ান
                </button>
            </div>
            <div className="border-t border-gray-200">
                {technicians.length > 0 ? (
                    <ul role="list" className="divide-y divide-gray-200">
                        {technicians.map((tech) => (
                            <li key={tech.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-800 truncate flex items-center">
                                        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2"/>
                                        {tech.name}
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                                        <button onClick={() => onEdit(tech)} type="button" className="inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                            <PencilIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                         <button onClick={() => onDelete(tech.id)} type="button" className="inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                            {tech.phone}
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                            {tech.location}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">কোনো টেকনিশিয়ান পাওয়া যায়নি</h3>
                        <p className="mt-1 text-sm text-gray-500">শুরু করতে একজন নতুন টেকনিশিয়ান যোগ করুন।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianManager;