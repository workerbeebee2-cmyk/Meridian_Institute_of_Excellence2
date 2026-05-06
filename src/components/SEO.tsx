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
  const baseTitle = 'Meridian Institute of Excellence';
  const siteTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const siteDescription = description || "A premium hub shaping the minds of tomorrow through concept-based learning. Regular monitoring and personalized attention for continuous student growth.";
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
      <meta property="og:site_name" content={baseTitle} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name || baseTitle} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
    </Helmet>
  );
}
