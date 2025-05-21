import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { lazy, Suspense } from 'react';

// Lazy load FirstSection
const FirstSection = lazy(() => import('../components/FirstSection'));

// Define TypeScript interfaces
interface FAQItem {
  Order: number;
  id: number;
  Question: string;
  Anwer: string; // Typo in API response
}

interface CTA {
  id: number;
  Text: string;
  URL: string;
}

interface FAQData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  FAQ: FAQItem[];
  PrimaryCTA: CTA;
  SecondaryCTA: CTA;
}

interface ApiResponse {
  data: FAQData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface FAQ {
  question: string;
  answer: string;
}

interface ContactData {
  title: string;
  description: string;
  primaryCTA: { text: string; url: string };
  secondaryCTA: { text: string; url: string };
}

// Memoized FAQ Item component
const FAQItem = React.memo(
  ({
    faq,
    index,
    isOpen,
    toggleFAQ,
    isLast,
  }: {
    faq: FAQ;
    index: number;
    isOpen: boolean;
    toggleFAQ: (index: number) => void;
    isLast: boolean;
  }) => {
    const shouldReduceMotion = useReducedMotion();

    // Restored smooth height animation with layout prop
    const faqAnimation = shouldReduceMotion
      ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
      : {
          hidden: { opacity: 0, height: 0, marginTop: 0 },
          visible: {
            opacity: 1,
            height: 'auto',
            marginTop: 16,
            transition: {
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            },
          },
          exit: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            },
          },
        };

    return (
      <div
        className={`border-b ${isLast ? 'border-b-0' : 'border-[#8b8455]/20'} transition-all duration-300`}
      >
        <button
          onClick={() => toggleFAQ(index)}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="w-full flex justify-between items-center py-5 text-left text-base sm:text-lg md:text-xl font-semibold text-[#333] hover:text-[#8b8455] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#8b8455] focus:ring-offset-2 rounded-lg group"
        >
          <span className="pr-4">{faq.question}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0"
          >
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-[#8b8455] group-hover:text-[#a89e6b] transition-colors duration-300" />
            ) : (
              <ChevronDown className="w-6 h-6 text-[#8b8455] group-hover:text-[#a89e6b] transition-colors duration-300" />
            )}
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={`faq-answer-${index}`}
              variants={faqAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-[#555] text-sm sm:text-base md:text-lg leading-relaxed overflow-hidden"
              layout // Smooth layout transitions
            >
              <div className="pb-5 pt-2">{faq.answer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

const FAQ: React.FC = () => {
  // Animation variants with reduced motion support
  const shouldReduceMotion = useReducedMotion();
  const fadeIn = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
      };

  // State management
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized toggleFAQ
  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('https://my-strapi-backend.fly.dev/api/faqs?populate=*', {
        });
        const data = response.data.data[0];

        const faqs: FAQ[] = data.FAQ.sort((a, b) => a.Order - b.Order).map((item) => ({
          question: item.Question,
          answer: item.Anwer,
        }));

        setFaqData(faqs);
        setContactData({
          title: 'Contacteer mij',
          description:
            'Zit je nog met een vraag die niet wordt beantwoord op deze pagina? Contacteer <a href="/contact" target="_blank" rel="noopener noreferrer">Laserstudio Marie</a> dan vandaag nog. Wil je meteen een afspraak maken? Dat kan eenvoudig online!',
          primaryCTA: { text: data.PrimaryCTA.Text, url: data.PrimaryCTA.URL },
          secondaryCTA: { text: data.SecondaryCTA.Text, url: data.SecondaryCTA.URL },
        });
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounced scroll handler for Back to Top
  useEffect(() => {
    const handleScroll = debounce(() => {
      setShowBackToTop(window.scrollY > 300);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Structured FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  if (loading) {
    return <div className="text-center py-16 text-[#8b8455] text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f6ef] to-[#f5f2e8] font-sans text-[#333] overflow-x-hidden">
      <script type=" criticisms/ld+json">{JSON.stringify(faqSchema)}</script>

      <Suspense fallback={<div className="text-center py-16 text-[#8b8455]">Loading section...</div>}>
        <FirstSection />
      </Suspense>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="py-16 md:py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#8b8455] tracking-tight">
              FAQ
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-px bg-gradient-to-r from-transparent via-[#8b8455] to-transparent mx-auto my-12 sm:my-16 md:my-5"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10"> {/* Enhanced shadow and padding */}
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                toggleFAQ={toggleFAQ}
                isLast={index === faqData.length - 1}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-8 right-8 bg-[#8b8455] text-white p-4 rounded-full shadow-lg hover:bg-[#a89e6b] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8b8455] focus:ring-offset-2"
            aria-label="Terug naar boven"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {contactData && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          className="bg-[#f9f6ef] py-16"
        >
          <div className="space-y-8 text-center max-w-2xl mx-auto px-4 sm:px-6">
            <h4 className="text-2xl sm:text-3xl md:text-3xl font-semibold text-[#8b8455]">
              {contactData.title}
            </h4>
            <div
              className="text-base sm:text-lg md:text-xl text-[#555] leading-relaxed contact-description"
              dangerouslySetInnerHTML={{ __html: contactData.description }}
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <motion.a
                href={contactData.primaryCTA.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: '#a89e6b', boxShadow: '0 10px 25px rgba(139, 132, 85, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="inline-block bg-[#8b8455] text-white px-8 py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8b8455] focus:ring-offset-2"
              >
                {contactData.primaryCTA.text}
              </motion.a>
              <motion.a
                href={contactData.secondaryCTA.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: '#f0ede4', boxShadow: '0 10px 25px rgba(139, 132, 85, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#8b8455] border-2 border-[#8b8455] px-8 py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8b8455] focus:ring-offset-2"
              >
                <span>{contactData.secondaryCTA.text}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FAQ;