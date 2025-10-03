import { Search, Sparkles, TrendingUp, Zap, Globe, Award, Shield, ChevronRight, Anchor } from "lucide-react";
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
      {/* Ultra-advanced multi-layer animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs with enhanced effects */}
        <div className="absolute -top-1/2 -right-1/4 w-[1200px] h-[1200px] bg-gradient-to-br from-primary/20 via-blue-600/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-1/4 w-[1100px] h-[1100px] bg-gradient-to-tl from-blue-400/20 via-primary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] bg-gradient-to-tr from-primary/15 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-bl from-blue-600/15 via-primary/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/8 to-transparent rounded-full blur-2xl animate-scale-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[450px] bg-gradient-to-l from-primary/8 to-transparent rounded-full blur-2xl animate-scale-pulse" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Particle-like decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full blur-sm animate-particle-float"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-600/40 rounded-full blur-sm animate-particle-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/40 rounded-full blur-sm animate-particle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500/40 rounded-full blur-sm animate-particle-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-primary/40 rounded-full blur-sm animate-particle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Premium grid pattern with gradient */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ 
        backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/5 to-background/30"></div>
      
      {/* Decorative light rays */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-600/50 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
      </div>
      
      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.06]">
        <svg className="w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 Q150,50 300,25 T600,25 T900,25 T1200,25 L1200,120 L0,120 Z" fill="currentColor" className="text-primary"/>
        </svg>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Ultra-premium AI Badge with multiple animation layers */}
          <div className="relative inline-block mb-12 group/badge">
            {/* Pulsing glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-blue-600 to-primary rounded-full blur-xl opacity-60 animate-glow"></div>
            
            {/* Badge content */}
            <Badge className="relative bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground px-10 py-5 text-xl font-black border-0 shadow-2xl overflow-hidden rounded-full">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              
              {/* Sparkle icon with enhanced animation */}
              <div className="relative z-10 inline-flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                  <div className="absolute inset-0 bg-white/50 blur-md rounded-full animate-ping"></div>
                </div>
                <span className="tracking-wide">Интеллектуальный поиск нового поколения</span>
              </div>
            </Badge>
          </div>

          {/* Epic hero title with advanced effects */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 leading-[0.9] tracking-tight">
            <span className="inline-block relative">
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                Найдите свой
              </span>
              {/* Decorative underline with animation */}
              <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-blue-600/60 to-transparent rounded-full opacity-70"></div>
              <div className="absolute -bottom-3 left-0 w-0 h-1.5 bg-gradient-to-r from-primary to-blue-600 rounded-full animate-[slideRight_2s_ease-in-out_infinite]"></div>
            </span>
            <br />
            <span className="inline-block relative mt-4">
              {/* Multi-layer glow effect */}
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 via-blue-600/20 to-primary/20 rounded-3xl blur-3xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 via-blue-600/15 to-primary/15 rounded-3xl blur-2xl opacity-80 animate-glow"></div>
              
              {/* Animated gradient text */}
              <span className="relative bg-gradient-to-r from-primary via-blue-600 via-primary to-blue-600 bg-clip-text text-transparent animate-gradient-shift">
                катер мечты
              </span>
              
              {/* Sparkle decorations */}
              <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-primary/60 animate-pulse" />
              <Sparkles className="absolute -bottom-4 -left-4 w-6 h-6 text-blue-600/60 animate-pulse" style={{ animationDelay: '1s' }} />
            </span>
          </h1>
          
          <p className="text-2xl md:text-4xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed font-semibold">
            <span className="text-foreground">⚓ Крупнейшая</span> международная платформа водной техники
          </p>

          {/* Premium trust badges with maritime theme */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-20 text-lg md:text-xl">
            <div className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all duration-300 hover-elevate">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Anchor className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-foreground">Россия и СНГ</span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all duration-300 hover-elevate">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-foreground">Verified Dealers</span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all duration-300 hover-elevate">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-foreground">Защита сделок</span>
            </div>
          </div>

          {/* Epic glassmorphic search command center */}
          <div className="relative group/search">
            {/* Multi-layer outer glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-blue-600/30 to-primary/30 rounded-[2.5rem] blur-3xl opacity-0 group-hover/search:opacity-100 transition-all duration-700 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-600/20 to-primary/20 rounded-[2.25rem] blur-2xl opacity-60 group-hover/search:opacity-100 transition-all duration-500"></div>
            
            <div className="relative bg-background/98 backdrop-blur-3xl rounded-[2rem] shadow-[0_30px_90px_rgba(0,0,0,0.25)] p-12 md:p-16 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-600/5 to-transparent opacity-0 group-hover/search:opacity-100 transition-opacity duration-700"></div>
              
              {/* Inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem]"></div>
              
              {/* Enhanced decorative corner accents */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-tl-[2rem]"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-600/15 via-blue-600/5 to-transparent rounded-br-[2rem]"></div>
              
              {/* Decorative dots pattern */}
              <div className="absolute top-8 right-8 flex gap-2 opacity-20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
              
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

          {/* Epic animated stats with premium glassmorphic cards */}
          <div className="grid grid-cols-3 gap-10 mt-32 max-w-6xl mx-auto">
            <div className="relative group">
              {/* Multi-layer glow effects */}
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-[1.75rem] blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-background/50 backdrop-blur-2xl border-2 border-border/50 rounded-[1.5rem] p-10 group-hover:border-primary/60 transition-all duration-500 overflow-hidden group-hover:scale-105">
                {/* Animated gradient backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-blue-600/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent opacity-100"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-br-[1.5rem]"></div>
                
                <div className="relative text-center">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-foreground via-foreground/95 to-foreground/60 bg-clip-text text-transparent mb-5 tabular-nums leading-none group-hover:scale-110 transition-transform duration-500">
                    {statsAnimated ? `${listingCount.toLocaleString('ru-RU')}+` : '0'}
                  </div>
                  <div className="relative mb-5">
                    <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto group-hover:w-32 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-lg opacity-50"></div>
                  </div>
                  <div className="text-xl text-muted-foreground font-black uppercase tracking-[0.25em]">Объявлений</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/30 to-primary/30 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 to-primary/20 rounded-[1.75rem] blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-background/50 backdrop-blur-2xl border-2 border-border/50 rounded-[1.5rem] p-10 group-hover:border-blue-600/60 transition-all duration-500 overflow-hidden group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/5 to-transparent opacity-100"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-br-[1.5rem]"></div>
                
                <div className="relative text-center">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-foreground via-foreground/95 to-foreground/60 bg-clip-text text-transparent mb-5 tabular-nums leading-none group-hover:scale-110 transition-transform duration-500">
                    {statsAnimated ? `${sellerCount.toLocaleString('ru-RU')}+` : '0'}
                  </div>
                  <div className="relative mb-5">
                    <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 to-primary rounded-full mx-auto group-hover:w-32 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary rounded-full blur-lg opacity-50"></div>
                  </div>
                  <div className="text-xl text-muted-foreground font-black uppercase tracking-[0.25em]">Продавцов</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-[1.75rem] blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-background/50 backdrop-blur-2xl border-2 border-border/50 rounded-[1.5rem] p-10 group-hover:border-green-500/60 transition-all duration-500 overflow-hidden group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-green-600/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-green-500/5 to-transparent opacity-100"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent rounded-br-[1.5rem]"></div>
                
                <div className="relative text-center">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-green-500 via-green-600 to-green-500 bg-clip-text text-transparent mb-5 tabular-nums leading-none group-hover:scale-110 transition-transform duration-500">
                    {statsAnimated ? `${satisfactionRate}%` : '0%'}
                  </div>
                  <div className="relative mb-5">
                    <div className="h-1.5 w-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto group-hover:w-32 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-lg opacity-50"></div>
                  </div>
                  <div className="text-xl text-muted-foreground font-black uppercase tracking-[0.25em]">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
