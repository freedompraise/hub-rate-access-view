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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Login from '@/components/Login';
import Header from '@/components/Header';

interface Request {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  created_at: string;
  is_approved: boolean;
  approved_at: string | null;
}

const Admin = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [loading, setLoading] = useState(true);
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
        .order('created_at', { ascending: false });

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
    try {
      const { error } = await supabase
        .from('rate_card_requests')
        .update({ is_approved: true, approved_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error("Error approving request:", error);
        toast({
          title: "Error",
          description: "Failed to approve request.",
          variant: "destructive",
        });
      } else {
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === id ? { ...req, is_approved: true, approved_at: new Date().toISOString() } : req
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
    }
  };

  const filteredRequests = requests.filter(req => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      req.full_name.toLowerCase().includes(searchTerm) ||
      req.phone_number.toLowerCase().includes(searchTerm) ||
      (req.email?.toLowerCase().includes(searchTerm) ?? false);

    let matchesFilter = true;
    if (filter === 'pending') {
      matchesFilter = !req.is_approved;
    } else if (filter === 'approved') {
      matchesFilter = req.is_approved;
    }

    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 px-6">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-foreground">Admin Dashboard</h1>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-tkh-black/60">Total Requests</p>
                    <p className="text-2xl font-bold text-tkh-black">{requests.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-accent">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-tkh-black/60">Pending Approval</p>
                    <p className="text-2xl font-bold text-tkh-black">
                      {requests.filter(r => !r.is_approved).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-accent">⏳</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-tkh-black/60">Approved Today</p>
                    <p className="text-2xl font-bold text-tkh-black">
                      {requests.filter(r => 
                        r.is_approved && 
                        new Date(r.approved_at || '').toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-accent">✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-background border-input text-tkh-black focus:border-accent mb-2 md:mb-0"
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter" className="text-sm font-medium text-tkh-black">Filter:</Label>
              <select
                id="filter"
                value={filter}
                onChange={e => setFilter(e.target.value as typeof filter)}
                className="bg-background border-input text-tkh-black focus:border-accent rounded px-3 py-2"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          <Table>
            <TableCaption>A list of access requests for the rate card.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No requests found.</TableCell>
                </TableRow>
              ) : (
                filteredRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.full_name}</TableCell>
                    <TableCell>{request.phone_number}</TableCell>
                    <TableCell>{request.email || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.is_approved ? 'Approved' : 'Pending'}
                    </TableCell>
                    <TableCell className="text-right">
                      {!request.is_approved ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproval(request.id)}
                        >
                          Approve
                        </Button>
                      ) : (
                        <span className="text-green-500">Approved</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
