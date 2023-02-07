import { Carousel } from "antd";
import React from "react";
import classes from "./LoginSlider.module.css";

const LoginSlider = () => {
  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <Carousel autoplay>
      <div>
        <h3 style={contentStyle}>
          <div className={classes.sliderSec}>
            <div className={classes.contentBox}>
              <img src={require("../../assets/home/share_signup.svg")} />
              <h2>Connect Share Express</h2>
              <h4>
                with Rawcaster Influencers, bloggers, writers, photographers can
                collaborate with their fans easily
              </h4>
            </div>
          </div>
        </h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
  );
};

export default LoginSlider;
