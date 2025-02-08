// /components/Card.tsx
import React from "react";
import Image from "next/image";
import Button from "./Button";

interface CardProps {
  image: string;
  title: string;
  subtitle?: string;
  date?: string;
  variant?: "default" | "large" | "buy";
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  date,
  variant = "default",
}) => {
  return (
    <div
      className={`bg-transparent overflow-hidden flex flex-col ${
        variant === "large" ? "w-full" : "w-full sm:w-64 md:w-72 lg:w-80"
      }`}
    >
      <div
        className={`relative w-full ${
          variant === "large" ? "w-full h-52 md:h-[600px] aspect-[4/4]" : "h-auto"
        } aspect-[4/4]`}
      >
        <Image className="" src={image} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="py-2 flex-grow">
      <h2
          className={`text-start font-bold text-white ${
            variant === "large" ? "text-3xl w-fit mx-auto px-10 " : "text-sm md:text-xl lg:text-xl"
          }`}
        ><a href="/selection">
          {title}
          </a>
        </h2>
        {variant === "large" && date && (
          <p className="text-gray-400 text-start py-2 text-3xl">{date}</p>
        )}
        <p
          className={`text-gray-400 text-start ${
            variant === "large" ? "text-lg" : "text-xs md:text-xl lg:text-xl"
          }`}
        >
          {subtitle}
        </p>
        {variant === "buy" && (
          <div className="flex justify-end">
            <a
              href="#"
              className="text-white transition duration-300 ease-in-out"
            >
              <Button title="Comprar" type="button" variant="btn_buy" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
