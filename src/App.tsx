import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { useCursorPosition } from './utils/cursorEffects';
import { useScrollHandler } from './utils/ScrollHandler';
import Home from './pages/home';
import OverMij from './pages/OverMijPage';
import Laserontharing from './pages/LaserontharingPage';
import Prijslijst from './pages/PrijslijstPage';
import FAQ from './pages/FAQPage';
import Nieuws from './pages/NiewusPage';
import Galerij from './pages/GalerijPage';
import Contact from './pages/Contact';
import Bliftop from './pages/blijfop';
import VindsnelPage from './pages/vind_snelPage';
import Footer from './components/Footer';

interface FooterData {
  open_hours: Array<{ day: string; hour: string }>;
  address_line_1: string;
  address_line_2: string;
  map_embed_url: string;
  phone: string;
  email: string;
  vat: string;
  SocialLink: Array<{ platform: string; url: string; icon_color: string | null }>;
  location_link: string;
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cursorPosition = useCursorPosition();
  const isScrolled = useScrollHandler();

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('https://my-strapi-backend.fly.dev/api/footers?populate=*');
        const { data } = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.warn('No footer data array found');
          setFooterData({
            open_hours: [],
            address_line_1: data[0]?.attributes?.address_line_1 || 'No address',
            address_line_2: data[0]?.attributes?.address_line_2 || 'No address',
            map_embed_url: data[0]?.attributes?.map_embed_url || 'No map',
            phone: '0492 31 87 40',
            email: '',
            vat: '',
            SocialLink: [],
            location_link: ''
          });
          return;
        }

        const footerItem = data[0] || {};

        const formattedData: FooterData = {
          open_hours: footerItem.open_hours?.map((hour: any) => ({
            day: hour.day || '',
            hour: hour.hour || ''
          })) || [],
          address_line_1: footerItem.address_line_1 || '',
          address_line_2: footerItem.address_line_2 || '',
          map_embed_url: footerItem.map_embed_url || '',
          phone: footerItem.phone || '0492 31 87 40',
          email: footerItem.email || '',
          vat: footerItem.vat || '',
          SocialLink: footerItem.SocialLink?.map((link: any) => ({
            platform: link.platform || '',
            url: link.url || '',
            icon_color: link.icon_color || null
          })) || [],
          location_link: footerItem.attributes?.location_link || '',
        };
        setFooterData(formattedData);
      } catch (error) {
        setError('Failed to load footer data');
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#f9f6ef] font-sans">
        {/* Custom cursor effect */}
        <div
          className={`fixed top-0 left-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300 ${
            isHoveringButton ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-[#8b8455] opacity-10 blur-xl"
            animate={{
              x: cursorPosition.x * 40 + window.innerWidth / 2 - 64,
              y: cursorPosition.y * 40 + window.innerHeight / 2 - 64,
              scale: isHoveringButton ? 1.5 : 1,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          />
        </div>

        {/* Navigation */}
        <Navbar
          isScrolled={isScrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isHoveringButton={isHoveringButton}
          setIsHoveringButton={setIsHoveringButton}
          phone={footerData?.phone || '0492 31 87 40'}
        />
        <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/over-mij" element={<OverMij />} />
          <Route path="/laserontharing" element={<Laserontharing />} />
          <Route path="/prijslijst" element={<Prijslijst />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/nieuws" element={<Nieuws />} />
          <Route path="/galerij" element={<Galerij />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blijfop" element={<Bliftop />} />
          <Route path="/vindsnelPage" element={<VindsnelPage />} />
        </Routes>

        {footerData && <Footer footerData={footerData} />}
      </div>
    </Router>
  );
}

export default App;