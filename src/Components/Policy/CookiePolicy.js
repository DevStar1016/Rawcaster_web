import React, { useEffect, useState } from "react";
import classes from "./Faq.module.css";
import { Skeleton } from "antd";

const Cookiespolicy = () => {
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    getScript(document, "script", "termly-jssdk3");
  }, []);

  /**
   * Retrieves a script from a given URL and injects it into the document.
   * @param {Document} d - The document object.
   * @param {string} s - The tag name of the script element.
   * @param {string} id - The id attribute of the script element.
   * @returns None
   */
  function getScript(d, s, id) {
    var js,
      tjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://app.termly.io/embed-policy.min.js";
    tjs.parentNode.insertBefore(js, tjs);
    window.scrollTo({ top: 0 });
    const handleIframeMessage = (event) => {
      if (event.data) {
        if (typeof event.data === "string") {
          setLoader(false);
          window.removeEventListener("message", handleIframeMessage);
        }
      }
    };
    window.addEventListener("message", handleIframeMessage);
  }
  return (
    <div id="privacy">
      {loader && (
        <div className={classes.Skeleton}>
          {[...new Array(10)].map((ele) => {
            return <Skeleton active />;
          })}
        </div>
      )}
      <div
        style={loader ? { maxHeight: "100vh" } : {}}
        className={classes.termsbg}
        name="termly-embed"
        data-id="39acab2c-8f0e-4711-b581-400589ce3866"
        data-type="iframe"
      ></div>
    </div>
  );
};

export default Cookiespolicy;
