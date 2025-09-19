import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Login from '@/components/Login';
import Header from '@/components/Header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Papa from 'papaparse';

interface Request {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  brand_name: string | null;
  instagram_handle: string | null;
  help_needed: string | null;
  about_business: string | null;
  additional_info: string | null;
  service_interest: string | null;
  submitted_at: string | null;
  is_approved: boolean | null;
  token: string | null;
  token_expires_at: string | null;
  was_accessed: boolean | null;
  accessed_at: string | null;
  notes: string | null;
}

const Admin = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalContent, setModalContent] = useState<{ title: string; content: string | null } | null>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rate_card_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
        toast({
          title: "Error",
          description: "Failed to fetch requests.",
          variant: "destructive",
        });
      } else {
        setRequests(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string) => {
    setApproving(id);
    try {
      const { data, error } = await supabase.rpc('approve_rate_card_request', {
        request_id: id
      });

      if (error) {
        console.error("Error approving request:", error);
        toast({
          title: "Error",
          description: "Failed to approve request.",
          variant: "destructive",
        });
      } else {
        // Cast the data as the expected object type
        const approvalData = data as { token: string; token_expires_at: string };
        
        // Update the local state with the approved request
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === id 
              ? { 
                  ...req, 
                  is_approved: true, 
                  token: approvalData.token,
                  token_expires_at: approvalData.token_expires_at
                } 
              : req
          )
        );
        toast({
          title: "Success",
          description: "Request approved successfully!",
        });
      }
    } catch (error: any) {
      console.error("Error during approval:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve request.",
        variant: "destructive",
      });
    } finally {
      setApproving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const { error } = await supabase
        .from('rate_card_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting request:", error);
        toast({
          title: "Error",
          description: "Failed to delete request.",
          variant: "destructive",
        });
      } else {
        setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
        toast({
          title: "Success",
          description: "Request deleted successfully!",
        });
      }
    } catch (error: any) {
      console.error("Error during deletion:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete request.",
        variant: "destructive",
      });
    }
  };

  const copyAccessLink = async (request: Request) => {
    if (!request.token) return;
    
    const link = `${window.location.origin}/rate-card?token=${request.token}`;
    const message = `Hi ${request.full_name}, here's your private access link to view our rate card:\n${link}\nIt's valid for 7 days only.`;
    
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Copied!",
        description: "WhatsApp message copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    let dataToExport = filteredRequests;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day

      dataToExport = dataToExport.filter(req => {
        if (!req.submitted_at) return false;
        const submittedDate = new Date(req.submitted_at);
        return submittedDate >= start && submittedDate <= end;
      });
    }

    if (dataToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "Please adjust your filters or date range.",
        variant: "destructive",
      });
      return;
    }

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "rate-card-requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "CSV file has been downloaded.",
    });
  };

  const filteredRequests = requests.filter(req => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      req.full_name.toLowerCase().includes(searchTerm) ||
      req.phone_number.toLowerCase().includes(searchTerm) ||
      (req.email?.toLowerCase().includes(searchTerm) ?? false) ||
      (req.brand_name?.toLowerCase().includes(searchTerm) ?? false) ||
      (req.instagram_handle?.toLowerCase().includes(searchTerm) ?? false) ||
      (req.about_business?.toLowerCase().includes(searchTerm) ?? false) ||
      (req.service_interest?.toLowerCase().includes(searchTerm) ?? false) ||
      (req.additional_info?.toLowerCase().includes(searchTerm) ?? false);

    let matchesFilter = true;
    if (filter === 'pending') {
      matchesFilter = !req.is_approved;
    } else if (filter === 'approved') {
      matchesFilter = !!req.is_approved;
    }

    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20 px-6">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-black">Admin Dashboard</h1>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="border-tkh-orange text-tkh-orange hover:bg-tkh-orange hover:text-white"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black/60">Total Requests</p>
                    <p className="text-2xl font-bold text-black">{requests.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-tkh-yellow/20 rounded-lg flex items-center justify-center">
                    <span className="text-tkh-orange">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black/60">Pending Approval</p>
                    <p className="text-2xl font-bold text-black">
                      {requests.filter(r => !r.is_approved).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-tkh-yellow/20 rounded-lg flex items-center justify-center">
                    <span className="text-tkh-yellow">⏳</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black/60">Approved Today</p>
                    <p className="text-2xl font-bold text-black">
                      {requests.filter(r => 
                        r.is_approved && 
                        r.token_expires_at &&
                        new Date(r.token_expires_at).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-tkh-teal/20 rounded-lg flex items-center justify-center">
                    <span className="text-tkh-teal">✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <Input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border-border text-black focus:border-tkh-orange max-w-md"
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter" className="text-sm font-medium text-black">Filter:</Label>
              <select
                id="filter"
                value={filter}
                onChange={e => setFilter(e.target.value as typeof filter)}
                className="bg-white border-border text-black focus:border-tkh-orange rounded px-3 py-2"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-black">From:</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-white border-border text-black focus:border-tkh-orange"
              />
              <Label htmlFor="endDate" className="text-sm font-medium text-black">To:</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-white border-border text-black focus:border-tkh-orange"
              />
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-tkh-teal text-tkh-teal hover:bg-tkh-teal hover:text-white"
            >
              Export CSV
            </Button>
          </div>

          <Card className="bg-white border-border shadow-sm">
            <Table>
              <TableCaption>A list of access requests for the rate card.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>About Business</TableHead>
                  <TableHead>Service Interest</TableHead>
                  <TableHead>Additional Info</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">No requests found.</TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map(request => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.full_name}</TableCell>
                      <TableCell>{request.phone_number}</TableCell>
                      <TableCell>{request.email || 'N/A'}</TableCell>
                      <TableCell>{request.brand_name || 'N/A'}</TableCell>
                      <TableCell>{request.instagram_handle || 'N/A'}</TableCell>
                      <TableCell 
                        className="max-w-[200px] truncate cursor-pointer hover:text-tkh-orange"
                        onClick={() => setModalContent({
                          title: 'About Business',
                          content: request.about_business
                        })}
                      >
                        {request.about_business || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={request.service_interest || 'N/A'}>
                        {request.service_interest || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={request.additional_info || 'N/A'}>
                        {request.additional_info || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {request.submitted_at ? new Date(request.submitted_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.is_approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'tag-yellow'
                        }`}>
                          {request.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bopacrder-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                            >
                              ...
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!request.is_approved ? (
                              <DropdownMenuItem
                                onClick={() => handleApproval(request.id)}
                                disabled={approving === request.id}
                              >
                                {approving === request.id ? "Approving..." : "Approve"}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => copyAccessLink(request)}>
                                Copy Link
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(request.id)} className="text-red-500">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          <Dialog open={!!modalContent} onOpenChange={() => setModalContent(null)}>
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{modalContent?.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 text-sm whitespace-pre-wrap">
                {modalContent?.content || 'N/A'}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Admin;
