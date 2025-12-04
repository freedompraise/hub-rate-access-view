// Index
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "@/components/AccessRequestModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalendlyClick = () => {
    window.open('https://calendly.com/thecreativekontenthub/30min', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/2347025277328', '_blank');
  };

  

  return (
    <div className="min-h-screen bg-white">
   

      <section id="rate-card-request" className="section-white py-16 px-6 border-tkh-orange border-t border-b">
        <div className="container mx-auto text-center max-w-3xl">
          <p className="text-xs font-semibold text-tkh-orange uppercase tracking-wider mb-2">
            Our Pricing & Packages
          </p>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-black mb-4">
            Ready to Make Your Brand Impossible to Ignore?
          </h2>
          <p className="text-sm text-black/70">
            Get detailed pricing information for our services.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient text-base px-8 py-3 font-bold w-full mb-2"
            >
              Request Access Now
            </Button>
            <p className="text-xs text-black/60">
              We'll review your request and contact you via WhatsApp within 24 hours
            </p>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Other Ways to Connect
          </p>
          <h3 className="text-lg md:text-xl font-serif font-bold text-black mb-2">
            Book a strategy session with Becca, our Creative and Marketing Lead.
          </h3>
          <p className="text-sm text-black/60 mb-4">
            Together, we'll craft a plan that makes your brand stand out.
          </p>

          <div className="space-y-4">
            {/* Strategy Session Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-serif font-semibold text-sm mb-2">Book a Meeting</h4>
              <p className="text-xs text-black/70 mb-2">Schedule a 30-minute strategy session to discuss your brand's needs</p>
              <Button
                onClick={handleCalendlyClick}
                className="btn-gradient w-full text-sm px-4 py-2"
              >
                Schedule Now
              </Button>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-serif font-semibold text-sm mb-2">Get in Touch</h4>
              <div className="space-y-1 mb-2 text-xs">
                <p>
                  <span className="text-black/70">Nigeria: </span>
                  <a href="tel:+2347025277328" className="text-tkh-orange hover:underline">
                    +234 702 527 7328
                  </a>
                </p>
                <p>
                  <span className="text-black/70">USA: </span>
                  <a href="tel:+16172518898" className="text-tkh-orange hover:underline">
                    +1 617 251 8898
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="btn-gradient flex-1 text-sm px-3 py-2"
                >
                  <a href="tel:+2347025277328">Call Now</a>
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  className="btn-gradient flex-1 text-sm px-3 py-2"
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

      <Footer />
    </div>
  );
};

export default Index;
