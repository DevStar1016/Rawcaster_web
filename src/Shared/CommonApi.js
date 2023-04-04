import { getEventTypeService } from "../Services/ApiService";
import { JSONtoformdata } from "./Utility";

export const getEventType = (token) => {
  let promise = new Promise((resolve, reject) => {
    let eventData = {
      token: token,
    };
    getEventTypeService(JSONtoformdata(eventData))
      .then((res) => {
        let filterData = res.data.event_types.map((ele) => {
          return { ...ele, label: ele.type, value: ele.type };
        });
        if (filterData.length !== 0) {
          resolve(filterData);
        } else {
          resolve([]);
        }
      })
      .catch((err) => {
        resolve([]);
      });
  });
  return promise;
};
