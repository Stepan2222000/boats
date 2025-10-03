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
      className="group relative overflow-hidden cursor-pointer hover-elevate flex flex-row"
      onClick={handleCardClick}
      data-testid={`card-boat-${id}`}
    >
      {/* Image Section - Left side */}
      <div className="relative w-48 sm:w-56 md:w-64 flex-shrink-0">
        <div className="relative h-full bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-500/10">
              <Anchor className="w-20 h-20 text-primary/20" />
            </div>
          )}
          
          {/* Top left badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold">
              {photoCount} фото
            </Badge>
            {isPromoted && (
              <Badge 
                variant="default" 
                className="bg-primary px-3 py-1 text-xs font-bold" 
                data-testid={`badge-promoted-${id}`}
              >
                <Sparkles className="w-3 h-3 mr-1 inline" />
                ПРОМО
              </Badge>
            )}
          </div>

          {/* Favorite button - top right */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background w-9 h-9 rounded-lg ${favorite ? "text-destructive" : ""}`}
            onClick={handleFavoriteClick}
            data-testid={`button-favorite-${id}`}
          >
            <Heart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Content Section - Right side */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        {/* Price - Large and prominent */}
        <div className="text-2xl sm:text-3xl font-black text-foreground">
          {price.toLocaleString("ru-RU")} ₽
        </div>

        {/* Title - Blue color */}
        <h3 className="text-base sm:text-lg font-semibold text-primary line-clamp-2">
          {title}
        </h3>

        {/* Details with icons in a row */}
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

        {/* Location - at the bottom */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-2 border-t border-border/50">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate font-semibold">{location}</span>
        </div>
      </div>
    </Card>
  );
}
