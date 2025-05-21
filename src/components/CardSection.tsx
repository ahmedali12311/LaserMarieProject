import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 0.77, 0.47, 0.97],
    },
  }),
  hover: {
    y: -10,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const buttonVariants = {
  hover: {
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

const imageHover = {
  initial: { scale: 1, filter: 'brightness(1)' },
  hover: {
    scale: 1.05,
    filter: 'brightness(1.1)',
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

interface Card {
  id: number;
  Title: string;
  Description: string;
  Image: { url: string };
  Link: string;
  Highlights: string[];
}

// Memoized Card component to prevent unnecessary re-renders
const CardItem = React.memo(({ card, index }: { card: Card; index: number }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    whileHover="hover"
    className="flex flex-col"
  >
    <motion.div className="relative h-64 overflow-hidden rounded-lg" variants={imageHover}>
      <img
        src={card.Image.url}
        alt={card.Title}
        className="w-full h-full object-cover object-center"
        style={{ willChange: 'transform' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/60 to-transparent" />
    </motion.div>

    <div className="mt-6 flex-1 flex flex-col">
      <h3 className="text-2xl font-serif text-[#4a4a4a] mb-4">{card.Title}</h3>
      <p className="text-[#666] text-base leading-relaxed mb-6">{card.Description}</p>
      <ul className="space-y-2 mb-8">
        {card.Highlights.map((highlight, i) => (
          <motion.li
            key={`${card.id}-${i}`}
            className="flex items-center text-sm text-[#666]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <span className="mr-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#8b8455]/10 flex items-center justify-center text-[#8b8455]">
              <Check className="w-3 h-3" />
            </span>
            {highlight}
          </motion.li>
        ))}
      </ul>
      <motion.a
        href={card.Link}
        className="inline-flex items-center bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-8 py-4 rounded-full font-sans font-medium text-base shadow-lg hover:shadow-2xl transition-all duration-300 mt-auto"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Lees Meer
        <motion.span className="ml-3" variants={buttonVariants} whileHover="icon" transition={{ duration: 0.2 }}>
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </motion.a>
    </div>
  </motion.div>
));

const CardSection: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://my-strapi-backend.fly.dev/api/cards?populate=*', {
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.data) {
          throw new Error('No data received from API');
        }

        const formattedCards = result.data.map((card: any) => ({
          id: card.id,
          Title: card.attributes?.Title || card.Title || 'Untitled',
          Description: card.attributes?.Description || card.Description || '',
          Image: {
            url:
              card.attributes?.Image?.data?.attributes?.url || card.Image?.url
                ? `https://my-strapi-backend.fly.dev${card.attributes?.Image?.data?.attributes?.url || card.Image.url}`
                : '/fallback-image.jpg',
          },
          Link: card.attributes?.Link || card.Link || '#',
          Highlights: (
            card.attributes?.CardHighlight || card.CardHighlight || []
          )
            .filter((highlight: any) => highlight?.text)
            .map((highlight: any) => highlight.text),
        }));

        setCards(formattedCards);
        setError(null);
      } catch (err) {
        setError('Failed to load card data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Memoize formatted cards to avoid re-computation
  const memoizedCards = useMemo(() => cards, [cards]);

  if (loading) {
    return <div className="text-center py-24">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-24">{error}</div>;
  }

  if (memoizedCards.length === 0) {
    return <div className="text-center py-24">No cards available</div>;
  }

  return (
    <section className="py-24 md:py-32 text-center bg-[#f9f6ef] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-serif text-[#4a4a4a] mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ons Aanbod
          <motion.span
            className="block w-16 h-1 bg-[#8b8455] mx-auto mt-2"
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {memoizedCards.map((card, index) => (
            <CardItem key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;