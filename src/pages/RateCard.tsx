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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import rateCardData from '@/constants/rate-card.json';

const RateCard = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useIsMobile();

  // Shared navigation items for both mobile and desktop
  const navItems: { id: string; label: string }[] = [
    { id: 'marketing-strategy', label: 'Marketing' },
    { id: 'reels', label: 'Reel Strategy & Production' },
    { id: 'campaigns', label: 'Campaigns (Videography & Photography)' },
    { id: 'template-kit', label: 'Template Kits' },
       { id: 'kreator-activation', label: 'Kreator Activation Service' },
    { id: 'strategic-launch', label: 'Strategic Launch Kit' },
    { id: 'campaign-management', label: 'Campaign Management Service' },
    { id: 'strategic-launch-execution', label: 'Strategic Launch & Campaign Execution Kit' },

  ];

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

  const scrollToSection = (sectionId: string) => {
    // Close mobile navigation if open
    if (isMobile && isNavOpen) {
      setIsNavOpen(false);
    }
    
    // Small delay to ensure DOM is ready and nav closes
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Get the actual height of the sticky navigation element (only for desktop)
        const navigationElement = !isMobile ? document.querySelector('.sticky.top-20') : null;
        const navigationHeight = navigationElement ? navigationElement.getBoundingClientRect().height : 0;
        
        // Calculate the offset needed to account for both header and sticky navigation
        // Header height: ~80px (pt-20), plus navigation height
        const headerHeight = 80; // pt-20 = 5rem = 80px
        const offset = headerHeight + navigationHeight + 20; // Extra 20px for breathing room
        
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
          top: Math.max(0, elementPosition), // Ensure we don't scroll to negative position
          behavior: 'smooth'
        });
      }
    }, isMobile ? 150 : 10); // Longer delay for mobile to allow sheet to close
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
    <section id="marketing-strategy" className="mb-12">
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
          <DialogHeader>
            <DialogTitle>Marketing Strategy Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1 md:px-0">
            <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
              <h2 className="font-bold text-2xl mb-4">
                Terms and Conditions for Marketing Strategy Packages
              </h2>
              <ol className="list-decimal list-inside space-y-4">
                <li>
                  <strong>Scope of Work</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>
                      <strong>Deliverables depend on the package selected:</strong>
                      <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                        <li>
                          <strong>Social Media Strategy:</strong> 5–7 business days delivery
                        </li>
                        <li>
                          <strong>Digital Marketing Strategy:</strong> 7–10 business days delivery
                        </li>
                        <li>
                          <strong>Full Marketing Strategy (Social Media + Digital + Product Marketing):</strong>{' '}
                          14–18 business days delivery
                        </li>
                      </ul>
                    </li>
                    <li>
                      Strategies include detailed analysis, customer profiling, campaign ideas,
                      budgets, timelines, and KPIs for 3 months.
                    </li>
                    <li>Execution services are separate and will be quoted independently.</li>
                  </ul>
                </li>
                <li>
                  <strong>Project Timeline</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Timelines start once full payment is received and all client materials are provided.</li>
                    <li>Timely client feedback is required to keep the project on schedule.</li>
                  </ul>
                </li>
                <li>
                  <strong>Payment Terms</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>100% payment upfront is required before work begins.</li>
                    <li>The fee is non-refundable once work has commenced.</li>
                  </ul>
                </li>
                <li>
                  <strong>Strategy Fee Deduction for Execution</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>
                      If the client decides to execute the strategy with the agency within 14 days
                      of delivery, 50% of the strategy fee will be deducted from the first month’s
                      execution invoice.
                    </li>
                    <li>
                      If the client decides after 14 days, the full strategy fee will be charged in
                      addition to execution fees.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Client Decision Timeline</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Client has 14 calendar days from delivery to decide on execution.</li>
                    <li>
                      No response within 14 days will be treated as a decision not to proceed, and
                      the full strategy fee remains due.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Revisions</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Up to two rounds of revisions included, to be requested within 7 days of delivery.</li>
                    <li>Additional revisions charged separately.</li>
                  </ul>
                </li>
                <li>
                  <strong>Client Responsibilities</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>
                      Timely provision of materials, data, and feedback is expected to avoid delays.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Confidentiality</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Both parties will keep shared information confidential.</li>
                  </ul>
                </li>
                <li>
                  <strong>Cancellation and Refunds</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>No refunds after work has started.</li>
                    <li>
                      Cancellation before project commencement eligible for refund minus
                      administrative fees.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Intellectual Property</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Client owns the final deliverable after full payment.</li>
                    <li>
                      Agency may use anonymized samples for marketing unless otherwise agreed.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Limitation of Liability</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Agency does not guarantee specific outcomes from the strategy.</li>
                  </ul>
                </li>
                <li>
                  <strong>Governing Law</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>
                      Agreement governed by applicable law based on client location or mutual
                      agreement.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );

  const SocialMediaMarketingSection = () => (
    <section id="social-media" className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        {rateCardData.social_media_marketing.title}
      </h2>
      <Card className="p-3 sm:p-4 md:p-6">
        <CardHeader className="px-0 pb-2 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
            <div>
              <CardTitle className="text-lg md:text-xl font-serif break-words">{rateCardData.social_media_marketing.title}</CardTitle>
              <CardDescription className="mt-1 text-xs md:text-sm">Best for: {rateCardData.social_media_marketing.best_for}</CardDescription>
            </div>
            <p className="text-lg md:text-xl font-bold text-tkh-orange">{rateCardData.social_media_marketing.price}</p>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="inclusions">
              <AccordionTrigger className="text-xs md:text-sm">Package Inclusions</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {rateCardData.social_media_marketing.inclusions.map((inc, i) => (
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
                <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
                  <h2 className="font-bold text-2xl mb-4">
                    Terms and Conditions for Social Media Marketing Package
                  </h2>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>
                      <strong>Payment</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>The package fee of ₦750,000 is payable monthly in advance.</li>
                        <li>Payment can be made in two installments: 70% before project commencement and 30% at the beginning of the second month.</li>
                        <li>Service begins once payment is confirmed.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Contract Duration</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Minimum contract period is 3 months, renewable monthly thereafter.</li>
                        <li>Early termination before 3 months forfeits any prepaid fees.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Scope of Service</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Includes management of Instagram and TikTok accounts only.</li>
                        <li>Management of additional platforms (e.g., LinkedIn, Facebook) requires extra payment.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Content Creation</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Content is created using client-provided assets or generic sources.</li>
                        <li>The agency does not provide locations, models, or talent; clients must arrange and cover these costs.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Campaigns & Influencers</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Basic influencer outreach included; influencer fees billed separately.</li>
                        <li>Paid advertising budgets and management fees are separate and based on client goals.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Reporting & Communication</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Monthly performance reports provided.</li>
                        <li>Weekly strategy sessions to review and optimize campaigns.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Client Responsibilities</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Timely feedback and content approvals required.</li>
                        <li>Client provides all brand assets and coordinates any shoot logistics.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Ads & Visibility</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Paid ads recommended to boost reach; budgets and management are separate.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Additional Services</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Extra services or platforms beyond this package incur additional fees.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );

  const ConversionBasedMarketingSection = () => (
    <section id="conversion-marketing" className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        {rateCardData.conversion_based_marketing_strategy.title}
      </h2>
      <Card className="p-3 sm:p-4 md:p-6">
        <CardHeader className="px-0 pb-2 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
            <div>
              <CardTitle className="text-lg md:text-xl font-serif break-words">{rateCardData.conversion_based_marketing_strategy.title}</CardTitle>
              <CardDescription className="mt-1 text-xs md:text-sm">Best for: {rateCardData.conversion_based_marketing_strategy.best_for}</CardDescription>
            </div>
            <p className="text-lg md:text-xl font-bold text-tkh-orange">{rateCardData.conversion_based_marketing_strategy.price}</p>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="inclusions">
              <AccordionTrigger className="text-xs md:text-sm">Package Inclusions</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {rateCardData.conversion_based_marketing_strategy.inclusions.map((inc, i) => (
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
                <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
                  <h2 className="font-bold text-2xl mb-4">
                    Terms and Conditions for Conversion-Based Marketing Strategy Package
                  </h2>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>
                      <strong>Monthly Fee</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>₦1,500,000 per month.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Contract Duration</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Minimum 6-month commitment.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Client-Managed Costs</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Client covers ad spend and influencer partnership fees.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Service Scope</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>No models or shoot locations provided; sourcing billed separately.</li>
                        <li>Additional platforms (e.g., LinkedIn, YouTube) incur extra fees.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Recommendations</strong>
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>Monthly paid ad campaigns strongly recommended for optimal results.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );

  const ReelsSection = () => (
    <section id="reels" className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        Reel Strategy & Production
      </h2>

      {/* General Reel Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fashion Brand Reels */}
      <Card className="p-6 mt-8">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-serif">Fashion Brand Reel Creation</CardTitle>
          <CardDescription className="text-base">
            Premium content creation tailored to showcase your fashion pieces effectively on social media. 
            All content is professionally directed and edited.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-6">
          <div className="space-y-8">
            {/* Phone Shot Packages */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                Phone Shot Packages 
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  Shot with high-quality smartphones
                </span>
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Package 1</h4>
                    <span className="text-tkh-orange font-bold">₦250,000</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-tkh-orange">•</span>
                      <span>5 Professional Videos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-tkh-orange">•</span>
                      <span>Up to 10 outfits included</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-tkh-orange">•</span>
                      <span>Additional outfits charged separately</span>
                    </li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Package 2</h4>
                    <span className="text-tkh-orange font-bold">₦500,000</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-tkh-orange">•</span>
                      <span>10 Professional Videos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-tkh-orange">•</span>
                      <span>Up to 15–20 outfits included</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-tkh-orange">•</span>
                      <span>Additional outfits charged separately</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Camera Shot Package */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                Camera Shot Package
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  Shot with a professional camera for elevated quality
                </span>
              </h3>
              <div className="border rounded-lg p-4 max-w-md">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Premium Package</h4>
                  <span className="text-tkh-orange font-bold">₦600,000</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-tkh-orange">•</span>
                    <span>5 Professional Videos</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-tkh-orange">•</span>
                    <span>Custom styling and direction</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-tkh-orange">•</span>
                    <span>Best for premium or campaign content</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Custom Projects */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Campaigns & Custom Projects</h3>
              <p className="text-muted-foreground">
                Need a full campaign or something beyond reels? We offer custom packages tailored to 
                your specific needs and deliverables. Let's create something iconic together.
              </p>
            </div>

            {/* Important Notes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold mb-3">Important Notes</h4>
              <div className="text-sm space-y-2">
                <p className="font-medium">Outfit Limits:</p>
                <ul className="space-y-1">
                  <li className="flex gap-2">
                    <span className="text-tkh-orange">•</span>
                    <span>5-video package – maximum 10 outfits</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-tkh-orange">•</span>
                    <span>10-video package – maximum 15–20 outfits</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-tkh-orange">•</span>
                    <span>Any additional pieces beyond the limits will attract an <strong>extra charge</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <div className="mt-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="terms">
            <AccordionTrigger className="text-xs md:text-sm">Terms & Conditions</AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
                <h2 className="font-bold text-2xl mb-4">
                  Terms and Conditions for Reel Strategy & Production Service
                </h2>
                <ol className="list-decimal list-inside space-y-4">
                  <li>
                    <strong>Advance Payment</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Full payment required before the shoot session.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Minimum Booking</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Minimum of 5 reels per shoot session.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Shoot Session</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>All reels filmed in a single session; no separate shoot days.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Models & Talent</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Client must provide models; sourcing by agency billed separately.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Props & Locations</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Wardrobe, props, and special locations are not included.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Deliverables</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Final reels delivered ready-to-post; client handles publishing.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );

  const CampaignSection = () => (
    <section id="campaigns" className="mb-12">
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
            <div className="max-h-[60vh] overflow-y-auto px-1 md:px-0">
              <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
                <h2 className="font-bold text-2xl mb-4">
                  Terms and Conditions for Video & Photography Campaign Shoot
                </h2>
                <ol className="list-decimal list-inside space-y-4">
                  <li>
                    <strong>Scope of Work</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>₦500,000 covers campaign concept, shoot plan, and activation strategy; execution quoted separately.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Timeline</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Strategy phase: 7–10 business days.</li>
                      <li>Shoot execution timeline provided after sign-off and payment.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Payment Terms</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Strategy fee of ₦500,000 is 100% upfront and non-refundable once work begins.</li>
                      <li>Production fees: 70% upfront, 30% upon content delivery.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Strategy Fee Deduction</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>If shoot is executed within 14 days of strategy delivery, ₦150,000 will be deducted from production fee.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Client Responsibilities</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Provide timely approvals, brand assets, and feedback to avoid delays.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Revisions</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>One round of revision per asset included; additional edits billed separately.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Cancellation & Refunds</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Cancellations before production incur up to 30% fee; no refunds once production begins.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Intellectual Property</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Client owns final edited photos and videos upon full payment; agency may use select visuals for portfolio unless agreed otherwise.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Limitation of Liability</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Agency ensures high-quality production but does not guarantee performance metrics like reach or conversions.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );

  const TemplateKitSection = () => (
    <section id="template-kit" className="mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
        Template Kits
      </h2>
      <div className="grid gap-6 md:gap-8">
        {rateCardData.template_kits.map((kit, index) => (
          <Card key={index} className="border-border p-3 sm:p-4 md:p-6">
            <CardHeader className="px-0 pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl font-serif break-words">{kit.title}</CardTitle>
              <CardDescription className="text-xs md:text-sm mt-1">{kit.duration}</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-0">
                  <h4 className="text-base md:text-lg font-semibold break-words">{kit.title}</h4>
                  <div className="text-right sm:text-left">
                    <p className="text-lg md:text-xl font-bold text-tkh-orange">{kit.price}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {kit.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start text-xs md:text-sm">
                      <span className="text-tkh-orange mr-2">•</span><span className="break-words">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="terms">
            <AccordionTrigger className="text-xs md:text-sm">Terms & Conditions</AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
                <h2 className="font-bold text-2xl mb-4">
                  Terms and Conditions for Template Kits
                </h2>
                <ol className="list-decimal list-inside space-y-4">
                  <li>
                    <strong>Payment</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Full payment is required upfront to access the template kits.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Access Duration</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Access to the template kits is granted for 30 days from the date of purchase.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Usage Rights</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Templates are for personal use only and cannot be resold or redistributed.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Modification</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Templates can be modified to fit your personal brand, but the original files remain the property of The Kontent Hub.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Support</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Email support is available for 30 days post-purchase for any template-related queries.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Refunds</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Due to the digital nature of the product, refunds are not available once the purchase is complete.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
      <div className="pt-20">
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

          {/* Mobile Navigation - Fixed Button */}
          {isMobile ? (
            <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="fixed bottom-6 right-6 z-50 shadow-lg bg-white border-2 border-tkh-purple hover:bg-tkh-purple hover:text-white"
                  size="sm"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Navigate to Section</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-4">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="w-full text-left px-4 py-3 bg-white border border-tkh-orange text-tkh-orange rounded-lg hover:bg-tkh-orange hover:text-white transition-colors text-sm"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
          ) : (
            /* Desktop Navigation - Collapsible */
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="fixed top-24 right-6 z-50 shadow-lg bg-white border-2 border-tkh-purple hover:bg-tkh-purple hover:text-white mb-8"
                  size="sm"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Quick Navigation
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigate to Section</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-3">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left px-4 py-3 bg-white border border-tkh-orange text-tkh-orange rounded hover:bg-tkh-orange hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Main Content */}
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
          <SocialMediaMarketingSection />
          <ConversionBasedMarketingSection />
          <ReelsSection />
          <CampaignSection />
          <TemplateKitSection />
          
          {/* Kreator Activation Service */}
          <section id="kreator-activation" className="mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
              Kreator Activation Service
            </h2>
            <Card className="p-6">
              <CardHeader className="px-0">
                  <CardDescription className="text-base">
                    Our Creator Activation service helps brands leverage the power of <strong>talented content creators</strong> to produce <strong>authentic, high-performing content</strong> that drives engagement, awareness, and conversions. We manage the <strong>entire process</strong>—from strategy and creator scouting to campaign execution and reporting—so your brand gets <strong>measurable results</strong> without the hassle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pt-6 space-y-8">
                  {/* What We Do Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">What We Do:</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <div>
                          <span className="font-medium">Strategic Planning:</span> We design <strong>data-driven campaigns</strong> aligned with your brand goals, audience, and product.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <div>
                          <span className="font-medium">Creator Scouting:</span> We identify and onboard the <strong>perfect creators</strong> for your niche and target audience.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <div>
                          <span className="font-medium">Campaign Execution:</span> From content briefs to approvals, we manage <strong>every step</strong> of the production process.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <div>
                          <span className="font-medium">Content Delivery:</span> Creators produce <strong>professional-grade</strong> Reels, TikToks, photos, and other content assets ready for posting.
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <div>
                          <span className="font-medium">Performance Tracking:</span> We provide <strong>comprehensive reports</strong> on reach, engagement, and overall campaign insights.
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Why Choose Us Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Why Choose Us:</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <span>We work <strong>exclusively with creators</strong>, ensuring authentic and relatable content rather than generic influencer shoutouts.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <span>Our campaigns are <strong>results-driven</strong>, designed to maximize ROI for your brand.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-tkh-orange font-bold">•</span>
                        <span><strong>Full-service management</strong> saves your team time and effort while delivering professional content.</span>
                      </li>
                    </ul>
                  </div>                {/* Service Tiers */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Tiers</h3>
                  <p className="text-muted-foreground mb-6">(We can adjust based on client budget)</p>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Starter Tier */}
                    <Card className="p-4">
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg">Starter Activation</CardTitle>
                        <CardDescription className="text-lg font-bold text-tkh-orange">₦1M – ₦1.5M</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-2">
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>3–4 micro-creators</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>2–3 campaign content pieces (Reels, TikToks, Posts)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Campaign strategy + execution</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Performance report (reach, engagement, conversions)</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Growth Tier */}
                    <Card className="p-4">
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg">Growth Activation</CardTitle>
                        <CardDescription className="text-lg font-bold text-tkh-orange">₦3M – ₦5M</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-2">
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Mix of macro, micro & nano creators (6–10 total)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Campaign content pack (video series, reels, carousel posts)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Campaign management + influencer negotiations</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>End-to-end reporting with insights + recommendations</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Premium Tier */}
                    <Card className="p-4">
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg">Premium Brand Activation</CardTitle>
                        <CardDescription className="text-lg font-bold text-tkh-orange">₦10M+</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-2">
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>1–2 macro/celebrity influencers + 10+ micro creators</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Multi-platform campaign (IG, TikTok)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Dedicated campaign manager</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Live event/PR activation add-on (optional)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-tkh-orange">•</span>
                            <span>Full post-campaign analytics report</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-8">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="terms">
                      <AccordionTrigger className="text-xs md:text-sm">Terms & Conditions</AccordionTrigger>
                      <AccordionContent>
                        <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
                          <h2 className="font-bold text-2xl mb-4">
                            Terms and Conditions for Kreator Activation Service
                          </h2>
                          <ol className="list-decimal list-inside space-y-4">
                            {/* Payment Terms */}
                            <li>
                              <strong>Payment Terms</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>100% upfront payment is required before campaign commencement. ✅</li>
                              </ul>
                            </li>

                            {/* Creator Selection & Availability */}
                            <li>
                              <strong>Creator Selection & Availability</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>We maintain exclusive partnerships with our creator network for authentic content creation.</li>
                                <li>Creator availability and pricing are subject to change until final booking confirmation.</li>
                                <li>We provide 2 alternative options if a creator becomes unavailable.</li>
                              </ul>
                            </li>

                            {/* Campaign Timeline */}
                            <li>
                              <strong>Campaign Timeline & Delivery</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Campaign execution begins within 7 working days of payment confirmation.</li>
                                <li>Content delivery schedule will be provided in the campaign brief.</li>
                                <li>Performance report delivered within 7 working days of campaign completion.</li>
                              </ul>
                            </li>

                            {/* Content Rights */}
                            <li>
                              <strong>Content Rights & Usage</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Brands can reshare creator content on their channels for 30 days.</li>
                                <li>Extended usage rights for paid ads, print, or billboards require additional licensing.</li>
                                <li>Content cannot be edited or modified without prior approval.</li>
                              </ul>
                            </li>

                            {/* Cancellation Policy */}
                            <li>
                              <strong>Cancellation & Refunds</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Cancellation within 7 days of kickoff: 50% non-refundable.</li>
                                <li>No refunds available after creator booking (rescheduling possible).</li>
                              </ul>
                            </li>

                            {/* Performance & Results */}
                            <li>
                              <strong>Performance & Results</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>We guarantee high-quality content delivery and comprehensive reporting.</li>
                                <li>Actual performance metrics (reach, engagement, conversions) may vary based on market factors.</li>
                                <li>We maintain transparent communication throughout the campaign.</li>
                              </ul>
                            </li>

                            {/* Quality Assurance */}
                            <li>
                              <strong>Quality Assurance</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>All content undergoes professional review before delivery.</li>
                                <li>One round of revisions included; additional revisions may incur extra charges.</li>
                              </ul>
                            </li>

                            {/* Confidentiality */}
                            <li>
                              <strong>Confidentiality</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>We maintain strict confidentiality of all brand information.</li>
                                <li>Campaign details remain private unless mutual agreement for public sharing.</li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Strategic Launch Kit */}
          <section id="strategic-launch" className="mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">
              Strategic Launch Kit
            </h2>
            <Card className="p-6">
              <CardHeader className="px-0">
                <CardDescription className="text-base">
                  Our Strategic Launch Kits are designed for entrepreneurs, small businesses, and established brands who want to launch or relaunch their products with clarity, consistency, and impact. <strong>We provide a complete roadmap and the creative assets you need to confidently introduce your brand to your audience.</strong> From strategy and brand guidelines to product/label design, social media assets, and optional influencer guidance, we ensure your launch is professional, cohesive, and designed to get results.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Who it’s for</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Entrepreneurs launching their first product</li>
                    <li>Small to medium businesses expanding their product line</li>
                    <li>Established brands seeking a high-end, multi-product launch</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Packages</h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="p-4">
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg">Standard Launch &amp; Branding Kit</CardTitle>
                        <CardDescription className="text-lg font-bold text-tkh-orange">₦800,000</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-2">
                          <li><strong>Strategic Launch Plan / Marketing Plan</strong></li>
                          <li><strong>Brand Guidelines</strong> (visual identity, brand voice)</li>
                          <li><strong>Product/Label Design</strong> for up to 3 products</li>
                          <li>Basic consultation &amp; 2 rounds of revisions</li>
                          <li className="text-sm text-muted-foreground">Delivery: 25–30 days</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="p-4">
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg">Growth Launch &amp; Branding Kit</CardTitle>
                        <CardDescription className="text-lg font-bold text-tkh-orange">₦1,000,000 – ₦1,200,000</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-2">
                          <li><strong>Strategic Launch Plan / Marketing Plan</strong></li>
                          <li><strong>Brand Guidelines</strong> (visual identity, messaging)</li>
                          <li><strong>Product/Label Design</strong> for 4–6 products</li>
                          <li>Full consultation + 3 rounds of revisions</li>
                          <li className="text-sm text-muted-foreground">Delivery: 30–35 days</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="p-4">
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg">Premium Launch &amp; Branding Kit</CardTitle>
                        <CardDescription className="text-lg font-bold text-tkh-orange">₦1,500,000+</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-2">
                          <li><strong>Comprehensive Brand Guidelines</strong> &amp; Product/Label Design for 6+ products</li>
                          <li>Full consultation + unlimited revisions</li>
                          <li><strong>Social media assets</strong> + campaign guidance</li>
                          <li className="text-sm text-muted-foreground">Delivery: 35–45 days</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Campaign Management Service */}
          <section id="campaign-management" className="mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">Campaign Management Service</h2>
            <Card className="p-6">
              <CardHeader className="px-0">
                <CardDescription className="text-base">Whether it’s a relaunch, product launch, seasonal promo, or brand awareness drive — we design and manage end-to-end campaigns that deliver visibility, engagement, and growth.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-6 space-y-4">
                <h3 className="text-lg font-semibold">What You Get</h3>

                <h4 className="font-semibold">1. <strong>Campaign Strategy &amp; Direction</strong> <span className="text-sm text-muted-foreground">(Duration: 2–3 weeks)</span></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Full campaign plan (pre-launch → launch → post-campaign).</li>
                  <li>Messaging, creative direction &amp; audience targeting.</li>
                  <li>Playbook your internal team can execute daily.</li>
                </ul>

                <h4 className="font-semibold">2. <strong>Content Strategy &amp; Assets</strong> <span className="text-sm text-muted-foreground">(Duration: 4–8 weeks depending on scope)</span></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Complete campaign-focused content calendar.</li>
                  <li>Professionally designed graphics, reels &amp; video.</li>
                  <li>Copywriting for posts, ads, email &amp; SMS.</li>
                  <li>Branded templates for ongoing use.</li>
                </ul>

                <h4 className="font-semibold">3. <strong>Paid Media (Ads Management)</strong> <span className="text-sm text-muted-foreground">(Ongoing throughout campaign)</span></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Targeted ads on Facebook, Instagram &amp; Google.</li>
                  <li>Retargeting for warm audiences.</li>
                  <li>Weekly optimization to maximize ROI.</li>
                </ul>

                <p className="font-medium">Please Note:</p>
                <p><strong>Ad spend is not included</strong> and will be based on the client’s budget.</p>

                <h4 className="font-semibold mt-4">4. <strong>Influencer &amp; Creator Partnerships</strong> <span className="text-sm text-muted-foreground">(Duration: 6–10 weeks depending on tier)</span></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Partnerships with lifestyle, beauty, wellness &amp; niche creators.</li>
                  <li>Influencer-generated content, reviews &amp; shoutouts.</li>
                  <li>Tracking performance (reach, engagement, conversions).</li>
                </ul>

                <h4 className="font-semibold">5. <strong>Email &amp; SMS Marketing</strong> <span className="text-sm text-muted-foreground">(Duration: 2–4 weeks per campaign cycle)</span></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Announcement campaigns.</li>
                  <li>Exclusive offers &amp; loyalty promos.</li>
                  <li>Automated follow-up flows.</li>
                </ul>

                <h4 className="font-semibold">6. <strong>Analytics &amp; Reporting</strong> <span className="text-sm text-muted-foreground">(Weekly &amp; Final Report)</span></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Weekly updates on performance.</li>
                  <li>End-of-campaign report with reach, engagement, leads, bookings &amp; ROI.</li>
                  <li>Actionable recommendations for the next campaign.</li>
                </ul>

                <h3 className="text-lg font-semibold">Packages &amp; Pricing</h3>
                <h4 className="font-semibold">Essential Campaign (₦1.5M – ₦2.5M / 6 weeks)</h4>
                <p>For small/medium brands who want structure, content, and ads.</p>

                <h4 className="font-semibold">Growth Campaign (₦3M – ₦5M / 8–10 weeks)</h4>
                <p>For brands ready to scale visibility and drive conversions.</p>

                <h4 className="font-semibold">Dominance Campaign (₦6M – ₦8M+ / 10–12 weeks)</h4>
                <p>For established/luxury brands looking to own their category.</p>

                <h3 className="text-lg font-semibold">The Outcome</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Buzz &amp; visibility around your campaign.</li>
                  <li>Premium, consistent content that excites audiences.</li>
                  <li>Conversions: more bookings, sales, or sign-ups.</li>
                  <li>Influencer/community-driven trust &amp; credibility.</li>
                  <li>A clear understanding of what drives your growth.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Strategic Launch & Campaign Execution Kit */}
          <section id="strategic-launch-execution" className="mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-black mb-4 md:mb-6 px-2 md:px-0">Strategic Launch &amp; Campaign Execution Kit</h2>
            <Card className="p-6">
              <CardContent className="px-0 pt-6 space-y-4">
                <p><strong>Who it’s for:</strong><br />Entrepreneurs, small businesses, and brands ready to launch or promote products/services on social media with a <strong>clear strategy and full execution support</strong>.</p>

                <h3 className="text-lg font-semibold">What’s Included</h3>

                <h4 className="font-semibold">1. <strong>Strategy &amp; Planning</strong></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Marketing Plan:</strong> Define target audience, goals, platforms, and success metrics.</li>
                  <li><strong>Launch Plan:</strong> Step-by-step pre-launch → launch → post-launch roadmap.</li>
                  <li><strong>Brand Guidelines:</strong> Visual identity, logo, colors, fonts, and messaging.</li>
                  <li><strong>Social Media Strategy:</strong> Platform-specific content, posting schedule, growth tactics.</li>
                  <li><strong>Budget Breakdown:</strong> Ads, content, and tools allocation for maximum ROI.</li>
                </ul>

                <h4 className="font-semibold">2. <strong>Content Creation &amp; Campaign Assets</strong></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Professional photoshoot &amp; product visuals.</li>
                  <li>Reels, short videos, and campaign graphics.</li>
                  <li>Product/label design included (number of products depends on package).</li>
                </ul>

                <h4 className="font-semibold">3. <strong>Influencer &amp; Creator Activation</strong></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Collaborations with micro, mid-tier, or top-tier creators depending on package.</li>
                  <li>Influencer-generated content and reviews to build awareness.</li>
                  <li>Tracking performance metrics (reach, engagement, conversions).</li>
                </ul>

                <h4 className="font-semibold">4. <strong>Paid Media &amp; Marketing Support</strong></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Ads strategy and targeted campaigns on Facebook, Instagram, and other relevant platforms.</li>
                  <li>Retargeting and optimization to maximize ROI.</li>
                  <li>Optional email/SMS marketing if the client has a database.</li>
                </ul>

                <p className="font-medium">Please Note:</p>
                <p><strong>Ad spend is not included</strong> and will be based on the client’s budget.</p>

                <h4 className="font-semibold">5. <strong>Analytics &amp; Reporting</strong></h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Weekly campaign updates.</li>
                  <li>Full end-of-campaign report with insights and recommendations.</li>
                </ul>

                <h3 className="text-lg font-semibold">Packages &amp; Pricing</h3>
                <h4 className="font-semibold">1. Essential Launch &amp; Campaign Kit – ₦1.5M – ₦2.5M</h4>
                <ul className="list-disc list-inside space-y-2 mb-2">
                  <li>Strategy + brand guidelines</li>
                  <li>Content creation: photos/reels</li>
                  <li>1–3 micro-influencer activations</li>
                  <li>Paid media guidance</li>
                  <li>Duration: 4–6 weeks</li>
                </ul>

                <h4 className="font-semibold">2. Growth Launch &amp; Campaign Kit – ₦3M – ₦5M</h4>
                <ul className="list-disc list-inside space-y-2 mb-2">
                  <li>Full strategy &amp; brand guidelines</li>
                  <li>Content creation: 5–10 photos/reels/videos</li>
                  <li>3–5 mid-tier influencer collaborations</li>
                  <li>Paid media management &amp; optimization</li>
                  <li>Duration: 6–8 weeks</li>
                </ul>

                <h4 className="font-semibold">3. Premium Launch &amp; Campaign Kit – ₦6M – ₦8M+</h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Complete strategy + comprehensive brand guidelines</li>
                  <li>High-volume content creation (photos, reels, lifestyle videos)</li>
                  <li>Product/label design for multiple products</li>
                  <li>5+ top-tier influencer activations</li>
                  <li>Paid media + email/SMS marketing support</li>
                  <li>Duration: 8–12 weeks</li>
                </ul>

                <h3 className="text-lg font-semibold">Why Clients Love This Kit</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Combines <strong>strategy + execution</strong> — they don’t just get a plan, they get it implemented.</li>
                  <li>Covers <strong>all aspects of a launch/campaign</strong>: content, branding, influencers, ads, reporting.</li>
                  <li>Flexible tiers allow businesses to scale according to <strong>budget and goals</strong>.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

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
