import AboutBarrel from "@/components/CardsComponent/AboutBarrel";
import Works from "@/components/CardsComponent/Works";
import Hero from "@/components/HeroSection/Hero";
import ShippingSlider from "@/components/Shipping/Shipping";

import TestimonialSection from "@/components/Testimonial/Testimonial";

// import { Shipping } from "@/components/Shipping/Shipping";


const HompPage = () => {
  return (
    <div className="bg-white">
      <Hero />
      <Works />
      <ShippingSlider/>
      <AboutBarrel />
      <TestimonialSection/>
    </div>
  );
};

export default HompPage;
