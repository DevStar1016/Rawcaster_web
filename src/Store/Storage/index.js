/**
 * A collection of utility functions for managing data storage using cookies, local storage, and session storage.
 */
import { getCookie, setCookie } from "./Cookie";

export const setCookieData = (key, value, exdays = 30) => {
  return setCookie(key, value, exdays);
};

export const setLocalStorageData = (key, value) => {
  return window.localStorage.setItem(key, value);
};

export const setSessionStorageData = (key, value) => {
  return window.sessionStorage.setItem(key, value);
};

export const getCookieData = (key) => {
  return getCookie(key);
};

export const getLocalStorageData = (key) => {
  return window.localStorage.getItem(key);
};

export const getSessionStorageData = (key, value) => {
  return window.sessionStorage.getItem(key, value);
};

export const removeCookieData = (key) => {
  return setCookie(key, null, null);
};

export const removeLocalStorageData = (key, value) => {
  return window.localStorage.removeItem(key, value);
};

export const removeSessionStorageData = (key, value) => {
  return window.sessionStorage.removeItem(key, value);
};
