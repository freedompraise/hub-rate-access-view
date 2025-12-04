import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeUploadService } from '@/services/ResumeUploadService';

import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

const ApplyNow = () => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [role, setRole] = useState('');
  const [canResumeImmediately, setCanResumeImmediately] = useState<'yes' | 'no' | ''>('');
  const [basedInLagos, setBasedInLagos] = useState<'yes' | 'no' | ''>('');
  const [lagosArea, setLagosArea] = useState('');
  const [nyscCompleted, setNyscCompleted] = useState<'yes' | 'no' | ''>('');
  const [toolsEmailMarketing, setToolsEmailMarketing] = useState('');
  const [influencerExperience, setInfluencerExperience] = useState('');
  const [whyFit, setWhyFit] = useState('');
  const [consent, setConsent] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPortfolioLink('');
    setRole('');
    setCanResumeImmediately('');
    setBasedInLagos('');
    setLagosArea('');
    setNyscCompleted('');
    setToolsEmailMarketing('');
    setInfluencerExperience('');
    setWhyFit('');
    setConsent(false);
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast({ title: 'Consent required', description: 'Please give consent to proceed.', variant: 'destructive' });
      return;
    }

    if (!fullName.trim()) {
      toast({ title: 'Name required', description: 'Please enter your full name.', variant: 'destructive' });
      return;
    }

    if (!email.trim()) {
      toast({ title: 'Email required', description: 'Please enter your email address.', variant: 'destructive' });
      return;
    }

    if (!phone.trim()) {
      toast({ title: 'Phone required', description: 'Please enter your phone number.', variant: 'destructive' });
      return;
    }

    if (!resumeFile) {
      toast({ title: 'Resume required', description: 'Please upload your resume to continue.', variant: 'destructive' });
      return;
    }

    const MAX_FILE_SIZE = 4 * 1024 * 1024;
    if (resumeFile.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Please upload a resume smaller than 4 MB.', variant: 'destructive' });
      return;
    }

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (resumeFile.type && !allowed.includes(resumeFile.type)) {
      const ext = resumeFile.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
        toast({ title: 'Invalid file type', description: 'Please upload a PDF or Word document.', variant: 'destructive' });
        return;
      }
    }

    setSubmitting(true);

    try {
      let resume_path: string | null = null;
      let resume_url: string | null = null;

      const uploadResult = await ResumeUploadService.uploadResume(resumeFile);

      if (!uploadResult.success) {
        toast({
          title: 'File upload failed',
          description: uploadResult.error || 'Please try uploading your resume again.',
          variant: 'destructive'
        });
        setSubmitting(false);
        return;
      }

      resume_path = uploadResult.path || null;
      resume_url = uploadResult.url || null;

      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        resume_path,
        resume_url,
        portfolio_link: portfolioLink.trim() || null,
        role: role || null,
        can_resume_immediately: canResumeImmediately === 'yes',
        based_in_lagos: basedInLagos === 'yes',
        lagos_area: lagosArea.trim() || null,
        nysc_completed: nyscCompleted === 'yes',
        tools_email_marketing: toolsEmailMarketing.trim() || null,
        influencer_experience: influencerExperience.trim() || null,
        why_fit: whyFit.trim() || null,
        consent_given: true,
      };

      const { error: insertError } = await supabase
        .from('job_applications')
        .insert(payload);

      if (insertError) {
        throw new Error(insertError.message || 'Failed to submit application');
      }

      setSubmitted(true);
      resetForm();
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      toast({
        title: 'Submission failed',
        description: err.message || 'Failed to submit application',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
       
        <div className="pt-20 pb-20 px-6">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-2 border-tkh-teal bg-gradient-to-br from-white via-white to-blue-50">
              <CardContent className="pt-12 pb-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-tkh-teal mx-auto mb-4" />
                <h2 className="text-3xl font-serif font-bold text-black mb-2">Application Submitted!</h2>
                <p className="text-lg text-black/70 mb-6">
                  Thank you for your interest. We'll review your application and contact you via WhatsApp within 24 hours.
                </p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="btn-gradient"
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
     
      <div className="pt-20 pb-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-white rounded-t-lg">
              <CardTitle className="text-3xl font-serif">Job Application</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="grid gap-6">
                {/* Contact Information */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-tkh-purple">Contact Information</h3>
                  <p className="text-sm text-black/60 mb-4">Tell us how to reach you</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+234 XXX XXX XXXX"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio" className="text-sm font-semibold">Portfolio Link</Label>
                    <Input
                      id="portfolio"
                      value={portfolioLink}
                      onChange={e => setPortfolioLink(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Role and Availability */}
                <div className="space-y-1 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-tkh-purple">Role & Availability</h3>
                  <p className="text-sm text-black/60 mb-4">Tell us about your role and availability</p>
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-semibold">Role Applying For</Label>
                  <select
                    id="role"
                    className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tkh-purple/50"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="">Select a role (optional)</option>
                 <option>Growth Marketing Manager</option>
                      <option>Creative and Marketing Strategist</option>
                      <option>Content Manager</option>
                      <option>Videographer</option>
                      <option>Operations Intern</option>
                      <option>Canva Designer</option>
                      <option>Social Media Manager</option>
                      <option>Social Media Intern</option>
                      <option>Content Strategist</option>
                      <option>Content creator</option>
                      <option>Content strategy intern</option>
                      <option>Creative intern</option>
                      <option>Canva design intern</option>
                      <option>Paid Ads Specialist</option>
                      <option> Business Development Executive </option>
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Can Resume Immediately?</Label>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="resume" checked={canResumeImmediately === 'yes'} onChange={() => setCanResumeImmediately('yes')} />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="resume" checked={canResumeImmediately === 'no'} onChange={() => setCanResumeImmediately('no')} />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Based in Lagos?</Label>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="lagos" checked={basedInLagos === 'yes'} onChange={() => setBasedInLagos('yes')} />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="lagos" checked={basedInLagos === 'no'} onChange={() => setBasedInLagos('no')} />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">NYSC Completed?</Label>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="nysc" checked={nyscCompleted === 'yes'} onChange={() => setNyscCompleted('yes')} />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="nysc" checked={nyscCompleted === 'no'} onChange={() => setNyscCompleted('no')} />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {basedInLagos === 'yes' && (
                  <div>
                    <Label htmlFor="lagosArea" className="text-sm font-semibold">Which Area in Lagos?</Label>
                    <Input
                      id="lagosArea"
                      value={lagosArea}
                      onChange={e => setLagosArea(e.target.value)}
                      placeholder="e.g., Lekki, Ikoyi, Victoria Island"
                      className="mt-2"
                    />
                  </div>
                )}

                {/* Experience & Skills */}
                <div className="space-y-1 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-tkh-purple">Experience & Skills</h3>
                  <p className="text-sm text-black/60 mb-4">Tell us about your experience</p>
                </div>

                <div>
                  <Label htmlFor="tools" className="text-sm font-semibold">Which Tools/Software Do You Use for Jobs?</Label>
                  <Input
                    id="tools"
                    value={toolsEmailMarketing}
                    onChange={e => setToolsEmailMarketing(e.target.value)}
                    placeholder="e.g., Adobe Creative Suite, Canva, Mailchimp, etc."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="influencer" className="text-sm font-semibold">Have You Worked on Any Project You'd Like to Share?</Label>
                  <Textarea
                    id="influencer"
                    value={influencerExperience}
                    onChange={e => setInfluencerExperience(e.target.value)}
                    placeholder="Describe a project or campaign you've worked on..."
                    className="mt-2 min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="whyFit" className="text-sm font-semibold">Why Are You a Good Fit for This Role?</Label>
                  <Textarea
                    id="whyFit"
                    value={whyFit}
                    onChange={e => setWhyFit(e.target.value)}
                    placeholder="Tell us what makes you the ideal candidate..."
                    className="mt-2 min-h-32"
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-1 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-tkh-purple">Resume</h3>
                  <p className="text-sm text-black/60 mb-4">Upload your resume (PDF/DOCX, max 4 MB)</p>
                </div>

                <div>
                  <Label htmlFor="resume" className="text-sm font-semibold">Resume *</Label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setResumeFile(e.target.files?.[0] ?? null)}
                    className="mt-2 w-full p-3 border rounded-lg cursor-pointer file:cursor-pointer file:bg-tkh-purple file:text-white file:border-0 file:px-3 file:py-1 file:rounded"
                    required
                  />
                  {resumeFile && (
                    <p className="text-sm text-tkh-teal mt-2">✓ {resumeFile.name}</p>
                  )}
                </div>

                {/* Consent */}
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(v) => setConsent(!!v)}
                      className="mt-1"
                    />
                    <Label htmlFor="consent" className="text-sm font-medium leading-relaxed cursor-pointer">
                      I consent to having my data stored for recruitment purposes. *
                    </Label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-gradient text-lg py-6 font-semibold"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyNow;
