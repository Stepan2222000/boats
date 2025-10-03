import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Share2, 
  MapPin,
  Calendar,
  Ruler,
  Users,
  Anchor,
  Gauge,
  Fuel,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";

interface BoatListingDetailProps {
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    location: string;
    images: string[];
    specs: {
      brand: string;
      model: string;
      year: number;
      length: number;
      beam?: number;
      passengers?: number;
      engineType?: string;
      horsePower?: number;
      engineHours?: number;
      fuelType?: string;
      condition: string;
    };
    description: string;
    seller: {
      name: string;
      type: "private" | "company";
      rating?: number;
      reviewsCount?: number;
      responseRate?: number;
    };
    aiGenerated?: string[];
  };
}

export default function BoatListingDetail({ listing }: BoatListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleShowPhone = () => {
    setShowPhone(true);
    console.log("Phone number revealed");
  };

  const handleMessage = () => {
    console.log("Open message dialog");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-[4/3]">
              {listing.images.length > 0 ? (
                <>
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur"
                    onClick={prevImage}
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur"
                    onClick={nextImage}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? "bg-primary w-6" : "bg-background/60"
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Anchor className="w-24 h-24 text-primary/30" />
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Характеристики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Бренд</p>
                    <p className="font-medium">{listing.specs.brand}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Модель</p>
                    <p className="font-medium">{listing.specs.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Год
                    </p>
                    <p className="font-medium">{listing.specs.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Ruler className="w-4 h-4" /> Длина
                    </p>
                    <p className="font-medium">{listing.specs.length} м</p>
                  </div>
                  {listing.specs.beam && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ширина</p>
                      <p className="font-medium">{listing.specs.beam} м</p>
                    </div>
                  )}
                  {listing.specs.passengers && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-4 h-4" /> Пассажиры
                      </p>
                      <p className="font-medium">{listing.specs.passengers} чел</p>
                    </div>
                  )}
                  {listing.specs.horsePower && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Gauge className="w-4 h-4" /> Мощность
                      </p>
                      <p className="font-medium">{listing.specs.horsePower} л.с.</p>
                    </div>
                  )}
                  {listing.specs.engineHours !== undefined && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Моточасы</p>
                      <p className="font-medium">{listing.specs.engineHours} ч</p>
                    </div>
                  )}
                  {listing.specs.fuelType && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Fuel className="w-4 h-4" /> Топливо
                      </p>
                      <p className="font-medium">{listing.specs.fuelType}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Состояние</p>
                    <p className="font-medium">{listing.specs.condition}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
                {listing.aiGenerated && listing.aiGenerated.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Автоматически добавлено:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {listing.aiGenerated.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {listing.price.toLocaleString("ru-RU")} {listing.currency}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {!showPhone ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleShowPhone}
                        data-testid="button-show-phone"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Показать телефон
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        size="lg"
                        variant="outline"
                        data-testid="button-call"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        +7 (999) 123-45-67
                      </Button>
                    )}
                    
                    <Button
                      className="w-full"
                      size="lg"
                      variant="default"
                      onClick={handleMessage}
                      data-testid="button-message"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Написать сообщение
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsFavorite(!isFavorite)}
                      data-testid="button-favorite-detail"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current text-destructive" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      data-testid="button-share"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Продавец</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {listing.seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{listing.seller.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {listing.seller.type === "company" && (
                          <Badge variant="secondary" className="text-xs">
                            Компания
                          </Badge>
                        )}
                        {listing.seller.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{listing.seller.rating}</span>
                            <span className="text-muted-foreground">
                              ({listing.seller.reviewsCount})
                            </span>
                          </div>
                        )}
                      </div>
                      {listing.seller.responseRate && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Отвечает в {listing.seller.responseRate}% случаев
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid="button-seller-profile"
                  >
                    Все объявления продавца
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
