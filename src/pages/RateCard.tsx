import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RateCardProps {
  isValid: boolean | null;
  rateCardData: any | null;
  error: string | null;
}

const RateCard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [rateCardData, setRateCardData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      validateToken(token as string);
    } else {
      setLoading(false);
      setError("No access token provided.");
    }
  }, [router.query]);

  const validateToken = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('rate_card_access')
        .select('*')
        .eq('access_token', token)
        .single();

      if (error) {
        throw new Error("Invalid or expired access token.");
      }

      if (data && new Date(data.expires_at) > new Date()) {
        setIsValid(true);
        setRateCardData(data);
      } else {
        setIsValid(false);
        throw new Error("Access token has expired.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while validating access.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-tkh-black">Validating access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-white border-accent/20 max-w-md mx-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-accent text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-accent mb-2">Access Denied</h2>
            <p className="text-tkh-black/80 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Request New Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 px-6">
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/283ca45c-93b6-4e0d-b037-e991c94291dc.png" 
              alt="The Kontent Hub Logo" 
              className="w-20 h-20 mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Marketing Strategy Rate Card
            </h1>
            <p className="text-xl text-tkh-black/80 max-w-2xl mx-auto">
              Comprehensive marketing solutions tailored to elevate your brand
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-accent mb-4">
              Our Services
            </h2>
            <p className="text-tkh-black/90">
              We offer a range of marketing services designed to meet your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-secondary/20">
              <CardContent>
                <h3 className="text-xl font-serif font-semibold text-accent mb-2">
                  Social Media Management
                </h3>
                <p className="text-tkh-black/80 mb-4">
                  Engage your audience and grow your brand with our expert social media strategies.
                </p>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-tkh-black">
                  Starting from $500/month
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white border-secondary/20">
              <CardContent>
                <h3 className="text-xl font-serif font-semibold text-accent mb-2">
                  Content Creation
                </h3>
                <p className="text-tkh-black/80 mb-4">
                  Drive traffic and establish authority with high-quality, engaging content.
                </p>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-tkh-black">
                  Starting from $300/piece
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white border-secondary/20">
              <CardContent>
                <h3 className="text-xl font-serif font-semibold text-accent mb-2">
                  SEO Optimization
                </h3>
                <p className="text-tkh-black/80 mb-4">
                  Improve your search engine rankings and reach a wider audience.
                </p>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-tkh-black">
                  Starting from $400/month
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white border-secondary/20">
              <CardContent>
                <h3 className="text-xl font-serif font-semibold text-accent mb-2">
                  Email Marketing
                </h3>
                <p className="text-tkh-black/80 mb-4">
                  Connect with your customers and boost sales through targeted email campaigns.
                </p>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-tkh-black">
                  Starting from $200/campaign
                </span>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-serif font-semibold text-accent mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-tkh-black/80 mb-6">
              Contact us today to discuss your marketing needs and receive a personalized quote.
            </p>
            <Button className="btn-primary">
              Book a Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
