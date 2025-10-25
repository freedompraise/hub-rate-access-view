import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CareersSection = () => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [canResumeImmediately, setCanResumeImmediately] = useState<'yes' | 'no' | ''>('');
  const [basedInLagos, setBasedInLagos] = useState<'yes' | 'no' | ''>('');
  const [lagosArea, setLagosArea] = useState('');
  const [nyscCompleted, setNyscCompleted] = useState<'yes' | 'no' | ''>('');
  const [toolsEmailMarketing, setToolsEmailMarketing] = useState('');
  const [influencerExperience, setInfluencerExperience] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [whyFit, setWhyFit] = useState('');
  const [consent, setConsent] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({ title: 'Consent required', description: 'Please give consent to proceed.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    try {
      let resume_path: string | null = null;
      let resume_url: string | null = null;

      if (resumeFile) {
        const filePath = `resumes/${Date.now()}_${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('Careers')
          .upload(filePath, resumeFile);

        if (uploadError) throw uploadError;

        resume_path = filePath;
        const { data } = supabase.storage.from('Careers').getPublicUrl(filePath);
        resume_url = data.publicUrl;
      }

      const payload = {
        full_name: fullName,
        email,
        phone,
        resume_path,
        resume_url,
        portfolio_link: portfolioLink,
        can_resume_immediately: canResumeImmediately === 'yes',
        based_in_lagos: basedInLagos === 'yes',
        lagos_area: lagosArea || null,
        nysc_completed: nyscCompleted === 'yes',
        tools_email_marketing: toolsEmailMarketing || null,
        influencer_experience: influencerExperience || null,
        platforms_managed: platforms,
        why_fit: whyFit || null,
        consent_given: consent,
      };

      const { error } = await supabase.from('job_applications').insert(payload);

      if (error) throw error;

      toast({ title: 'Application submitted', description: 'Thank you — we will review your application.' });

      // Reset form
      setFullName(''); setEmail(''); setPhone(''); setPortfolioLink(''); setCanResumeImmediately('');
      setBasedInLagos(''); setLagosArea(''); setNyscCompleted(''); setToolsEmailMarketing('');
      setInfluencerExperience(''); setPlatforms([]); setWhyFit(''); setConsent(false); setResumeFile(null);
      // close modal
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Submission failed', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="careers" className="mb-12">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center md:text-3xl">Join Our Team</CardTitle>
          <CardDescription className="text-black/80">We craft memorable brands and measurable growth. If you bring curiosity, craft, and commercial smarts, we'd love to meet you. Click the button below to apply.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto text-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient px-6 py-3">Apply Here</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Job Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full name</Label>
                      <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone number</Label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} required />
                    </div>
                    <div>
                      <Label>Portfolio link</Label>
                      <Input value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Can you resume immediately?</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2"><input type="radio" name="resumeNow" checked={canResumeImmediately==='yes'} onChange={() => setCanResumeImmediately('yes')} /> Yes</label>
                        <label className="flex items-center gap-2"><input type="radio" name="resumeNow" checked={canResumeImmediately==='no'} onChange={() => setCanResumeImmediately('no')} /> No</label>
                      </div>
                    </div>

                    <div>
                      <Label>Are you based in Lagos?</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2"><input type="radio" name="basedLagos" checked={basedInLagos==='yes'} onChange={() => setBasedInLagos('yes')} /> Yes</label>
                        <label className="flex items-center gap-2"><input type="radio" name="basedLagos" checked={basedInLagos==='no'} onChange={() => setBasedInLagos('no')} /> No</label>
                      </div>
                    </div>

                    <div>
                      <Label>NYSC completed?</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2"><input type="radio" name="nysc" checked={nyscCompleted==='yes'} onChange={() => setNyscCompleted('yes')} /> Yes</label>
                        <label className="flex items-center gap-2"><input type="radio" name="nysc" checked={nyscCompleted==='no'} onChange={() => setNyscCompleted('no')} /> No</label>
                      </div>
                    </div>
                  </div>

                  {basedInLagos === 'yes' && (
                    <div>
                      <Label>If in Lagos, which area?</Label>
                      <Input value={lagosArea} onChange={e => setLagosArea(e.target.value)} />
                    </div>
                  )}

                  <div>
                    <Label>Which tools or software do you use for email marketing?</Label>
                    <Input value={toolsEmailMarketing} onChange={e => setToolsEmailMarketing(e.target.value)} />
                  </div>

                  <div>
                    <Label>Have you managed influencer or content creator marketing campaigns? If yes, describe your role</Label>
                    <Textarea value={influencerExperience} onChange={e => setInfluencerExperience(e.target.value)} />
                  </div>

                  <div>
                    <Label>Which social media platforms have you managed ads for?</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={platforms.includes('Linkedin')} onChange={() => togglePlatform('Linkedin')} /> Linkedin</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={platforms.includes('Instagram')} onChange={() => togglePlatform('Instagram')} /> Instagram</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={platforms.includes('Tiktok')} onChange={() => togglePlatform('Tiktok')} /> Tiktok</label>
                    </div>
                  </div>

                  <div>
                    <Label>Why are you a good fit for this role?</Label>
                    <Textarea value={whyFit} onChange={e => setWhyFit(e.target.value)} />
                  </div>

                  <div>
                    <Label>Resume (PDF/DOCX)</Label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files?.[0] ?? null)} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} />
                    <span className="text-sm">I consent to having my data stored for recruitment purposes.</span>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CareersSection;
