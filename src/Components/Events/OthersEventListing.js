import React, { useEffect, useState } from "react";
import classes from "./Events.module.css";
import { Col, Row } from "react-bootstrap";
import Event from "../../Sharedcomponents/Events/Event";
import { DecryptionString, JSONtoformdata } from "../../Shared/Utility";
import { useParams } from "react-router";
import { listEventsService } from "../../Services/ApiService";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { toast } from "react-hot-toast";

const OthersEventListing = () => {
  const loginUserData = useAuthData();
  const { isSuccess } = useAuth();
  const token = useAuthToken();
  const params = useParams();
  const display_user_id = params?.user_id
    ? DecryptionString(params?.user_id)
    : null;
  const [EventListData, setEventListData] = useState([]);

  const getEvents = () => {
    let eventData = {
      token: token,
      event_type: 3,
      page_number: 1,
    };
    listEventsService(JSONtoformdata(eventData))
      .then((res) => {
        if (res.data.status === 1) {
          let filterEventList = res.data.events_list.filter((ele) => {
            return ele.original_user_id === parseInt(display_user_id);
          });
          console.log(filterEventList);
          setEventListData(filterEventList.reverse());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isSuccess, display_user_id]);

  return (
    <div className={classes.othersEventCard}>
      <h2>Events</h2>
      <Row>
        {EventListData?.map((ele) => (
          <Col sm={6}>
            <div>
              <Event ele={ele} setList={setEventListData} isOthers={true} />
            </div>
          </Col>
        ))}
      </Row>
      {EventListData?.length === 0 && (
        <div className="text-center">No events found</div>
      )}
    </div>
  );
};

export default OthersEventListing;
