import React from "react";
import { Form, InputGroup } from "react-bootstrap";

import { decodeHtml } from "../../Shared/Utility";
import classes from "./SearchResult.module.css";

const SearchResult = ({
  ConnectionData,
  displayData,
  list,
  setConnectionData,
  handleClose,
  type,
}) => {
  return (
    <div className={classes.filterSec}>
      {displayData.length !== 0 && (
        <div className={classes.displaySec}>
          {displayData?.map((ele) => (
            <div className={classes.nameitem}>
              <p>{ele?.listname} </p>{" "}
              <span
                class="material-symbols-outlined"
                onClick={() => {
                  handleClose(ele);
                  if (ConnectionData.length !== 0) {
                    setConnectionData((pre) => [ele, ...pre]);
                  } else {
                    setConnectionData([ele]);
                  }
                }}
              >
                close
              </span>
            </div>
          ))}
        </div>
      )}
      <InputGroup>
        <Form.Control
          className={classes.inSearch}
          placeholder="Enter Name to Search"
          aria-label="Enter  Name to Search"
          onChange={(e) => {
            let findResult = list.filter((ele) =>
              decodeHtml(
                type === "connection" ? ele.display_name : ele.group_name
              )
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
            );
            setConnectionData(findResult);
          }}
        />
      </InputGroup>
    </div>
  );
};

export default SearchResult;
