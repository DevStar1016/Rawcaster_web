/**
 * A React component that renders a section for downloading the Rawcaster app.
 * @returns The JSX code for the app download section.
 */
import React from "react";
import classes from "./Appdownload.module.css";
import Rlogo from "../../Assets/Images/svg/downlaod-apps.svg";

const AppdownloadScreen = () => {
  return (
    <>
      <div className={classes.downloadApp}>
        <div className={classes.imgSec}>
          <img
            src={require("../../Assets/Images/download-sec-img.jpeg")}
            alt="Download"
          />
        </div>

        <div className={classes.textSec}>
          <div className={classes.centerBox}>
            <img className={classes.Rlogo} src={Rlogo} alt="Rawcaster" />
            <h4>Download Apps</h4>
            <p>
              Please download the Rawcaster app from Google Play store and APP
              store.
            </p>
            <a
              target="_blank"
              href="https://apps.apple.com/in/app/rawcaster-com/id1547774638"
            >
              <img
                className={classes.appImg}
                src={require("../../Assets/Images/app-store.jpeg")}
                alt="app store"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.rawcaster"
              target="_blank"
            >
              <img
                className={classes.appImg}
                src={require("../../Assets/Images/play-store.jpeg")}
                alt="play store"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppdownloadScreen;
