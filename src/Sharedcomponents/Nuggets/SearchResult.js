import React from "react";
import { Form, InputGroup } from "react-bootstrap";

import { decodeHtml } from "../../Shared/Utility";
import classes from "./SearchResult.module.css";

const SearchResult = ({ setConnectionData, type, allList }) => {
  return (
    <div className={classes.filterSec}>
      <InputGroup>
        <Form.Control
          className={classes.inSearch}
          placeholder="Enter Name to Search"
          aria-label="Enter  Name to Search"
          onChange={(e) => {
            let findResult = allList.filter((ele) =>
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
