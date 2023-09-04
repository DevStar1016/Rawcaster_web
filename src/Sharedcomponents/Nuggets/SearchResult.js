/**
 * A React component that displays a search input field for filtering a list of items.
 * @param {Object} props - The component props.
 * @param {function} props.setConnectionData - A function to update the filtered list of items.
 * @param {string} props.type - The type of items being filtered (e.g., "connection" or "group").
 * @param {Array} props.allList - The complete list of items to filter.
 * @returns The rendered SearchResult component.
 */
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
