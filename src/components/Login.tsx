
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-midnight-black flex items-center justify-center">
      <Card className="bg-charcoal-gray border-royal-gold/20 text-white max-w-md w-full mx-6">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/c85aa68f-ad21-41fb-a103-805c14e0490c.png" 
            alt="The Kontent Hub Logo" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <CardTitle className="text-royal-gold font-montserrat font-semibold text-xl">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-midnight-black border-charcoal-gray text-white focus:border-royal-gold"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-midnight-black border-charcoal-gray text-white focus:border-royal-gold"
                placeholder="Enter your password"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-gold hover:bg-button-hover text-midnight-black font-montserrat font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
