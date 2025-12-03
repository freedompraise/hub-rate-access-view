import { Button } from "@/components/ui/button";

const RateCardSection = () => {
  const handleCalendlyClick = () => {
    window.open('https://calendly.com/thecreativekontenthub/30min', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/2347025277328', '_blank');
  };

  return (
    <section id="contact" className="section-white py-16 px-6 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Other Ways to Connect
        </p>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">
          Book a strategy session with Becca, our Creative and Marketing Lead.
        </h3>
        <p className="text-base text-black/60 max-w-3xl mx-auto mb-8">
          Together, we'll craft a plan that makes your brand stand out.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Strategy Session Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
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
    </section>
  );
};

export default RateCardSection;
