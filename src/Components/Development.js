import { Skeleton } from "antd";
import React, { useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import useInfiniteScroll from "react-infinite-scroll-hook";

const Development = () => {
  const [content, setContent] = useState([...new Array(100)]);
  const [loading, setloading] = useState(false);
  const [isReachedEnd, setisReachedEnd] = useState(false);

  const handleBottomLoader = () => {
    setisReachedEnd(true);
  };

  const scrollRef = useBottomScrollListener(handleBottomLoader);

  const loadMore = () => {
    if (isReachedEnd) {
      console.log("isReachedEnd");
      setloading(true);
      setTimeout(() => {
        setContent((pre) => [...pre, ...new Array(10)]);
        setloading(false);
        setisReachedEnd(false);
      }, 1000);
    }
  };

  const getHasNextPage = () => {
    return content.length !== 190;
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

  return (
    <div ref={[scrollRef, rootRef]}>
      {content.map((item, index) => (
        <div key={index}>{index}</div>
      ))}
      {(loading || getHasNextPage()) && (
        <div ref={sentryRef}>
          <Skeleton />
        </div>
      )}
    </div>
  );
};

export default Development;
