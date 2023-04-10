import {
  getEventLayoutService,
  getEventTypeService,
  getLanguageListService,
  getTimeZoneService,
  geteventMelodyService,
} from "../Services/ApiService";
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

export const getTimeZone = () => {
  let promise = new Promise((resolve, reject) => {
    getTimeZoneService()
      .then((res) => {
        let filterData = res.data.timezone_list.map((ele) => {
          return { ...ele, label: ele.name, value: ele.name };
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

export const getlanguagelist = () => {
  let promise = new Promise((resolve, reject) => {
    getLanguageListService()
      .then((res) => {
        let filterData = res.data.language_list.map((ele) => {
          return { ...ele, label: ele.name, value: ele.name };
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

export const getLayoutData = (token) => {
  let promise = new Promise((resolve, reject) => {
    let JSONData = {
      token: token,
    };
    getEventLayoutService(JSONtoformdata(JSONData))
      .then((res) => {
        if (res.data.status === 1) {
          let result = res.data.event_layouts.map((ele) => ({
            ...ele,
            value: ele.name,
            label: ele.name,
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

export const getMelodyData = (token) => {
  let promise = new Promise((resolve, reject) => {
    let JSONData = {
      token: token,
    };
    geteventMelodyService(JSONtoformdata(JSONData))
      .then((res) => {
        if (res.data.status === 1) {
          let result = res.data.melody.map((ele) => ({
            ...ele,
            value: ele.title,
            label: ele.title,
          }));
          console.log(result, "==>result");
          resolve(result);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {});
  });
  return promise;
};
