// /components/\Events.client.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Card from "./Card";
import AnimatedComponent from "./AnimatedComponent.client";

// Importar o Slider dinamicamente para evitar problemas de SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const Events = () => {
  const eventItems = [
    {
      image: "https://placehold.co/800x600.png",
      title: "Título do Evento 1",
      subtitle: "Subtítulo do Evento 1",
      date: "01/01/2023",
    },
    {
      image: "https://placehold.co/800x600.png",
      title: "Título do Evento 2",
      subtitle: "Subtítulo do Evento 2",
      date: "02/01/2023",
    },
    {
      image: "https://placehold.co/800x600.png",
      title: "Título do Evento 3",
      subtitle: "Subtítulo do Evento 3",
      date: "03/01/2023",
    },
    {
      image: "https://placehold.co/800x600.png",
      title: "Título do Evento 4",
      subtitle: "Subtítulo do Evento 4",
      date: "04/01/2023",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="w-full h-100 bg-slate-950 px-2 md:px-10 lg:px-10 pt-5 pb-20">
      <AnimatedComponent>
        <h1 className="text-white font-logoSuave font-bold text-5xl text-center py-10">
          Eventos Eternal Nexus
        </h1>
      </AnimatedComponent>
      <div className="plus-container ">
        <AnimatedComponent>
          <Slider {...settings}>
            {eventItems.map((item, index) => (
              <div
                key={index}
                className="px-2 md:px-10 lg:px-10 flex justify-center "
              >
                <Card
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  variant="large"
                />
              </div>
            ))}
          </Slider>
        </AnimatedComponent>
      </div>
    </div>
  );
};

export default Events;
