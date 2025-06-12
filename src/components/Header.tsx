
import { useAuth } from "./AuthProvider";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo/dark.PNG" 
            alt="The Kontent Hub Logo" 
            className="w-12 h-12"
          />

        </div>
        
        <nav className="flex items-center space-x-6">
          <a 
            href="/" 
            className="text-black hover:text-tkh-purple transition-colors font-sans"
          >
            Home
          </a>
          <a 
            href="#services" 
            className="text-black hover:text-tkh-purple transition-colors font-sans"
          >
            Services
          </a>
          <a 
            href="#work" 
            className="text-black hover:text-tkh-purple transition-colors font-sans"
          >
            Work
          </a>
          <a 
            href="#rate-card" 
            className="text-black hover:text-tkh-purple transition-colors font-sans"
          >
            Request Rate Card
          </a>
          <a 
            href="#contact" 
            className="text-black hover:text-tkh-purple transition-colors font-sans"
          >
            Contact
          </a>
          {user && (
            <a 
              href="/admin" 
              className="text-black hover:text-tkh-purple transition-colors font-sans text-sm"
            >
              Admin
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
