import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3, List, SlidersHorizontal, Bookmark } from "lucide-react";
import BoatCard from "./BoatCard";
import FilterPanel from "./FilterPanel";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function CatalogView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showLocalFirst, setShowLocalFirst] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const mockBoats = [
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
    },
    {
      id: "5",
      title: "Beneteau Antares 8",
      price: 3200000,
      currency: "₽",
      location: "Краснодар",
      year: 2017,
      length: 7.9,
      photoCount: 10
    },
    {
      id: "6",
      title: "Quicksilver 605 Sundeck",
      price: 1800000,
      currency: "₽",
      location: "Крым",
      year: 2016,
      length: 5.9,
      photoCount: 6
    }
  ];

  const handleSaveSearch = () => {
    console.log("Search saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground mb-4">
            <span>Главная</span>
            <span className="mx-2">&gt;</span>
            <span>Водный транспорт</span>
            <span className="mx-2">&gt;</span>
            <span className="text-foreground">Катера и яхты</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold">
              Найдено <span className="text-primary">497</span> объявлений
            </h1>

            <div className="flex items-center gap-2">
              <Button
                variant={showLocalFirst ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLocalFirst(!showLocalFirst)}
                data-testid="button-toggle-local"
                className="hover-elevate"
              >
                Сначала из моего региона
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveSearch}
                data-testid="button-save-search"
                className="hover-elevate"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Сохранить поиск
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="hover-elevate cursor-pointer">
                Катер
                <button className="ml-2 hover:text-destructive">×</button>
              </Badge>
              <Badge variant="secondary" className="hover-elevate cursor-pointer">
                2015-2024
                <button className="ml-2 hover:text-destructive">×</button>
              </Badge>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(true)}
                className="md:hidden"
                data-testid="button-open-filters-mobile"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>

              <Select defaultValue="date">
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">По дате ▼</SelectItem>
                  <SelectItem value="price-asc">По цене ▲</SelectItem>
                  <SelectItem value="price-desc">По цене ▼</SelectItem>
                  <SelectItem value="year">По году</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none no-default-hover-elevate"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                >
                  <Grid3x3 className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none no-default-hover-elevate"
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <FilterPanel />
            </div>
          </aside>

          <main className="flex-1">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {mockBoats.map((boat) => (
                <BoatCard key={boat.id} {...boat} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" data-testid="button-load-more">
                Показать еще
              </Button>
            </div>
          </main>
        </div>
      </div>

      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-full sm:max-w-md p-0">
          <FilterPanel onClose={() => setShowFilters(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
