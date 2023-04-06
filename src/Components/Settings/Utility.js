export const getValidDisplayData = (Data, val, idType = "value") => {
  let findValue = Data.find((ele) => parseInt(ele[idType]) === val);
  if (findValue) {
    return findValue.label;
  } else {
    return "";
  }
};
