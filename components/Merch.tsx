import React from 'react'
import Card from './Card'
import AnimatedComponent from './AnimatedComponent.client'

const Merch = () => {
  const merchItems = [
    {
      image: 'https://placehold.co/600x400.png',
      title: 'Título do Card 1',
      subtitle: 'Subtítulo do Card 1',
      variant: 'buy',
    },
    {
      image: 'https://placehold.co/600x400.png',
      title: 'Título do Card 2',
      subtitle: 'Subtítulo do Card 2',
      variant: 'buy',
    },
    {
      image: 'https://placehold.co/600x400.png',
      title: 'Título do Card 3',
      subtitle: 'Subtítulo do Card 3',
      variant: 'buy',
    },
    {
      image: 'https://placehold.co/600x400.png',
      title: 'Título do Card 4',
      subtitle: 'Subtítulo do Card ',
      variant: 'buy',
    },
  ]

  return (
    <div className='w-full bg-fit py-10' style={{backgroundImage:"url('assets/background.png')" }} >
    <div className='plus-container rounded-xl bg-slate-900 py-10' >
      <div className='max-container'>
        <AnimatedComponent>
          <h1 className='mb-5 font-logoSuave font-bold text-4xl lg:text-start text-center'>Eternal Store</h1>
          <div>
            <div className="flex sm:flex-col sm:items-center lg:flex-row flex-wrap lg:max-container lg:justify-between justify-center md:justify-center gap-y-10 md:gap-x-5">
              {merchItems.map((item, index) => (
                <Card key={index} image={item.image} title={item.title} subtitle={item.subtitle} variant='buy' />
              ))}</div>
          </div>
        </AnimatedComponent>
        </div>
      </div>
    </div>

  )
}

export default Merch