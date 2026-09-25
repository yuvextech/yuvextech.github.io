
import React, { useEffect, useRef, useState } from 'react';
import { useCMS } from '../context/CMSContext';

const Services: React.FC = () => {
  const { services } = useCMS();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="py-24 bg-gray-50 dark:bg-gray-950/80 transition-colors overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Our Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Comprehensive solutions for the modern web.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/50 transition-all group hover:-translate-y-2 shadow-sm dark:shadow-none opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{service.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
