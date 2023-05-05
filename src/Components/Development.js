import React, { useRef, useState } from "react";
import ImageEditModal from "../Modal/ImageEditModal";
import ContentLayout from "./Notifications/ContentLayout";

const Development = () => {
  const [FileData, setFileData] = useState();
  const [FinalResult, setFinalResult] = useState();

  return (
    <div className="d-flex justify-content-center align-items-center h-100 pt-5 mt-5">
      <ContentLayout />
    </div>
  );
};

export default Development;
