import Header from "@/components/Header";
import BoatListingDetail from "@/components/BoatListingDetail";

export default function ListingPage() {
  const mockListing = {
    id: "1",
    title: "Катер Sea Ray 320 Sundancer",
    price: 3490000,
    currency: "₽",
    location: "Краснодар",
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800"
    ],
    specs: {
      brand: "Sea Ray",
      model: "320 Sundancer",
      year: 2015,
      length: 9.8,
      beam: 3.2,
      passengers: 8,
      engineType: "Стационарный",
      horsePower: 350,
      engineHours: 280,
      fuelType: "Бензин",
      condition: "Б/У, хорошее"
    },
    description: `Продается катер Sea Ray 320 Sundancer в отличном состоянии.

Ключевые параметры:
- Просторная каюта с спальными местами
- Полностью оборудованный камбуз
- Система навигации и эхолот
- Новая обивка салона (2023)

Состояние и обслуживание:
- Регулярное техническое обслуживание
- Замена масла и фильтров каждые 100 моточасов
- Двигатель в отличном состоянии

Комплектация:
- GPS навигатор Garmin
- Эхолот
- VHF радиостанция
- Тент и чехлы
- Прицеп в комплекте

Катер находится в Краснодаре, готов к осмотру в любое время.`,
    seller: {
      name: "MARINEPOINT",
      type: "company" as const,
      rating: 4.9,
      reviewsCount: 118,
      responseRate: 95
    },
    aiGenerated: ["Ширина корпуса", "Тип двигателя", "Вместимость"]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BoatListingDetail listing={mockListing} />
    </div>
  );
}
