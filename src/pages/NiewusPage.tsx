import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FirstSection from '../components/FirstSection';

// Placeholder images
import sliderImage2 from '../assets/cardphotos/21.jpg';
import sliderImage3 from '../assets/cardphotos/21.jpg';

// TypeScript interfaces
interface Contact {
  id: number;
  Title: string;
  description: string;
}

interface NewsCardItem {
  id: number;
  Title: string;
  Description: string;
  highlighted_texts_button: string;
  highlighted_texts_button_url: string;
}

interface NewsPage {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  News_title: string;
  contact: Contact[];
  NewsCardItem: NewsCardItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse {
  data: NewsPage[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const Nieuws: React.FC = () => {
  const [newsPage, setNewsPage] = useState<NewsPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<StrapiResponse>(
          'https://my-strapi-backend.fly.dev/api/nieuws-Pages?populate=*'
        );
        const pageData = response.data.data[0];
        setNewsPage(pageData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Strapi data:', err);
        setError('Failed to load news page. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render contact description with embedded links
  const renderContactDescription = (description: string): JSX.Element => {
    const linkStyles =
      'text-[#8b8455] hover:text-[#a89e6b] font-semibold underline underline-offset-4 decoration-2 transition-colors hover:no-underline';

    // Define link mappings based on static content
    const links = [
      {
        text: 'Laserstudio Marie',
        url: '/contact',
        isExternal: false,
      },
      {
        text: 'Een afspraak maken? Dat kan meteen online!',
        url: 'https://salonkee.be/salon/laserstudio-marie?lang=nl',
        isExternal: true,
      },
    ];

    let formattedDescription = description;
    const elements: (string | JSX.Element)[] = [];

    links.forEach((link, index) => {
      const placeholder = `{{LINK_${index}}}`;
      formattedDescription = formattedDescription.replace(link.text, placeholder);
    });

    const parts = formattedDescription.split(/{{LINK_\d+}}/);
    parts.forEach((part, index) => {
      elements.push(part);
      if (index < links.length) {
        const link = links[index];
        elements.push(
          link.isExternal ? (
            <a
              key={`link-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {link.text}
            </a>
          ) : (
            <Link key={`link-${index}`} to={link.url} className={linkStyles}>
              {link.text}
            </Link>
          )
        );
      }
    });

    return <>{elements}</>;
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Assign placeholder images to NewsCardItems
  const newsItemsWithImages = newsPage?.NewsCardItem.map((item: NewsCardItem, index: number) => ({
    ...item,
    image: index === 0 ? sliderImage2 : sliderImage3, // Match static image assignments
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#ede8d9] font-sans text-[#333] overflow-hidden relative">
      {/* Subtle Wave Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
          <path
            fill="#8b8455"
            d="M0,0 C480,200 960,100 1440,300 V600 H0 Z"
            opacity="0.1"
          />
          <path
            fill="#a89e6b"
            d="M0,100 C480,300 960,200 1440,400 V600 H0 Z"
            opacity="0.2"
          />
        </svg>
      </div>

      <FirstSection />

      {/* News Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="py-24 md:py-32 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Title */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-left max-w-3xl mb-20"
          >
            <motion.h2
              variants={childFadeIn}
              className="text-4xl md:text-5xl font-bold mb-6 text-[#8b8455] tracking-wide font-serif shadow-sm"
            >
              {newsPage?.Title || 'Het laatste nieuws over permanente ontharing'}
            </motion.h2>
            <motion.div
              variants={childFadeIn}
              className="w-24 h-1 bg-gradient-to-r from-[#8b8455]/20 to-[#a89e6b]/40 rounded-full"
            />
          </motion.div>

          {/* First Card */}
          <motion.div
            variants={childFadeIn}
            className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10 hover:border-[#a89e6b]/30 mb-12"
          >
            <p className="text-lg md:text-xl text-[#444] leading-relaxed font-light">
              {newsPage?.Description || ''}
            </p>
          </motion.div>

          {/* Contact Card */}
          {newsPage?.contact?.[0] && (
            <motion.div
              variants={childFadeIn}
              className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10 hover:border-[#a89e6b]/30 mb-12"
            >
              <h3 className="text-2xl font-semibold text-[#8b8455] mb-4 font-serif tracking-wide">
                {newsPage.contact[0].Title || 'Neem contact op'}
              </h3>
              <p className="text-lg md:text-xl text-[#444] leading-relaxed font-light">
                {renderContactDescription(newsPage.contact[0].description)}
              </p>
            </motion.div>
          )}

          {/* News Items Section */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h2
              variants={childFadeIn}
              className="text-4xl md:text-5xl font-bold mb-12 text-[#8b8455] font-serif tracking-wide shadow-sm"
            >
              {newsPage?.News_title || 'Ons laatste nieuws'}
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {newsItemsWithImages.map((item: NewsCardItem & { image: string }) => (
                <motion.div
                  key={item.id}
                  variants={childFadeIn}
                  whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(139, 132, 85, 0.2)' }}
                  className="relative bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8b8455]/10 hover:border-[#a89e6b]/30 flex flex-col"
                >
                  <div className="relative w-full h-64">
                    <motion.img
                      src={item.image}
                      alt={item.Title}
                      className="w-full h-full object-cover"
                      variants={imageFadeIn}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8b8455]/10 to-transparent" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <motion.h3
                        className="text-2xl font-semibold text-[#8b8455] mb-4 font-serif tracking-wide"
                        variants={childFadeIn}
                      >
                        {item.Title}
                      </motion.h3>
                      <motion.p
                        className="text-[#444] mb-6 font-light leading-relaxed"
                        variants={childFadeIn}
                      >
                        {item.Description}
                      </motion.p>
                    </div>
                    <motion.div variants={childFadeIn}>
                      <Link
                        to={item.highlighted_texts_button_url}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        {item.highlighted_texts_button}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Nieuws;