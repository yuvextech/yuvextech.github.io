
import React from 'react';

const CLIENTS = [
  "Quantum", "NexGen", "Velocity", "Aether", "Synapse", "Pulse", 
  "Orbit", "Titan", "Vertex", "Prism", "Lumina", "Forge"
];

const ClientLogos: React.FC = () => {
  // Double the array for seamless looping
  const doubledClients = [...CLIENTS, ...CLIENTS];

  return (
    <section className="py-12 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-950/20 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 mb-8 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium uppercase tracking-[0.2em]">
          Trusted by Industry Innovators
        </p>
      </div>
      
      <div className="relative mask-fade pause-on-hover">
        <div className="flex w-fit animate-marquee">
          {doubledClients.map((client, index) => (
            <div 
              key={`${client}-${index}`} 
              className="flex items-center justify-center px-12 md:px-20 group"
            >
              <span className="text-2xl md:text-3xl font-black text-gray-900/10 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105 transition-all duration-300 select-none cursor-default tracking-tighter italic">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
