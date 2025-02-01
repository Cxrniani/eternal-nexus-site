// /components/News.tsx
"use client";

import React from "react";
import Card from "./Card";
import AnimatedComponent from "@/components/AnimatedComponent.client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const News = () => {
  const newsItems = [
    {
      image: "https://placehold.co/600x600.png",
      title: "Primera fase da lineup disponível!",
      subtitle: "Confira!",
    },
    {
      image: "https://placehold.co/600x600.png",
      title: "Quem será esse DJ?",
      subtitle: "Valendo um par de ingressos!",
    },
    {
      image: "https://placehold.co/600x600.png",
      title: "Local Divulgado!",
      subtitle: "Confira o local do evento!",
    },
    {
      image: "https://placehold.co/600x600.png",
      title: "Conheça nossos DJs!",
      subtitle: "Conheça os DJs que irão tocar!",
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
    <div style={{ backgroundImage: "url('/assets/hero2.jpg')" }} className="flex flex-col w-full bg-opacity-90 bg-blend-overlay md:shadow-sm md:shadow-violet-900 bg-zinc-950 pb-5 md:py-5 px-1 md:px-14 md:p-10">
        <AnimatedComponent>
          <h1 className="max-container font-bold text-3xl md:text-4xl md:text-start font-logoSuave text-center pb-3 md:pb-10">
            Eternal News
          </h1>
          <div  className="max-container">
            <Slider {...settings}>
              {newsItems.map((item, index) => (
                <div key={index} className="px-1 md:px-0">
                  <Card
                    image={item.image}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </AnimatedComponent>
      </div>
  );
};

export default News;
