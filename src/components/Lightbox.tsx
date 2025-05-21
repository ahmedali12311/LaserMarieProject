import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { galleryImages } from '../constants/data';

interface LightboxProps {
  selectedImageIndex: number | null;
  setSelectedImageIndex: (index: number | null) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ selectedImageIndex, setSelectedImageIndex }) => {
  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null) {
      const nextIndex = (selectedImageIndex + 1) % galleryImages.length;
      setSelectedImageIndex(nextIndex);
    }
  };

  const goToPrevImage = () => {
    if (selectedImageIndex !== null) {
      const prevIndex = (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImageIndex(prevIndex);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <AnimatePresence>
      {selectedImageIndex !== null && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="absolute top-6 right-6 text-white z-50" onClick={closeLightbox}>
            <X size={32} />
          </button>
          <div className="relative w-full h-full flex items-center justify-center p-10">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={galleryImages[selectedImageIndex].src}
                alt={galleryImages[selectedImageIndex].alt}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            onClick={goToPrevImage}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            onClick={goToNextImage}
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium">
            {`${selectedImageIndex + 1} / ${galleryImages.length}`}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};