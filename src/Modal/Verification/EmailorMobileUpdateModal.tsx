import React from "react";
import GlobalModal from "../GlobalModal";
import { useFormik } from "formik";
import { Form, Input } from "antd";
import classes from "./EmailorMobileUpdateModal.module.css";
import * as yup from "yup";
import {
  resendOtpService,
  updateProfileService,
} from "../../Services/ApiService";
import {
  JSONtoformdata,
  filterValidObject,
  getAuthToken,
  isValidData,
} from "../../Shared/Utility";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { handletwostepVerifyModalshow } from "../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";

type EmailorMobileUpdateModalProps = {
  open: boolean;
  type: "email_id" | "mobile_no";
  submit: (val: any) => void;
  close: () => void;
};

function EmailorMobileUpdateModal({
  open,
  type = "email_id",
  close,
}: EmailorMobileUpdateModalProps) {
  const loginToken = useAuthToken();
  const dispatch = useDispatch();
  const { loginUserData } = useAuth();
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    email_id:
      type === "email_id"
        ? yup.string().email().required(`Please input your Email!`)
        : yup.string().email(),
    mobile_no:
      type === "mobile_no"
        ? yup.string().required(`Please input your Mobile number!`)
        : yup.string(),
  });

  const { values, handleChange, touched, errors, handleSubmit } = useFormik({
    initialValues: {
      email_id: "",
      mobile_no: "",
    },
    validationSchema,
    onSubmit: (value) => {
      if (loginToken && loginUserData && loginUserData.name) {
        handleupdateProfile(value);
      }
    },
  });

  const handleSendOTP = (value: any, navigateFrom: any) => {
    let finalData = {
      auth_code: getAuthToken("Rawcaster"),
      token: loginToken,
      otp_flag: value,
    };
    resendOtpService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          navigate("/verifyotp", {
            state: { navigatePath: "/setting", type: value, ...res.data },
          });
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.message, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  const HandleprofileUpdate = (value) => {
    if (
      value.two_type_verification === 1 &&
      isValidData(value.email_id) &&
      isValidData(value.mobile)
    ) {
      dispatch(handletwostepVerifyModalshow(true));
    } else if (isValidData(value.email_id)) {
      handleSendOTP("email", null);
    } else if (isValidData(value.mobile)) {
      handleSendOTP("sms", null);
    } else {
      toast.remove("rawcaster");
      toast.error("Phone Number and Email ID Missing", { id: "rawcaster" });
    }
  };

  const handleupdateProfile = (values, isNext = false) => {
    let profileValue = {
      ...values,
      token: loginToken,
      auth_code:
        loginToken && loginUserData?.name
          ? getAuthToken(loginToken + loginUserData?.name.trim())
          : "",
    };

    updateProfileService(JSONtoformdata(filterValidObject(profileValue)))
      .then((res) => {
        if (res.data.status === 1) {
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          HandleprofileUpdate(values);
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  return (
    <GlobalModal
      open={open}
      title={`Update your ${type === "email_id" ? "Email" : "Mobile"}`}
      isChildren
      closable
      isSubmitAvailable
      //   isCloseAvailable
      //   closeButtonTitle="Cancel"
      SubmitButtonTitle="Update and Verify"
      onClose={() => {
        close();
      }}
      onSuccess={handleSubmit}
    >
      <div className={classes.UpdateprofileBox}>
        <p className={classes.label}>
          {type === "email_id" ? "Email" : "Mobile"}
        </p>
        <Form.Item name={type}>
          <Input
            className={classes.textBox}
            placeholder={`Enter your ${
              type === "email_id" ? "Email Id" : "Mobile Number"
            }`}
            autoComplete="off"
            value={values[type]}
            onChange={handleChange(type)}
            maxLength={50}
            status={touched[type] && errors[type] ? "error" : ""}
          />
          <p className="ErrTxt">{touched[type] ? errors?.[type] : ""}</p>
        </Form.Item>
      </div>
    </GlobalModal>
  );
}

export default EmailorMobileUpdateModal;
