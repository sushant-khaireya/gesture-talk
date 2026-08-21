import { NavLink } from '@/components/NavLink';
import { Hand, Home, Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Hand className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GestureTalk
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink to="/">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </NavLink>
            <NavLink to="/how-to-use">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">How to Use</span>
              </Button>
            </NavLink>
            <NavLink to="/about">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
