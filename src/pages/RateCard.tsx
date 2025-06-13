// components/RateCard.tsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import rateCardData from '@/constants/rate-card.json';

const RateCard = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
      setError("No access token provided.");
    }
  }, [searchParams]);

  const handleCalendlyClick = () => {
    window.open('https://calendly.com/thecreativekontenthub/30min', '_blank');
  };

  const validateToken = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: validationData, error: validationError } = await supabase
        .rpc('validate_rate_card_token', { token_input: token });

      if (validationError) throw new Error("Invalid or expired access token.");

      const validation = validationData as {
        valid: boolean;
        full_name: string;
        request_id: string;
      };

      if (validation && validation.valid) {
        setIsValid(true);
        setUserName(validation.full_name);
        await supabase.rpc('mark_token_as_accessed', { token_input: token });
      } else {
        setIsValid(false);
        throw new Error("Access token has expired or is invalid.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while validating access.");
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  const MarketingStrategySection = () => (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">
        Marketing Strategy Packages
      </h2>
      <div className="grid gap-8">
        {rateCardData.marketing_strategy_packages.map((package_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl font-serif">{package_.title}</CardTitle>
              {package_.description && <CardDescription>{package_.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={package_.variants[0].market}>
                <TabsList className="mb-4">
                  {package_.variants.map((variant, vIndex) => (
                    <TabsTrigger key={vIndex} value={variant.market}>{variant.market}</TabsTrigger>
                  ))}
                </TabsList>
                {package_.variants.map((variant, vIndex) => (
                  <TabsContent key={vIndex} value={variant.market}>
                    <div className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-lg font-semibold">{variant.market}</h4>
                        <div className="text-right">
                          <p className="text-xl font-bold text-tkh-orange">{variant.price}</p>
                          {variant.duration && (
                            <p className="text-sm text-gray-600">{variant.duration}</p>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {variant.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-tkh-orange mr-2">•</span><span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">View Terms & Conditions</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Marketing Strategy Terms & Conditions</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2 text-sm">
            {rateCardData.marketing_strategy_terms.map((term, index) => (
              <p key={index} className="text-justify leading-relaxed">{term}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );

  const SocialMediaSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">
        Social Media Management
      </h2>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-baseline">
            <div>
              <CardTitle className="text-xl font-serif">{rateCardData.social_media_management.title}</CardTitle>
              <CardDescription className="mt-1">Best for: {rateCardData.social_media_management.best_for}</CardDescription>
            </div>
            <p className="text-xl font-bold text-tkh-orange">{rateCardData.social_media_management.price}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="inclusions">
              <AccordionTrigger>Package Inclusions</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {rateCardData.social_media_management.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-tkh-orange mr-2">•</span><span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="terms">
              <AccordionTrigger>Terms & Conditions</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {rateCardData.social_media_management.terms.map((term, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-tkh-orange mr-2">•</span><span>{term}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );

  const ReelsSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">
        Reel Strategy & Production
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {rateCardData.reel_strategy_production.variants.map((variant, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg font-serif">{variant.type}</CardTitle>
              <p className="text-xl font-bold text-tkh-orange">{variant.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {variant.inclusions?.map((inc, j) => (
                  <li key={j} className="flex items-start">
                    <span className="text-tkh-orange mr-2">•</span><span>{inc}</span>
                  </li>
                ))}
              </ul>
              {variant.terms && (
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="terms">
                    <AccordionTrigger>Terms</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {variant.terms.map((term, j) => (
                          <li key={j} className="flex items-start">
                            <span className="text-tkh-orange mr-2">•</span><span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  const CampaignSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">
        Campaign Shoots
      </h2>
      <div className="space-y-6">
        {rateCardData.campaign_shoot.steps.map((step, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-baseline">
                <CardTitle className="text-xl font-serif">{step.phase}</CardTitle>
                <p className="text-xl font-bold text-tkh-orange">{step.price || `From ${step.price_from}`}</p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.inclusions?.map((inc, j) => (
                  <li key={j} className="flex items-start">
                    <span className="text-tkh-orange mr-2">•</span><span>{inc}</span>
                  </li>
                ))}
              </ul>
              {step.location_coverage && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Available Locations:</p>
                  <div className="flex flex-wrap gap-2">
                    {step.location_coverage.map((loc, k) => (
                      <Badge key={k} variant="secondary">{loc}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Campaign Terms</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Campaign Shoot Terms & Conditions</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 text-sm">
              {rateCardData.campaign_shoot.terms.map((term, i) => (
                <p key={i} className="text-justify leading-relaxed">{term}</p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black">Validating access...</p>
      </div>
    );
  }

  if (error || !isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-6">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-serif font-bold text-tkh-orange mb-2">Access Denied</h2>
            <p className="text-black mb-6">{error || "Invalid or expired link."}</p>
            <Button onClick={() => window.location.href = '/'}>
              Request New Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20 px-6">
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="text-center mb-12">
            <img src="/logo/light.png" alt="The Kontent Hub Logo" className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
              Marketing Strategy Rate Card
            </h1>
            {userName && (
              <p className="text-lg text-black mb-2">
                Welcome, <span className="font-semibold text-tkh-orange">{userName}</span>!
              </p>
            )}
            <p className="text-xl text-black max-w-2xl mx-auto">
              Comprehensive marketing solutions tailored to elevate your brand
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-tkh-orange mb-4">
              Our Services
            </h2>
            <p className="text-black">
              We offer a range of marketing services designed to meet your specific needs.
            </p>
          </div>

          {/* Dynamic Sections */}
          <MarketingStrategySection />
          <SocialMediaSection />
          <ReelsSection />
          <CampaignSection />

          <Card className="bg-hero-gradient text-white shadow-lg mt-10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Contact us to discuss your marketing needs and get a custom quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.open('https://wa.me/2349056979794', '_blank')}>
                  Chat on WhatsApp
                </Button>
                <Button variant="default" onClick={handleCalendlyClick}>
                  Schedule an Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-black/60">
            <p>This access link is valid for 7 days from approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
