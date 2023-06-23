import { Button, Form, Input, Tag, message } from "antd";
import { inviteToRawcasterService } from "../../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { useState } from "react";
import classes from "./Referal.module.css";

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

export const EmailReferalContainer = ({ close }) => {
  const token = useAuthToken();
  const [selectedEmails, setselectedEmail] = useState([]);
  const [tempEmail, setTempEmail] = useState("");

  const handleInviteFriends = (contacts) => {
    handleSendEmail(token, contacts).then(() => {
      if (close) {
        close();
      }

      setselectedEmail([]);
      setTempEmail("");
    });
  };

  const handleCloseTag = (index) => {
    let tempSelected = [...selectedEmails];
    let filterTags = tempSelected.filter((ele, ind) => !(ind === index));
    setselectedEmail(filterTags);
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
      setTempEmail("");
      setselectedEmail((prev) => [...prev, ...newMail]);
    }
  };
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
          // initialValues={{ remember: true }}
          onFinish={() => handleInviteFriends(selectedEmails)}
        >
          <Form.Item
            name="email"
            className="errormsg"
            rules={[
              () => ({
                validator(rule, value) {
                  if (!value && selectedEmails.length !== 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Please input your email");
                },
              }),
            ]}
          >
            {selectedEmails.map((ele, ind) => (
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
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
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
