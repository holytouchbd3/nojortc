
import React from 'react';

interface DashboardMetricProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const DashboardMetric: React.FC<DashboardMetricProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
                        {icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardMetric;
