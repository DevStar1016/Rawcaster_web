import React from "react";
import { Helmet } from "react-helmet";

/**
 * Component for setting SEO metadata in the head of the document.
 * @param {Object} props - The props object containing the title and description.
 * @param {string} props.title - The title of the page.
 * @param {string} props.description - The description of the page.
 * @returns The Helmet component with the specified SEO metadata.
 */
const Seo = ({ title, description }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Seo;
