import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Settings } from 'lucide-react';
import { ProductForm, CATEGORIES } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onAddProduct: (product: ProductForm) => void;
}

const initialForm: ProductForm = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  affiliateUrl: '',
  category: 'Tech',
  isFeatured: false,
  isTimeLimited: false,
  discount: '',
};

export const AdminPanel = ({ onAddProduct }: AdminPanelProps) => {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.price || !form.imageUrl || !form.affiliateUrl) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddProduct(form);
    setForm(initialForm);
    setIsOpen(false);
    
    toast({
      title: "Product Added!",
      description: "Your product has been added to the store",
    });
  };

  const updateForm = (field: keyof ProductForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-50 shadow-xl bg-gradient-to-r from-primary to-secondary hover:shadow-glow" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Add Affiliate Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="Amazing Product Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={form.price}
                onChange={(e) => updateForm('price', e.target.value)}
                placeholder="$29.99"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              placeholder="Describe why this product is irresistible..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(e) => updateForm('imageUrl', e.target.value)}
              placeholder="https://example.com/product-image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateUrl">Affiliate URL *</Label>
            <Input
              id="affiliateUrl"
              type="url"
              value={form.affiliateUrl}
              onChange={(e) => updateForm('affiliateUrl', e.target.value)}
              placeholder="https://affiliate-link.com/product"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={(value) => updateForm('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount Badge</Label>
              <Input
                id="discount"
                value={form.discount}
                onChange={(e) => updateForm('discount', e.target.value)}
                placeholder="50% OFF"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured Product</Label>
              <Switch
                id="featured"
                checked={form.isFeatured}
                onCheckedChange={(checked) => updateForm('isFeatured', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="timeLimited">Time Limited Offer</Label>
              <Switch
                id="timeLimited"
                checked={form.isTimeLimited}
                onCheckedChange={(checked) => updateForm('isTimeLimited', checked)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary">
              Add Product
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};