/**
 * A reusable component that displays a date input box with options for selecting
 * the month, day, and year.
 * @param {string} displayDate - The initial value of the date to display in the input box.
 * @param {function} onSelectDate - A callback function that is called when a date is selected.
 * @param {string} status - The status of the input box.
 * @returns A React component that renders a date input box.
 */
import { Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

var ValidAge = 13;
const DateInputBox = ({
  displayDate = "",
  onSelectDate,
  status = "",
  isDisabled = false,
  isError,
}) => {
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
          year: moment(displayDate).get("year"),
          month: moment(displayDate).get("month") + 1,
          day: moment(displayDate).get("date"),
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

  const getMonthsList = (year) => {
    let thisYear = new Date().getFullYear() - ValidAge;

    if (isValidData(year) && year === thisYear) {
      return moment.months().slice(0, new Date().getMonth() + 1);
    }
    return moment.months();
  };

  function getMonths(year = date.year) {
    let monthValue = getMonthsList(year).map((ele, index) => {
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
      let resultDate = moment(
        date.year + "-" + date.month + "-" + date.day,
        "YYYY-MM-DD"
      ).toDate();
      onSelectDate(resultDate);
    } else {
      onSelectDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const getStatus = (data) => {
    if (isValidData(data) || !isError) {
      return "";
    } else {
      return "error";
    }
  };

  return (
    <div className="dateinputBox">
      <div style={{ width: "42%" }}>
        <Select
          style={{ width: "100%" }}
          value={getMonth(date.month)}
          className="textBox"
          disabled={isDisabled}
          status={getStatus(date.month)}
          placeholder="Month"
          options={getMonths()}
          onSelect={(val, value) => {
            setDate((pre) => ({ ...pre, month: value.id }));
            let findData = getDays(value.id, date.year).find(
              (ele) => ele.value === date.day
            );
            if (!findData) {
              setDate((pre) => ({ ...pre, day: "" }));
            }
          }}
        />
      </div>
      <div style={{ width: "20%" }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Day"
          className="textBox"
          disabled={isDisabled}
          status={getStatus(date.day)}
          value={getDay()}
          options={getDays(date.month, date.year)}
          onSelect={(val, value) => {
            setDate((pre) => ({ ...pre, day: val }));
          }}
        />
      </div>
      <div style={{ width: "34%" }}>
        <Select
          style={{ width: "100%" }}
          className="textBox"
          options={getyears()}
          status={getStatus(date.year)}
          value={getYear(date.year)}
          disabled={isDisabled}
          placeholder="Year"
          onSelect={(value) => {
            setDate((pre) => ({ ...pre, year: value }));
            let findData = getMonths(value).find(
              (ele) => ele.id === date.month
            );

            if (!findData) {
              setDate((pre) => ({ ...pre, day: "" }));
            } else {
              let findMonth = getDays(findData.id, value).find(
                (ele) => ele.value === date.day
              );
              if (!findMonth) {
                setDate((pre) => ({ ...pre, month: "" }));
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default DateInputBox;
