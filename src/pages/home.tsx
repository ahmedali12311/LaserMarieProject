import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { WelcomeSection } from '../components/WelcomeSection';
import { NewsSlider } from '../components/NewsSlider';
import { GallerySection } from '../components/GallerySection';
import { Lightbox } from '../components/Lightbox';
import CardSection from '../components/CardSection';
import { useCursorPosition } from '../utils/cursorEffects';

const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const cursorPosition = useCursorPosition();

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-[#f9f6ef]">
      <HeroSection
        cursorPosition={cursorPosition}
        isHoveringButton={isHoveringButton}
        setIsHoveringButton={setIsHoveringButton}
      />
 
      <WelcomeSection isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <CardSection />
      <NewsSlider currentNewsIndex={currentNewsIndex} setCurrentNewsIndex={setCurrentNewsIndex} />
      <GallerySection openLightbox={openLightbox} />
      <Lightbox selectedImageIndex={selectedImageIndex} setSelectedImageIndex={closeLightbox} />
    </div>
  );
};

export default Home;
