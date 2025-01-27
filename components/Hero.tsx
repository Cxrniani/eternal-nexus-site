'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Card from './Card'

const Slider = dynamic(() => import('react-slick'), { ssr: false })

const Hero = () => {
  const heroItems = [
    {
      image: 'https://placehold.co/800x600.png',
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
    <div className='max-container h-100 bg-transparent pb-10 pt-20 px-0 mx-0 mb-36'>
      <div className='plus-container mx-0 px-0'>
        <Slider {...settings}>
          {heroItems.map((item, index) => (
            <div key={index} className="flex justify-around px-0 mx-0">
              <Card image={item.image} title=' ' variant='large' />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default Hero