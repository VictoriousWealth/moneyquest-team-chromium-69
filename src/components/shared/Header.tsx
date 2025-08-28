import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { LogOut, Rocket } from 'lucide-react';

interface HeaderProps {
  userType: 'student' | 'teacher';
}

const Header: React.FC<HeaderProps> = ({ userType }) => {
  const { signOut, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--ring)] bg-surface/80 px-6 backdrop-blur-sm">
      <Link to={`/${userType}/dashboard`} className="flex items-center gap-2 font-semibold text-text">
        <Rocket className="h-6 w-6 text-[var(--blue-500)]" />
        <span>MoneyQuest</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-subtext">{userType === 'student' ? 'Student View' : 'Teacher View'}</span>
        <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;