import React, { useEffect, useState } from 'react';

export default function Carousel() {
  const [carouselImages, setCarouselImages] = useState(['', '', '']);

  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/random-images`);
        const images = await response.json();
        setCarouselImages(images);
      } catch (error) {
        console.error('Error fetching random images:', error);
      }
    };

    fetchRandomImages();
  }, []);

  return (
    <div>
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
        {/* ... Rest of the carousel JSX remains the same ... */}
        {carouselImages.map((imageUrl, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <img src={imageUrl} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ filter: "brightness(40%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
