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
      className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 border-2 hover:border-primary/20 hover:shadow-xl"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-boat-${id}`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-blue-500/10 to-primary/5">
            <Anchor className="w-20 h-20 text-primary/30" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          {isPromoted && (
            <Badge 
              variant="default" 
              className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground border-0 shadow-lg px-3 py-1" 
              data-testid={`badge-promoted-${id}`}
            >
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Промо
            </Badge>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/95 backdrop-blur-md shadow-md px-3 py-1">
            {photoCount} фото
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute bottom-3 right-3 bg-background/95 backdrop-blur-md shadow-lg hover:bg-background transition-all ${favorite ? "text-destructive scale-110" : ""}`}
          onClick={handleFavoriteClick}
          data-testid={`button-favorite-${id}`}
        >
          <Heart className={`w-5 h-5 transition-all ${favorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="mb-3">
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {price.toLocaleString("ru-RU")} {currency}
          </p>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-4 line-clamp-2 min-h-[3rem] leading-snug">
          {title}
        </h3>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          {year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">{year}</span>
            </div>
          )}
          {length && (
            <div className="flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-primary" />
              <span className="font-medium">{length} м</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground pt-4 border-t">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate font-medium">{location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
