import { Button } from "antd";
import React, { useState } from "react";
import AddLiveEvent from "./Configure/AddLiveEvent";
import classes from "./Events.module.css";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import eventIcon from "../../Assets/Images/svg/eventIcon.svg";
import AddEvent from "./Configure/AddEvent";
import { useEventContext } from "../../Shared/Context";

const CreateEvent = ({ isSearch, onSearchEnter }) => {
  const { isCreateEnabled } = useEventContext();
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);
  const [isEventOpen, setisEventOpen] = useState(false);
  const [searchInput, setsearchInput] = useState("");

  return (
    <div className={classes.eventActionSec}>
      {isCreateEnabled && (
        <div>
          <Button
            type="primary"
            size={"large"}
            className={classes.eventShowBtn}
            onClickCapture={() => {
              setisTalkshowOpen(true);
            }}
          >
            <img src={talkshowIcon} /> Create Talkshow
          </Button>
          <Button
            type="primary"
            size={"large"}
            className={classes.talkShowBtn}
            onClickCapture={() => {
              setisEventOpen(true);
            }}
          >
            <img src={eventIcon} /> Create Event
          </Button>
        </div>
      )}
      {isSearch && (
        <input
          className={`${classes.textBox} `}
          onChange={(e) => {
            setsearchInput(e.target.value);
            onSearchEnter(e.target.value);
          }}
          value={searchInput}
          placeholder="Search event or talkshow"
          autoComplete="off"
        />
      )}
      {isEventOpen && (
        <AddEvent isEventOpen={isEventOpen} setisEventOpen={setisEventOpen} />
      )}

      {isTalkshowOpen && (
        <AddLiveEvent
          isTalkshowOpen={isTalkshowOpen}
          setisTalkshowOpen={setisTalkshowOpen}
        />
      )}
    </div>
  );
};

export default CreateEvent;
