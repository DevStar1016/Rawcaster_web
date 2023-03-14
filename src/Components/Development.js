import React, { useState } from "react";
import TagsChart from "../UIComponents/TagsChart";

let testObj = [
  {
    total_nuggets: 10,
    hours: 10,
  },
  {
    total_nuggets: 30,
    hours: 13,
  },
  {
    total_nuggets: 10,
    hours: 16,
  },
  {
    total_nuggets: 5,
    hours: 19,
  },
  {
    total_nuggets: 58,
    hours: 23,
  },
  {
    total_nuggets: 18,
    hours: 27,
  },
  {
    total_nuggets: 78,
    hours: 37,
  },
  {
    total_nuggets: 88,
    hours: 48,
  },
  {
    total_nuggets: 18,
    hours: 58,
  },
  {
    total_nuggets: 8,
    hours: 68,
  },
];

const Development = () => {
  return (
    <div className="w-25 mt-5 pt-5 m-auto">
      <TagsChart Data={testObj} />
    </div>
  );
};

export default Development;
