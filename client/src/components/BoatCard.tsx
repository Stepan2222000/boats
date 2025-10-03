import { Heart, MapPin, Calendar, Ruler, Anchor, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  const handleCardClick = () => {
    console.log("Card clicked:", id);
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer hover-elevate"
      onClick={handleCardClick}
      data-testid={`card-boat-${id}`}
    >
      {/* Image Section - Larger proportion */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-500/10">
            <Anchor className="w-24 h-24 text-primary/20" />
          </div>
        )}
        
        {/* Top badges */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold">
            {photoCount} фото
          </Badge>
        </div>

        {isPromoted && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant="default" 
              className="bg-primary px-3 py-1 text-xs font-bold" 
              data-testid={`badge-promoted-${id}`}
            >
              <Sparkles className="w-3 h-3 mr-1 inline" />
              ПРОМО
            </Badge>
          </div>
        )}

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 ${isPromoted ? 'right-24' : ''} bg-background/90 backdrop-blur-sm hover:bg-background w-9 h-9 rounded-lg ${favorite ? "text-destructive" : ""}`}
          onClick={handleFavoriteClick}
          data-testid={`button-favorite-${id}`}
        >
          <Heart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Content Section - Compact */}
      <div className="p-4 bg-background space-y-3">
        {/* Price - Large and prominent */}
        <div className="text-2xl md:text-3xl font-black text-foreground">
          {price.toLocaleString("ru-RU")} ₽
        </div>
        
        {/* Divider */}
        <div className="h-px bg-border"></div>

        {/* Title - Blue color */}
        <h3 className="text-base font-semibold text-primary line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>

        {/* Details with icons */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {year && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{year}</span>
            </div>
          )}
          {length && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ruler className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{length} м</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border"></div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate font-semibold">{location}</span>
        </div>
      </div>
    </Card>
  );
}
