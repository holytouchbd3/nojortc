
import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Technician } from './types';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import TechnicianPanel from './pages/TechnicianPanel';

const App: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useLocalStorage<Technician | { id: 'admin'; username: 'admin' } | null>('loggedInUser', null);
    const [technicians, setTechnicians] = useLocalStorage<Technician[]>('technicians', []);

    const handleLogin = (user: Technician | { id: 'admin'; username: 'admin' }) => {
        setLoggedInUser(user);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    if (!loggedInUser) {
        return <LoginPage onLogin={handleLogin} technicians={technicians} />;
    }

    if (loggedInUser.id === 'admin') {
        return <AdminPanel onLogout={handleLogout} />;
    }

    return <TechnicianPanel loggedInTechnician={loggedInUser as Technician} onLogout={handleLogout} />;
};

export default App;
