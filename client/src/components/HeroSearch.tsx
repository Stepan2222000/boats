import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="relative bg-primary/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Найдите свой катер мечты
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Тысячи объявлений о продаже катеров, яхт и водной техники
          </p>

          <div className="bg-background rounded-lg shadow-lg p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder='Например: "Sea Ray от 2015" или "катер до 10 метров"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12"
                  data-testid="input-hero-search"
                />
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                className="h-12 px-8"
                data-testid="button-hero-search"
              >
                Найти
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="secondary"
                  size="sm"
                  onClick={() => console.log("Category clicked:", category)}
                  data-testid={`button-category-${category.toLowerCase()}`}
                  className="hover-elevate"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
