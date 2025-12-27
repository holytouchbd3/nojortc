import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
    onLogout: () => void;
    onAddInstall?: () => void;
    isAdmin?: boolean;
    techName?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onAddInstall, isAdmin = false, techName }) => {
    return (
        <header className="bg-black shadow-md">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        ট্র্যাকার ম্যানেজমেন্ট
                    </h1>
                    {techName && <p className="text-xs text-gray-300">স্বাগতম, {techName}</p>}
                </div>
                
                <div className="flex items-center gap-4">
                    {isAdmin && onAddInstall && (
                        <button
                            onClick={onAddInstall}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            নতুন ইন্সটল
                        </button>
                    )}
                     <button
                        onClick={onLogout}
                        type="button"
                        className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gray-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="লগআউট"
                    >
                        <LogoutIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;