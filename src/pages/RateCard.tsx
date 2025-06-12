
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RateCard = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const { data, error } = await supabase.rpc('validate_rate_card_token', {
        token_input: token
      });

      if (error) throw error;

      if (data?.valid) {
        setIsValidToken(true);
        setUserName(data.full_name || "User");
        
        // Mark token as accessed
        await supabase.rpc('mark_token_as_accessed', {
          token_input: token
        });
        
        toast({
          title: "Access Granted",
          description: "Welcome to The Kontent Hub rate card!",
        });
      } else {
        setIsValidToken(false);
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      setIsValidToken(false);
    }
  };

  if (isValidToken === null) {
    return (      <div className="min-h-screen bg-input flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ring border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Validating access...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (      <div className="min-h-screen bg-input flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✗</span>
          </div>
          <h1 className="text-2xl font-montserrat font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-white/80 mb-6">
            Sorry, this access link has expired or is invalid. Please request a new access link.
          </p>
          <a 
            href="/" 
            className="inline-block bg-ring text-input px-6 py-3 rounded-lg font-montserrat font-semibold hover:bg-ring/90 transition-colors"
          >
            Request New Access
          </a>
        </div>
      </div>
    );
  }

  const packages = [
    {
      category: "Social Media Strategy",
      items: [
        {
          market: "Nigeria Only",
          price: "₦300,000",
          description: "3-month social media plan tailored to Nigeria",
          includes: [
            "Audience & competitor analysis",
            "Platform-specific content themes",
            "Hashtag & engagement strategy",
            "Campaign calendar & analytics setup"
          ]
        },
        {
          market: "USA Only",
          price: "$250",
          description: "3-month social media plan tailored to USA",
          includes: [
            "Audience & competitor analysis",
            "Platform-specific content themes",
            "Hashtag & engagement strategy",
            "Campaign calendar & analytics setup"
          ]
        },
        {
          market: "Nigeria + USA",
          price: "$500 / ₦800,000",
          description: "Combined strategy for dual markets",
          includes: [
            "Market-specific audience analysis",
            "Dual-platform content themes",
            "Regional hashtag strategies",
            "Integrated campaign calendar"
          ]
        }
      ]
    },
    {
      category: "Digital Marketing Strategy",
      items: [
        {
          market: "Nigeria Only",
          price: "₦500,000",
          description: "3-month digital marketing plan",
          includes: [
            "SEO strategy & recommendations",
            "Paid ads strategy (Google, Facebook, etc.)",
            "Email marketing plan & automation",
            "Multi-channel budget & KPI framework",
            "Campaign ideas & timelines"
          ]
        },
        {
          market: "USA Only",
          price: "$350",
          description: "3-month digital marketing plan",
          includes: [
            "SEO & SEM strategy",
            "Paid ad campaigns",
            "Email & automation workflows",
            "Multi-channel budget & KPIs",
            "Campaign roadmap & schedule"
          ]
        },
        {
          market: "Nigeria + USA",
          price: "$700 / ₦800,000",
          description: "Integrated 3-month plan",
          includes: [
            "Market-specific SEO/SEM & paid ads",
            "Email marketing & automation for both markets",
            "Multi-channel budgets & KPIs per market",
            "Campaign calendar per market"
          ]
        }
      ]
    },
    {
      category: "All-in-One Marketing Strategy",
      items: [
        {
          market: "Nigeria Only",
          price: "₦1,000,000",
          description: "Complete 3-month marketing package",
          includes: [
            "Social Media Strategy: content themes, engagement, campaigns",
            "Digital Marketing: SEO, PPC, email, paid ads, budgets & KPIs",
            "Product Marketing: positioning, messaging, personas, GTM, pricing, sales enablement"
          ]
        },
        {
          market: "USA Only",
          price: "$800",
          description: "Complete 3-month marketing package",
          includes: [
            "Social Media Strategy for USA audience",
            "Digital Marketing Strategy: paid ads, email, SEO, multi-channel plans",
            "Product Marketing: USA-specific positioning, competitive analysis, GTM, pricing, sales enablement"
          ]
        },
        {
          market: "Nigeria + USA",
          price: "$1,200 / ₦1,600,000",
          description: "Fully integrated dual-market strategy",
          includes: [
            "Market-specific social, digital, and product marketing plans",
            "Detailed audience profiling & campaign calendar per market",
            "Multi-channel paid ads & email marketing strategies",
            "Dual-market GTM & sales enablement"
          ]
        }
      ]
    }
  ];

  const managementPackages = [
    {
      title: "Social Media Management Package",
      price: "₦750,000/month",
      description: "Complete social media management with dedicated support",
      includes: [
        "Dedicated Social Media Manager (daily activities, brand consistency, client communication)",
        "Platform Management (Instagram & TikTok: posting, monitoring, engagement)",
        "Daily response to comments, DMs, reviews",
        "Monthly content calendar (posts, stories, campaigns)",
        "Visually engaging assets (photos, graphics, captions)",
        "Custom hashtag strategy",
        "Community Management (prompt responses, sentiment monitoring)",
        "Campaign Management (monthly campaigns, giveaways, promotions; basic influencer outreach)",
        "Analytics & Reporting (monthly report: engagement, growth, reach, insights; recommendations)",
        "Weekly Strategy Sessions (calls to review, brainstorm, refine)"
      ],
      terms: [
        "Payment: ₦750,000 monthly in advance (70% upfront, 30% at month two)",
        "Contract: Minimum 3 months; early termination forfeits prepaid fees",
        "Scope: Instagram & TikTok only; additional platforms extra cost",
        "Client provides assets; agency does not supply talent or location"
      ]
    },
    {
      title: "Conversion-Based Marketing Strategy",
      price: "₦1,500,000/month",
      description: "Advanced marketing strategy focused on conversions",
      includes: [
        "All services from Social Media Management",
        "Ad Management (strategy, targeting, creatives, performance tracking on Instagram & TikTok; ad spend separate)",
        "Influencer Marketing Management (research, negotiation, coordination; fees separate)",
        "Email Marketing (up to 4 custom campaigns/month)",
        "Sales & Promo Campaigns (monthly activations: discounts, giveaways, limited-time offers)",
        "Weekly Strategy Sessions"
      ],
      terms: [
        "₦1,500,000/month, minimum 6-month contract",
        "Client pays ad spend & influencer fees separately"
      ]
    }
  ];

  return (    <div className="min-h-screen bg-input">
      <Header />
      
      <div className="pt-20 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/c85aa68f-ad21-41fb-a103-805c14e0490c.png" 
              alt="The Kontent Hub Logo" 
              className="w-20 h-20 mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-ring mb-4">
              THE KONTENT HUB
            </h1>
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-white mb-2">
              Marketing Strategy Rate Card
            </h2>
            <p className="text-white/70">
              Welcome, {userName}! This link expires in 24 hours.
            </p>
          </div>

          {/* Strategy Packages */}
          <div className="space-y-12">
            {packages.map((packageGroup, groupIndex) => (
              <div key={groupIndex} className="bg-charcoal-gray rounded-lg p-8 border border-royal-gold/20">
                <h3 className="text-2xl font-montserrat font-bold text-royal-gold mb-6 text-center">
                  {packageGroup.category}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {packageGroup.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="bg-midnight-black border border-royal-gold/30">
                      <CardHeader className="bg-card-gradient rounded-t-lg">
                        <Badge className="bg-deep-teal text-white w-fit mb-2">
                          {item.market}
                        </Badge>
                        <CardTitle className="text-royal-gold text-2xl font-montserrat font-bold">
                          {item.price}
                        </CardTitle>
                        <p className="text-white/80 text-sm">
                          {item.description}
                        </p>
                      </CardHeader>
                      <CardContent className="p-6">
                        <h4 className="text-white font-semibold mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {item.includes.map((include, includeIndex) => (
                            <li key={includeIndex} className="text-white/80 text-sm flex items-start">
                              <span className="text-royal-gold mr-2">•</span>
                              {include}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Management Packages */}
            <div className="bg-charcoal-gray rounded-lg p-8 border border-royal-gold/20">
              <h3 className="text-2xl font-montserrat font-bold text-royal-gold mb-6 text-center">
                Management & Production Services
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {managementPackages.map((pkg, index) => (
                  <Card key={index} className="bg-midnight-black border border-royal-gold/30">
                    <CardHeader className="bg-card-gradient rounded-t-lg">
                      <CardTitle className="text-royal-gold text-xl font-montserrat font-bold">
                        {pkg.title}
                      </CardTitle>
                      <p className="text-2xl text-white font-bold">{pkg.price}</p>
                      <p className="text-white/80 text-sm">{pkg.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="includes">
                          <AccordionTrigger className="text-white font-semibold">
                            What's Included
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {pkg.includes.map((include, includeIndex) => (
                                <li key={includeIndex} className="text-white/80 text-sm flex items-start">
                                  <span className="text-royal-gold mr-2">•</span>
                                  {include}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="terms">
                          <AccordionTrigger className="text-white font-semibold">
                            Terms & Conditions
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {pkg.terms.map((term, termIndex) => (
                                <li key={termIndex} className="text-white/80 text-sm flex items-start">
                                  <span className="text-royal-gold mr-2">•</span>
                                  {term}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Services */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-midnight-black border border-royal-gold/30">
                  <CardHeader className="bg-card-gradient rounded-t-lg">
                    <CardTitle className="text-royal-gold font-montserrat font-bold">
                      Reel Strategy & Production
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm text-white/80">
                      <div>
                        <strong className="text-white">Phone-Shot Reels:</strong><br />
                        ₦500,000 for 10 reels (single shoot)
                      </div>
                      <div>
                        <strong className="text-white">Camera-Shot Reels:</strong><br />
                        ₦400,000 per reel<br />
                        ₦600,000 for 5 reels
                      </div>
                      <div>
                        <strong className="text-white">3-Month Retainer:</strong><br />
                        ₦1,500,000 (15 videos, 3 sessions)
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-midnight-black border border-royal-gold/30">
                  <CardHeader className="bg-card-gradient rounded-t-lg">
                    <CardTitle className="text-royal-gold font-montserrat font-bold">
                      Template Kit Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm text-white/80">
                      <div>
                        <strong className="text-white">Instagram Only:</strong><br />
                        ₦750,000 (3-month contract)
                      </div>
                      <div>
                        <strong className="text-white">Instagram + LinkedIn:</strong><br />
                        ₦1,000,000 (3-month contract)
                      </div>
                      <div className="mt-4">
                        <strong className="text-white">Includes:</strong><br />
                        Custom branded templates, content calendar, targeted hashtags
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-midnight-black border border-royal-gold/30">
                  <CardHeader className="bg-card-gradient rounded-t-lg">
                    <CardTitle className="text-royal-gold font-montserrat font-bold">
                      Video & Photography Campaign
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm text-white/80">
                      <div>
                        <strong className="text-white">Campaign Strategy:</strong><br />
                        ₦300,000 (concept & planning)
                      </div>
                      <div>
                        <strong className="text-white">Production:</strong><br />
                        From ₦1,200,000 (1-day shoot)
                      </div>
                      <div className="mt-4">
                        <strong className="text-white">Markets:</strong><br />
                        Nigeria (Lagos, Abuja, Port Harcourt)<br />
                        North America (on request)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center bg-charcoal-gray rounded-lg p-8 border border-royal-gold/20">
            <h3 className="text-xl font-montserrat font-bold text-royal-gold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-white/80 mb-6">
              Contact us on WhatsApp to discuss your marketing needs and get a customized proposal.
            </p>
            <Button
              onClick={() => window.open("https://wa.me/2349056979794", "_blank")}
              className="bg-royal-gold hover:bg-button-hover text-midnight-black font-montserrat font-semibold px-8 py-3"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
