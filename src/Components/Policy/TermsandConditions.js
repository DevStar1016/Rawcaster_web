import React from "react";

const TermsandConditions = () => {
  (function (d, s, id) {
    var js,
      tjs = d.getElementsByTagName(s)[0];

    if (d.getElementById(id)) {
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://app.termly.io/embed-policy.min.js";
    tjs.parentNode.insertBefore(js, tjs);
  })(document, "script", "termly-jssdk2");
  return (
    <div
      className="pt-5 mt-3"
      name="termly-embed"
      data-id="435d9ebf-27f8-44f1-85e7-a8250034c899"
      data-type="iframe"
    ></div>
  );
};

export default TermsandConditions;
