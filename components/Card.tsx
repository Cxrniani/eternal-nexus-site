import React from 'react'
import Image from 'next/image'
import Button from './Button'

interface CardProps {
  image: string
  title: string
  subtitle?: string
  date?: string
  variant?: 'default' | 'large' | 'buy'
}

const Card: React.FC<CardProps> = ({ image, title, subtitle, date, variant = 'default' }) => {
  return (
    <div className={`bg-transparent overflow-hidden flex flex-col ${variant === 'large' ? 'max-container' : 'w-80'}`}>
      <div className={`relative w-full ${variant === 'large' ? 'h-[400px] md:h-[500px] m-0 p-0' : 'h-72 m-0 p-0'}`}>
        <Image
          className="object-cover"
          src={image}
          alt={title}
          layout="fill"
        />
      </div>
      <div className="py-2 flex-grow">
        <h2 className={`text-start font-bold text-white ${variant === 'large' ? 'text-3xl' : 'text-xl'}`}>{title}</h2>
        {variant === 'large' && date && <p className="text-gray-400 text-2xl">{date}</p>}
        <p className={`text-gray-600 ${variant === 'large' ? 'text-lg' : ''}`}>{subtitle}</p>
        {variant === 'buy' && (
          <div className="flex justify-end">
            <a href="#" className="text-white transition duration-300 ease-in-out">
              <Button title="Comprar" type="button" variant="btn_buy" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card