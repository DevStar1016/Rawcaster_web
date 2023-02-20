import { Modal } from "antd";
import React from "react";
import classes from "./Modal.module.css";
import sampleuser from "../Assets/Images/svg/userImg.svg";


const Postmodal = ({ visible, onClose }) => {
  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.nuggetModal}
        onClick={() => {
          onClose();
        }}
      >
      <h1>Post Nugget</h1>
      
      <div className={classes.topProsec}>
        <img className={classes.imguser} src={sampleuser} />
        <p className={classes.name}>Daiyan Khan</p>
        <p className={classes.onlymeBtn}><span class="material-icons">lock</span> Only me <span class="material-icons">arrow_drop_down</span></p>
      </div>
        
      </div>
    </Modal>
  );
};

export default Postmodal;
