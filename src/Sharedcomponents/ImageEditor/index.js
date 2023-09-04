/**
 * A React component that renders an image editor using the Toast UI Image Editor library.
 * @returns The rendered image editor component.
 */
import React from "react";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import classes from "./Imageeditor.module.css";

const ImageEdit = () => {
  const editorRef = React.createRef();
  return (
    <>
      <div className={classes.mainContainer}>
        <div className={classes.PreviewContainer}>
          <ImageEditor
            ref={editorRef}
            includeUI={{
              menu: ["shape", "filter"],
              initMenu: "filter",
              uiSize: {
                width: "1000px",
                height: "700px",
              },
              menuBarPosition: "bottom",
            }}
            cssMaxHeight={500}
            cssMaxWidth={700}
            selectionStyle={{
              cornerSize: 20,
              rotatingPointOffset: 70,
            }}
            usageStatistics={false}
          />
          <input
            type="file"
            onChange={(e) => {
              const editorInstance = editorRef.current.getInstance();
              editorInstance
                .loadImageFromFile(e.target.files[0])
                .then((result) => {});
            }}
          />
        </div>
        <div className={classes.EditSec}>
          <button
            onClick={() => {
              const editorInstance = editorRef.current.getInstance();
              editorInstance.flipX();
            }}
          >
            flip
          </button>
          <button
            onClick={() => {
              const editorInstance = editorRef.current.getInstance();
              editorInstance.crop(editorInstance.getCropzoneRect());
            }}
          >
            Crop
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageEdit;
