import { TooltipProps } from "antd";
import { EllipsisConfig } from "antd/es/typography/Base";
import React, { useRef, useState } from "react";

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
  const textRef = useRef<any>(null);
  const { ellipsis, children, className } = props;
  const { onExpand, onEllipsis, rows } = ellipsis ?? {};

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

  const style = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: !isExpanded && rows ? rows : "unset",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const shouldShowButton = () => {
    if (textRef.current) {
      if (textRef.current?.offsetHeight < textRef.current?.scrollHeight) {
        return true;
      }
      if (rows && textRef.current?.textContent?.split(/\n/).length > rows) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <div>
      {/*@ts-ignore*/}
      <p style={style} className={className} ref={textRef}>
        {children}
      </p>
      {(shouldShowButton() || isExpanded) && (
        <span
          onClick={toggleReadMore}
          style={{ color: "#e26386", cursor: "pointer" }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </span>
      )}
    </div>
  );
};
