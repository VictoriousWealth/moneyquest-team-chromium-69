import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  LogOut, 
  Menu,
  Trophy,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  user?: {
    name: string;
    role: 'student' | 'teacher';
    avatar?: string;
    level?: number;
    xp?: number;
  };
  onMenuClick?: () => void;
}

export const Navbar = ({ user, onMenuClick }: NavbarProps) => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 gradient-hero rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MQ</span>
          </div>
          <span className="font-bold text-xl gradient-hero bg-clip-text text-transparent">
            MoneyQuest
          </span>
        </div>

        {/* Quick actions */}
        <div className="ml-auto flex items-center space-x-2">
          {user?.role === 'student' && (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Trophy className="h-4 w-4 mr-2" />
                Level {user.level || 1}
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <BookOpen className="h-4 w-4 mr-2" />
                {user.xp || 0} XP
              </Button>
            </>
          )}

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user?.name || 'Guest'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role || 'No role'}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              {user?.role === 'student' && (
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>AI Mentor</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};