
import { useState } from "react";
import Header from "@/components/Header";
import AccessRequestModal from "@/components/AccessRequestModal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-6">
        <div className="absolute inset-0 bg-background/80"></div>
        
        <div className="relative z-10 container mx-auto text-center py-24">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 animate-fade-in">
            GET YOUR CUSTOMIZED
          </h1>
          <h1 className="text-5xl md:text-7xl font-serif font-bold gradient-text mb-8 animate-fade-in">
            MARKETING STRATEGY RATES
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 font-sans max-w-3xl mx-auto mb-12 animate-fade-in">
            Submit your details below. We'll send a WhatsApp link for secure access to our comprehensive rate card.
          </p>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-lg px-12 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 animate-scale-in"
          >
            REQUEST ACCESS
          </Button>
          
          <div className="mt-16 animate-bounce">
            <ArrowDown className="mx-auto text-info w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-tkh-black py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg border border-secondary/20 hover-scale">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-tkh-black font-sans font-bold text-xl">1</span>
              </div>
              <h3 className="text-accent font-serif font-semibold text-xl mb-4">
                Request Access
              </h3>
              <p className="text-tkh-black/80">
                Fill out the simple form with your contact details to request access to our rate card.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-secondary/20 hover-scale">
              <div className="w-16 h-16 bg-info rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-sans font-bold text-xl">2</span>
              </div>
              <h3 className="text-accent font-serif font-semibold text-xl mb-4">
                WhatsApp Verification
              </h3>
              <p className="text-tkh-black/80">
                Chat with us on WhatsApp for quick verification and personalized service.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-secondary/20 hover-scale">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-tkh-black font-sans font-bold text-xl">3</span>
              </div>
              <h3 className="text-accent font-serif font-semibold text-xl mb-4">
                Secure Access
              </h3>
              <p className="text-tkh-black/80">
                Receive a secure, time-limited link to view our comprehensive marketing strategy rates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AccessRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
