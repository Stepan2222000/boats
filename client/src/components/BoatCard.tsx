import { Heart, MapPin, Calendar, Ruler, Anchor } from "lucide-react";
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
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={handleCardClick}
      data-testid={`card-boat-${id}`}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Anchor className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-2">
          {isPromoted && (
            <Badge variant="default" className="bg-primary" data-testid={`badge-promoted-${id}`}>
              Промо
            </Badge>
          )}
        </div>

        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {photoCount} фото
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute bottom-2 right-2 bg-background/90 backdrop-blur ${favorite ? "text-destructive" : ""}`}
          onClick={handleFavoriteClick}
          data-testid={`button-favorite-${id}`}
        >
          <Heart className={`w-5 h-5 ${favorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-2xl font-bold text-foreground">
            {price.toLocaleString("ru-RU")} {currency}
          </p>
        </div>

        <h3 className="text-base font-medium text-foreground mb-3 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{year}</span>
            </div>
          )}
          {length && (
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{length} м</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3 pt-3 border-t">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
