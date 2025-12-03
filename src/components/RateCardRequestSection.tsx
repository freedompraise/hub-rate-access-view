import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "./AccessRequestModal";

const RateCardRequestSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="rate-card-request" className="section-white py-32 px-6 bg-gradient-to-b from-white via-gray-50 to-white border-y-2 border-tkh-orange">
      <div className="container mx-auto text-center">
        <p className="text-sm font-semibold text-tkh-orange uppercase tracking-wider mb-3">
          Our Pricing & Packages
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-black mb-6">
          Ready to Make Your Brand Impossible to Ignore?
        </h2>
        <p className="text-xl text-black/70 max-w-3xl mx-auto mb-12">
          Get detailed pricing information for our services.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-white to-gray-50 p-12 rounded-xl border-2 border-tkh-orange shadow-2xl hover:shadow-3xl transition-all duration-300">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient text-xl px-12 py-6 font-bold w-full mb-4 hover:scale-105 transition-transform"
            >
              Request Access Now
            </Button>
            
            <p className="text-sm text-black/60">
              We'll review your request and contact you via WhatsApp within 24 hours
            </p>
          </div>
        </div>
      </div>
      
      <AccessRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default RateCardRequestSection;
