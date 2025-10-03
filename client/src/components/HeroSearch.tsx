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
    <div className="relative min-h-[95vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
      {/* Advanced multi-layer animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-primary/15 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-1/4 w-[900px] h-[900px] bg-gradient-to-tl from-blue-400/15 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-tr from-primary/10 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-bl from-blue-600/10 to-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/5 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Premium grid pattern with gradient */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/5 to-background/20"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Ultra-premium AI Badge with animated shimmer */}
          <div className="relative inline-block mb-10">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-blue-600 to-primary rounded-full blur-xl opacity-60 animate-glow"></div>
            <Badge className="relative bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground px-8 py-4 text-lg font-bold border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              <Sparkles className="w-6 h-6 mr-3 inline animate-pulse relative z-10" />
              <span className="relative z-10">Интеллектуальный поиск нового поколения</span>
            </Badge>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.9] tracking-tight">
            <span className="inline-block bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent relative">
              Найдите свой
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full"></div>
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer relative">
              катер мечты
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-blue-600/10 to-primary/10 rounded-3xl blur-2xl -z-10 opacity-50"></div>
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

          {/* Ultra-premium glassmorphic search box */}
          <div className="relative group/search">
            {/* Outer glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-600/20 to-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover/search:opacity-100 transition-all duration-500"></div>
            
            <div className="relative bg-background/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_70px_rgba(0,0,0,0.2)] p-10 md:p-12 border-2 border-border/40 hover:border-primary/40 transition-all duration-500 overflow-hidden">
              {/* Inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[2rem]"></div>
              
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-[2rem]"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-600/10 to-transparent rounded-br-[2rem]"></div>
              
              <div className="relative flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  {/* Input glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-muted-foreground z-10 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                    <Input
                      type="search"
                      placeholder='Опишите желаемое: "Яхта Sea Ray 2020+" или "катер до 3 млн в Сочи"'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="relative pl-16 pr-16 h-18 text-xl border-2 border-border/60 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm font-medium"
                      data-testid="input-hero-search"
                    />
                    {searchQuery && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
                        <div className="relative">
                          <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                          <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse"></div>
                          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-glow"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="relative h-18 px-14 text-xl font-black bg-gradient-to-r from-primary via-blue-600 to-primary shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 bg-[length:200%_100%] hover:bg-[position:100%_0] overflow-hidden group"
                  data-testid="button-hero-search"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <Zap className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Найти</span>
                  <ChevronRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="relative flex flex-wrap justify-center gap-4 mt-10">
                {categories.map((category, idx) => (
                  <Button
                    key={category}
                    variant="secondary"
                    size="lg"
                    onClick={() => console.log("Category clicked:", category)}
                    data-testid={`button-category-${category.toLowerCase()}`}
                    className="relative hover-elevate px-10 py-7 text-lg font-bold rounded-2xl border-2 border-border/40 hover:border-primary/40 transition-all duration-300 bg-background/60 backdrop-blur-sm overflow-hidden group"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">{category}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Premium animated stats with glassmorphic cards */}
          <div className="grid grid-cols-3 gap-8 mt-28 max-w-5xl mx-auto">
            <div className="relative group">
              {/* Card glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-background/40 backdrop-blur-xl border-2 border-border/40 rounded-3xl p-8 group-hover:border-primary/40 transition-all duration-500 overflow-hidden">
                {/* Inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative text-center">
                  <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent mb-4 tabular-nums leading-none">
                    {statsAnimated ? `${listingCount.toLocaleString('ru-RU')}+` : '0'}
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto mb-4"></div>
                  <div className="text-lg text-muted-foreground font-bold uppercase tracking-[0.2em]">Объявлений</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-background/40 backdrop-blur-xl border-2 border-border/40 rounded-3xl p-8 group-hover:border-blue-600/40 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative text-center">
                  <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent mb-4 tabular-nums leading-none">
                    {statsAnimated ? `${sellerCount.toLocaleString('ru-RU')}+` : '0'}
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-primary rounded-full mx-auto mb-4"></div>
                  <div className="text-lg text-muted-foreground font-bold uppercase tracking-[0.2em]">Продавцов</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-background/40 backdrop-blur-xl border-2 border-border/40 rounded-3xl p-8 group-hover:border-green-500/40 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative text-center">
                  <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-green-500 via-green-600 to-green-500 bg-clip-text text-transparent mb-4 tabular-nums leading-none">
                    {statsAnimated ? `${satisfactionRate}%` : '0%'}
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4"></div>
                  <div className="text-lg text-muted-foreground font-bold uppercase tracking-[0.2em]">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
