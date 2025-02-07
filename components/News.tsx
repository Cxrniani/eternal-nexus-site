"use client";

import React, { useState, useEffect } from "react";
import Card from "./Card";
import AnimatedComponent from "@/components/AnimatedComponent.client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const News = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/news");
        if (!response.ok) {
          throw new Error("Erro ao buscar notícias");
        }
        const data = await response.json();
        console.log("Notícias recebidas:", data);
        setNewsItems(data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNews();
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/news");
        if (!response.ok) {
          throw new Error("Erro ao buscar notícias");
        }
        const data = await response.json();
        console.log("Notícias recebidas:", data);
        setNewsItems(data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNews();
  }, []);

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
    <div
      style={{ backgroundImage: "url('/assets/hero2.jpg')" }}
      className="flex flex-col w-full bg-opacity-90 bg-blend-overlay md:shadow-sm md:shadow-violet-900 bg-zinc-950 pb-5 md:py-5 px-1 md:px-14 md:p-10"
    >
      <AnimatedComponent>
        <h1 className="max-container font-bold text-3xl md:text-4xl md:text-start font-logoSuave text-center pb-3 md:pb-10">
          Eternal News
        </h1>
        <div className="max-container">
          <Slider {...settings}>
            {newsItems.map((item, index) => {
              console.log(item.image); // Verifique se a URL da imagem está correta
              return (
                <div key={index} className="px-1 md:px-0">
                  <Card
                    image={item.image}
                    title={item.title}
                    subtitle={item.subtitle}
                    date={item.date}
                    variant="default"
                  />
                </div>
              );
            })}
          </Slider>
        </div>
      </AnimatedComponent>
    </div>
  );
};

export default News;
