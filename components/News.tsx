import React from 'react'
import Card from './Card'
import AnimatedComponent from "@/components/AnimatedComponent.client";

const News = () => {
  const newsItems = [
    {
      image: 'https://placehold.co/600x600.png',
      title: 'Título do Card 1',
      subtitle: 'Subtítulo do Card 1',
    },
    {
      image: 'https://placehold.co/600x600.png',
      title: 'Título do Card 2',
      subtitle: 'Subtítulo do Card 2',
    },
    {
      image: 'https://placehold.co/600x600.png',
      title: 'Título do Card 3',
      subtitle: 'Subtítulo do Card 3',
    },
    {
      image: 'https://placehold.co/600x600.png',
      title: 'Título do Card 4',
      subtitle: 'Subtítulo do Card 4',
    },
  ]

  return (
    <div className='w-full bg-opacity-100 bg-slate-900 p-10'>

      <div className='max-container'>
        <AnimatedComponent>
          <h1 className='font-bold text-4xl lg:text-start font-logoSuave text-center pb-10'>Eternal News</h1>
          <div>
          
            <div className="flex sm:flex-col sm:items-center lg:flex-row flex-wrap lg:max-container lg:justify-between justify-center md:justify-center gap-y-10 md:gap-x-5">
              {newsItems.map((item, index) => (
                <Card key={index} image={item.image} title={item.title} subtitle={item.subtitle} />
              ))}</div>

          </div>
        </AnimatedComponent>
      </div>
    </div>
  )
}

export default News