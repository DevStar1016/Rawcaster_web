/**
 * A modal component that allows users to edit images using the Toast UI Image Editor.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {object} initialFile - The initial file to be edited.
 * @param {function} onSuccess - Callback function to be called when editing is successful.
 * @param {function} onFailure - Callback function to be called when editing is cancelled or fails.
 * @returns A modal component with an image editor.
 */
import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
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
    var file = new File([blob], "edited_img.jpeg", {
      type: blob.type,
    });
    return { Bloburl: URL.createObjectURL(file), Blob: blob };
  }

  function getBase64(fileData) {
    const file = fileData;
    var reader = new FileReader();
    reader?.readAsDataURL(file);
    reader.onload = function () {
      setInitialValue(reader?.result);
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
