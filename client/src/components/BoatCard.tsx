import { Heart, MapPin, Calendar, Ruler, Anchor, Sparkles, Phone, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  sellerName?: string;
  sellerRating?: string | number;
  sellerReviewCount?: number;
  phone?: string;
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
  photoCount,
  sellerName = "BESTMARINE",
  sellerRating = 4.7,
  sellerReviewCount = 49,
  phone = "+7 (999) 123-45-67"
}: BoatCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [showPhone, setShowPhone] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  const handleShowPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPhone(true);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Send message to seller:", sellerName);
  };

  const handleCardClick = () => {
    console.log("Card clicked:", id);
  };

  const rating = typeof sellerRating === 'string' ? parseFloat(sellerRating) : sellerRating;

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer hover-elevate flex flex-col"
      onClick={handleCardClick}
      data-testid={`card-boat-${id}`}
    >
      {/* Image Section - Top */}
      <div className="relative w-full aspect-[4/3]">
        <div className="relative w-full h-full bg-muted overflow-hidden">
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

      {/* Content Section - Bottom */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Price - Large and prominent */}
        <div className="text-2xl font-black text-foreground">
          {price.toLocaleString("ru-RU")} ₽
        </div>

        {/* Title - Blue color */}
        <h3 className="text-base font-semibold text-primary line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Details with icons in a row */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {year && (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-semibold">{year}</span>
            </div>
          )}
          {length && (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ruler className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-semibold">{length} м</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate font-semibold">{location}</span>
        </div>

        {/* Seller Info - Desktop Only */}
        <div className="hidden md:flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold text-sm">
                {sellerName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">{sellerName}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < rating
                          ? "fill-yellow-400/50 text-yellow-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {rating} · {sellerReviewCount} отзывов
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Desktop Only */}
        <div className="hidden md:flex gap-2 pt-2">
          <Button
            variant="default"
            className="flex-1 font-bold"
            onClick={handleShowPhone}
            data-testid={`button-phone-${id}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            {showPhone ? phone : "Показать телефон"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 font-bold border-primary/40 hover:bg-primary/5"
            onClick={handleMessage}
            data-testid={`button-message-${id}`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Написать
          </Button>
        </div>
      </div>
    </Card>
  );
}
