import { Modal } from "antd";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import classes from "./Imagecrop.module.css";

const TO_RADIANS = Math.PI / 180;

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropModal = ({
  open,
  src,
  ratio,
  onSuccess,
  onFailure,
  validsize,
}) => {
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [confirmLoading, setconfirmLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  function onImageLoad(e) {
    if (ratio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, ratio));
    }
  }

  async function canvasPreview() {
    const ctx = previewCanvasRef.current.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const pixelRatio = window.devicePixelRatio;
    previewCanvasRef.current.width = Math.floor(
      completedCrop.width * scaleX * pixelRatio
    );
    previewCanvasRef.current.height = Math.floor(
      completedCrop.height * scaleY * pixelRatio
    );

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const rotateRads = rotate * TO_RADIANS;
    const centerX = imgRef.current.naturalWidth / 2;
    const centerY = imgRef.current.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin
    ctx.rotate(rotateRads);
    // 2) Scale the image
    ctx.scale(scale, scale);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      imgRef.current,
      0,
      0,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight,
      0,
      0,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight
    );

    ctx.restore();
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        toast.error("Failed to create blob");
      } else {
        if (validsize) {
          console.log("validateSize");
        } else {
          onSuccess(blob);
        }
        setconfirmLoading(false);
      }
    });
  }

  return (
    <Modal
      closable={false}
      open={open}
      confirmLoading={confirmLoading}
      onOk={() => {
        setconfirmLoading(true);
        canvasPreview();
      }}
      cancelButtonProps={{ disabled: confirmLoading }}
      onCancel={onFailure}
      maskClosable={false}
    >
      <div className={classes.main_container}>
        <div className={classes.crop_container}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ratio}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={src}
              crossOrigin="anonymous"
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      </div>
      <div className={classes.controls}>
        <div className={classes.controlSec}>
          <p>Scale</p>
          <input
            id="scale"
            type="range"
            value={scale}
            min={1}
            max={3}
            step={0.01}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setScale(Number(e.target.value));
            }}
            className={classes.zoom_range}
          />
        </div>
        <div className={classes.controlSec}>
          <p>Rotate</p>
          <input
            id="rotate"
            type="range"
            value={rotate}
            min={0}
            max={360}
            step={0.01}
            aria-labelledby="Rotate"
            onChange={(e) => {
              setRotate(e.target.value);
            }}
            className={classes.zoom_range}
          />
        </div>
      </div>
      <div>
        {completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              display: "none",
              border: "1px solid black",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </div>
    </Modal>
  );
};

export default ImageCropModal;
