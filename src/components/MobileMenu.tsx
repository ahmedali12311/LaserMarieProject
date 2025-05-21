import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../constants/data';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const buttonVariants = {
  hoverGlint: {
    backgroundImage: 'linear-gradient(45deg, #8b8455, #a89e6b, #c5ba81)',
    boxShadow: '0 10px 30px rgba(139, 132, 85, 0.4)',
    transform: 'translateY(-3px)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  // Function to generate proper paths
  const getPath = (item: string) => {
    if (item === 'Home') return '/';
    if (item === 'Afspraak') return 'https://salonkee.be/salon/laserstudio-marie?lang=nl';
    return `/${item.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="md:hidden fixed inset-0 bg-white/95 z-40 pt-28 px-10 pb-12 flex flex-col backdrop-blur-lg"
        >
          <div className="space-y-6">
            {navItems.map((item) => {
              // Special case for Afspraak (external link)
              if (item === 'Afspraak') {
                return (
                  <motion.a
                    key={item}
                    href={getPath(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-5 text-[#444] border-b border-[#f5f0e9] hover:text-[#8b8455] text-2xl relative overflow-hidden group"
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ x: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="relative z-10">{item}</span>
                    <motion.div
                      className="absolute inset-0 bg-[#8b8455]/5 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                  </motion.a>
                );
              }

              // Regular internal links
              return (
                <NavLink
                  key={item}
                  to={getPath(item)}
                  className={({ isActive }) =>
                    `block py-5 text-[#444] border-b border-[#f5f0e9] hover:text-[#8b8455] text-2xl relative overflow-hidden group ${
                      isActive ? 'text-[#8b8455] font-bold' : ''
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ x: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className="relative z-10">{item}</span>
                      <motion.div
                        className="absolute inset-0 bg-[#8b8455]/5 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-[#8b8455]"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  )}
                </NavLink>
              );
            })}
          </div>

          <motion.a
            href="tel:0492318740"
            variants={buttonVariants}
            whileHover="hoverGlint"
            whileTap="tap"
            className="mt-12 inline-flex items-center bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-10 py-5 rounded-2xl font-medium text-xl transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-xl"
          >
            <Phone className="w-7 h-7 mr-4" />
            <span className="whitespace-nowrap">0492 31 87 40</span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};