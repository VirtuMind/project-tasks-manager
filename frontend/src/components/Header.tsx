import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b-4 border-foreground bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div></div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 border-4 border-foreground bg-muted px-4 py-2">
            <User className="h-5 w-5" />
            <span className="font-mono font-bold">{user?.name}</span>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="px-4 py-5 font-bold uppercase tracking-wide border-4 border-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
