/**
 * A reusable component that renders a sectioned list with a header component and a render component.
 * @param {React.Component} HeaderComponent - The component to render as the header for each section.
 * @param {React.Component} RenderComponent - The component to render for each item in the section.
 * @param {Array} Data - The data array containing the sections and items.
 * @param {boolean} hasNextPage - Indicates if there is more data to load.
 * @param {function} loadMore - The function to call when more data needs to be loaded.
 * @param {boolean} loading - Indicates if the component is currently loading data.
 * @returns The rendered section list component.
 */
import React, { useEffect, useRef } from "react";

const SectionList = ({
  HeaderComponent,
  RenderComponent,
  Data,
  hasNextPage,
  loadMore,
  loading,
}) => {
  const isInitialLoaded = useRef(null);

  const containerRef = useRef(null);
  const handleScroll = (e) => {
    const { scrollTop } = e.target;

    if (scrollTop === 0 && hasNextPage) {
      loadMore();
    }
  };

  useEffect(() => {
    // Focus on the last item when it's added
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    // Focus on the last item when it's added
    if (Data.length > 0 && containerRef.current && containerRef.current.scrollTop > 10) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [Data]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: "300px", overflowY: "scroll" }}
    >
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
      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
};

export default SectionList;
