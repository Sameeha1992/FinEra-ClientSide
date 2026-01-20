import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  logo?: React.ReactNode;
}

export function Navbar({ logo }: NavbarProps) {
  return (
    <header className="h-16 bg-navbar border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {logo || (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-semibold text-primary">FinEra</span>
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className="text-sm font-medium text-navbar-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Home
        </Link>
        <Link 
          to="/loans" 
          className="text-sm font-medium text-navbar-foreground hover:text-primary transition-colors"
        >
          Loans
        </Link>
        <Link 
          to="/about" 
          className="text-sm font-medium text-navbar-foreground hover:text-primary transition-colors"
        >
          About Us
        </Link>
        <Link 
          to="/contact" 
          className="text-sm font-medium text-navbar-foreground hover:text-primary transition-colors"
        >
          Contact Us
        </Link>
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-secondary hover:text-secondary/80 transition-colors">
          <Bell className="w-5 h-5 fill-current" />
        </button>
        <Button variant="default" size="sm" className="rounded-full px-6">
          Login/Signup
        </Button>
      </div>
    </header>
  );
}