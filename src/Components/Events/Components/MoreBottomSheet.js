import { Drawer } from "antd";
import React from "react";
import classes from "./Menu.module.css";

const MoreBottomSheet = ({ open, onClose, children }) => {
  return (
    <Drawer
      placement="bottom"
      width={500}
      onClose={onClose}
      open={open}
      closable={false}
      maskClassName="onlyMob"
      className={`${classes.moreMenuSec} onlyMob`}
    >
      {children}
    </Drawer>
  );
};

export default MoreBottomSheet;
