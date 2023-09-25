/**
 * Retrieves the label from the given data array that matches the specified value and ID type.
 * @param {Array} Data - The data array to search through.
 * @param {number} val - The value to match against.
 * @param {string} [idType="value"] - The ID type to use for matching.
 * @returns The label of the matching data element, or an empty string if no match is found.
 */
export const getValidDisplayData = (Data, val, idType = "value") => {
  let findValue = Data.find((ele) => parseInt(ele[idType]) === val);
  if (findValue) {
    return findValue.label;
  } else {
    return null;
  }
};

export const findValidDisplayAccentData = (Data, id = null) => {
  let findValue = Data.find((ele) => parseInt(ele.id) === parseInt(id));
  if (findValue) {
    return findValue.accents.map((ele) => ({
      ...ele,
      value: ele.accent,
      label: ele.accent,
    }));
  } else {
    return [];
  }
};
