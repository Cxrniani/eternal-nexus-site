import React from 'react'
import Image from 'next/image'
import AnimatedComponent from './AnimatedComponent.client'

const About = () => {
    return (
        <div className='bg-slate-900 py-10'>
            <div className='plus-container rounded-xl shadow-xl bg-slate-950 pb-10'>
                <div className='max-container'>
                    <AnimatedComponent>
                        <div className='flex flex-col md:flex-row justify-between'>
                            <div className='md:w-1/2 lg:pl-0 pt-10 px-4'>
                                <h1 className='text-4xl font-logoSuave font-bold text-center'>Como Surgiu a <span className='text-violet-500'>Eternal</span>?</h1>
                                <p className='pt-5 text-xl text-white text-justify'>
                                    <span className='text-5xl font-serif font-bold'>A</span> Eternal Nexus nasceu do desejo de criar conexões profundas através da música e da energia única das pistas de dança.
                                    Fundada por amantes do psytrance, a produtora foi idealizada para transcender o óbvio, reunindo pessoas em experiências
                                    imersivas que celebram a liberdade, a arte e a espiritualidade. Desde os primeiros eventos, nossa missão sempre foi unir
                                    almas que vibram na mesma frequência, transformando noites em jornadas inesquecíveis e momentos em histórias para contar.
                                </p>
                            </div>
                            <div className='md:w-1/2 pt-10 lg:pl-5 px-4'>
                                <h1 className='text-4xl font-logoSuave font-bold text-center'>Um <span className='text-violet-500'>Eterno</span> Propósito</h1>
                                <p className='pt-5 text-xl text-white text-justify'>
                                    <span className='text-5xl font-bold font-serif'>S</span>omos muito mais do que uma produtora de eventos; somos criadores de experiências que elevam o espírito e conectam mentes.
                                    Nossa proposta é trazer o melhor do psytrance com qualidade sonora impecável, decorações que encantam e ambientes pensados para
                                    proporcionar harmonia e intensidade. Aqui, cada detalhe é planejado para criar um universo onde a música conduz, a energia flui
                                    e a magia acontece. Seja na pista ou fora dela, nosso compromisso é levar você a outro nível, explorando o potencial transformador
                                    da arte e da música eletrônica.
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center justify-center mt-20'>
                            <Image src="divider.svg" alt="Left Icon" width={300} height={40} className="mr-20" />
                            <h1 className='text-4xl font-logoSuave font-bold text-center'>Idealizadores</h1>
                            <Image src="divider.svg" alt="Right Icon" width={300} height={40} className="ml-20" />
                        </div>

                        <div className='flex flex-col md:flex-row justify-evenly align-top items-center mt-16'>
                            <div className='flex flex-col rounded-3xl align-middle items-center w-full max-w-lg h-[600px] shadow-md shadow-black py-10 px-20 flex-1'>
                                <Image
                                    src="https://placehold.co/300x300.png"
                                    alt="Idealizador 1"
                                    width={250}
                                    height={250}
                                    className="rounded-full align-middle justify-center items-center"
                                />
                                <p className='text-xl text-white mt-4'>Idealizador 1</p>
                                <p className='text-white mt-2 text-center'>CEO & Fundador</p>
                                <p className='text-white mt-2 text-center'>Idealizador 1 é o coração pulsante da Nexus. Com uma paixão inabalável pela música eletrônica,
                                    ele lidera a equipe com visão e entusiasmo, sempre buscando novas formas de inovar e conectar pessoas através da arte e da música.</p>
                            </div>
                            <div className='flex flex-col rounded-3xl align-middle items-center w-full max-w-lg h-[600px] shadow-md shadow-black py-10 px-20 flex-1'>
                                <Image
                                    src="https://placehold.co/300x300.png"
                                    alt="Idealizador 2"
                                    width={250}
                                    height={250}
                                    className="rounded-full"
                                />
                                <p className='text-xl text-white mt-4'>Idealizador 2</p>
                                <p className='text-white mt-2 text-center'>Diretor de Produção <br /> e Marketing</p>
                                <p className='text-white mt-2 text-center'>Com uma vasta experiência no mercado de eventos,
                                    Idealizador 2 é responsável por garantir que cada detalhe das nossas produções seja impecável.
                                    Sua paixão pela música e dedicação à excelência fazem dele uma peça fundamental na Nexus.</p>
                            </div>
                        </div>
                    </AnimatedComponent>
                </div>
            </div>

        </div>
    )
}

export default About