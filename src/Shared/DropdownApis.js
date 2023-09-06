import {
  getEventLayoutService,
  getEventTypeService,
  getLanguageListService,
  getTimeZoneService,
  geteventMelodyService,
} from "../Services/ApiService";
import { JSONtoformdata } from "./Utility";

/**
 * Retrieves the event type based on the provided token.
 * @param {string} token - The token used to authenticate the request.
 * @returns {Promise<Array>} A promise that resolves to an array of event types.
 */
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

/**
 * Retrieves the list of time zones from the server.
 * @returns {Promise<Array>} - A promise that resolves to an array of time zone objects.
 */
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

/**
 * Retrieves the list of languages from the server.
 * @returns {Promise} A promise that resolves to an object containing the default language list and the read-out language list.
 * The default language list and read-out language list are arrays of objects with properties "label" and "value".
 * If an error occurs during the retrieval, the promise resolves to an object with empty default and read-out language lists.
 */
export const getlanguagelist = () => {
  let promise = new Promise((resolve, reject) => {
    getLanguageListService()
      .then((res) => {
        let filterData = res.data.language_list.map((ele) => {
          return { ...ele, label: ele.name, value: ele.name };
        });
        let readoutfilterData = res.data.read_out_language_list.map((ele) => {
          return { ...ele, label: ele.name, value: ele.name };
        });
        if (filterData.length !== 0) {
          resolve({ default: filterData, read_out: readoutfilterData });
        } else {
          resolve({ default: [], read_out: [] });
        }
      })
      .catch((err) => {
        resolve({ default: [], read_out: [] });
      });
  });
  return promise;
};

/**
 * Retrieves layout data for a given token.
 * @param {string} token - The token used to authenticate the request.
 * @returns {Promise} A promise that resolves to an array of layout objects, or null if there was an error.
 */
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

/**
 * Retrieves melody data using the provided token.
 * @param {string} token - The token used to authenticate the request.
 * @returns {Promise} A promise that resolves to an array of melody objects, or null if there was an error.
 */
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
          resolve(result);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {});
  });
  return promise;
};
