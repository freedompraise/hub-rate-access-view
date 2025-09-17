import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const brandLogos = [
  'brands/ada.PNG',
  'brands/blaaiz.PNG',
  'brands/nitawand.JPG',
  'brands/norcho.PNG',
  'brands/nuli.PNG',
  'brands/sooyah_bistro.JPG',
  'brands/spring_stiches.PNG',
  'brands/tribe_lagos.PNG',
];

const FeaturedBrands = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to the beginning
      }
    }, 5000); // 5 seconds delay

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [api]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-10">
          Trusted by leading brands
        </h4>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {brandLogos.map((logo, index) => (
              <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="p-4 flex items-center justify-center">
                  <img
                    src={logo}
                    alt={`Brand logo ${index}`}
                    className="max-h-28 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px]" />
          <CarouselNext className="absolute right-[-50px]" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedBrands;
