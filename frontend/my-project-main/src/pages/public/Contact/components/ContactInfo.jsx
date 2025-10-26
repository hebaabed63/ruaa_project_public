import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

// Icon mapping for contact info
const iconMap = {
  phone: FiPhone,
  email: FiMail,
  address: FiMapPin,
  clock: FiClock
};

// Social media icon mapping
const socialIconMap = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp
};

// Individual Contact Info Card
const ContactInfoCard = ({ info, icon: IconComponent, onCopy }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      onCopy?.(text);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClick = () => {
    if (info.number) {
      // Phone number
      window.open(`tel:${info.number}`, '_self');
    } else if (info.address) {
      // Email
      window.open(`mailto:${info.address}`, '_self');
    } else if (info.fullAddress) {
      // Address - open in maps
      const encodedAddress = encodeURIComponent(info.fullAddress);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const displayText = info.displayText || info.number || info.address || info.fullAddress;
  const isClickable = info.number || info.address || info.fullAddress;

  return (
    <motion.div
      className={`
        bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/60 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full border-2 border-blue-200/30
        transition-all duration-500
        ${isClickable ? 'cursor-pointer hover:shadow-3xl hover:border-primary/40 hover:bg-gradient-to-br hover:from-blue-50/60 hover:via-white hover:to-indigo-100/70' : ''}
        ${isHovered ? 'transform scale-105' : ''}
      `}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{
        y: -12,
        boxShadow: "0 35px 70px -15px rgba(59, 130, 246, 0.25)",
        transition: { duration: 0.4 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      viewport={{ once: true }}
    >
      <div className="flex flex-col items-center text-center space-y-6 relative">
        
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            opacity: isHovered ? 1 : 0
          }}
        />
        
        {/* Animated particles */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-400/40 rounded-full"
                style={{
                  top: `${15 + i * 25}%`,
                  right: `${10 + i * 20}%`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: Math.max(2 + i * 0.5, 0.5),
                  repeat: Infinity,
                  delay: Math.max(i * 0.3, 0),
                  repeatType: "loop"
                }}
              />
            ))}
          </motion.div>
        )}        
        
        {/* Icon */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-primary/15 via-blue-500/15 to-indigo-600/15 rounded-3xl flex items-center justify-center group mb-6 shadow-lg border border-blue-200/40 relative z-10"
          whileHover={{ 
            scale: 1.2,
            rotate: 15,
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.2))",
            transition: { duration: 0.4 }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-3xl blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <IconComponent className="w-10 h-10 text-primary group-hover:text-blue-700 transition-all duration-400 relative z-10 filter drop-shadow-sm" />
        </motion.div>

        {/* Label */}
        <motion.h3 
          className="text-xl font-bold text-gray-800 relative z-10"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {info.label}
        </motion.h3>

        {/* Content */}
        <div className="space-y-3 relative z-10">
          {info.weekdays && (
            <motion.p 
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {info.weekdays}
            </motion.p>
          )}
          
          {info.weekend && (
            <motion.p 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {info.weekend}
            </motion.p>
          )}

          {displayText && (
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isClickable ? (
                <button
                  onClick={handleClick}
                  className="text-primary hover:text-blue-700 transition-colors duration-300 font-medium"
                  aria-label={`اتصل بـ ${displayText}`}
                >
                  {displayText}
                </button>
              ) : (
                <span className="text-gray-700 font-medium">{displayText}</span>
              )}
              
              {displayText && (
                <button
                  onClick={() => handleCopy(displayText)}
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                  aria-label={`نسخ ${displayText}`}
                  title="نسخ"
                >
                  {isCopied ? (
                    <FiCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* External Link Icon for clickable items */}
        {isClickable && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="text-primary"
          >
            <FiExternalLink className="w-4 h-4" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Social Media Link Component
const SocialMediaLink = ({ social }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = socialIconMap[social.icon] || FaLinkedin;

  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        w-16 h-16 rounded-3xl flex items-center justify-center
        transition-all duration-500 group relative overflow-hidden
        shadow-xl border-4 border-white/50
        ${isHovered ? 'shadow-2xl transform scale-110' : 'shadow-xl'}
      `}
      style={{ backgroundColor: social.color }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: 1.2,
        rotate: 10,
        y: -3,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      viewport={{ once: true }}
      aria-label={`زيارة صفحة ${social.name}`}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(45deg, ${social.color}80, ${social.color}40)`,
          filter: 'blur(8px)',
          transform: 'scale(1.2)'
        }}
      />
      
      <IconComponent className="w-8 h-8 text-white group-hover:scale-125 transition-all duration-400 relative z-10 filter drop-shadow-md" />
    </motion.a>
  );
};

const ContactInfo = ({ data, socialMedia }) => {
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text) => {
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 3000);
  };

  if (!data) return null;

  const contactItems = [
    data.phone,
    data.email, 
    data.address,
    data.workingHours
  ].filter(Boolean);

  return (
    <div className="px-6 py-16 bg-gradient-to-br from-gray-50/80 via-blue-50/50 to-indigo-50/60 backdrop-blur-sm relative overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-2xl border-4 border-white/50"
            whileHover={{ scale: 1.1, rotate: 10, y: -5 }}
            transition={{ duration: 0.4 }}
          >
            <FiPhone className="w-10 h-10 text-white filter drop-shadow-md" />
          </motion.div>
          
          <motion.h2 
            className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6 drop-shadow-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            معلومات الاتصال
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            تواصل معنا عبر أي من الطرق التالية، نحن هنا لمساعدتك في أي وقت 🤝
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactItems.map((item, index) => {
            const IconComponent = iconMap[item.icon] || FiPhone;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <ContactInfoCard 
                  info={item} 
                  icon={IconComponent}
                  onCopy={handleCopy}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Copy Success Message */}
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <FiCheck className="w-4 h-4" />
            تم نسخ: {copiedText}
          </motion.div>
        )}

        {/* Social Media Section */}
        {socialMedia && socialMedia.length > 0 && (
          <motion.div
            className="text-center bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-100/50 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-blue-200/40 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Background decorative elements */}
            <motion.div
              className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-200/15 to-pink-300/15 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            <motion.div
              className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-2xl border-4 border-white/60 relative z-10"
              whileHover={{ scale: 1.1, rotate: 10, y: -5 }}
              transition={{ duration: 0.4 }}
            >
              <FiExternalLink className="w-9 h-9 text-white filter drop-shadow-md" />
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-8 relative z-10"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              تابعنا على وسائل التواصل الاجتماعي 📱
            </motion.h3>
            
            <div className="flex justify-center items-center gap-6 flex-wrap mb-8 relative z-10">
              {socialMedia.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                >
                  <SocialMediaLink social={social} />
                </motion.div>
              ))}
            </div>
            
            {/* Social Media Description */}
            <motion.p 
              className="text-lg text-gray-700 max-w-lg mx-auto leading-relaxed font-medium relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              ابقَ على اطلاع بآخر الأخبار والتحديثات من خلال متابعتنا 🌟
            </motion.p>
          </motion.div>
        )}

        {/* Enhanced Decorative Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-indigo-300/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/10 to-pink-300/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-indigo-200/8 to-blue-300/8 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.2, 0.08]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </div>
    </div>
  );
};

export default ContactInfo;