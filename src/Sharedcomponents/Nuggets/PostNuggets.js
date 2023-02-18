import React, { useState } from "react";
import Postmodal from "../../Modal/Postmodal";

const PostNuggets = () => {
  const [postModalShow, setpostModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setpostModalShow(true);
        }}
      >
        PostNuggets
      </div>
      <Postmodal
        visible={postModalShow}
        onClose={() => {
          console.log("tstysty");
          setpostModalShow(false);
        }}
      />
    </>
  );
};

export default PostNuggets;
