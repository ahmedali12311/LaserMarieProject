import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../constants/data';
import maireLogo from '../assets/mainphoto/MaireLogo.webp';

interface NavbarProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isHoveringButton: boolean;
  setIsHoveringButton: (hover: boolean) => void;
  phone: string;
}

const buttonVariants = {
  hoverGlint: {
    backgroundImage: 'linear-gradient(45deg, #8b8455, #a89e6b, #c5ba81)',
    boxShadow: '0 10px 30px rgba(139, 132, 85, 0.4)',
    transform: 'translateY(-3px)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95, boxShadow: '0 5px 15px rgba(139, 132, 85, 0.3)' },
};

const navItemVariants = {
  hover: {
    color: '#a89e6b',
    y: -3,
    transition: { duration: 0.2 },
  },
};

export const Navbar: React.FC<NavbarProps> = ({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  isHoveringButton,
  setIsHoveringButton,
  phone,
}) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${
        isScrolled
          ? 'fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-[#8b8455]/20'
          : 'absolute top-0 left-0 right-0 bg-transparent'
      } z-50 transition-all duration-300 px-8 md:px-16 py-3`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div className="flex items-center shrink-0" whileHover={{ scale: 1.05 }}>
          <NavLink to="/">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={maireLogo}
                alt="Laserstudio Marie"
                className={`h-12 md:h-16 w-auto transition-all duration-300 ${
                  isScrolled ? 'scale-90' : 'scale-100'
                }`}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </NavLink>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-grow justify-end">
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
            {navItems.map((item, index, array) => {
              // Special case for Afspraak (external link)
              if (item === 'Afspraak') {
                return (
                  <React.Fragment key={item}>
                    <motion.a
                      href="https://salonkee.be/salon/laserstudio-marie?lang=nl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative px-2 md:px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm md:text-base lg:text-lg group whitespace-nowrap overflow-hidden ${
                        isScrolled ? 'text-sm font-semibold' : 'text-base font-medium'
                      } ${
                        isScrolled
                          ? 'text-[#555] hover:text-[#a89e6b]'
                          : 'text-[#666] hover:text-[#a89e6b]'
                      }`}
                      variants={navItemVariants}
                      whileHover="hover"
                    >
                      {item}
                    </motion.a>
                    {index < array.length - 1 && (
                      <motion.span
                        className={`${isScrolled ? 'text-[#555]/30' : 'text-[#666]/30'}`}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        |
                      </motion.span>
                    )}
                  </React.Fragment>
                );
              }

              // Regular internal links
              const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
              return (
                <React.Fragment key={item}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `relative px-2 md:px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm md:text-base lg:text-lg group whitespace-nowrap overflow-hidden ${
                        isScrolled ? 'text-sm font-semibold' : 'text-base font-medium'
                      } ${
                        isActive
                          ? 'text-[#8b8455] font-bold'
                          : isScrolled
                          ? 'text-[#555] hover:text-[#a89e6b]'
                          : 'text-[#666] hover:text-[#a89e6b]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <motion.span
                          variants={navItemVariants}
                          whileHover="hover"
                          className="relative z-10"
                        >
                          {item}
                        </motion.span>
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-[#8b8455]"
                          initial={{ width: 0 }}
                          animate={{ width: isActive ? '100%' : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </>
                    )}
                  </NavLink>
                  {index < array.length - 1 && (
                    <motion.span
                      className={`${isScrolled ? 'text-[#555]/30' : 'text-[#666]/30'}`}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      |
                    </motion.span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="ml-8">
            <motion.a
              href={`tel:${phone}`}
              variants={buttonVariants}
              whileHover="hoverGlint"
              whileTap="tap"
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              className={`inline-flex items-center bg-gradient-to-r from-[#8b8455] to-[#a89e6b] text-white px-6 py-2 rounded-full font-medium text-sm md:text-base transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-xl ${
                isScrolled ? 'scale-95' : 'scale-100'
              }`}
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 relative z-10" />
              <span className="whitespace-nowrap relative z-10">{phone}</span>
            </motion.a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? (
            <X size={32} className="text-[#8b8455]" />
          ) : (
            <Menu size={32} className={isScrolled ? 'text-[#555]' : 'text-[#666]'} />
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
};