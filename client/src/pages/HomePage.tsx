import { Link } from "wouter";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import BoatCard from "@/components/BoatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Users } from "lucide-react";

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

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Часто ищут</h2>
        <div className="flex flex-wrap gap-4">
          {popularSearches.map((search) => (
            <Badge
              key={search}
              variant="secondary"
              className="text-lg py-3 px-6 cursor-pointer hover-elevate font-medium border-2 border-transparent hover:border-primary/20"
              data-testid={`badge-popular-${search}`}
            >
              {search}
            </Badge>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Рекомендуемые объявления</h2>
            <p className="text-muted-foreground">Лучшие предложения, подобранные специально для вас</p>
          </div>
          <Link href="/catalog">
            <Button variant="outline" size="lg" className="hidden md:flex" data-testid="button-view-all">
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

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-primary/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground border-0 px-6 py-3 text-base font-bold shadow-xl bg-[length:200%_100%]">
              Лидер рынка
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Почему выбирают Boat</h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Самая современная платформа для покупки и продажи водной техники в России и СНГ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-2 border-border/50 bg-background/90 backdrop-blur-xl hover-elevate transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 via-blue-500/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">Крупнейший выбор</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Более 10,000 объявлений о продаже катеров и яхт по всей России. Ежедневно добавляются новые предложения от проверенных продавцов
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-border/50 bg-background/90 backdrop-blur-xl hover-elevate transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 via-blue-500/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">Проверенные продавцы</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Система рейтингов и отзывов для безопасных сделок. Только проверенные дилеры и частные продавцы с подтвержденной репутацией
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-border/50 bg-background/90 backdrop-blur-xl hover-elevate transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 via-blue-500/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">Умный AI-поиск</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Искусственный интеллект нового поколения помогает найти именно то, что вы ищете. Просто опишите желаемое своими словами
                </p>
              </CardContent>
            </Card>
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
