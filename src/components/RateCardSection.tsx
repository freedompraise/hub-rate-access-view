import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "./AccessRequestModal";

const RateCardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalendlyClick = () => {
    window.open('https://calendly.com/thecreativekontenthub/30min', '_blank');
  };

  return (
    <section id="contact" className="section-white py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">
          Ready to Make Your Brand Impossible to Ignore?
        </h2>
        <p className="text-lg text-black/70 max-w-3xl mx-auto mb-8">
          Book a strategy session with Becca, our visionary Creative and Marketing Lead.
          Together, we'll craft a plan that makes your brand impossible to ignore.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {/* Strategy Session Card */}
          <div className="bg-white p-6 rounded-lg border border-border shadow-md hover:border-tkh-yellow transition-all duration-300">
            <h3 className="font-serif font-semibold text-lg mb-3">Book a Meeting</h3>
            <p className="text-sm text-black/70 mb-4">Schedule a 30-minute strategy session to discuss your brand's needs</p>
            <Button
              onClick={handleCalendlyClick}
              className="btn-gradient w-full"
            >
              Schedule Now
            </Button>
          </div>

          {/* Rate Card Access */}
          <div className="bg-white p-6 rounded-lg border border-border shadow-md hover:border-tkh-yellow transition-all duration-300">
            <h3 className="font-serif font-semibold text-lg mb-3">View Rate Card</h3>
            <p className="text-sm text-black/70 mb-4">Get detailed pricing information for our services</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient w-full"
            >
              Request Access
            </Button>
          </div>

          {/* Direct Contact Card */}
          <div className="bg-white p-6 rounded-lg border border-border shadow-md hover:border-tkh-yellow transition-all duration-300">
            <h3 className="font-serif font-semibold text-lg mb-3">Call Us</h3>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="text-black/70">Nigeria: </span>
                <a href="tel:+2347025277328" className="text-tkh-orange hover:underline">
                  +234 702 527 7328
                </a>
              </p>
              <p className="text-sm">
                <span className="text-black/70">USA: </span>
                <a href="tel:+16172518898" className="text-tkh-orange hover:underline">
                  +1 617 251 8898
                </a>
              </p>
            </div>
            <Button
              asChild
              className="btn-gradient w-full"
            >
              <a href="tel:+2347025277328">Call Now</a>
            </Button>
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

export default RateCardSection;
