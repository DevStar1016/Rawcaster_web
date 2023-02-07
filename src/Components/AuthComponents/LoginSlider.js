import { Carousel } from "antd";
import React from "react";
import Slider from "../../Sharedcomponents/Slider";

// import LoginImg from "../../Assets/Images/svg/share_signup.svg";

const LoginSlider = () => {
  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <div>
      <Slider Data={[...new Array(10)]}>1234 </Slider>
    </div>
  );
};

export default LoginSlider;
