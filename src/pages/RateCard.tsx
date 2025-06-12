
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  const validateToken = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      // First validate the token
      const { data: validationData, error: validationError } = await supabase
        .rpc('validate_rate_card_token', { token_input: token });

      if (validationError) {
        throw new Error("Invalid or expired access token.");
      }

      // Cast the data as the expected object type
      const validation = validationData as { valid: boolean; full_name: string; request_id: string };

      if (validation && validation.valid) {
        setIsValid(true);
        setUserName(validation.full_name);
        
        // Mark token as accessed
        const { error: accessError } = await supabase
          .rpc('mark_token_as_accessed', { token_input: token });
        
        if (accessError) {
          console.error("Error marking token as accessed:", accessError);
        }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#DE1010] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Validating access...</p>
        </div>
      </div>
    );
  }

  if (error || !isValid) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="bg-white border-gray-200 shadow-lg max-w-md mx-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#DE1010] text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-cinzel font-bold text-[#DE1010] mb-2">Access Denied</h2>
            <p className="text-gray-700 mb-6">
              {error || "Sorry, this access link has expired or is invalid. Please request a new access link."}
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-[#DE1010] hover:bg-[#C00E0E] text-white"
            >
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
            <img 
              src="/lovable-uploads/283ca45c-93b6-4e0d-b037-e991c94291dc.png" 
              alt="The Kontent Hub Logo" 
              className="w-20 h-20 mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-black mb-4">
              Marketing Strategy Rate Card
            </h1>
            {userName && (
              <p className="text-lg text-gray-700 mb-2">
                Welcome, <span className="font-semibold text-[#DE1010]">{userName}</span>!
              </p>
            )}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive marketing solutions tailored to elevate your brand
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-cinzel font-semibold text-[#DE1010] mb-4">
              Our Services
            </h2>
            <p className="text-gray-700">
              We offer a range of marketing services designed to meet your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-[#DE1010] mb-2">
                  Social Media Management
                </h3>
                <p className="text-gray-700 mb-4">
                  Engage your audience and grow your brand with our expert social media strategies.
                </p>
                <Badge className="bg-[#FFD304] text-black hover:bg-[#E6BE04]">
                  Starting from ₦150,000/month
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-[#DE1010] mb-2">
                  Content Creation
                </h3>
                <p className="text-gray-700 mb-4">
                  Drive traffic and establish authority with high-quality, engaging content.
                </p>
                <Badge className="bg-[#FFD304] text-black hover:bg-[#E6BE04]">
                  Starting from ₦75,000/piece
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-[#DE1010] mb-2">
                  SEO Optimization
                </h3>
                <p className="text-gray-700 mb-4">
                  Improve your search engine rankings and reach a wider audience.
                </p>
                <Badge className="bg-[#FFD304] text-black hover:bg-[#E6BE04]">
                  Starting from ₦120,000/month
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-[#DE1010] mb-2">
                  Email Marketing
                </h3>
                <p className="text-gray-700 mb-4">
                  Connect with your customers and boost sales through targeted email campaigns.
                </p>
                <Badge className="bg-[#FFD304] text-black hover:bg-[#E6BE04]">
                  Starting from ₦50,000/campaign
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-[#DE1010] mb-2">
                  Brand Strategy & Design
                </h3>
                <p className="text-gray-700 mb-4">
                  Develop a cohesive brand identity that resonates with your target audience.
                </p>
                <Badge className="bg-[#FFD304] text-black hover:bg-[#E6BE04]">
                  Starting from ₦200,000/project
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-[#DE1010] mb-2">
                  Digital Advertising
                </h3>
                <p className="text-gray-700 mb-4">
                  Maximize your ROI with targeted digital advertising campaigns across platforms.
                </p>
                <Badge className="bg-[#FFD304] text-black hover:bg-[#E6BE04]">
                  Starting from ₦100,000/month + ad spend
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-[#DE1010] to-[#C00E0E] text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-cinzel font-semibold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Contact us today to discuss your marketing needs and receive a personalized quote tailored to your business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white text-[#DE1010] hover:bg-gray-100"
                  onClick={() => window.open('https://wa.me/2349056979794?text=Hi%2C%20I%20just%20viewed%20your%20rate%20card%20and%20would%20like%20to%20discuss%20my%20marketing%20needs.', '_blank')}
                >
                  Chat on WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#DE1010]"
                  onClick={() => window.location.href = 'mailto:hello@thekontenthub.com?subject=Rate Card Inquiry'}
                >
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This access link is valid for 24 hours from approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
