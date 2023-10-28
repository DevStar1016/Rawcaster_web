import { ReactNode, useMemo, useState, useEffect, FC } from "react";
import { Easing } from "react-native-web";
import Fly from "react-flying-objects";

import classes from "./Reactions.module.css";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { useEventRoomContext } from "../../../Shared/Context";
import { EventContextProp } from "./types";
import { useAuthData, useEventTempAuthData } from "../../../Shared/Reduxfetcher";

const DELAY = 1000;
const DURATION = 5000;
const SIZE = 25;

const random = (min: any, max: any) =>
  Math.floor(Math.random() * (max - min) + min);

type EmojiObject = {
  id: number;
  emoji: string;
};
interface ReactionsProps {
  showEmojList: boolean;
}

const Reactions: FC<ReactionsProps> = ({showEmojList}) => {
  const {
    EventData,
    animatedEmoji,
    setAnimatedEmoji,
  }: EventContextProp = useEventRoomContext();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();
  // To randomly set values in the objectConfig
  const [animate, setAnimate] = useState<ReactNode>();
  const [flyingObjects, setFlyingObjects] = useState<EmojiObject[]>([]); // Used to manage all flying currently objects by the Fly component

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
      emoji: "❓",
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

  useEffect(() => {
    if(animatedEmoji){
      setAnimate(<div style={{fontSize: 25}}>{animatedEmoji}</div>);
      setAnimatedEmoji('')
    }
  }, [animatedEmoji])
  
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  const onSelect = (emojiData: string) => {
    ChimesendMessage(
      {
        refId: EventData?.reference_id,
        userId: getUserData()?.user_id,
        emoji: emojiData,
        senderName: getUserData()?.name
      },
      CHIME_SOCKET_EVENTS.POST_REACTION
    );
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
    [animate]
  ); // On animatedEmoji change we calculate new random values for the next flying object

  return (
    <div className={classes.reactionsContainer}>
      <Fly
        objectToFly={animate}
        objectConfig={objectConfig}
        flyingObjects={flyingObjects}
        setFlyingObjects={setFlyingObjects}
      />
      {showEmojList && <div className={classes.reactionsSec}>
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
          </div>
        ))}
      </div>}
    </div>
  );
};

export default Reactions;
