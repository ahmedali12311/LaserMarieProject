import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FirstSection from '../components/FirstSection';
import sliderImage3 from '../assets/cardphotos/21.jpg';

const Bliftop: React.FC = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://my-strapi-backend.fly.dev/api/bliftops?populate[bliftop_main_content][populate]=*&populate[bliftop_main_content][populate][sectionss][populate][lists]=*&populate[bliftop_main_content][populate][sectionss][populate][list][populate]=*&populate[ContactSection][populate][highlighted_texts]=*'
        );
        setPageData(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pageData) {
    return <div>Error loading page data</div>;
  }

  const { Title, bliftop_main_content, ContactSection } = pageData;

  // Function to render highlighted texts in ContactSection.description
  const renderHighlightedContent = (content: string, highlightedTexts: any[] = []) => {
    if (!content || !highlightedTexts || highlightedTexts.length === 0) {
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }

    let renderedContent = content;
    highlightedTexts.forEach((highlight) => {
      const escapedText = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      renderedContent = renderedContent.replace(
        new RegExp(escapedText, 'g'),
        `<HIGHLIGHT_${highlight.id}>`
      );
    });

    const parts = renderedContent.split(/(<HIGHLIGHT_\d+>)/);
    return parts.map((part, index) => {
      const match = part.match(/<HIGHLIGHT_(\d+)>/);
      if (match) {
        const highlightId = parseInt(match[1]);
        const highlight = highlightedTexts.find((h) => h.id === highlightId);
        if (highlight) {
          return (
            <Link
              key={index}
              to={highlight.url}
              style={{ color: highlight.color || '#8b8455' }}
              className={
                highlight.is_highlighted
                  ? 'hover:text-[#a89e6b] font-semibold underline underline-offset-4 decoration-2 transition-colors'
                  : 'hover:text-[#a89e6b] font-semibold'
              }
              {...(highlight.url.startsWith('http') && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              {highlight.text}
            </Link>
          );
        }
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f6ef] font-sans">
      {/* First Section */}
      <FirstSection />

      {/* Main Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-white py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Title */}
          <div className="text-left max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#a89e6b] font-serif">
              {Title}
            </h2>
            <div className="w-16 h-1 bg-[#8b8455]/30 rounded-full"></div>
          </div>

          {/* Content Section */}
          <motion.div
            whileHover={{ y: -5 }}
            className="border border-[#eee] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row"
          >
            <div className="w-full md:w-1/3 flex-shrink-0">
              <motion.img
                src={sliderImage3}
                alt={Title}
                className="w-full h-48 md:h-full object-cover"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
            </div>
            <div className="p-6 flex-1">
              <motion.div
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {bliftop_main_content?.sectionss?.map((section: any, index: number) => (
                  <div key={index} className="mb-4">
                    {section.Title && (
                      <h3 className="text-xl font-semibold text-[#8b8455] mb-4">
                        {section.Title}
                      </h3>
                    )}
                    {section.description && (
                      <div
                        className="text-[#555] mb-4"
                        dangerouslySetInnerHTML={{ __html: section.description }}
                      />
                    )}
                    {section.list?.listsitem?.length > 0 && (
                      <ul className="list-disc pl-5 text-[#555] mb-4">
                        {section.list.listsitem.map((item: any, i: number) => (
                          <li key={i} className="mb-2">
                            {item.Title && (
                              <span
                                className={item.isBald ? 'font-bold' : ''}
                                dangerouslySetInnerHTML={{ __html: item.Title }}
                              />
                            )}
                            {item.description && (
                              <div
                                className="mt-1"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {/* Social Media Links */}
                <div className="flex space-x-4 mt-4">
                  <a
                    href="https://www.facebook.com/laserstudiomarie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 border border-[#8b8455] text-[#8b8455] rounded-full transition-all hover:bg-[#8b8455] hover:text-white"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/laserstudiomarie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 border border-[#8b8455] text-[#8b8455] rounded-full transition-all hover:bg-[#8b8455] hover:text-white"
                  >
                    Instagram
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Section */}
          {ContactSection && (
            <div className="bg-[#f8f5ec] p-6 rounded-xl shadow-sm mt-8">
              <h3 className="text-xl font-semibold text-[#8b8455] mb-4">
                {ContactSection.Title}
              </h3>
              <p className="text-lg text-[#555]">
                {renderHighlightedContent(ContactSection.description, ContactSection.highlighted_texts)}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Bliftop;