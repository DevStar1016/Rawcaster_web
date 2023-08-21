import React, { useEffect, useRef, useState } from "react";

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
    if (Data.length > 0 && containerRef.current && !isInitialLoaded.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      isInitialLoaded.current = true;
    }
  }, [Data]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: "400px", overflowY: "scroll" }}
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
