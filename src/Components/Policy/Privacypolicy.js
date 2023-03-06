import React from "react";
import classes from "./Faq.module.css";

const Privacypolicy = () => {
  (function (d, s, id) {
    var js,
      tjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      // return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://app.termly.io/embed-policy.min.js";
    tjs.parentNode.insertBefore(js, tjs);
  })(document, "script", "termly-jssdk1");
  return (
    <div
      className={classes.termsbg}
      name="termly-embed"
      data-id="49507419-4ad0-4709-a042-6ba76cf03cdd"
      data-type="iframe"
    ></div>
  );
};

export default Privacypolicy;
