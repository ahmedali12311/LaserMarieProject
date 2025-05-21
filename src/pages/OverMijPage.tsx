import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import FirstSection from '../components/FirstSection';

// Fallback image
import fallbackImage from '../assets/cardphotos/21.jpg';

// CSS for wave animation and liquid ripple
const waveKeyframes = `
  @keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(4); opacity: 0; }
  }
`;

interface OverMijData {
  intro_badge: string;
  intro_title: string;
  intro_highlighted_text: string;
  intro_description: string;
  story_title: string;
  story_description: string;
  benefits_title: string;
  benefits_description: string;
  experience_title: string;
  experience_description: string;
  content_image: {
    url: string;
    alternativeText: string;
  };
  cta_badge: string;
  cta_title: string;
  cta_description: string;
  cta_booking_url: string;
  cta_booking_text: string;
  cta_info_url: string;
  cta_info_text: string;
  cta_phone: string;
}

interface StrapiResponse {
  data: OverMijData;
}

const OverMij: React.FC = () => {
  const [data, setData] = useState<OverMijData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 80]);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://my-strapi-backend.fly.dev/api/over-mij-pages?populate=*', {
      
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const responseData: StrapiResponse = await response.json();

        const attributes = responseData.data || {};
        const formattedData: OverMijData = {
          intro_badge: attributes.intro_badge || 'PERSOONLIJKE AANDACHT',
          intro_title: attributes.intro_title || 'Marie, jouw laserontharingsspecialist',
          intro_highlighted_text: attributes.intro_highlighted_text || 'laserontharingsspecialist',
          intro_description:
            attributes.intro_description ||
            'Met jarenlange ervaring en een persoonlijke aanpak help ik je naar een blijvend haarvrij resultaat.',
          story_title: attributes.story_title || 'Mijn verhaal',
          story_description:
            attributes.story_description ||
            'Als moeder en ondernemer weet ik hoe belangrijk zelfvertrouwen is...',
          benefits_title: attributes.benefits_title || 'De voordelen',
          benefits_description:
            attributes.benefits_description ||
            'Laserontharing biedt meer dan alleen een gladde huid...',
          experience_title: attributes.experience_title || 'De ervaring',
          experience_description:
            attributes.experience_description ||
            'Mijn studio is ontworpen voor ultiem comfort...',
          content_image: {
            url: attributes.content_image?.url
              ? `https://my-strapi-backend.fly.dev${attributes.content_image.url}`
              : fallbackImage,
            alternativeText: attributes.content_image?.alternativeText || 'Marie van Laserstudio Marie',
          },
          cta_badge: attributes.cta_badge || 'START NU',
          cta_title: attributes.cta_title || 'Klaar voor een transformatie?',
          cta_description:
            attributes.cta_description || 'Boek een gratis consult of start direct met je eerste behandeling.',
          cta_booking_url: attributes.cta_booking_url || 'https://salonkee.be/salon/laserstudio-marie?lang=nl',
          cta_booking_text: attributes.cta_booking_text || 'Laserstudio Marie',
          cta_info_url: attributes.cta_info_url || '/contact',
          cta_info_text: attributes.cta_info_text || 'Meer informatie',
          cta_phone: attributes.cta_phone || '0492318740',
        };

        setData(formattedData);
      } catch (err: any) {
        console.error('Error fetching OverMij data:', err.message);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 50,
        ease: 'easeInOut',
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0, rotate: 1 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: 'easeInOut',
      },
    },
  };

  // Memoized data to prevent re-renders
  const memoizedData = useMemo(() => data, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] via-[#f7f4ea] to-[#f5f2e9] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-8 w-48 bg-[#d4d1c3] rounded-full mb-4 mx-auto" />
          <p className="text-[#6b6651] text-lg">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  if (error || !memoizedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] via-[#f7f4ea] to-[#f5f2e9] font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Geen inhoud beschikbaar'}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-[#8b8455] text-white px-6 py-3 rounded-full hover:bg-[#a89e6b] transition-all duration-300 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Opnieuw proberen
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-[#4a4637] relative overflow-hidden">
      <style>{waveKeyframes}</style>
      {/* Dynamic Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#f9f6ef] via-[#f7f4ea] to-[#f5f2e9]"
        style={{ y: backgroundY }}
      />
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a4637]/5 to-transparent pointer-events-none" />
      {/* Pulsating Glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,132,85,0.06)_0%,transparent_70%)] pointer-events-none"
        animate={{ scale: [1, 1.03, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#8b8455]/5 animate-wave opacity-30 pointer-events-none" />

      <FirstSection />


           {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative"
      >
       
        {/* Intro Section */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 md:mb-24">
          <motion.div
            className="inline-flex items-center gap-2 bg-[#8b8455]/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-[#8b8455]" />
            <span className="text-sm font-medium text-[#8b8455] tracking-wide">{memoizedData.intro_badge}</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#4a4637] mb-4 tracking-tight">
            {memoizedData.intro_title.split(memoizedData.intro_highlighted_text).map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <motion.span
                    className="text-[#8b8455] font-semibold"
                    style={{ textShadow: '0 0 5px rgba(139, 132, 85, 0.3)' }}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {memoizedData.intro_highlighted_text}
                  </motion.span>
                </span>
              ) : (
                part
              ),
            )}
          </h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-[#6b6651] max-w-3xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {memoizedData.intro_description}
          </motion.p>
        </motion.div>

        {/* Content and Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div variants={containerVariants} className="space-y-10 sm:space-y-12">
            {[
              {
                title: memoizedData.story_title,
                description: memoizedData.story_description,
                offset: 'border-l-4 border-[#8b8455]/20 pl-4',
              },
              {
                title: memoizedData.benefits_title,
                description: memoizedData.benefits_description,
                offset: 'border-r-4 border-[#8b8455]/20 pr-4',
              },
              {
                title: memoizedData.experience_title,
                description: memoizedData.experience_description,
                offset: 'border-l-4 border-[#8b8455]/20 pl-4',
              },
            ].map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group bg-[#fdfdfb] p-6 rounded-2xl border border-[#e5e2d8]/30 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-md ${section.offset}`}
                whileHover={{ y: -4, scale: 1.02 }}
                whileInView={{ scale: [1, 1.03, 1] }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-[#8b8455]/10 flex items-center justify-center group-hover:bg-[#8b8455]/20 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles className="w-5 h-5 text-[#8b8455]" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#4a4637] mb-3 tracking-tight sticky top-0 bg-[#fdfdfb] z-10">
                      {section.title}
                    </h3>
                    <p className="text-[#6b6651] leading-relaxed text-sm sm:text-base">{section.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image */}
          <motion.div
            variants={imageVariants}
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl border border-[#e5e2d8]/30 bg-[#8b8455]/10">
              <motion.img
                src={memoizedData.content_image.url}
                alt={memoizedData.content_image.alternativeText}
                className="w-full h-auto sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                loading="lazy"
                srcSet={`${memoizedData.content_image.url}?w=400 400w, ${memoizedData.content_image.url}?w=800 800w`}
                sizes="(max-width: 640px) 400px, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4a4637]/10 to-transparent" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cdefs%3E%3Cpattern id=%22grain%22 patternUnits=%22userSpaceOnUse%22 width=%2210%22 height=%2210%22%3E%3Ccircle cx=%225%22 cy=%225%22 r=%221%22 fill=%22rgba(0,0,0,0.05)%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grain)%22/%3E%3C/svg%3E')] opacity-5" />
            </div>
            <motion.div
              className="absolute -z-10 inset-0 rounded-3xl bg-[#8b8455]/10 blur-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          className="mt-20 sm:mt-28 md:mt-36 max-w-5xl mx-auto relative"
        >
          <motion.div
            className="bg-[#fdfdfb] p-8 sm:p-10 md:p-14 rounded-3xl shadow-lg border border-[#e5e2d8]/30 backdrop-blur-md relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,132,85,0.1)_0%,transparent_70%)]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative z-10">
              <div className="text-center mb-8 sm:mb-10">
                <motion.div
                  className="inline-flex items-center gap-2 bg-[#8b8455]/10 px-4 py-2 rounded-full mb-4 backdrop-blur-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4 text-[#8b8455]" />
                  <span className="text-sm font-medium text-[#8b8455] tracking-wide">{memoizedData.cta_badge}</span>
                </motion.div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4a4637] mb-4 tracking-tight">
                  {memoizedData.cta_title}
                </h3>
                <p className="text-base sm:text-lg text-[#6b6651] max-w-2xl mx-auto leading-relaxed">
                  {memoizedData.cta_description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <motion.a
                  href={memoizedData.cta_booking_url}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 25px rgba(139, 132, 85, 0.3)',
                    borderColor: 'rgba(139, 132, 85, 0.5)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="relative flex-1 max-w-md bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-8 py-4 rounded-xl font-semibold text-base sm:text-lg overflow-hidden group border border-transparent"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#a89e6b]/50 rounded-full animate-ripple"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 4, opacity: 0.4 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="relative flex items-center justify-center gap-3 z-10">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Calendar className="w-5 sm:w-6 h-5 sm:h-6" />
                    </motion.div>
                    {memoizedData.cta_booking_text}
                  </div>
                </motion.a>

                <motion.a
                  href={memoizedData.cta_info_url}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 25px rgba(139, 132, 85, 0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="relative flex-1 max-w-md bg-[#fdfdfb] text-[#8b8455] border-2 border-[#8b8455] px-8 py-4 rounded-xl font-semibold text-base sm:text-lg overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#8b8455]/10 rounded-full animate-ripple"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 4, opacity: 0.3 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="relative flex items-center justify-center gap-3 z-10">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                    </motion.div>
                    {memoizedData.cta_info_text}
                  </div>
                </motion.a>
              </div>

              <motion.div
                className="text-center mt-6 sm:mt-8 text-sm text-[#6b6651]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Of bel direct:{' '}
                <motion.a
                  href={`tel:${memoizedData.cta_phone}`}
                  className="text-[#8b8455] font-medium flex items-center justify-center gap-2 group relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Phone className="w-4 h-4" />
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-[#8b8455]/20 group-hover:bg-[#8b8455]/30"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                  {memoizedData.cta_phone}
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OverMij;