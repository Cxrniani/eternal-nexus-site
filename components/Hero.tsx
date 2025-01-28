'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Card from './Card'

const Slider = dynamic(() => import('react-slick'), { ssr: false })

const Hero = () => {
  const heroItems = [
    {
      image: '/assets/background2.jpg',
      title: 'Título do Evento 1',
    },
    {
      image: 'https://placehold.co/800x600.png',
      title: 'Título do Evento 2',
    },
    {
      image: 'https://placehold.co/800x600.png',
      title: 'Título do Evento 3',
    },
    {
      image: 'https://placehold.co/800x600.png',
      title: 'Título do Evento 4',
    },
  ]

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  }
  return (
    <div style={{backgroundImage:"url('assets/background.png')" }} className='bg-slate-900 bg-opacity-50 bg-blend-color-dodge h-[62vh] md:h-[100vh] md:pt-52 bg-cover bg-top md:mt-[-12vh]'>
    <div className='max-container h-100 bg-transparent pt-0 pb-0' >
      <div className='plus-container px-2 md:p-0 lg:p-0 pt-24'>
        <Slider {...settings}>
          {heroItems.map((item, index) => (
            <div key={index} className="flex justify-around px-0 mx-0">
              <Card image={item.image} title=' ' variant='large' />
            </div>
          ))}
        </Slider>
      </div>
    </div>
    </div>
  )
}

export default Hero