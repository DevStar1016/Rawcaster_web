import { Button } from "antd";
import React from "react";

export default function TypeDevelopment() {
  const convertToValidHours = () => {
    let inputStr = "07:05:45PM";
    const ALPHA_REGEX = /(\d+)([a-zA-Z]+)/;
    const splitVal = inputStr.split(":");
    let findAMORPM;
    splitVal.forEach((inputString) => {
      const match = inputString.match(ALPHA_REGEX);
      if (match) {
        const alphabeticPart = match[2];
        findAMORPM = alphabeticPart;
      }
    });
    const filterValidArray = splitVal.map((ele) => {
      const match = ele.match(ALPHA_REGEX);

      return match ? match[1] : ele;
    });
    const date = new Date();
    if (filterValidArray) {
      //@ts-ignore
      const date = new Date();
    }

    // const match: any = ele.match(/(\d+)([a-zA-Z]+)/);
    // const alphabeticPart = match?.[2];
    // console.log(findAMPM);
  };
  return <Button onClick={convertToValidHours}>Confirm</Button>;
}
