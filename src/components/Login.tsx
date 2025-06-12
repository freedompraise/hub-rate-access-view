
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
    <div className="min-h-screen bg-tkh-black flex items-center justify-center">
      <Card className="bg-white border-secondary/20 text-tkh-black max-w-md w-full mx-6">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/283ca45c-93b6-4e0d-b037-e991c94291dc.png" 
            alt="The Kontent Hub Logo" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <CardTitle className="text-accent font-serif font-semibold text-xl">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-tkh-black/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-input text-tkh-black focus:border-accent"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-tkh-black/90">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-input text-tkh-black focus:border-accent"
                placeholder="Enter your password"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary font-sans font-semibold"
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
