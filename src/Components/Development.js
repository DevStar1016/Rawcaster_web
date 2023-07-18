import React, { useEffect, useRef, useState } from "react";
import {
  DeviceLabels,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useAuthData } from "../Shared/Reduxfetcher";

import { ChimesendMessage } from "../Services/SocketService";
import { useMainContext } from "../Shared/Context";
import {
  CreateAttendeeForMeeting,
  CreateMeeting,
  GetMeeting,
} from "../Services/Messaging/MessageAPIList";
import { CHIME_SOCKET_EVENTS } from "../Services/ServiceConstants";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
// import { Typography } from "antd";
// import { ReadMoreParagraph } from "../Shared/Utility";

const Development = () => {
  let meetingSession;
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const [MeetingId, setMeetingId] = useState("");
  const { meetingManager } = useMainContext();
  const userData = useAuthData();

  function generateClientRequestToken() {
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const clientRequestToken = `Meeting-${timestamp}-${randomSuffix}`;

    return clientRequestToken;
  }

  const CreateMeetingManager = () => {
    const input = {
      ClientRequestToken: generateClientRequestToken(),
      ExternalMeetingId: userData?.user_id.toString(),
      MediaRegion: "us-east-1",
    };
    CreateMeeting(input).then((res) => {
      setMeetingId(res.Meeting.MeetingId);
      console.log(res);
    });
  };

  const observer = {
    audioVideoDidStart: () => {
      // Get the attendee IDs and external user IDs for all attendees
      const attendeeIds = meetingSession.audioVideo
        .getAllAttendees()
        .map((attendee) => attendee.attendeeId);
      const externalUserIds = meetingSession.audioVideo
        .getAllAttendees()
        .map((attendee) => attendee.externalUserId);
      console.log(attendeeIds, externalUserIds, "attendeeIds, externalUserIds");
      // Call a function to get attendee tags
    },
    // eventDidReceive(name, attributes) {
    //   console.log(name, "name");
    //   switch (name) {
    //     case "audioInputFailed":
    //       console.error(
    //         `Failed to choose microphone: ${attributes.audioInputErrorMessage} in `,
    //         attributes
    //       );
    //       break;
    //     case "videoInputFailed":
    //       console.error(
    //         `Failed to choose camera: ${attributes.videoInputErrorMessage} in `,
    //         attributes
    //       );
    //       break;
    //     case "meetingStartFailed":
    //       console.error(
    //         `Failed to start a meeting: ${attributes.meetingErrorMessage} in `,
    //         attributes
    //       );
    //       break;
    //     case "meetingFailed":
    //       console.error(
    //         `Failed during a meeting: ${attributes.meetingErrorMessage} in `,
    //         attributes
    //       );
    //       break;
    //     default:
    //       break;
    //   }
    // },
  };

  const configureMeetingManager = async (meetingId, isHost) => {
    const meetinginput = {
      MeetingId: meetingId,
    };
    const attendeeinput = {
      MeetingId: meetingId,
      ExternalUserId: userData?.user_id.toString(),
      Tags: [
        {
          Key: "userData",
          Value: {
            name: userData?.display_name,
            image: userData?.profile_image,
            isHost: isHost,
          },
        },
      ],
    };
    Promise.all([
      CreateAttendeeForMeeting(attendeeinput),
      GetMeeting(meetinginput),
    ]).then(async (res) => {
      const attendee = res[0].Attendee;
      const meeting = res[1].Meeting;
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        meeting,
        attendee
      );
      const logger = new ConsoleLogger({ level: "info" });
      // Set up a device controller
      const deviceController = new DefaultDeviceController(logger);

      meetingSession = new DefaultMeetingSession(
        meetingSessionConfiguration,
        logger,
        deviceController
      );
      meetingSession.audioVideo.addObserver(observer);

      if (isHost) {
        ChimesendMessage(
          { meetingId: meetingId, hostId: userData.user_id },
          CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM
        );
      } else {
        ChimesendMessage(
          { meetingId: meetingId },
          CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
        );
      }
      const meetingOptions = {
        deviceLabels: DeviceLabels.AudioAndVideo,
      };
      try {
        await meetingManager.join(meetingSessionConfiguration, meetingOptions);
        await meetingManager.start();
      } catch (error) {
        console.log(error, "errorData");
      }
    });
  };

  return (
    <div
      style={{
        position: "relative",
        // height: "100vh",
      }}
    >
      <div className="h-100 p-5 mt-5 m-auto w-100">
        <button
          className="mx-2"
          onClick={() => {
            CreateMeetingManager();
          }}
        >
          Create Meeting
        </button>
        <input
          className="mx-2"
          placeholder="Enter MeetingId"
          value={MeetingId}
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <button
          className="mx-2"
          onClick={() => {
            configureMeetingManager(MeetingId, true);
            // window.open(`/room?meetingid=${MeetingId}`, "_blank", {
            //   popup: true,
            // });
          }}
        >
          Join Meeting
        </button>
        <button>Get Tags</button>
      </div>

      <br />
    </div>
  );
};

export default Development;
