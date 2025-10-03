import BoatCard from "../BoatCard";

export default function BoatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <BoatCard
        id="1"
        title="Sea Ray 320 Sundancer"
        price={3490000}
        currency="₽"
        location="Краснодар"
        year={2015}
        length={9.8}
        photoCount={12}
        isPromoted={true}
      />
      <BoatCard
        id="2"
        title="Bayliner VR5 Cuddy"
        price={2100000}
        currency="₽"
        location="Москва"
        year={2018}
        length={5.8}
        photoCount={8}
      />
      <BoatCard
        id="3"
        title="Yamaha 242X E-Series"
        price={4200000}
        currency="₽"
        location="Сочи"
        year={2020}
        length={7.3}
        photoCount={15}
        isFavorite={true}
      />
    </div>
  );
}
