// Index.jsx
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import AccessRequestModal from "@/components/AccessRequestModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalendlyClick = () => {
    window.open("https://calendly.com/thecreativekontenthub/30min", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/2347025277328", "_blank");
  };

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          setTimeout(() => {
            const headerHeight = 80;
            const offset = headerHeight + 12;
            const elementPosition = element.offsetTop - offset;

            window.scrollTo({
              top: Math.max(0, elementPosition),
              behavior: "smooth"
            });
          }, 100);
        }
      }
    };

    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section
        id="rate-card-request"
        className="py-20 px-6 bg-white border-y border-tkh-orange"
      >
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row md:items-start md:justify-between gap-16">

          {/* Left side */}
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-sm font-semibold text-tkh-orange uppercase tracking-wider mb-2">
              Our Pricing and Packages
            </p>

            <h2 className="text-3xl font-serif font-bold text-black mb-4">
              Ready to Make Your Brand Impossible to Ignore?
            </h2>

            <p className="text-lg text-black/70 mb-10">
              Get detailed pricing information for our services.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-tkh-orange/40">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="btn-gradient text-lg w-full py-4 font-bold"
              >
                Request Access Now
              </Button>

              <p className="text-xs text-black/60 mt-3">
                We will review your request and contact you via WhatsApp within 24 hours
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Other Ways to Connect
            </p>

            <h3 className="text-2xl font-serif font-bold text-black mb-4">
              Book a strategy session with Becca, our Creative and Marketing Lead.
            </h3>

            <p className="text-base text-black/60 mb-8 max-w-xl md:max-w-none">
              Together, we will craft a plan that makes your brand stand out.
            </p>

            {/* Vertical stack */}
            <div className="flex flex-col gap-5 max-w-md">

              {/* Book a Meeting */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-serif font-semibold text-lg mb-2">
                  Book a Meeting
                </h3>
                <p className="text-sm text-black/70 mb-4">
                  Schedule a 30 minute strategy session to discuss your brand's needs
                </p>
                <Button onClick={handleCalendlyClick} className="btn-gradient w-full">
                  Schedule Now
                </Button>
              </div>

              {/* Get in Touch */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-serif font-semibold text-lg mb-3">
                  Get in Touch
                </h3>

                <div className="space-y-1 mb-4">
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
                  <Button asChild className="btn-gradient flex-1">
                    <a href="tel:+2347025277328">Call Now</a>
                  </Button>

                  <Button onClick={handleWhatsAppClick} className="btn-gradient flex-1">
                    WhatsApp
                  </Button>
                </div>

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
