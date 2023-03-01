import { Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
var localeData = require("dayjs/plugin/localeData");
dayjs.extend(localeData);
dayjs().localeData();

var ValidAge = 13;
const DateInputBox = ({ displayDate = "", onSelectDate, status = "" }) => {
  const [date, setDate] = useState({ year: "", month: "", day: "" });

  const isValidData = (value) => {
    if (value && value !== "") {
      return value;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (
      !isValidData(date.day) &&
      !isValidData(date.month) &&
      !isValidData(date.year)
    ) {
      if (isValidData(displayDate)) {
        setDate({
          year: dayjs(displayDate).get("year"),
          month: dayjs(displayDate).get("month") + 1,
          day: dayjs(displayDate).get("date"),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDate]);

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
    let thisYear = new Date().getFullYear() - ValidAge;
    const offset = thisYear - startingYear;

    let allYears = [];
    for (let x = 0; x <= offset; x++) {
      allYears.push({ value: thisYear - x, label: thisYear - x });
    }
    return allYears;
  }

  const getMonthsList = () => {
    let thisYear = new Date().getFullYear() - ValidAge;

    if (isValidData(date.year) && date.year === thisYear) {
      return dayjs.months().slice(0, new Date().getMonth() + 1);
    }
    return dayjs.months();
  };

  function getMonths() {
    let monthValue = getMonthsList().map((ele, index) => {
      return {
        id: index + 1,
        value: ele,
        label: ele,
      };
    });
    return monthValue;
  }

  function getDays(month, year) {
    let thisYear = new Date().getFullYear() - ValidAge;
    let thisMonth = new Date().getMonth() + 1;

    if (thisYear === year && thisMonth === month) {
      let monthValue = [...new Array(new Date().getDate())].map(
        (ele, index) => {
          return {
            value: index + 1,
            label: index + 1,
          };
        }
      );
      return monthValue;
    } else {
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
  }

  const getMonth = (month) => {
    let findMonth = getMonths().find((ele) => ele.id === month);
    if (findMonth) {
      return { value: findMonth.value, label: findMonth.value };
    } else {
      return null;
    }
  };

  const getDay = (value) => {
    const year = isValidData(date.year) ? date.year : new Date().getFullYear();
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

  useEffect(() => {
    if (
      isValidData(date.day) &&
      isValidData(date.month) &&
      isValidData(date.year)
    ) {
      if (getMonth(date.month)) {
        let resultDate = dayjs(
          date.year + "-" + getMonth(date.month).label + "-" + date.day
        ).toDate();
        console.log(resultDate);
        onSelectDate(resultDate);
      }
    } else {
      onSelectDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const getStatus = (data) => {
    if (isValidData(data)) {
      return "";
    } else {
      return status;
    }
  };
  return (
    <div className="dateinputBox">
      <div>
        <Select
          style={{ width: 120 }}
          value={getMonth(date.month)}
          className="textBox"
          status={getStatus(date.month)}
          placeholder="Month"
          options={getMonths()}
          onSelect={(val, value) => {
            setDate((pre) => ({ ...pre, month: value.id }));
            let findData = getDays(value.id, date.year).find(
              (ele) => ele.value === date.day
            );
            console.log(findData);
            if (!findData) {
              setDate((pre) => ({ ...pre, day: "" }));
            }
          }}
        />
      </div>
      <div>
        <Select
          style={{ width: 127 }}
          placeholder="Day"
          className="textBox"
          status={getStatus(date.day)}
          value={getDay()}
          options={getDays(date.month, date.year)}
          onSelect={(val, value) => {
            setDate((pre) => ({ ...pre, day: val }));
          }}
        />
      </div>
      <div>
        <Select
          style={{ width: 120 }}
          className="textBox"
          options={getyears()}
          status={getStatus(date.year)}
          value={getYear(date.year)}
          placeholder="Year"
          onSelect={(value) => {
            setDate((pre) => ({ ...pre, year: value }));
            if (getStatus(date.month) === "") {
              setDate((pre) => ({ ...pre, month: "" }));
            }
          }}
        />
      </div>
    </div>
  );
};

export default DateInputBox;
