import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import BoatCard from "@/components/BoatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TrendingUp, Shield, Users, Sparkles, Anchor, MessageCircle, Settings } from "lucide-react";
import type { Boat } from "@shared/schema";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { data: boats, isLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });

  const handleAdminAccess = () => {
    setShowAdminDialog(true);
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleAdminLogin = () => {
    if (username === "root" && password === "root") {
      setShowAdminDialog(false);
      setLocation("/admin");
    } else {
      setError("Неверный логин или пароль");
    }
  };

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

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="h-0.5 md:h-1 w-12 md:w-16 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Часто ищут</h2>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {popularSearches.map((search, idx) => (
            <Badge
              key={search}
              variant="secondary"
              className="relative text-sm md:text-lg py-2 md:py-4 px-4 md:px-8 cursor-pointer hover-elevate font-bold border border-border/40 hover:border-primary/40 transition-all duration-300 rounded-xl md:rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden group"
              data-testid={`badge-popular-${search}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{search}</span>
            </Badge>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="h-0.5 md:h-1 w-12 md:w-16 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">Рекомендуемые</h2>
            </div>
            <p className="text-sm md:text-xl text-muted-foreground font-medium ml-14 md:ml-20">Подобрано AI специально для вас</p>
          </div>
          <Link href="/catalog">
            <Button variant="outline" size="lg" className="hidden lg:flex border-2 hover:border-primary/40 px-8 py-6 text-lg font-bold rounded-xl" data-testid="button-view-all">
              Смотреть все
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-20">
              <div className="inline-block animate-pulse text-2xl font-black text-primary">
                Загрузка...
              </div>
            </div>
          ) : boats && boats.length > 0 ? (
            boats.map((boat) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-muted-foreground">Объявления не найдены</p>
            </div>
          )}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link href="/catalog">
            <Button variant="outline" size="lg" data-testid="button-view-all-mobile">
              Смотреть все
            </Button>
          </Link>
        </div>
      </section>

      <section className="relative py-16 md:py-40 overflow-hidden">
        {/* Complex multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-primary/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/5 to-transparent rounded-full blur-2xl animate-float"></div>
        </div>
        
        {/* Decorative lines */}
        <div className="absolute top-10 md:top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="absolute bottom-10 md:bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-24">
            <div className="relative inline-block mb-6 md:mb-8">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary via-blue-600 to-primary rounded-full blur-xl opacity-40 animate-glow"></div>
              <Badge className="relative bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground border-0 px-5 md:px-8 py-2 md:py-4 text-sm md:text-lg font-black shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <span className="relative z-10">Лидер рынка</span>
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-3 md:gap-6 mb-6 md:mb-8 px-4">
              <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-primary"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                Почему Boat
              </h2>
              <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-semibold px-4">
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

      <footer className="relative border-t border-border/40 bg-gradient-to-b from-background via-muted/10 to-muted/20 mt-32 overflow-hidden">
        {/* Decorative wave at top */}
        <div className="absolute top-0 left-0 w-full opacity-[0.04] -translate-y-full">
          <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 Q150,50 300,25 T600,25 T900,25 T1200,25 L1200,120 L0,120 Z" fill="currentColor" className="text-primary"/>
          </svg>
        </div>
        
        {/* Gradient backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full blur-sm animate-particle-float"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-600/20 rounded-full blur-sm animate-particle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/20 rounded-full blur-sm animate-particle-float" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-12 md:mb-16">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-primary text-primary-foreground shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    <Anchor className="w-7 h-7 relative z-10" />
                  </div>
                </div>
                <div>
                  <div className="font-black text-2xl bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Boat</div>
                  <div className="text-xs text-muted-foreground font-bold">⚓ Морская площадка</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                Крупнейший маркетплейс катеров и водной техники в России
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center hover-elevate transition-all hover:border-primary/40 group">
                  <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center hover-elevate transition-all hover:border-primary/40 group">
                  <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <button 
                  onClick={handleAdminAccess}
                  className="w-8 h-8 rounded-lg bg-background/40 border border-border/30 flex items-center justify-center hover-elevate transition-all hover:border-primary/30 group opacity-30 hover:opacity-100"
                  data-testid="button-admin-access"
                  title="Админ-панель"
                >
                  <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
            
            {/* Покупателям */}
            <div>
              <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-blue-600 rounded-full"></div>
                Покупателям
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    Как искать
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    Безопасность
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Продавцам */}
            <div>
              <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-blue-600 rounded-full"></div>
                Продавцам
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    Разместить объявление
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    Тарифы
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    Правила
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Поддержка */}
            <div>
              <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-blue-600 rounded-full"></div>
                Поддержка
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    Контакты
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 inline-block">
                    О компании
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="relative pt-10 border-t border-border/40">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <span>© 2024 Boat.</span>
                <span className="hidden md:inline">Все права защищены.</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Политика конфиденциальности
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Условия использования
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full opacity-[0.03]">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 Q150,50 300,25 T600,25 T900,25 T1200,25 L1200,120 L0,120 Z" fill="currentColor" className="text-primary"/>
          </svg>
        </div>
      </footer>

      {/* Admin Login Dialog */}
      <AlertDialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Вход в админ-панель
            </AlertDialogTitle>
            <AlertDialogDescription>
              Введите учетные данные для доступа к панели управления
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Логин</Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                data-testid="input-admin-username"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                data-testid="input-admin-password"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive" data-testid="text-admin-error">
                {error}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-admin-cancel">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleAdminLogin();
              }}
              data-testid="button-admin-login"
            >
              Войти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
