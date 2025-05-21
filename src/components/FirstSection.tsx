import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Fallback images
import fallbackImage1 from '../assets/cardphotos/21.jpg';
import fallbackImage2 from '../assets/cardphotos/67.jpg';
import fallbackImage3 from '../assets/cardphotos/68.jpg';

// Hardcoded Strapi URL
const STRAPI_URL = 'https://my-strapi-backend.fly.dev';

// Interfaces
interface SocialLink {
  platform: string;
  url: string;
  icon_color?: string | null;
}

interface SliderImage {
  url: string;
  alternativeText: string;
}

interface HighlightedText {
  text: string;
  is_highlighted: boolean;
  color?: string | null;
}

interface HeroSectionData {
  title: string;
  highlighted_texts: HighlightedText[];
  description: string;
  cta_text: string;
  show_arrow_icon: boolean;
  show_phone_button: boolean;
  variant: 'default' | 'alternate';
  slider_images: SliderImage[];
  social_links: SocialLink[];
  phone: string;
}

interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string | null;
  formats?: {
    medium?: { url: string };
  };
}

interface StrapiResponse {
  data: Array<{
    Title?: string;
    highlighted_texts?: HighlightedText[];
    description?: string;
    cta_text?: string;
    show_arrow_icon?: boolean;
    show_phone_button?: boolean;
    variant?: 'default' | 'alternate';
    slider_images?: StrapiImage[];
    social_links?: SocialLink[];
    phone?: string;
  }>;
}

// Constants
const socialIcons: { [key: string]: React.ComponentType<{ size: number }> } = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  pauseOnHover: true,
  cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  customPaging: (i: number) => (
    <div
      className="w-3 h-3 bg-white/70 rounded-full mx-1 hover:bg-white transition-all duration-300 cursor-pointer"
      aria-label={`Go to slide ${i + 1}`}
    />
  ),
  dotsClass: 'slick-dots !bottom-8',
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.1 } },
};

const buttonHover = {
  scale: 1.05,
  backgroundColor: '#a89e6b',
  transition: { duration: 0.2 },
};

const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

const fallbackImages: SliderImage[] = [
  { url: fallbackImage1, alternativeText: 'Fallback Image 1' },
  { url: fallbackImage2, alternativeText: 'Fallback Image 2' },
  { url: fallbackImage3, alternativeText: 'Fallback Image 3' },
];

