import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";

const ImageEditModal = ({ open, initialFile, onSuccess, onFailure }) => {
  const editorRef = useRef();
  const [InitialValue, setInitialValue] = useState();
  function b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: "image/jpeg" });
    return { Bloburl: URL.createObjectURL(blob), Blob: blob };
  }

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setInitialValue(reader.result);
    };
    reader.onerror = function (error) {
      setInitialValue("");
    };
  }

  useEffect(() => {
    if (initialFile) {
      getBase64(initialFile);
    }
  }, [initialFile]);
  return (
    <Modal
      centered
      open={open}
      onOk={() => {
        const instance = editorRef.current.getInstance();
        let dataURL = instance.toDataURL();
        onSuccess(b64toBlob(dataURL));
      }}
      onCancel={onFailure}
      width={1050}
      className="imageEditorModal"
    >
      <div className="pb-2">
        {InitialValue && (
          <ImageEditor
            ref={editorRef}
            includeUI={{
              loadImage: {
                path: InitialValue,
                name: "Blank",
              },
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
            usageStatistics={true}
          />
        )}
      </div>
    </Modal>
  );
};

export default ImageEditModal;
