import { Link } from "wouter";
import { Search, Heart, User, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <a className="flex items-center gap-2" data-testid="link-home">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold text-2xl shadow-lg">
                B
              </div>
              <span className="font-bold text-2xl hidden sm:inline bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Boat</span>
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

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              data-testid="button-favorites"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              data-testid="button-messages"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="default"
              className="hidden md:flex"
              data-testid="button-add-listing"
            >
              Разместить объявление
            </Button>
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-profile"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
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
