import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, ExternalLink, Clock, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onShare?: (product: Product) => void;
  onProductClick?: (productId: string) => void;
}

export const ProductCard = ({ product, onShare, onProductClick }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();

  const handleAffiliateClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
    // Track clicks
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: product.affiliateUrl,
      });
    } else {
      navigator.clipboard.writeText(product.affiliateUrl);
      toast({
        title: "Link Copied!",
        description: "Product link copied to clipboard",
      });
    }
    
    if (onShare) {
      onShare(product);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-card to-muted/20">
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-48 bg-muted animate-pulse" />
        )}
        <img
          src={product.imageUrl}
          alt={product.title}
          className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'block' : 'hidden'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <Badge className="bg-accent text-accent-foreground">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {product.isTimeLimited && (
            <Badge variant="destructive">
              <Clock className="w-3 h-3 mr-1" />
              Limited Time
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-primary text-primary-foreground">
              {product.discount}
            </Badge>
          )}
        </div>

        {/* Share button overlay */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <span className="text-2xl font-bold text-primary">{product.price}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {product.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAffiliateClick}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};