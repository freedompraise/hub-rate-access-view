
const Footer = () => {
  return (
    <footer id="contact" className="section-navy py-16 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/283ca45c-93b6-4e0d-b037-e991c94291dc.png" 
              alt="The Kontent Hub Logo" 
              className="w-8 h-8"
            />
            <div>
              <span className="text-tkh-yellow font-serif font-semibold text-lg block">
                The Kontent Hub
              </span>
              <span className="text-white/80 text-sm">
                Igniting Brands with Creative Strategies
              </span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a 
              href="/" 
              className="text-white hover:text-tkh-yellow transition-colors font-sans"
            >
              Home
            </a>
            <a 
              href="#services" 
              className="text-white hover:text-tkh-yellow transition-colors font-sans"
            >
              Services
            </a>
            <a 
              href="#rate-card" 
              className="text-white hover:text-tkh-yellow transition-colors font-sans"
            >
              Rate Card
            </a>
            <a 
              href="https://instagram.com/thekontenthub" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-tkh-yellow transition-colors font-sans"
            >
              Instagram
            </a>
            <a 
              href="#contact" 
              className="text-white hover:text-tkh-yellow transition-colors font-sans"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
