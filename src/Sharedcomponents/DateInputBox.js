import { Select } from "antd";
import React, { useState } from "react";

const DateInputBox = () => {
  const [date, setDate] = useState({ year: "", month: "", day: "" });

  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function getDaysInMonthByYear(month, year) {
    let date = new Date(year, month, 0);
    let DayValue = [...new Array(date.getDate())].map((ele, index) => {
      return {
        value: index + 1,
        label: index + 1,
      };
    });

    return DayValue;
  }

  function getyears(startingYear = 1900) {
    const offset = new Date().getFullYear() - startingYear;

    let thisYear = new Date().getFullYear();
    let allYears = [];
    for (let x = 0; x <= offset; x++) {
      allYears.push({ value: thisYear - x, label: thisYear - x });
    }
    return allYears;
  }

  function getMonths() {
    let monthValue = monthNames.map((ele, index) => {
      return {
        id: index + 1,
        value: ele,
        label: ele,
      };
    });
    return monthValue;
  }

  const isValidData = (value) => {
    if (value && value !== "") {
      return value;
    } else {
      return false;
    }
  };

  function getDays(month, year) {
    if (isValidData(month) && isValidData(year)) {
      return getDaysInMonthByYear(month, year);
    } else if (isValidData(month)) {
      return getDaysInMonthByYear(month, new Date().getFullYear());
    } else {
      let monthValue = [...new Array(31)].map((ele, index) => {
        return {
          value: index + 1,
          label: index + 1,
        };
      });
      return monthValue;
    }
  }

  const getMonth = () => {
    let findMonth = getMonths().find((ele) => ele.id === date.month);
    if (findMonth) {
      return { value: findMonth.value, label: findMonth.value };
    } else {
      return null;
    }
  };

  const getDay = (value) => {
    const year = isValidData(date.year) ? date.year : new Date().getFullYear();
    console.log(getDays(value, year), "===>getDays(value, year)", value, year);
    let findDay = getDays(value, year).find(
      (ele) => ele.value === parseInt(date.day)
    );

    if (findDay) {
      return { value: findDay.value, label: findDay.value };
    } else {
      return null;
    }
  };

  const getYear = (year) => {
    if (isValidData(year)) {
      return { value: year, label: year };
    } else {
      return null;
    }
  };

  const handleValue = () => {
    let final = new Date(date.year, date.month, date.year);
    console.log(final);
  };

  return (
    <div className="test">
      <Select
        style={{ width: 120 }}
        value={getMonth()}
        placeholder="Month"
        options={getMonths()}
        onSelect={(val, value) => {
          setDate((pre) => ({ ...pre, month: value.id }));
          if (getDay(value.id) === null) {
            setDate((pre) => ({ ...pre, day: "" }));
          }
          handleValue();
        }}
      />
      <Select
        style={{ width: 120 }}
        placeholder="Day"
        value={getDay()}
        options={getDays(date.month, date.year)}
        onSelect={(val, value) => {
          setDate((pre) => ({ ...pre, day: val }));
          handleValue();
        }}
      />
      <Select
        style={{ width: 120 }}
        options={getyears().reverse()}
        value={getYear(date.year)}
        placeholder="Year"
        onSelect={(value) => {
          setDate((pre) => ({ ...pre, year: value }));
          handleValue();
        }}
      />
    </div>
  );
};

export default DateInputBox;
