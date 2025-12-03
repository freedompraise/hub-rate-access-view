import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "./AccessRequestModal";

const RateCardRequestSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCalendlyClick = () => {
    window.open('https://calendly.com/thecreativekontenthub/30min', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/2347025277328', '_blank');
  };


  return (
    <section id="rate-card-request" className="section-white py-32 px-6 bg-gradient-to-b from-white via-gray-50 to-white border-y-2 border-tkh-orange">
      <div className="container mx-auto text-center">
        <p className="text-sm font-semibold text-tkh-orange uppercase tracking-wider mb-3">
          Our Pricing & Packages
        </p>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">
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

            <div className="container mx-auto text-center mt-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Other Ways to Connect
        </p>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-black mb-4">
          Book a strategy session with Becca, our Creative and Marketing Lead.
        </h3>
        <p className="text-base text-black/60 max-w-3xl mx-auto mb-8">
          Together, we'll craft a plan that makes your brand stand out.
        </p>
        
        <div className="flex flex-row md:flex-col gap-6 max-w-3xl mx-auto">
          {/* Strategy Session Card */}
          <div className="bg-white px-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-serif font-semibold text-lg mb-3">Book a Meeting</h3>
            <p className="text-sm text-black/70 mb-4">Schedule a 30-minute strategy session to discuss your brand's needs</p>
            <Button
              onClick={handleCalendlyClick}
              className="btn-gradient w-full"
            >
              Schedule Now
            </Button>
          </div>

          {/* Direct Contact Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-serif font-semibold text-lg mb-3">Get in Touch</h3>
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
            <div className="flex gap-2">
              <Button
                asChild
                className="btn-gradient flex-1"
              >
                <a href="tel:+2347025277328">Call Now</a>
              </Button>
              <Button
                onClick={handleWhatsAppClick}
                className="btn-gradient flex-1"
              >
                WhatsApp
              </Button>
            </div>
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
