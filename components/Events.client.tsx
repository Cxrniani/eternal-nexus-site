// /components/\Events.client.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Card from "./Card";
import AnimatedComponent from "./AnimatedComponent.client";
import Image from "next/image";

// Importar o Slider dinamicamente para evitar problemas de SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const Events = () => {
  const eventItems = [
    {
      image: "https://placehold.co/800x600.png",
      title: "Título do Evento 1",
      subtitle: "Subtítulo do Evento 1",
      date: "01/01/2023",
    }
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
    <div className="flex flex-col mx-auto w-full bg-zinc-950 px-2 md:px-0 lg:px-10 md:pt-5 mt:pb-10 pb-20">
      <AnimatedComponent>
        <h1 className="text-white font-logoSuave font-bold text-5xl text-center pb-10 pt-3">
          Eventos Espectro Crew
        </h1>
      </AnimatedComponent>
        <AnimatedComponent>
          <div className="flex flex-col relative h-96 md:h-[700px] overflow-hidden cursor-pointer">
            <Image
              className="object-cover plus-container "
              src="/assets/background.png"
              layout="fill"
              objectPosition="center"
              alt="Evento"
            />
          </div>
   
            <a href="/selection" className="text-2xl mt-2 md:text-3xl md:plus-container py-5 font-serif font-bold hover:font-bold text-center bg-violet-950 mx-auto block">Ingressos Aqui</a>
        </AnimatedComponent>
      </div>
  );
};

export default Events;
