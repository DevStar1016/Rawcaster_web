import React, { useRef, useState } from "react";
import ImageEditModal from "../Modal/ImageEditModal";

const Development = () => {
  const [FileData, setFileData] = useState();
  const [FinalResult, setFinalResult] = useState();

  return (
    <div className="d-flex justify-content-center align-items-center h-100 pt-5 mt-5">
      <input
        id="upload"
        type="file"
        accept="image/*"
        onChange={(event) => {
          setFileData(event.target.files[0]);
        }}
      />

      {FinalResult && <img src={FinalResult}></img>}
      {FileData && (
        <ImageEditModal
          open={FileData}
          initialFile={FileData}
          onSuccess={(url) => {
            setFinalResult(url);
            setFileData();
          }}
          onFailure={() => {
            setFileData();
          }}
        />
      )}
    </div>
  );
};

export default Development;
