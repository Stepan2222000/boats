import { Link } from "wouter";
import { Search, Heart, User, Menu, MessageCircle, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-2xl border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <a className="flex items-center gap-3 group" data-testid="link-home">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-primary text-primary-foreground font-black text-3xl shadow-2xl transition-all duration-300 group-hover:scale-105 bg-[length:200%_100%] group-hover:bg-[position:100%_0]">
                B
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/50 to-blue-600/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-2xl bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent tracking-tight">Boat</div>
                <div className="text-xs text-muted-foreground font-semibold -mt-1">Premium Marketplace</div>
              </div>
            </a>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск катеров и яхт..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex w-11 h-11 rounded-xl hover-elevate"
              data-testid="button-favorites"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex w-11 h-11 rounded-xl hover-elevate relative"
              data-testid="button-messages"
            >
              <MessageCircle className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-destructive border-2 border-background">3</Badge>
            </Button>
            <Button
              variant="default"
              size="lg"
              className="hidden md:flex bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg font-bold rounded-xl px-6"
              data-testid="button-add-listing"
            >
              <Plus className="w-5 h-5 mr-2" />
              Разместить
              <Sparkles className="w-4 h-4 ml-2 opacity-70" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 rounded-xl hover-elevate"
              data-testid="button-profile"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-11 h-11 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
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
