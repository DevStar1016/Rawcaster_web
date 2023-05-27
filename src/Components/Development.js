import React, { useEffect, useRef } from "react";
import Heading from "./ArtificialIntelligence/Heading";
import ChatContent from "./ArtificialIntelligence/Content";

const Development = () => {
  return (
    <div className="h-100 pt-5 mt-5 m-auto w-25">
      <Heading />
      <ChatContent />
    </div>
    // <audio
    //   ref={audioRef}
    //   src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    //   controls
    // />
  );
};

export default Development;
