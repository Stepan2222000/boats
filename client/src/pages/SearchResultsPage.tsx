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

        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Результаты поиска
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Ваш запрос: <span className="text-foreground font-bold">"{query}"</span>
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
            <Card className="mb-8 border-2 bg-gradient-to-br from-primary/5 to-blue-600/5 hover-elevate">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">AI интерпретировал ваш запрос</h3>
                    <p className="text-sm text-muted-foreground">Вот что мы поняли из вашего запроса:</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {data.interpretedParams.query && (
                    <Badge variant="secondary" className="text-base font-bold px-4 py-2">
                      <Info className="w-4 h-4 mr-2" />
                      Поиск: {data.interpretedParams.query}
                    </Badge>
                  )}
                  {data.interpretedParams.boatType && (
                    <Badge variant="secondary" className="text-base font-bold px-4 py-2">
                      Тип: {data.interpretedParams.boatType}
                    </Badge>
                  )}
                  {data.interpretedParams.minPrice && (
                    <Badge variant="secondary" className="text-base font-bold px-4 py-2">
                      От: {formatPrice(data.interpretedParams.minPrice)}
                    </Badge>
                  )}
                  {data.interpretedParams.maxPrice && (
                    <Badge variant="secondary" className="text-base font-bold px-4 py-2">
                      До: {formatPrice(data.interpretedParams.maxPrice)}
                    </Badge>
                  )}
                  {data.interpretedParams.year && (
                    <Badge variant="secondary" className="text-base font-bold px-4 py-2">
                      Год: {data.interpretedParams.year}
                    </Badge>
                  )}
                  {data.interpretedParams.location && (
                    <Badge variant="secondary" className="text-base font-bold px-4 py-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {data.interpretedParams.location}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-2xl font-black">
                Найдено объявлений: <span className="text-primary">{data.boats.length}</span>
              </h2>
            </div>

            {data.boats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
