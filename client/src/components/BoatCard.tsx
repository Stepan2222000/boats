import { Heart, MapPin, Calendar, Ruler, Anchor, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface BoatCardProps {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  year?: number;
  length?: number;
  imageUrl?: string;
  isFavorite?: boolean;
  isPromoted?: boolean;
  photoCount: number;
}

export default function BoatCard({
  id,
  title,
  price,
  currency,
  location,
  year,
  length,
  imageUrl,
  isFavorite = false,
  isPromoted = false,
  photoCount
}: BoatCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    console.log("Favorite toggled for:", id);
  };

  const handleCardClick = () => {
    console.log("Card clicked:", id);
  };

  return (
    <Card
      className="group relative overflow-visible cursor-pointer transition-all duration-700"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-boat-${id}`}
      style={{
        transform: isHovered ? 'translateY(-12px) rotateX(3deg) scale(1.02)' : 'translateY(0) rotateX(0) scale(1)',
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Multi-layer glow effects on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-blue-600/0 to-primary/0 group-hover:from-primary/40 group-hover:via-blue-600/40 group-hover:to-primary/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/0 to-blue-600/0 group-hover:from-primary/20 group-hover:to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
      
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 brightness-110' : 'scale-100'}`}
              style={{ filter: isHovered ? 'saturate(1.2)' : 'saturate(1)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-blue-500/10 to-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Anchor className="w-24 h-24 text-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:text-primary/40" />
            </div>
          )}
          
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            {isPromoted && (
              <Badge 
                variant="default" 
                className="bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground border-0 shadow-2xl px-4 py-2 text-sm font-bold backdrop-blur-sm bg-[length:200%_100%] animate-pulse" 
                data-testid={`badge-promoted-${id}`}
              >
                <Sparkles className="w-4 h-4 mr-1.5 inline animate-pulse" />
                ПРОМО
              </Badge>
            )}
          </div>

          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/98 backdrop-blur-xl shadow-xl px-4 py-2 text-sm font-semibold border border-border/50">
              {photoCount} фото
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute bottom-4 right-4 bg-background/98 backdrop-blur-xl shadow-2xl hover:bg-background transition-all duration-300 w-12 h-12 rounded-xl border border-border/50 ${favorite ? "text-destructive scale-110 border-destructive/50" : ""}`}
            onClick={handleFavoriteClick}
            data-testid={`button-favorite-${id}`}
          >
            <Heart className={`w-6 h-6 transition-all duration-300 ${favorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <CardContent className="relative p-7 bg-background border-2 border-t-0 border-border/60 group-hover:border-primary/40 transition-all duration-700 rounded-b-2xl overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-blue-600/0 group-hover:from-primary/5 group-hover:to-blue-600/5 transition-opacity duration-700"></div>
        
        <div className="relative">
          <div className="mb-5">
            <div className="relative inline-block">
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground via-foreground/95 to-foreground/70 bg-clip-text text-transparent tracking-tight">
                {price.toLocaleString("ru-RU")} {currency}
              </p>
              {/* Decorative underline */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          <h3 className="text-lg font-black text-foreground mb-6 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          <div className="flex flex-wrap gap-6 text-base text-muted-foreground mb-6">
            {year && (
              <div className="flex items-center gap-2.5 group/item">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-blue-600/10 flex items-center justify-center group-hover/item:from-primary/25 group-hover/item:to-blue-600/20 transition-all duration-300 group-hover/item:scale-110">
                  <Calendar className="w-4.5 h-4.5 text-primary relative z-10" />
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-bold group-hover/item:text-foreground transition-colors">{year}</span>
              </div>
            )}
            {length && (
              <div className="flex items-center gap-2.5 group/item">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-blue-600/10 flex items-center justify-center group-hover/item:from-primary/25 group-hover/item:to-blue-600/20 transition-all duration-300 group-hover/item:scale-110">
                  <Ruler className="w-4.5 h-4.5 text-primary relative z-10" />
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-bold group-hover/item:text-foreground transition-colors">{length} м</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-base text-muted-foreground pt-6 border-t border-border/60 group-hover:border-primary/30 transition-colors">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="truncate font-bold">{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
