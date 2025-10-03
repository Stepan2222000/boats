import { Link } from "wouter";
import { Search, Heart, User, Menu, MessageCircle, Sparkles, Plus, Anchor, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/99 backdrop-blur-3xl border-b border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-blue-600/3"></div>
      
      {/* Decorative wave pattern background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="absolute bottom-0 w-full h-6" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 Q300,40 600,20 T1200,0 L1200,120 L0,120 Z" fill="currentColor" className="text-primary"/>
        </svg>
      </div>
      
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-5">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <Link href="/">
            <a className="flex items-center gap-2 md:gap-3 group" data-testid="link-home">
              {/* Enhanced logo with anchor */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-xl md:rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-primary text-primary-foreground shadow-2xl transition-all duration-500 group-hover:scale-110 overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  
                  {/* Anchor icon */}
                  <Anchor className="w-6 h-6 md:w-8 md:h-8 relative z-10" />
                  
                  {/* Background waves */}
                  <Waves className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 opacity-20" />
                </div>
              </div>
              
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl md:text-3xl bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent animate-gradient-shift">Boat</span>
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-bold -mt-1 tracking-wide">⚓ Морская площадка</div>
              </div>
            </a>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full group/search">
              {/* Search input glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-xl blur-md opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Поиск катеров и яхт..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 rounded-xl border-2 border-border/60 bg-background/60 backdrop-blur-sm focus-visible:border-primary/60 transition-all font-medium"
                  data-testid="input-search"
                />
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex w-11 h-11 rounded-xl hover-elevate relative group"
              data-testid="button-favorites"
            >
              <Heart className="w-5 h-5 group-hover:fill-primary/20 transition-all" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex w-11 h-11 rounded-xl hover-elevate relative group"
              data-testid="button-messages"
            >
              <MessageCircle className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] font-black bg-gradient-to-br from-destructive to-red-600 border-2 border-background shadow-lg">3</Badge>
            </Button>
            <Button
              variant="default"
              size="lg"
              className="hidden md:flex relative bg-gradient-to-r from-primary via-blue-600 to-primary shadow-2xl font-black rounded-xl px-8 h-12 overflow-hidden group bg-[length:200%_100%] hover:bg-[position:100%_0]"
              data-testid="button-add-listing"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              
              <Plus className="w-5 h-5 mr-2 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Разместить</span>
              <Sparkles className="w-4 h-4 ml-2 relative z-10 opacity-80 animate-pulse" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl hover-elevate"
              data-testid="button-profile"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-10 h-10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск катеров и яхт..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-10 text-sm rounded-lg"
              data-testid="input-search-mobile"
            />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-2 border-t pt-3 space-y-2">
            <Button variant="ghost" className="w-full justify-start" data-testid="button-favorites-mobile">
              <Heart className="w-5 h-5 mr-2" />
              Избранное
            </Button>
            <Button variant="ghost" className="w-full justify-start" data-testid="button-messages-mobile">
              <MessageCircle className="w-5 h-5 mr-2" />
              Сообщения
            </Button>
            <Button variant="default" className="w-full" data-testid="button-add-listing-mobile">
              Разместить объявление
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
