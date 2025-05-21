import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import maireLogo from '../assets/mainphoto/MaireLogo.webp';

interface OpeningHour {
  day: string;
  hour: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon_color?: string | null;
}

interface FooterData {
  open_hours: OpeningHour[];
  address_line_1: string;
  address_line_2: string;
  map_embed_url: string;
  phone: string;
  email: string;
  vat: string;
  SocialLink: SocialLink[];
  location_link: string;
}

interface FooterProps {
  footerData: FooterData;
}

const socialIcons: { [key: string]: React.ComponentType<{ size: number }> } = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
};

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  return (
    <motion.footer
      role="contentinfo"
      aria-label="Laserstudio Marie footer"
      className="bg-[#f9f6ef] text-[#333] pt-16 pb-8 font-sans"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row gap-12">
        {/* Left column */}
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <div className="text-center lg:text-left mb-8">
            <img
              src={maireLogo}
              alt="Laserstudio Marie logo"
              className="h-16 sm:h-20 w-auto mx-auto lg:mx-0 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-xl font-bold text-[#8b8455] mb-6 font-serif">Openingsuren</h3>
          <ul className="space-y-3 text-sm sm:text-base">
            {footerData.open_hours.length > 0 ? (
              footerData.open_hours.map((hour, index) => (
                <li key={`hour-${index}`} className="flex justify-between">
                  <span className="font-medium">{hour.day}</span>
                  <span className={hour.hour === 'Gesloten' ? 'text-gray-400' : ''}>{hour.hour}</span>
                </li>
              ))
            ) : (
              <li>No opening hours available</li>
            )}
          </ul>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-2/3">
          <div className="relative">
            {/* Map */}
            <div className="h-[250px] sm:h-[400px] w-full rounded-xl overflow-hidden shadow-lg transform hover:shadow-xl transition-shadow duration-300">
              <iframe
                src={footerData.map_embed_url}
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                aria-label="Google Maps location"
              />
            </div>

            {/* Contact card */}
            <div
              className="
                w-full 
                sm:w-80 
                rounded-xl 
                shadow-2xl 
                p-6 
                z-10
                mt-8 
                sm:absolute 
                sm:right-[-50%] 
                sm:top-8 
                sm:transform sm:translate-x-[-50%]
                hover:shadow-3xl
                transition-shadow duration-300
              "
              style={{
                backgroundImage: 'linear-gradient(45deg, #8b8455, #a89e6b, #c5ba81)',
              }}
            >
              <div className="space-y-4">
                <div className="text-sm md:text-base">
                  <p className="font-medium text-white">{footerData.address_line_1}</p>
                  <p className="text-white opacity-90">{footerData.address_line_2}</p>
                </div>

                <a
                  href={footerData.location_link}
                  className="block text-white font-semibold uppercase text-sm hover:underline hover:opacity-80 transition-opacity duration-300"
                >
                  Ligging
                </a>

                <div className="space-y-2 text-sm md:text-base">
                  <p className="text-white opacity-90">Gsm: {footerData.phone}</p>
                  <p className="text-white opacity-90">{footerData.email}</p>
                  <p className="text-white opacity-90">BTW: {footerData.vat}</p>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  {footerData.SocialLink.length > 0 ? (
                    footerData.SocialLink.map((link, index) => {
                      const IconComponent = socialIcons[link.platform];
                      return (
                        <a
                          key={`social-${index}`}
                          href={link.url}
                          className="text-white hover:text-[#f9f6ef] transition-colors duration-300 inline-block p-2 rounded-full bg-white/10 hover:bg-white/20 shadow-sm hover:shadow-md"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={link.icon_color ? { color: link.icon_color } : {}}
                        >
                          {IconComponent ? <IconComponent size={20} /> : <span>{link.platform}</span>}
                        </a>
                      );
                    })
                  ) : (
                    <span>No social links available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 mt-12 pt-8 border-t border-[#e0d9c3] text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Laserstudio Marie. Alle rechten voorbehouden.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;