// Memoized Title component
const RenderTitle = React.memo(
  ({ title, highlighted_texts, variant }: { title: string; highlighted_texts: HighlightedText[]; variant: 'default' | 'alternate' }) => {
    if (variant === 'alternate') {
      return <span>{title}</span>;
    }

    return (
      <>
        {highlighted_texts.map((part, index) => (
          <React.Fragment key={index}>
            {part.is_highlighted ? (
              <motion.span
                className="relative inline-block"
                style={{ color: part.color || '#8b8455' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                {part.text}
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1"
                  style={{ backgroundColor: part.color || '#8b8455' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                />
              </motion.span>
            ) : (
              <span>{part.text}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  }
);

// Memoized Slider Item component
const SliderItem = React.memo(({ image, index }: { image: SliderImage; index: number }) => (
  <motion.div
    className="h-full focus:outline-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="h-full w-full flex items-center justify-center overflow-hidden">
      <img
        src={image.url}
        alt={image.alternativeText}
        loading={index < 2 ? 'eager' : 'lazy'}
        className="min-h-full min-w-full object-cover transition-transform duration-1000 hover:scale-105"
      />
    </div>
  </motion.div>
));

const FirstSection: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchHeroData = useCallback(async () => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/first-sections?populate=*`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const { data }: StrapiResponse = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('No hero section data found');
        setFetchError('No hero section data available');
        return;
      }

      const heroItem = data[0] || {};
      const formattedData: HeroSectionData = {
        title: heroItem.Title || 'Zijdezachte huid met permanente laserontharing',
        highlighted_texts: heroItem.highlighted_texts || [
          { text: 'Zijdezachte', is_highlighted: true, color: '#8b8455' },
          { text: ' huid met permanente ', is_highlighted: false, color: null },
          { text: 'laserontharing', is_highlighted: true, color: '#8b8455' },
        ],
        description:
          heroItem.description ||
          'Professionele behandelingen voor een blijvend glad resultaat zonder irritatie.',
        cta_text: heroItem.cta_text || 'Maak een afspraak',
        show_arrow_icon: heroItem.show_arrow_icon ?? false,
        show_phone_button: heroItem.show_phone_button ?? false,
        variant: heroItem.variant || 'default',
        slider_images: Array.isArray(heroItem.slider_images)
          ? heroItem.slider_images.map((img) => ({
              url: `${STRAPI_URL}${img.formats?.medium?.url || img.url}`,
              alternativeText: img.alternativeText || `Treatment example ${img.id}`,
            }))
          : fallbackImages,
        social_links: Array.isArray(heroItem.social_links)
          ? heroItem.social_links.map((link) => ({
              platform: link.platform || '',
              url: link.url || '',
              icon_color: link.icon_color || '#8b8455',
            }))
          : [],
        phone: heroItem.phone || '0492318740',
      };

      setHeroData(formattedData);
    } catch (err: any) {
      console.error('Error fetching hero section data:', {
        message: err.message,
        stack: err.stack,
      });
      setFetchError('Failed to load hero section data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);

  // Memoize hero data to avoid re-computation
  const memoizedHeroData = useMemo(() => heroData, [heroData]);

  const handleRetry = () => {
    setLoading(true);
    setFetchError(null);
    fetchHeroData();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="md:w-1/2 space-y-6">
            <div className="h-16 bg-gray-200 rounded w-3/4" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="md:w-1/2">
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !memoizedHeroData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{fetchError || 'No data available'}</p>
        <button
          onClick={handleRetry}
          className="bg-[#8b8455] text-white px-6 py-2 rounded-full hover:bg-[#a89e6b] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section
      className={`relative ${memoizedHeroData.variant === 'alternate' ? 'bg-[#f9f8f5]' : ''}`}
      role="banner"
      aria-label="Hero Section"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-8 py-12 pt-24 md:pt-28"
      >
        {/* Left Side - Text and Button */}
        <div className="md:w-1/2 space-y-6 mb-8 md:mb-0 md:pr-8">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight ${
              memoizedHeroData.variant === 'alternate' ? 'text-[#444]' : 'text-gray-900'
            }`}
          >
            <RenderTitle
              title={memoizedHeroData.title}
              highlighted_texts={memoizedHeroData.highlighted_texts}
              variant={memoizedHeroData.variant}
            />
          </h1>

          {memoizedHeroData.variant === 'default' && (
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">{memoizedHeroData.description}</p>
          )}

          <div className={`flex ${memoizedHeroData.show_phone_button ? 'flex-col sm:flex-row gap-4' : 'gap-4'} pt-4`}>
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              className="bg-[#8b8455] hover:bg-[#a89e6b] text-white px-8 py-3.5 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
              aria-label={memoizedHeroData.cta_text}
            >
              {memoizedHeroData.cta_text}
              {memoizedHeroData.show_arrow_icon && <ArrowRight size={20} className="mt-0.5" />}
            </motion.button>

            {memoizedHeroData.show_phone_button && (
              <motion.a
                href={`tel:${memoizedHeroData.phone}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="border-2 border-[#8b8455] text-[#8b8455] hover:bg-[#f9f8f5] px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
                aria-label={`Call us at ${memoizedHeroData.phone}`}
              >
                <FaWhatsapp size={18} />
                {memoizedHeroData.phone}
              </motion.a>
            )}
          </div>

          {/* Social Icons - Only show in default variant */}
          {memoizedHeroData.variant === 'default' && (
            <div className="flex space-x-5 pt-2" role="navigation" aria-label="Social media links">
              {memoizedHeroData.social_links.length > 0 ? (
                memoizedHeroData.social_links.map((link, index) => {
                  const IconComponent = socialIcons[link.platform];
                  return (
                    <motion.a
                      key={`social-${index}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15 }}
                      className="text-[#8b8455] hover:text-[#a89e6b] transition-colors p-1"
                      aria-label={`Visit our ${link.platform} page`}
                      style={link.icon_color ? { color: link.icon_color } : {}}
                    >
                      {IconComponent ? <IconComponent size={24} /> : <span>{link.platform}</span>}
                    </motion.a>
                  );
                })
              ) : (
                <span className="text-gray-600">No social links available</span>
              )}
            </div>
          )}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          className="md:w-1/2 relative w-full"
        >
          <div className="aspect-w-16 aspect-h-9 md:aspect-w-4 md:aspect-h-3 rounded-xl overflow-hidden shadow-xl">
            <Slider {...sliderSettings} className="h-full" aria-label="Hero image slider">
              {memoizedHeroData.slider_images.length > 0 ? (
                memoizedHeroData.slider_images.map((image, index) => (
                  <SliderItem key={index} image={image} index={index} />
                ))
              ) : (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#f9f6ef] to-[#e8e1d1]">
                  <span className="text-gray-600">No images available</span>
                </div>
              )}
            </Slider>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-xl" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FirstSection;