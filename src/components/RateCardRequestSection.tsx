import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "./AccessRequestModal";

const RateCardRequestSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="rate-card-request" className="section-white py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">
          Get Our Rate Card
        </h2>
        <p className="text-lg text-black/70 max-w-3xl mx-auto mb-8">
        Get detailed pricing information for our services.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg border border-border shadow-lg hover:shadow-xl transition-all duration-300">
          
            
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient text-lg px-8 py-4 font-semibold"
            >
              Request Access Now
            </Button>
            
            <p className="text-xs text-black/50 mt-4">
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
