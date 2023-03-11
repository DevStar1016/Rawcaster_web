import React, { useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";

const EmojiPicker = (props) => {
  const ref = useRef();

  useEffect(() => {
    new Picker({ ...props, data, ref });
  }, [props]);

  return <div ref={ref} style={{ height: 350, overflow: "hidden" }} />;
};

export default EmojiPicker;
