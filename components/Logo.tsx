import React from 'react';

interface LogoProps {
  /**
   * 'auto': automatically shows the light logo in light mode and dark logo in dark mode.
   * 'light': forces the light mode logo (dark text).
   * 'dark': forces the dark mode logo (white text).
   */
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  variant?: 'full' | 'icon';
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  theme = 'auto',
  className = 'h-9 w-auto',
  variant = 'full',
  alt = 'Yuvex Tech'
}) => {
  if (variant === 'icon') {
    return (
      <img
        src="/favicon.svg"
        alt={alt}
        className={`object-contain transition-transform duration-300 ${className}`}
        loading="eager"
      />
    );
  }

  if (theme === 'light') {
    return (
      <img
        src="/logo-light.svg"
        alt={alt}
        className={`object-contain transition-opacity duration-300 ${className}`}
        loading="eager"
      />
    );
  }

  if (theme === 'dark') {
    return (
      <img
        src="/logo-dark.svg"
        alt={alt}
        className={`object-contain transition-opacity duration-300 ${className}`}
        loading="eager"
      />
    );
  }

  // Automatic mode: renders both SVGs and toggles via Tailwind dark class (zero flicker on theme switch)
  return (
    <span className="inline-flex items-center">
      {/* Light Mode Logo (dark uvexTech text) */}
      <img
        src="/logo-light.svg"
        alt={alt}
        className={`block dark:hidden object-contain transition-opacity duration-300 ${className}`}
        loading="eager"
      />
      {/* Dark Mode Logo (white uvexTech text) */}
      <img
        src="/logo-dark.svg"
        alt={alt}
        className={`hidden dark:block object-contain transition-opacity duration-300 ${className}`}
        loading="eager"
      />
    </span>
  );
};

export default Logo;
