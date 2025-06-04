
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";

const Header = () => {
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-midnight-black/90 backdrop-blur-sm border-b border-charcoal-gray">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/c85aa68f-ad21-41fb-a103-805c14e0490c.png" 
            alt="The Kontent Hub Logo" 
            className="w-10 h-10"
          />
          <span className="text-royal-gold font-montserrat font-semibold text-xl">
            The Kontent Hub
          </span>
        </div>
        
        <nav className="flex items-center space-x-6">
          <a 
            href="/" 
            className="text-white/90 hover:text-royal-gold transition-colors font-montserrat"
          >
            Home
          </a>
          {(isAdminVisible || user) && (
            <a 
              href="/admin" 
              className="text-white/90 hover:text-royal-gold transition-colors font-montserrat"
            >
              Admin
            </a>
          )}
          {!user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdminVisible(!isAdminVisible)}
              className="text-xs text-white/60 hover:text-royal-gold"
            >
              {isAdminVisible ? "Hide" : "Show"} Admin
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
