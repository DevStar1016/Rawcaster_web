import React, { useEffect, useRef, useState } from "react";
import classes from "./Faq.module.css";
import { Skeleton, Spin } from "antd";

const Privacypolicy = () => {
  // (function (d, s, id) {
  //   var js,
  //     tjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) {
  //     // return;
  //   }
  //   js = d.createElement(s);
  //   js.id = id;
  //   js.src = "https://app.termly.io/embed-policy.min.js";
  //   tjs.parentNode.insertBefore(js, tjs);
  // })(document, "script", "termly-jssdk1");
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    getScript(document, "script", "termly-jssdk1");
  }, []);

  function getScript(d, s, id) {
    var js,
      tjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      // return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://app.termly.io/embed-policy.min.js";
    // js.onload = handleIframeLoad;
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
        // <Spin className={classes.spinner} />
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
        data-id="49507419-4ad0-4709-a042-6ba76cf03cdd"
        data-type="iframe"
      ></div>
    </div>
  );
};

export default Privacypolicy;
