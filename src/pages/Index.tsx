import { useEffect } from "react";
import Header from "@/components/Header";
import RateCardRequestSection from "@/components/RateCardRequestSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Handle hash-based navigation when page loads
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
  
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

{/* Rate Card Request Section - White Background */}
      <RateCardRequestSection />

  

      <Footer />
    </div>
  );
};

export default Index;
