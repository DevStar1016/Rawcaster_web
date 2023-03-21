import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { listEventsService } from "../../../Services/ApiService";
import {
  useAuthData,
  useAuthToken,
  useDashboard,
} from "../../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../../Shared/Utility";
import Event from "../../../Sharedcomponents/Events/Event";
import AddLiveEvent from "../../Events/Configure/AddLiveEvent";
import CreateEvent from "../../Events/CreateEvent";

const Events = () => {
  const dispatch = useDispatch();
  const loginUserData = useAuthData();
  const token = useAuthToken();
  const { DashboardfilterType } = useDashboard();
  const [EventListData, setEventListData] = useState();
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);
  const [TalkShowData, setTalkShowData] = useState();

  const getEvents = () => {
    let eventData = {
      token: token,
      event_type: 1,
      page_number: 1,
    };
    listEventsService(JSONtoformdata(eventData))
      .then((res) => {
        if (res.data.status === 1) {
          setEventListData(res.data.events_list);
        } else {
          setEventListData([]);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (loginUserData !== null) {
      if (token) {
        getEvents();
      }
    }
  }, [token, isTalkshowOpen]);
  return (
    <>
      <CreateEvent />

      {EventListData?.map((ele) => (
        <Event
          ele={ele}
          handleEdit={(ele) => {
            setTalkShowData(ele);
            setisTalkshowOpen(true);
          }}
        />
      ))}
      <AddLiveEvent
        data={TalkShowData}
        isTalkshowOpen={isTalkshowOpen}
        setisTalkshowOpen={setisTalkshowOpen}
      />
    </>
  );
};

export default Events;
