import { Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Катера",
    "Яхты",
    "Гидроциклы",
    "Лодки",
    "Парусные яхты"
  ];

  const handleSearch = () => {
    console.log("Search triggered:", searchQuery);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* AI Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground px-4 py-2 text-sm font-medium border-0">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Поиск с искусственным интеллектом
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Найдите свой катер мечты
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Самый большой маркетплейс водной техники в России
            <span className="block mt-2 text-lg">Умный AI-поиск • Проверенные продавцы • 10,000+ объявлений</span>
          </p>

          {/* Search box with premium styling */}
          <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-border/50">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder='Опишите что ищете: "Sea Ray от 2015" или "катер до 10 метров в Сочи"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-14 h-14 text-lg border-2 focus-visible:ring-2 focus-visible:ring-primary/20"
                  data-testid="input-hero-search"
                />
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
                data-testid="button-hero-search"
              >
                <Zap className="w-5 h-5 mr-2" />
                Найти
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="secondary"
                  size="lg"
                  onClick={() => console.log("Category clicked:", category)}
                  data-testid={`button-category-${category.toLowerCase()}`}
                  className="hover-elevate px-6 font-medium"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Объявлений</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">1,500+</div>
              <div className="text-sm text-muted-foreground">Продавцов</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold text-foreground mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
                98%
              </div>
              <div className="text-sm text-muted-foreground">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
