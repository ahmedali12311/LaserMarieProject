import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Facebook, Instagram, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import FirstSection from '../components/FirstSection';

// Define interfaces for the API response
interface Button {
  id: number;
  text: string;
  url: string;
}

interface DescriptionChild {
  type: string;
  text: string;
}

interface DescriptionParagraph {
  type: string;
  children: DescriptionChild[];
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon_color: string | null;
}

interface OpenHour {
  id: number;
  day: string;
  hour: string;
}

interface FooterData {
  id: number;
  address_line_1: string;
  address_line_2: string;
  map_embed_url: string;
  phone: string;
  email: string;
  vat: string;
  location_link: string;
  SocialLink?: SocialLink[]; // Optional to handle missing data
  open_hours?: OpenHour[]; // Optional to handle missing data
}

interface ContactPageData {
  id: number;
  Title: string;
  Description: DescriptionParagraph[];
  buttons: Button[];
  footer: FooterData;
}

interface ApiResponse {
  data: ContactPageData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ContactPage: React.FC = () => {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('https://my-strapi-backend.fly.dev/api/contact-us-pages?populate=*', {
          cache: 'force-cache', // Cache API response
        });
        if (!response.ok) {
          throw new Error('Failed to fetch contact page data');
        }
        const responseData: ApiResponse = await response.json();

        if (!responseData.data || responseData.data.length === 0) {
          throw new Error('No contact page data found');
        }

        setContactData(responseData.data[0]); // Use the first contact page entry
      } catch (err: unknown) {
        console.error('Error fetching contact page data:', err);
        setError('Failed to load contact page');
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  // Map platform to icon
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-6 w-6 text-[#8b8455] group-hover:text-white" />;
      case 'instagram':
        return <Instagram className="h-6 w-6 text-[#8b8455] group-hover:text-white" />;
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-[#8b8455] group-hover:text-white" />;
      default:
        return null;
    }
  };

  // Render description paragraphs with inline links
  const renderDescription = (description: DescriptionParagraph[]) => {
    return description
      .filter((paragraph) => paragraph.children.some((child) => child.text.trim() !== '')) // Skip empty paragraphs
      .map((paragraph, index) => {
        // Convert markdown links [text](url) to HTML
        const formattedText = paragraph.children
          .map((child) => {
            if (child.type === 'text') {
              return child.text.replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#8b8455] hover:text-[#a89e6b] font-medium underline transition-colors hover:no-underline">$1</a>'
              );
            }
            return child.text;
          })
          .join('');
        return (
          <p
            key={index}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f6ef] flex items-center justify-center">
        <p className="text-[#8b8455] text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="min-h-screen bg-[#f9f6ef] flex items-center justify-center">
        <p className="text-[#8b8455] text-lg">{error || 'No contact page data available'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6ef] font-sans">
      <FirstSection />

      {/* Decorative Divider */}
      <div className="w-full flex justify-center py-8">
        <div className="w-24 h-1 bg-[#8b8455]/30 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-16 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#8b8455] mb-8">{contactData.Title}</h1>
          <div className="text-lg text-[#555] max-w-3xl mx-auto space-y-6">
            {renderDescription(contactData.Description)}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info, Social Media, and Open Hours Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-8"
          >
            {/* Contact Info Card */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-[#eee] hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl font-semibold text-[#8b8455] mb-8 pb-4 border-b border-[#eee]">
                Contactgegevens
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-[#8b8455] bg-[#f9f6ef] p-3 rounded-full">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-[#444] mb-2">Adres</h3>
                    <p className="text-[#555]">{contactData.footer.address_line_1}</p>
                    <p className="text-[#555]">{contactData.footer.address_line_2}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="mt-1 text-[#8b8455] bg-[#f9f6ef] p-3 rounded-full">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-[#444] mb-2">Telefoon</h3>
                    <a
                      href={`tel:${contactData.footer.phone.replace(/\s/g, '')}`}
                      className="text-[#555] hover:text-[#8b8455] transition-colors text-lg"
                    >
                      {contactData.footer.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="mt-1 text-[#8b8455] bg-[#f9f6ef] p-3 rounded-full">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-[#444] mb-2">E-mail</h3>
                    <a
                      href={`mailto:${contactData.footer.email}`}
                      className="text-[#555] hover:text-[#8b8455] transition-colors text-lg"
                    >
                      {contactData.footer.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            {contactData.footer.SocialLink && contactData.footer.SocialLink.length > 0 && (
              <div className="bg-white p-8 rounded-xl shadow-md border border-[#eee] hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-semibold text-[#8b8455] mb-8 pb-4 border-b border-[#eee]">
                  Volg ons op
                </h2>
                <div className="flex gap-8 justify-center">
                  {contactData.footer.SocialLink.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center group"
                    >
                      <div className="bg-[#f9f6ef] p-4 rounded-full group-hover:bg-[#8b8455] group-hover:text-white transition-all">
                        {getSocialIcon(link.platform)}
                      </div>
                      <span className="mt-2 text-[#555] group-hover:text-[#8b8455] transition-colors">
                        {link.platform}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Open Hours Card */}
            {contactData.footer.open_hours && contactData.footer.open_hours.length > 0 && (
              <div className="bg-white p-8 rounded-xl shadow-md border border-[#eee] hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-semibold text-[#8b8455] mb-8 pb-4 border-b border-[#eee]">
                  Openingsuren
                </h2>
                <div className="space-y-4">
                  {contactData.footer.open_hours.map((hour) => (
                    <div key={hour.id} className="flex justify-between text-[#555]">
                      <span className="font-medium">{hour.day}</span>
                      <span>{hour.hour}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="h-full"
          >
            <div className="bg-white p-4 rounded-xl shadow-md border border-[#eee] h-full">
              <div className="aspect-w-16 aspect-h-9 w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={contactData.footer.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="min-h-[400px]"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        {contactData.buttons.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-16 text-center"
          >
            {contactData.buttons.map((button) => (
              <motion.a
                key={button.id}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, backgroundColor: '#a89e6b' }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-[#8b8455] text-white py-4 px-8 rounded-lg font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg mx-2"
              >
                {button.text}
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer Divider */}
      <div className="w-full flex justify-center py-12">
        <div className="w-24 h-1 bg-[#8b8455]/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default ContactPage;