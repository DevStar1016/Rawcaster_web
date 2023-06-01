import React, { useEffect, useRef, useState } from "react";
import classes from "./Dev.module.css";
import styled, { keyframes } from "styled-components";

const Development = () => {
  const data = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
  ];

  return (
    <div className="h-100 pt-5 mt-5 m-auto w-25">
      <div className={classes.grid_container}>
        <div className={classes.container}>
          <h2>Container 1</h2>
          <div className={classes.overflow_content}>
            <ul>
              {data.map((item, index) => (
                <li key={index}>
                  {item}
                  <br />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.container}>
          <h2>Container 2</h2>
          <div className={classes.overflow_content}>
            <ul>
              {data.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Development;
