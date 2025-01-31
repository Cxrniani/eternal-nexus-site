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
      title: "Título do Card 1",
      subtitle: "Subtítulo do Card 1",
    },
    {
      image: "https://placehold.co/600x600.png",
      title: "Título do Card 2",
      subtitle: "Subtítulo do Card 2",
    },
    {
      image: "https://placehold.co/600x600.png",
      title: "Título do Card 3",
      subtitle: "Subtítulo do Card 3",
    },
    {
      image: "https://placehold.co/600x600.png",
      title: "Título do Card 4",
      subtitle: "Subtítulo do Card 4",
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
    <div className="w-full bg-opacity-100 bg-slate-900 py-10 px-1 md:p-10 lg:p-10">
      <div className="max-container">
        <AnimatedComponent>
          <h1 className="font-bold text-4xl lg:text-start font-logoSuave text-center pb-10">
            Eternal News
          </h1>
          <div>
            <Slider {...settings}>
              {newsItems.map((item, index) => (
                <div key={index} className="px-1 md:p-0 lg:p-0">
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
    </div>
  );
};

export default News;
