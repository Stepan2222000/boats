import { Link } from "wouter";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import BoatCard from "@/components/BoatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  const featuredBoats = [
    {
      id: "1",
      title: "Sea Ray 320 Sundancer",
      price: 3490000,
      currency: "₽",
      location: "Краснодар",
      year: 2015,
      length: 9.8,
      photoCount: 12,
      isPromoted: true
    },
    {
      id: "2",
      title: "Bayliner VR5 Cuddy",
      price: 2100000,
      currency: "₽",
      location: "Москва",
      year: 2018,
      length: 5.8,
      photoCount: 8
    },
    {
      id: "3",
      title: "Yamaha 242X E-Series",
      price: 4200000,
      currency: "₽",
      location: "Сочи",
      year: 2020,
      length: 7.3,
      photoCount: 15
    },
    {
      id: "4",
      title: "Boston Whaler 270 Vantage",
      price: 5800000,
      currency: "₽",
      location: "Санкт-Петербург",
      year: 2019,
      length: 8.2,
      photoCount: 20,
      isPromoted: true
    }
  ];

  const popularSearches = [
    "Sea Ray",
    "Катер до 2 млн",
    "Яхты 2020+",
    "Гидроциклы Yamaha",
    "Катера в Сочи",
    "Парусные яхты"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSearch />

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Часто ищут</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {popularSearches.map((search, idx) => (
            <Badge
              key={search}
              variant="secondary"
              className="relative text-lg py-4 px-8 cursor-pointer hover-elevate font-bold border-2 border-border/40 hover:border-primary/40 transition-all duration-300 rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden group"
              data-testid={`badge-popular-${search}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{search}</span>
            </Badge>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Рекомендуемые объявления</h2>
            </div>
            <p className="text-xl text-muted-foreground font-medium ml-20">Лучшие предложения, подобранные специально для вас с помощью AI</p>
          </div>
          <Link href="/catalog">
            <Button variant="outline" size="lg" className="hidden md:flex border-2 hover:border-primary/40 px-8 py-6 text-lg font-bold rounded-xl" data-testid="button-view-all">
              Смотреть все
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBoats.map((boat) => (
            <BoatCard key={boat.id} {...boat} />
          ))}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link href="/catalog">
            <Button variant="outline" size="lg" data-testid="button-view-all-mobile">
              Смотреть все
            </Button>
          </Link>
        </div>
      </section>

      <section className="relative py-40 overflow-hidden">
        {/* Complex multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-primary/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/5 to-transparent rounded-full blur-2xl animate-float"></div>
        </div>
        
        {/* Decorative lines */}
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary via-blue-600 to-primary rounded-full blur-xl opacity-40 animate-glow"></div>
              <Badge className="relative bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground border-0 px-8 py-4 text-lg font-black shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <span className="relative z-10">Лидер рынка</span>
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary"></div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                Почему выбирают Boat
              </h2>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-semibold">
              Самая современная платформа для покупки и продажи водной техники в России и СНГ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-blue-600/30 to-primary/30 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card className="relative overflow-hidden border-2 border-border/40 bg-background/80 backdrop-blur-2xl hover-elevate transition-all duration-500 hover:border-primary/50 hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] rounded-[2rem]">
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-br-[2rem]"></div>
                
                <CardContent className="relative p-12 text-center">
                  <div className="relative inline-block mb-10">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow"></div>
                    <div className="relative w-28 h-28 bg-gradient-to-br from-primary/20 via-blue-500/20 to-primary/10 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl border-2 border-primary/20">
                      <TrendingUp className="w-14 h-14 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-5 group-hover:text-primary transition-colors">Крупнейший выбор</h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto mb-6 group-hover:w-32 transition-all duration-500"></div>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    Более 10,000 объявлений о продаже катеров и яхт по всей России. Ежедневно добавляются новые предложения от проверенных продавцов
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Card 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/30 via-primary/30 to-blue-600/30 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card className="relative overflow-hidden border-2 border-border/40 bg-background/80 backdrop-blur-2xl hover-elevate transition-all duration-500 hover:border-blue-600/50 hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] rounded-[2rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-br-[2rem]"></div>
                
                <CardContent className="relative p-12 text-center">
                  <div className="relative inline-block mb-10">
                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/30 to-primary/30 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow"></div>
                    <div className="relative w-28 h-28 bg-gradient-to-br from-blue-600/20 via-primary/20 to-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl border-2 border-blue-600/20">
                      <Shield className="w-14 h-14 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-5 group-hover:text-blue-600 transition-colors">Проверенные продавцы</h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-primary rounded-full mx-auto mb-6 group-hover:w-32 transition-all duration-500"></div>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    Система рейтингов и отзывов для безопасных сделок. Только проверенные дилеры и частные продавцы с подтвержденной репутацией
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Card 3 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-blue-600/30 to-primary/30 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card className="relative overflow-hidden border-2 border-border/40 bg-background/80 backdrop-blur-2xl hover-elevate transition-all duration-500 hover:border-primary/50 hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] rounded-[2rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-br-[2rem]"></div>
                
                <CardContent className="relative p-12 text-center">
                  <div className="relative inline-block mb-10">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow"></div>
                    <div className="relative w-28 h-28 bg-gradient-to-br from-primary/20 via-blue-500/20 to-primary/10 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl border-2 border-primary/20">
                      <Sparkles className="w-14 h-14 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-5 group-hover:text-primary transition-colors">Умный AI-поиск</h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto mb-6 group-hover:w-32 transition-all duration-500"></div>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    Искусственный интеллект нового поколения помогает найти именно то, что вы ищете. Просто опишите желаемое своими словами
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t bg-gradient-to-b from-background to-muted/20 mt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold text-xl shadow-lg">
                  B
                </div>
                <span className="font-bold text-xl">Boat</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Крупнейший маркетплейс катеров и водной техники в России
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Покупателям</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Как искать</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Безопасность</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Продавцам</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Разместить объявление</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Правила</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Поддержка</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">О компании</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© 2024 Boat. Все права защищены.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
