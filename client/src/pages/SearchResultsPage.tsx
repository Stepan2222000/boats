import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter/use-browser-location";
import Header from "@/components/Header";
import BoatCard from "@/components/BoatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Info, ArrowLeft, Loader2, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Boat } from "@shared/schema";

interface SearchResult {
  boats: Boat[];
  interpretedParams: {
    query: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    year: number | null;
    boatType: string | null;
    location: string | null;
  };
}

export default function SearchResultsPage() {
  const search = useSearch();
  const query = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('q') || '';
  }, [search]);

  const { data, isLoading, error } = useQuery<SearchResult>({
    queryKey: ['/api/boats/ai-search', query],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/boats/ai-search', { query });
      return await response.json();
    },
    enabled: !!query,
  });

  const formatPrice = (price: number | null) => {
    if (!price) return '';
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover-elevate"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Card className="p-8 text-center">
            <CardContent>
              <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Введите поисковый запрос</h2>
              <p className="text-muted-foreground">Используйте поиск в шапке страницы</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="mb-2 hover-elevate"
          data-testid="button-back"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Назад
        </Button>

        <div className="mb-3">
          <h1 className="text-xl md:text-2xl font-bold mb-1">
            Результаты поиска
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Ваш запрос: <span className="text-foreground font-semibold">"{query}"</span>
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-primary flex items-center gap-2 justify-center">
                <Sparkles className="w-5 h-5" />
                AI анализирует ваш запрос...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-xl text-destructive">Ошибка при поиске. Попробуйте еще раз.</p>
          </div>
        )}

        {data && !isLoading && (
          <>
            <Card className="mb-4 border bg-gradient-to-br from-primary/5 to-blue-600/5">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">AI интерпретировал запрос:</h3>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {data.interpretedParams.query && (
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
                      {data.interpretedParams.query}
                    </Badge>
                  )}
                  {data.interpretedParams.boatType && (
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
                      Тип: {data.interpretedParams.boatType}
                    </Badge>
                  )}
                  {data.interpretedParams.minPrice && (
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
                      От: {formatPrice(data.interpretedParams.minPrice)}
                    </Badge>
                  )}
                  {data.interpretedParams.maxPrice && (
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
                      До: {formatPrice(data.interpretedParams.maxPrice)}
                    </Badge>
                  )}
                  {data.interpretedParams.year && (
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
                      Год: {data.interpretedParams.year}
                    </Badge>
                  )}
                  {data.interpretedParams.location && (
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-1 inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {data.interpretedParams.location}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mb-3">
              <h2 className="text-base md:text-lg font-semibold">
                Найдено объявлений: <span className="text-primary">{data.boats.length}</span>
              </h2>
            </div>

            {data.boats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {data.boats.map((boat: Boat) => (
                  <BoatCard
                    key={boat.id}
                    id={boat.id}
                    title={boat.title}
                    price={boat.price}
                    currency={boat.currency}
                    location={boat.location}
                    year={boat.year}
                    length={boat.length ? parseFloat(boat.length) : undefined}
                    photoCount={boat.photoCount || 0}
                    isPromoted={boat.isPromoted || false}
                    sellerName={boat.sellerName || "BESTMARINE"}
                    sellerRating={boat.sellerRating ? parseFloat(boat.sellerRating) : 4.7}
                    sellerReviewCount={boat.sellerReviewCount || 49}
                    phone={boat.phone || "+7 (999) 123-45-67"}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-xl text-muted-foreground mb-4">
                  К сожалению, ничего не найдено по вашему запросу.
                </p>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска или вернуться на главную страницу.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
