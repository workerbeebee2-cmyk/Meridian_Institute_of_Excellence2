import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
}

export function SEO({
  title,
  description,
  name,
  type
}: SEOProps) {
  const baseTitle = 'Meridian Institute of Excellence | Kahilipara, Guwahati';
  const siteTitle = title ? `${title} | Meridian Institute of Excellence` : baseTitle;
  const siteDescription = description || "Premium coaching institute in Kahilipara, Guwahati for Class 8–10 students. Building strong academics and life skills. Learn. Think. Practice. Achieve.";
  const siteType = type || "website";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={siteDescription} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={siteType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:site_name" content="Meridian Institute of Excellence" />
      <meta property="og:image" content="https://i.ibb.co/G3pFmG8m/Favicon.png" />
      <meta property="og:url" content="https://www.meridianexcellence.com" />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name || "Meridian Institute of Excellence"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content="https://i.ibb.co/G3pFmG8m/Favicon.png" />
    </Helmet>
  );
}
