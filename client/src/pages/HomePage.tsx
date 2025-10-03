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

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-primary/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground border-0">
              Лидер рынка
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Почему выбирают Boat</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Самая современная платформа для покупки и продажи водной техники
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-border/50 bg-background/80 backdrop-blur-sm hover-elevate transition-all duration-300 hover:border-primary/30 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Крупнейший выбор</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Более 10,000 объявлений о продаже катеров и яхт по всей России. Ежедневно добавляются новые предложения
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 bg-background/80 backdrop-blur-sm hover-elevate transition-all duration-300 hover:border-primary/30 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Проверенные продавцы</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Система рейтингов и отзывов для безопасных сделок. Только проверенные дилеры и частные продавцы
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 bg-background/80 backdrop-blur-sm hover-elevate transition-all duration-300 hover:border-primary/30 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Умный AI-поиск</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Искусственный интеллект помогает найти именно то, что вы ищете. Просто опишите желаемое
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
