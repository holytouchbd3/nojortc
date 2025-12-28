import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Install, Technician } from '../types';
import { InstallStatus } from '../types';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import AddInstallModal from '../components/AddJobModal';
import TechnicianManager from '../components/TechnicianManager';
import AddTechnicianModal from '../components/AddTechnicianModal';
import EditTechnicianModal from '../components/EditTechnicianModal';
import ShipDeviceModal from '../components/ShipDeviceModal';
import PaymentApprovalModal from '../components/PaymentApprovalModal';
import ApproveExpenseModal from '../components/ApproveExpenseModal';
import { sendWhatsappMessage } from '../whatsappApi';
import { generateWhatsappMessage } from '../utils';

interface AdminPanelProps {
    onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [installs, setInstalls] = useLocalStorage<Install[]>('installs', []);
    const [technicians, setTechnicians] = useLocalStorage<Technician[]>('technicians', []);

    // Modal states
    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
    const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
    const [isEditTechnicianModalOpen, setIsEditTechnicianModalOpen] = useState(false);
    const [isShipModalOpen, setIsShipModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isApproveExpenseModalOpen, setIsApproveExpenseModalOpen] = useState(false);
    
    // Data states
    const [technicianToEdit, setTechnicianToEdit] = useState<Technician | null>(null);
    const [selectedInstall, setSelectedInstall] = useState<Install | null>(null);
    
    // UI states
    const [activeTab, setActiveTab] = useState<'dashboard' | 'technicians'>('dashboard');
    const [filters, setFilters] = useState({ searchTerm: '', status: '', technician: '', sort: 'newest' });

    const addInstall = async (installData: Omit<Install, 'id' | 'orderDate' | 'status' | 'notes'>) => {
        const newInstall: Install = {
            ...installData,
            id: `install_${Date.now()}`,
            orderDate: new Date().toISOString(),
            status: InstallStatus.NewOrder,
            notes: [],
        };
        setInstalls(prevInstalls => [newInstall, ...prevInstalls]);
        
        const message = `প্রিয় ${newInstall.customer.name}, আপনার জিপিএস ট্র্যাকার অর্ডারটি গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করে বিস্তারিত জানাব। ধন্যবাদ।`;
        try {
            await sendWhatsappMessage(newInstall.customer.phone, message);
            alert('নতুন ইন্সটল যোগ করা হয়েছে এবং গ্রাহককে জানানো হয়েছে।');
        } catch (error) {
            console.error(error);
            alert(`নতুন ইন্সটল যোগ করা হয়েছে, কিন্তু গ্রাহককে মেসেজ পাঠানো যায়নি। ত্রুটি: ${error instanceof Error ? error.message : String(error)}`);
        }
    };
    
