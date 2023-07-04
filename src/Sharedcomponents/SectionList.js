import React, { useEffect, useState } from "react";
import classes from "./SectionList.module.css";

const SectionList = ({ HeaderComponent, RenderComponent, Data }) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Find the index of the section in view
      let activeIndex = 0;
      Data.forEach((section, index) => {
        const sectionElement = document.getElementById(`section-${index}`);
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;

        if (scrollPosition >= sectionTop - sectionHeight * 0.5) {
          activeIndex = index;
        }
      });

      setActiveSection(activeIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [Data]);

  return (
    <div>
      {Data.map((section, index) => (
        <div key={index}>
          <HeaderComponent
            id={`section-${index}`}
            // className={activeSection === index ? classes.active : ""}
          >
            {section.title}{" "}
          </HeaderComponent>
          <ul
            style={{
              paddingLeft: 0,
            }}
          >
            {section.items?.map((item, itemIndex) => (
              <RenderComponent ele={item} index={itemIndex} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SectionList;
