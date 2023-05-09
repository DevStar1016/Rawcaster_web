import { message } from "antd";
import { inviteToRawcasterService } from "../../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { toast } from "react-hot-toast";

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
