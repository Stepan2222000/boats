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
      className="group relative overflow-visible cursor-pointer transition-all duration-500"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-boat-${id}`}
      style={{
        transform: isHovered ? 'translateY(-8px) rotateX(2deg)' : 'translateY(0) rotateX(0)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-blue-600/0 to-primary/0 group-hover:from-primary/30 group-hover:via-blue-600/30 group-hover:to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
      
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

      <CardContent className="p-6 bg-background border-2 border-t-0 border-border/50 group-hover:border-primary/30 transition-all duration-500 rounded-b-2xl">
        <div className="mb-4">
          <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
            {price.toLocaleString("ru-RU")} {currency}
          </p>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-5 line-clamp-2 min-h-[3.5rem] leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex flex-wrap gap-5 text-base text-muted-foreground mb-5">
          {year && (
            <div className="flex items-center gap-2 group/item">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{year}</span>
            </div>
          )}
          {length && (
            <div className="flex items-center gap-2 group/item">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                <Ruler className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{length} м</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-base text-muted-foreground pt-5 border-t border-border/50">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="truncate font-semibold">{location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
