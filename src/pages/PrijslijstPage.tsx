import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FirstSection from '../components/FirstSection';

interface PricingItem {
  name: string;
  price: string;
}

interface PricingSection {
  category: string;
  icon: string;
  items: PricingItem[];
}

interface PrijslijstData {
  pricing_sections: PricingSection[];
  contact_title: string;
  contact_description: string;
  contact_button_url: string;
  contact_button_text: string;
  appointment_button_url: string;
  appointment_button_text: string;
}

interface StrapiResponse {
  data: PrijslijstData[];
}

const PrijslijstPage: React.FC = () => {
  const [data, setData] = useState<PrijslijstData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://my-strapi-backend.fly.dev/api/prijslijst-pages?populate[pricing_sections][populate]=items',
          { cache: 'force-cache' }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const responseData: StrapiResponse = await response.json();
        console.log('Raw API Response:', responseData);

        const attributes = responseData.data[0] || {};
        const formattedData: PrijslijstData = {
          pricing_sections: Array.isArray(attributes.pricing_sections)
            ? attributes.pricing_sections.map((section: any) => ({
                category: section.category || '',
                icon: section.icon || '',
                items: Array.isArray(section.items)
                  ? section.items.map((item: any) => ({
                      name: item.name || '',
                      price: item.price || '',
                    }))
                  : [],
              }))
            : [],
          contact_title: attributes.contact_title || 'Maak een afspraak',
          contact_description:
            attributes.contact_description?.trim() ||
            'Heb je vragen over een behandeling of wil je meerdere zones combineren? Ik denk graag met jou mee. Aarzel niet om even contact op te nemen met Laserstudio Marie. Wil je meteen een afspraak maken? Dat kan eenvoudig online!',
          contact_button_url: attributes.contact_button_url || '/contact',
          contact_button_text: attributes.contact_button_text || 'Contacteer mij',
          appointment_button_url:
            attributes.appointment_button_url || 'https://salonkee.be/salon/laserstudio-marie?lang=nl',
          appointment_button_text: attributes.appointment_button_text || 'Online afspraak',
        };

        setData(formattedData);
      } catch (err: any) {
        console.error('Error fetching Prijslijst data:', err.message);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  // Memoized data to prevent re-renders
  const memoizedData = useMemo(() => data, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#f5f2e9] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-8 w-48 bg-[#d4d1c3] rounded-full mb-4 mx-auto" />
          <p className="text-[#6b6651] text-lg">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  if (error || !memoizedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#f5f2e9] font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Geen inhoud beschikbaar'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#8b8455] text-white px-6 py-3 rounded-full hover:bg-[#a89e6b] transition-all duration-300 shadow-md"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#f5f2e9] font-sans">
      <FirstSection />
      {/* Animated divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-px bg-gradient-to-r from-transparent via-[#8b8455] to-transparent mx-auto my-5 sm:my-16 md:my-9"
      />
      {/* Pricing Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#f9f6ef] to-[#f5f2e9] relative overflow-hidden"
      >
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,132,85,0.03)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
          >
        <h2
  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight"
  style={{ color: "rgba(134, 125, 72, 0.9)" }}
>
  Transparante Prijzen
</h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6b6651] leading-relaxed max-w-2xl mx-auto">
              Ontdek onze heldere tarieven voor laserontharingsbehandelingen. Combineer zones voor aantrekkelijke pakketten.
            </p>
          </motion.div>

          {memoizedData.pricing_sections.length > 0 ? (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
            >
              {memoizedData.pricing_sections.map((section, index) => (
                <motion.div
                  key={`${section.category}-${index}`}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.3, ease: 'easeOut' } }}
                  className="bg-[#fdfdfb] border border-[#e5e2d8]/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-[#f9f6ef] to-[#f0ede4] px-5 sm:px-6 py-4 border-b border-[#e5e2d8]/50 flex items-center gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl">{section.icon}</span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#8b8455] tracking-tight">
                      {section.category}
                    </h3>
                  </div>
                  <div className="divide-y divide-[#e5e2d8]/50">
                    {section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          variants={itemVariants}
                          className="px-5 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center hover:bg-[#f9f6ef]/20 transition-colors duration-200"
                          role="listitem"
                        >
                          <span className="text-sm sm:text-base md:text-lg text-[#4a4637]">{item.name}</span>
                          <span className="font-semibold text-[#4a4637] text-sm sm:text-base md:text-lg">
                            {item.price}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="px-5 sm:px-6 py-3.5 sm:py-4 text-center text-[#6b6651] text-sm sm:text-base">
                        Geen items beschikbaar
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-[#6b6651] text-base sm:text-lg md:text-xl">
              Geen prijsinformatie beschikbaar
            </div>
          )}

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-12 sm:mt-16 md:mtVERBATIM-20 max-w-3xl mx-auto px-4 sm:px-6 text-center"
          >
            <div className="space-y-3 sm:space-y-4 mb-8">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8b8455] tracking-tight">
                {memoizedData.contact_title}
              </h4>
            </div>
            {/* Animated divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-px bg-gradient-to-r from-transparent via-[#8b8455] to-transparent mx-auto my-12 sm:my-16 md:my-4"
            />
            <p className="text-base sm:text-lg md:text-xl text-[#6b6651] leading-relaxed mb-8">
              {memoizedData.contact_description.split('Laserstudio Marie')[0]}
              <Link
                to={memoizedData.contact_button_url}
                className="text-[#8b8455] hover:text-[#a89e6b] font-semibold underline underline-offset-4 decoration-2 transition-colors duration-200"
                aria-label="Neem contact op met Laserstudio Marie"
              >
                Laserstudio Marie
              </Link>
              {memoizedData.contact_description.split('Laserstudio Marie')[1].split('een afspraak maken')[0]}
              <a
                href={memoizedData.appointment_button_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8b8455] hover:text-[#a89e6b] font-semibold underline underline-offset-4 decoration-2 transition-colors duration-200"
                aria-label="Maak een online afspraak"
              >
                afspraak maken
              </a>
              {memoizedData.contact_description.split('een afspraak maken')[1]}
            </p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8"
            >
              <motion.a
                href={memoizedData.contact_button_url}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#a89e6b',
                  boxShadow: '0 6px 20px rgba(139, 132, 85, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                whileFocus={{ scale: 1.05, boxShadow: '0 0 0 4px rgba(139, 132, 85, 0.2)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="inline-flex items-center justify-center bg-[#8b8455] text-white px-8 py-3.5 rounded-full font-semibold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a89e6b] min-w-[220px]"
                aria-label="Contacteer Laserstudio Marie"
              >
                {memoizedData.contact_button_text}
              </motion.a>
              <motion.a
                href={memoizedData.appointment_button_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#f8f7f2',
                  boxShadow: '0 6px 20px rgba(139, 132, 85, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                whileFocus={{ scale: 1.05, boxShadow: '0 0 0 4px rgba(139, 132, 85, 0.2)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="inline-flex items-center justify-center gap-2 bg-[#fdfdfb] text-[#8b8455] border-2 border-[#8b8455] px-8 py-3.5 rounded-full font-semibold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a89e6b] min-w-[220px]"
                aria-label="Maak een online afspraak"
              >
                <span>{memoizedData.appointment_button_text}</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrijslijstPage;