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

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Часто ищут</h2>
        <div className="flex flex-wrap gap-3">
          {popularSearches.map((search) => (
            <Badge
              key={search}
              variant="secondary"
              className="text-base py-2 px-4 cursor-pointer hover-elevate"
              data-testid={`badge-popular-${search}`}
            >
              {search}
            </Badge>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Рекомендуемые объявления</h2>
          <Link href="/catalog">
            <Button variant="outline" data-testid="button-view-all">
              Смотреть все
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBoats.map((boat) => (
            <BoatCard key={boat.id} {...boat} />
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Почему выбирают Boat</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Крупнейший выбор</h3>
                <p className="text-sm text-muted-foreground">
                  Более 10,000 объявлений о продаже катеров и яхт по всей России
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Проверенные продавцы</h3>
                <p className="text-sm text-muted-foreground">
                  Система рейтингов и отзывов для безопасных сделок
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Умный поиск</h3>
                <p className="text-sm text-muted-foreground">
                  ИИ помогает найти именно то, что вы ищете
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Boat</h3>
              <p className="text-sm text-muted-foreground">
                Маркетплейс катеров и водной техники
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Покупателям</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Как искать</a></li>
                <li><a href="#" className="hover:text-foreground">Безопасность</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Продавцам</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Разместить объявление</a></li>
                <li><a href="#" className="hover:text-foreground">Тарифы</a></li>
                <li><a href="#" className="hover:text-foreground">Правила</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Контакты</a></li>
                <li><a href="#" className="hover:text-foreground">О компании</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Boat. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
