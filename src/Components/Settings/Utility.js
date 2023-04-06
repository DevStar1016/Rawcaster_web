import { geteventMelodyService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";

export const getValidDisplayData = (Data, val, idType = "value") => {
  let findValue = Data.find((ele) => parseInt(ele[idType]) === val);
  if (findValue) {
    return findValue.label;
  } else {
    return "";
  }
};

export const getMelodyData = (token) => {
  let promise = new Promise((resolve, reject) => {
    let JSONData = {
      token: token,
    };
    console.log(JSONData);
    geteventMelodyService(JSONtoformdata(JSONData))
      .then((res) => {
        if (res.data.status === 1) {
          let result = res.data.melody.map((ele) => ({
            ...ele,
            value: ele.title,
            label: ele.title,
          }));
          resolve(result);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {});
  });
  return promise;
};
