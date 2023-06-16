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

const EventRoom = () => {
  const meetingManager = useMeetingManager();
  const MeetingStatus = useMeetingStatus();
  const [searchParams] = useSearchParams();
  const data = searchParams.get("meetingid");
  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("host_name", "vasanth");
    const response = await CreateMeeting(formData);
    if (response.data.status === 1) {
      console.log(response.data.data, "esponse.data.data");
      const { meetingResponse, attendeeResponse } = response.data.data;
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        meetingResponse,
        attendeeResponse
      );
      const meetingOptions = {
        deviceLabels: DeviceLabels.AudioAndVideo,
      };
      try {
        await meetingManager.join(meetingSessionConfiguration, meetingOptions);
        await meetingManager.start();
      } catch (error) {
        console.log(error, "error");
      }
    } else {
      console.log(response.data.msg);
    }
  };

  const handleJoin = async () => {
    const formData = new FormData();
    formData.append("meeting_id", data);
    formData.append("attendee_name", Math.random(1, 100).toString());
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
      console.log(response.data.msg);
    }
  };

  useEffect(() => {
    if (data) {
      handleJoin();
    } else {
      if (!MeetingStatus) {
        handleCreate();
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
