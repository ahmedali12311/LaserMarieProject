import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FirstSection from '../components/FirstSection';

const Galerij: React.FC = () => {
  // State for gallery data, loading, and error
  const [galleryData, setGalleryData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const imagesPerPage = 4; // Set to 4 images per page
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from Strapi API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch(
          'https://my-strapi-backend.fly.dev/api/gallery-items?populate[GalleryItem][populate][GalleryImages][populate]=*&populate[ContactSection][populate]=*'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        setGalleryData(data.data[0]); // Assuming single gallery item
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Extract images from gallery data
  const images = galleryData?.GalleryItem?.GalleryImages?.map((item: any) => ({
    src: `https://my-strapi-backend.fly.dev${item.GalleryImage.url}`,
    alt: item.GalleryImage.alternativeText || `Gallery Photo ${item.id}`,
  })) || [];

  // Pagination logic
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  // Handle pagination navigation
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    hover: { scale: 1.03, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <p className="text-[#7a6f48] text-lg">Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <p className="text-[#7a6f48] text-lg">Fout: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans">
      {/* First Section */}
      <FirstSection />

      {/* Main Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Title */}
          <div className="text-left max-w-4xl mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#7a6f48] font-serif tracking-tight leading-tight">
              {galleryData?.GalleryItem?.Title || 'Onze Studio in Beeld'}
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#c5b685] via-[#d4c9a1] to-[#e8e1c0] rounded-full"></div>
          </div>

          {/* Description */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 max-w-4xl"
          >
            <p className="text-[#555] mb-6 text-lg md:text-xl leading-relaxed md:leading-relaxed">
              {galleryData?.GalleryItem?.description.split('\n')[0] ||
                'Ontdek via deze fotogalerij de rustgevende sfeer en professionele omgeving van Laserstudio Marie.'}
            </p>
            <p className="text-[#555] text-lg md:text-xl leading-relaxed md:leading-relaxed">
              {galleryData?.GalleryItem?.description.split('\n')[1] ||
                'Van de behandelruimte tot onze hoogwaardige apparatuur - alles is ingericht voor uw comfort en het beste resultaat.'}
            </p>
          </motion.div>

          {/* Gallery Images */}
          {images.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {currentImages.map((image: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true, margin: "-50px" }}
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12">
                  <div className="text-sm text-[#7a6f48]">
                    Afbeelding {startIndex + 1}-{Math.min(startIndex + imagesPerPage, images.length)} van {images.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      className="p-3 rounded-full bg-white border border-[#e0d9bb] hover:bg-[#f5f2e8] transition-colors duration-200 shadow-sm"
                      aria-label="Vorige pagina"
                    >
                      <svg className="w-5 h-5 text-[#7a6f48]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ${
                            currentPage === page
                              ? 'bg-[#7a6f48] text-white shadow-inner'
                              : 'bg-white text-[#7a6f48] border border-[#e0d9bb] hover:bg-[#f5f2e8]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                   <button
                      onClick={handleNextPage}
                      className="p-3 rounded-full bg-white border border-[#e0d9bb] hover:bg-[#f5f2e8] transition-colors duration-200 shadow-sm"
                      aria-label="Volgende pagina"
                    >
                      <svg className="w-5 h-5 text-[#7a6f48]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-[#555] text-lg">Momenteel geen afbeeldingen beschikbaar.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact Card */}
      {galleryData?.ContactSection?.[0] && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-[#e8e1c0] overflow-hidden relative"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#f5f2e8] z-0"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#7a6f48] mb-6 font-serif">
                {galleryData.ContactSection[0].heading}
              </h3>
              <p className="text-lg text-[#555] leading-relaxed mb-8 max-w-3xl">
                {galleryData.ContactSection[0].content}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {galleryData.ContactSection[0].links.map((link: any) => (
                  <React.Fragment key={link.id}>
                    {link.isButton ? (
                      <Link
                        to={link.linkUrl}
                        className="px-8 py-4 bg-[#7a6f48] hover:bg-[#6b6138] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                      >
                        {link.linktext}
                      </Link>
                    ) : (
                      <a
                        href={link.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-white border border-[#7a6f48] text-[#7a6f48] hover:bg-[#f5f2e8] font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center"
                      >
                        {link.linktext}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Galerij;