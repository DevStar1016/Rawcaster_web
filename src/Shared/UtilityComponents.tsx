import { TooltipProps } from "antd";
import { EllipsisConfig } from "antd/es/typography/Base";
import React, { useEffect, useRef, useState } from "react";

type ellipsisProps = {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: React.ReactNode;
  onExpand?: (ellipsis: boolean) => void;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: React.ReactNode | TooltipProps;
};

type CustomParagraphprops = {
  className: string;
  ellipsis?: ellipsisProps;
  children?: string;
};
export const CustomParagraph = (props: CustomParagraphprops) => {
  const [isExpanded, setisExpanded] = useState(false);
  const [isReadMoreEnable, setisReadMoreEnable] = useState(false);

  const { ellipsis, children, className } = props;
  const { onExpand, onEllipsis, rows } = ellipsis ?? {};
  const textRef = useRef((initialRef: any) => {
    if (initialRef) {
      if (initialRef?.offsetHeight < initialRef?.scrollHeight) {
        setisReadMoreEnable((pre) => true);
      } else {
        setisReadMoreEnable((pre) => false);
      }
    } else {
      setisReadMoreEnable((pre) => false);
    }
  });

  const toggleReadMore = () => {
    setisExpanded((pre: boolean) => {
      if (!pre && onExpand) {
        onExpand(!pre);
      } else if (onEllipsis) {
        onEllipsis(!pre);
      }

      return !pre;
    });
  };
  console.log(children);

  const style = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: !isExpanded && rows ? rows : "unset",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <>
      <p
        /*@ts-ignore*/
        style={style}
        className={className}
        ref={textRef.current}
      >
        {children}
      </p>

      {isReadMoreEnable && (
        <span
          onClick={toggleReadMore}
          style={{ color: "#e26386", cursor: "pointer" }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </span>
      )}
    </>
  );
};
