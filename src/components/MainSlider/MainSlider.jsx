import React, { useState } from 'react';
import slider1 from "../../assets/slider-image-1.jpeg";
import slider2 from "../../assets/slider-image-2.jpeg";
import slider3 from "../../assets/slider-image-3.jpeg";
import slider4 from "../../assets/slider-2.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function MainSlider() {
  const [imageError, setImageError] = useState({});

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Arrows disabled
    fade: true,
    dotsClass: "slick-dots !bottom-4",
    customPaging: () => (
      <div className="w-3 h-3 mx-1 bg-white/50 rounded-full hover:bg-white/80 transition-all duration-300" />
    ),
  };

  const handleImageError = (imageId) => {
    setImageError(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const slides = [
    { id: 1, image: slider1, alt: "Slide 1" },
    { id: 2, image: slider4, alt: "Slide 2" }
  ];

  const promoImages = [
    { id: 3, image: slider2, alt: "Promo 1" },
    { id: 4, image: slider3, alt: "Promo 2" }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side - Slider */}
        <div className="md:w-3/4 relative">
          <div className="rounded-lg overflow-hidden">
            <Slider {...settings}>
              {slides.map((slide) => (
                <div key={slide.id} className="h-[400px]">
                  
                  {/* // Image Error State */}
                  {imageError[slide.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">Image not available</span>
                    </div>
                  ) : (
                    <img 
                      className="w-full h-full object-cover"
                      src={slide.image}
                      alt={slide.alt}
                      onError={() => handleImageError(slide.id)}
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Right side - Static images */}
        <div className="md:w-1/4 flex flex-col gap-4">
          {promoImages.map((promo) => (
            <div key={promo.id} className="h-[190px] overflow-hidden rounded-lg relative group">
              {imageError[promo.id] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Image not available</span>
                </div>
              ) : (
                <img 
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  src={promo.image}
                  alt={promo.alt}
                  onError={() => handleImageError(promo.id)}
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
