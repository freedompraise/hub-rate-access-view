import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Login from '@/components/Login';
import Header from '@/components/Header';
import { 
  Download, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  FileText,
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

type FilterCategory = 'all' | 'immediate' | 'lagos' | 'nysc_completed' | 'nysc_pending';

const CareersAdmin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRow | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<ApplicationRow | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const filteredApplications = applications.filter(app => {
    // Category filter
    let matchesCategory = true;
    if (selectedCategory === 'immediate') {
      matchesCategory = app.can_resume_immediately === true;
    } else if (selectedCategory === 'lagos') {
      matchesCategory = app.based_in_lagos === true;
    } else if (selectedCategory === 'nysc_completed') {
      matchesCategory = app.nysc_completed === true;
    } else if (selectedCategory === 'nysc_pending') {
      matchesCategory = app.nysc_completed === false;
    }

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      app.full_name?.toLowerCase().includes(searchLower) ||
      app.email?.toLowerCase().includes(searchLower) ||
      app.phone?.toLowerCase().includes(searchLower) ||
      app.lagos_area?.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  const handleDeleteClick = (app: ApplicationRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplicationToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;

    setDeleting(true);
    try {
      // Delete resume file from storage if it exists
      if (applicationToDelete.resume_path) {
        const { error: storageError } = await supabase.storage
          .from('Careers')
          .remove([applicationToDelete.resume_path]);
        
        if (storageError) {
          console.error('Error deleting resume file:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationToDelete.id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setApplications(prev => prev.filter(app => app.id !== applicationToDelete.id));
      
      // Close dialog and clear selection if deleted
      if (selectedApplication?.id === applicationToDelete.id) {
        setSelectedApplication(null);
      }

      toast({
        title: 'Success',
        description: 'Application deleted successfully.',
      });

      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete application.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const categoryCounts = {
    all: applications.length,
    immediate: applications.filter(a => a.can_resume_immediately === true).length,
    lagos: applications.filter(a => a.based_in_lagos === true).length,
    nysc_completed: applications.filter(a => a.nysc_completed === true).length,
    nysc_pending: applications.filter(a => a.nysc_completed === false).length,
  };

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="flex h-[calc(100vh-5rem)]">
          {/* Left Sidebar */}
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4">Filter Applications</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-tkh-teal text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">All Applications</span>
                  </div>
                  <Badge variant="secondary" className={selectedCategory === 'all' ? 'bg-white/20 text-white' : ''}>
                    {categoryCounts.all}
                  </Badge>
                </button>

                <button
                  onClick={() => setSelectedCategory('immediate')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === 'immediate'
                      ? 'bg-tkh-teal text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Can Resume Immediately</span>
                  </div>
                  <Badge variant="secondary" className={selectedCategory === 'immediate' ? 'bg-white/20 text-white' : ''}>
                    {categoryCounts.immediate}
                  </Badge>
                </button>

                <button
                  onClick={() => setSelectedCategory('lagos')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === 'lagos'
                      ? 'bg-tkh-teal text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">Based in Lagos</span>
                  </div>
                  <Badge variant="secondary" className={selectedCategory === 'lagos' ? 'bg-white/20 text-white' : ''}>
                    {categoryCounts.lagos}
                  </Badge>
                </button>

                <Separator className="my-4" />

                <button
                  onClick={() => setSelectedCategory('nysc_completed')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === 'nysc_completed'
                      ? 'bg-tkh-teal text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-medium">NYSC Completed</span>
                  </div>
                  <Badge variant="secondary" className={selectedCategory === 'nysc_completed' ? 'bg-white/20 text-white' : ''}>
                    {categoryCounts.nysc_completed}
                  </Badge>
                </button>

                <button
                  onClick={() => setSelectedCategory('nysc_pending')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === 'nysc_pending'
                      ? 'bg-tkh-teal text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">NYSC Pending</span>
                  </div>
                  <Badge variant="secondary" className={selectedCategory === 'nysc_pending' ? 'bg-white/20 text-white' : ''}>
                    {categoryCounts.nysc_pending}
                  </Badge>
                </button>
              </nav>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="w-full border-tkh-orange text-tkh-orange hover:bg-tkh-orange hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-2">Job Applications</h1>
                  <p className="text-gray-600">
                    {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                  className="border-tkh-teal text-tkh-teal hover:bg-tkh-teal hover:text-white"
                >
                  Back to Dashboard
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-tkh-teal"></div>
                  <p className="mt-4 text-gray-600">Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-600">No applications found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredApplications.map(app => (
                    <Card 
                      key={app.id} 
                      className={`cursor-pointer hover:shadow-lg transition-shadow ${
                        selectedApplication?.id === app.id ? 'ring-2 ring-tkh-teal' : ''
                      }`}
                      onClick={() => setSelectedApplication(app)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-black">{app.full_name}</h3>
                              <div className="flex gap-2">
                                {app.can_resume_immediately && (
                                  <Badge className="bg-green-100 text-green-800">Immediate</Badge>
                                )}
                                {app.based_in_lagos && (
                                  <Badge className="bg-blue-100 text-blue-800">Lagos</Badge>
                                )}
                                {app.nysc_completed ? (
                                  <Badge className="bg-purple-100 text-purple-800">NYSC ✓</Badge>
                                ) : (
                                  <Badge variant="outline">NYSC Pending</Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{app.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{app.phone || 'N/A'}</span>
                              </div>
                              {app.lagos_area && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{app.lagos_area}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>

                            {app.tools_email_marketing && (
                              <div className="mt-3 text-sm">
                                <span className="font-medium text-gray-700">Email Tools: </span>
                                <span className="text-gray-600">{app.tools_email_marketing}</span>
                              </div>
                            )}

                            {app.platforms_managed && app.platforms_managed.length > 0 && (
                              <div className="mt-3 flex gap-2 flex-wrap">
                                {app.platforms_managed.map(platform => (
                                  <Badge key={platform} variant="outline">{platform}</Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 ml-4">
                            {app.resume_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(app.resume_url!, '_blank');
                                }}
                                className="border-tkh-teal text-tkh-teal hover:bg-tkh-teal hover:text-white"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Resume
                              </Button>
                            )}
                            {app.portfolio_link && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(app.portfolio_link!, '_blank');
                                }}
                                className="border-tkh-orange text-tkh-orange hover:bg-tkh-orange hover:text-white"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Portfolio
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleDeleteClick(app, e)}
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Application Details */}
          {selectedApplication && (
            <aside className="w-96 bg-white border-l border-gray-200 overflow-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black">Application Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-2">{selectedApplication.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      Applied on {selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Information</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-black">{selectedApplication.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-black">{selectedApplication.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <label className="text-sm font-medium text-gray-500">Availability & Location</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-black">Can resume immediately</span>
                          {selectedApplication.can_resume_immediately ? (
                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-black">Based in Lagos</span>
                          {selectedApplication.based_in_lagos ? (
                            <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </div>
                        {selectedApplication.lagos_area && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-black">{selectedApplication.lagos_area}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-black">NYSC Completed</span>
                          {selectedApplication.nysc_completed ? (
                            <Badge className="bg-purple-100 text-purple-800">Completed</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {selectedApplication.tools_email_marketing && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Marketing Tools</label>
                        <p className="mt-2 text-black">{selectedApplication.tools_email_marketing}</p>
                      </div>
                    )}

                    {selectedApplication.influencer_experience && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Influencer Experience</label>
                        <p className="mt-2 text-black whitespace-pre-wrap">{selectedApplication.influencer_experience}</p>
                      </div>
                    )}

                    {selectedApplication.platforms_managed && selectedApplication.platforms_managed.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Platforms Managed</label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {selectedApplication.platforms_managed.map(platform => (
                            <Badge key={platform} variant="outline">{platform}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApplication.why_fit && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Why they're a good fit</label>
                        <p className="mt-2 text-black whitespace-pre-wrap">{selectedApplication.why_fit}</p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-3">
                      {selectedApplication.resume_url && (
                        <Button
                          className="flex-1 bg-tkh-teal hover:bg-tkh-teal/90"
                          onClick={() => window.open(selectedApplication.resume_url!, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Resume
                        </Button>
                      )}
                      {selectedApplication.portfolio_link && (
                        <Button
                          variant="outline"
                          className="flex-1 border-tkh-orange text-tkh-orange hover:bg-tkh-orange hover:text-white"
                          onClick={() => window.open(selectedApplication.portfolio_link!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Portfolio
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setApplicationToDelete(selectedApplication);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Application
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </aside>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the application for <strong>{applicationToDelete?.full_name}</strong>? 
                  This action cannot be undone and will also delete the associated resume file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default CareersAdmin;

