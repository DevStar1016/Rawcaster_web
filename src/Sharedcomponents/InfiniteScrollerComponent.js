import React, { useRef, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";

const InfiniteScrollerComponent = ({
  Component,
  Loader,
  totalPages,
  onNextPage,
}) => {
  const pageRef = useRef(1);
  const [loading, setloading] = useState(false);

  const loadMore = () => {
    if (loading) {
      if (pageRef.current !== totalPages + 1) {
        setloading(true);
        pageRef.current = pageRef.current + 1;
        onNextPage(pageRef.current)
          .then(() => {
            setloading(false);
          })
          .finally(() => {
            setloading(false);
          });
      }
    }
  };

  const getHasNextPage = () => {
    return pageRef.current !== totalPages + 1;
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

  return (
    <div ref={rootRef}>
      <Component />
      {loading && getHasNextPage() && (
        <div ref={sentryRef}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollerComponent;
