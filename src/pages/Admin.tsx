
import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface RateCardRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  submittedAt: string;
  isApproved: boolean;
  token?: string;
  tokenExpiresAt?: string;
  wasAccessed: boolean;
  accessedAt?: string;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Mock data - in real app this would come from Supabase
  const [requests, setRequests] = useState<RateCardRequest[]>([
    {
      id: "1",
      fullName: "John Doe",
      phoneNumber: "+234 805 123 4567",
      email: "john@example.com",
      submittedAt: "2024-06-04T10:30:00Z",
      isApproved: false,
      wasAccessed: false
    },
    {
      id: "2",
      fullName: "Jane Smith",
      phoneNumber: "+234 806 987 6543",
      email: "jane@business.com",
      submittedAt: "2024-06-04T09:15:00Z",
      isApproved: true,
      token: "abc123-def456-ghi789",
      tokenExpiresAt: "2024-06-05T09:15:00Z",
      wasAccessed: true,
      accessedAt: "2024-06-04T14:20:00Z"
    },
    {
      id: "3",
      fullName: "Mike Johnson",
      phoneNumber: "+234 807 555 9999",
      submittedAt: "2024-06-03T16:45:00Z",
      isApproved: true,
      token: "xyz789-uvw456-rst123",
      tokenExpiresAt: "2024-06-04T16:45:00Z",
      wasAccessed: false
    }
  ]);

  const handleApprove = async (requestId: string) => {
    // In real app, this would call approve_rate_card_request RPC
    const token = `token-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, isApproved: true, token, tokenExpiresAt: expiresAt }
        : req
    ));

    toast({
      title: "Request Approved",
      description: "Token generated successfully. You can now send the WhatsApp message.",
    });
  };

  const handleCopyWhatsAppMessage = (request: RateCardRequest) => {
    if (!request.token) return;
    
    const message = `Hi ${request.fullName}, here's your private access link to view our rate card:
https://rates.thekontenthub.com/rate-card?token=${request.token}
It's valid for 24 hours only.`;
    
    navigator.clipboard.writeText(message);
    
    // Open WhatsApp with the message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${request.phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Message Copied & WhatsApp Opened",
      description: "The access link has been copied and WhatsApp opened.",
    });
  };

  const filteredRequests = requests.filter(req =>
    req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.phoneNumber.includes(searchTerm)
  );

  const pendingRequests = filteredRequests.filter(req => !req.isApproved);
  const approvedRequests = filteredRequests.filter(req => req.isApproved);
  const accessedRequests = filteredRequests.filter(req => req.wasAccessed);

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
          <div className="mb-8">
            <h1 className="text-3xl font-montserrat font-bold text-royal-gold mb-4">
              Admin Panel
            </h1>
            <p className="text-white/70">
              Manage rate card access requests and send secure links to approved users.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-charcoal-gray border-royal-gold/30 text-white"
            />
          </div>

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
                            {request.fullName}
                          </CardTitle>
                          <p className="text-white/70">{request.phoneNumber}</p>
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
                          Submitted: {formatDate(request.submittedAt)}
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
                            {request.fullName}
                          </CardTitle>
                          <p className="text-white/70">{request.phoneNumber}</p>
                          {request.email && (
                            <p className="text-white/50 text-sm">{request.email}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant="outline" 
                            className={`border-green-500 text-green-500 ${
                              isTokenExpired(request.tokenExpiresAt) ? 'border-red-500 text-red-500' : ''
                            }`}
                          >
                            {isTokenExpired(request.tokenExpiresAt) ? 'Expired' : 'Approved'}
                          </Badge>
                          {request.wasAccessed && (
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
                          <p>Submitted: {formatDate(request.submittedAt)}</p>
                          {request.tokenExpiresAt && (
                            <p>Token expires: {formatDate(request.tokenExpiresAt)}</p>
                          )}
                          {request.accessedAt && (
                            <p>Accessed: {formatDate(request.accessedAt)}</p>
                          )}
                        </div>
                        
                        {!isTokenExpired(request.tokenExpiresAt) && (
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
                            {request.fullName}
                          </CardTitle>
                          <p className="text-white/70">{request.phoneNumber}</p>
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
                        <p>Submitted: {formatDate(request.submittedAt)}</p>
                        <p>Accessed: {formatDate(request.accessedAt!)}</p>
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
                            {request.fullName}
                          </CardTitle>
                          <p className="text-white/70">{request.phoneNumber}</p>
                          {request.email && (
                            <p className="text-white/50 text-sm">{request.email}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${
                              !request.isApproved 
                                ? 'border-yellow-500 text-yellow-500' 
                                : isTokenExpired(request.tokenExpiresAt)
                                ? 'border-red-500 text-red-500'
                                : 'border-green-500 text-green-500'
                            }`}
                          >
                            {!request.isApproved 
                              ? 'Pending' 
                              : isTokenExpired(request.tokenExpiresAt) 
                              ? 'Expired' 
                              : 'Approved'
                            }
                          </Badge>
                          {request.wasAccessed && (
                            <Badge variant="outline" className="border-blue-500 text-blue-500">
                              Accessed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-white/60">
                        <p>Submitted: {formatDate(request.submittedAt)}</p>
                        {request.tokenExpiresAt && (
                          <p>Token expires: {formatDate(request.tokenExpiresAt)}</p>
                        )}
                        {request.accessedAt && (
                          <p>Accessed: {formatDate(request.accessedAt)}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
