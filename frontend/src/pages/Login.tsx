import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // Error is handled in context
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
             Manage your projects & tasks
          </h1>
        </div>

        {/* Login Card */}
        <div className="border-4 border-foreground bg-card p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
            Sign In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 border-4 border-destructive bg-destructive/10 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-destructive">Error</p>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wide">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-4 border-foreground bg-background h-12 text-lg font-mono focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wide">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-4 border-foreground bg-background h-12 text-lg font-mono focus:ring-primary focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold uppercase tracking-wide border-4 border-foreground bg-primary text-primary-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-md transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
