import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import FirstSection from '../components/FirstSection';

// Fallback image
import fallbackImage from '../assets/cardphotos/21.jpg';

interface SocialLink {
  platform: string;
  url: string;
  icon_color: string;
}

interface LaserontharingData {
  header_title: string;
  first_section_description: string;
  first_section_image: {
    url: string;
    alternativeText: string;
  };
  first_section_image_alt: string;
  benefits_title: string;
  benefits_description: string;
  when_title: string;
  when_description: string;
  limitation_title: string;
  limitations_description: string;
  contact_title: string;
  contact_description: string;
  contact_button_url: string;
  contact_button_text: string;
  appointment_button_url: string;
  appointment_button_text: string;
  social_links: SocialLink[];
}

interface StrapiResponse {
  data: LaserontharingData[];
}

const Laserontharing: React.FC = () => {
  const [data, setData] = useState<LaserontharingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://my-strapi-backend.fly.dev/api/laserontharing-pages?populate=*', {
        
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const responseData: StrapiResponse = await response.json();

        const attributes = responseData.data[0] || {};
        const formattedData: LaserontharingData = {
          header_title: attributes.header_title || 'Laserontharing voor een stralende en gladde huid',
          first_section_description:
            attributes.first_section_description ||
            'Laserontharing is de toekomst van haarverwijdering. Bij Laserstudio Marie werk ik hiervoor uitsluitend met DIODE LAS ICE 4-WAVE MASTER (QUATTRO-PRO)...',
          first_section_image: {
            url: attributes.first_section_image?.url
              ? `https://my-strapi-backend.fly.dev${attributes.first_section_image.url}`
              : fallbackImage,
            alternativeText: attributes.first_section_image_alt || 'Laserontharing',
          },
          first_section_image_alt: attributes.first_section_image_alt || 'Laserontharing',
          benefits_title: attributes.benefits_title || 'Voordelen van mijn laserontharingstechniek',
          benefits_description:
            attributes.benefits_description ||
            'Mijn behandelingen zijn vrijwel pijnloos dankzij een uniek koelsysteem...',
          when_title: attributes.when_title || 'Wanneer is laserontharing mogelijk?',
          when_description:
            attributes.when_description ||
            'Laserontharing werkt alleen op haren die zich in de groeifase bevinden...',
          limitation_title: attributes.limitation_title || 'Beperkingen en contra-indicaties',
          limitations_description:
            attributes.limitations_description ||
            'Helaas kan ik geen resultaten garanderen voor grijs of rood haar...',
          contact_title: attributes.contact_title || 'Contacteer mij',
          contact_description:
            attributes.contact_description ||
            'Aarzel niet om contact op te nemen met Laserstudio Marie mocht je nog vragen hebben...',
          contact_button_url: attributes.contact_button_url || '/contact',
          contact_button_text: attributes.contact_button_text || 'Contacteer mij',
          appointment_button_url:
            attributes.appointment_button_url || 'https://salonkee.be/salon/laserstudio-marie?lang=nl',
          appointment_button_text: attributes.appointment_button_text || 'Online afspraak',
          social_links: Array.isArray(attributes.social_links)
            ? attributes.social_links.map((link: any) => ({
                platform: link.platform || '',
                url: link.url || '',
                icon_color: link.icon_color || '#8b8455',
              }))
            : [],
        };

        setData(formattedData);
      } catch (err: any) {
        console.error('Error fetching Laserontharing data:', err.message);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const childFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const imageFadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
  };

  // Memoized data to prevent re-renders
  const memoizedData = useMemo(() => data, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#ede8d9] font-sans text-[#333] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4 mx-auto" />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !memoizedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#ede8d9] font-sans text-[#333] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'No content available'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#8b8455] text-white px-6 py-2 rounded-full hover:bg-[#a89e6b]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#ede8d9] font-sans text-[#333] overflow-hidden">
      <FirstSection />

      {/* Main Content Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Header */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
          >
            <motion.h2
              variants={childFadeIn}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#8b8455] tracking-wide font-serif"
            >
              {memoizedData.header_title}
            </motion.h2>
      
          </motion.div>
   {/* Animated divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-px bg-gradient-to-r from-transparent via-[#8b8455] to-transparent mx-auto my-12 sm:my-16 md:my-24"
      />
          {/* First Section with Image */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-20 md:mb-24"
          >
            <motion.div variants={childFadeIn}>
              <div className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10">
                <p className="text-base sm:text-lg md:text-xl text-[#444] leading-relaxed font-light">
                  {memoizedData.first_section_description}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={imageFadeIn}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b8455]/20 to-[#a89e6b]/30 rounded-3xl transform translate-x-4 sm:translate-x-6 translate-y-4 sm:translate-y-6 z-0 transition-all duration-500 group-hover:translate-x-3 sm:group-hover:translate-x-4 group-hover:translate-y-3 sm:group-hover:translate-y-4 group-hover:rotate-2" />
              <img
                src={memoizedData.first_section_image.url}
                alt={memoizedData.first_section_image_alt}
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-3xl shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="mt-16 sm:mt-20 md:mt-24"
          >
            <motion.h3
              variants={childFadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8b8455] mb-6 sm:mb-8 text-center font-serif tracking-wide shadow-sm"
            >
              {memoizedData.benefits_title}
            </motion.h3>
            <motion.div
              variants={childFadeIn}
              className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10 max-w-3xl sm:max-w-4xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl text-[#444] leading-relaxed font-light text-center">
                {memoizedData.benefits_description}
              </p>
            </motion.div>
          </motion.div>

          {/* When Section */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="mt-16 sm:mt-20 md:mt-24"
          >
            <motion.h3
              variants={childFadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8b8455] mb-6 sm:mb-8 text-center font-serif tracking-wide shadow-sm"
            >
              {memoizedData.when_title}
            </motion.h3>
            <motion.div
              variants={childFadeIn}
              className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10 max-w-3xl sm:max-w-4xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl text-[#444] leading-relaxed font-light text-center">
                {memoizedData.when_description}
              </p>
            </motion.div>
          </motion.div>

          {/* Limitations Section */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="mt-16 sm:mt-20 md:mt-24"
          >
            <motion.h3
              variants={childFadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8b8455] mb-6 sm:mb-8 text-center font-serif tracking-wide shadow-sm"
            >
              {memoizedData.limitation_title}
            </motion.h3>
            <motion.div
              variants={childFadeIn}
              className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10 max-w-3xl sm:max-w-4xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl text-[#444] leading-relaxed font-light text-center">
                {memoizedData.limitations_description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Section (Footer) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-b from-[#ede8d9] to-[#e5e0d1] py-16 sm:py-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6 sm:space-y-8"
          >
            <motion.h4
              variants={childFadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8b8455] font-serif tracking-wide shadow-sm"
            >
              {memoizedData.contact_title}
            </motion.h4>
            <motion.p
              variants={childFadeIn}
              className="text-base sm:text-lg md:text-xl text-[#444] leading-relaxed font-light"
            >
              {memoizedData.contact_description.split('Laserstudio Marie')[0]}
              <Link
                to={memoizedData.contact_button_url}
                className="text-[#8b8455] hover:text-[#a89e6b] font-semibold underline transition-colors hover:no-underline"
              >
                Laserstudio Marie
              </Link>
              {memoizedData.contact_description.split('Laserstudio Marie')[1].split('een afspraak maken')[0]}
              <a
                href={memoizedData.appointment_button_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8b8455] hover:text-[#a89e6b] font-semibold underline transition-colors hover:no-underline"
              >
                een afspraak maken
              </a>
              {memoizedData.contact_description.split('een afspraak maken')[1]}
            </motion.p>
            <motion.div
              variants={childFadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-4 sm:pt-6"
            >
              <motion.a
                href={memoizedData.contact_button_url}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#a89e6b',
                  boxShadow: '0 15px 30px rgba(139, 132, 85, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {memoizedData.contact_button_text}
              </motion.a>
              <motion.a
                href={memoizedData.appointment_button_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#f5f2e8',
                  boxShadow: '0 15px 30px rgba(139, 132, 85, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#8b8455] border-2 border-[#8b8455] px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span>{memoizedData.appointment_button_text}</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.a>
            </motion.div>
            {/* Social Media Icons */}
            <motion.div
              variants={childFadeIn}
              className="flex justify-center gap-4 sm:gap-6 pt-6 sm:pt-8"
            >
              {memoizedData.social_links.length > 0 ? (
                memoizedData.social_links.map((link, index) => {
                  const iconProps = { style: { color: link.icon_color, width: '1.5rem', height: '1.5rem' } };
                  if (link.platform === 'Facebook') {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8b8455] hover:text-[#a89e6b] transition-colors"
                      >
                        <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    );
                  }
                  if (link.platform === 'Instagram') {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8b8455] hover:text-[#a89e6b] transition-colors"
                      >
                        <FontAwesomeIcon icon={faInstagram} {...iconProps} />
                      </a>
                    );
                  }
                  if (link.platform === 'WhatsApp') {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8b8455] hover:text-[#a89e6b] transition-colors"
                      >
                        <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.548 4.138 1.504 5.873L0 24l6.335-1.668A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.001a9.974 9.974 0 01-5.093-1.392l-.365-.217-3.762.99 1.008-3.682-.24-.382A9.974 9.974 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.94-6.688c-.326-.163-1.938-.955-2.238-1.064-.3-.109-.518-.163-.736.163-.218.326-.846 1.064-.982 1.282-.136.218-.272.245-.598.082-.326-.163-1.382-.508-2.63-1.622-.97-.868-1.628-1.938-1.81-2.264-.182-.326-.018-.502.13-.665.136-.146.326-.382.49-.572.163-.19.218-.326.326-.544.109-.218.054-.409-.027-.572-.082-.163-.736-1.774-.982-2.428-.245-.627-.49-.545-.736-.545-.218 0-.463 0-.681.027-.218.027-.572.082-.872.409-.3.326-1.146 1.119-1.146 2.729s1.173 3.166 1.336 3.384c.163.218 2.346 3.575 5.685 5.012.806.346 1.438.554 1.93.71.813.254 1.55.218 2.129.136.652-.091 1.938-.791 2.21-1.555.272-.764.272-1.419.19-1.555-.082-.136-.3-.218-.626-.381z" />
                        </svg>
                      </a>
                    );
                  }
                  return null;
                })
              ) : (
                <span className="text-[#444] text-sm sm:text-base">No social links available</span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Laserontharing;