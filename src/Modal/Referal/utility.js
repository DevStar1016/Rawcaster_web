import { Button, Form, Input, Tag, message } from "antd";
import { inviteToRawcasterService } from "../../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import classes from "./Referal.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useRef } from "react";

/**
 * Handles sending an email to the specified contacts using the provided token.
 * @param {string} token - The token used for authentication.
 * @param {Array} contacts - An array of email contacts to send the email to.
 * @returns {Promise} - A promise that resolves when the email is successfully sent.
 */
export const handleSendEmail = (token, contacts) => {
  let promise = new Promise((resolve, reject) => {
    let inviteData = {
      token: token,
      auth_code: getAuthToken(token),
      email_id: JSON.stringify(contacts),
    };
    inviteToRawcasterService(JSONtoformdata(inviteData))
      .then((res) => {
        if (res.data.status) {
          resolve();
          message.success(res.data.msg, 3);
        } else {
          message.warning(res.data.msg, 3);
        }
      })
      .catch((err) => {});
  });
  return promise;
};

/**
 * A container component for the email referral feature. Allows users to invite their friends
 * via email and unlock Rawcaster Pro features.
 * @param {Function} close - A function to close the container.
 * @returns The email referral container component.
 */
export const EmailReferalContainer = ({ close }) => {
  const token = useAuthToken();
  const inputref = useRef(null);
  const {
    values,
    setFieldValue,
    setValues,
    resetForm,
    handleSubmit,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      EmailList: [],
      emailInput: "",
    },
    validationSchema: Yup.object().shape({
      EmailList: Yup.array()
        .min(1, "Please input your email")
        .of(
          Yup.string()
            .email("Please input your valid email")
            .required("Please input your email")
        ),
    }),
    onSubmit: (value) => {
      handleInviteFriends(value.EmailList);
    },
  });

  const handleInviteFriends = (contacts) => {
    handleSendEmail(token, contacts).then(() => {
      if (close) {
        close();
      }
      resetForm();
    });
  };

  const handleCloseTag = (index) => {
    setValues((pre) => {
      const temp = { ...pre };
      const tempEmaillist = temp?.EmailList?.filter(
        (item, ind) => ind !== index
      );
      return { emailInput: "", EmailList: tempEmaillist };
    });
  };

  const addExtMailHandler = (data) => {
    let maildata = data.trim();
    let mailArr;
    if ((maildata.match(/,/g) || []).length) {
      mailArr = maildata.split(",");
    } else {
      mailArr = maildata.split(" ");
    }

    let newMail = [];
    // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    mailArr.forEach((val) => {
      if (val.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        newMail.push(val);
      }
    });
    if (newMail.length > 0) {
      setValues((pre) => ({
        EmailList: [...pre.EmailList, ...newMail],
        emailInput: "",
      }));
    }
  };

  useEffect(() => {
    inputref.current.focus();
  }, [values?.EmailList]);
  return (
    <div className={classes.centerSec}>
      <img
        className={classes.grpImg}
        alt="Group_img"
        src={require("../../Assets/Images/png/group_img.png")}
      />
      <div className={classes.mailBox}>
        <h1>Refer your friends & unlock Rawcaster Pro features</h1>
        <label>Invite your friends via email</label>
        <div className={classes.clearfix}></div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={() => {
            handleSubmit();
          }}
        >
          <Form.Item className="errormsg">
            {values.EmailList.map((ele, ind) => (
              <Tag
                key={ind}
                className={classes.tags}
                onClose={() => {
                  handleCloseTag(ind);
                }}
                closable
              >
                {ele}
              </Tag>
            ))}
            <Input
              className={classes.textBox}
              placeholder="Your friend’s email..."
              autoComplete="off"
              id="extmail"
              name="emailInput"
              ref={inputref}
              value={values.emailInput ? values.emailInput : ""}
              onChange={(e) => {
                setFieldValue("emailInput", e.target.value);
              }}
              onKeyPress={(e) => {
                const x = e.keyCode || e.which;
                // alert(x);
                if ((!e.shiftKey && x === 13) || x === 44 || x === 32) {
                  e.preventDefault();
                  addExtMailHandler(e.target.value);
                }
              }}
              onBlur={(e) => {
                addExtMailHandler(e.target.value);
              }}
            />
            {touched.EmailList && errors.EmailList && (
              <div className="ErrTxt">
                {errors.EmailList?.includes("Please input your valid email")
                  ? "Please input your valid email"
                  : errors.EmailList}
              </div>
            )}
          </Form.Item>
          <Form.Item>
            <Button block htmlType="submit" className={classes.submitbtn}>
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
