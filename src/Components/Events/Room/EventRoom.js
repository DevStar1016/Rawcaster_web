import React, { useEffect } from "react";
import EventBox from "./EventBox";
import {
  DeviceLabels,
  useMeetingManager,
  useMeetingStatus,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import {
  CreateMeeting,
  JoinAttendeeMeeting,
} from "../../../Services/ApiService";
import { useSearchParams } from "react-router-dom";
import { useEventLayout } from "../../../Layouts/EventLayout";
import { ChimesocketListen } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";

const EventRoom = () => {
  const meetingManager = useMeetingManager();
  const MeetingStatus = useMeetingStatus();
  const [searchParams] = useSearchParams();
  const data = searchParams.get("meetingid");

  const handleCreate = async () => {
    const response = await CreateMeeting();
    console.log(response);
    // if (response.data.status === 200) {
    //   const { Meeting } = response.data.result;
    //   const meetingSessionConfiguration = new MeetingSessionConfiguration(
    //     Meeting,
    //     {}
    //   );
    //   const meetingOptions = {
    //     deviceLabels: DeviceLabels.AudioAndVideo,
    //   };
    //   try {
    //     await meetingManager.join(meetingSessionConfiguration, meetingOptions);
    //     await meetingManager.start();
    //     // handleJoin(Meeting.MeetingId);
    //   } catch (error) {
    //     console.log(error, "error");
    //   }
    // } else {
    //   console.log(response.data.msg);
    // }
  };

  const handleJoin = async (data) => {
    const formData = {
      MeetingId: data,
      userId: "1234",
    };
    const response = await JoinAttendeeMeeting(formData);
    if (response.data.status === 1) {
      const { meetingResponse, attendeeResponse } = response.data.data;
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        meetingResponse,
        attendeeResponse
      );

      const meetingOptions = {
        deviceLabels: DeviceLabels.AudioAndVideo,
      };

      await meetingManager.join(meetingSessionConfiguration, meetingOptions);
      await meetingManager.start();
    } else {
      console.log(response.data);
    }
  };

  useEffect(() => {
    if (data) {
      handleJoin(data);
    } else {
      if (!MeetingStatus) {
        handleCreate();
        ChimesocketListen.on("connect", (message) => {
          console.log(" ChimesocketListen Connected");
          // ...
        });
        ChimesocketListen.on(
          CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM,
          (message) => {
            console.log(message, "message.event");
            // ...
          }
        );
      }
    }
  }, []);
  return (
    <div>
      <EventBox />
    </div>
  );
};

export default EventRoom;
