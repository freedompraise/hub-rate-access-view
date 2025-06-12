
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "./AccessRequestModal";

const RateCardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="rate-card" className="section-white py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">
          Want Our Full Breakdown?
        </h2>
        <p className="text-lg text-black/70 max-w-2xl mx-auto mb-8">
          Get a full view of pricing, packages, and what's included.
        </p>
        
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-gradient text-lg px-8 py-4"
        >
          Request Access
        </Button>
      </div>
      
      <AccessRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default RateCardSection;
