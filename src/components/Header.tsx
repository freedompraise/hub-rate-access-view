
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isAdminVisible, setIsAdminVisible] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-midnight-black/90 backdrop-blur-sm border-b border-charcoal-gray">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-royal-gold rounded-full flex items-center justify-center">
            <span className="text-midnight-black font-montserrat font-bold text-sm">K</span>
          </div>
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
          {isAdminVisible && (
            <a 
              href="/admin" 
              className="text-white/90 hover:text-royal-gold transition-colors font-montserrat"
            >
              Admin
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdminVisible(!isAdminVisible)}
            className="text-xs text-white/60 hover:text-royal-gold"
          >
            {isAdminVisible ? "Hide" : "Show"} Admin
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
