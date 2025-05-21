import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

interface HeroSectionProps {
  cursorPosition: { x: number; y: number };
  isHoveringButton: boolean;
  setIsHoveringButton: (hover: boolean) => void;
}

interface HeroData {
  main_title: string;
  highlighted_texts: {
    text: string;
    is_highlighted: boolean;
    color?: string | null;
  }[];
  hero_image: {
    url: string;
  };
  social_links: {
    platform: string;
    url: string;
    icon_color?: string | null;
  }[];
  primary_button_text: string;
  primary_button_link: string;
}

const buttonVariants = {
  hoverGlint: {
    backgroundImage: 'linear-gradient(45deg, #8b8455, #a89e6b, #c5ba81)',
    boxShadow: '0 10px 30px rgba(139, 132, 85, 0.4)',
    transform: 'translateY(-3px)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
};

const socialButtonVariants = {
  hover: {
    backgroundColor: '#8b8455',
    color: '#fff',
    transform: 'translateY(-5px) rotate(5deg)',
    boxShadow: '0 10px 20px rgba(139, 132, 85, 0.4)',
    transition: { duration: 0.1 },
  },
  pulse: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  cursorPosition,
  isHoveringButton,
  setIsHoveringButton,
}) => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('https://my-strapi-backend.fly.dev/api/main-home-sections?populate=*');
        const { data } = await response.json();

        if (!data || !data[0]) {
          throw new Error('No hero data found');
        }

        const heroItem = data[0];

        const formattedData: HeroData = {
          main_title: heroItem.main_title,
          highlighted_texts: heroItem.highlighted_texts || [],
          hero_image: {
            url: heroItem.hero_image?.url
              ? `https://my-strapi-backend.fly.dev${heroItem.hero_image.url}`
              : '/fallback-hero.jpg',
          },
          social_links: heroItem.social_links || [],
          primary_button_text: heroItem.primary_button_text,
          primary_button_link: heroItem.primary_button_link,
        };

        setHeroData(formattedData);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const socialIcons = {
    WhatsApp: <FaWhatsapp className="w-8 h-8" />,
    Facebook: <FaFacebookF className="w-8 h-8" />,
    Instagram: <FaInstagram className="w-8 h-8" />,
  };

  if (loading) {
    return (
      <div className="relative h-screen min-h-[800px] bg-[#f9f6ef] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="relative h-screen min-h-[800px] bg-[#f9f6ef] flex items-center justify-center">
        Error loading hero section
      </div>
    );
  }

  return (
    <div className="relative h-screen min-h-[800px] bg-[#f9f6ef] overflow-hidden">
      {/* Wave Animation Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* ... keep your existing wave animation SVG ... */}
      </div>

      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `translate(${cursorPosition.x * 8}px, ${cursorPosition.y * 8}px)` }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={heroData.hero_image.url}
            alt="Hero background"
            className="absolute right-0 top-0 h-full w-full md:w-1/2 object-cover object-left"
            animate={{ scale: 1.02 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f9f6ef] via-[#f9f6ef]/40 to-transparent"></div>
        </div>
      </motion.div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8 md:px-16">
          <motion.div
            className="max-w-xl lg:max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-10 leading-tight text-[#333]">
              {heroData.highlighted_texts.map((part, index) => (
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
                    <span className="inline-block">{part.text}</span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hoverGlint"
                whileTap="tap"
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                className="inline-flex items-center bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-12 py-5 rounded-2xl font-medium text-xl transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center">
                  <a href={heroData.primary_button_link}>{heroData.primary_button_text}</a>
                  <motion.span className="ml-2">
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              className="flex space-x-10 mt-12 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {heroData.social_links.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  variants={socialButtonVariants}
                  whileHover="hover"
                  animate="pulse"
                  className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl text-[#8b8455] transition-all duration-100 shadow-lg z-10 hover:shadow-xl border border-[#8b8455]/20 hover:border-[#8b8455]/40 relative overflow-hidden"
                  style={{ color: item.icon_color || '#8b8455' }}
                >
                  <motion.div className="relative z-10">
                    {socialIcons[item.platform as keyof typeof socialIcons]}
                  </motion.div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};