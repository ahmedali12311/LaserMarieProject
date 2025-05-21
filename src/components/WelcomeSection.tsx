import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface WelcomeSectionProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

interface SubSection {
  id: number;
  Subtitle: string;
  Description: string;
  Link: string;
  LinkText: string;
}

interface WelcomeData {
  MainTitle: string;
  MainDescription: string;
  MainLink: string;
  SubSection: SubSection[];
}

const secondaryButtonVariants = {
  hover: {
    backgroundColor: '#8b8455',
    scale: 1.05,
    boxShadow: '0 12px 40px rgba(139, 132, 85, 0.4)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: { scale: 0.95 },
  icon: {
    x: 5,
    transition: { duration: 0.2 },
  },
};

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ isExpanded, setIsExpanded }) => {
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data with caching
  useEffect(() => {
    const fetchWelcomeSection = async () => {
      try {
        const response = await fetch('https://my-strapi-backend.fly.dev/api/welcome-section?populate=*', {
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const data = result.data?.attributes || result.data;
        if (!data) {
          throw new Error('No valid data received from API');
        }
        setWelcomeData({
          MainTitle: data.MainTitle || '',
          MainDescription: data.MainDescription || '',
          MainLink: data.MainLink || '#',
          SubSection: data.SubSection || [],
        });
      } catch (error: any) {
        console.error('Error fetching welcome section:', error.message);
        setError('Failed to load welcome section data. Please try again later.');
      }
    };
    fetchWelcomeSection();
  }, []);

  // Memoize parsed description
  const parsedDescription = useMemo(() => {
    if (!welcomeData?.MainDescription) return null;
    return welcomeData.MainDescription.split('Laserstudio Marie').map((part, index, array) =>
      index < array.length - 1 ? (
        <React.Fragment key={index}>
          {part}
          <a href={welcomeData.MainLink} className="text-[#8b8455] hover:underline font-medium">
            Laserstudio Marie
          </a>
        </React.Fragment>
      ) : (
        part
      )
    );
  }, [welcomeData]);

  // Handle loading and error states
  if (error) {
    return <div className="text-red-500 text-center py-24">{error}</div>;
  }
  if (!welcomeData) {
    return <div className="text-center py-24">Loading...</div>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="py-24 md:py-32 text-center bg-[#f9f6ef] relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.h2
          className="text-sm md:text-base uppercase tracking-[0.2em] text-[#8b8455] font-sans mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          WELKOM BIJ
        </motion.h2>
        <motion.h1
          className="text-4xl md:text-6xl font-serif font-bold text-[#4a4a4a] mb-10 tracking-tight"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href={welcomeData.MainLink} className="hover:text-[#8b8455] transition-colors duration-300">
            {welcomeData.MainTitle}
          </a>
        </motion.h1>
        <motion.div
          className="max-w-3xl mx-auto text-[#666] leading-relaxed space-y-8 font-sans text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="mb-8">{parsedDescription}</p>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                {welcomeData.SubSection.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-serif text-[#8b8455] mb-4">{item.Subtitle}</h3>
                    <p className="mb-4">{item.Description}</p>
                    <a
                      href={item.Link}
                      className="inline-block mt-2 text-[#8b8455] hover:underline font-medium"
                    >
                      {item.LinkText}
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          variants={secondaryButtonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-10 inline-flex items-center bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-8 py-4 rounded-full font-sans font-medium text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {isExpanded ? 'Minder info' : 'Meer info'}
          <motion.span
            className="ml-3"
            variants={secondaryButtonVariants}
            whileHover="icon"
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </div>
    </motion.section>
  );
};