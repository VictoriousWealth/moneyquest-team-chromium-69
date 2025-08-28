import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { LogOut, Rocket } from 'lucide-react';
import { Role } from '../../lib/roles';
import { supabase } from '../../integrations/supabase/client';

interface HeaderProps {
    role: Role;
}

const Header: React.FC<HeaderProps> = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--ring)] bg-surface/80 px-6 backdrop-blur-sm">
            <NavLink to="/" className="flex items-center gap-2 font-semibold text-text">
                <Rocket className="h-6 w-6 text-[var(--blue-500)]" />
                <span>MoneyQuest</span>
            </NavLink>
            <div className="flex items-center gap-4">
                 <span className="font-semibold capitalize text-subtext">{role} View</span>
                <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 text-subtext">
                    <LogOut size={16} />
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default Header;