import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Login from "@/components/Login";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RateCardRequest {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  submitted_at: string;
  is_approved: boolean;
  token?: string;
  token_expires_at?: string;
  was_accessed: boolean;
  accessed_at?: string;
}

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<RateCardRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('rate_card_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        variant: "destructive",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const { data, error } = await supabase.rpc('approve_rate_card_request', {
        request_id: requestId
      });

      if (error) throw error;

      await fetchRequests();
      
      toast({
        title: "Request Approved",
        description: "Token generated successfully. You can now send the WhatsApp message.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleCopyWhatsAppMessage = (request: RateCardRequest) => {
    if (!request.token) return;
    
    const message = `Hi ${request.full_name}, here's your private access link to view our rate card:
${window.location.origin}/rate-card?token=${request.token}
It's valid for 24 hours only.`;
    
    navigator.clipboard.writeText(message);
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${request.phone_number.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Message Copied & WhatsApp Opened",
      description: "The access link has been copied and WhatsApp opened.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-royal-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const filteredRequests = requests.filter(req =>
    req.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.phone_number.includes(searchTerm)
  );

  const pendingRequests = filteredRequests.filter(req => !req.is_approved);
  const approvedRequests = filteredRequests.filter(req => req.is_approved);
  const accessedRequests = filteredRequests.filter(req => req.was_accessed);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isTokenExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-midnight-black">
      <Header />
      
      <div className="pt-20 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-montserrat font-bold text-royal-gold mb-4">
                Admin Panel
              </h1>
              <p className="text-white/70">
                Manage rate card access requests and send secure links to approved users.
              </p>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              className="border-royal-gold text-royal-gold hover:bg-royal-gold hover:text-midnight-black"
            >
              Sign Out
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-charcoal-gray border-royal-gold/30 text-white"
            />
          </div>

          {loadingRequests ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-royal-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Loading requests...</p>
            </div>
          ) : (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="bg-charcoal-gray border-royal-gold/30">
                <TabsTrigger value="pending" className="text-white data-[state=active]:text-royal-gold">
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-white data-[state=active]:text-royal-gold">
                  Approved ({approvedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="accessed" className="text-white data-[state=active]:text-royal-gold">
                  Accessed ({accessedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-white data-[state=active]:text-royal-gold">
                  All ({filteredRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="grid gap-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="bg-charcoal-gray border-royal-gold/20">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white font-montserrat">
                              {request.full_name}
                            </CardTitle>
                            <p className="text-white/70">{request.phone_number}</p>
                            {request.email && (
                              <p className="text-white/50 text-sm">{request.email}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <p className="text-white/60 text-sm">
                            Submitted: {formatDate(request.submitted_at)}
                          </p>
                          <Button
                            onClick={() => handleApprove(request.id)}
                            className="bg-royal-gold hover:bg-button-hover text-midnight-black font-montserrat font-semibold"
                          >
                            Approve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {pendingRequests.length === 0 && (
                    <p className="text-white/60 text-center py-8">No pending requests</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved">
                <div className="grid gap-4">
                  {approvedRequests.map((request) => (
                    <Card key={request.id} className="bg-charcoal-gray border-royal-gold/20">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white font-montserrat">
                              {request.full_name}
                            </CardTitle>
                            <p className="text-white/70">{request.phone_number}</p>
                            {request.email && (
                              <p className="text-white/50 text-sm">{request.email}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge 
                              variant="outline" 
                              className={`border-green-500 text-green-500 ${
                                isTokenExpired(request.token_expires_at) ? 'border-red-500 text-red-500' : ''
                              }`}
                            >
                              {isTokenExpired(request.token_expires_at) ? 'Expired' : 'Approved'}
                            </Badge>
                            {request.was_accessed && (
                              <Badge variant="outline" className="border-blue-500 text-blue-500">
                                Accessed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-white/60">
                            <p>Submitted: {formatDate(request.submitted_at)}</p>
                            {request.token_expires_at && (
                              <p>Token expires: {formatDate(request.token_expires_at)}</p>
                            )}
                            {request.accessed_at && (
                              <p>Accessed: {formatDate(request.accessed_at!)}</p>
                            )}
                          </div>
                          
                          {!isTokenExpired(request.token_expires_at) && (
                            <Button
                              onClick={() => handleCopyWhatsAppMessage(request)}
                              className="bg-deep-teal hover:bg-deep-teal/80 text-white font-montserrat font-semibold"
                            >
                              Copy & Send via WhatsApp
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {approvedRequests.length === 0 && (
                    <p className="text-white/60 text-center py-8">No approved requests</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="accessed">
                <div className="grid gap-4">
                  {accessedRequests.map((request) => (
                    <Card key={request.id} className="bg-charcoal-gray border-royal-gold/20">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white font-montserrat">
                              {request.full_name}
                            </CardTitle>
                            <p className="text-white/70">{request.phone_number}</p>
                            {request.email && (
                              <p className="text-white/50 text-sm">{request.email}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="border-blue-500 text-blue-500">
                            Accessed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-white/60">
                          <p>Submitted: {formatDate(request.submitted_at)}</p>
                          <p>Accessed: {formatDate(request.accessed_at!)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {accessedRequests.length === 0 && (
                    <p className="text-white/60 text-center py-8">No accessed requests</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="grid gap-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="bg-charcoal-gray border-royal-gold/20">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white font-montserrat">
                              {request.full_name}
                            </CardTitle>
                            <p className="text-white/70">{request.phone_number}</p>
                            {request.email && (
                              <p className="text-white/50 text-sm">{request.email}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge 
                              variant="outline" 
                              className={`${
                                !request.is_approved 
                                  ? 'border-yellow-500 text-yellow-500' 
                                  : isTokenExpired(request.token_expires_at)
                                  ? 'border-red-500 text-red-500'
                                  : 'border-green-500 text-green-500'
                              }`}
                            >
                              {!request.is_approved 
                                ? 'Pending' 
                                : isTokenExpired(request.token_expires_at) 
                                ? 'Expired' 
                                : 'Approved'
                              }
                            </Badge>
                            {request.was_accessed && (
                              <Badge variant="outline" className="border-blue-500 text-blue-500">
                                Accessed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-white/60">
                          <p>Submitted: {formatDate(request.submitted_at)}</p>
                          {request.token_expires_at && (
                            <p>Token expires: {formatDate(request.token_expires_at)}</p>
                          )}
                          {request.accessed_at && (
                            <p>Accessed: {formatDate(request.accessed_at)}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
