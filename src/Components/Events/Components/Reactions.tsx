import React, { useMemo, useState } from "react";
import { Easing } from "react-native-web";
import Fly from "react-flying-objects";
import classes from "./Reactions.module.css";

const DELAY = 1000;
const DURATION = 5000;
const SIZE = 25;

const random = (min: any, max: any) =>
  Math.floor(Math.random() * (max - min) + min);

const Reactions = () => {
  const [animatedEmoji, setAnimatedEmoji] = useState<any>(); // To randomly set values in the objectConfig
  const [flyingObjects, setFlyingObjects] = useState<any>([]); // Used to manage all flying currently objects by the Fly component

  const animatedEmojiList = [
    {
      id: 1,
      emoji: "💖",
    },
    {
      id: 2,
      emoji: "👍",
    },
    {
      id: 3,
      emoji: "🎉",
    },
    {
      id: 4,
      emoji: "👏",
    },
    {
      id: 5,
      emoji: "😂",
    },
    {
      id: 6,
      emoji: "😮",
    },
    {
      id: 7,
      emoji: "🥲",
    },
    {
      id: 8,
      emoji: "🤔",
    },
    {
      id: 9,
      emoji: "👎",
    },
  ];

  const onSelect = (emojiData: string) => {
    const emoji = (
      <div
        style={{
          fontSize: 25,
        }}
      >
        {emojiData}
      </div>
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
    <div className={classes.reactionsContainer}>
      <Fly
        objectToFly={animatedEmoji}
        objectConfig={objectConfig}
        flyingObjects={flyingObjects}
        setFlyingObjects={setFlyingObjects}
      />
      <div className={classes.reactionsSec}>
        {animatedEmojiList.map((ele) => (
          <div
            className={classes.emoji}
            onClick={() => {
              onSelect(ele.emoji);
            }}
          >
            <div
              style={{
                fontSize: 25,
              }}
            >
              {ele.emoji}
            </div>
            {/* <em-emoji
              native={ele.emoji}
              size={`${SIZE}`}
              set="apple"
            ></em-emoji> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reactions;
