import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Trophy,
  MessageCircle,
  Target,
  Settings,
  Home,
  BarChart3
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'mentor', label: 'AI Mentor', icon: MessageCircle },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const StudentSidebar = ({ 
  activeTab, 
  onTabChange, 
  isOpen = true, 
  onClose 
}: StudentSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-16">
          <div className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-smooth",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose?.();
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <div className="gradient-primary rounded-lg p-4 text-white">
              <p className="text-sm font-medium mb-2">Level Up!</p>
              <p className="text-xs text-white/80">
                Complete more lessons to reach the next level
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};