    const updateInstall = async (updatedInstall: Install) => {
        const oldInstall = installs.find(i => i.id === updatedInstall.id);
        setInstalls(prevInstalls => prevInstalls.map(install => (install.id === updatedInstall.id ? updatedInstall : install)));
        
        if (oldInstall && oldInstall.status !== updatedInstall.status) {
            const message = generateWhatsappMessage(updatedInstall);
            if (message) {
                try {
                    await sendWhatsappMessage(updatedInstall.customer.phone, message);
                } catch (error) {
                    console.error("WhatsApp Error:", error);
                    alert(`স্ট্যাটাস আপডেট হয়েছে, কিন্তু মেসেজ পাঠানো যায়নি। ত্রুটি: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
    };

    const addTechnician = (technician: Omit<Technician, 'id'>) => {
        const newTechnician: Technician = {
            ...technician,
            id: `tech_${Date.now()}`
        };
        setTechnicians(prev => [newTechnician, ...prev]);
    };

    const handleOpenEditModal = (technician: Technician) => {
        setTechnicianToEdit(technician);
        setIsEditTechnicianModalOpen(true);
    };

    const handleUpdateTechnician = (updatedTechnician: Technician) => {
        setTechnicians(prev => prev.map(tech => tech.id === updatedTechnician.id ? updatedTechnician : tech));
        setIsEditTechnicianModalOpen(false);
        setTechnicianToEdit(null);
    };

    const handleDeleteTechnician = (technicianId: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে এই টেকনিশিয়ানকে মুছে ফেলতে চান?')) {
            const isAssigned = installs.some(install => install.technicianId === technicianId && ![InstallStatus.Completed, InstallStatus.Cancelled, InstallStatus.PaymentReceived].includes(install.status));
            if (isAssigned) {
                alert('এই টেকনিশিয়ান একটি চলমান কাজে নিযুক্ত আছেন। তাকে মুছে ফেলা যাবে না।');
                return;
            }
            setTechnicians(prev => prev.filter(tech => tech.id !== technicianId));
        }
    };
    
    const openModalForInstall = (installId: string, openModal: React.Dispatch<React.SetStateAction<boolean>>) => {
        const installToProcess = installs.find(i => i.id === installId);
        if (installToProcess) {
            setSelectedInstall(installToProcess);
            openModal(true);
        }
    };

    const handleShipDevice = async (shippingInfo: { deviceType: 'Voice' | 'Non-Voice'; courierService: string; imei: string; }) => {
        if (selectedInstall) {
            await updateInstall({ ...selectedInstall, ...shippingInfo, status: InstallStatus.DeviceShipped });
        }
        setIsShipModalOpen(false);
        setSelectedInstall(null);
    };
    
    const handleApprovePayment = async (amountReceived: number) => {
        if (selectedInstall) {
            await updateInstall({
                ...selectedInstall,
                status: InstallStatus.PaymentReceived,
                paymentDetails: {
                    amountReceived,
                    receivedDate: new Date().toISOString(),
                    approvedBy: 'admin',
                }
            });
        }
        setIsPaymentModalOpen(false);
        setSelectedInstall(null);
    };

    const handleApproveExpense = async (approvedAmount: number) => {
        if (selectedInstall && selectedInstall.travelExpense) {
            await updateInstall({
                ...selectedInstall,
                travelExpense: {
                    ...selectedInstall.travelExpense,
                    amount: approvedAmount,
                    status: 'approved'
                }
            });
        }
        setIsApproveExpenseModalOpen(false);
        setSelectedInstall(null);
    }
    
    const filteredAndSortedInstalls = useMemo(() => {
        return installs
            .filter(install => {
                const searchTermLower = filters.searchTerm.toLowerCase();
                const matchesSearch = searchTermLower === '' ||
                    install.customer.name.toLowerCase().includes(searchTermLower) ||
                    install.customer.phone.includes(searchTermLower) ||
                    (install.imei && install.imei.includes(searchTermLower));
                
                const matchesStatus = filters.status === '' || install.status === filters.status;
                const matchesTechnician = filters.technician === '' || install.technicianId === filters.technician;
                
                return matchesSearch && matchesStatus && matchesTechnician;
            })
            .sort((a, b) => {
                if (filters.sort === 'oldest') {
                    return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
                }
                return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(); // newest
            });
    }, [installs, filters]);

    const dashboardMetrics = useMemo(() => ({
        totalInstalls: installs.length,
        completedInstalls: installs.filter(i => i.status === InstallStatus.Completed || i.status === InstallStatus.PaymentReceived).length,
        pendingAmount: installs
            .filter(i => i.status === InstallStatus.Completed || i.status === InstallStatus.PaymentPendingApproval)
            .reduce((acc, i) => acc + (i.productPrice - i.technicianFee - (i.travelExpense?.status === 'approved' ? i.travelExpense.amount : 0)), 0),
    }), [installs]);

    return (
        <div className="min-h-screen bg-gray-100 text-slate-800 font-sans">
            <Header onAddInstall={() => setIsInstallModalOpen(true)} onLogout={onLogout} isAdmin />
            
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`${activeTab === 'dashboard' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            ইন্সটলমেন্ট
                        </button>
                        <button
                            onClick={() => setActiveTab('technicians')}
                            className={`${activeTab === 'technicians' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            টেকনিশিয়ান
                        </button>
                    </nav>
                </div>

                {activeTab === 'dashboard' && (
                    <Dashboard
                        installs={filteredAndSortedInstalls}
                        technicians={technicians}
                        metrics={dashboardMetrics}
                        onUpdateInstall={updateInstall}
                        onOpenShipModal={(id) => openModalForInstall(id, setIsShipModalOpen)}
                        onOpenPaymentModal={(id) => openModalForInstall(id, setIsPaymentModalOpen)}
                        onOpenApproveExpenseModal={(id) => openModalForInstall(id, setIsApproveExpenseModalOpen)}
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                )}

                {activeTab === 'technicians' && (
                    <TechnicianManager 
                        technicians={technicians}
                        onAddTechnician={() => setIsTechnicianModalOpen(true)}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteTechnician}
                    />
                )}
            </main>

            {isInstallModalOpen && <AddInstallModal onClose={() => setIsInstallModalOpen(false)} onAddInstall={addInstall} technicians={technicians} />}
            {isTechnicianModalOpen && <AddTechnicianModal onClose={() => setIsTechnicianModalOpen(false)} onAddTechnician={addTechnician} />}
            {isEditTechnicianModalOpen && technicianToEdit && <EditTechnicianModal technician={technicianToEdit} onClose={() => { setIsEditTechnicianModalOpen(false); setTechnicianToEdit(null); }} onUpdateTechnician={handleUpdateTechnician} />}
            {isShipModalOpen && selectedInstall && <ShipDeviceModal onClose={() => { setIsShipModalOpen(false); setSelectedInstall(null); }} onShipDevice={handleShipDevice} />}
            {isPaymentModalOpen && selectedInstall && <PaymentApprovalModal install={selectedInstall} onClose={() => { setIsPaymentModalOpen(false); setSelectedInstall(null); }} onApprove={handleApprovePayment} />}
            {isApproveExpenseModalOpen && selectedInstall && <ApproveExpenseModal install={selectedInstall} onClose={() => { setIsApproveExpenseModalOpen(false); setSelectedInstall(null); }} onApprove={handleApproveExpense} />}
        </div>
    );
};

export default AdminPanel;