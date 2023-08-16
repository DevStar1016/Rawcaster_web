import React, { useEffect, useRef } from "react";
import { Picker } from "emoji-mart";
import { EmojiPickerProps } from "../types/UIComponents";

const EmojiPicker = (props: EmojiPickerProps) => {
  const ref = useRef(null);
  const instance = useRef<any>(null);

  if (instance.current) {
    instance.current?.update(props);
  }

  useEffect(() => {
    instance.current = new Picker({ ...props, ref });
    return () => {
      instance.current = null;
    };
  }, []);

  return React.createElement("div", {
    ref,
    className: "emoji-keyboard-container",
  });
};

export default EmojiPicker;
