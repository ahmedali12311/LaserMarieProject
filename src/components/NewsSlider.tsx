import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// Define the Image format (thumbnail, medium, etc.)
interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

// Define the Image object
interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: StrapiImageFormat;
    large: StrapiImageFormat;
    medium: StrapiImageFormat;
    small: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Define the NewsItem from Strapi
interface StrapiNewsItem {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  Link: string;
  Image: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Define the Strapi response
interface StrapiResponse {
  data: StrapiNewsItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Define the NewsItem shape for the component
interface NewsItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface NewsSliderProps {
  currentNewsIndex: number;
  setCurrentNewsIndex: (index: number) => void;
}

// Memoized News Item component to prevent unnecessary re-renders
const NewsItemComponent = React.memo(({ item }: { item: NewsItem }) => (
  <motion.div
    className="bg-[#f8f5ec] rounded-3xl overflow-hidden shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex flex-col md:flex-row items-center p-8 md:p-12">
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="mx-auto w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full md:w-2/3 md:pl-12 mt-8 md:mt-0">
        <motion.h3
          className="text-3xl md:text-4xl font-serif text-[#746e43] mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {item.title}
        </motion.h3>
        <motion.p
          className="text-[#555] mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {item.description}
        </motion.p>
        <motion.a
          href={item.link}
          className="inline-block px-8 py-3 border border-[#8b8455] text-[#8b8455] rounded-full transition-all hover:bg-[#8b8455] hover:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Meer Lezen
        </motion.a>
      </div>
    </div>
  </motion.div>
));

export const NewsSlider: React.FC<NewsSliderProps> = ({ currentNewsIndex, setCurrentNewsIndex }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    axios
      .get<StrapiResponse>('https://my-strapi-backend.fly.dev/api/news-items?populate=*')
      .then((response) => {
        // Map the Strapi response to the NewsItem format
        const fetchedNewsItems: NewsItem[] = response.data.data.map((item: StrapiNewsItem) => ({
          title: item.Title, // Map Title to title
          description: item.Description, // Map Description to description
          image: `https://my-strapi-backend.fly.dev${item.Image[0]?.formats?.medium?.url || item.Image[0]?.url || ''}`, // Use medium format for better performance
          link: item.Link, // Map Link to link
        }));
        setNewsItems(fetchedNewsItems);
      })
      .catch((error) => {
        console.error('Error fetching news items from Strapi:', error);
        setError('Failed to load news items. Please try again later.');
      });
  }, []); // Empty dependency array means this runs once on mount


  const goToNextNews = () => {
    const nextIndex = (currentNewsIndex + 1) % newsItems.length;
    setCurrentNewsIndex(nextIndex);
  };

  const goToPreviousNews = () => {
    const prevIndex = (currentNewsIndex - 1 + newsItems.length) % newsItems.length;
    setCurrentNewsIndex(prevIndex);
  };

  const goToNewsIndex = (index: number) => {
    setCurrentNewsIndex(index);
  };

  // Memoize news items to avoid re-computation
  const memoizedNewsItems = useMemo(() => newsItems, [newsItems]);

  // Handle error state
  if (error) {
    return (
      <section className="py-24 bg-[#f5f2e9] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.p
              className="text-lg uppercase tracking-widest text-[#8b8455] mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              LAATSTE
            </motion.p>
            <motion.h2
              className="text-5xl font-serif text-[#a89e6b]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Nieuws
            </motion.h2>
          </div>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  // Handle loading or empty state
  if (!memoizedNewsItems.length) {
    return (
      <section className="py-24 bg-[#f5f2e9] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.p
              className="text-lg uppercase tracking-widest text-[#8b8455] mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              LAATSTE
            </motion.p>
            <motion.h2
              className="text-5xl font-serif text-[#a89e6b]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Nieuws
            </motion.h2>
          </div>
          <div className="text-center">No news items available.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#f5f2e9] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            className="text-lg uppercase tracking-widest text-[#8b8455] mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            LAATSTE
          </motion.p>
          <motion.h2
            className="text-5xl font-serif text-[#a89e6b]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Nieuws
          </motion.h2>
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <NewsItemComponent key={currentNewsIndex} item={memoizedNewsItems[currentNewsIndex]} />
          </AnimatePresence>
          <motion.button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#8b8455] text-white flex items-center justify-center hover:bg-[#a89e6b] transition-all"
            onClick={goToPreviousNews}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#8b8455] text-white flex items-center justify-center hover:bg-[#a89e6b] transition-all"
            onClick={goToNextNews}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
          <div className="flex justify-center mt-8 space-x-2">
            {memoizedNewsItems.map((_: NewsItem, index: number) => (
              <button
                key={index}
                onClick={() => goToNewsIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentNewsIndex === index ? 'bg-[#8b8455]' : 'bg-[#f1ece0] border border-[#8b8455]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};