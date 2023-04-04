import React from "react";
import { Helmet } from "react-helmet";

const Seo = ({ title, description }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      {/* <title>{title}</title>
      <meta name="description" content={description} /> */}
      {/* <link rel="canonical" href="http://mysite.com/example" /> */}
    </Helmet>
  );
};

export default Seo;
