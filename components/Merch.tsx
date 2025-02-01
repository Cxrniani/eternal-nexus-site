// /components/Merch.tsx
"use client";

import React from "react";
import Slider from "react-slick";
import Card from "./Card";
import AnimatedComponent from "@/components/AnimatedComponent.client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Merch = () => {
  const merchItems = [
    {
      image: "https://placehold.co/600x400.png",
      title: "Copo Etternal Nexus",
      subtitle: "R$ 25,00",
      variant: "buy",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Tirante Etternal Nexus",
      subtitle: "R$ 15,00",
      variant: "buy",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Dapo Espectro Crew",
      subtitle: "R$ 30,00",
      variant: "buy",
    },
    {
      image: "https://placehold.co/600x400.png",
      title: "Camiseta Espectro Crew",
      subtitle: "R$ 90,00",
      variant: "buy",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <div style={{ backgroundImage: "url('/assets/hero2.jpg')" }} className="bg-zinc-900 bg-opacity-70 bg-center bg-blend-overlay bg-contain">
      <div
        className="w-full p-5 md:px-14 bg-zinc-900 bg-opacity-80 bg-contain"
      >
        <div className="plus-container">
          <AnimatedComponent>
            <h1 className="mb-5 font-logoSuave font-bold text-4xl lg:text-start text-center">
              Eternal Store
            </h1>
            <div className="">
              <Slider {...settings}>
                {merchItems.map((item, index) => (
                  <div key={index} className="px-1 md:px-0">
                    <Card
                      image={item.image}
                      title={item.title}
                      subtitle={item.subtitle}
                      variant="default"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </AnimatedComponent>
        </div>
      </div>
    </div>
  );
};

export default Merch;
