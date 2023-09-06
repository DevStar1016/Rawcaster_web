import { Form, Input } from "antd";
import { useEffect, useState } from "react";
import classes from "./JoinMeeting.module.css";
import { useParams } from "react-router";
import { useFormik } from "formik";
import * as yup from "yup";
import { EMAIL_REGEX } from "../../../Shared/Constant";
import { ExternalUserJoinService } from "../../../Services/ApiService";
import { JSONtoformdata } from "../../../Shared/Utility";
import { toast } from "react-hot-toast";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesendMessage } from "../../../Services/SocketService";
import { useDispatch } from "react-redux";
import { handleeventTempUserData } from "../../../Store/Redux/Reducer/AuthReducer";
import { handleEventWindowRef } from "../../../Store/Redux/Reducer/UtilityReducer";

const validationSchema = yup.object().shape({
  reference_id: yup
    .string()
    .trim("The Meeting code cannot include leading and trailing spaces")
    .strict(true)
    .max(50, "Meeting codeme cannot be longer than 50 characters")
    .required("Please input your Meeting code!"),
  email_id: yup
    .string()
    .min(5, `Please Enter Valid Email id !`)
    .matches(EMAIL_REGEX, `Please Enter Valid Email id!`)
    .required(`Please input your Email id!`),
  name: yup
    .string()
    .trim("The Name cannot include leading and trailing spaces")
    .strict(true)
    .max(50, "Name cannot be longer than 50 characters")
    .required("Please input your Name!"),
});

const JoinMeeting = () => {
  const dispatch = useDispatch();
  const { ref_id } = useParams();
  const [isFetched, setisFetched] = useState(false);
  const { values, setFieldValue, handleSubmit, touched, errors, handleChange } =
    useFormik({
      initialValues: {
        reference_id: "",
        email_id: "",
        name: "",
      },
      validationSchema,
      onSubmit: (value) => {
        setisFetched(true);
        HandleJoinMeeting(value);
      },
    });

  /**
   * if start and join meeting opens a new popup window
   */

  const HandlePopup = (user_data: any, meeting_data: any) => {
    // @ts-ignore
    const EventWindowRef = window.open(`/room/${ref_id}`, "_blank", {
      popup: true,
    });
    dispatch(handleEventWindowRef(EventWindowRef));
    if (EventWindowRef) {
      EventWindowRef.onload = () => {
        const EventData = {
          type: "EventData",
          message: meeting_data,
        };
        EventWindowRef.postMessage(EventData, "*");
        ChimesendMessage(
          { userId: user_data.user_id },
          CHIME_SOCKET_EVENTS.JOIN_SOCKET
        );

        ChimesendMessage(
          { refId: ref_id },
          CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
        );

        ChimesendMessage(
          {
            userId: user_data?.user_id,
            refId: ref_id,
            name: user_data?.name,
            image: user_data?.profile_image,
            email: user_data?.email,
          },
          CHIME_SOCKET_EVENTS.JOIN_REQUEST
        );
      };
      EventWindowRef.onclose = (e) => {
        e.stopPropagation();
      };
    }
    // when the popup unloads
  };

  useEffect(() => {
    if (ref_id) {
      setFieldValue("reference_id", ref_id);
    } else {
      setFieldValue("reference_id", "");
    }
  }, [ref_id]);

  /**
   *  Generate an user id for Non-Rawcaster user and join then meeting
   */
  const HandleJoinMeeting = (value) => {
    ExternalUserJoinService(JSONtoformdata(value))
      .then((res) => {
        if (res.data.status === 1) {
          const { user, event } = res.data;
          dispatch(handleeventTempUserData(user));
          HandlePopup(user, event);
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        setisFetched(false);
      });
  };

  return (
    <div className={classes.bgsec}>
      <div className="bodycontentdiv">
        <div className={classes.meetingBox}>
          <h1>Join Meeting</h1>
          <Form.Item
            className={classes.textBoxContainer}
            style={{
              display: ref_id ? "none" : "block",
            }}
          >
            <Input
              className={classes.textBox}
              placeholder="Meeting code"
              autoComplete="off"
              value={values.reference_id}
              onChange={handleChange("reference_id")}
              maxLength={50}
              status={
                touched.reference_id && errors.reference_id ? "error" : ""
              }
            />
            {touched.reference_id && (
              <p className="ErrTxt">{errors?.reference_id}</p>
            )}
          </Form.Item>
          <Form.Item
            name="emailId"
            colon={false}
            className={classes.textBoxContainer}
          >
            <Input
              className={classes.textBox}
              placeholder="Enter Your Email ID"
              autoComplete="off"
              value={values.email_id}
              onChange={handleChange("email_id")}
              maxLength={50}
              status={touched.email_id && errors.email_id ? "error" : ""}
            />
            {touched.email_id && <p className="ErrTxt">{errors?.email_id}</p>}
          </Form.Item>
          <Form.Item
            name="name"
            required={false}
            colon={false}
            className={classes.textBoxContainer}
          >
            <Input
              className={classes.textBox}
              placeholder="Enter Your Name"
              autoComplete="off"
              value={values.name}
              onChange={handleChange("name")}
              maxLength={50}
              status={touched.name && errors.name ? "error" : ""}
            />
            {touched.name && <p className="ErrTxt">{errors?.name}</p>}
          </Form.Item>
          {isFetched ? (
            <img
              src={require("../../../Assets/Images/Events/loader.gif")}
              alt=""
              style={{ width: "50%" }}
            />
          ) : (
            <button
              type="button"
              className={classes.joinBtn}
              onClick={() => {
                handleSubmit();
              }}
            >
              JOIN MEETING
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting;
