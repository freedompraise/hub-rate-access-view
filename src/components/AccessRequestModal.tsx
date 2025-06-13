
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessRequestModal = ({ isOpen, onClose }: AccessRequestModalProps) => {  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    brandName: "",
    instagramHandle: "",
    helpNeeded: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {      // TODO: Update Supabase RPC to include new fields (brandName, instagramHandle, helpNeeded)
      const { error } = await supabase.rpc('create_rate_card_request', {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        email: formData.email || null
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "We'll review your request and contact you via WhatsApp.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi, I would like to request access to view the rate card.\n\n` +
      `Name: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phoneNumber}\n` +
      `Brand: ${formData.brandName}\n` +
      `Instagram: ${formData.instagramHandle}\n` +
      `Needs: ${formData.helpNeeded}`
    );
    window.open(`https://wa.me/2347025277328?text=${message}`, '_blank');
  };
  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      brandName: "",
      instagramHandle: "",
      helpNeeded: ""
    });
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white border-border text-black max-w-md shadow-lg">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-tkh-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.687"/>
              </svg>
            </div>
            <h3 className="text-tkh-orange font-serif font-semibold text-xl mb-2">
              Thank you, {formData.fullName}!
            </h3>
            <p className="text-black mb-6">
              Tap below to chat with us on WhatsApp so we can approve your access.
            </p>
            <Button
              onClick={handleWhatsAppClick}
              className="btn-gradient font-sans font-semibold uppercase transition-all duration-300"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-border text-black max-w-md shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-tkh-orange font-serif text-xs text-center">
            Please fill out the form below to request access to our rate card, and we'll get back to you shortly.
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-black">
              Name *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="bg-white border-border text-black focus:border-tkh-orange"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white border-border text-black focus:border-tkh-orange"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-black">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
              className="bg-white border-border text-black focus:border-tkh-orange"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-black">
              Brand Name *
            </Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              required
              className="bg-white border-border text-black focus:border-tkh-orange"
              placeholder="Enter your brand name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramHandle" className="text-black">
              Instagram Handle *
            </Label>
            <Input
              id="instagramHandle"
              value={formData.instagramHandle}
              onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              required
              className="bg-white border-border text-black focus:border-tkh-orange"
              placeholder="@yourbrand"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="helpNeeded" className="text-black">
              What do you need help with? *
            </Label>
            <Input
              id="helpNeeded"
              value={formData.helpNeeded}
              onChange={(e) => setFormData({ ...formData, helpNeeded: e.target.value })}
              required
              className="bg-white border-border text-black focus:border-tkh-orange"
              placeholder="Tell us about your needs"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !formData.fullName || !formData.phoneNumber}
            className="w-full btn-gradient font-sans font-semibold uppercase transition-all duration-300 mt-6"
          >
            {isLoading ? "Submitting..." : "Submit & Chat on WhatsApp"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessRequestModal;
