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
  // Removed dropdown state for social media options

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
    <section className="mb-12">
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
    <section className="mb-12">
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
    <section className="mb-12">
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
    <section className="mb-12">
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
          <SocialMediaMarketingSection />
          <ConversionBasedMarketingSection />
          <ReelsSection />
          <CampaignSection />
          <TemplateKitSection />
          {/* <KreatorsSection /> */}

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
