import { useEffect } from "react";
import Header from "@/components/Header";
import ServicesSection from "@/components/ServicesSection";
import WorksSection from "@/components/WorksSection";
import RateCardSection from "@/components/RateCardSection";
import RateCardRequestSection from "@/components/RateCardRequestSection";
import BrandHelpSection from "@/components/BrandHelpSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import FeaturedBrands from '@/components/FeaturedBrands';

const Index = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle hash-based navigation when page loads
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # symbol
        const sectionId = hash.substring(1);
        const element = document.getElementById(sectionId);
        
        if (element) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            // Get the header height to account for fixed positioning
            const headerHeight = 80; // pt-20 = 5rem = 80px
            const offset = headerHeight + 20; // Extra 20px for breathing room
            
            const elementPosition = element.offsetTop - offset;
            
            window.scrollTo({
              top: Math.max(0, elementPosition),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };

    // Handle initial load
    handleHashNavigation();

    // Handle hash changes (in case user navigates with hash after page load)
    const handleHashChange = () => {
      handleHashNavigation();
    };

    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Navy Background */}
      <section className="section-navy pt-20 pb-16 px-6 min-h-screen flex items-center" id="hero">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 animate-fade-in">
            Igniting Brands with Creative Strategies
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 font-sans max-w-xl mx-auto mb-12 animate-fade-in">
            Where brand strategy meets compelling storytelling and purposeful creativity.
          </p>
          
          <Button
            onClick={() => window.location.href="https://hillarythecreative.my.canva.site/thekontenthubportfolio"}
            className="btn-gradient text-lg px-8 py-4 animate-scale-in font-semibold"
          >
            View Our Portfolio
          </Button>
        </div>
      </section>

      <BrandHelpSection />
      {/* Featured Brands Section - White Background */}
      <FeaturedBrands />
      {/* Services Section - White Background */}
      <ServicesSection />

      {/* Works Section - Navy Background */}
      {/* <WorksSection /> */}

      {/* Rate Card Request Section - White Background */}
      <RateCardRequestSection />

      {/* Contact Section - White Background */}
      <RateCardSection />

      {/* Footer - Navy Background */}
      <Footer />
    </div>
  );
};

export default Index;
