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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import rateCardData from '@/constants/rate-card.json';

const RateCard = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState(rateCardData.social_media_management.options[0].option);
  const selectedOptionLabel = rateCardData.social_media_management.options.find(opt => opt.option === selectedOption)?.option.replace('Option ', '') || '';

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
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        Marketing Strategy Packages
      </h2>
      <div className="grid gap-6 md:gap-8">
        {rateCardData.marketing_strategy_packages.map((package_, index) => (
          <Card key={index} className="border-border p-3 sm:p-4 md:p-6">
            <CardHeader className="px-0 pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl font-serif break-words">{package_.title}</CardTitle>
              {package_.description && <CardDescription className="text-xs md:text-sm mt-1">{package_.description}</CardDescription>}
            </CardHeader>
            <CardContent className="px-0">
              <Tabs defaultValue={package_.variants[0].market} className="w-full">
                <TabsList className="mb-3 md:mb-4 flex flex-wrap gap-2">
                  {package_.variants.map((variant, vIndex) => (
                    <TabsTrigger key={vIndex} value={variant.market} className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-2">
                      {variant.market}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {package_.variants.map((variant, vIndex) => (
                  <TabsContent key={vIndex} value={variant.market} className="pt-1">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-0">
                        <h4 className="text-base md:text-lg font-semibold break-words">{variant.market}</h4>
                        <div className="text-right sm:text-left">
                          <p className="text-lg md:text-xl font-bold text-tkh-orange">{variant.price}</p>
                          {variant.duration && (
                            <p className="text-xs md:text-sm text-gray-600">{variant.duration}</p>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {variant.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start text-xs md:text-sm">
                            <span className="text-tkh-orange mr-2">•</span><span className="break-words">{inc}</span>
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
          <Button variant="outline" className="mt-4 w-full sm:w-auto text-xs md:text-sm">View Terms & Conditions</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-md md:max-w-2xl">
          <DialogHeader><DialogTitle>Marketing Strategy Terms & Conditions</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2 text-xs md:text-sm px-1 md:px-0">
            {rateCardData.marketing_strategy_terms.map((term, index) => (
              <p key={index} className="text-justify leading-relaxed">{term}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );

  const SocialMediaSection = () => (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        Social Media Marketing
      </h2>
      {/* Mobile-friendly dropdown for Social Media Marketing options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mb-4 w-full sm:w-auto text-xs md:text-sm flex justify-between items-center">
            {selectedOptionLabel}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full min-w-[180px]">
          {rateCardData.social_media_management.options.map((opt, idx) => (
            <DropdownMenuItem
              key={opt.option}
              onSelect={() => setSelectedOption(opt.option)}
              className={selectedOption === opt.option ? 'bg-tkh-orange text-white' : ''}
            >
              {opt.option.replace('Option ', '')}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Show selected option's details */}
      {rateCardData.social_media_management.options.filter(opt => opt.option === selectedOption).map((opt, idx) => (
        <Card key={opt.option} className="p-3 sm:p-4 md:p-6">
          <CardHeader className="px-0 pb-2 md:pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
              <div>
                <CardTitle className="text-lg md:text-xl font-serif break-words">{opt.option.replace('Option ', '')}</CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">Best for: {opt.best_for}</CardDescription>
              </div>
              <p className="text-lg md:text-xl font-bold text-tkh-orange">{opt.price}</p>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Accordion type="single" collapsible>
              <AccordionItem value="inclusions">
                <AccordionTrigger className="text-xs md:text-sm">Package Inclusions</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {opt.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start text-xs md:text-sm">
                        <span className="text-tkh-orange mr-2">•</span><span className="break-words">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="terms">
                <AccordionTrigger className="text-xs md:text-sm">Terms & Conditions</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {opt.terms.map((term, i) => (
                      <li key={i} className="flex items-start text-xs md:text-sm">
                        <span className="text-tkh-orange mr-2">•</span><span className="break-words">{term}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </section>
  );

  const ReelsSection = () => (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        Reel Strategy & Production
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rateCardData.reel_strategy_production.variants.map((variant, i) => (
          <Card key={i} className="p-3 sm:p-4 md:p-6">
            <CardHeader className="px-0 pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg font-serif break-words">{variant.type}</CardTitle>
              <p className="text-lg md:text-xl font-bold text-tkh-orange">{variant.price}</p>
            </CardHeader>
            <CardContent className="px-0">
              <ul className="space-y-2">
                {variant.inclusions?.map((inc, j) => (
                  <li key={j} className="flex items-start text-xs md:text-sm">
                    <span className="text-tkh-orange mr-2">•</span><span className="break-words">{inc}</span>
                  </li>
                ))}
              </ul>
              {variant.terms && (
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="terms">
                    <AccordionTrigger className="text-xs md:text-sm">Terms</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {variant.terms.map((term, j) => (
                          <li key={j} className="flex items-start text-xs md:text-sm">
                            <span className="text-tkh-orange mr-2">•</span><span className="break-words">{term}</span>
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
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        Campaign Shoots
      </h2>
      <div className="space-y-6">
        {rateCardData.campaign_shoot.steps.map((step, i) => (
          <Card key={i} className="p-3 sm:p-4 md:p-6">
            <CardHeader className="px-0 pb-2 md:pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
                <CardTitle className="text-lg md:text-xl font-serif break-words">{step.phase}</CardTitle>
                <p className="text-lg md:text-xl font-bold text-tkh-orange">{step.price || `From ${step.price_from}`}</p>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <ul className="space-y-2">
                {step.inclusions?.map((inc, j) => (
                  <li key={j} className="flex items-start text-xs md:text-sm">
                    <span className="text-tkh-orange mr-2">•</span><span className="break-words">{inc}</span>
                  </li>
                ))}
              </ul>
              {step.location_coverage && (
                <div className="mt-4">
                  <p className="font-semibold mb-2 text-xs md:text-sm">Available Locations:</p>
                  <div className="flex flex-wrap gap-2">
                    {step.location_coverage.map((loc, k) => (
                      <Badge key={k} variant="secondary" className="text-xs md:text-sm px-2 py-1">{loc}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto text-xs md:text-sm">View Campaign Terms</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs sm:max-w-md md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Campaign Shoot Terms & Conditions</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 text-xs md:text-sm px-1 md:px-0">
              {rateCardData.campaign_shoot.terms.map((term, i) => (
                <p key={i} className="text-justify leading-relaxed">{term}</p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );

  const KreatorsSection = () => (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        {rateCardData.tkh_kreators.title}
      </h2>
      <Card className="p-3 sm:p-4 md:p-6">
        <CardHeader className="px-0 pb-2 md:pb-4">
          {/* Removed duplicate CardTitle for accessibility and linter compliance */}
          <CardDescription className="text-xs md:text-sm mb-2">{rateCardData.tkh_kreators.description}</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="mb-4">
            <h3 className="font-semibold text-tkh-orange text-base md:text-lg mb-2">💼 Package Investment</h3>
            <ul className="space-y-2">
              {rateCardData.tkh_kreators.investments.map((inv, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm">
                  <span className="font-semibold mr-2">{inv.type}:</span>
                  <span className="text-tkh-orange font-bold">{inv.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="terms">
              <AccordionTrigger className="text-xs md:text-sm">📌 Terms & Conditions</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {rateCardData.tkh_kreators.terms.map((term, i) => (
                    <li key={i} className="flex items-start text-xs md:text-sm">
                      <span className="text-tkh-orange mr-2">•</span><span className="break-words">{term}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-4 text-xs md:text-sm text-black/80 italic">
            {rateCardData.tkh_kreators.note}
          </div>
        </CardContent>
      </Card>
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
          <KreatorsSection />

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
            <p>This access link is valid for 72 hours from approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
