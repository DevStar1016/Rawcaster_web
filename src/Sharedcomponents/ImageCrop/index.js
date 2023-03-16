import { Button, Modal } from "antd";
import React, { useState, useEffect } from "react";
import classes from "./Imagecropper.module.css";
import AvatarEditor from "react-avatar-editor";

const ImageCrop = ({ show, Image }) => {
  return (
    <Modal open={show}>
      <div style={{ backgroundColor: "transparent" }}>
        <AvatarEditor
          ref={props.object.setEditorRef}
          image={props.object.selectedImage}
          width={props.width}
          height={props.height}
          border={50}
          color={[0, 0, 0, 0.8]} // RGBA
          scale={props.object.scale}
          rotate={props.object.rotation}
        />
        <div className={classes.actionBar}>
          <div className={classes.progressbar}>
            Scale
            <input
              name="scale"
              type="range"
              onChange={props.object.handleScale}
              min={1}
              max={2}
              step="0.01"
              defaultValue="1"
            />
          </div>
          <div className={classes.progressbar}>
            Rotate
            <input
              name="rotate"
              type="range"
              onChange={props.object.handleRotate}
              min={0}
              max={360}
              step="0.01"
              defaultValue="1"
            />
          </div>
        </div>
        <div className={classes.actionBtn}>
          <Button
            className={classes.crop}
            //loading={props.object.loading}
            onClick={props.object.onSubmit}
            // loading={true}
          >
            Crop Image
          </Button>
          <Button
            className={classes.cancel}
            onClick={() => {
              props.object.setSelectedImage(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCrop;
