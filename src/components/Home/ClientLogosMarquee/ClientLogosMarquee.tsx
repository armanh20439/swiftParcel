import React from 'react';
import Marquee from 'react-fast-marquee';

// import your logos
import amazon from '../../../assets/brands/amazon.png';
import amazonVec from '../../../assets/brands/amazon_vector.png';

import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import start from '../../../assets/brands/start.png';
import randstad from '../../../assets/brands/randstad.png';
import people from '../../../assets/brands/people.png';
import Image from 'next/image';

const logos = [amazon,amazonVec, casio, moonstar, start, randstad, people];

const ClientLogosMarquee = () => {
  return (
    <section className="py-10 max-w-6xl mx-auto ">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl text-[#03373D] font-bold text-center mb-12">{`We've helped thousands of sales teams`}</h2>
        
        <Marquee pauseOnHover speed={50} gradient={false}>
          {logos.map((logo, idx) => (
            <div key={idx} className="mx-24 flex items-center">
              
              <Image  className="h-6 object-contain" src={logo} alt={`Client Logo ${idx+1}` }></Image>
            </div>
          ))}
        </Marquee>

      </div>
      
    </section>
  );
};

export default ClientLogosMarquee;