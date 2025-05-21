import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// Define interfaces for the API response structure
interface GalleryImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

interface GalleryItem {
  id: number;
  show_on_home: boolean | null;
  GalleryImage: GalleryImage;
}

interface GalleryItemResponse {
  id: number;
  GalleryItem: {
    id: number;
    Title: string;
    description: string;
    GalleryImages: GalleryItem[];
  };
}

interface ApiResponse {
  data: GalleryItemResponse[];
}

// Interface for the component's gallery item
interface GalleryItemProps {
  id: number;
  image: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
  show_on_home: boolean;
}

interface GallerySectionProps {
  openLightbox: (index: number) => void;
}

// Memoized Gallery Item component to prevent unnecessary re-renders
const GalleryItemComponent = React.memo(
  ({ item, index, openLightbox }: { item: GalleryItemProps; index: number; openLightbox: (index: number) => void }) => (
    <motion.div
      className={`relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group ${
        index === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
      onClick={() => openLightbox(index)}
    >
      <div className="w-full h-full">
        <img
          src={item.image.url}
          alt={item.image.alternativeText}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      {index === 0 && <div className="absolute inset-0 flex flex-col justify-between p-8 text-white"></div>}
    </motion.div>
  )
);

export const GallerySection: React.FC<GallerySectionProps> = ({ openLightbox }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch(
          'https://my-strapi-backend.fly.dev/api/gallery-items?populate[GalleryItem][populate][GalleryImages][populate]=*',
          {
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        const responseData: ApiResponse = await response.json();

        if (!responseData.data || !Array.isArray(responseData.data) || responseData.data.length === 0) {
          throw new Error('No gallery items found');
        }

        // Extract GalleryImages from the first gallery item and filter by show_on_home
        const galleryImages = responseData.data[0]?.GalleryItem?.GalleryImages || [];
        const formattedItems: GalleryItemProps[] = galleryImages
          .filter((item) => item.show_on_home === true) // Filter for show_on_home: true
          .map((item) => ({
            id: item.id,
            image: {
              url: item.GalleryImage?.url
                ? `https://my-strapi-backend.fly.dev${item.GalleryImage.url}`
                : '/fallback-image.jpg',
              alternativeText: item.GalleryImage?.alternativeText || `Gallery image ${item.id}`,
              width: item.GalleryImage?.width || 0,
              height: item.GalleryImage?.height || 0,
            },
            show_on_home: item.show_on_home ?? false,
          }));

        setGalleryItems(formattedItems);
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Memoize gallery items to avoid re-computation
  const memoizedGalleryItems = useMemo(() => galleryItems, [galleryItems]);

  if (loading) {
    return (
      <section className="py-24 bg-[#f1ece0] relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center">Loading gallery...</div>
      </section>
    );
  }

  if (error || memoizedGalleryItems.length === 0) {
    return (
      <section className="py-24 bg-[#f1ece0] relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center">
          {error || 'No gallery images available'}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#f1ece0] relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            className="text-base uppercase tracking-widest text-[#8b8455] mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ONZE
          </motion.p>
          <motion.h2
            className="text-5xl font-serif text-[#8b8455]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Galerij
          </motion.h2>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          {memoizedGalleryItems.map((item, index) => (
            <GalleryItemComponent key={item.id} item={item} index={index} openLightbox={openLightbox} />
          ))}
        </div>
      </div>
    </section>
  );
};