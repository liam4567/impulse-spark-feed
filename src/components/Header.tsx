import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Search, Zap, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onSearch: (query: string) => void;
  totalProducts: number;
}

export const Header = ({ isDark, onToggleTheme, onSearch, totalProducts }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate email signup
    toast({
      title: "Welcome to the Club!",
      description: "You'll be the first to know about amazing deals!",
    });
    setEmail('');
    setIsEmailDialogOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ImpulseBuyAddict
              </h1>
              <Badge variant="outline" className="text-xs">
                {totalProducts} Hot Deals
              </Badge>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search for deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Email signup */}
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Mail className="w-4 h-4 mr-2" />
                  Deal Alerts
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Get Exclusive Deal Alerts</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Be the first to know about lightning deals and exclusive offers!
                  </p>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                    Subscribe
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Theme toggle */}
            <Button variant="outline" size="icon" onClick={onToggleTheme}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search for deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </header>
  );
};