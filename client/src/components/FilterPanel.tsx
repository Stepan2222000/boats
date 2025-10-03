import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

export default function FilterPanel({ onClose }: { onClose?: () => void }) {
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [yearRange, setYearRange] = useState([2000, 2024]);
  const [lengthRange, setLengthRange] = useState([0, 30]);

  const handleApplyFilters = () => {
    console.log("Filters applied:", {
      priceRange,
      yearRange,
      lengthRange
    });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 10000000]);
    setYearRange([2000, 2024]);
    setLengthRange([0, 30]);
    console.log("Filters cleared");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Фильтры</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-filters"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={["type", "price", "year"]} className="px-4">
          <AccordionItem value="type">
            <AccordionTrigger>Тип судна</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {["Катер", "Яхта", "Гидроцикл", "Парусная яхта", "Моторная лодка"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={type} data-testid={`checkbox-type-${type}`} />
                  <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand">
            <AccordionTrigger>Бренд</AccordionTrigger>
            <AccordionContent>
              <Select>
                <SelectTrigger data-testid="select-brand">
                  <SelectValue placeholder="Выберите бренд" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sea-ray">Sea Ray</SelectItem>
                  <SelectItem value="bayliner">Bayliner</SelectItem>
                  <SelectItem value="yamaha">Yamaha</SelectItem>
                  <SelectItem value="beneteau">Beneteau</SelectItem>
                  <SelectItem value="boston-whaler">Boston Whaler</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Цена, ₽</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="От"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  data-testid="input-price-min"
                />
                <Input
                  type="number"
                  placeholder="До"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  data-testid="input-price-max"
                />
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000000}
                step={100000}
                className="mt-2"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="year">
            <AccordionTrigger>Год выпуска</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="От"
                  value={yearRange[0]}
                  onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                  data-testid="input-year-min"
                />
                <Input
                  type="number"
                  placeholder="До"
                  value={yearRange[1]}
                  onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                  data-testid="input-year-max"
                />
              </div>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                min={1980}
                max={2024}
                step={1}
                className="mt-2"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="length">
            <AccordionTrigger>Длина, м</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="От"
                  value={lengthRange[0]}
                  onChange={(e) => setLengthRange([Number(e.target.value), lengthRange[1]])}
                  data-testid="input-length-min"
                />
                <Input
                  type="number"
                  placeholder="До"
                  value={lengthRange[1]}
                  onChange={(e) => setLengthRange([lengthRange[0], Number(e.target.value)])}
                  data-testid="input-length-max"
                />
              </div>
              <Slider
                value={lengthRange}
                onValueChange={setLengthRange}
                max={30}
                step={0.5}
                className="mt-2"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location">
            <AccordionTrigger>Местоположение</AccordionTrigger>
            <AccordionContent>
              <Select>
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moscow">Москва</SelectItem>
                  <SelectItem value="spb">Санкт-Петербург</SelectItem>
                  <SelectItem value="krasnodar">Краснодарский край</SelectItem>
                  <SelectItem value="sochi">Сочи</SelectItem>
                  <SelectItem value="crimea">Крым</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="condition">
            <AccordionTrigger>Состояние</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {["Новый", "Б/У", "Требует ремонта"].map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox id={condition} data-testid={`checkbox-condition-${condition}`} />
                  <Label htmlFor={condition} className="cursor-pointer">{condition}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="p-4 border-t space-y-2 bg-background">
        <Button
          className="w-full"
          onClick={handleApplyFilters}
          data-testid="button-apply-filters"
        >
          Показать объявления
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearFilters}
          data-testid="button-clear-filters"
        >
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
}
