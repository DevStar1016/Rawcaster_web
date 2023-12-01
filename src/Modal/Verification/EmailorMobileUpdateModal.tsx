import React, { useState } from "react";
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
import { MOBILE_NUMBER_REGEX } from "../../Shared/Constant";
import CountryCodeDropdown from "../../UIComponents/CountryCodeDropdown";

type EmailorMobileUpdateModalProps = {
  open: boolean;
  type: "email_id" | "mobile";
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
  const [Value, setValue] = useState("");
  const validationSchema = yup.object().shape({
    email_id:
      type === "email_id"
        ? yup.string().email().required(`Please input your Email!`)
        : yup.string().email(),
    country_id: yup.string(),
    mobile:
      type === "mobile"
        ? yup
            .string()
            .matches(MOBILE_NUMBER_REGEX, `Please Enter Valid Mobile Number!`)
            .min(5, `Please input Valid Mobile Number!`)
            .test(
              "validate Number",
              "Enter valid Number",
              function (value, ctx) {
                const { country_id } = this.parent;
                if (value && !country_id) {
                  return ctx.createError({
                    message: "Country code is Required",
                  });
                }
                return true;
              }
            )
            .required(`Please input your Mobile number!`)
        : yup.string().min(5, `Please input Valid Mobile Number!`),
  });

  const { values, setValues, touched, errors, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        email_id: "",
        mobile: "",
        country_code: "",
        country_id: "",
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

  const HandleprofileUpdate = (value: any) => {
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

  const handleupdateProfile = (values: any, isNext = false) => {
    let profileValue = {
      ...values,
      name: loginUserData?.name ? loginUserData?.name.trim() : "",
      first_name: loginUserData?.first_name ? loginUserData?.first_name : "",
      mobile_no: values?.mobile ? values?.mobile : "",
      token: loginToken,
      auth_code:
        loginToken && loginUserData?.name
          ? getAuthToken(loginToken + loginUserData?.name.trim())
          : "",
    };
    delete profileValue["mobile"];
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
        <div className="d-flex flex-row mobileInput">
          {type === "mobile" && (
            <CountryCodeDropdown
              width="25%"
              status={touched.mobile && errors.mobile ? "error" : ""}
              //@ts-ignore
              value={values.country_code}
              onSelectItem={(val) => {
                setValues((pre) => ({
                  ...pre,
                  country_code: val.label,
                  country_id: val.key,
                }));
              }}
            />
          )}
          <Form.Item
            name={type}
            style={{ width: "100%", marginLeft: type === "mobile" ? 10 : 0 }}
          >
            <Input
              className={classes.textBox}
              placeholder={`Enter your ${
                type === "email_id" ? "Email Id" : "Mobile Number"
              }`}
              autoComplete="off"
              value={Value}
              onChange={(e) => {
                if (type === "email_id" && e.target.value.length <= 50) {
                  setValue(e.target.value);
                  setFieldValue("email_id", e.target.value);
                } else if (type === "mobile" && e.target.value.length <= 15) {
                  setValue(e.target.value);
                  setFieldValue("mobile", e.target.value);
                } else {
                  e.stopPropagation();
                }
              }}
              status={touched[type] && errors[type] ? "error" : ""}
            />
            <p className="ErrTxt">{touched[type] ? errors?.[type] : ""}</p>
          </Form.Item>
        </div>
      </div>
    </GlobalModal>
  );
}

export default EmailorMobileUpdateModal;
