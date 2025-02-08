"use client"

// /components/About.tsx
import React from "react";
import Image from "next/image";
import AnimatedComponent from "./AnimatedComponent.client";

const About = () => {
  return (
    <div style={{ backgroundImage: "url('/assets/hero2.jpg')" }} className="bg-zinc-950 bg-opacity-70 bg-center bg-blend-overlay bg-contain pt-5 md:py-5">
      <div className="max-container">
        <AnimatedComponent>
          <h1 className="text-white font-logoSuave font-bold text-4xl md:text-5xl text-center md:pt-5 pb-5">
            Quem Somos <span className="text-violet-500">Nós</span>?
          </h1>
        </AnimatedComponent>
      </div>
      <div className="plus-container md:rounded-xl bg-zinc-950 shadow-violet-950 shadow-inner pb-10">
        <div className="max-container">
          <AnimatedComponent>
            <div className="flex flex-col md:flex-row justify-between">
              <div className="md:w-1/2 md:pl-0 pt-10 px-4">
                <h1 className="text-4xl md:text-4xl font-logoSuave font-bold text-center">
                  A origem da <span className="text-violet-500">Espectro Crew</span>

                </h1>
                <p className="pt-5 text-lg md:text-xl text-white text-justify">
                  <span className="text-5xl font-serif font-bold">A</span>{" "}
                  Espectro Crew nasceu do desejo de criar conexões profundas
                  através da música e da energia única das pistas de dança.
                  Fundada por amantes do psytrance, a produtora foi idealizada
                  para transcender o óbvio, reunindo pessoas em experiências
                  imersivas que celebram a liberdade, a arte e a
                  espiritualidade. Desde os primeiros eventos, nossa missão
                  sempre foi unir almas que vibram na mesma frequência,
                  transformando noites em jornadas inesquecíveis e momentos em
                  histórias para contar.
                </p>
              </div>
              <div className="md:w-1/2 pt-10 lg:pl-5 px-4">
                <h1 className="text-4xl font-logoSuave font-bold text-center">
                  Um <span className="text-violet-500">Eterno</span> Propósito
                </h1>
                <p className="pt-5 text-xl text-white text-justify">
                  <span className="text-5xl font-bold font-serif">S</span>omos
                  muito mais do que uma produtora de eventos; somos criadores de
                  experiências que elevam o espírito e conectam mentes. Nossa
                  proposta é trazer o melhor do psytrance com qualidade sonora
                  impecável, decorações que encantam e ambientes pensados para
                  proporcionar harmonia e intensidade. Aqui, cada detalhe é
                  planejado para criar um universo onde a música conduz, a
                  energia flui e a magia acontece. Seja na pista ou fora dela,
                  nosso compromisso é levar você a outro nível, explorando o
                  potencial transformador da arte e da música eletrônica.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mt-20">
              <Image
                src="divider.svg"
                alt="Left Icon"
                width={300}
                height={40}
                className="mr-5 md:mr-20"
              />
              <h1 className="text-4xl font-logoSuave font-bold text-center">
                Idealizadores
              </h1>
              <Image
                src="divider.svg"
                alt="Right Icon"
                width={300}
                height={40}
                className="ml-5 md:ml-20"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-center md:gap-x-20 align-top items-center mt-16">
              <div style={{ backgroundImage: "url('/assets/hero2.jpg')" }} className="bg-zinc-950 bg-opacity-90 md:bg-zinc-950 bg-blend-overlay md:bg-opacity-80
               flex flex-col md:rounded-3xl align-middle items-center w-full max-w-lg h-[660px] md:shadow-lg md:shadow-violet-900 py-10 px-20 flex-1">
                <div className="relative w-56 h-56 rounded-full overflow-hidden">
                  <Image
                    src="/assets/orestes2.jpeg"
                    alt="Idealizador"
                    layout="fill"
                    className="rounded-full align-middle justify-center items-center object-cover object-center overflow-hidden"
                  /></div>
                <p className="text-2xl font-bold text-white mt-4">Orestes Bazan</p>
                <p className="text-white mt-2 text-center">CEO & Fundador</p>
                <p className="text-white mt-2 text-center">
                  Orestes é o coração pulsante da Espectro. Com uma paixão
                  inabalável pela música eletrônica, ele lidera a equipe com
                  visão e entusiasmo, sempre buscando novas formas de inovar e
                  conectar pessoas através da arte e da música.
                  <br /><br /> <span className="font-extrabold text-xl text-purple-500">Contato:</span>
                </p>
                <div className="flex flex-row gap-2 gap-x-2 w-full py-3 justify-center">
                  <Image
                    onClick={() => window.open("https://www.instagram.com/turco_67/")}
                    className="cursor-pointer"
                    src="instagram.svg"
                    alt="Instagram"
                    width={40}
                    height={40}
                  />
                  <Image
                    onClick={() => window.open("https://wa.me/+5567992752252")}
                    className="cursor-pointer"
                    src="whatsapp.svg"
                    alt="WhatsApp"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <div style={{ backgroundImage: "url('/assets/hero2.jpg')" }} className="relative bg-zinc-950 bg-blend-overlay bg-opacity-90 md:bg-opacity-80
               flex flex-col md:rounded-3xl align-middle items-center w-full max-w-lg h-[660px] md:shadow-lg md:shadow-violet-900 py-10 px-20 flex-1">
                <div className="relative w-56 h-56 rounded-full overflow-hidden ">
                  <Image
                    src="/assets/teo.jpeg"
                    alt="Idealizador 2"
                    layout="fill"
                    className="rounded-full align-middle justify-center items-center object-cover object-center overflow-hidden"
                  /></div>
                <p className="text-2xl font-bold text-center text-white mt-4">Matteo "Teo" Dalmati</p>
                <p className="text-white mt-2 text-center">
                  Diretor de Produção <br /> e Marketing
                </p>
                <p className="text-white mt-2 text-center">
                  Com sua ambição invejável e uma visão de negócios indiscutível, Teo
                  é responsável por garantir que cada detalhe das nossas
                  produções seja impecável. Sua paixão pela música e dedicação à
                  excelência fazem dele uma peça fundamental na Espectro.
                  <br /><br /> <span className="font-extrabold text-xl text-purple-500">Contato:</span>
                </p>
                <div className="flex flex-row gap-2 gap-x-2 w-full py-3 justify-center">
                  <Image
                    onClick={() => window.open("https://www.instagram.com/teooo__/")}
                    className="cursor-pointer"
                    src="instagram.svg"
                    alt="Instagram"
                    width={40}
                    height={40}
                  />
                  <Image
                    onClick={() => window.open("https://wa.me/+5567991777439")}
                    className="cursor-pointer"
                    src="whatsapp.svg"
                    alt="WhatsApp"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>
          </AnimatedComponent>
        </div>
      </div>
    </div>
  );
};

export default About;
