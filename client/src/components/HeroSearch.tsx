import { Search, Sparkles, TrendingUp, Zap, Globe, Award, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [listingCount, setListingCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(0);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsAnimated(true);
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let currentStep = 0;
      const counter = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        setListingCount(Math.floor(10000 * progress));
        setSellerCount(Math.floor(1500 * progress));
        setSatisfactionRate(Math.floor(98 * progress));
        
        if (currentStep >= steps) {
          clearInterval(counter);
          setListingCount(10000);
          setSellerCount(1500);
          setSatisfactionRate(98);
        }
      }, interval);
      
      return () => clearInterval(counter);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
      {/* Advanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-1/4 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ 
        backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium AI Badge with shimmer */}
          <Badge className="mb-8 bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground px-6 py-3 text-base font-semibold border-0 shadow-2xl bg-[length:200%_100%] animate-pulse">
            <Sparkles className="w-5 h-5 mr-2 inline animate-pulse" />
            Интеллектуальный поиск нового поколения
          </Badge>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Найдите свой
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
              катер мечты
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed font-medium">
            Крупнейшая международная платформа водной техники
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-base md:text-lg text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-medium">Россия и СНГ</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-medium">Verified Dealers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium">Защита сделок</span>
            </div>
          </div>

          {/* Premium Search box */}
          <div className="bg-background/98 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] p-8 md:p-10 border-2 border-border/30 hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground z-10" />
                <Input
                  type="search"
                  placeholder='Опишите желаемое: "Яхта Sea Ray 2020+" или "катер до 3 млн в Сочи"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="relative pl-16 pr-16 h-16 text-xl border-2 border-border/50 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  data-testid="input-hero-search"
                />
                {searchQuery && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      <div className="absolute inset-0 bg-primary/20 blur-lg animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary hover:from-primary/90 hover:via-blue-600/90 hover:to-primary/90 shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 bg-[length:200%_100%] hover:bg-[position:100%_0]"
                data-testid="button-hero-search"
              >
                <Zap className="w-6 h-6 mr-3" />
                Найти
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="secondary"
                  size="lg"
                  onClick={() => console.log("Category clicked:", category)}
                  data-testid={`button-category-${category.toLowerCase()}`}
                  className="hover-elevate px-8 py-6 text-lg font-semibold rounded-xl border-2 border-transparent hover:border-primary/30 transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Animated Stats with premium styling */}
          <div className="grid grid-cols-3 gap-12 mt-24 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="relative inline-block">
                <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 tabular-nums">
                  {statsAnimated ? `${listingCount.toLocaleString('ru-RU')}+` : '0'}
                </div>
                <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-base md:text-lg text-muted-foreground font-semibold uppercase tracking-wider">Объявлений</div>
            </div>
            <div className="text-center group">
              <div className="relative inline-block">
                <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 tabular-nums">
                  {statsAnimated ? `${sellerCount.toLocaleString('ru-RU')}+` : '0'}
                </div>
                <div className="absolute -inset-4 bg-blue-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-base md:text-lg text-muted-foreground font-semibold uppercase tracking-wider">Продавцов</div>
            </div>
            <div className="text-center group">
              <div className="relative inline-block">
                <div className="flex items-center justify-center gap-2 text-5xl md:text-7xl font-black bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent mb-3 tabular-nums">
                  {statsAnimated ? `${satisfactionRate}%` : '0%'}
                </div>
                <div className="absolute -inset-4 bg-green-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-base md:text-lg text-muted-foreground font-semibold uppercase tracking-wider">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
