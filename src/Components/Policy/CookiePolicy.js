import React from "react";
import classes from "./Faq.module.css";


const Cookiespolicy = () => {
  (function (d, s, id) {
    var js,
      tjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://app.termly.io/embed-policy.min.js";
    tjs.parentNode.insertBefore(js, tjs);
  })(document, "script", "termly-jssdk3");
  return (
    <div
    className={classes.termsbg}
      name="termly-embed"
      data-id="39acab2c-8f0e-4711-b581-400589ce3866"
      data-type="iframe"
    ></div>
  );
};

export default Cookiespolicy;
