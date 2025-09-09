import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {

  return (
    <div className="pb-14 px-8 md:px-0 bg-gray-900 py-16">
      <h2 className="text-3xl font-medium text-green-400">Security Success Stories</h2>
      <p className="md:text-base text-gray-300 mt-3">
        Hear from our security professionals as they share their journeys of transformation, success, and how our <br /> platform has enhanced their cyber defense capabilities.
      </p>
      <div className="grid grid-cols-auto gap-8 mt-14">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-green-500/30 pb-6 rounded-lg bg-gray-800 shadow-[0px_4px_15px_0px] shadow-black/20 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-green-900/20">
              <img className="h-12 w-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1 className="text-lg font-medium text-white">{testimonial.name}</h1>
                <p className="text-gray-300">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5"
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-300 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-green-400 underline px-5 hover:text-green-300">
              Read full story
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;