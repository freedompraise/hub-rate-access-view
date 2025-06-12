
import { useState } from "react";
import Header from "@/components/Header";
import AccessRequestModal from "@/components/AccessRequestModal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      
      {/* Hero Section with brand gradient */}
      <div className="relative pt-20 pb-16 px-6 bg-hero-gradient text-white">
        <div className="relative z-10 container mx-auto text-center py-24">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in">
            GET YOUR CUSTOMIZED
          </h1>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 animate-fade-in">
            MARKETING STRATEGY RATES
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-sans max-w-3xl mx-auto mb-12 animate-fade-in">
            Submit your details below. We'll send a WhatsApp link for secure access to our comprehensive rate card.
          </p>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-tkh-purple hover:bg-tkh-yellow hover:text-black text-lg px-12 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 animate-scale-in font-semibold"
          >
            REQUEST ACCESS
          </Button>
          
          <div className="mt-16 animate-bounce">
            <ArrowDown className="mx-auto text-white w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg border border-border shadow-md hover-scale">
              <div className="w-16 h-16 bg-tkh-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-sans font-bold text-xl">1</span>
              </div>
              <h3 className="text-tkh-orange font-serif font-semibold text-xl mb-4">
                Request Access
              </h3>
              <p className="text-black">
                Fill out the simple form with your contact details to request access to our rate card.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-border shadow-md hover-scale">
              <div className="w-16 h-16 bg-tkh-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-sans font-bold text-xl">2</span>
              </div>
              <h3 className="text-tkh-orange font-serif font-semibold text-xl mb-4">
                WhatsApp Verification
              </h3>
              <p className="text-black">
                Chat with us on WhatsApp for quick verification and personalized service.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-border shadow-md hover-scale">
              <div className="w-16 h-16 bg-tkh-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-sans font-bold text-xl">3</span>
              </div>
              <h3 className="text-tkh-orange font-serif font-semibold text-xl mb-4">
                Secure Access
              </h3>
              <p className="text-black">
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
