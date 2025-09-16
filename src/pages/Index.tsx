
import Header from "@/components/Header";
import ServicesSection from "@/components/ServicesSection";
import WorksSection from "@/components/WorksSection";
import RateCardSection from "@/components/RateCardSection";
import BrandHelpSection from "@/components/BrandHelpSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Navy Background */}
      <section className="section-navy pt-20 pb-16 px-6 min-h-screen flex items-center">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 animate-fade-in">
            Igniting Brands with Creative Strategies
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 font-sans max-w-xl mx-auto mb-12 animate-fade-in">
            Where brand strategy meets compelling storytelling and purposeful creativity.
          </p>
          
          <Button
            onClick={scrollToServices}
            className="btn-gradient text-lg px-8 py-4 animate-scale-in font-semibold"
          >
            Explore Our Services
          </Button>
        </div>
      </section>

      <BrandHelpSection />
      {/* Services Section - White Background */}
      <ServicesSection />

      {/* Works Section - Navy Background */}
      {/* <WorksSection /> */}

      {/* Rate Card Section - White Background */}
      <RateCardSection />

      {/* Footer - Navy Background */}
      <Footer />
    </div>
  );
};

export default Index;
