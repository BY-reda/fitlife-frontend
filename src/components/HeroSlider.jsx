import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/assets/images/slide1.jpg',
    title: 'Transform Your Body, Transform Your Life',
    description: 'Join our community of fitness enthusiasts and achieve your goals with expert guidance.',
    cta: 'Start Your Journey',
  },
  {
    image: '/assets/images/slide2.jpg',
    title: 'Expert Trainers, Real Results',
    description: 'Our certified trainers will help you reach your fitness goals faster than ever before.',
    cta: 'Meet Our Trainers',
  },
  {
    image: '/assets/images/slide3.jpg',
    title: 'State-of-the-Art Facilities',
    description: 'Experience fitness in our premium, fully-equipped gym with the latest technology.',
    cta: 'View Our Gym',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(() => next(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute z-20 inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">{slide.description}</p>
            <button className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white rounded-md text-lg">
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/30 p-2 rounded-full">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/30 p-2 rounded-full">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${index === current ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
