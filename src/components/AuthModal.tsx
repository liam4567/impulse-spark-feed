import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { authFormSchema } from '@/lib/validations';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validatedData = authFormSchema.parse({ email, password });

      if (isSignUp) {
        const { error } = await signUp(validatedData.email, validatedData.password);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration.",
          });
          onClose();
        }
      } else {
        const { error } = await signIn(validatedData.email, validatedData.password);
        
        if (error) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          onClose();
        }
      }
    } catch (error: any) {
      toast({
        title: "Validation error",
        description: error.errors?.[0]?.message || "Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? 'Sign up to add and manage products' 
              : 'Sign in to access admin features'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>{isSignUp ? 'Sign Up' : 'Sign In'}</>
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
