import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface ApplicationRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  portfolio_link: string | null;
  resume_url: string | null;
  resume_path: string | null;
  can_resume_immediately: boolean | null;
  based_in_lagos: boolean | null;
  lagos_area: string | null;
  nysc_completed: boolean | null;
  tools_email_marketing: string | null;
  influencer_experience: string | null;
  platforms_managed: string[] | null;
  why_fit: string | null;
  consent_given: boolean | null;
  created_at: string | null;
}

const CareersAdmin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20 px-6">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-black">Careers — Applications</h1>
            <Button onClick={() => signOut()} variant="outline" className="border-tkh-orange text-tkh-orange">Sign Out</Button>
          </div>

          <Card className="bg-white border-border shadow-sm">
            <Table>
              <TableCaption>Job applications submitted via the site.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No applications found.</TableCell>
                  </TableRow>
                ) : (
                  applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell>{app.email || 'N/A'}</TableCell>
                      <TableCell>{app.phone || 'N/A'}</TableCell>
                      <TableCell>{app.portfolio_link ? <a href={app.portfolio_link} target="_blank" rel="noreferrer" className="text-tkh-orange">Open</a> : 'N/A'}</TableCell>
                      <TableCell>{app.resume_url ? <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-tkh-orange">Download</a> : 'N/A'}</TableCell>
                      <TableCell>{app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareersAdmin;
