import { Carousel } from "antd";
import React from "react";
import classes from "./Slider.module.css";

const Slider = ({ Data, children }) => {
  return (
    <Carousel autoplay>
      {Data.map((ele) => {
        <div>
          <h3>
            <div className={classes.sliderSec}>
              <div className={classes.contentBox}>
                <h2> {children}</h2>
                <h4>
                  with Rawcaster Influencers, bloggers, writers, photographers
                  can collaborate with their fans easily
                </h4>
              </div>
            </div>
          </h3>
        </div>;
      })}
    </Carousel>
  );
};

export default Slider;
