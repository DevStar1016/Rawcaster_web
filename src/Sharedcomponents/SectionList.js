import React, { useEffect, useState } from "react";
import classes from "./SectionList.module.css";

const SectionList = ({ HeaderComponent, RenderComponent, Data }) => {
  return (
    <div>
      {Data.map((section, index) => (
        <div key={index}>
          <HeaderComponent id={`section-${index}`}>
            {section.title}{" "}
          </HeaderComponent>
          <ul
            style={{
              paddingLeft: 0,
            }}
          >
            {section.items?.reverse().map((item, itemIndex) => (
              <RenderComponent ele={item} index={itemIndex} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SectionList;
