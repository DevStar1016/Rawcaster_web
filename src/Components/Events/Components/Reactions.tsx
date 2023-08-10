import React, { useMemo, useState } from "react";
import { Easing } from "react-native-web";
import Fly from "react-flying-objects";
import EmojiPicker from "../../../UIComponents/EmojiPicker";

const DELAY = 1000;
const DURATION = 5000;
const SIZE = 25;

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);

const Reactions = () => {
  const [animatedEmoji, setAnimatedEmoji] = useState(); // To randomly set values in the objectConfig
  const [flyingObjects, setFlyingObjects] = useState([]); // Used to manage all flying currently objects by the Fly component

  const onSelect = (emojiData) => {
    const emoji = (
      <em-emoji native={emojiData.native} size={SIZE} set="apple"></em-emoji>
    );
    setAnimatedEmoji(emoji); // Setting the object which would fly in a moment
  };

  const objectConfig = useMemo(
    () => ({
      // Config for a single flying object which would fly in a moment
      bottom: {
        fromValue: 40,
        toValue: 800,
        duration: DURATION,
        delay: DELAY,
      },
      left: {
        fromValue: random(100, 200),
        toValue: random(100, 200),
        duration: DURATION,
        easing: Easing.elastic(5),
        delay: DELAY,
      },
      width: {
        fromValue: random(SIZE - 10, SIZE + 10),
        toValue: SIZE,
        duration: DURATION,
        easing: Easing.elastic(5),
        delay: DELAY,
      },
      height: {
        fromValue: random(SIZE - 10, SIZE + 10),
        toValue: SIZE,
        duration: DURATION,
        easing: Easing.elastic(5),
        delay: DELAY,
      },
      opacity: {
        fromValue: 1,
        toValue: 0,
        duration: DURATION,
        easing: Easing.exp,
        delay: DELAY,
      },
    }),
    [animatedEmoji]
  ); // On animatedEmoji change we calculate new random values for the next flying object

  return (
    <div className="App">
      <Fly
        objectToFly={animatedEmoji}
        objectConfig={objectConfig}
        flyingObjects={flyingObjects}
        setFlyingObjects={setFlyingObjects}
      />
      <EmojiPicker
        emojiButtonColors={["#364157"]}
        emojiButtonRadius="8px"
        skinTonePosition="none"
        previewPosition="none"
        categories={[
          "people",
          "nature",
          "foods",
          "activity",
          "places",
          "objects",
          "symbols",
          "flags",
        ]}
        onEmojiSelect={(e) => {
          onSelect(e);
        }}
      />
      {/* <Picker set="apple" onSelect={onSelect} /> */}
    </div>
  );
};

export default Reactions;
