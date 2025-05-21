import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FirstSection from '../components/FirstSection';
import sliderImage2 from '../assets/cardphotos/21.jpg';

const VindSnelPage: React.FC = () => {
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
          'https://my-strapi-backend.fly.dev/api/vindsnel-pages?populate[mainContent][populate][sections][populate]=*&populate[ContactSection][populate]=links'
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

  const { Title, mainContent, ContactSection } = pageData;

  // Function to render contact content with dynamic links
  const renderContactContent = (content: string, links: any[] = []) => {
    if (!content || !links || links.length === 0) {
      return <span>{content}</span>;
    }

    let renderedContent = content;
    // Replace each linktext with a unique placeholder
    links.forEach((link) => {
      // Escape special characters to avoid regex issues
      const escapedLinkText = link.linktext.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      renderedContent = renderedContent.replace(
        new RegExp(escapedLinkText, 'g'),
        `<LINK_${link.id}>`
      );
    });

    // Split content by placeholders and render
    const parts = renderedContent.split(/(<LINK_\d+>)/);
    return parts.map((part, index) => {
      const match = part.match(/<LINK_(\d+)>/);
      if (match) {
        const linkId = parseInt(match[1]);
        const link = links.find((l) => l.id === linkId);
        if (link) {
          return (
            <Link
              key={index}
              to={link.linkUrl}
              className={
                link.isButton
                  ? 'inline-block px-6 py-2 border border-[#8b8455] text-[#8b8455] rounded-full transition-all hover:bg-[#8b8455] hover:text-white'
                  : 'text-[#8b8455] hover:text-[#a89e6b] font-semibold underline underline-offset-4 decoration-2 transition-colors'
              }
              {...(link.linkUrl.startsWith('http') && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              {link.linktext}
            </Link>
          );
        }
      }
      return <span key={index}>{part}</span>;
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
                src={sliderImage2}
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
                {mainContent?.sections?.map((section: any, index: number) => (
                  <div key={index} className="mb-4">
                    {section.title && (
                      <h3 className="text-xl font-semibold text-[#8b8455] mb-4">
                        {section.title}
                      </h3>
                    )}
                    {section.description && (
                      <div
                        className="text-[#555] mb-4"
                        dangerouslySetInnerHTML={{ __html: section.description }}
                      />
                    )}
                    {section.lists?.length > 0 && (
                      <ul className="list-disc pl-5 text-[#555] mb-4">
                        {section.lists.map((item: any, i: number) => (
                          item.list_Item && <li key={i}>{item.list_Item}</li>
                        ))}
                      </ul>
                    )}
                    {section.links?.length > 0 && (
                      <div className="mb-4">
                        {section.links.map((link: any, i: number) => (
                          <Link
                            key={i}
                            to={link.linkUrl}
                            className={
                              link.isButton
                                ? 'inline-block px-6 py-2 border border-[#8b8455] text-[#8b8455] rounded-full transition-all hover:bg-[#8b8455] hover:text-white'
                                : 'text-[#8b8455] hover:text-[#a89e6b] font-semibold underline underline-offset-4 decoration-2 transition-colors'
                            }
                            {...(link.linkUrl.startsWith('http') && {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                            })}
                          >
                            {link.linktext}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Card */}
          {ContactSection && ContactSection[0] && (
            <div className="bg-[#f8f5ec] p-6 rounded-xl shadow-sm mt-8">
              <h3 className="text-xl font-semibold text-[#8b8455] mb-4">
                {ContactSection[0].heading}
              </h3>
              <p className="text-lg text-[#555]">
                {renderContactContent(ContactSection[0].content, ContactSection[0].links)}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VindSnelPage;